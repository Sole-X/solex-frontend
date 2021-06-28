function dton(v, w) {
  v = v.dclean();
  let vt = v.indexOf('.');
  if (vt === -1) vt = v.length;
  let vd = v.substr(vt + 1).length;

  w = w.dclean();
  let wt = w.indexOf('.');
  if (wt === -1) wt = w.length;
  let wd = w.substr(wt + 1).length;

  let d = vd > wd ? vd : wd;
  return { d: d, v: v.dmove(d), w: w.dmove(d) };
}

String.prototype.dclean = function () {
  // 불필요한 0 제거
  const v = String(this);

  let dot = v.indexOf('.');
  if (dot === -1) dot = v.length;
  let num = v.substr(0, dot),
    dec = v.substr(dot + 1);

  num = num.replace(/^0+/, '');

  if (num.length === 0) {
    num = '0';
  }

  dec = dec.replace(/0+$/, '');

  if (dec.length > 0) {
    num += '.' + dec;
  }

  return num;
};

String.prototype.dprec = function (d, force = false) {
  // 강제로 소수점 이하 d자리 출력
  if (!force && parseFloat(this) === 0) {
    return '0';
  }

  const v = String(this).dclean();

  let dot = v.indexOf('.');
  if (dot === -1) dot = v.length;
  let num = v.substr(0, dot),
    dec = v.substr(dot + 1);

  if (dec.length > d) {
    dec = dec.substr(0, d);
  } else {
    dec += '0'.repeat(d - dec.length);
  }

  if (d > 0) {
    num += '.' + dec;
  }

  return num;
};

String.prototype.dmove = function (d) {
  // 10^d 곱함
  let v = String(this).dclean();
  const isMinus = v.charAt(0) === '-';

  if (isMinus) {
    v = v.slice(1, v.length);
  }

  let dot = v.indexOf('.');
  if (dot === -1) dot = v.length;
  let num = v.substr(0, dot),
    dec = v.substr(dot + 1);

  num += dec;
  d -= dec.length;

  const l = num.length;

  if (d > 0) {
    num += '0'.repeat(d);
  } else if (d < 0) {
    d = -d;

    if (d < l) {
      num = num.substr(0, l - d) + '.' + num.substr(l - d);
    } else {
      num = '0.' + '0'.repeat(d - l) + num;
    }
  }

  let result = num.dclean();
  return isMinus ? `-${result}` : result;
};

String.prototype.dcomp = function (w) {
  let o = dton(String(this), w);
  let v = o.v;
  w = o.w;
  let tf = parseFloat(this);
  let wf = parseFloat(w);

  if (tf >= 0 && wf < 0) {
    return 1;
  }

  if (tf < 0 && wf >= 0) {
    return -1;
  }

  let vl = v.length,
    wl = w.length;
  return vl > wl ? 1 : vl < wl ? -1 : v > w ? 1 : v < w ? -1 : 0;
};

String.prototype.dadd = function (w) {
  let wf = parseFloat(w);
  let tf = parseFloat(this);
  let ws = String(w.replace('-', ''));
  let ts = String(this.replace('-', ''));

  // 음수 + 음수
  if (tf < 0 && wf < 0) {
    return '-' + ws.dadd(ts);
  }

  if (tf < 0 || wf < 0) {
    let wabs = Math.abs(w);
    let tabs = Math.abs(this);
    let comp = ts.dcomp(ws);

    if (comp === 0) {
      return '0.00000000';
    } else if (comp === 1) {
      return (tf < 0 ? '-' : '') + ts.dsub(ws);
    } else if (comp === -1) {
      return (wf < 0 && wabs > tabs ? '-' : '') + ws.dsub(ts);
    }
  }

  const o = dton(ts, ws);

  let d = o.d,
    v = o.v;
  w = o.w;
  let vl = v.length,
    wl = w.length,
    l = vl > wl ? vl : wl;

  v = v.split('').reverse().join('');
  w = w.split('').reverse().join('');

  let res = [];
  let x = 0,
    i = 0,
    vi = 0,
    wi = 0,
    r = 0;

  for (i; i < l; i++) {
    vi = i < vl ? v.charCodeAt(i) - 48 : 0;
    wi = i < wl ? w.charCodeAt(i) - 48 : 0;

    r = vi + wi + x;
    if (r > 9) {
      x = 1;
      r -= 10;
    } else x = 0;

    res.push(r);
  }

  if (x > 0) {
    res.push(x);
  }

  return res.reverse().join('').dmove(-d);
};

