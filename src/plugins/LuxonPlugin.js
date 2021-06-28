import { DateTime, Settings } from 'luxon';
import Store from '@/store';

export default class LuxonPlugin {
  constructor() {
    if (!(this instanceof LuxonPlugin)) {
      return new LuxonPlugin();
    }

    this.defaultTz = DateTime.local().zoneName;
    Settings.defaultZoneName = this.defaultTz;
  }

  setTimeZone(timezone) {
    this.defaultTz = timezone;
  }

  setTimeLocale(code) {
    Settings.defaultLocale = code;
  }

  getNow() {
    return DateTime.local();
  }

  getFromISO(date) {
    return DateTime.fromISO(date);
  }

  getTimeObject(param) {
    try {
      let date = {};

      if (!param) {
        throw {
          message: 'invalid_param',
        };
      }

      if (param === 'now') {
        return this.getNow();
      }

      if (typeof param === 'object') {
        if (param.isLuxonDateTime) {
          return param;
        } else if (param.fmt && param.text) {
          date = DateTime.fromFormat(param.text, param.fmt);
        } else {
          throw {
            message: 'invalid_luxon_object',
          };
        }
      }

      if (typeof param === 'string' && param.includes('T')) {
        date = DateTime.fromISO(param);
      }

      if (!Number.isNaN(Number(param))) {
        date = DateTime.fromMillis(Number(param));
      }

      return date;
    } catch (e) {
      return this.getNow();
    }
  }

  extractDataByMatrix(data) {
    const result = {};
    const rawValue = data.values.milliseconds;
    const supportMatrix = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

    let total = rawValue;

    for (const matrix of supportMatrix) {
      if (matrix === 'milliseconds') {
        continue;
      }

      const targetToMilli = data.matrix[matrix].milliseconds;

      if (targetToMilli > total) {
        result[matrix] = 0;
        continue;
      }

      result[matrix] = parseInt(total / targetToMilli);
      total %= targetToMilli;
    }

    return result;
  }

  getDiff(date1, date2) {
    let date1Obj = this.getTimeObject(date1);
    let date2Obj = this.getTimeObject(date2);

    try {
      const diff = date1Obj.diff(date2Obj);

      return {
        success: true,
        info: {
          ...this.extractDataByMatrix(diff),
          milliseconds: diff.values.milliseconds,
        },
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  getProgress(start, end) {
    const startDate = this.getTimeObject(start);
    const endDate = this.getTimeObject(end);
    const duration = this.getDiff(startDate, endDate);

    if (!duration.success) {
      return duration;
    }

    const progress = endDate.diffNow();

    return 100 - (progress.milliseconds / duration.info.milliseconds) * 100;
  }

  formatDate(date, type, opts = {}) {
    if (!date) {
      return '';
    }

    if (date === 'now') {
      date = this.getNow().ts;
    }

    let dateToNum = Number(date);

    if (typeof date !== 'object' && !Number.isNaN(dateToNum)) {
      if (opts.fromUnix) {
        dateToNum *= 1000;
      }

      date = DateTime.fromMillis(dateToNum);
    }

    if (typeof date === 'string' && date.includes('T')) {
      date = DateTime.fromISO(date);
    }

    if (typeof date !== 'object' || !date.isLuxonDateTime) {
      return '';
    }

    let result = '';
    let vm = Store.$app;
    let $t = vm.$t.bind(vm);

    let hourToShort = '시간';
    let minToShort = '분';
    let secToShort = '초';

    switch (type) {
      case 'md': {
        result = date.toFormat('MM.dd');
        break;
      }
      case 'm/d': {
        result = date.toFormat('MM/dd');
        break;
      }
      case 'hm': {
        result = date.toFormat('HH:mm');
        break;
      }
      case 'hms': {
        result = date.toFormat('HH:mm:ss');
        break;
      }
      case 'ymd': {
        result = date.toFormat('yy. MM. dd');
        break;
      }
      case 'ymd-yyyy': {
        result = date.toFormat('yyyy. MM. dd');
        break;
      }
      case 'ymd-hms': {
        result = date.toFormat('yyyy-MM-dd HH:mm:ss');
        result = result.replace(' ', '&nbsp&nbsp');
        break;
      }
      case 'ymd.hms': {
        result = date.toFormat('yyyy.MM.dd HH:mm:ss');
        result = result.replace(' ', '&nbsp&nbsp');
        break;
      }
      case 'ymd/hms': {
        result = date.toFormat('yyyy/MM/dd HH:mm:ss');
        break;
      }
      case 'ymd.short': {
        result = date.toFormat('yy/MM/dd');
        break;
      }
      case 'ymd/hms.short': {
        result = date.toFormat('yy/MM/dd HH:mm:ss');
        break;
      }
      case 'ymd-hms.short': {
        result = date.toFormat('yy-MM-dd HH:mm:ss');
        break;
      }
      case 'ymd.hms.short': {
        result = date.toFormat('yy.MM.dd HH:mm:ss');
        break;
      }
      case 'ymd.hm.short': {
        const { year, month, day, hour, minute } = date.c;
        result = `${String(year).slice(2)}.${month.setPadding(2)}.${day.setPadding(2)} ${hour.setPadding(
          2,
        )}:${minute.setPadding(2)}`;

        break;
      }
      case 'unix': {
        result = Number(date.toFormat('X'));
        break;
      }
      case 'y-m-d': {
        result = date.toFormat('yyyy-MM-dd');
        break;
      }
      case 'y/m/d': {
        result = date.toFormat('yyyy/MM/dd');
        break;
      }
      case 'y.m.d': {
        result = date.toFormat('yyyy.MM.dd');
        break;
      }
      case 'h_m_s': {
        result = date.toFormat('HH : mm : ss');
        break;
      }
      case 'hms-lang':
      case 'hms-lang-strong': {
        let isEN = vm.$i18n.locale === 'en';
        let secondSep = '',
          minuteSep = ' : ',
          hourSep = ' : ';

        if (!isEN || opts.onTime === -1) {
          secondSep = secToShort;
          minuteSep = minToShort + ' ';
          hourSep = hourToShort[0] + ' ';
        }

        if (type === 'hms-lang') {
          result = `${Number(date.toFormat('HH')).setPadding(2)}${hourSep}${date
            .get('minute')
            .setPadding(2)}${minuteSep}${date.get('second').setPadding(2)}${secondSep}`;
        }

        if (type === 'hms-lang-strong') {
          result = `
            ${Number(date.toFormat('HH')).setPadding(2)}<strong>${hourSep}</strong> 
            ${date.get('minute').setPadding(2)}<strong>${minuteSep}</strong> 
            ${date.get('second').setPadding(2)}<strong>${secondSep}</strong>
          `;
        }

        break;
      }
      case 'hms-lang-until': {
        result = `
          <strong>${date.get('hour').setPadding(2)}</strong>${hourToShort[1]}
          <strong>${date.get('minute').setPadding(2)}</strong>${minToShort}
          <strong>${date.get('second').setPadding(2)}</strong>${secToShort}
        `;

        break;
      }
      default: {
        result = type ? date.toFormat(type) : Number(date.toFormat('x'));
        break;
      }
    }

    return result;
  }

  getFromNow(time) {
    const _time = this.getTimeObject(time);

    return _time.toRelative ? _time.toRelative() : '-';
  }
}
