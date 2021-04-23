import crypto from 'crypto'

require('@/utils/DecimalCalc') // 데시멀 연산

String.prototype.toCamelCase = function() {
  return /[a-z]/.test(this.trim()[0]) ? this.trim()[0].toUpperCase() + this.slice(1) : this;
}

Number.prototype.setPadding = function(padding) {
  let v = '';
  let n = this;

  // 제대로 된 정수값인 지 체크
  if(Number.isNaN(this) || !Number.isFinite(this)) {
    n = 0;
  }

  let len = String(n).length;

  if(len < padding) {
    while(v.length < padding - len) {
      v += '0';
    }

    return v + n;
  } else {
    return n;
  }
}

/** 위는 커스텀 프로토타입 **/
/** 아래는 유용한 글로벌 변수 **/

// 랜덤 정수 반환
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 랜덤 Hex 색상값 리턴
export const getRandomColorToHex = (min = 0, max = 15) => {
  let result = '#';

  for(let i = 0; i < 6; i++) {
    result += getRandomInt(min, max).toString(16);
  }

  return result;
};

// 파라미터로 들어온 스트링을 md5 알고리즘으로 해시화하여 리턴
export const md5 = e => {
  return crypto.createHash('md5').update(e).digest('hex');
};

// HTTP 헤더 파싱
export const parseHttpHeaders = httpHeaders => {
  return _.reduce(
    _.filter(
      _.map(
        httpHeaders.split('\n'),
        x => x.split(/: */, 2)
      ),
      y => y[0]
    ),
    (ac, z) => {
      ac[z[0]] = z[1]
      return ac
    },
    {

    }
  )
};

// 라이브에서는 보이지 않는 console.log
export const Log = (...args) => {
  if(_buildType !== 'live') {
    console.log(...args)
  }
};

// 대소문자 포함 같은 스트링인지 체크
export const isSameStr = (a, b) => {
  if(typeof a !== 'string' || typeof b !== 'string') {
    return false
  }

  return (
    a === b
    || a.toLowerCase() === b.toLowerCase()
    || a.toUpperCase() === b.toUpperCase()
  )
};

// 파라미터로 날아온 문자열이 한글인 지 체크
export const isKoreanCharacter = ch => {
  let result = false;
  let c = ch.charCodeAt(0);

  if(0x1100 <= c && c <= 0x11FF) {
    result = true;
  }

  if(0x3130 <= c && c <= 0x318F) {
    result = true;
  }

  if(0xAC00 <= c && c <= 0xD7A3) {
    result = true;
  }

  return result;
};

export const addComma = num => {
  if(!num) return '0';

  const commaRegex = /\B(?=(\d{3})+(?!\d))/g;
  const parts = String(num).split('.');

  return parts[0].replace(commaRegex, ',') + (parts[1] ? '.' + parts[1] : '');
};

export const getOnTime = (timestamp, isUnix = true) => {
  const hour = isUnix ? 60 : 60 * 1000;

  timestamp = Number(timestamp);
  return timestamp - ( timestamp % hour );
};

export const checkIsZero = val => {
  return parseFloat(val) === 0 ? '0' : val;
};

export const checkFiatDec = (val, prec) => {
  return parseFloat(val) <= 10 ? String(val).dprec(6) : val.dprec(prec)
};

// 같은 요소가 한글일때와 영어일때를 구분하여 스타일 지정해줄 때 써먹을 함수, v-responsive-text 디렉티브 참조
export const handleResponsiveText = el => {
  let $target = $(el);
  let value = el.tagName === 'INPUT' ? el.value : el.innerText;

  if(isKoreanCharacter(value.trim())) {
    $target.addClass('ko-text');
  } else {
    $target.removeClass('ko-text');
  }
};

export const _checkIsMobile = () => {
  let os = platform.os.family;
  return isSameStr(os, 'IOS') || isSameStr(os, 'ANDROID');
};

// 선택된 언어에 따라 토큰 명 가져오기
export const getNameByLang = (obj, lang) => {
  return obj[lang] || '';
};

export const isIOS = () => {
  let os = platform.os.family;

  try {
    os = os.toUpperCase();
  } catch(e) {

  }

  return os === 'IOS';
};

export const isAndroid = () => {
  let os = platform.os.family

  try {
    os = os.toUpperCase()
  } catch(e) {

  }

  return os === 'ANDROID'
};

export const getValidPrec = (val, max = 4) => {
  let result = 0
  let underZero = val.split('.')[1]

  for(let i = 0; i < underZero.length; i++) {
    if(parseFloat(underZero[i]) !== 0) {
      result = i + 1
      break
    }
  }

  return Math.min(result, max)
};

export const isValidNumber = num => {
  let numVal = Number(num)
  return num && Number.isInteger(numVal) && numVal > 0
};

// 토큰 Decimal이 표준 Decimal(8)보다 작을 경우에 대비
export const checkDecimal = (val, decimal) => {
  return val.dprec(Math.min(8, decimal))
};

export const _buildType = process.env.VUE_APP_PROFILE;

// 에어비앤비 스타일 가이드에 따라.. 크게 중요치는 않은듯?
export const ObjectHasProperty = Object.prototype.hasOwnProperty;

export const toDefaultPrec = (value, o) => {
  return value.dprec(o.decimal).dprec(process.env.VUE_APP_DEC_POINT || 8)
};

export const getBrowser = () => {
  return require('detect-browser').detect();
};

export const enumToString = (enumValue, type = 1) => {
  // enumKey.a 란 값이 있다 했을 때 type이 1이면 a, 0이면 enumKey가 리턴됩니다.
  return enumValue.indexOf('.') !== -1 ? enumValue.split('.')[type] : enumValue;
};

export const singleQuoteJsonParse = json => {
  try {
    return JSON.parse(json.replace(/\'/g, '"'));
  } catch(e) {
    throw e;
  }
};

Math.easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if(t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