String.prototype.dsub = function (w) {
  let wf = parseFloat(w);
  let tf = parseFloat(this);
  let ws = String(w.replace('-', ''));
  let ts = String(this.replace('-', ''));

  if (tf === wf) {
    return '0.00000000';
  }

  if (tf < 0 || wf < 0) {
    const comp = ts.dcomp(ws);

    if (tf < 0 && wf > 0) {
      return this.dadd('-' + w);
    }

    if (comp === -1 && tf > 0) {
      return ts.dadd(ws);
    }

    if (comp === -1 && tf < 0) {
      return ws.dsub(ts);
    }
  }

  const o = dton(ts, ws);
  const smaller = tf < wf;

  let d = o.d,
    v = o.v;
  w = o.w;

  if (v.dcomp(w) < 0) {
    let t = v;
    v = w;
    w = t;
  }

  let vl = v.length,
    wl = w.length,
    l = vl > wl ? vl : wl;

  v = v.split('').reverse().join('');
  w = w.split('').reverse().join('');

  let res = [];
  let x = 0,
    vi = 0,
    wi = 0,
    i = 0,
    r = 0;

  for (i; i < l; i++) {
    vi = i < vl ? v.charCodeAt(i) - 48 : 0;
    wi = i < wl ? w.charCodeAt(i) - 48 : 0;

    r = vi - wi + x;

    if (r < 0) {
      x = -1;
      r += 10;
    } else {
      x = 0;
    }

    res.push(r);
  }

  res = res.reverse().join('').dmove(-d);
  return smaller && res.indexOf('-') === -1 ? '-' + res : res;
};

String.prototype.dmul = function (w, prec = 8) {
  w = String(w);

  const t = String(this);
  const floatThis = parseFloat(this);
  const floatTarget = parseFloat(w);

  if (floatThis !== 1 && floatTarget === 1) {
    return t.dprec(prec);
  }

  if (floatThis === 1 && floatTarget !== 1) {
    return w.dprec(prec);
  }

  if (floatThis === 0 || floatTarget === 0) {
    return '0'.dprec(prec);
  }

  let smaller = parseFloat(t) < parseFloat(w);
  let im = (parseFloat(t) < 0) ^ (parseFloat(w) < 0);
  let x = parseFloat(w) < 0 ? w.replace('-', '') : w;
  let y = parseFloat(t) < 0 ? t.replace('-', '') : t;
  let o = smaller ? dton(x, y) : dton(y, x);

  let d = o.d,
    v = o.v;
  w = o.w;
  let vl = v.length,
    wl = w.length,
    l = vl + wl - 1;

  v = v.split('').reverse().join('');
  w = w.split('').reverse().join('');

  let res = [];
  for (let i = 0; i < l; i++) res.push(0);

  let i1 = 0;
  for (i1; i1 < vl; i1++) {
    let j1 = 0,
      vi = 0,
      wi = 0;

    for (j1; j1 < wl; j1++) {
      vi = v.charCodeAt(i1) - 48;
      wi = w.charCodeAt(j1) - 48;

      res[i1 + j1] += vi * wi;
    }
  }

  let i2 = 0,
    x2 = 0;

  for (i2; i2 < l; i2++) {
    if (res[i2] < 10) continue;
    x2 = Math.floor(res[i2] / 10);

    if (i2 + 1 === l) {
      res.push(x2);
    } else {
      res[i2 + 1] += x2;
    }

    res[i2] -= x2 * 10;
  }

  let result = res
    .reverse()
    .join('')
    .dmove(-2 * d);
  return im && result.indexOf('-') === -1 ? '-' + result : result;
};

String.prototype.ddiv = function (w, prec = 18) {
  w = String(w);

  let im = 0;
  let t = String(this);

  const floatThis = parseFloat(this);
  const floatTarget = parseFloat(w);

  if (floatThis === 0 || floatTarget === 0) {
    return '0'.dprec(prec);
  }

  if (Number.isNaN(floatThis) || Number.isNaN(floatTarget)) {
    return '0'.dprec(prec);
  }

  if (w.dcomp('0') === 0) {
    throw 'Error: Divide by zero';
  }

  if (parseFloat(t) < 0) {
    im += 1;
    t = t.replace('-', '');
  }

  if (parseFloat(w) < 0) {
    im += 1;
    w = w.replace('-', '');
  }

  let o = dton(t, w);
  let v = o.v;
  w = o.w;

  let res = '',
    d = 0;

  while (v.dcomp(w) >= 0) {
    d++;
    w += '0';
  }

  let i1 = 1;
  for (i1; i1 <= d; i1++) {
    w = w.slice(0, -1);

    let c = 0;
    while (v.dcomp(w) >= 0) {
      c++;
      v = v.dsub(w);
    }

    res += c;
  }

  res += '.';

  let i2 = 1;
  for (i2; i2 <= prec; i2++) {
    v += '0';

    let c = 0;
    while (v.dcomp(w) >= 0) {
      c++;
      v = v.dsub(w);
    }

    res += c;
  }

  return im === 1 ? '-' + res.dclean() : res.dclean();
};
