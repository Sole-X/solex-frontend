import BN from 'bignumber.js';

BN.config({
  EXPONENTIAL_AT: [-100, 100],
});

export default class BigNumberUtil {
  constructor() {
    if (!(this instanceof BigNumberUtil)) {
      return new BigNumberUtil();
    }

    this.methodList = ['toBN', 'addBN', 'subBN', 'mulBN', 'modBN', 'divBN', 'toMinUnit', 'toMaxUnit'];
  }

  toBN(number) {
    const result = new BN(number);

    // 초기화 시에 메소드 리스트 추가하기
    if (this.methodList) {
      for (const method of this.methodList) {
        result[method] = this[method];
      }

      result.methodList = this.methodList;
    }

    return result;
  }

  addBN(num1, num2) {
    if (!BN.isBigNumber(num1)) {
      num1 = this.toBN(num1);
    }

    if (num2 !== undefined) {
      num2 = this.toBN(num2);
    } else {
      num2 = num1;
      num1 = this;
    }

    return this.toBN(num1.plus(num2));
  }

  subBN(num1, num2) {
    if (!BN.isBigNumber(num1)) {
      num1 = this.toBN(num1);
    }

    if (num2 !== undefined) {
      num2 = this.toBN(num2);
    } else {
      num2 = num1;
      num1 = this;
    }

    return this.toBN(num1.minus(num2));
  }

  mulBN(num1, num2) {
    if (!BN.isBigNumber(num1)) {
      num1 = this.toBN(num1);
    }

    if (num2 !== undefined) {
      num2 = this.toBN(num2);
    } else {
      num2 = num1;
      num1 = this;
    }

    return this.toBN(num1.multipliedBy(num2));
  }

  divBN(num1, num2) {
    // TODO : over 18
    if (!BN.isBigNumber(num1)) {
      num1 = this.toBN(num1);
    }

    if (num2 !== undefined) {
      num2 = this.toBN(num2);
    } else {
      num2 = num1;
      num1 = this;
    }

    if (num1.toString() === '0' || num2.toString() === '0') {
      return this.toBN('0');
    }

    return this.toBN(num1.dividedBy(num2).toPrecision(18));
  }

  modBN(num1, num2) {
    if (!BN.isBigNumber(num1)) {
      num1 = this.toBN(num1);
    }

    if (num2 !== undefined) {
      num2 = this.toBN(num2);
    } else {
      num2 = num1;
      num1 = this;
    }

    return this.toBN(num1.mod(num2));
  }

  // 자연수 > 컨트랙트 상 단위
  toMinUnit(v, d) {
    if (v !== 0 && !v) {
      return '0';
    }

    if (d === undefined) {
      d = v;
      v = this;
    }

    if (!BN.isBigNumber(v)) {
      v = this.toBN(v);
    }

    if (d !== 0) {
      d = this.toBN(10).pow(d);
    }

    return this.toBN(v.multipliedBy(d)).toString();
  }

  // 컨트랙트 상 단위 > 자연수
  toMaxUnit(v, d, p = 6) {
    if (v !== 0 && !v) {
      return '0';
    }

    if (d === undefined) {
      d = v;
      v = this;
    }

    if (!BN.isBigNumber(v)) {
      v = this.toBN(v);
    }

    if (d !== 0) {
      d = this.toBN(10).pow(d);
    }

    return this.toBN(v.dividedBy(d)).toString().dprec(p);
  }
}
