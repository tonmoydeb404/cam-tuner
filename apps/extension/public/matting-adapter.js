var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b2) => (typeof require !== "undefined" ? require : a2)[b2]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});

// ../../node_modules/.pnpm/@mediapipe+tasks-vision@0.10.35/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs
var t = "undefined" != typeof self ? self : {};
function e(e2, n2) {
  t: {
    for (var r2 = ["CLOSURE_FLAGS"], i2 = t, s2 = 0; s2 < r2.length; s2++) if (null == (i2 = i2[r2[s2]])) {
      r2 = null;
      break t;
    }
    r2 = i2;
  }
  return null != (e2 = r2 && r2[e2]) ? e2 : n2;
}
function n() {
  throw Error("Invalid UTF8");
}
function r(t2, e2) {
  return e2 = String.fromCharCode.apply(null, e2), null == t2 ? e2 : t2 + e2;
}
var i;
var s;
var o = "undefined" != typeof TextDecoder;
var a;
var c = "undefined" != typeof TextEncoder;
function h(t2) {
  if (c) t2 = (a ||= new TextEncoder()).encode(t2);
  else {
    let n2 = 0;
    const r2 = new Uint8Array(3 * t2.length);
    for (let i2 = 0; i2 < t2.length; i2++) {
      var e2 = t2.charCodeAt(i2);
      if (e2 < 128) r2[n2++] = e2;
      else {
        if (e2 < 2048) r2[n2++] = e2 >> 6 | 192;
        else {
          if (e2 >= 55296 && e2 <= 57343) {
            if (e2 <= 56319 && i2 < t2.length) {
              const s2 = t2.charCodeAt(++i2);
              if (s2 >= 56320 && s2 <= 57343) {
                e2 = 1024 * (e2 - 55296) + s2 - 56320 + 65536, r2[n2++] = e2 >> 18 | 240, r2[n2++] = e2 >> 12 & 63 | 128, r2[n2++] = e2 >> 6 & 63 | 128, r2[n2++] = 63 & e2 | 128;
                continue;
              }
              i2--;
            }
            e2 = 65533;
          }
          r2[n2++] = e2 >> 12 | 224, r2[n2++] = e2 >> 6 & 63 | 128;
        }
        r2[n2++] = 63 & e2 | 128;
      }
    }
    t2 = n2 === r2.length ? r2 : r2.subarray(0, n2);
  }
  return t2;
}
function u(e2) {
  t.setTimeout((() => {
    throw e2;
  }), 0);
}
var l;
var f = e(610401301, false);
var d = e(748402147, true);
function p() {
  var e2 = t.navigator;
  return e2 && (e2 = e2.userAgent) ? e2 : "";
}
var g = t.navigator;
function m(t2) {
  return m[" "](t2), t2;
}
l = g && g.userAgentData || null, m[" "] = function() {
};
var y = {};
var _ = null;
function v(t2) {
  const e2 = t2.length;
  let n2 = 3 * e2 / 4;
  n2 % 3 ? n2 = Math.floor(n2) : -1 != "=.".indexOf(t2[e2 - 1]) && (n2 = -1 != "=.".indexOf(t2[e2 - 2]) ? n2 - 2 : n2 - 1);
  const r2 = new Uint8Array(n2);
  let i2 = 0;
  return (function(t3, e3) {
    function n3(e4) {
      for (; r3 < t3.length; ) {
        const e5 = t3.charAt(r3++), n4 = _[e5];
        if (null != n4) return n4;
        if (!/^[\s\xa0]*$/.test(e5)) throw Error("Unknown base64 encoding at char: " + e5);
      }
      return e4;
    }
    E();
    let r3 = 0;
    for (; ; ) {
      const t4 = n3(-1), r4 = n3(0), i3 = n3(64), s2 = n3(64);
      if (64 === s2 && -1 === t4) break;
      e3(t4 << 2 | r4 >> 4), 64 != i3 && (e3(r4 << 4 & 240 | i3 >> 2), 64 != s2 && e3(i3 << 6 & 192 | s2));
    }
  })(t2, (function(t3) {
    r2[i2++] = t3;
  })), i2 !== n2 ? r2.subarray(0, i2) : r2;
}
function E() {
  if (!_) {
    _ = {};
    var t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), e2 = ["+/=", "+/", "-_=", "-_.", "-_"];
    for (let n2 = 0; n2 < 5; n2++) {
      const r2 = t2.concat(e2[n2].split(""));
      y[n2] = r2;
      for (let t3 = 0; t3 < r2.length; t3++) {
        const e3 = r2[t3];
        void 0 === _[e3] && (_[e3] = t3);
      }
    }
  }
}
var w = "undefined" != typeof Uint8Array;
var T = !(!(f && l && l.brands.length > 0) && (-1 != p().indexOf("Trident") || -1 != p().indexOf("MSIE"))) && "function" == typeof btoa;
var A = /[-_.]/g;
var b = { "-": "+", _: "/", ".": "=" };
function k(t2) {
  return b[t2] || "";
}
function S(t2) {
  if (!T) return v(t2);
  t2 = A.test(t2) ? t2.replace(A, k) : t2, t2 = atob(t2);
  const e2 = new Uint8Array(t2.length);
  for (let n2 = 0; n2 < t2.length; n2++) e2[n2] = t2.charCodeAt(n2);
  return e2;
}
function x(t2) {
  return w && null != t2 && t2 instanceof Uint8Array;
}
var L = {};
function R() {
  return M ||= new F(null, L);
}
function I(t2) {
  C(L);
  var e2 = t2.g;
  return null == (e2 = null == e2 || x(e2) ? e2 : "string" == typeof e2 ? S(e2) : null) ? e2 : t2.g = e2;
}
var F = class {
  h() {
    return new Uint8Array(I(this) || 0);
  }
  constructor(t2, e2) {
    if (C(e2), this.g = t2, null != t2 && 0 === t2.length) throw Error("ByteString should be constructed with non-empty values");
  }
};
var M;
var P;
function C(t2) {
  if (t2 !== L) throw Error("illegal external caller");
}
function O(t2, e2) {
  t2.__closure__error__context__984382 || (t2.__closure__error__context__984382 = {}), t2.__closure__error__context__984382.severity = e2;
}
function N(t2) {
  return O(t2 = Error(t2), "warning"), t2;
}
function U(t2, e2) {
  if (null != t2) {
    var n2 = P ??= {}, r2 = n2[t2] || 0;
    r2 >= e2 || (n2[t2] = r2 + 1, O(t2 = Error(), "incident"), u(t2));
  }
}
function D() {
  return "function" == typeof BigInt;
}
var B = "function" == typeof Symbol && "symbol" == typeof /* @__PURE__ */ Symbol();
function G(t2, e2, n2 = false) {
  return "function" == typeof Symbol && "symbol" == typeof /* @__PURE__ */ Symbol() ? n2 && Symbol.for && t2 ? Symbol.for(t2) : null != t2 ? Symbol(t2) : /* @__PURE__ */ Symbol() : e2;
}
var j = G("jas", void 0, true);
var V = G(void 0, "0di");
var X = G(void 0, "1oa");
var H = G(void 0, /* @__PURE__ */ Symbol());
var W = G(void 0, "0ub");
var z = G(void 0, "0ubs");
var K = G(void 0, "0ubsb");
var Y = G(void 0, "0actk");
var q = G("m_m", "Pa", true);
var $ = G();
var J = { Ga: { value: 0, configurable: true, writable: true, enumerable: false } };
var Z = Object.defineProperties;
var Q = B ? j : "Ga";
var tt;
var et = [];
function nt(t2, e2) {
  B || Q in t2 || Z(t2, J), t2[Q] |= e2;
}
function rt(t2, e2) {
  B || Q in t2 || Z(t2, J), t2[Q] = e2;
}
function it(t2) {
  return nt(t2, 34), t2;
}
function st(t2) {
  return nt(t2, 8192), t2;
}
rt(et, 7), tt = Object.freeze(et);
var ot = {};
function at(t2, e2) {
  return void 0 === e2 ? t2.h !== ct && !!(2 & (0 | t2.v[Q])) : !!(2 & e2) && t2.h !== ct;
}
var ct = {};
function ht(t2, e2) {
  if (null != t2) {
    if ("string" == typeof t2) t2 = t2 ? new F(t2, L) : R();
    else if (t2.constructor !== F) if (x(t2)) t2 = t2.length ? new F(new Uint8Array(t2), L) : R();
    else {
      if (!e2) throw Error();
      t2 = void 0;
    }
  }
  return t2;
}
var ut = class {
  constructor(t2, e2, n2) {
    this.g = t2, this.h = e2, this.l = n2;
  }
  next() {
    const t2 = this.g.next();
    return t2.done || (t2.value = this.h.call(this.l, t2.value)), t2;
  }
  [Symbol.iterator]() {
    return this;
  }
};
var lt = Object.freeze({});
function ft(t2, e2, n2) {
  const r2 = 128 & e2 ? 0 : -1, i2 = t2.length;
  var s2;
  (s2 = !!i2) && (s2 = null != (s2 = t2[i2 - 1]) && "object" == typeof s2 && s2.constructor === Object);
  const o2 = i2 + (s2 ? -1 : 0);
  for (e2 = 128 & e2 ? 1 : 0; e2 < o2; e2++) n2(e2 - r2, t2[e2]);
  if (s2) {
    t2 = t2[i2 - 1];
    for (const e3 in t2) !isNaN(e3) && n2(+e3, t2[e3]);
  }
}
var dt = {};
function pt(t2) {
  return 128 & t2 ? dt : void 0;
}
function gt(t2) {
  return t2.Na = true, t2;
}
var mt = gt(((t2) => "number" == typeof t2));
var yt = gt(((t2) => "string" == typeof t2));
var _t = gt(((t2) => "boolean" == typeof t2));
var vt = "function" == typeof t.BigInt && "bigint" == typeof t.BigInt(0);
function Et(t2) {
  var e2 = t2;
  if (yt(e2)) {
    if (!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(e2)) throw Error(String(e2));
  } else if (mt(e2) && !Number.isSafeInteger(e2)) throw Error(String(e2));
  return vt ? BigInt(t2) : t2 = _t(t2) ? t2 ? "1" : "0" : yt(t2) ? t2.trim() || "0" : String(t2);
}
var wt = gt(((t2) => vt ? t2 >= At && t2 <= kt : "-" === t2[0] ? St(t2, Tt) : St(t2, bt)));
var Tt = Number.MIN_SAFE_INTEGER.toString();
var At = vt ? BigInt(Number.MIN_SAFE_INTEGER) : void 0;
var bt = Number.MAX_SAFE_INTEGER.toString();
var kt = vt ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;
function St(t2, e2) {
  if (t2.length > e2.length) return false;
  if (t2.length < e2.length || t2 === e2) return true;
  for (let n2 = 0; n2 < t2.length; n2++) {
    const r2 = t2[n2], i2 = e2[n2];
    if (r2 > i2) return false;
    if (r2 < i2) return true;
  }
}
var xt = "function" == typeof Uint8Array.prototype.slice;
var Lt;
var Rt = 0;
var It = 0;
function Ft(t2) {
  const e2 = t2 >>> 0;
  Rt = e2, It = (t2 - e2) / 4294967296 >>> 0;
}
function Mt(t2) {
  if (t2 < 0) {
    Ft(-t2);
    const [e2, n2] = jt(Rt, It);
    Rt = e2 >>> 0, It = n2 >>> 0;
  } else Ft(t2);
}
function Pt(t2) {
  const e2 = Lt ||= new DataView(new ArrayBuffer(8));
  e2.setFloat32(0, +t2, true), It = 0, Rt = e2.getUint32(0, true);
}
function Ct(t2, e2) {
  const n2 = 4294967296 * e2 + (t2 >>> 0);
  return Number.isSafeInteger(n2) ? n2 : Ut(t2, e2);
}
function Ot(t2, e2) {
  return Et(D() ? BigInt.asUintN(64, (BigInt(e2 >>> 0) << BigInt(32)) + BigInt(t2 >>> 0)) : Ut(t2, e2));
}
function Nt(t2, e2) {
  return D() ? Et(BigInt.asIntN(64, (BigInt.asUintN(32, BigInt(e2)) << BigInt(32)) + BigInt.asUintN(32, BigInt(t2)))) : Et(Bt(t2, e2));
}
function Ut(t2, e2) {
  if (t2 >>>= 0, (e2 >>>= 0) <= 2097151) var n2 = "" + (4294967296 * e2 + t2);
  else D() ? n2 = "" + (BigInt(e2) << BigInt(32) | BigInt(t2)) : (t2 = (16777215 & t2) + 6777216 * (n2 = 16777215 & (t2 >>> 24 | e2 << 8)) + 6710656 * (e2 = e2 >> 16 & 65535), n2 += 8147497 * e2, e2 *= 2, t2 >= 1e7 && (n2 += t2 / 1e7 >>> 0, t2 %= 1e7), n2 >= 1e7 && (e2 += n2 / 1e7 >>> 0, n2 %= 1e7), n2 = e2 + Dt(n2) + Dt(t2));
  return n2;
}
function Dt(t2) {
  return t2 = String(t2), "0000000".slice(t2.length) + t2;
}
function Bt(t2, e2) {
  if (2147483648 & e2) if (D()) t2 = "" + (BigInt(0 | e2) << BigInt(32) | BigInt(t2 >>> 0));
  else {
    const [n2, r2] = jt(t2, e2);
    t2 = "-" + Ut(n2, r2);
  }
  else t2 = Ut(t2, e2);
  return t2;
}
function Gt(t2) {
  if (t2.length < 16) Mt(Number(t2));
  else if (D()) t2 = BigInt(t2), Rt = Number(t2 & BigInt(4294967295)) >>> 0, It = Number(t2 >> BigInt(32) & BigInt(4294967295));
  else {
    const e2 = +("-" === t2[0]);
    It = Rt = 0;
    const n2 = t2.length;
    for (let r2 = e2, i2 = (n2 - e2) % 6 + e2; i2 <= n2; r2 = i2, i2 += 6) {
      const e3 = Number(t2.slice(r2, i2));
      It *= 1e6, Rt = 1e6 * Rt + e3, Rt >= 4294967296 && (It += Math.trunc(Rt / 4294967296), It >>>= 0, Rt >>>= 0);
    }
    if (e2) {
      const [t3, e3] = jt(Rt, It);
      Rt = t3, It = e3;
    }
  }
}
function jt(t2, e2) {
  return e2 = ~e2, t2 ? t2 = 1 + ~t2 : e2 += 1, [t2, e2];
}
function Vt(t2) {
  return Array.prototype.slice.call(t2);
}
var Xt = "function" == typeof BigInt ? BigInt.asIntN : void 0;
var Ht = "function" == typeof BigInt ? BigInt.asUintN : void 0;
var Wt = Number.isSafeInteger;
var zt = Number.isFinite;
var Kt = Math.trunc;
var Yt = Et(0);
function qt(t2) {
  if (null != t2 && "number" != typeof t2) throw Error(`Value of float/double field must be a number, found ${typeof t2}: ${t2}`);
  return t2;
}
function $t(t2) {
  return null == t2 || "number" == typeof t2 ? t2 : "NaN" === t2 || "Infinity" === t2 || "-Infinity" === t2 ? Number(t2) : void 0;
}
function Jt(t2) {
  if (null != t2 && "boolean" != typeof t2) {
    var e2 = typeof t2;
    throw Error(`Expected boolean but got ${"object" != e2 ? e2 : t2 ? Array.isArray(t2) ? "array" : e2 : "null"}: ${t2}`);
  }
  return t2;
}
function Zt(t2) {
  return null == t2 || "boolean" == typeof t2 ? t2 : "number" == typeof t2 ? !!t2 : void 0;
}
var Qt = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;
function te(t2) {
  switch (typeof t2) {
    case "bigint":
      return true;
    case "number":
      return zt(t2);
    case "string":
      return Qt.test(t2);
    default:
      return false;
  }
}
function ee(t2) {
  if (null == t2) return t2;
  if ("string" == typeof t2 && t2) t2 = +t2;
  else if ("number" != typeof t2) return;
  return zt(t2) ? 0 | t2 : void 0;
}
function ne(t2) {
  if (null == t2) return t2;
  if ("string" == typeof t2 && t2) t2 = +t2;
  else if ("number" != typeof t2) return;
  return zt(t2) ? t2 >>> 0 : void 0;
}
function re(t2) {
  const e2 = t2.length;
  return ("-" === t2[0] ? e2 < 20 || 20 === e2 && t2 <= "-9223372036854775808" : e2 < 19 || 19 === e2 && t2 <= "9223372036854775807") ? t2 : (Gt(t2), Bt(Rt, It));
}
function ie(t2) {
  if (t2 = Kt(t2), !Wt(t2)) {
    Mt(t2);
    var e2 = Rt, n2 = It;
    (t2 = 2147483648 & n2) && (n2 = ~n2 >>> 0, 0 == (e2 = 1 + ~e2 >>> 0) && (n2 = n2 + 1 >>> 0)), t2 = "number" == typeof (e2 = Ct(e2, n2)) ? t2 ? -e2 : e2 : t2 ? "-" + e2 : e2;
  }
  return t2;
}
function se(t2) {
  var e2 = Kt(Number(t2));
  return Wt(e2) ? String(e2) : (-1 !== (e2 = t2.indexOf(".")) && (t2 = t2.substring(0, e2)), re(t2));
}
function oe(t2) {
  var e2 = Kt(Number(t2));
  return Wt(e2) ? Et(e2) : (-1 !== (e2 = t2.indexOf(".")) && (t2 = t2.substring(0, e2)), D() ? Et(Xt(64, BigInt(t2))) : Et(re(t2)));
}
function ae(t2) {
  return Wt(t2) ? t2 = Et(ie(t2)) : (t2 = Kt(t2), Wt(t2) ? t2 = String(t2) : (Mt(t2), t2 = Bt(Rt, It)), t2 = Et(t2)), t2;
}
function ce(t2) {
  const e2 = typeof t2;
  return null == t2 ? t2 : "bigint" === e2 ? Et(Xt(64, t2)) : te(t2) ? "string" === e2 ? oe(t2) : ae(t2) : void 0;
}
function he(t2) {
  if ("string" != typeof t2) throw Error();
  return t2;
}
function ue(t2) {
  if (null != t2 && "string" != typeof t2) throw Error();
  return t2;
}
function le(t2) {
  return null == t2 || "string" == typeof t2 ? t2 : void 0;
}
function fe(t2, e2, n2, r2) {
  return null != t2 && t2[q] === ot ? t2 : Array.isArray(t2) ? ((r2 = (n2 = 0 | t2[Q]) | 32 & r2 | 2 & r2) !== n2 && rt(t2, r2), new e2(t2)) : (n2 ? 2 & r2 ? ((t2 = e2[V]) || (it((t2 = new e2()).v), t2 = e2[V] = t2), e2 = t2) : e2 = new e2() : e2 = void 0, e2);
}
function de(t2, e2, n2) {
  if (e2) t: {
    if (!te(e2 = t2)) throw N("int64");
    switch (typeof e2) {
      case "string":
        e2 = oe(e2);
        break t;
      case "bigint":
        e2 = Et(Xt(64, e2));
        break t;
      default:
        e2 = ae(e2);
    }
  }
  else e2 = ce(t2);
  return null == (t2 = e2) ? n2 ? Yt : void 0 : t2;
}
var pe = {};
var ge = (function() {
  try {
    return m(new class extends Map {
      constructor() {
        super();
      }
    }()), false;
  } catch {
    return true;
  }
})();
var me = class {
  constructor() {
    this.g = /* @__PURE__ */ new Map();
  }
  get(t2) {
    return this.g.get(t2);
  }
  set(t2, e2) {
    return this.g.set(t2, e2), this.size = this.g.size, this;
  }
  delete(t2) {
    return t2 = this.g.delete(t2), this.size = this.g.size, t2;
  }
  clear() {
    this.g.clear(), this.size = this.g.size;
  }
  has(t2) {
    return this.g.has(t2);
  }
  entries() {
    return this.g.entries();
  }
  keys() {
    return this.g.keys();
  }
  values() {
    return this.g.values();
  }
  forEach(t2, e2) {
    return this.g.forEach(t2, e2);
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
var ye = ge ? (Object.setPrototypeOf(me.prototype, Map.prototype), Object.defineProperties(me.prototype, { size: { value: 0, configurable: true, enumerable: true, writable: true } }), me) : class extends Map {
  constructor() {
    super();
  }
};
function _e(t2) {
  return t2;
}
function ve(t2) {
  if (2 & t2.J) throw Error("Cannot mutate an immutable Map");
}
var Ee = class extends ye {
  constructor(t2, e2, n2 = _e, r2 = _e) {
    super(), this.J = 0 | t2[Q], this.K = e2, this.S = n2, this.fa = this.K ? we : r2;
    for (let i2 = 0; i2 < t2.length; i2++) {
      const s2 = t2[i2], o2 = n2(s2[0], false, true);
      let a2 = s2[1];
      e2 ? void 0 === a2 && (a2 = null) : a2 = r2(s2[1], false, true, void 0, void 0, this.J), super.set(o2, a2);
    }
  }
  V(t2) {
    return st(Array.from(super.entries(), t2));
  }
  clear() {
    ve(this), super.clear();
  }
  delete(t2) {
    return ve(this), super.delete(this.S(t2, true, false));
  }
  entries() {
    if (this.K) {
      var t2 = super.keys();
      t2 = new ut(t2, Te, this);
    } else t2 = super.entries();
    return t2;
  }
  values() {
    if (this.K) {
      var t2 = super.keys();
      t2 = new ut(t2, Ee.prototype.get, this);
    } else t2 = super.values();
    return t2;
  }
  forEach(t2, e2) {
    this.K ? super.forEach(((n2, r2, i2) => {
      t2.call(e2, i2.get(r2), r2, i2);
    })) : super.forEach(t2, e2);
  }
  set(t2, e2) {
    return ve(this), null == (t2 = this.S(t2, true, false)) ? this : null == e2 ? (super.delete(t2), this) : super.set(t2, this.fa(e2, true, true, this.K, false, this.J));
  }
  Ma(t2) {
    const e2 = this.S(t2[0], false, true);
    t2 = t2[1], t2 = this.K ? void 0 === t2 ? null : t2 : this.fa(t2, false, true, void 0, false, this.J), super.set(e2, t2);
  }
  has(t2) {
    return super.has(this.S(t2, false, false));
  }
  get(t2) {
    t2 = this.S(t2, false, false);
    const e2 = super.get(t2);
    if (void 0 !== e2) {
      var n2 = this.K;
      return n2 ? ((n2 = this.fa(e2, false, true, n2, this.ra, this.J)) !== e2 && super.set(t2, n2), n2) : e2;
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
function we(t2, e2, n2, r2, i2, s2) {
  return t2 = fe(t2, r2, n2, s2), i2 && (t2 = Xe(t2)), t2;
}
function Te(t2) {
  return [t2, this.get(t2)];
}
var Ae;
function be() {
  return Ae ||= new Ee(it([]), void 0, void 0, void 0, pe);
}
function ke(t2) {
  return H ? t2[H] : void 0;
}
function Se(t2, e2) {
  for (const n2 in t2) !isNaN(n2) && e2(t2, +n2, t2[n2]);
}
Ee.prototype.toJSON = void 0;
var xe = class {
};
var Le = { Ka: true };
function Re(t2, e2) {
  e2 < 100 || U(z, 1);
}
function Ie(t2, e2, n2, r2) {
  const i2 = void 0 !== r2;
  r2 = !!r2;
  var s2, o2 = H;
  !i2 && B && o2 && (s2 = t2[o2]) && Se(s2, Re), o2 = [];
  var a2 = t2.length;
  let c2;
  s2 = 4294967295;
  let h2 = false;
  const u2 = !!(64 & e2), l2 = u2 ? 128 & e2 ? 0 : -1 : void 0;
  1 & e2 || (c2 = a2 && t2[a2 - 1], null != c2 && "object" == typeof c2 && c2.constructor === Object ? s2 = --a2 : c2 = void 0, !u2 || 128 & e2 || i2 || (h2 = true, s2 = s2 - l2 + l2)), e2 = void 0;
  for (var f2 = 0; f2 < a2; f2++) {
    let i3 = t2[f2];
    if (null != i3 && null != (i3 = n2(i3, r2))) if (u2 && f2 >= s2) {
      const t3 = f2 - l2;
      (e2 ??= {})[t3] = i3;
    } else o2[f2] = i3;
  }
  if (c2) for (let t3 in c2) {
    if (null == (a2 = c2[t3]) || null == (a2 = n2(a2, r2))) continue;
    let i3;
    f2 = +t3, u2 && !Number.isNaN(f2) && (i3 = f2 + l2) < s2 ? o2[i3] = a2 : (e2 ??= {})[t3] = a2;
  }
  return e2 && (h2 ? o2.push(e2) : o2[s2] = e2), i2 && H && (t2 = ke(t2)) && t2 instanceof xe && (o2[H] = (function(t3) {
    const e3 = new xe();
    return Se(t3, ((t4, n3, r3) => {
      e3[n3] = Vt(r3);
    })), e3.da = t3.da, e3;
  })(t2)), o2;
}
function Fe(t2) {
  return t2[0] = Me(t2[0]), t2[1] = Me(t2[1]), t2;
}
function Me(t2) {
  switch (typeof t2) {
    case "number":
      return Number.isFinite(t2) ? t2 : "" + t2;
    case "bigint":
      return wt(t2) ? Number(t2) : "" + t2;
    case "boolean":
      return t2 ? 1 : 0;
    case "object":
      if (Array.isArray(t2)) {
        var e2 = 0 | t2[Q];
        return 0 === t2.length && 1 & e2 ? void 0 : Ie(t2, e2, Me);
      }
      if (null != t2 && t2[q] === ot) return Oe(t2);
      if (t2 instanceof F) {
        if (null == (e2 = t2.g)) t2 = "";
        else if ("string" == typeof e2) t2 = e2;
        else {
          if (T) {
            for (var n2 = "", r2 = 0, i2 = e2.length - 10240; r2 < i2; ) n2 += String.fromCharCode.apply(null, e2.subarray(r2, r2 += 10240));
            n2 += String.fromCharCode.apply(null, r2 ? e2.subarray(r2) : e2), e2 = btoa(n2);
          } else {
            void 0 === n2 && (n2 = 0), E(), n2 = y[n2], r2 = Array(Math.floor(e2.length / 3)), i2 = n2[64] || "";
            let t3 = 0, h2 = 0;
            for (; t3 < e2.length - 2; t3 += 3) {
              var s2 = e2[t3], o2 = e2[t3 + 1], a2 = e2[t3 + 2], c2 = n2[s2 >> 2];
              s2 = n2[(3 & s2) << 4 | o2 >> 4], o2 = n2[(15 & o2) << 2 | a2 >> 6], a2 = n2[63 & a2], r2[h2++] = c2 + s2 + o2 + a2;
            }
            switch (c2 = 0, a2 = i2, e2.length - t3) {
              case 2:
                a2 = n2[(15 & (c2 = e2[t3 + 1])) << 2] || i2;
              case 1:
                e2 = e2[t3], r2[h2] = n2[e2 >> 2] + n2[(3 & e2) << 4 | c2 >> 4] + a2 + i2;
            }
            e2 = r2.join("");
          }
          t2 = t2.g = e2;
        }
        return t2;
      }
      return t2 instanceof Ee ? t2 = 0 !== t2.size ? t2.V(Fe) : void 0 : void 0;
  }
  return t2;
}
var Pe;
var Ce;
function Oe(t2) {
  return Ie(t2 = t2.v, 0 | t2[Q], Me);
}
function Ne(t2, e2) {
  return Ue(t2, e2[0], e2[1]);
}
function Ue(t2, e2, n2, r2 = 0) {
  if (null == t2) {
    var i2 = 32;
    n2 ? (t2 = [n2], i2 |= 128) : t2 = [], e2 && (i2 = -16760833 & i2 | (1023 & e2) << 14);
  } else {
    if (!Array.isArray(t2)) throw Error("narr");
    if (i2 = 0 | t2[Q], d && 1 & i2) throw Error("rfarr");
    if (2048 & i2 && !(2 & i2) && (function() {
      if (d) throw Error("carr");
      U(Y, 5);
    })(), 256 & i2) throw Error("farr");
    if (64 & i2) return (i2 | r2) !== i2 && rt(t2, i2 | r2), t2;
    if (n2 && (i2 |= 128, n2 !== t2[0])) throw Error("mid");
    t: {
      i2 |= 64;
      var s2 = (n2 = t2).length;
      if (s2) {
        var o2 = s2 - 1;
        const t3 = n2[o2];
        if (null != t3 && "object" == typeof t3 && t3.constructor === Object) {
          if ((o2 -= e2 = 128 & i2 ? 0 : -1) >= 1024) throw Error("pvtlmt");
          for (var a2 in t3) (s2 = +a2) < o2 && (n2[s2 + e2] = t3[a2], delete t3[a2]);
          i2 = -16760833 & i2 | (1023 & o2) << 14;
          break t;
        }
      }
      if (e2) {
        if ((a2 = Math.max(e2, s2 - (128 & i2 ? 0 : -1))) > 1024) throw Error("spvt");
        i2 = -16760833 & i2 | (1023 & a2) << 14;
      }
    }
  }
  return rt(t2, 64 | i2 | r2), t2;
}
function De(t2, e2) {
  if ("object" != typeof t2) return t2;
  if (Array.isArray(t2)) {
    var n2 = 0 | t2[Q];
    return 0 === t2.length && 1 & n2 ? void 0 : Be(t2, n2, e2);
  }
  if (null != t2 && t2[q] === ot) return je(t2);
  if (t2 instanceof Ee) {
    if (2 & (e2 = t2.J)) return t2;
    if (!t2.size) return;
    if (n2 = it(t2.V()), t2.K) for (t2 = 0; t2 < n2.length; t2++) {
      const r2 = n2[t2];
      let i2 = r2[1];
      i2 = null == i2 || "object" != typeof i2 ? void 0 : null != i2 && i2[q] === ot ? je(i2) : Array.isArray(i2) ? Be(i2, 0 | i2[Q], !!(32 & e2)) : void 0, r2[1] = i2;
    }
    return n2;
  }
  return t2 instanceof F ? t2 : void 0;
}
function Be(t2, e2, n2) {
  return 2 & e2 || (!n2 || 4096 & e2 || 16 & e2 ? t2 = Ve(t2, e2, false, n2 && !(16 & e2)) : (nt(t2, 34), 4 & e2 && Object.freeze(t2))), t2;
}
function Ge(t2, e2, n2) {
  return t2 = new t2.constructor(e2), n2 && (t2.h = ct), t2.m = ct, t2;
}
function je(t2) {
  const e2 = t2.v, n2 = 0 | e2[Q];
  return at(t2, n2) ? t2 : Ke(t2, e2, n2) ? Ge(t2, e2) : Ve(e2, n2);
}
function Ve(t2, e2, n2, r2) {
  return r2 ??= !!(34 & e2), t2 = Ie(t2, e2, De, r2), r2 = 32, n2 && (r2 |= 2), rt(t2, e2 = 16769217 & e2 | r2), t2;
}
function Xe(t2) {
  const e2 = t2.v, n2 = 0 | e2[Q];
  return at(t2, n2) ? Ke(t2, e2, n2) ? Ge(t2, e2, true) : new t2.constructor(Ve(e2, n2, false)) : t2;
}
function He(t2) {
  if (t2.h !== ct) return false;
  var e2 = t2.v;
  return nt(e2 = Ve(e2, 0 | e2[Q]), 2048), t2.v = e2, t2.h = void 0, t2.m = void 0, true;
}
function We(t2) {
  if (!He(t2) && at(t2, 0 | t2.v[Q])) throw Error();
}
function ze(t2, e2) {
  void 0 === e2 && (e2 = 0 | t2[Q]), 32 & e2 && !(4096 & e2) && rt(t2, 4096 | e2);
}
function Ke(t2, e2, n2) {
  return !!(2 & n2) || !(!(32 & n2) || 4096 & n2) && (rt(e2, 2 | n2), t2.h = ct, true);
}
var Ye = Et(0);
var qe = {};
function $e(t2, e2, n2, r2, i2) {
  if (null !== (e2 = Je(t2.v, e2, n2, i2)) || r2 && t2.m !== ct) return e2;
}
function Je(t2, e2, n2, r2) {
  if (-1 === e2) return null;
  const i2 = e2 + (n2 ? 0 : -1), s2 = t2.length - 1;
  let o2, a2;
  if (!(s2 < 1 + (n2 ? 0 : -1))) {
    if (i2 >= s2) if (o2 = t2[s2], null != o2 && "object" == typeof o2 && o2.constructor === Object) n2 = o2[e2], a2 = true;
    else {
      if (i2 !== s2) return;
      n2 = o2;
    }
    else n2 = t2[i2];
    if (r2 && null != n2) {
      if (null == (r2 = r2(n2))) return r2;
      if (!Object.is(r2, n2)) return a2 ? o2[e2] = r2 : t2[i2] = r2, r2;
    }
    return n2;
  }
}
function Ze(t2, e2, n2, r2) {
  We(t2), Qe(t2 = t2.v, 0 | t2[Q], e2, n2, r2);
}
function Qe(t2, e2, n2, r2, i2) {
  const s2 = n2 + (i2 ? 0 : -1);
  var o2 = t2.length - 1;
  if (o2 >= 1 + (i2 ? 0 : -1) && s2 >= o2) {
    const i3 = t2[o2];
    if (null != i3 && "object" == typeof i3 && i3.constructor === Object) return i3[n2] = r2, e2;
  }
  return s2 <= o2 ? (t2[s2] = r2, e2) : (void 0 !== r2 && (n2 >= (o2 = (e2 ??= 0 | t2[Q]) >> 14 & 1023 || 536870912) ? null != r2 && (t2[o2 + (i2 ? 0 : -1)] = { [n2]: r2 }) : t2[s2] = r2), e2);
}
function tn() {
  return void 0 === lt ? 2 : 4;
}
function en(t2, e2, n2, r2, i2) {
  let s2 = t2.v, o2 = 0 | s2[Q];
  r2 = at(t2, o2) ? 1 : r2, i2 = !!i2 || 3 === r2, 2 === r2 && He(t2) && (s2 = t2.v, o2 = 0 | s2[Q]);
  let a2 = (t2 = rn(s2, e2)) === tt ? 7 : 0 | t2[Q], c2 = sn(a2, o2);
  var h2 = !(4 & c2);
  if (h2) {
    4 & c2 && (t2 = Vt(t2), a2 = 0, c2 = An(c2, o2), o2 = Qe(s2, o2, e2, t2));
    let r3 = 0, i3 = 0;
    for (; r3 < t2.length; r3++) {
      const e3 = n2(t2[r3]);
      null != e3 && (t2[i3++] = e3);
    }
    i3 < r3 && (t2.length = i3), n2 = -513 & (4 | c2), c2 = n2 &= -1025, c2 &= -4097;
  }
  return c2 !== a2 && (rt(t2, c2), 2 & c2 && Object.freeze(t2)), nn(t2, c2, s2, o2, e2, r2, h2, i2);
}
function nn(t2, e2, n2, r2, i2, s2, o2, a2) {
  let c2 = e2;
  return 1 === s2 || 4 === s2 && (2 & e2 || !(16 & e2) && 32 & r2) ? on(e2) || ((e2 |= !t2.length || o2 && !(4096 & e2) || 32 & r2 && !(4096 & e2 || 16 & e2) ? 2 : 256) !== c2 && rt(t2, e2), Object.freeze(t2)) : (2 === s2 && on(e2) && (t2 = Vt(t2), c2 = 0, e2 = An(e2, r2), r2 = Qe(n2, r2, i2, t2)), on(e2) || (a2 || (e2 |= 16), e2 !== c2 && rt(t2, e2))), 2 & e2 || !(4096 & e2 || 16 & e2) || ze(n2, r2), t2;
}
function rn(t2, e2, n2) {
  return t2 = Je(t2, e2, n2), Array.isArray(t2) ? t2 : tt;
}
function sn(t2, e2) {
  return 2 & e2 && (t2 |= 2), 1 | t2;
}
function on(t2) {
  return !!(2 & t2) && !!(4 & t2) || !!(256 & t2);
}
function an(t2) {
  return ht(t2, true);
}
function cn(t2) {
  t2 = Vt(t2);
  for (let e2 = 0; e2 < t2.length; e2++) {
    const n2 = t2[e2] = Vt(t2[e2]);
    Array.isArray(n2[1]) && (n2[1] = it(n2[1]));
  }
  return st(t2);
}
function hn(t2, e2, n2, r2) {
  We(t2), Qe(t2 = t2.v, 0 | t2[Q], e2, ("0" === r2 ? 0 === Number(n2) : n2 === r2) ? void 0 : n2);
}
function un(t2, e2, n2) {
  if (2 & e2) throw Error();
  const r2 = pt(e2);
  let i2 = rn(t2, n2, r2), s2 = i2 === tt ? 7 : 0 | i2[Q], o2 = sn(s2, e2);
  return (2 & o2 || on(o2) || 16 & o2) && (o2 === s2 || on(o2) || rt(i2, o2), i2 = Vt(i2), s2 = 0, o2 = An(o2, e2), Qe(t2, e2, n2, i2, r2)), o2 &= -13, o2 !== s2 && rt(i2, o2), i2;
}
function ln(t2, e2) {
  var n2 = Cs;
  return pn(fn(t2 = t2.v), t2, void 0, n2) === e2 ? e2 : -1;
}
function fn(t2) {
  if (B) return t2[X] ?? (t2[X] = /* @__PURE__ */ new Map());
  if (X in t2) return t2[X];
  const e2 = /* @__PURE__ */ new Map();
  return Object.defineProperty(t2, X, { value: e2 }), e2;
}
function dn(t2, e2, n2, r2, i2) {
  const s2 = fn(t2), o2 = pn(s2, t2, e2, n2, i2);
  return o2 !== r2 && (o2 && (e2 = Qe(t2, e2, o2, void 0, i2)), s2.set(n2, r2)), e2;
}
function pn(t2, e2, n2, r2, i2) {
  let s2 = t2.get(r2);
  if (null != s2) return s2;
  s2 = 0;
  for (let t3 = 0; t3 < r2.length; t3++) {
    const o2 = r2[t3];
    null != Je(e2, o2, i2) && (0 !== s2 && (n2 = Qe(e2, n2, s2, void 0, i2)), s2 = o2);
  }
  return t2.set(r2, s2), s2;
}
function gn(t2, e2, n2) {
  let r2 = 0 | t2[Q];
  const i2 = pt(r2), s2 = Je(t2, n2, i2);
  let o2;
  if (null != s2 && s2[q] === ot) {
    if (!at(s2)) return He(s2), s2.v;
    o2 = s2.v;
  } else Array.isArray(s2) && (o2 = s2);
  if (o2) {
    const t3 = 0 | o2[Q];
    2 & t3 && (o2 = Ve(o2, t3));
  }
  return o2 = Ne(o2, e2), o2 !== s2 && Qe(t2, r2, n2, o2, i2), o2;
}
function mn(t2, e2, n2, r2, i2) {
  let s2 = false;
  if (null != (r2 = Je(t2, r2, i2, ((t3) => {
    const r3 = fe(t3, n2, false, e2);
    return s2 = r3 !== t3 && null != r3, r3;
  })))) return s2 && !at(r2) && ze(t2, e2), r2;
}
function yn(t2, e2, n2, r2) {
  let i2 = t2.v, s2 = 0 | i2[Q];
  if (null == (e2 = mn(i2, s2, e2, n2, r2))) return e2;
  if (s2 = 0 | i2[Q], !at(t2, s2)) {
    const o2 = Xe(e2);
    o2 !== e2 && (He(t2) && (i2 = t2.v, s2 = 0 | i2[Q]), s2 = Qe(i2, s2, n2, e2 = o2, r2), ze(i2, s2));
  }
  return e2;
}
function _n(t2, e2, n2, r2, i2, s2, o2, a2) {
  var c2 = at(t2, n2);
  s2 = c2 ? 1 : s2, o2 = !!o2 || 3 === s2, c2 = a2 && !c2, (2 === s2 || c2) && He(t2) && (n2 = 0 | (e2 = t2.v)[Q]);
  var h2 = (t2 = rn(e2, i2)) === tt ? 7 : 0 | t2[Q], u2 = sn(h2, n2);
  if (a2 = !(4 & u2)) {
    var l2 = t2, f2 = n2;
    const e3 = !!(2 & u2);
    e3 && (f2 |= 2);
    let i3 = !e3, s3 = true, o3 = 0, a3 = 0;
    for (; o3 < l2.length; o3++) {
      const t3 = fe(l2[o3], r2, false, f2);
      if (t3 instanceof r2) {
        if (!e3) {
          const e4 = at(t3);
          i3 &&= !e4, s3 &&= e4;
        }
        l2[a3++] = t3;
      }
    }
    a3 < o3 && (l2.length = a3), u2 |= 4, u2 = s3 ? -4097 & u2 : 4096 | u2, u2 = i3 ? 8 | u2 : -9 & u2;
  }
  if (u2 !== h2 && (rt(t2, u2), 2 & u2 && Object.freeze(t2)), c2 && !(8 & u2 || !t2.length && (1 === s2 || 4 === s2 && (2 & u2 || !(16 & u2) && 32 & n2)))) {
    for (on(u2) && (t2 = Vt(t2), u2 = An(u2, n2), n2 = Qe(e2, n2, i2, t2)), r2 = t2, c2 = u2, h2 = 0; h2 < r2.length; h2++) (l2 = r2[h2]) !== (u2 = Xe(l2)) && (r2[h2] = u2);
    c2 |= 8, rt(t2, u2 = c2 = r2.length ? 4096 | c2 : -4097 & c2);
  }
  return nn(t2, u2, e2, n2, i2, s2, a2, o2);
}
function vn(t2, e2, n2) {
  const r2 = t2.v;
  return _n(t2, r2, 0 | r2[Q], e2, n2, tn(), false, true);
}
function En(t2) {
  return null == t2 && (t2 = void 0), t2;
}
function wn(t2, e2, n2, r2, i2) {
  return Ze(t2, n2, r2 = En(r2), i2), r2 && !at(r2) && ze(t2.v), t2;
}
function Tn(t2, e2, n2, r2) {
  t: {
    var i2 = r2 = En(r2);
    We(t2);
    const s2 = t2.v;
    let o2 = 0 | s2[Q];
    if (null == i2) {
      const t3 = fn(s2);
      if (pn(t3, s2, o2, n2) !== e2) break t;
      t3.set(n2, 0);
    } else o2 = dn(s2, o2, n2, e2);
    Qe(s2, o2, e2, i2);
  }
  r2 && !at(r2) && ze(t2.v);
}
function An(t2, e2) {
  return -273 & (2 & e2 ? 2 | t2 : -3 & t2);
}
function bn(t2, e2, n2, r2) {
  var i2 = r2;
  We(t2), t2 = _n(t2, r2 = t2.v, 0 | r2[Q], n2, e2, 2, true), i2 = null != i2 ? i2 : new n2(), t2.push(i2), e2 = n2 = t2 === tt ? 7 : 0 | t2[Q], (i2 = at(i2)) ? (n2 &= -9, 1 === t2.length && (n2 &= -4097)) : n2 |= 4096, n2 !== e2 && rt(t2, n2), i2 || ze(r2);
}
function kn(t2, e2, n2) {
  return ee($e(t2, e2, void 0, n2));
}
function Sn(t2, e2) {
  return $e(t2, e2, void 0, void 0, $t) ?? 0;
}
function xn(t2, e2, n2) {
  if (null != n2) {
    if ("number" != typeof n2) throw N("int32");
    if (!zt(n2)) throw N("int32");
    n2 |= 0;
  }
  Ze(t2, e2, n2);
}
function Ln(t2, e2, n2) {
  Ze(t2, e2, qt(n2));
}
function Rn(t2, e2, n2) {
  hn(t2, e2, ue(n2), "");
}
function In(t2, e2, n2) {
  {
    We(t2);
    const o2 = t2.v;
    let a2 = 0 | o2[Q];
    if (null == n2) Qe(o2, a2, e2);
    else {
      var r2 = t2 = n2 === tt ? 7 : 0 | n2[Q], i2 = on(t2), s2 = i2 || Object.isFrozen(n2);
      for (i2 || (t2 = 0), s2 || (n2 = Vt(n2), r2 = 0, t2 = An(t2, a2), s2 = false), t2 |= 5, t2 |= (4 & t2 ? 512 & t2 ? 512 : 1024 & t2 ? 1024 : 0 : void 0) ?? 1024, i2 = 0; i2 < n2.length; i2++) {
        const e3 = n2[i2], o3 = he(e3);
        Object.is(e3, o3) || (s2 && (n2 = Vt(n2), r2 = 0, t2 = An(t2, a2), s2 = false), n2[i2] = o3);
      }
      t2 !== r2 && (s2 && (n2 = Vt(n2), t2 = An(t2, a2)), rt(n2, t2)), Qe(o2, a2, e2, n2);
    }
  }
}
function Fn(t2, e2, n2) {
  We(t2), en(t2, e2, le, 2, true).push(he(n2));
}
var Mn = class {
  constructor(t2, e2, n2) {
    if (this.buffer = t2, n2 && !e2) throw Error();
    this.g = e2;
  }
};
function Pn(t2, e2) {
  if ("string" == typeof t2) return new Mn(S(t2), e2);
  if (Array.isArray(t2)) return new Mn(new Uint8Array(t2), e2);
  if (t2.constructor === Uint8Array) return new Mn(t2, false);
  if (t2.constructor === ArrayBuffer) return t2 = new Uint8Array(t2), new Mn(t2, false);
  if (t2.constructor === F) return e2 = I(t2) || new Uint8Array(0), new Mn(e2, true, t2);
  if (t2 instanceof Uint8Array) return t2 = t2.constructor === Uint8Array ? t2 : new Uint8Array(t2.buffer, t2.byteOffset, t2.byteLength), new Mn(t2, false);
  throw Error();
}
function Cn(t2, e2) {
  let n2, r2 = 0, i2 = 0, s2 = 0;
  const o2 = t2.h;
  let a2 = t2.g;
  do {
    n2 = o2[a2++], r2 |= (127 & n2) << s2, s2 += 7;
  } while (s2 < 32 && 128 & n2);
  if (s2 > 32) for (i2 |= (127 & n2) >> 4, s2 = 3; s2 < 32 && 128 & n2; s2 += 7) n2 = o2[a2++], i2 |= (127 & n2) << s2;
  if (Gn(t2, a2), !(128 & n2)) return e2(r2 >>> 0, i2 >>> 0);
  throw Error();
}
function On(t2) {
  let e2 = 0, n2 = t2.g;
  const r2 = n2 + 10, i2 = t2.h;
  for (; n2 < r2; ) {
    const r3 = i2[n2++];
    if (e2 |= r3, 0 == (128 & r3)) return Gn(t2, n2), !!(127 & e2);
  }
  throw Error();
}
function Nn(t2) {
  const e2 = t2.h;
  let n2 = t2.g, r2 = e2[n2++], i2 = 127 & r2;
  if (128 & r2 && (r2 = e2[n2++], i2 |= (127 & r2) << 7, 128 & r2 && (r2 = e2[n2++], i2 |= (127 & r2) << 14, 128 & r2 && (r2 = e2[n2++], i2 |= (127 & r2) << 21, 128 & r2 && (r2 = e2[n2++], i2 |= r2 << 28, 128 & r2 && 128 & e2[n2++] && 128 & e2[n2++] && 128 & e2[n2++] && 128 & e2[n2++] && 128 & e2[n2++]))))) throw Error();
  return Gn(t2, n2), i2;
}
function Un(t2) {
  return Nn(t2) >>> 0;
}
function Dn(t2) {
  var e2 = t2.h;
  const n2 = t2.g;
  var r2 = e2[n2], i2 = e2[n2 + 1];
  const s2 = e2[n2 + 2];
  return e2 = e2[n2 + 3], Gn(t2, t2.g + 4), t2 = 2 * ((i2 = (r2 << 0 | i2 << 8 | s2 << 16 | e2 << 24) >>> 0) >> 31) + 1, r2 = i2 >>> 23 & 255, i2 &= 8388607, 255 == r2 ? i2 ? NaN : t2 * (1 / 0) : 0 == r2 ? 1401298464324817e-60 * t2 * i2 : t2 * Math.pow(2, r2 - 150) * (i2 + 8388608);
}
function Bn(t2) {
  return Nn(t2);
}
function Gn(t2, e2) {
  if (t2.g = e2, e2 > t2.l) throw Error();
}
function jn(t2, e2) {
  if (e2 < 0) throw Error();
  const n2 = t2.g;
  if ((e2 = n2 + e2) > t2.l) throw Error();
  return t2.g = e2, n2;
}
function Vn(t2, e2) {
  if (0 == e2) return R();
  var n2 = jn(t2, e2);
  return t2.Y && t2.j ? n2 = t2.h.subarray(n2, n2 + e2) : (t2 = t2.h, n2 = n2 === (e2 = n2 + e2) ? new Uint8Array(0) : xt ? t2.slice(n2, e2) : new Uint8Array(t2.subarray(n2, e2))), 0 == n2.length ? R() : new F(n2, L);
}
var Xn = [];
function Hn(t2, e2, n2, r2) {
  if (Qn.length) {
    const i2 = Qn.pop();
    return i2.o(r2), i2.g.init(t2, e2, n2, r2), i2;
  }
  return new Zn(t2, e2, n2, r2);
}
function Wn(t2) {
  t2.g.clear(), t2.l = -1, t2.h = -1, Qn.length < 100 && Qn.push(t2);
}
function zn(t2) {
  var e2 = t2.g;
  if (e2.g == e2.l) return false;
  t2.m = t2.g.g;
  var n2 = Un(t2.g);
  if (e2 = n2 >>> 3, !((n2 &= 7) >= 0 && n2 <= 5)) throw Error();
  if (e2 < 1) throw Error();
  return t2.l = e2, t2.h = n2, true;
}
function Kn(t2) {
  switch (t2.h) {
    case 0:
      0 != t2.h ? Kn(t2) : On(t2.g);
      break;
    case 1:
      Gn(t2 = t2.g, t2.g + 8);
      break;
    case 2:
      if (2 != t2.h) Kn(t2);
      else {
        var e2 = Un(t2.g);
        Gn(t2 = t2.g, t2.g + e2);
      }
      break;
    case 5:
      Gn(t2 = t2.g, t2.g + 4);
      break;
    case 3:
      for (e2 = t2.l; ; ) {
        if (!zn(t2)) throw Error();
        if (4 == t2.h) {
          if (t2.l != e2) throw Error();
          break;
        }
        Kn(t2);
      }
      break;
    default:
      throw Error();
  }
}
function Yn(t2, e2, n2) {
  const r2 = t2.g.l;
  var i2 = Un(t2.g);
  let s2 = (i2 = t2.g.g + i2) - r2;
  if (s2 <= 0 && (t2.g.l = i2, n2(e2, t2, void 0, void 0, void 0), s2 = i2 - t2.g.g), s2) throw Error();
  return t2.g.g = i2, t2.g.l = r2, e2;
}
function qn(t2) {
  var e2 = Un(t2.g), a2 = jn(t2 = t2.g, e2);
  if (t2 = t2.h, o) {
    var c2, h2 = t2;
    (c2 = s) || (c2 = s = new TextDecoder("utf-8", { fatal: true })), e2 = a2 + e2, h2 = 0 === a2 && e2 === h2.length ? h2 : h2.subarray(a2, e2);
    try {
      var u2 = c2.decode(h2);
    } catch (t3) {
      if (void 0 === i) {
        try {
          c2.decode(new Uint8Array([128]));
        } catch (t4) {
        }
        try {
          c2.decode(new Uint8Array([97])), i = true;
        } catch (t4) {
          i = false;
        }
      }
      throw !i && (s = void 0), t3;
    }
  } else {
    e2 = (u2 = a2) + e2, a2 = [];
    let i2, s2 = null;
    for (; u2 < e2; ) {
      var l2 = t2[u2++];
      l2 < 128 ? a2.push(l2) : l2 < 224 ? u2 >= e2 ? n() : (i2 = t2[u2++], l2 < 194 || 128 != (192 & i2) ? (u2--, n()) : a2.push((31 & l2) << 6 | 63 & i2)) : l2 < 240 ? u2 >= e2 - 1 ? n() : (i2 = t2[u2++], 128 != (192 & i2) || 224 === l2 && i2 < 160 || 237 === l2 && i2 >= 160 || 128 != (192 & (c2 = t2[u2++])) ? (u2--, n()) : a2.push((15 & l2) << 12 | (63 & i2) << 6 | 63 & c2)) : l2 <= 244 ? u2 >= e2 - 2 ? n() : (i2 = t2[u2++], 128 != (192 & i2) || i2 - 144 + (l2 << 28) >> 30 != 0 || 128 != (192 & (c2 = t2[u2++])) || 128 != (192 & (h2 = t2[u2++])) ? (u2--, n()) : (l2 = (7 & l2) << 18 | (63 & i2) << 12 | (63 & c2) << 6 | 63 & h2, l2 -= 65536, a2.push(55296 + (l2 >> 10 & 1023), 56320 + (1023 & l2)))) : n(), a2.length >= 8192 && (s2 = r(s2, a2), a2.length = 0);
    }
    u2 = r(s2, a2);
  }
  return u2;
}
function $n(t2) {
  const e2 = Un(t2.g);
  return Vn(t2.g, e2);
}
function Jn(t2, e2, n2) {
  var r2 = Un(t2.g);
  for (r2 = t2.g.g + r2; t2.g.g < r2; ) n2.push(e2(t2.g));
}
var Zn = class {
  constructor(t2, e2, n2, r2) {
    if (Xn.length) {
      const i2 = Xn.pop();
      i2.init(t2, e2, n2, r2), t2 = i2;
    } else t2 = new class {
      constructor(t3, e3, n3, r3) {
        this.h = null, this.j = false, this.g = this.l = this.m = 0, this.init(t3, e3, n3, r3);
      }
      init(t3, e3, n3, { Y: r3 = false, ea: i2 = false } = {}) {
        this.Y = r3, this.ea = i2, t3 && (t3 = Pn(t3, this.ea), this.h = t3.buffer, this.j = t3.g, this.m = e3 || 0, this.l = void 0 !== n3 ? this.m + n3 : this.h.length, this.g = this.m);
      }
      clear() {
        this.h = null, this.j = false, this.g = this.l = this.m = 0, this.Y = false;
      }
    }(t2, e2, n2, r2);
    this.g = t2, this.m = this.g.g, this.h = this.l = -1, this.o(r2);
  }
  o({ ha: t2 = false } = {}) {
    this.ha = t2;
  }
};
var Qn = [];
function tr(t2) {
  return t2 ? /^\d+$/.test(t2) ? (Gt(t2), new er(Rt, It)) : null : nr ||= new er(0, 0);
}
var er = class {
  constructor(t2, e2) {
    this.h = t2 >>> 0, this.g = e2 >>> 0;
  }
};
var nr;
function rr(t2) {
  return t2 ? /^-?\d+$/.test(t2) ? (Gt(t2), new ir(Rt, It)) : null : sr ||= new ir(0, 0);
}
var ir = class {
  constructor(t2, e2) {
    this.h = t2 >>> 0, this.g = e2 >>> 0;
  }
};
var sr;
function or(t2, e2, n2) {
  for (; n2 > 0 || e2 > 127; ) t2.g.push(127 & e2 | 128), e2 = (e2 >>> 7 | n2 << 25) >>> 0, n2 >>>= 7;
  t2.g.push(e2);
}
function ar(t2, e2) {
  for (; e2 > 127; ) t2.g.push(127 & e2 | 128), e2 >>>= 7;
  t2.g.push(e2);
}
function cr(t2, e2) {
  if (e2 >= 0) ar(t2, e2);
  else {
    for (let n2 = 0; n2 < 9; n2++) t2.g.push(127 & e2 | 128), e2 >>= 7;
    t2.g.push(1);
  }
}
function hr(t2) {
  var e2 = Rt;
  t2.g.push(e2 >>> 0 & 255), t2.g.push(e2 >>> 8 & 255), t2.g.push(e2 >>> 16 & 255), t2.g.push(e2 >>> 24 & 255);
}
function ur(t2, e2) {
  0 !== e2.length && (t2.l.push(e2), t2.h += e2.length);
}
function lr(t2, e2, n2) {
  ar(t2.g, 8 * e2 + n2);
}
function fr(t2, e2) {
  return lr(t2, e2, 2), e2 = t2.g.end(), ur(t2, e2), e2.push(t2.h), e2;
}
function dr(t2, e2) {
  var n2 = e2.pop();
  for (n2 = t2.h + t2.g.length() - n2; n2 > 127; ) e2.push(127 & n2 | 128), n2 >>>= 7, t2.h++;
  e2.push(n2), t2.h++;
}
function pr(t2, e2, n2) {
  lr(t2, e2, 2), ar(t2.g, n2.length), ur(t2, t2.g.end()), ur(t2, n2);
}
function gr(t2, e2, n2, r2) {
  null != n2 && (e2 = fr(t2, e2), r2(n2, t2), dr(t2, e2));
}
function mr() {
  const t2 = class {
    constructor() {
      throw Error();
    }
  };
  return Object.setPrototypeOf(t2, t2.prototype), t2;
}
var yr = mr();
var _r = mr();
var vr = mr();
var Er = mr();
var wr = mr();
var Tr = mr();
var Ar = mr();
var br = mr();
var kr = mr();
var Sr = mr();
function xr(t2, e2, n2) {
  var r2 = t2.v;
  H && H in r2 && (r2 = r2[H]) && delete r2[e2.g], e2.h ? e2.j(t2, e2.h, e2.g, n2, e2.l) : e2.j(t2, e2.g, n2, e2.l);
}
var Lr = class {
  constructor(t2, e2) {
    this.v = Ue(t2, e2, void 0, 2048);
  }
  toJSON() {
    return Oe(this);
  }
  j() {
    var t2 = xo, e2 = this.v, n2 = t2.g, r2 = H;
    if (B && r2 && null != e2[r2]?.[n2] && U(W, 3), e2 = t2.g, $ && H && void 0 === $ && (r2 = (n2 = this.v)[H]) && (r2 = r2.da)) try {
      r2(n2, e2, Le);
    } catch (t3) {
      u(t3);
    }
    return t2.h ? t2.m(this, t2.h, t2.g, t2.l) : t2.m(this, t2.g, t2.defaultValue, t2.l);
  }
  clone() {
    const t2 = this.v, e2 = 0 | t2[Q];
    return Ke(this, t2, e2) ? Ge(this, t2, true) : new this.constructor(Ve(t2, e2, false));
  }
};
Lr.prototype[q] = ot, Lr.prototype.toString = function() {
  return this.v.toString();
};
var Rr = class {
  constructor(t2, e2, n2) {
    this.g = t2, this.h = e2, t2 = yr, this.l = !!t2 && n2 === t2 || false;
  }
};
function Ir(t2, e2) {
  return new Rr(t2, e2, yr);
}
function Fr(t2, e2, n2, r2, i2) {
  gr(t2, n2, Xr(e2, r2), i2);
}
var Mr = Ir((function(t2, e2, n2, r2, i2) {
  return 2 === t2.h && (Yn(t2, gn(e2, r2, n2), i2), true);
}), Fr);
var Pr = Ir((function(t2, e2, n2, r2, i2) {
  return 2 === t2.h && (Yn(t2, gn(e2, r2, n2), i2), true);
}), Fr);
var Cr = /* @__PURE__ */ Symbol();
var Or = /* @__PURE__ */ Symbol();
var Nr = /* @__PURE__ */ Symbol();
var Ur = /* @__PURE__ */ Symbol();
var Dr = /* @__PURE__ */ Symbol();
var Br;
var Gr;
function jr(t2, e2, n2, r2) {
  var i2 = r2[t2];
  if (i2) return i2;
  (i2 = {}).qa = r2, i2.T = (function(t3) {
    switch (typeof t3) {
      case "boolean":
        return Pe ||= [0, void 0, true];
      case "number":
        return t3 > 0 ? void 0 : 0 === t3 ? Ce ||= [0, void 0] : [-t3, void 0];
      case "string":
        return [0, t3];
      case "object":
        return t3;
    }
  })(r2[0]);
  var s2 = r2[1];
  let o2 = 1;
  s2 && s2.constructor === Object && (i2.ba = s2, "function" == typeof (s2 = r2[++o2]) && (i2.ma = true, Br ??= s2, Gr ??= r2[o2 + 1], s2 = r2[o2 += 2]));
  const a2 = {};
  for (; s2 && Array.isArray(s2) && s2.length && "number" == typeof s2[0] && s2[0] > 0; ) {
    for (var c2 = 0; c2 < s2.length; c2++) a2[s2[c2]] = s2;
    s2 = r2[++o2];
  }
  for (c2 = 1; void 0 !== s2; ) {
    let t3;
    "number" == typeof s2 && (c2 += s2, s2 = r2[++o2]);
    var h2 = void 0;
    if (s2 instanceof Rr ? t3 = s2 : (t3 = Mr, o2--), t3?.l) {
      s2 = r2[++o2], h2 = r2;
      var u2 = o2;
      "function" == typeof s2 && (s2 = s2(), h2[u2] = s2), h2 = s2;
    }
    for (u2 = c2 + 1, "number" == typeof (s2 = r2[++o2]) && s2 < 0 && (u2 -= s2, s2 = r2[++o2]); c2 < u2; c2++) {
      const r3 = a2[c2];
      h2 ? n2(i2, c2, t3, h2, r3) : e2(i2, c2, t3, r3);
    }
  }
  return r2[t2] = i2;
}
function Vr(t2) {
  return Array.isArray(t2) ? t2[0] instanceof Rr ? t2 : [Pr, t2] : [t2, void 0];
}
function Xr(t2, e2) {
  return t2 instanceof Lr ? t2.v : Array.isArray(t2) ? Ne(t2, e2) : void 0;
}
function Hr(t2, e2, n2, r2) {
  const i2 = n2.g;
  t2[e2] = r2 ? (t3, e3, n3) => i2(t3, e3, n3, r2) : i2;
}
function Wr(t2, e2, n2, r2, i2) {
  const s2 = n2.g;
  let o2, a2;
  t2[e2] = (t3, e3, n3) => s2(t3, e3, n3, a2 ||= jr(Or, Hr, Wr, r2).T, o2 ||= zr(r2), i2);
}
function zr(t2) {
  let e2 = t2[Nr];
  if (null != e2) return e2;
  const n2 = jr(Or, Hr, Wr, t2);
  return e2 = n2.ma ? (t3, e3) => Br(t3, e3, n2) : (t3, e3) => {
    for (; zn(e3) && 4 != e3.h; ) {
      var r2 = e3.l, i2 = n2[r2];
      if (null == i2) {
        var s2 = n2.ba;
        s2 && (s2 = s2[r2]) && (null != (s2 = Yr(s2)) && (i2 = n2[r2] = s2));
      }
      if (null == i2 || !i2(e3, t3, r2)) {
        if (i2 = (s2 = e3).m, Kn(s2), s2.ha) var o2 = void 0;
        else o2 = s2.g.g - i2, s2.g.g = i2, o2 = Vn(s2.g, o2);
        i2 = void 0, s2 = t3, o2 && ((i2 = s2[H] ?? (s2[H] = new xe()))[r2] ?? (i2[r2] = [])).push(o2);
      }
    }
    return (t3 = ke(t3)) && (t3.da = n2.qa[Dr]), true;
  }, t2[Nr] = e2, t2[Dr] = Kr.bind(t2), e2;
}
function Kr(t2, e2, n2, r2) {
  var i2 = this[Or];
  const s2 = this[Nr], o2 = Ne(void 0, i2.T), a2 = ke(t2);
  if (a2) {
    var c2 = false, h2 = i2.ba;
    if (h2) {
      if (i2 = (e3, n3, i3) => {
        if (0 !== i3.length) if (h2[n3]) for (const t3 of i3) {
          e3 = Hn(t3);
          try {
            c2 = true, s2(o2, e3);
          } finally {
            Wn(e3);
          }
        }
        else r2?.(t2, n3, i3);
      }, null == e2) Se(a2, i2);
      else if (null != a2) {
        const t3 = a2[e2];
        t3 && i2(a2, e2, t3);
      }
      if (c2) {
        let r3 = 0 | t2[Q];
        if (2 & r3 && 2048 & r3 && !n2?.Ka) throw Error();
        const i3 = pt(r3), s3 = (e3, s4) => {
          if (null != Je(t2, e3, i3)) {
            if (1 === n2?.Qa) return;
            throw Error();
          }
          null != s4 && (r3 = Qe(t2, r3, e3, s4, i3)), delete a2[e3];
        };
        null == e2 ? ft(o2, 0 | o2[Q], ((t3, e3) => {
          s3(t3, e3);
        })) : s3(e2, Je(o2, e2, i3));
      }
    }
  }
}
function Yr(t2) {
  const e2 = (t2 = Vr(t2))[0].g;
  if (t2 = t2[1]) {
    const n2 = zr(t2), r2 = jr(Or, Hr, Wr, t2).T;
    return (t3, i2, s2) => e2(t3, i2, s2, r2, n2);
  }
  return e2;
}
function qr(t2, e2, n2) {
  t2[e2] = n2.h;
}
function $r(t2, e2, n2, r2) {
  let i2, s2;
  const o2 = n2.h;
  t2[e2] = (t3, e3, n3) => o2(t3, e3, n3, s2 ||= jr(Cr, qr, $r, r2).T, i2 ||= Jr(r2));
}
function Jr(t2) {
  let e2 = t2[Ur];
  if (!e2) {
    const n2 = jr(Cr, qr, $r, t2);
    e2 = (t3, e3) => Zr(t3, e3, n2), t2[Ur] = e2;
  }
  return e2;
}
function Zr(t2, e2, n2) {
  ft(t2, 0 | t2[Q], ((t3, r2) => {
    if (null != r2) {
      var i2 = (function(t4, e3) {
        var n3 = t4[e3];
        if (n3) return n3;
        if ((n3 = t4.ba) && (n3 = n3[e3])) {
          var r3 = (n3 = Vr(n3))[0].h;
          if (n3 = n3[1]) {
            const e4 = Jr(n3), i3 = jr(Cr, qr, $r, n3).T;
            n3 = t4.ma ? Gr(i3, e4) : (t5, n4, s2) => r3(t5, n4, s2, i3, e4);
          } else n3 = r3;
          return t4[e3] = n3;
        }
      })(n2, t3);
      i2 ? i2(e2, r2, t3) : t3 < 500 || U(K, 3);
    }
  })), (t2 = ke(t2)) && Se(t2, ((t3, n3, r2) => {
    for (ur(e2, e2.g.end()), t3 = 0; t3 < r2.length; t3++) ur(e2, I(r2[t3]) || new Uint8Array(0));
  }));
}
var Qr = Et(0);
function ti(t2, e2) {
  if (Array.isArray(e2)) {
    var n2 = 0 | e2[Q];
    if (4 & n2) return e2;
    for (var r2 = 0, i2 = 0; r2 < e2.length; r2++) {
      const n3 = t2(e2[r2]);
      null != n3 && (e2[i2++] = n3);
    }
    return i2 < r2 && (e2.length = i2), (t2 = -1537 & (5 | n2)) !== n2 && rt(e2, t2), 2 & t2 && Object.freeze(e2), e2;
  }
}
function ei(t2, e2, n2) {
  return new Rr(t2, e2, n2);
}
function ni(t2, e2, n2) {
  return new Rr(t2, e2, n2);
}
function ri(t2, e2, n2) {
  Qe(t2, 0 | t2[Q], e2, n2, pt(0 | t2[Q]));
}
var ii = Ir((function(t2, e2, n2, r2, i2) {
  if (2 !== t2.h) return false;
  if (t2 = Vt(t2 = Yn(t2, Ne([void 0, void 0], r2), i2)), i2 = pt(r2 = 0 | e2[Q]), 2 & r2) throw Error();
  let s2 = Je(e2, n2, i2);
  if (s2 instanceof Ee) 0 != (2 & s2.J) ? (s2 = s2.V(), s2.push(t2), Qe(e2, r2, n2, s2, i2)) : s2.Ma(t2);
  else if (Array.isArray(s2)) {
    var o2 = 0 | s2[Q];
    8192 & o2 || rt(s2, o2 |= 8192), 2 & o2 && (s2 = cn(s2), Qe(e2, r2, n2, s2, i2)), s2.push(t2);
  } else Qe(e2, r2, n2, st([t2]), i2);
  return true;
}), (function(t2, e2, n2, r2, i2) {
  if (e2 instanceof Ee) e2.forEach(((e3, s2) => {
    gr(t2, n2, Ne([s2, e3], r2), i2);
  }));
  else if (Array.isArray(e2)) {
    for (let s2 = 0; s2 < e2.length; s2++) {
      const o2 = e2[s2];
      Array.isArray(o2) && gr(t2, n2, Ne(o2, r2), i2);
    }
    st(e2);
  }
}));
function si(t2, e2, n2) {
  null != (e2 = $t(e2)) && (lr(t2, n2, 5), t2 = t2.g, Pt(e2), hr(t2));
}
function oi(t2, e2, n2) {
  if (e2 = (function(t3) {
    if (null == t3) return t3;
    const e3 = typeof t3;
    if ("bigint" === e3) return String(Xt(64, t3));
    if (te(t3)) {
      if ("string" === e3) return se(t3);
      if ("number" === e3) return ie(t3);
    }
  })(e2), null != e2) {
    if ("string" == typeof e2) rr(e2);
    if (null != e2) switch (lr(t2, n2, 0), typeof e2) {
      case "number":
        t2 = t2.g, Mt(e2), or(t2, Rt, It);
        break;
      case "bigint":
        n2 = BigInt.asUintN(64, e2), n2 = new ir(Number(n2 & BigInt(4294967295)), Number(n2 >> BigInt(32))), or(t2.g, n2.h, n2.g);
        break;
      default:
        n2 = rr(e2), or(t2.g, n2.h, n2.g);
    }
  }
}
function ai(t2, e2, n2) {
  null != (e2 = ee(e2)) && null != e2 && (lr(t2, n2, 0), cr(t2.g, e2));
}
function ci(t2, e2, n2) {
  null != (e2 = Zt(e2)) && (lr(t2, n2, 0), t2.g.g.push(e2 ? 1 : 0));
}
function hi(t2, e2, n2) {
  null != (e2 = le(e2)) && pr(t2, n2, h(e2));
}
function ui(t2, e2, n2, r2, i2) {
  gr(t2, n2, Xr(e2, r2), i2);
}
function li(t2, e2, n2) {
  null != (e2 = null == e2 || "string" == typeof e2 || e2 instanceof F ? e2 : void 0) && pr(t2, n2, Pn(e2, true).buffer);
}
function fi(t2, e2, n2) {
  null != (e2 = ne(e2)) && null != e2 && (lr(t2, n2, 0), ar(t2.g, e2));
}
function di(t2, e2, n2) {
  return (5 === t2.h || 2 === t2.h) && (e2 = un(e2, 0 | e2[Q], n2), 2 == t2.h ? Jn(t2, Dn, e2) : e2.push(Dn(t2.g)), true);
}
var pi = ei((function(t2, e2, n2) {
  return 5 === t2.h && (ri(e2, n2, Dn(t2.g)), true);
}), si, br);
var gi = ni(di, (function(t2, e2, n2) {
  if (null != (e2 = ti($t, e2))) for (let o2 = 0; o2 < e2.length; o2++) {
    var r2 = t2, i2 = n2, s2 = e2[o2];
    null != s2 && (lr(r2, i2, 5), r2 = r2.g, Pt(s2), hr(r2));
  }
}), br);
var mi = ni(di, (function(t2, e2, n2) {
  if (null != (e2 = ti($t, e2)) && e2.length) {
    lr(t2, n2, 2), ar(t2.g, 4 * e2.length);
    for (let r2 = 0; r2 < e2.length; r2++) n2 = t2.g, Pt(e2[r2]), hr(n2);
  }
}), br);
var yi = ei((function(t2, e2, n2) {
  return 5 === t2.h && (ri(e2, n2, 0 === (t2 = Dn(t2.g)) ? void 0 : t2), true);
}), si, br);
var _i = ei((function(t2, e2, n2) {
  return 0 !== t2.h ? t2 = false : (ri(e2, n2, Cn(t2.g, Nt)), t2 = true), t2;
}), oi, Tr);
var vi = ei((function(t2, e2, n2) {
  return 0 !== t2.h ? e2 = false : (ri(e2, n2, (t2 = Cn(t2.g, Nt)) === Qr ? void 0 : t2), e2 = true), e2;
}), oi, Tr);
var Ei = ei((function(t2, e2, n2) {
  return 0 !== t2.h ? t2 = false : (ri(e2, n2, Cn(t2.g, Ot)), t2 = true), t2;
}), (function(t2, e2, n2) {
  if (e2 = (function(t3) {
    if (null == t3) return t3;
    var e3 = typeof t3;
    if ("bigint" === e3) return String(Ht(64, t3));
    if (te(t3)) {
      if ("string" === e3) return e3 = Kt(Number(t3)), Wt(e3) && e3 >= 0 ? t3 = String(e3) : (-1 !== (e3 = t3.indexOf(".")) && (t3 = t3.substring(0, e3)), (e3 = "-" !== t3[0] && ((e3 = t3.length) < 20 || 20 === e3 && t3 <= "18446744073709551615")) || (Gt(t3), t3 = Ut(Rt, It))), t3;
      if ("number" === e3) return (t3 = Kt(t3)) >= 0 && Wt(t3) || (Mt(t3), t3 = Ct(Rt, It)), t3;
    }
  })(e2), null != e2) {
    if ("string" == typeof e2) tr(e2);
    if (null != e2) switch (lr(t2, n2, 0), typeof e2) {
      case "number":
        t2 = t2.g, Mt(e2), or(t2, Rt, It);
        break;
      case "bigint":
        n2 = BigInt.asUintN(64, e2), n2 = new er(Number(n2 & BigInt(4294967295)), Number(n2 >> BigInt(32))), or(t2.g, n2.h, n2.g);
        break;
      default:
        n2 = tr(e2), or(t2.g, n2.h, n2.g);
    }
  }
}), Ar);
var wi = ei((function(t2, e2, n2) {
  return 0 === t2.h && (ri(e2, n2, Nn(t2.g)), true);
}), ai, Er);
var Ti = ni((function(t2, e2, n2) {
  return (0 === t2.h || 2 === t2.h) && (e2 = un(e2, 0 | e2[Q], n2), 2 == t2.h ? Jn(t2, Nn, e2) : e2.push(Nn(t2.g)), true);
}), (function(t2, e2, n2) {
  if (null != (e2 = ti(ee, e2)) && e2.length) {
    n2 = fr(t2, n2);
    for (let n3 = 0; n3 < e2.length; n3++) cr(t2.g, e2[n3]);
    dr(t2, n2);
  }
}), Er);
var Ai = ei((function(t2, e2, n2) {
  return 0 === t2.h && (ri(e2, n2, 0 === (t2 = Nn(t2.g)) ? void 0 : t2), true);
}), ai, Er);
var bi = ei((function(t2, e2, n2) {
  return 0 === t2.h && (ri(e2, n2, On(t2.g)), true);
}), ci, _r);
var ki = ei((function(t2, e2, n2) {
  return 0 === t2.h && (ri(e2, n2, false === (t2 = On(t2.g)) ? void 0 : t2), true);
}), ci, _r);
var Si = ni((function(t2, e2, n2) {
  return 2 === t2.h && (t2 = qn(t2), un(e2, 0 | e2[Q], n2).push(t2), true);
}), (function(t2, e2, n2) {
  if (null != (e2 = ti(le, e2))) for (let o2 = 0; o2 < e2.length; o2++) {
    var r2 = t2, i2 = n2, s2 = e2[o2];
    null != s2 && pr(r2, i2, h(s2));
  }
}), vr);
var xi = ei((function(t2, e2, n2) {
  return 2 === t2.h && (ri(e2, n2, "" === (t2 = qn(t2)) ? void 0 : t2), true);
}), hi, vr);
var Li = ei((function(t2, e2, n2) {
  return 2 === t2.h && (ri(e2, n2, qn(t2)), true);
}), hi, vr);
var Ri = (function(t2, e2, n2 = yr) {
  return new Rr(t2, e2, n2);
})((function(t2, e2, n2, r2, i2) {
  return 2 === t2.h && (r2 = Ne(void 0, r2), un(e2, 0 | e2[Q], n2).push(r2), Yn(t2, r2, i2), true);
}), (function(t2, e2, n2, r2, i2) {
  if (Array.isArray(e2)) {
    for (let s2 = 0; s2 < e2.length; s2++) ui(t2, e2[s2], n2, r2, i2);
    1 & (t2 = 0 | e2[Q]) || rt(e2, 1 | t2);
  }
}));
var Ii = Ir((function(t2, e2, n2, r2, i2, s2) {
  if (2 !== t2.h) return false;
  let o2 = 0 | e2[Q];
  return dn(e2, o2, s2, n2, pt(o2)), Yn(t2, e2 = gn(e2, r2, n2), i2), true;
}), ui);
var Fi = ei((function(t2, e2, n2) {
  return 2 === t2.h && (ri(e2, n2, $n(t2)), true);
}), li, kr);
var Mi = ni((function(t2, e2, n2) {
  return (0 === t2.h || 2 === t2.h) && (e2 = un(e2, 0 | e2[Q], n2), 2 == t2.h ? Jn(t2, Un, e2) : e2.push(Un(t2.g)), true);
}), (function(t2, e2, n2) {
  if (null != (e2 = ti(ne, e2))) for (let o2 = 0; o2 < e2.length; o2++) {
    var r2 = t2, i2 = n2, s2 = e2[o2];
    null != s2 && (lr(r2, i2, 0), ar(r2.g, s2));
  }
}), wr);
var Pi = ei((function(t2, e2, n2) {
  return 0 === t2.h && (ri(e2, n2, 0 === (t2 = Un(t2.g)) ? void 0 : t2), true);
}), fi, wr);
var Ci = ei((function(t2, e2, n2) {
  return 0 === t2.h && (ri(e2, n2, Nn(t2.g)), true);
}), (function(t2, e2, n2) {
  null != (e2 = ee(e2)) && (e2 = parseInt(e2, 10), lr(t2, n2, 0), cr(t2.g, e2));
}), Sr);
var Oi = class {
  constructor(t2, e2) {
    var n2 = Qi;
    this.g = t2, this.h = e2, this.m = yn, this.j = wn, this.defaultValue = void 0, this.l = null != n2.Oa ? dt : void 0;
  }
  register() {
    m(this);
  }
};
function Ni(t2, e2) {
  return new Oi(t2, e2);
}
function Ui(t2, e2) {
  return (n2, r2) => {
    {
      const s2 = { ea: true };
      r2 && Object.assign(s2, r2), n2 = Hn(n2, void 0, void 0, s2);
      try {
        const r3 = new t2(), s3 = r3.v;
        zr(e2)(s3, n2);
        var i2 = r3;
      } finally {
        Wn(n2);
      }
    }
    return i2;
  };
}
function Di(t2) {
  return function() {
    const e2 = new class {
      constructor() {
        this.l = [], this.h = 0, this.g = new class {
          constructor() {
            this.g = [];
          }
          length() {
            return this.g.length;
          }
          end() {
            const t3 = this.g;
            return this.g = [], t3;
          }
        }();
      }
    }();
    Zr(this.v, e2, jr(Cr, qr, $r, t2)), ur(e2, e2.g.end());
    const n2 = new Uint8Array(e2.h), r2 = e2.l, i2 = r2.length;
    let s2 = 0;
    for (let t3 = 0; t3 < i2; t3++) {
      const e3 = r2[t3];
      n2.set(e3, s2), s2 += e3.length;
    }
    return e2.l = [n2], n2;
  };
}
var Bi = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Gi = [0, xi, ei((function(t2, e2, n2) {
  return 2 === t2.h && (ri(e2, n2, (t2 = $n(t2)) === R() ? void 0 : t2), true);
}), (function(t2, e2, n2) {
  if (null != e2) {
    if (e2 instanceof Lr) {
      const r2 = e2.Ra;
      return void (r2 ? (e2 = r2(e2), null != e2 && pr(t2, n2, Pn(e2, true).buffer)) : U(K, 3));
    }
    if (Array.isArray(e2)) return void U(K, 3);
  }
  li(t2, e2, n2);
}), kr)];
var ji;
var Vi = globalThis.trustedTypes;
function Xi(t2) {
  var e2;
  return void 0 === ji && (ji = (function() {
    let t3 = null;
    if (!Vi) return t3;
    try {
      const e3 = (t4) => t4;
      t3 = Vi.createPolicy("goog#html", { createHTML: e3, createScript: e3, createScriptURL: e3 });
    } catch (t4) {
    }
    return t3;
  })()), t2 = (e2 = ji) ? e2.createScriptURL(t2) : t2, new class {
    constructor(t3) {
      this.g = t3;
    }
    toString() {
      return this.g + "";
    }
  }(t2);
}
function Hi(t2, ...e2) {
  if (0 === e2.length) return Xi(t2[0]);
  let n2 = t2[0];
  for (let r2 = 0; r2 < e2.length; r2++) n2 += encodeURIComponent(e2[r2]) + t2[r2 + 1];
  return Xi(n2);
}
var Wi = [0, wi, Ci, bi, -1, Ti, Ci, -1, bi];
var zi = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Ki = [0, bi, Li, bi, Ci, -1, ni((function(t2, e2, n2) {
  return (0 === t2.h || 2 === t2.h) && (e2 = un(e2, 0 | e2[Q], n2), 2 == t2.h ? Jn(t2, Bn, e2) : e2.push(Nn(t2.g)), true);
}), (function(t2, e2, n2) {
  if (null != (e2 = ti(ee, e2)) && e2.length) {
    n2 = fr(t2, n2);
    for (let n3 = 0; n3 < e2.length; n3++) cr(t2.g, e2[n3]);
    dr(t2, n2);
  }
}), Sr), Li, -1, [0, bi, -1], Ci, bi, -1];
var Yi = [0, 3, bi, -1, 2, [0, [2], wi, Ii, [0, ei((function(t2, e2, n2) {
  return 0 === t2.h && (ri(e2, n2, Un(t2.g)), true);
}), fi, wr)]], [0, Ci, bi, Ci, bi, Ci, bi, Li, -1], [0, [3, 4], Li, -1, Ii, [0, wi], Ii, [0, Ci]], [0]];
var qi = [0, Li, -2];
var $i = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Ji = [0];
var Zi = [0, wi, bi, 1, bi, -4];
var Qi = class extends Lr {
  constructor(t2) {
    super(t2, 2);
  }
};
var ts = {};
ts[336783863] = [0, Li, bi, -1, wi, [0, [1, 2, 3, 4, 5, 6, 7, 8, 9], Ii, Ji, Ii, Ki, Ii, qi, Ii, Zi, Ii, Wi, Ii, [0, Li, -2], Ii, [0, Li, Ci], Ii, Yi, Ii, [0, Ci, -1, bi]], [0, Li], bi, [0, [1, 3], [2, 4], Ii, [0, Ti], -1, Ii, [0, Si], -1, Ri, [0, Li, -1]], Li];
var es = [0, vi, -1, ki, -3, vi, Ti, xi, Ai, vi, -1, ki, Ai, ki, -2, xi];
function ns(t2, e2) {
  Fn(t2, 3, e2);
}
function rs(t2, e2) {
  Fn(t2, 4, e2);
}
var is = class extends Lr {
  constructor(t2) {
    super(t2, 500);
  }
  o(t2) {
    return wn(this, 0, 7, t2);
  }
};
var ss = [-1, {}];
var os = [0, Li, 1, ss];
var as = [0, Li, Si, ss];
function cs(t2, e2) {
  bn(t2, 1, is, e2);
}
function hs(t2, e2) {
  Fn(t2, 10, e2);
}
function us(t2, e2) {
  Fn(t2, 15, e2);
}
var ls = class extends Lr {
  constructor(t2) {
    super(t2, 500);
  }
  o(t2) {
    return wn(this, 0, 1001, t2);
  }
};
var fs = [-500, Ri, [-500, xi, -1, Si, -3, [-2, ts, bi], Ri, Gi, Ai, -1, os, as, Ri, [0, xi, ki], xi, es, Ai, Si, 987, Si], 4, Ri, [-500, Li, -1, [-1, {}], 998, Li], Ri, [-500, Li, Si, -1, [-2, {}, bi], 997, Si, -1], Ai, Ri, [-500, Li, Si, ss, 998, Si], Si, Ai, os, as, Ri, [0, xi, -1, ss], Si, -2, es, xi, -1, ki, [0, ki, Pi], 978, ss, Ri, Gi];
ls.prototype.g = Di(fs);
var ds = Ui(ls, fs);
var ps = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var gs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
  g() {
    return vn(this, ps, 1);
  }
};
var ms = [0, Ri, [0, wi, pi, Li, -1]];
var ys = Ui(gs, ms);
var _s = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var vs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Es = class extends Lr {
  constructor(t2) {
    super(t2);
  }
  l() {
    return yn(this, _s, 2);
  }
  g() {
    return vn(this, vs, 5);
  }
};
var ws = Ui(class extends Lr {
  constructor(t2) {
    super(t2);
  }
}, [0, Si, Ti, mi, [0, Ci, [0, wi, -3], [0, pi, -3], [0, wi, -1, [0, Ri, [0, wi, -2]]], Ri, [0, pi, -1, Li, pi]], Li, -1, _i, Ri, [0, wi, pi], Si, _i]);
var Ts = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var As = Ui(class extends Lr {
  constructor(t2) {
    super(t2);
  }
}, [0, Ri, [0, pi, -4]]);
var bs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var ks = Ui(class extends Lr {
  constructor(t2) {
    super(t2);
  }
}, [0, Ri, [0, pi, -4]]);
var Ss = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var xs = [0, wi, -1, mi, Ci];
var Ls = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
Ls.prototype.g = Di([0, pi, -4, _i]);
var Rs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Is = Ui(class extends Lr {
  constructor(t2) {
    super(t2);
  }
}, [0, Ri, [0, 1, wi, Li, ms], _i]);
var Fs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Ms = class extends Lr {
  constructor(t2) {
    super(t2);
  }
  na() {
    const t2 = $e(this, 1, void 0, void 0, an);
    return null == t2 ? R() : t2;
  }
};
var Ps = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Cs = [1, 2];
var Os = Ui(class extends Lr {
  constructor(t2) {
    super(t2);
  }
}, [0, Ri, [0, Cs, Ii, [0, mi], Ii, [0, Fi], wi, Li], _i]);
var Ns = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Us = [0, Li, wi, pi, Si, -1];
var Ds = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Bs = [0, bi, -1];
var Gs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var js = [1, 2, 3, 4, 5, 6];
var Vs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
  g() {
    return null != $e(this, 1, void 0, void 0, an);
  }
  l() {
    return null != le($e(this, 2));
  }
};
var Xs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
  g() {
    return Zt($e(this, 2)) ?? false;
  }
};
var Hs = [0, Fi, Li, [0, wi, _i, -1], [0, Ei, _i]];
var Ws = [0, Hs, bi, [0, js, Ii, Zi, Ii, Ki, Ii, Wi, Ii, Ji, Ii, qi, Ii, Yi], Ci];
var zs = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Ks = [0, Ws, pi, -1, wi];
var Ys = Ni(502141897, zs);
ts[502141897] = Ks;
var qs = Ui(class extends Lr {
  constructor(t2) {
    super(t2);
  }
}, [0, [0, Ci, -1, gi, Mi], xs]);
var $s = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Js = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Zs = [0, Ws, pi, [0, Ws], bi];
var Qs = Ni(508968150, Js);
ts[508968150] = [0, Ws, Ks, Zs, pi, [0, [0, Hs]]], ts[508968149] = Zs;
var to = class extends Lr {
  constructor(t2) {
    super(t2);
  }
  l() {
    return yn(this, Ns, 2);
  }
  g() {
    Ze(this, 2);
  }
};
var eo = [0, Ws, Us];
ts[478825465] = eo;
var no = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var ro = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var io = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var so = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var oo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var ao = [0, Ws, [0, Ws], eo, -1];
var co = [0, Ws, pi, wi];
var ho = [0, Ws, pi];
var uo = [0, Ws, co, ho, pi];
var lo = Ni(479097054, oo);
ts[479097054] = [0, Ws, uo, ao], ts[463370452] = ao, ts[464864288] = co;
var fo = Ni(462713202, so);
ts[462713202] = uo, ts[474472470] = ho;
var po = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var go = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var mo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var yo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var _o = [0, Ws, pi, -1, wi];
var vo = [0, Ws, pi, bi];
yo.prototype.g = Di([0, Ws, ho, [0, Ws], Ks, Zs, _o, vo]);
var Eo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var wo = Ni(456383383, Eo);
ts[456383383] = [0, Ws, Us];
var To = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Ao = Ni(476348187, To);
ts[476348187] = [0, Ws, Bs];
var bo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var ko = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var So = [0, Ci, -1];
var xo = Ni(458105876, class extends Lr {
  constructor(t2) {
    super(t2);
  }
  g() {
    let t2;
    var e2 = this.v;
    const n2 = 0 | e2[Q];
    return t2 = at(this, n2), e2 = (function(t3, e3, n3, r2) {
      var i2 = ko;
      !r2 && He(t3) && (n3 = 0 | (e3 = t3.v)[Q]);
      var s2 = Je(e3, 2);
      if (t3 = false, null == s2) {
        if (r2) return be();
        s2 = [];
      } else if (s2.constructor === Ee) {
        if (!(2 & s2.J) || r2) return s2;
        s2 = s2.V();
      } else Array.isArray(s2) ? t3 = !!(2 & (0 | s2[Q])) : s2 = [];
      if (r2) {
        if (!s2.length) return be();
        t3 || (t3 = true, it(s2));
      } else t3 && (t3 = false, st(s2), s2 = cn(s2));
      return !t3 && 32 & n3 && nt(s2, 32), n3 = Qe(e3, n3, 2, r2 = new Ee(s2, i2, de, void 0)), t3 || ze(e3, n3), r2;
    })(this, e2, n2, t2), !t2 && ko && (e2.ra = true), e2;
  }
});
ts[458105876] = [0, So, ii, [true, _i, [0, Li, -1, Si]], [0, Ti, bi, Ci]];
var Lo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Ro = Ni(458105758, Lo);
ts[458105758] = [0, Ws, Li, So];
var Io = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Fo = [0, yi, -1, ki];
var Mo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Po = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Co = [1, 2];
Po.prototype.g = Di([0, Co, Ii, Fo, Ii, [0, Ri, Fo]]);
var Oo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var No = Ni(443442058, Oo);
ts[443442058] = [0, Ws, Li, wi, pi, Si, -1, bi, pi], ts[514774813] = _o;
var Uo = class extends Lr {
  constructor(t2) {
    super(t2);
  }
};
var Do = Ni(516587230, Uo);
function Bo(t2, e2) {
  return e2 = e2 ? e2.clone() : new Ns(), void 0 !== t2.displayNamesLocale ? Ze(e2, 1, ue(t2.displayNamesLocale)) : void 0 === t2.displayNamesLocale && Ze(e2, 1), void 0 !== t2.maxResults ? xn(e2, 2, t2.maxResults) : "maxResults" in t2 && Ze(e2, 2), void 0 !== t2.scoreThreshold ? Ln(e2, 3, t2.scoreThreshold) : "scoreThreshold" in t2 && Ze(e2, 3), void 0 !== t2.categoryAllowlist ? In(e2, 4, t2.categoryAllowlist) : "categoryAllowlist" in t2 && Ze(e2, 4), void 0 !== t2.categoryDenylist ? In(e2, 5, t2.categoryDenylist) : "categoryDenylist" in t2 && Ze(e2, 5), e2;
}
function Go(t2) {
  const e2 = Number(t2);
  return Number.isSafeInteger(e2) ? e2 : String(t2);
}
function jo(t2, e2 = -1, n2 = "") {
  return { categories: t2.map(((t3) => ({ index: kn(t3, 1) ?? 0 ?? -1, score: Sn(t3, 2) ?? 0, categoryName: le($e(t3, 3)) ?? "" ?? "", displayName: le($e(t3, 4)) ?? "" ?? "" }))), headIndex: e2, headName: n2 };
}
function Vo(t2) {
  const e2 = { classifications: vn(t2, Rs, 1).map(((t3) => jo(yn(t3, gs, 4)?.g() ?? [], kn(t3, 2) ?? 0, le($e(t3, 3)) ?? ""))) };
  return null != (function(t3) {
    return null == t3 ? t3 : "bigint" == typeof t3 ? (wt(t3) ? t3 = Number(t3) : (t3 = Xt(64, t3), t3 = wt(t3) ? Number(t3) : String(t3)), t3) : te(t3) ? "number" == typeof t3 ? ie(t3) : se(t3) : void 0;
  })($e(t2, 2, void 0, void 0, ce)) && (e2.timestampMs = Go($e(t2, 2, void 0, void 0, ce) ?? Ye)), e2;
}
function Xo(t2) {
  var e2 = en(t2, 3, $t, tn()), n2 = en(t2, 2, ee, tn()), r2 = en(t2, 1, le, tn()), i2 = en(t2, 9, le, tn());
  const s2 = { categories: [], keypoints: [] };
  for (let t3 = 0; t3 < e2.length; t3++) s2.categories.push({ score: e2[t3], index: n2[t3] ?? -1, categoryName: r2[t3] ?? "", displayName: i2[t3] ?? "" });
  if ((e2 = yn(t2, Es, 4)?.l()) && (s2.boundingBox = { originX: kn(e2, 1, qe) ?? 0, originY: kn(e2, 2, qe) ?? 0, width: kn(e2, 3, qe) ?? 0, height: kn(e2, 4, qe) ?? 0, angle: 0 }), yn(t2, Es, 4)?.g().length) for (const e3 of yn(t2, Es, 4).g()) s2.keypoints.push({ x: $e(e3, 1, void 0, qe, $t) ?? 0, y: $e(e3, 2, void 0, qe, $t) ?? 0, score: $e(e3, 4, void 0, qe, $t) ?? 0, label: le($e(e3, 3, void 0, qe)) ?? "" });
  return s2;
}
function Ho(t2) {
  const e2 = [];
  for (const n2 of vn(t2, bs, 1)) e2.push({ x: Sn(n2, 1) ?? 0, y: Sn(n2, 2) ?? 0, z: Sn(n2, 3) ?? 0, visibility: Sn(n2, 4) ?? 0 });
  return e2;
}
function Wo(t2) {
  const e2 = [];
  for (const n2 of vn(t2, Ts, 1)) e2.push({ x: Sn(n2, 1) ?? 0, y: Sn(n2, 2) ?? 0, z: Sn(n2, 3) ?? 0, visibility: Sn(n2, 4) ?? 0 });
  return e2;
}
function zo(t2) {
  return Array.from(t2, ((t3) => t3 > 127 ? t3 - 256 : t3));
}
function Ko(t2, e2) {
  if (t2.length !== e2.length) throw Error(`Cannot compute cosine similarity between embeddings of different sizes (${t2.length} vs. ${e2.length}).`);
  let n2 = 0, r2 = 0, i2 = 0;
  for (let s2 = 0; s2 < t2.length; s2++) n2 += t2[s2] * e2[s2], r2 += t2[s2] * t2[s2], i2 += e2[s2] * e2[s2];
  if (r2 <= 0 || i2 <= 0) throw Error("Cannot compute cosine similarity on embedding with 0 norm.");
  return n2 / Math.sqrt(r2 * i2);
}
var Yo;
ts[516587230] = [0, Ws, _o, vo, pi], ts[518928384] = vo;
var qo = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]);
async function $o(t2) {
  if (t2) return true;
  if (void 0 === Yo) try {
    await WebAssembly.instantiate(qo), Yo = true;
  } catch {
    Yo = false;
  }
  return Yo;
}
async function Jo(t2, e2, n2) {
  return { wasmLoaderPath: `${e2}/${t2}_${n2 = `wasm${n2 ? "_module" : ""}${await $o(n2) ? "" : "_nosimd"}_internal`}.js`, wasmBinaryPath: `${e2}/${t2}_${n2}.wasm` };
}
var Zo = class {
};
function Qo() {
  var t2 = navigator;
  return "undefined" != typeof OffscreenCanvas && (!(function(t3 = navigator) {
    return (t3 = t3.userAgent).includes("Safari") && !t3.includes("Chrome");
  })(t2) || !!((t2 = t2.userAgent.match(/Version\/([\d]+).*Safari/)) && t2.length >= 1 && Number(t2[1]) >= 17));
}
async function ta(t2) {
  if ("function" != typeof importScripts) {
    const e2 = document.createElement("script");
    return e2.src = t2.toString(), e2.crossOrigin = "anonymous", new Promise(((t3, n2) => {
      e2.addEventListener("load", (() => {
        t3();
      }), false), e2.addEventListener("error", ((t4) => {
        n2(t4);
      }), false), document.body.appendChild(e2);
    }));
  }
  try {
    importScripts(t2.toString());
  } catch (e2) {
    if (!(e2 instanceof TypeError)) throw e2;
    {
      const e3 = self.import;
      e3 ? await e3(t2.toString()) : await import(t2.toString());
    }
  }
}
function ea(t2) {
  return void 0 !== t2.videoWidth ? [t2.videoWidth, t2.videoHeight] : void 0 !== t2.naturalWidth ? [t2.naturalWidth, t2.naturalHeight] : void 0 !== t2.displayWidth ? [t2.displayWidth, t2.displayHeight] : [t2.width, t2.height];
}
function na(t2, e2, n2) {
  t2.m || console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target"), n2(e2 = t2.i.stringToNewUTF8(e2)), t2.i._free(e2);
}
function ra(t2, e2, n2) {
  if (!t2.i.canvas) throw Error("No OpenGL canvas configured.");
  if (n2 ? t2.i._bindTextureToStream(n2) : t2.i._bindTextureToCanvas(), !(n2 = t2.i.canvas.getContext("webgl2") || t2.i.canvas.getContext("webgl"))) throw Error("Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.");
  t2.i.gpuOriginForWebTexturesIsBottomLeft && n2.pixelStorei(n2.UNPACK_FLIP_Y_WEBGL, true), n2.texImage2D(n2.TEXTURE_2D, 0, n2.RGBA, n2.RGBA, n2.UNSIGNED_BYTE, e2), t2.i.gpuOriginForWebTexturesIsBottomLeft && n2.pixelStorei(n2.UNPACK_FLIP_Y_WEBGL, false);
  const [r2, i2] = ea(e2);
  return !t2.l || r2 === t2.i.canvas.width && i2 === t2.i.canvas.height || (t2.i.canvas.width = r2, t2.i.canvas.height = i2), [r2, i2];
}
function ia(t2, e2, n2) {
  t2.m || console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target");
  const r2 = new Uint32Array(e2.length);
  for (let n3 = 0; n3 < e2.length; n3++) r2[n3] = t2.i.stringToNewUTF8(e2[n3]);
  e2 = t2.i._malloc(4 * r2.length), t2.i.HEAPU32.set(r2, e2 >> 2), n2(e2);
  for (const e3 of r2) t2.i._free(e3);
  t2.i._free(e2);
}
function sa(t2, e2, n2) {
  t2.i.simpleListeners = t2.i.simpleListeners || {}, t2.i.simpleListeners[e2] = n2;
}
function oa(t2, e2, n2) {
  let r2 = [];
  t2.i.simpleListeners = t2.i.simpleListeners || {}, t2.i.simpleListeners[e2] = (t3, e3, i2) => {
    e3 ? (n2(r2, i2), r2 = []) : r2.push(t3);
  };
}
Zo.forVisionTasks = function(t2, e2 = false) {
  return Jo("vision", t2 ?? Hi``, e2);
}, Zo.forTextTasks = function(t2, e2 = false) {
  return Jo("text", t2 ?? Hi``, e2);
}, Zo.forGenAiTasks = function(t2, e2 = false) {
  return Jo("genai", t2 ?? Hi``, e2);
}, Zo.forAudioTasks = function(t2, e2 = false) {
  return Jo("audio", t2 ?? Hi``, e2);
}, Zo.isSimdSupported = function(t2 = false) {
  return $o(t2);
};
async function aa(t2, e2, n2, r2) {
  return t2 = await (async (t3, e3, n3, r3, i2) => {
    if (e3 && await ta(e3), !self.ModuleFactory) throw Error("ModuleFactory not set.");
    if (n3 && (await ta(n3), !self.ModuleFactory)) throw Error("ModuleFactory not set.");
    return self.Module && i2 && ((e3 = self.Module).locateFile = i2.locateFile, i2.mainScriptUrlOrBlob && (e3.mainScriptUrlOrBlob = i2.mainScriptUrlOrBlob)), i2 = await self.ModuleFactory(self.Module || i2), self.ModuleFactory = self.Module = void 0, new t3(i2, r3);
  })(t2, n2.wasmLoaderPath, n2.assetLoaderPath, e2, { locateFile: (t3) => t3.endsWith(".wasm") ? n2.wasmBinaryPath.toString() : n2.assetBinaryPath && t3.endsWith(".data") ? n2.assetBinaryPath.toString() : t3 }), await t2.o(r2), t2;
}
function ca(t2, e2) {
  const n2 = yn(t2.baseOptions, Vs, 1) || new Vs();
  "string" == typeof e2 ? (Ze(n2, 2, ue(e2)), Ze(n2, 1)) : e2 instanceof Uint8Array && (Ze(n2, 1, ht(e2, false)), Ze(n2, 2)), wn(t2.baseOptions, 0, 1, n2);
}
function ha(t2) {
  try {
    const e2 = t2.H.length;
    if (1 === e2) throw Error(t2.H[0].message);
    if (e2 > 1) throw Error("Encountered multiple errors: " + t2.H.map(((t3) => t3.message)).join(", "));
  } finally {
    t2.H = [];
  }
}
function ua(t2, e2) {
  t2.C = Math.max(t2.C, e2);
}
function la(t2, e2) {
  t2.B = new is(), Rn(t2.B, 2, "PassThroughCalculator"), ns(t2.B, "free_memory"), rs(t2.B, "free_memory_unused_out"), hs(e2, "free_memory"), cs(e2, t2.B);
}
function fa(t2, e2) {
  ns(t2.B, e2), rs(t2.B, e2 + "_unused_out");
}
function da(t2) {
  t2.g.addBoolToStream(true, "free_memory", t2.C);
}
var pa = class {
  constructor(t2) {
    this.g = t2, this.H = [], this.C = 0, this.g.setAutoRenderToScreen(false);
  }
  l(t2, e2 = true) {
    if (e2) {
      const e3 = t2.baseOptions || {};
      if (t2.baseOptions?.modelAssetBuffer && t2.baseOptions?.modelAssetPath) throw Error("Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer");
      if (!(yn(this.baseOptions, Vs, 1)?.g() || yn(this.baseOptions, Vs, 1)?.l() || t2.baseOptions?.modelAssetBuffer || t2.baseOptions?.modelAssetPath)) throw Error("Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set");
      if ((function(t3, e4) {
        let n2 = yn(t3.baseOptions, Gs, 3);
        if (!n2) {
          var r2 = n2 = new Gs(), i2 = new $i();
          Tn(r2, 4, js, i2);
        }
        "delegate" in e4 && ("GPU" === e4.delegate ? (e4 = n2, r2 = new zi(), Tn(e4, 2, js, r2)) : (e4 = n2, r2 = new $i(), Tn(e4, 4, js, r2))), wn(t3.baseOptions, 0, 3, n2);
      })(this, e3), e3.modelAssetPath) return fetch(e3.modelAssetPath.toString()).then(((t3) => {
        if (t3.ok) return t3.arrayBuffer();
        throw Error(`Failed to fetch model: ${e3.modelAssetPath} (${t3.status})`);
      })).then(((t3) => {
        try {
          this.g.i.FS_unlink("/model.dat");
        } catch {
        }
        this.g.i.FS_createDataFile("/", "model.dat", new Uint8Array(t3), true, false, false), ca(this, "/model.dat"), this.m(), this.L();
      }));
      if (e3.modelAssetBuffer instanceof Uint8Array) ca(this, e3.modelAssetBuffer);
      else if (e3.modelAssetBuffer) return (async function(t3) {
        const e4 = [];
        for (var n2 = 0; ; ) {
          const { done: r2, value: i2 } = await t3.read();
          if (r2) break;
          e4.push(i2), n2 += i2.length;
        }
        if (0 === e4.length) return new Uint8Array(0);
        if (1 === e4.length) return e4[0];
        t3 = new Uint8Array(n2), n2 = 0;
        for (const r2 of e4) t3.set(r2, n2), n2 += r2.length;
        return t3;
      })(e3.modelAssetBuffer).then(((t3) => {
        ca(this, t3), this.m(), this.L();
      }));
    }
    return this.m(), this.L(), Promise.resolve();
  }
  L() {
  }
  ca() {
    let t2;
    if (this.g.ca(((e2) => {
      t2 = ds(e2);
    })), !t2) throw Error("Failed to retrieve CalculatorGraphConfig");
    return t2;
  }
  setGraph(t2, e2) {
    this.g.attachErrorListener(((t3, e3) => {
      this.H.push(Error(e3));
    })), this.g.Ja(), this.g.setGraph(t2, e2), this.B = void 0, ha(this);
  }
  finishProcessing() {
    this.g.finishProcessing(), ha(this);
  }
  close() {
    this.B = void 0, this.g.closeGraph();
  }
};
function ga(t2, e2) {
  if (!t2) throw Error(`Unable to obtain required WebGL resource: ${e2}`);
  return t2;
}
pa.prototype.close = pa.prototype.close;
var ma = class {
  constructor(t2, e2, n2, r2) {
    this.g = t2, this.h = e2, this.m = n2, this.l = r2;
  }
  bind() {
    this.g.bindVertexArray(this.h);
  }
  close() {
    this.g.deleteVertexArray(this.h), this.g.deleteBuffer(this.m), this.g.deleteBuffer(this.l);
  }
};
function ya(t2, e2, n2) {
  const r2 = t2.g;
  if (n2 = ga(r2.createShader(n2), "Failed to create WebGL shader"), r2.shaderSource(n2, e2), r2.compileShader(n2), !r2.getShaderParameter(n2, r2.COMPILE_STATUS)) throw Error(`Could not compile WebGL shader: ${r2.getShaderInfoLog(n2)}`);
  return r2.attachShader(t2.h, n2), n2;
}
function _a(t2, e2) {
  const n2 = t2.g, r2 = ga(n2.createVertexArray(), "Failed to create vertex array");
  n2.bindVertexArray(r2);
  const i2 = ga(n2.createBuffer(), "Failed to create buffer");
  n2.bindBuffer(n2.ARRAY_BUFFER, i2), n2.enableVertexAttribArray(t2.O), n2.vertexAttribPointer(t2.O, 2, n2.FLOAT, false, 0, 0), n2.bufferData(n2.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), n2.STATIC_DRAW);
  const s2 = ga(n2.createBuffer(), "Failed to create buffer");
  return n2.bindBuffer(n2.ARRAY_BUFFER, s2), n2.enableVertexAttribArray(t2.L), n2.vertexAttribPointer(t2.L, 2, n2.FLOAT, false, 0, 0), n2.bufferData(n2.ARRAY_BUFFER, new Float32Array(e2 ? [0, 1, 0, 0, 1, 0, 1, 1] : [0, 0, 0, 1, 1, 1, 1, 0]), n2.STATIC_DRAW), n2.bindBuffer(n2.ARRAY_BUFFER, null), n2.bindVertexArray(null), new ma(n2, r2, i2, s2);
}
function va(t2, e2) {
  if (t2.g) {
    if (e2 !== t2.g) throw Error("Cannot change GL context once initialized");
  } else t2.g = e2;
}
function Ea(t2, e2, n2, r2) {
  return va(t2, e2), t2.h || (t2.m(), t2.D()), n2 ? (t2.u || (t2.u = _a(t2, true)), n2 = t2.u) : (t2.A || (t2.A = _a(t2, false)), n2 = t2.A), e2.useProgram(t2.h), n2.bind(), t2.l(), t2 = r2(), n2.g.bindVertexArray(null), t2;
}
function wa(t2, e2, n2) {
  return va(t2, e2), t2 = ga(e2.createTexture(), "Failed to create texture"), e2.bindTexture(e2.TEXTURE_2D, t2), e2.texParameteri(e2.TEXTURE_2D, e2.TEXTURE_WRAP_S, e2.CLAMP_TO_EDGE), e2.texParameteri(e2.TEXTURE_2D, e2.TEXTURE_WRAP_T, e2.CLAMP_TO_EDGE), e2.texParameteri(e2.TEXTURE_2D, e2.TEXTURE_MIN_FILTER, n2 ?? e2.LINEAR), e2.texParameteri(e2.TEXTURE_2D, e2.TEXTURE_MAG_FILTER, n2 ?? e2.LINEAR), e2.bindTexture(e2.TEXTURE_2D, null), t2;
}
function Ta(t2, e2, n2) {
  va(t2, e2), t2.B || (t2.B = ga(e2.createFramebuffer(), "Failed to create framebuffe.")), e2.bindFramebuffer(e2.FRAMEBUFFER, t2.B), e2.framebufferTexture2D(e2.FRAMEBUFFER, e2.COLOR_ATTACHMENT0, e2.TEXTURE_2D, n2, 0);
}
function Aa(t2) {
  t2.g?.bindFramebuffer(t2.g.FRAMEBUFFER, null);
}
var ba = class {
  H() {
    return "\n  precision mediump float;\n  varying vec2 vTex;\n  uniform sampler2D inputTexture;\n  void main() {\n    gl_FragColor = texture2D(inputTexture, vTex);\n  }\n ";
  }
  m() {
    const t2 = this.g;
    if (this.h = ga(t2.createProgram(), "Failed to create WebGL program"), this.X = ya(this, "\n  attribute vec2 aVertex;\n  attribute vec2 aTex;\n  varying vec2 vTex;\n  void main(void) {\n    gl_Position = vec4(aVertex, 0.0, 1.0);\n    vTex = aTex;\n  }", t2.VERTEX_SHADER), this.W = ya(this, this.H(), t2.FRAGMENT_SHADER), t2.linkProgram(this.h), !t2.getProgramParameter(this.h, t2.LINK_STATUS)) throw Error(`Error during program linking: ${t2.getProgramInfoLog(this.h)}`);
    this.O = t2.getAttribLocation(this.h, "aVertex"), this.L = t2.getAttribLocation(this.h, "aTex");
  }
  D() {
  }
  l() {
  }
  close() {
    if (this.h) {
      const t2 = this.g;
      t2.deleteProgram(this.h), t2.deleteShader(this.X), t2.deleteShader(this.W);
    }
    this.B && this.g.deleteFramebuffer(this.B), this.A && this.A.close(), this.u && this.u.close();
  }
};
var ka = class extends ba {
  H() {
    return "\n  precision mediump float;\n  uniform sampler2D backgroundTexture;\n  uniform sampler2D maskTexture;\n  uniform sampler2D colorMappingTexture;\n  varying vec2 vTex;\n  void main() {\n    vec4 backgroundColor = texture2D(backgroundTexture, vTex);\n    float category = texture2D(maskTexture, vTex).r;\n    vec4 categoryColor = texture2D(colorMappingTexture, vec2(category, 0.0));\n    gl_FragColor = mix(backgroundColor, categoryColor, categoryColor.a);\n  }\n ";
  }
  D() {
    const t2 = this.g;
    t2.activeTexture(t2.TEXTURE1), this.C = wa(this, t2, t2.LINEAR), t2.activeTexture(t2.TEXTURE2), this.j = wa(this, t2, t2.NEAREST);
  }
  m() {
    super.m();
    const t2 = this.g;
    this.P = ga(t2.getUniformLocation(this.h, "backgroundTexture"), "Uniform location"), this.U = ga(t2.getUniformLocation(this.h, "colorMappingTexture"), "Uniform location"), this.M = ga(t2.getUniformLocation(this.h, "maskTexture"), "Uniform location");
  }
  l() {
    super.l();
    const t2 = this.g;
    t2.uniform1i(this.M, 0), t2.uniform1i(this.P, 1), t2.uniform1i(this.U, 2);
  }
  close() {
    this.C && this.g.deleteTexture(this.C), this.j && this.g.deleteTexture(this.j), super.close();
  }
};
var Sa = class extends ba {
  H() {
    return "\n  precision mediump float;\n  uniform sampler2D maskTexture;\n  uniform sampler2D defaultTexture;\n  uniform sampler2D overlayTexture;\n  varying vec2 vTex;\n  void main() {\n    float confidence = texture2D(maskTexture, vTex).r;\n    vec4 defaultColor = texture2D(defaultTexture, vTex);\n    vec4 overlayColor = texture2D(overlayTexture, vTex);\n    // Apply the alpha from the overlay and merge in the default color\n    overlayColor = mix(defaultColor, overlayColor, overlayColor.a);\n    gl_FragColor = mix(defaultColor, overlayColor, confidence);\n  }\n ";
  }
  D() {
    const t2 = this.g;
    t2.activeTexture(t2.TEXTURE1), this.j = wa(this, t2), t2.activeTexture(t2.TEXTURE2), this.C = wa(this, t2);
  }
  m() {
    super.m();
    const t2 = this.g;
    this.M = ga(t2.getUniformLocation(this.h, "defaultTexture"), "Uniform location"), this.P = ga(t2.getUniformLocation(this.h, "overlayTexture"), "Uniform location"), this.I = ga(t2.getUniformLocation(this.h, "maskTexture"), "Uniform location");
  }
  l() {
    super.l();
    const t2 = this.g;
    t2.uniform1i(this.I, 0), t2.uniform1i(this.M, 1), t2.uniform1i(this.P, 2);
  }
  close() {
    this.j && this.g.deleteTexture(this.j), this.C && this.g.deleteTexture(this.C), super.close();
  }
};
function xa(t2, e2) {
  switch (e2) {
    case 0:
      return t2.g.find(((t3) => t3 instanceof Uint8Array));
    case 1:
      return t2.g.find(((t3) => t3 instanceof Float32Array));
    case 2:
      return t2.g.find(((t3) => "undefined" != typeof WebGLTexture && t3 instanceof WebGLTexture));
    default:
      throw Error(`Type is not supported: ${e2}`);
  }
}
function La(t2) {
  var e2 = xa(t2, 1);
  if (!e2) {
    if (e2 = xa(t2, 0)) e2 = new Float32Array(e2).map(((t3) => t3 / 255));
    else {
      e2 = new Float32Array(t2.width * t2.height);
      const r2 = Ia(t2);
      var n2 = Ma(t2);
      if (Ta(n2, r2, Ra(t2)), "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform) || navigator.userAgent.includes("Mac") && "document" in self && "ontouchend" in self.document) {
        n2 = new Float32Array(t2.width * t2.height * 4), r2.readPixels(0, 0, t2.width, t2.height, r2.RGBA, r2.FLOAT, n2);
        for (let t3 = 0, r3 = 0; t3 < e2.length; ++t3, r3 += 4) e2[t3] = n2[r3];
      } else r2.readPixels(0, 0, t2.width, t2.height, r2.RED, r2.FLOAT, e2);
    }
    t2.g.push(e2);
  }
  return e2;
}
function Ra(t2) {
  let e2 = xa(t2, 2);
  if (!e2) {
    const n2 = Ia(t2);
    e2 = Pa(t2);
    const r2 = La(t2), i2 = Fa(t2);
    n2.texImage2D(n2.TEXTURE_2D, 0, i2, t2.width, t2.height, 0, n2.RED, n2.FLOAT, r2), Ca(t2);
  }
  return e2;
}
function Ia(t2) {
  if (!t2.canvas) throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");
  return t2.h || (t2.h = ga(t2.canvas.getContext("webgl2"), "You cannot use a canvas that is already bound to a different type of rendering context.")), t2.h;
}
function Fa(t2) {
  if (t2 = Ia(t2), !Oa) if (t2.getExtension("EXT_color_buffer_float") && t2.getExtension("OES_texture_float_linear") && t2.getExtension("EXT_float_blend")) Oa = t2.R32F;
  else {
    if (!t2.getExtension("EXT_color_buffer_half_float")) throw Error("GPU does not fully support 4-channel float32 or float16 formats");
    Oa = t2.R16F;
  }
  return Oa;
}
function Ma(t2) {
  return t2.l || (t2.l = new ba()), t2.l;
}
function Pa(t2) {
  const e2 = Ia(t2);
  e2.viewport(0, 0, t2.width, t2.height), e2.activeTexture(e2.TEXTURE0);
  let n2 = xa(t2, 2);
  return n2 || (n2 = wa(Ma(t2), e2, t2.m ? e2.LINEAR : e2.NEAREST), t2.g.push(n2), t2.j = true), e2.bindTexture(e2.TEXTURE_2D, n2), n2;
}
function Ca(t2) {
  t2.h.bindTexture(t2.h.TEXTURE_2D, null);
}
var Oa;
var Na = class {
  constructor(t2, e2, n2, r2, i2, s2, o2) {
    this.g = t2, this.m = e2, this.j = n2, this.canvas = r2, this.l = i2, this.width = s2, this.height = o2, this.j && (0 === --Ua && console.error("You seem to be creating MPMask instances without invoking .close(). This leaks resources."));
  }
  Fa() {
    return !!xa(this, 0);
  }
  ka() {
    return !!xa(this, 1);
  }
  R() {
    return !!xa(this, 2);
  }
  ja() {
    return (e2 = xa(t2 = this, 0)) || (e2 = La(t2), e2 = new Uint8Array(e2.map(((t3) => Math.round(255 * t3)))), t2.g.push(e2)), e2;
    var t2, e2;
  }
  ia() {
    return La(this);
  }
  N() {
    return Ra(this);
  }
  clone() {
    const t2 = [];
    for (const e2 of this.g) {
      let n2;
      if (e2 instanceof Uint8Array) n2 = new Uint8Array(e2);
      else if (e2 instanceof Float32Array) n2 = new Float32Array(e2);
      else {
        if (!(e2 instanceof WebGLTexture)) throw Error(`Type is not supported: ${e2}`);
        {
          const t3 = Ia(this), e3 = Ma(this);
          t3.activeTexture(t3.TEXTURE1), n2 = wa(e3, t3, this.m ? t3.LINEAR : t3.NEAREST), t3.bindTexture(t3.TEXTURE_2D, n2);
          const r2 = Fa(this);
          t3.texImage2D(t3.TEXTURE_2D, 0, r2, this.width, this.height, 0, t3.RED, t3.FLOAT, null), t3.bindTexture(t3.TEXTURE_2D, null), Ta(e3, t3, n2), Ea(e3, t3, false, (() => {
            Pa(this), t3.clearColor(0, 0, 0, 0), t3.clear(t3.COLOR_BUFFER_BIT), t3.drawArrays(t3.TRIANGLE_FAN, 0, 4), Ca(this);
          })), Aa(e3), Ca(this);
        }
      }
      t2.push(n2);
    }
    return new Na(t2, this.m, this.R(), this.canvas, this.l, this.width, this.height);
  }
  close() {
    this.j && Ia(this).deleteTexture(xa(this, 2)), Ua = -1;
  }
};
Na.prototype.close = Na.prototype.close, Na.prototype.clone = Na.prototype.clone, Na.prototype.getAsWebGLTexture = Na.prototype.N, Na.prototype.getAsFloat32Array = Na.prototype.ia, Na.prototype.getAsUint8Array = Na.prototype.ja, Na.prototype.hasWebGLTexture = Na.prototype.R, Na.prototype.hasFloat32Array = Na.prototype.ka, Na.prototype.hasUint8Array = Na.prototype.Fa;
var Ua = 250;
var Da = { color: "white", lineWidth: 4, radius: 6 };
function Ba(t2) {
  return { ...Da, fillColor: (t2 = t2 || {}).color, ...t2 };
}
function Ga(t2, e2) {
  return t2 instanceof Function ? t2(e2) : t2;
}
function ja(t2, e2, n2) {
  return Math.max(Math.min(e2, n2), Math.min(Math.max(e2, n2), t2));
}
function Va(t2) {
  if (!t2.l) throw Error("CPU rendering requested but CanvasRenderingContext2D not provided.");
  return t2.l;
}
function Xa(t2) {
  if (!t2.j) throw Error("GPU rendering requested but WebGL2RenderingContext not provided.");
  return t2.j;
}
function Ha(t2, e2, n2) {
  if (e2.R()) n2(e2.N());
  else {
    const r2 = e2.ka() ? e2.ia() : e2.ja();
    t2.m = t2.m ?? new ba();
    const i2 = Xa(t2);
    n2((t2 = new Na([r2], e2.m, false, i2.canvas, t2.m, e2.width, e2.height)).N()), t2.close();
  }
}
function Wa(t2, e2, n2, r2) {
  const i2 = (function(t3) {
    return t3.g || (t3.g = new ka()), t3.g;
  })(t2), s2 = Xa(t2), o2 = Array.isArray(n2) ? new ImageData(new Uint8ClampedArray(n2), 1, 1) : n2;
  Ea(i2, s2, true, (() => {
    !(function(t4, e3, n3, r3) {
      const i3 = t4.g;
      if (i3.activeTexture(i3.TEXTURE0), i3.bindTexture(i3.TEXTURE_2D, e3), i3.activeTexture(i3.TEXTURE1), i3.bindTexture(i3.TEXTURE_2D, t4.C), i3.texImage2D(i3.TEXTURE_2D, 0, i3.RGBA, i3.RGBA, i3.UNSIGNED_BYTE, n3), t4.I && (function(t5, e4) {
        if (t5 !== e4) return false;
        t5 = t5.entries(), e4 = e4.entries();
        for (const [n4, r4] of t5) {
          t5 = n4;
          const i4 = r4, s3 = e4.next();
          if (s3.done) return false;
          const [o3, a2] = s3.value;
          if (t5 !== o3 || i4[0] !== a2[0] || i4[1] !== a2[1] || i4[2] !== a2[2] || i4[3] !== a2[3]) return false;
        }
        return !!e4.next().done;
      })(t4.I, r3)) i3.activeTexture(i3.TEXTURE2), i3.bindTexture(i3.TEXTURE_2D, t4.j);
      else {
        t4.I = r3;
        const e4 = Array(1024).fill(0);
        r3.forEach(((t5, n4) => {
          if (4 !== t5.length) throw Error(`Color at index ${n4} is not a four-channel value.`);
          e4[4 * n4] = t5[0], e4[4 * n4 + 1] = t5[1], e4[4 * n4 + 2] = t5[2], e4[4 * n4 + 3] = t5[3];
        })), i3.activeTexture(i3.TEXTURE2), i3.bindTexture(i3.TEXTURE_2D, t4.j), i3.texImage2D(i3.TEXTURE_2D, 0, i3.RGBA, 256, 1, 0, i3.RGBA, i3.UNSIGNED_BYTE, new Uint8Array(e4));
      }
    })(i2, e2, o2, r2), s2.clearColor(0, 0, 0, 0), s2.clear(s2.COLOR_BUFFER_BIT), s2.drawArrays(s2.TRIANGLE_FAN, 0, 4);
    const t3 = i2.g;
    t3.activeTexture(t3.TEXTURE0), t3.bindTexture(t3.TEXTURE_2D, null), t3.activeTexture(t3.TEXTURE1), t3.bindTexture(t3.TEXTURE_2D, null), t3.activeTexture(t3.TEXTURE2), t3.bindTexture(t3.TEXTURE_2D, null);
  }));
}
function za(t2, e2, n2, r2) {
  const i2 = Xa(t2), s2 = (function(t3) {
    return t3.h || (t3.h = new Sa()), t3.h;
  })(t2), o2 = Array.isArray(n2) ? new ImageData(new Uint8ClampedArray(n2), 1, 1) : n2, a2 = Array.isArray(r2) ? new ImageData(new Uint8ClampedArray(r2), 1, 1) : r2;
  Ea(s2, i2, true, (() => {
    var t3 = s2.g;
    t3.activeTexture(t3.TEXTURE0), t3.bindTexture(t3.TEXTURE_2D, e2), t3.activeTexture(t3.TEXTURE1), t3.bindTexture(t3.TEXTURE_2D, s2.j), t3.texImage2D(t3.TEXTURE_2D, 0, t3.RGBA, t3.RGBA, t3.UNSIGNED_BYTE, o2), t3.activeTexture(t3.TEXTURE2), t3.bindTexture(t3.TEXTURE_2D, s2.C), t3.texImage2D(t3.TEXTURE_2D, 0, t3.RGBA, t3.RGBA, t3.UNSIGNED_BYTE, a2), i2.clearColor(0, 0, 0, 0), i2.clear(i2.COLOR_BUFFER_BIT), i2.drawArrays(i2.TRIANGLE_FAN, 0, 4), i2.bindTexture(i2.TEXTURE_2D, null), (t3 = s2.g).activeTexture(t3.TEXTURE0), t3.bindTexture(t3.TEXTURE_2D, null), t3.activeTexture(t3.TEXTURE1), t3.bindTexture(t3.TEXTURE_2D, null), t3.activeTexture(t3.TEXTURE2), t3.bindTexture(t3.TEXTURE_2D, null);
  }));
}
var Ka = class {
  constructor(t2, e2) {
    "undefined" != typeof CanvasRenderingContext2D && t2 instanceof CanvasRenderingContext2D || t2 instanceof OffscreenCanvasRenderingContext2D ? (this.l = t2, this.j = e2) : this.j = t2;
  }
  ya(t2, e2) {
    if (t2) {
      var n2 = Va(this);
      e2 = Ba(e2), n2.save();
      var r2 = n2.canvas, i2 = 0;
      for (const s2 of t2) n2.fillStyle = Ga(e2.fillColor, { index: i2, from: s2 }), n2.strokeStyle = Ga(e2.color, { index: i2, from: s2 }), n2.lineWidth = Ga(e2.lineWidth, { index: i2, from: s2 }), (t2 = new Path2D()).arc(s2.x * r2.width, s2.y * r2.height, Ga(e2.radius, { index: i2, from: s2 }), 0, 2 * Math.PI), n2.fill(t2), n2.stroke(t2), ++i2;
      n2.restore();
    }
  }
  xa(t2, e2, n2) {
    if (t2 && e2) {
      var r2 = Va(this);
      n2 = Ba(n2), r2.save();
      var i2 = r2.canvas, s2 = 0;
      for (const o2 of e2) {
        r2.beginPath(), e2 = t2[o2.start];
        const a2 = t2[o2.end];
        e2 && a2 && (r2.strokeStyle = Ga(n2.color, { index: s2, from: e2, to: a2 }), r2.lineWidth = Ga(n2.lineWidth, { index: s2, from: e2, to: a2 }), r2.moveTo(e2.x * i2.width, e2.y * i2.height), r2.lineTo(a2.x * i2.width, a2.y * i2.height)), ++s2, r2.stroke();
      }
      r2.restore();
    }
  }
  ua(t2, e2) {
    const n2 = Va(this);
    e2 = Ba(e2), n2.save(), n2.beginPath(), n2.lineWidth = Ga(e2.lineWidth, {}), n2.strokeStyle = Ga(e2.color, {}), n2.fillStyle = Ga(e2.fillColor, {}), n2.moveTo(t2.originX, t2.originY), n2.lineTo(t2.originX + t2.width, t2.originY), n2.lineTo(t2.originX + t2.width, t2.originY + t2.height), n2.lineTo(t2.originX, t2.originY + t2.height), n2.lineTo(t2.originX, t2.originY), n2.stroke(), n2.fill(), n2.restore();
  }
  va(t2, e2, n2 = [0, 0, 0, 255]) {
    this.l ? (function(t3, e3, n3, r2) {
      const i2 = Xa(t3);
      Ha(t3, e3, ((e4) => {
        Wa(t3, e4, n3, r2), (e4 = Va(t3)).drawImage(i2.canvas, 0, 0, e4.canvas.width, e4.canvas.height);
      }));
    })(this, t2, n2, e2) : Wa(this, t2.N(), n2, e2);
  }
  wa(t2, e2, n2) {
    this.l ? (function(t3, e3, n3, r2) {
      const i2 = Xa(t3);
      Ha(t3, e3, ((e4) => {
        za(t3, e4, n3, r2), (e4 = Va(t3)).drawImage(i2.canvas, 0, 0, e4.canvas.width, e4.canvas.height);
      }));
    })(this, t2, e2, n2) : za(this, t2.N(), e2, n2);
  }
  close() {
    this.g?.close(), this.g = void 0, this.h?.close(), this.h = void 0, this.m?.close(), this.m = void 0;
  }
};
function Ya(t2, e2) {
  switch (e2) {
    case 0:
      return t2.g.find(((t3) => t3 instanceof ImageData));
    case 1:
      return t2.g.find(((t3) => "undefined" != typeof ImageBitmap && t3 instanceof ImageBitmap));
    case 2:
      return t2.g.find(((t3) => "undefined" != typeof WebGLTexture && t3 instanceof WebGLTexture));
    default:
      throw Error(`Type is not supported: ${e2}`);
  }
}
function qa(t2) {
  var e2 = Ya(t2, 0);
  if (!e2) {
    e2 = Ja(t2);
    const n2 = Za(t2), r2 = new Uint8Array(t2.width * t2.height * 4);
    Ta(n2, e2, $a(t2)), e2.readPixels(0, 0, t2.width, t2.height, e2.RGBA, e2.UNSIGNED_BYTE, r2), Aa(n2), e2 = new ImageData(new Uint8ClampedArray(r2.buffer), t2.width, t2.height), t2.g.push(e2);
  }
  return e2;
}
function $a(t2) {
  let e2 = Ya(t2, 2);
  if (!e2) {
    const n2 = Ja(t2);
    e2 = Qa(t2);
    const r2 = Ya(t2, 1) || qa(t2);
    n2.texImage2D(n2.TEXTURE_2D, 0, n2.RGBA, n2.RGBA, n2.UNSIGNED_BYTE, r2), tc(t2);
  }
  return e2;
}
function Ja(t2) {
  if (!t2.canvas) throw Error("Conversion to different image formats require that a canvas is passed when initializing the image.");
  return t2.h || (t2.h = ga(t2.canvas.getContext("webgl2"), "You cannot use a canvas that is already bound to a different type of rendering context.")), t2.h;
}
function Za(t2) {
  return t2.l || (t2.l = new ba()), t2.l;
}
function Qa(t2) {
  const e2 = Ja(t2);
  e2.viewport(0, 0, t2.width, t2.height), e2.activeTexture(e2.TEXTURE0);
  let n2 = Ya(t2, 2);
  return n2 || (n2 = wa(Za(t2), e2), t2.g.push(n2), t2.m = true), e2.bindTexture(e2.TEXTURE_2D, n2), n2;
}
function tc(t2) {
  t2.h.bindTexture(t2.h.TEXTURE_2D, null);
}
function ec(t2) {
  const e2 = Ja(t2);
  return Ea(Za(t2), e2, true, (() => (function(t3, e3) {
    const n2 = t3.canvas;
    if (n2.width === t3.width && n2.height === t3.height) return e3();
    const r2 = n2.width, i2 = n2.height;
    return n2.width = t3.width, n2.height = t3.height, t3 = e3(), n2.width = r2, n2.height = i2, t3;
  })(t2, (() => {
    if (e2.bindFramebuffer(e2.FRAMEBUFFER, null), e2.clearColor(0, 0, 0, 0), e2.clear(e2.COLOR_BUFFER_BIT), e2.drawArrays(e2.TRIANGLE_FAN, 0, 4), !(t2.canvas instanceof OffscreenCanvas)) throw Error("Conversion to ImageBitmap requires that the MediaPipe Tasks is initialized with an OffscreenCanvas");
    return t2.canvas.transferToImageBitmap();
  }))));
}
Ka.prototype.close = Ka.prototype.close, Ka.prototype.drawConfidenceMask = Ka.prototype.wa, Ka.prototype.drawCategoryMask = Ka.prototype.va, Ka.prototype.drawBoundingBox = Ka.prototype.ua, Ka.prototype.drawConnectors = Ka.prototype.xa, Ka.prototype.drawLandmarks = Ka.prototype.ya, Ka.lerp = function(t2, e2, n2, r2, i2) {
  return ja(r2 * (1 - (t2 - e2) / (n2 - e2)) + i2 * (1 - (n2 - t2) / (n2 - e2)), r2, i2);
}, Ka.clamp = ja;
var nc = class {
  constructor(t2, e2, n2, r2, i2, s2, o2) {
    this.g = t2, this.j = e2, this.m = n2, this.canvas = r2, this.l = i2, this.width = s2, this.height = o2, (this.j || this.m) && (0 === --rc && console.error("You seem to be creating MPImage instances without invoking .close(). This leaks resources."));
  }
  Ea() {
    return !!Ya(this, 0);
  }
  la() {
    return !!Ya(this, 1);
  }
  R() {
    return !!Ya(this, 2);
  }
  Ca() {
    return qa(this);
  }
  Ba() {
    var t2 = Ya(this, 1);
    return t2 || ($a(this), Qa(this), t2 = ec(this), tc(this), this.g.push(t2), this.j = true), t2;
  }
  N() {
    return $a(this);
  }
  clone() {
    const t2 = [];
    for (const e2 of this.g) {
      let n2;
      if (e2 instanceof ImageData) n2 = new ImageData(e2.data, this.width, this.height);
      else if (e2 instanceof WebGLTexture) {
        const t3 = Ja(this), e3 = Za(this);
        t3.activeTexture(t3.TEXTURE1), n2 = wa(e3, t3), t3.bindTexture(t3.TEXTURE_2D, n2), t3.texImage2D(t3.TEXTURE_2D, 0, t3.RGBA, this.width, this.height, 0, t3.RGBA, t3.UNSIGNED_BYTE, null), t3.bindTexture(t3.TEXTURE_2D, null), Ta(e3, t3, n2), Ea(e3, t3, false, (() => {
          Qa(this), t3.clearColor(0, 0, 0, 0), t3.clear(t3.COLOR_BUFFER_BIT), t3.drawArrays(t3.TRIANGLE_FAN, 0, 4), tc(this);
        })), Aa(e3), tc(this);
      } else {
        if (!(e2 instanceof ImageBitmap)) throw Error(`Type is not supported: ${e2}`);
        $a(this), Qa(this), n2 = ec(this), tc(this);
      }
      t2.push(n2);
    }
    return new nc(t2, this.la(), this.R(), this.canvas, this.l, this.width, this.height);
  }
  close() {
    this.j && Ya(this, 1).close(), this.m && Ja(this).deleteTexture(Ya(this, 2)), rc = -1;
  }
};
nc.prototype.close = nc.prototype.close, nc.prototype.clone = nc.prototype.clone, nc.prototype.getAsWebGLTexture = nc.prototype.N, nc.prototype.getAsImageBitmap = nc.prototype.Ba, nc.prototype.getAsImageData = nc.prototype.Ca, nc.prototype.hasWebGLTexture = nc.prototype.R, nc.prototype.hasImageBitmap = nc.prototype.la, nc.prototype.hasImageData = nc.prototype.Ea;
var rc = 250;
function ic(...t2) {
  return t2.map((([t3, e2]) => ({ start: t3, end: e2 })));
}
var sc = /* @__PURE__ */ (function(t2) {
  return class extends t2 {
    Ja() {
      this.i._registerModelResourcesGraphService();
    }
  };
})((oc = class {
  constructor(t2, e2) {
    this.l = true, this.i = t2, this.g = null, this.h = 0, this.m = "function" == typeof this.i._addIntToInputStream, void 0 !== e2 ? this.i.canvas = e2 : Qo() ? this.i.canvas = new OffscreenCanvas(1, 1) : (console.warn("OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas."), this.i.canvas = document.createElement("canvas"));
  }
  async initializeGraph(t2) {
    const e2 = await (await fetch(t2)).arrayBuffer();
    t2 = !(t2.endsWith(".pbtxt") || t2.endsWith(".textproto")), this.setGraph(new Uint8Array(e2), t2);
  }
  setGraphFromString(t2) {
    this.setGraph(new TextEncoder().encode(t2), false);
  }
  setGraph(t2, e2) {
    const n2 = t2.length, r2 = this.i._malloc(n2);
    this.i.HEAPU8.set(t2, r2), e2 ? this.i._changeBinaryGraph(n2, r2) : this.i._changeTextGraph(n2, r2), this.i._free(r2);
  }
  configureAudio(t2, e2, n2, r2, i2) {
    this.i._configureAudio || console.warn('Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?'), na(this, r2 || "input_audio", ((r3) => {
      na(this, i2 = i2 || "audio_header", ((i3) => {
        this.i._configureAudio(r3, i3, t2, e2 ?? 0, n2);
      }));
    }));
  }
  setAutoResizeCanvas(t2) {
    this.l = t2;
  }
  setAutoRenderToScreen(t2) {
    this.i._setAutoRenderToScreen(t2);
  }
  setGpuBufferVerticalFlip(t2) {
    this.i.gpuOriginForWebTexturesIsBottomLeft = t2;
  }
  ca(t2) {
    sa(this, "__graph_config__", ((e2) => {
      t2(e2);
    })), na(this, "__graph_config__", ((t3) => {
      this.i._getGraphConfig(t3, void 0);
    })), delete this.i.simpleListeners.__graph_config__;
  }
  attachErrorListener(t2) {
    this.i.errorListener = t2;
  }
  attachEmptyPacketListener(t2, e2) {
    this.i.emptyPacketListeners = this.i.emptyPacketListeners || {}, this.i.emptyPacketListeners[t2] = e2;
  }
  addAudioToStream(t2, e2, n2) {
    this.addAudioToStreamWithShape(t2, 0, 0, e2, n2);
  }
  addAudioToStreamWithShape(t2, e2, n2, r2, i2) {
    const s2 = 4 * t2.length;
    this.h !== s2 && (this.g && this.i._free(this.g), this.g = this.i._malloc(s2), this.h = s2), this.i.HEAPF32.set(t2, this.g / 4), na(this, r2, ((t3) => {
      this.i._addAudioToInputStream(this.g, e2, n2, t3, i2);
    }));
  }
  addGpuBufferToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      const [r2, i2] = ra(this, t2, e3);
      this.i._addBoundTextureToStream(e3, r2, i2, n2);
    }));
  }
  addBoolToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      this.i._addBoolToInputStream(t2, e3, n2);
    }));
  }
  addDoubleToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      this.i._addDoubleToInputStream(t2, e3, n2);
    }));
  }
  addFloatToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      this.i._addFloatToInputStream(t2, e3, n2);
    }));
  }
  addIntToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      this.i._addIntToInputStream(t2, e3, n2);
    }));
  }
  addUintToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      this.i._addUintToInputStream(t2, e3, n2);
    }));
  }
  addStringToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      na(this, t2, ((t3) => {
        this.i._addStringToInputStream(t3, e3, n2);
      }));
    }));
  }
  addStringRecordToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      ia(this, Object.keys(t2), ((r2) => {
        ia(this, Object.values(t2), ((i2) => {
          this.i._addFlatHashMapToInputStream(r2, i2, Object.keys(t2).length, e3, n2);
        }));
      }));
    }));
  }
  addProtoToStream(t2, e2, n2, r2) {
    na(this, n2, ((n3) => {
      na(this, e2, ((e3) => {
        const i2 = this.i._malloc(t2.length);
        this.i.HEAPU8.set(t2, i2), this.i._addProtoToInputStream(i2, t2.length, e3, n3, r2), this.i._free(i2);
      }));
    }));
  }
  addEmptyPacketToStream(t2, e2) {
    na(this, t2, ((t3) => {
      this.i._addEmptyPacketToInputStream(t3, e2);
    }));
  }
  addBoolVectorToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      const r2 = this.i._allocateBoolVector(t2.length);
      if (!r2) throw Error("Unable to allocate new bool vector on heap.");
      for (const e4 of t2) this.i._addBoolVectorEntry(r2, e4);
      this.i._addBoolVectorToInputStream(r2, e3, n2);
    }));
  }
  addDoubleVectorToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      const r2 = this.i._allocateDoubleVector(t2.length);
      if (!r2) throw Error("Unable to allocate new double vector on heap.");
      for (const e4 of t2) this.i._addDoubleVectorEntry(r2, e4);
      this.i._addDoubleVectorToInputStream(r2, e3, n2);
    }));
  }
  addFloatVectorToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      const r2 = this.i._allocateFloatVector(t2.length);
      if (!r2) throw Error("Unable to allocate new float vector on heap.");
      for (const e4 of t2) this.i._addFloatVectorEntry(r2, e4);
      this.i._addFloatVectorToInputStream(r2, e3, n2);
    }));
  }
  addIntVectorToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      const r2 = this.i._allocateIntVector(t2.length);
      if (!r2) throw Error("Unable to allocate new int vector on heap.");
      for (const e4 of t2) this.i._addIntVectorEntry(r2, e4);
      this.i._addIntVectorToInputStream(r2, e3, n2);
    }));
  }
  addUintVectorToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      const r2 = this.i._allocateUintVector(t2.length);
      if (!r2) throw Error("Unable to allocate new unsigned int vector on heap.");
      for (const e4 of t2) this.i._addUintVectorEntry(r2, e4);
      this.i._addUintVectorToInputStream(r2, e3, n2);
    }));
  }
  addStringVectorToStream(t2, e2, n2) {
    na(this, e2, ((e3) => {
      const r2 = this.i._allocateStringVector(t2.length);
      if (!r2) throw Error("Unable to allocate new string vector on heap.");
      for (const e4 of t2) na(this, e4, ((t3) => {
        this.i._addStringVectorEntry(r2, t3);
      }));
      this.i._addStringVectorToInputStream(r2, e3, n2);
    }));
  }
  addBoolToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      this.i._addBoolToInputSidePacket(t2, e3);
    }));
  }
  addDoubleToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      this.i._addDoubleToInputSidePacket(t2, e3);
    }));
  }
  addFloatToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      this.i._addFloatToInputSidePacket(t2, e3);
    }));
  }
  addIntToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      this.i._addIntToInputSidePacket(t2, e3);
    }));
  }
  addUintToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      this.i._addUintToInputSidePacket(t2, e3);
    }));
  }
  addStringToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      na(this, t2, ((t3) => {
        this.i._addStringToInputSidePacket(t3, e3);
      }));
    }));
  }
  addProtoToInputSidePacket(t2, e2, n2) {
    na(this, n2, ((n3) => {
      na(this, e2, ((e3) => {
        const r2 = this.i._malloc(t2.length);
        this.i.HEAPU8.set(t2, r2), this.i._addProtoToInputSidePacket(r2, t2.length, e3, n3), this.i._free(r2);
      }));
    }));
  }
  addBoolVectorToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      const n2 = this.i._allocateBoolVector(t2.length);
      if (!n2) throw Error("Unable to allocate new bool vector on heap.");
      for (const e4 of t2) this.i._addBoolVectorEntry(n2, e4);
      this.i._addBoolVectorToInputSidePacket(n2, e3);
    }));
  }
  addDoubleVectorToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      const n2 = this.i._allocateDoubleVector(t2.length);
      if (!n2) throw Error("Unable to allocate new double vector on heap.");
      for (const e4 of t2) this.i._addDoubleVectorEntry(n2, e4);
      this.i._addDoubleVectorToInputSidePacket(n2, e3);
    }));
  }
  addFloatVectorToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      const n2 = this.i._allocateFloatVector(t2.length);
      if (!n2) throw Error("Unable to allocate new float vector on heap.");
      for (const e4 of t2) this.i._addFloatVectorEntry(n2, e4);
      this.i._addFloatVectorToInputSidePacket(n2, e3);
    }));
  }
  addIntVectorToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      const n2 = this.i._allocateIntVector(t2.length);
      if (!n2) throw Error("Unable to allocate new int vector on heap.");
      for (const e4 of t2) this.i._addIntVectorEntry(n2, e4);
      this.i._addIntVectorToInputSidePacket(n2, e3);
    }));
  }
  addUintVectorToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      const n2 = this.i._allocateUintVector(t2.length);
      if (!n2) throw Error("Unable to allocate new unsigned int vector on heap.");
      for (const e4 of t2) this.i._addUintVectorEntry(n2, e4);
      this.i._addUintVectorToInputSidePacket(n2, e3);
    }));
  }
  addStringVectorToInputSidePacket(t2, e2) {
    na(this, e2, ((e3) => {
      const n2 = this.i._allocateStringVector(t2.length);
      if (!n2) throw Error("Unable to allocate new string vector on heap.");
      for (const e4 of t2) na(this, e4, ((t3) => {
        this.i._addStringVectorEntry(n2, t3);
      }));
      this.i._addStringVectorToInputSidePacket(n2, e3);
    }));
  }
  attachBoolListener(t2, e2) {
    sa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachBoolListener(t3);
    }));
  }
  attachBoolVectorListener(t2, e2) {
    oa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachBoolVectorListener(t3);
    }));
  }
  attachIntListener(t2, e2) {
    sa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachIntListener(t3);
    }));
  }
  attachIntVectorListener(t2, e2) {
    oa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachIntVectorListener(t3);
    }));
  }
  attachUintListener(t2, e2) {
    sa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachUintListener(t3);
    }));
  }
  attachUintVectorListener(t2, e2) {
    oa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachUintVectorListener(t3);
    }));
  }
  attachDoubleListener(t2, e2) {
    sa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachDoubleListener(t3);
    }));
  }
  attachDoubleVectorListener(t2, e2) {
    oa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachDoubleVectorListener(t3);
    }));
  }
  attachFloatListener(t2, e2) {
    sa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachFloatListener(t3);
    }));
  }
  attachFloatVectorListener(t2, e2) {
    oa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachFloatVectorListener(t3);
    }));
  }
  attachStringListener(t2, e2) {
    sa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachStringListener(t3);
    }));
  }
  attachStringVectorListener(t2, e2) {
    oa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachStringVectorListener(t3);
    }));
  }
  attachProtoListener(t2, e2, n2) {
    sa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachProtoListener(t3, n2 || false);
    }));
  }
  attachProtoVectorListener(t2, e2, n2) {
    oa(this, t2, e2), na(this, t2, ((t3) => {
      this.i._attachProtoVectorListener(t3, n2 || false);
    }));
  }
  attachAudioListener(t2, e2, n2) {
    this.i._attachAudioListener || console.warn('Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?'), sa(this, t2, ((t3, n3) => {
      t3 = new Float32Array(t3.buffer, t3.byteOffset, t3.length / 4), e2(t3, n3);
    })), na(this, t2, ((t3) => {
      this.i._attachAudioListener(t3, n2 || false);
    }));
  }
  finishProcessing() {
    this.i._waitUntilIdle();
  }
  closeGraph() {
    this.i._closeGraph(), this.i.simpleListeners = void 0, this.i.emptyPacketListeners = void 0;
  }
}, class extends oc {
  get ga() {
    return this.i;
  }
  pa(t2, e2, n2) {
    na(this, e2, ((e3) => {
      const [r2, i2] = ra(this, t2, e3);
      this.ga._addBoundTextureAsImageToStream(e3, r2, i2, n2);
    }));
  }
  Z(t2, e2) {
    sa(this, t2, e2), na(this, t2, ((t3) => {
      this.ga._attachImageListener(t3);
    }));
  }
  aa(t2, e2) {
    oa(this, t2, e2), na(this, t2, ((t3) => {
      this.ga._attachImageVectorListener(t3);
    }));
  }
}));
var oc;
var ac = class extends sc {
};
async function cc(t2, e2, n2) {
  return (async function(t3, e3, n3, r2) {
    return aa(t3, e3, n3, r2);
  })(t2, n2.canvas ?? (Qo() ? void 0 : document.createElement("canvas")), e2, n2);
}
function hc(t2, e2, n2, r2) {
  if (t2.U) {
    const s2 = new Ls();
    if (n2?.regionOfInterest) {
      if (!t2.oa) throw Error("This task doesn't support region-of-interest.");
      var i2 = n2.regionOfInterest;
      if (i2.left >= i2.right || i2.top >= i2.bottom) throw Error("Expected RectF with left < right and top < bottom.");
      if (i2.left < 0 || i2.top < 0 || i2.right > 1 || i2.bottom > 1) throw Error("Expected RectF values to be in [0,1].");
      Ln(s2, 1, (i2.left + i2.right) / 2), Ln(s2, 2, (i2.top + i2.bottom) / 2), Ln(s2, 4, i2.right - i2.left), Ln(s2, 3, i2.bottom - i2.top);
    } else Ln(s2, 1, 0.5), Ln(s2, 2, 0.5), Ln(s2, 4, 1), Ln(s2, 3, 1);
    if (n2?.rotationDegrees) {
      if (n2?.rotationDegrees % 90 != 0) throw Error("Expected rotation to be a multiple of 90\xB0.");
      if (Ln(s2, 5, -Math.PI * n2.rotationDegrees / 180), n2?.rotationDegrees % 180 != 0) {
        const [t3, r3] = ea(e2);
        n2 = Sn(s2, 3) * r3 / t3, i2 = Sn(s2, 4) * t3 / r3, Ln(s2, 4, n2), Ln(s2, 3, i2);
      }
    }
    t2.g.addProtoToStream(s2.g(), "mediapipe.NormalizedRect", t2.U, r2);
  }
  t2.g.pa(e2, t2.X, r2 ?? performance.now()), t2.finishProcessing();
}
function uc(t2, e2, n2) {
  if (t2.baseOptions?.g()) throw Error("Task is not initialized with image mode. 'runningMode' must be set to 'IMAGE'.");
  hc(t2, e2, n2, t2.C + 1);
}
function lc(t2, e2, n2, r2) {
  if (!t2.baseOptions?.g()) throw Error("Task is not initialized with video mode. 'runningMode' must be set to 'VIDEO'.");
  hc(t2, e2, n2, r2);
}
function fc(t2, e2, n2, r2) {
  var i2 = e2.data;
  const s2 = e2.width, o2 = s2 * (e2 = e2.height);
  if ((i2 instanceof Uint8Array || i2 instanceof Float32Array) && i2.length !== o2) throw Error("Unsupported channel count: " + i2.length / o2);
  return t2 = new Na([i2], n2, false, t2.g.i.canvas, t2.P, s2, e2), r2 ? t2.clone() : t2;
}
var dc = class extends pa {
  constructor(t2, e2, n2, r2) {
    super(t2), this.g = t2, this.X = e2, this.U = n2, this.oa = r2, this.P = new ba();
  }
  l(t2, e2 = true) {
    if ("runningMode" in t2 && Ze(this.baseOptions, 2, Jt(!!t2.runningMode && "IMAGE" !== t2.runningMode)), void 0 !== t2.canvas && this.g.i.canvas !== t2.canvas) throw Error("You must create a new task to reset the canvas.");
    return super.l(t2, e2);
  }
  close() {
    this.P.close(), super.close();
  }
};
dc.prototype.close = dc.prototype.close;
var pc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "image_in", "norm_rect_in", false), this.j = { detections: [] }, wn(t2 = this.h = new zs(), 0, 1, e2 = new Xs()), Ln(this.h, 2, 0.5), Ln(this.h, 3, 0.3);
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    return "minDetectionConfidence" in t2 && Ln(this.h, 2, t2.minDetectionConfidence ?? 0.5), "minSuppressionThreshold" in t2 && Ln(this.h, 3, t2.minSuppressionThreshold ?? 0.3), this.l(t2);
  }
  F(t2, e2) {
    return this.j = { detections: [] }, uc(this, t2, e2), this.j;
  }
  G(t2, e2, n2) {
    return this.j = { detections: [] }, lc(this, t2, n2, e2), this.j;
  }
  m() {
    var t2 = new ls();
    hs(t2, "image_in"), hs(t2, "norm_rect_in"), us(t2, "detections");
    const e2 = new Qi();
    xr(e2, Ys, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.face_detector.FaceDetectorGraph"), ns(n2, "IMAGE:image_in"), ns(n2, "NORM_RECT:norm_rect_in"), rs(n2, "DETECTIONS:detections"), n2.o(e2), cs(t2, n2), this.g.attachProtoVectorListener("detections", ((t3, e3) => {
      for (const e4 of t3) t3 = ws(e4), this.j.detections.push(Xo(t3));
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("detections", ((t3) => {
      ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
pc.prototype.detectForVideo = pc.prototype.G, pc.prototype.detect = pc.prototype.F, pc.prototype.setOptions = pc.prototype.o, pc.createFromModelPath = async function(t2, e2) {
  return cc(pc, t2, { baseOptions: { modelAssetPath: e2 } });
}, pc.createFromModelBuffer = function(t2, e2) {
  return cc(pc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, pc.createFromOptions = function(t2, e2) {
  return cc(pc, t2, e2);
};
var gc = ic([61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314], [314, 405], [405, 321], [321, 375], [375, 291], [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [78, 95], [95, 88], [88, 178], [178, 87], [87, 14], [14, 317], [317, 402], [402, 318], [318, 324], [324, 308], [78, 191], [191, 80], [80, 81], [81, 82], [82, 13], [13, 312], [312, 311], [311, 310], [310, 415], [415, 308]);
var mc = ic([263, 249], [249, 390], [390, 373], [373, 374], [374, 380], [380, 381], [381, 382], [382, 362], [263, 466], [466, 388], [388, 387], [387, 386], [386, 385], [385, 384], [384, 398], [398, 362]);
var yc = ic([276, 283], [283, 282], [282, 295], [295, 285], [300, 293], [293, 334], [334, 296], [296, 336]);
var _c = ic([474, 475], [475, 476], [476, 477], [477, 474]);
var vc = ic([33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154], [154, 155], [155, 133], [33, 246], [246, 161], [161, 160], [160, 159], [159, 158], [158, 157], [157, 173], [173, 133]);
var Ec = ic([46, 53], [53, 52], [52, 65], [65, 55], [70, 63], [63, 105], [105, 66], [66, 107]);
var wc = ic([469, 470], [470, 471], [471, 472], [472, 469]);
var Tc = ic([10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389], [389, 356], [356, 454], [454, 323], [323, 361], [361, 288], [288, 397], [397, 365], [365, 379], [379, 378], [378, 400], [400, 377], [377, 152], [152, 148], [148, 176], [176, 149], [149, 150], [150, 136], [136, 172], [172, 58], [58, 132], [132, 93], [93, 234], [234, 127], [127, 162], [162, 21], [21, 54], [54, 103], [103, 67], [67, 109], [109, 10]);
var Ac = [...gc, ...mc, ...yc, ...vc, ...Ec, ...Tc];
var bc = ic([127, 34], [34, 139], [139, 127], [11, 0], [0, 37], [37, 11], [232, 231], [231, 120], [120, 232], [72, 37], [37, 39], [39, 72], [128, 121], [121, 47], [47, 128], [232, 121], [121, 128], [128, 232], [104, 69], [69, 67], [67, 104], [175, 171], [171, 148], [148, 175], [118, 50], [50, 101], [101, 118], [73, 39], [39, 40], [40, 73], [9, 151], [151, 108], [108, 9], [48, 115], [115, 131], [131, 48], [194, 204], [204, 211], [211, 194], [74, 40], [40, 185], [185, 74], [80, 42], [42, 183], [183, 80], [40, 92], [92, 186], [186, 40], [230, 229], [229, 118], [118, 230], [202, 212], [212, 214], [214, 202], [83, 18], [18, 17], [17, 83], [76, 61], [61, 146], [146, 76], [160, 29], [29, 30], [30, 160], [56, 157], [157, 173], [173, 56], [106, 204], [204, 194], [194, 106], [135, 214], [214, 192], [192, 135], [203, 165], [165, 98], [98, 203], [21, 71], [71, 68], [68, 21], [51, 45], [45, 4], [4, 51], [144, 24], [24, 23], [23, 144], [77, 146], [146, 91], [91, 77], [205, 50], [50, 187], [187, 205], [201, 200], [200, 18], [18, 201], [91, 106], [106, 182], [182, 91], [90, 91], [91, 181], [181, 90], [85, 84], [84, 17], [17, 85], [206, 203], [203, 36], [36, 206], [148, 171], [171, 140], [140, 148], [92, 40], [40, 39], [39, 92], [193, 189], [189, 244], [244, 193], [159, 158], [158, 28], [28, 159], [247, 246], [246, 161], [161, 247], [236, 3], [3, 196], [196, 236], [54, 68], [68, 104], [104, 54], [193, 168], [168, 8], [8, 193], [117, 228], [228, 31], [31, 117], [189, 193], [193, 55], [55, 189], [98, 97], [97, 99], [99, 98], [126, 47], [47, 100], [100, 126], [166, 79], [79, 218], [218, 166], [155, 154], [154, 26], [26, 155], [209, 49], [49, 131], [131, 209], [135, 136], [136, 150], [150, 135], [47, 126], [126, 217], [217, 47], [223, 52], [52, 53], [53, 223], [45, 51], [51, 134], [134, 45], [211, 170], [170, 140], [140, 211], [67, 69], [69, 108], [108, 67], [43, 106], [106, 91], [91, 43], [230, 119], [119, 120], [120, 230], [226, 130], [130, 247], [247, 226], [63, 53], [53, 52], [52, 63], [238, 20], [20, 242], [242, 238], [46, 70], [70, 156], [156, 46], [78, 62], [62, 96], [96, 78], [46, 53], [53, 63], [63, 46], [143, 34], [34, 227], [227, 143], [123, 117], [117, 111], [111, 123], [44, 125], [125, 19], [19, 44], [236, 134], [134, 51], [51, 236], [216, 206], [206, 205], [205, 216], [154, 153], [153, 22], [22, 154], [39, 37], [37, 167], [167, 39], [200, 201], [201, 208], [208, 200], [36, 142], [142, 100], [100, 36], [57, 212], [212, 202], [202, 57], [20, 60], [60, 99], [99, 20], [28, 158], [158, 157], [157, 28], [35, 226], [226, 113], [113, 35], [160, 159], [159, 27], [27, 160], [204, 202], [202, 210], [210, 204], [113, 225], [225, 46], [46, 113], [43, 202], [202, 204], [204, 43], [62, 76], [76, 77], [77, 62], [137, 123], [123, 116], [116, 137], [41, 38], [38, 72], [72, 41], [203, 129], [129, 142], [142, 203], [64, 98], [98, 240], [240, 64], [49, 102], [102, 64], [64, 49], [41, 73], [73, 74], [74, 41], [212, 216], [216, 207], [207, 212], [42, 74], [74, 184], [184, 42], [169, 170], [170, 211], [211, 169], [170, 149], [149, 176], [176, 170], [105, 66], [66, 69], [69, 105], [122, 6], [6, 168], [168, 122], [123, 147], [147, 187], [187, 123], [96, 77], [77, 90], [90, 96], [65, 55], [55, 107], [107, 65], [89, 90], [90, 180], [180, 89], [101, 100], [100, 120], [120, 101], [63, 105], [105, 104], [104, 63], [93, 137], [137, 227], [227, 93], [15, 86], [86, 85], [85, 15], [129, 102], [102, 49], [49, 129], [14, 87], [87, 86], [86, 14], [55, 8], [8, 9], [9, 55], [100, 47], [47, 121], [121, 100], [145, 23], [23, 22], [22, 145], [88, 89], [89, 179], [179, 88], [6, 122], [122, 196], [196, 6], [88, 95], [95, 96], [96, 88], [138, 172], [172, 136], [136, 138], [215, 58], [58, 172], [172, 215], [115, 48], [48, 219], [219, 115], [42, 80], [80, 81], [81, 42], [195, 3], [3, 51], [51, 195], [43, 146], [146, 61], [61, 43], [171, 175], [175, 199], [199, 171], [81, 82], [82, 38], [38, 81], [53, 46], [46, 225], [225, 53], [144, 163], [163, 110], [110, 144], [52, 65], [65, 66], [66, 52], [229, 228], [228, 117], [117, 229], [34, 127], [127, 234], [234, 34], [107, 108], [108, 69], [69, 107], [109, 108], [108, 151], [151, 109], [48, 64], [64, 235], [235, 48], [62, 78], [78, 191], [191, 62], [129, 209], [209, 126], [126, 129], [111, 35], [35, 143], [143, 111], [117, 123], [123, 50], [50, 117], [222, 65], [65, 52], [52, 222], [19, 125], [125, 141], [141, 19], [221, 55], [55, 65], [65, 221], [3, 195], [195, 197], [197, 3], [25, 7], [7, 33], [33, 25], [220, 237], [237, 44], [44, 220], [70, 71], [71, 139], [139, 70], [122, 193], [193, 245], [245, 122], [247, 130], [130, 33], [33, 247], [71, 21], [21, 162], [162, 71], [170, 169], [169, 150], [150, 170], [188, 174], [174, 196], [196, 188], [216, 186], [186, 92], [92, 216], [2, 97], [97, 167], [167, 2], [141, 125], [125, 241], [241, 141], [164, 167], [167, 37], [37, 164], [72, 38], [38, 12], [12, 72], [38, 82], [82, 13], [13, 38], [63, 68], [68, 71], [71, 63], [226, 35], [35, 111], [111, 226], [101, 50], [50, 205], [205, 101], [206, 92], [92, 165], [165, 206], [209, 198], [198, 217], [217, 209], [165, 167], [167, 97], [97, 165], [220, 115], [115, 218], [218, 220], [133, 112], [112, 243], [243, 133], [239, 238], [238, 241], [241, 239], [214, 135], [135, 169], [169, 214], [190, 173], [173, 133], [133, 190], [171, 208], [208, 32], [32, 171], [125, 44], [44, 237], [237, 125], [86, 87], [87, 178], [178, 86], [85, 86], [86, 179], [179, 85], [84, 85], [85, 180], [180, 84], [83, 84], [84, 181], [181, 83], [201, 83], [83, 182], [182, 201], [137, 93], [93, 132], [132, 137], [76, 62], [62, 183], [183, 76], [61, 76], [76, 184], [184, 61], [57, 61], [61, 185], [185, 57], [212, 57], [57, 186], [186, 212], [214, 207], [207, 187], [187, 214], [34, 143], [143, 156], [156, 34], [79, 239], [239, 237], [237, 79], [123, 137], [137, 177], [177, 123], [44, 1], [1, 4], [4, 44], [201, 194], [194, 32], [32, 201], [64, 102], [102, 129], [129, 64], [213, 215], [215, 138], [138, 213], [59, 166], [166, 219], [219, 59], [242, 99], [99, 97], [97, 242], [2, 94], [94, 141], [141, 2], [75, 59], [59, 235], [235, 75], [24, 110], [110, 228], [228, 24], [25, 130], [130, 226], [226, 25], [23, 24], [24, 229], [229, 23], [22, 23], [23, 230], [230, 22], [26, 22], [22, 231], [231, 26], [112, 26], [26, 232], [232, 112], [189, 190], [190, 243], [243, 189], [221, 56], [56, 190], [190, 221], [28, 56], [56, 221], [221, 28], [27, 28], [28, 222], [222, 27], [29, 27], [27, 223], [223, 29], [30, 29], [29, 224], [224, 30], [247, 30], [30, 225], [225, 247], [238, 79], [79, 20], [20, 238], [166, 59], [59, 75], [75, 166], [60, 75], [75, 240], [240, 60], [147, 177], [177, 215], [215, 147], [20, 79], [79, 166], [166, 20], [187, 147], [147, 213], [213, 187], [112, 233], [233, 244], [244, 112], [233, 128], [128, 245], [245, 233], [128, 114], [114, 188], [188, 128], [114, 217], [217, 174], [174, 114], [131, 115], [115, 220], [220, 131], [217, 198], [198, 236], [236, 217], [198, 131], [131, 134], [134, 198], [177, 132], [132, 58], [58, 177], [143, 35], [35, 124], [124, 143], [110, 163], [163, 7], [7, 110], [228, 110], [110, 25], [25, 228], [356, 389], [389, 368], [368, 356], [11, 302], [302, 267], [267, 11], [452, 350], [350, 349], [349, 452], [302, 303], [303, 269], [269, 302], [357, 343], [343, 277], [277, 357], [452, 453], [453, 357], [357, 452], [333, 332], [332, 297], [297, 333], [175, 152], [152, 377], [377, 175], [347, 348], [348, 330], [330, 347], [303, 304], [304, 270], [270, 303], [9, 336], [336, 337], [337, 9], [278, 279], [279, 360], [360, 278], [418, 262], [262, 431], [431, 418], [304, 408], [408, 409], [409, 304], [310, 415], [415, 407], [407, 310], [270, 409], [409, 410], [410, 270], [450, 348], [348, 347], [347, 450], [422, 430], [430, 434], [434, 422], [313, 314], [314, 17], [17, 313], [306, 307], [307, 375], [375, 306], [387, 388], [388, 260], [260, 387], [286, 414], [414, 398], [398, 286], [335, 406], [406, 418], [418, 335], [364, 367], [367, 416], [416, 364], [423, 358], [358, 327], [327, 423], [251, 284], [284, 298], [298, 251], [281, 5], [5, 4], [4, 281], [373, 374], [374, 253], [253, 373], [307, 320], [320, 321], [321, 307], [425, 427], [427, 411], [411, 425], [421, 313], [313, 18], [18, 421], [321, 405], [405, 406], [406, 321], [320, 404], [404, 405], [405, 320], [315, 16], [16, 17], [17, 315], [426, 425], [425, 266], [266, 426], [377, 400], [400, 369], [369, 377], [322, 391], [391, 269], [269, 322], [417, 465], [465, 464], [464, 417], [386, 257], [257, 258], [258, 386], [466, 260], [260, 388], [388, 466], [456, 399], [399, 419], [419, 456], [284, 332], [332, 333], [333, 284], [417, 285], [285, 8], [8, 417], [346, 340], [340, 261], [261, 346], [413, 441], [441, 285], [285, 413], [327, 460], [460, 328], [328, 327], [355, 371], [371, 329], [329, 355], [392, 439], [439, 438], [438, 392], [382, 341], [341, 256], [256, 382], [429, 420], [420, 360], [360, 429], [364, 394], [394, 379], [379, 364], [277, 343], [343, 437], [437, 277], [443, 444], [444, 283], [283, 443], [275, 440], [440, 363], [363, 275], [431, 262], [262, 369], [369, 431], [297, 338], [338, 337], [337, 297], [273, 375], [375, 321], [321, 273], [450, 451], [451, 349], [349, 450], [446, 342], [342, 467], [467, 446], [293, 334], [334, 282], [282, 293], [458, 461], [461, 462], [462, 458], [276, 353], [353, 383], [383, 276], [308, 324], [324, 325], [325, 308], [276, 300], [300, 293], [293, 276], [372, 345], [345, 447], [447, 372], [352, 345], [345, 340], [340, 352], [274, 1], [1, 19], [19, 274], [456, 248], [248, 281], [281, 456], [436, 427], [427, 425], [425, 436], [381, 256], [256, 252], [252, 381], [269, 391], [391, 393], [393, 269], [200, 199], [199, 428], [428, 200], [266, 330], [330, 329], [329, 266], [287, 273], [273, 422], [422, 287], [250, 462], [462, 328], [328, 250], [258, 286], [286, 384], [384, 258], [265, 353], [353, 342], [342, 265], [387, 259], [259, 257], [257, 387], [424, 431], [431, 430], [430, 424], [342, 353], [353, 276], [276, 342], [273, 335], [335, 424], [424, 273], [292, 325], [325, 307], [307, 292], [366, 447], [447, 345], [345, 366], [271, 303], [303, 302], [302, 271], [423, 266], [266, 371], [371, 423], [294, 455], [455, 460], [460, 294], [279, 278], [278, 294], [294, 279], [271, 272], [272, 304], [304, 271], [432, 434], [434, 427], [427, 432], [272, 407], [407, 408], [408, 272], [394, 430], [430, 431], [431, 394], [395, 369], [369, 400], [400, 395], [334, 333], [333, 299], [299, 334], [351, 417], [417, 168], [168, 351], [352, 280], [280, 411], [411, 352], [325, 319], [319, 320], [320, 325], [295, 296], [296, 336], [336, 295], [319, 403], [403, 404], [404, 319], [330, 348], [348, 349], [349, 330], [293, 298], [298, 333], [333, 293], [323, 454], [454, 447], [447, 323], [15, 16], [16, 315], [315, 15], [358, 429], [429, 279], [279, 358], [14, 15], [15, 316], [316, 14], [285, 336], [336, 9], [9, 285], [329, 349], [349, 350], [350, 329], [374, 380], [380, 252], [252, 374], [318, 402], [402, 403], [403, 318], [6, 197], [197, 419], [419, 6], [318, 319], [319, 325], [325, 318], [367, 364], [364, 365], [365, 367], [435, 367], [367, 397], [397, 435], [344, 438], [438, 439], [439, 344], [272, 271], [271, 311], [311, 272], [195, 5], [5, 281], [281, 195], [273, 287], [287, 291], [291, 273], [396, 428], [428, 199], [199, 396], [311, 271], [271, 268], [268, 311], [283, 444], [444, 445], [445, 283], [373, 254], [254, 339], [339, 373], [282, 334], [334, 296], [296, 282], [449, 347], [347, 346], [346, 449], [264, 447], [447, 454], [454, 264], [336, 296], [296, 299], [299, 336], [338, 10], [10, 151], [151, 338], [278, 439], [439, 455], [455, 278], [292, 407], [407, 415], [415, 292], [358, 371], [371, 355], [355, 358], [340, 345], [345, 372], [372, 340], [346, 347], [347, 280], [280, 346], [442, 443], [443, 282], [282, 442], [19, 94], [94, 370], [370, 19], [441, 442], [442, 295], [295, 441], [248, 419], [419, 197], [197, 248], [263, 255], [255, 359], [359, 263], [440, 275], [275, 274], [274, 440], [300, 383], [383, 368], [368, 300], [351, 412], [412, 465], [465, 351], [263, 467], [467, 466], [466, 263], [301, 368], [368, 389], [389, 301], [395, 378], [378, 379], [379, 395], [412, 351], [351, 419], [419, 412], [436, 426], [426, 322], [322, 436], [2, 164], [164, 393], [393, 2], [370, 462], [462, 461], [461, 370], [164, 0], [0, 267], [267, 164], [302, 11], [11, 12], [12, 302], [268, 12], [12, 13], [13, 268], [293, 300], [300, 301], [301, 293], [446, 261], [261, 340], [340, 446], [330, 266], [266, 425], [425, 330], [426, 423], [423, 391], [391, 426], [429, 355], [355, 437], [437, 429], [391, 327], [327, 326], [326, 391], [440, 457], [457, 438], [438, 440], [341, 382], [382, 362], [362, 341], [459, 457], [457, 461], [461, 459], [434, 430], [430, 394], [394, 434], [414, 463], [463, 362], [362, 414], [396, 369], [369, 262], [262, 396], [354, 461], [461, 457], [457, 354], [316, 403], [403, 402], [402, 316], [315, 404], [404, 403], [403, 315], [314, 405], [405, 404], [404, 314], [313, 406], [406, 405], [405, 313], [421, 418], [418, 406], [406, 421], [366, 401], [401, 361], [361, 366], [306, 408], [408, 407], [407, 306], [291, 409], [409, 408], [408, 291], [287, 410], [410, 409], [409, 287], [432, 436], [436, 410], [410, 432], [434, 416], [416, 411], [411, 434], [264, 368], [368, 383], [383, 264], [309, 438], [438, 457], [457, 309], [352, 376], [376, 401], [401, 352], [274, 275], [275, 4], [4, 274], [421, 428], [428, 262], [262, 421], [294, 327], [327, 358], [358, 294], [433, 416], [416, 367], [367, 433], [289, 455], [455, 439], [439, 289], [462, 370], [370, 326], [326, 462], [2, 326], [326, 370], [370, 2], [305, 460], [460, 455], [455, 305], [254, 449], [449, 448], [448, 254], [255, 261], [261, 446], [446, 255], [253, 450], [450, 449], [449, 253], [252, 451], [451, 450], [450, 252], [256, 452], [452, 451], [451, 256], [341, 453], [453, 452], [452, 341], [413, 464], [464, 463], [463, 413], [441, 413], [413, 414], [414, 441], [258, 442], [442, 441], [441, 258], [257, 443], [443, 442], [442, 257], [259, 444], [444, 443], [443, 259], [260, 445], [445, 444], [444, 260], [467, 342], [342, 445], [445, 467], [459, 458], [458, 250], [250, 459], [289, 392], [392, 290], [290, 289], [290, 328], [328, 460], [460, 290], [376, 433], [433, 435], [435, 376], [250, 290], [290, 392], [392, 250], [411, 416], [416, 433], [433, 411], [341, 463], [463, 464], [464, 341], [453, 464], [464, 465], [465, 453], [357, 465], [465, 412], [412, 357], [343, 412], [412, 399], [399, 343], [360, 363], [363, 440], [440, 360], [437, 399], [399, 456], [456, 437], [420, 456], [456, 363], [363, 420], [401, 435], [435, 288], [288, 401], [372, 383], [383, 353], [353, 372], [339, 255], [255, 249], [249, 339], [448, 261], [261, 255], [255, 448], [133, 243], [243, 190], [190, 133], [133, 155], [155, 112], [112, 133], [33, 246], [246, 247], [247, 33], [33, 130], [130, 25], [25, 33], [398, 384], [384, 286], [286, 398], [362, 398], [398, 414], [414, 362], [362, 463], [463, 341], [341, 362], [263, 359], [359, 467], [467, 263], [263, 249], [249, 255], [255, 263], [466, 467], [467, 260], [260, 466], [75, 60], [60, 166], [166, 75], [238, 239], [239, 79], [79, 238], [162, 127], [127, 139], [139, 162], [72, 11], [11, 37], [37, 72], [121, 232], [232, 120], [120, 121], [73, 72], [72, 39], [39, 73], [114, 128], [128, 47], [47, 114], [233, 232], [232, 128], [128, 233], [103, 104], [104, 67], [67, 103], [152, 175], [175, 148], [148, 152], [119, 118], [118, 101], [101, 119], [74, 73], [73, 40], [40, 74], [107, 9], [9, 108], [108, 107], [49, 48], [48, 131], [131, 49], [32, 194], [194, 211], [211, 32], [184, 74], [74, 185], [185, 184], [191, 80], [80, 183], [183, 191], [185, 40], [40, 186], [186, 185], [119, 230], [230, 118], [118, 119], [210, 202], [202, 214], [214, 210], [84, 83], [83, 17], [17, 84], [77, 76], [76, 146], [146, 77], [161, 160], [160, 30], [30, 161], [190, 56], [56, 173], [173, 190], [182, 106], [106, 194], [194, 182], [138, 135], [135, 192], [192, 138], [129, 203], [203, 98], [98, 129], [54, 21], [21, 68], [68, 54], [5, 51], [51, 4], [4, 5], [145, 144], [144, 23], [23, 145], [90, 77], [77, 91], [91, 90], [207, 205], [205, 187], [187, 207], [83, 201], [201, 18], [18, 83], [181, 91], [91, 182], [182, 181], [180, 90], [90, 181], [181, 180], [16, 85], [85, 17], [17, 16], [205, 206], [206, 36], [36, 205], [176, 148], [148, 140], [140, 176], [165, 92], [92, 39], [39, 165], [245, 193], [193, 244], [244, 245], [27, 159], [159, 28], [28, 27], [30, 247], [247, 161], [161, 30], [174, 236], [236, 196], [196, 174], [103, 54], [54, 104], [104, 103], [55, 193], [193, 8], [8, 55], [111, 117], [117, 31], [31, 111], [221, 189], [189, 55], [55, 221], [240, 98], [98, 99], [99, 240], [142, 126], [126, 100], [100, 142], [219, 166], [166, 218], [218, 219], [112, 155], [155, 26], [26, 112], [198, 209], [209, 131], [131, 198], [169, 135], [135, 150], [150, 169], [114, 47], [47, 217], [217, 114], [224, 223], [223, 53], [53, 224], [220, 45], [45, 134], [134, 220], [32, 211], [211, 140], [140, 32], [109, 67], [67, 108], [108, 109], [146, 43], [43, 91], [91, 146], [231, 230], [230, 120], [120, 231], [113, 226], [226, 247], [247, 113], [105, 63], [63, 52], [52, 105], [241, 238], [238, 242], [242, 241], [124, 46], [46, 156], [156, 124], [95, 78], [78, 96], [96, 95], [70, 46], [46, 63], [63, 70], [116, 143], [143, 227], [227, 116], [116, 123], [123, 111], [111, 116], [1, 44], [44, 19], [19, 1], [3, 236], [236, 51], [51, 3], [207, 216], [216, 205], [205, 207], [26, 154], [154, 22], [22, 26], [165, 39], [39, 167], [167, 165], [199, 200], [200, 208], [208, 199], [101, 36], [36, 100], [100, 101], [43, 57], [57, 202], [202, 43], [242, 20], [20, 99], [99, 242], [56, 28], [28, 157], [157, 56], [124, 35], [35, 113], [113, 124], [29, 160], [160, 27], [27, 29], [211, 204], [204, 210], [210, 211], [124, 113], [113, 46], [46, 124], [106, 43], [43, 204], [204, 106], [96, 62], [62, 77], [77, 96], [227, 137], [137, 116], [116, 227], [73, 41], [41, 72], [72, 73], [36, 203], [203, 142], [142, 36], [235, 64], [64, 240], [240, 235], [48, 49], [49, 64], [64, 48], [42, 41], [41, 74], [74, 42], [214, 212], [212, 207], [207, 214], [183, 42], [42, 184], [184, 183], [210, 169], [169, 211], [211, 210], [140, 170], [170, 176], [176, 140], [104, 105], [105, 69], [69, 104], [193, 122], [122, 168], [168, 193], [50, 123], [123, 187], [187, 50], [89, 96], [96, 90], [90, 89], [66, 65], [65, 107], [107, 66], [179, 89], [89, 180], [180, 179], [119, 101], [101, 120], [120, 119], [68, 63], [63, 104], [104, 68], [234, 93], [93, 227], [227, 234], [16, 15], [15, 85], [85, 16], [209, 129], [129, 49], [49, 209], [15, 14], [14, 86], [86, 15], [107, 55], [55, 9], [9, 107], [120, 100], [100, 121], [121, 120], [153, 145], [145, 22], [22, 153], [178, 88], [88, 179], [179, 178], [197, 6], [6, 196], [196, 197], [89, 88], [88, 96], [96, 89], [135, 138], [138, 136], [136, 135], [138, 215], [215, 172], [172, 138], [218, 115], [115, 219], [219, 218], [41, 42], [42, 81], [81, 41], [5, 195], [195, 51], [51, 5], [57, 43], [43, 61], [61, 57], [208, 171], [171, 199], [199, 208], [41, 81], [81, 38], [38, 41], [224, 53], [53, 225], [225, 224], [24, 144], [144, 110], [110, 24], [105, 52], [52, 66], [66, 105], [118, 229], [229, 117], [117, 118], [227, 34], [34, 234], [234, 227], [66, 107], [107, 69], [69, 66], [10, 109], [109, 151], [151, 10], [219, 48], [48, 235], [235, 219], [183, 62], [62, 191], [191, 183], [142, 129], [129, 126], [126, 142], [116, 111], [111, 143], [143, 116], [118, 117], [117, 50], [50, 118], [223, 222], [222, 52], [52, 223], [94, 19], [19, 141], [141, 94], [222, 221], [221, 65], [65, 222], [196, 3], [3, 197], [197, 196], [45, 220], [220, 44], [44, 45], [156, 70], [70, 139], [139, 156], [188, 122], [122, 245], [245, 188], [139, 71], [71, 162], [162, 139], [149, 170], [170, 150], [150, 149], [122, 188], [188, 196], [196, 122], [206, 216], [216, 92], [92, 206], [164, 2], [2, 167], [167, 164], [242, 141], [141, 241], [241, 242], [0, 164], [164, 37], [37, 0], [11, 72], [72, 12], [12, 11], [12, 38], [38, 13], [13, 12], [70, 63], [63, 71], [71, 70], [31, 226], [226, 111], [111, 31], [36, 101], [101, 205], [205, 36], [203, 206], [206, 165], [165, 203], [126, 209], [209, 217], [217, 126], [98, 165], [165, 97], [97, 98], [237, 220], [220, 218], [218, 237], [237, 239], [239, 241], [241, 237], [210, 214], [214, 169], [169, 210], [140, 171], [171, 32], [32, 140], [241, 125], [125, 237], [237, 241], [179, 86], [86, 178], [178, 179], [180, 85], [85, 179], [179, 180], [181, 84], [84, 180], [180, 181], [182, 83], [83, 181], [181, 182], [194, 201], [201, 182], [182, 194], [177, 137], [137, 132], [132, 177], [184, 76], [76, 183], [183, 184], [185, 61], [61, 184], [184, 185], [186, 57], [57, 185], [185, 186], [216, 212], [212, 186], [186, 216], [192, 214], [214, 187], [187, 192], [139, 34], [34, 156], [156, 139], [218, 79], [79, 237], [237, 218], [147, 123], [123, 177], [177, 147], [45, 44], [44, 4], [4, 45], [208, 201], [201, 32], [32, 208], [98, 64], [64, 129], [129, 98], [192, 213], [213, 138], [138, 192], [235, 59], [59, 219], [219, 235], [141, 242], [242, 97], [97, 141], [97, 2], [2, 141], [141, 97], [240, 75], [75, 235], [235, 240], [229, 24], [24, 228], [228, 229], [31, 25], [25, 226], [226, 31], [230, 23], [23, 229], [229, 230], [231, 22], [22, 230], [230, 231], [232, 26], [26, 231], [231, 232], [233, 112], [112, 232], [232, 233], [244, 189], [189, 243], [243, 244], [189, 221], [221, 190], [190, 189], [222, 28], [28, 221], [221, 222], [223, 27], [27, 222], [222, 223], [224, 29], [29, 223], [223, 224], [225, 30], [30, 224], [224, 225], [113, 247], [247, 225], [225, 113], [99, 60], [60, 240], [240, 99], [213, 147], [147, 215], [215, 213], [60, 20], [20, 166], [166, 60], [192, 187], [187, 213], [213, 192], [243, 112], [112, 244], [244, 243], [244, 233], [233, 245], [245, 244], [245, 128], [128, 188], [188, 245], [188, 114], [114, 174], [174, 188], [134, 131], [131, 220], [220, 134], [174, 217], [217, 236], [236, 174], [236, 198], [198, 134], [134, 236], [215, 177], [177, 58], [58, 215], [156, 143], [143, 124], [124, 156], [25, 110], [110, 7], [7, 25], [31, 228], [228, 25], [25, 31], [264, 356], [356, 368], [368, 264], [0, 11], [11, 267], [267, 0], [451, 452], [452, 349], [349, 451], [267, 302], [302, 269], [269, 267], [350, 357], [357, 277], [277, 350], [350, 452], [452, 357], [357, 350], [299, 333], [333, 297], [297, 299], [396, 175], [175, 377], [377, 396], [280, 347], [347, 330], [330, 280], [269, 303], [303, 270], [270, 269], [151, 9], [9, 337], [337, 151], [344, 278], [278, 360], [360, 344], [424, 418], [418, 431], [431, 424], [270, 304], [304, 409], [409, 270], [272, 310], [310, 407], [407, 272], [322, 270], [270, 410], [410, 322], [449, 450], [450, 347], [347, 449], [432, 422], [422, 434], [434, 432], [18, 313], [313, 17], [17, 18], [291, 306], [306, 375], [375, 291], [259, 387], [387, 260], [260, 259], [424, 335], [335, 418], [418, 424], [434, 364], [364, 416], [416, 434], [391, 423], [423, 327], [327, 391], [301, 251], [251, 298], [298, 301], [275, 281], [281, 4], [4, 275], [254, 373], [373, 253], [253, 254], [375, 307], [307, 321], [321, 375], [280, 425], [425, 411], [411, 280], [200, 421], [421, 18], [18, 200], [335, 321], [321, 406], [406, 335], [321, 320], [320, 405], [405, 321], [314, 315], [315, 17], [17, 314], [423, 426], [426, 266], [266, 423], [396, 377], [377, 369], [369, 396], [270, 322], [322, 269], [269, 270], [413, 417], [417, 464], [464, 413], [385, 386], [386, 258], [258, 385], [248, 456], [456, 419], [419, 248], [298, 284], [284, 333], [333, 298], [168, 417], [417, 8], [8, 168], [448, 346], [346, 261], [261, 448], [417, 413], [413, 285], [285, 417], [326, 327], [327, 328], [328, 326], [277, 355], [355, 329], [329, 277], [309, 392], [392, 438], [438, 309], [381, 382], [382, 256], [256, 381], [279, 429], [429, 360], [360, 279], [365, 364], [364, 379], [379, 365], [355, 277], [277, 437], [437, 355], [282, 443], [443, 283], [283, 282], [281, 275], [275, 363], [363, 281], [395, 431], [431, 369], [369, 395], [299, 297], [297, 337], [337, 299], [335, 273], [273, 321], [321, 335], [348, 450], [450, 349], [349, 348], [359, 446], [446, 467], [467, 359], [283, 293], [293, 282], [282, 283], [250, 458], [458, 462], [462, 250], [300, 276], [276, 383], [383, 300], [292, 308], [308, 325], [325, 292], [283, 276], [276, 293], [293, 283], [264, 372], [372, 447], [447, 264], [346, 352], [352, 340], [340, 346], [354, 274], [274, 19], [19, 354], [363, 456], [456, 281], [281, 363], [426, 436], [436, 425], [425, 426], [380, 381], [381, 252], [252, 380], [267, 269], [269, 393], [393, 267], [421, 200], [200, 428], [428, 421], [371, 266], [266, 329], [329, 371], [432, 287], [287, 422], [422, 432], [290, 250], [250, 328], [328, 290], [385, 258], [258, 384], [384, 385], [446, 265], [265, 342], [342, 446], [386, 387], [387, 257], [257, 386], [422, 424], [424, 430], [430, 422], [445, 342], [342, 276], [276, 445], [422, 273], [273, 424], [424, 422], [306, 292], [292, 307], [307, 306], [352, 366], [366, 345], [345, 352], [268, 271], [271, 302], [302, 268], [358, 423], [423, 371], [371, 358], [327, 294], [294, 460], [460, 327], [331, 279], [279, 294], [294, 331], [303, 271], [271, 304], [304, 303], [436, 432], [432, 427], [427, 436], [304, 272], [272, 408], [408, 304], [395, 394], [394, 431], [431, 395], [378, 395], [395, 400], [400, 378], [296, 334], [334, 299], [299, 296], [6, 351], [351, 168], [168, 6], [376, 352], [352, 411], [411, 376], [307, 325], [325, 320], [320, 307], [285, 295], [295, 336], [336, 285], [320, 319], [319, 404], [404, 320], [329, 330], [330, 349], [349, 329], [334, 293], [293, 333], [333, 334], [366, 323], [323, 447], [447, 366], [316, 15], [15, 315], [315, 316], [331, 358], [358, 279], [279, 331], [317, 14], [14, 316], [316, 317], [8, 285], [285, 9], [9, 8], [277, 329], [329, 350], [350, 277], [253, 374], [374, 252], [252, 253], [319, 318], [318, 403], [403, 319], [351, 6], [6, 419], [419, 351], [324, 318], [318, 325], [325, 324], [397, 367], [367, 365], [365, 397], [288, 435], [435, 397], [397, 288], [278, 344], [344, 439], [439, 278], [310, 272], [272, 311], [311, 310], [248, 195], [195, 281], [281, 248], [375, 273], [273, 291], [291, 375], [175, 396], [396, 199], [199, 175], [312, 311], [311, 268], [268, 312], [276, 283], [283, 445], [445, 276], [390, 373], [373, 339], [339, 390], [295, 282], [282, 296], [296, 295], [448, 449], [449, 346], [346, 448], [356, 264], [264, 454], [454, 356], [337, 336], [336, 299], [299, 337], [337, 338], [338, 151], [151, 337], [294, 278], [278, 455], [455, 294], [308, 292], [292, 415], [415, 308], [429, 358], [358, 355], [355, 429], [265, 340], [340, 372], [372, 265], [352, 346], [346, 280], [280, 352], [295, 442], [442, 282], [282, 295], [354, 19], [19, 370], [370, 354], [285, 441], [441, 295], [295, 285], [195, 248], [248, 197], [197, 195], [457, 440], [440, 274], [274, 457], [301, 300], [300, 368], [368, 301], [417, 351], [351, 465], [465, 417], [251, 301], [301, 389], [389, 251], [394, 395], [395, 379], [379, 394], [399, 412], [412, 419], [419, 399], [410, 436], [436, 322], [322, 410], [326, 2], [2, 393], [393, 326], [354, 370], [370, 461], [461, 354], [393, 164], [164, 267], [267, 393], [268, 302], [302, 12], [12, 268], [312, 268], [268, 13], [13, 312], [298, 293], [293, 301], [301, 298], [265, 446], [446, 340], [340, 265], [280, 330], [330, 425], [425, 280], [322, 426], [426, 391], [391, 322], [420, 429], [429, 437], [437, 420], [393, 391], [391, 326], [326, 393], [344, 440], [440, 438], [438, 344], [458, 459], [459, 461], [461, 458], [364, 434], [434, 394], [394, 364], [428, 396], [396, 262], [262, 428], [274, 354], [354, 457], [457, 274], [317, 316], [316, 402], [402, 317], [316, 315], [315, 403], [403, 316], [315, 314], [314, 404], [404, 315], [314, 313], [313, 405], [405, 314], [313, 421], [421, 406], [406, 313], [323, 366], [366, 361], [361, 323], [292, 306], [306, 407], [407, 292], [306, 291], [291, 408], [408, 306], [291, 287], [287, 409], [409, 291], [287, 432], [432, 410], [410, 287], [427, 434], [434, 411], [411, 427], [372, 264], [264, 383], [383, 372], [459, 309], [309, 457], [457, 459], [366, 352], [352, 401], [401, 366], [1, 274], [274, 4], [4, 1], [418, 421], [421, 262], [262, 418], [331, 294], [294, 358], [358, 331], [435, 433], [433, 367], [367, 435], [392, 289], [289, 439], [439, 392], [328, 462], [462, 326], [326, 328], [94, 2], [2, 370], [370, 94], [289, 305], [305, 455], [455, 289], [339, 254], [254, 448], [448, 339], [359, 255], [255, 446], [446, 359], [254, 253], [253, 449], [449, 254], [253, 252], [252, 450], [450, 253], [252, 256], [256, 451], [451, 252], [256, 341], [341, 452], [452, 256], [414, 413], [413, 463], [463, 414], [286, 441], [441, 414], [414, 286], [286, 258], [258, 441], [441, 286], [258, 257], [257, 442], [442, 258], [257, 259], [259, 443], [443, 257], [259, 260], [260, 444], [444, 259], [260, 467], [467, 445], [445, 260], [309, 459], [459, 250], [250, 309], [305, 289], [289, 290], [290, 305], [305, 290], [290, 460], [460, 305], [401, 376], [376, 435], [435, 401], [309, 250], [250, 392], [392, 309], [376, 411], [411, 433], [433, 376], [453, 341], [341, 464], [464, 453], [357, 453], [453, 465], [465, 357], [343, 357], [357, 412], [412, 343], [437, 343], [343, 399], [399, 437], [344, 360], [360, 440], [440, 344], [420, 437], [437, 456], [456, 420], [360, 420], [420, 363], [363, 360], [361, 401], [401, 288], [288, 361], [265, 372], [372, 353], [353, 265], [390, 339], [339, 249], [249, 390], [339, 448], [448, 255], [255, 339]);
function kc(t2) {
  t2.j = { faceLandmarks: [], faceBlendshapes: [], facialTransformationMatrixes: [] };
}
var Sc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "image_in", "norm_rect", false), this.j = { faceLandmarks: [], faceBlendshapes: [], facialTransformationMatrixes: [] }, this.outputFacialTransformationMatrixes = this.outputFaceBlendshapes = false, wn(t2 = this.h = new Js(), 0, 1, e2 = new Xs()), this.A = new $s(), wn(this.h, 0, 3, this.A), this.u = new zs(), wn(this.h, 0, 2, this.u), xn(this.u, 4, 1), Ln(this.u, 2, 0.5), Ln(this.A, 2, 0.5), Ln(this.h, 4, 0.5);
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    return "numFaces" in t2 && xn(this.u, 4, t2.numFaces ?? 1), "minFaceDetectionConfidence" in t2 && Ln(this.u, 2, t2.minFaceDetectionConfidence ?? 0.5), "minTrackingConfidence" in t2 && Ln(this.h, 4, t2.minTrackingConfidence ?? 0.5), "minFacePresenceConfidence" in t2 && Ln(this.A, 2, t2.minFacePresenceConfidence ?? 0.5), "outputFaceBlendshapes" in t2 && (this.outputFaceBlendshapes = !!t2.outputFaceBlendshapes), "outputFacialTransformationMatrixes" in t2 && (this.outputFacialTransformationMatrixes = !!t2.outputFacialTransformationMatrixes), this.l(t2);
  }
  F(t2, e2) {
    return kc(this), uc(this, t2, e2), this.j;
  }
  G(t2, e2, n2) {
    return kc(this), lc(this, t2, n2, e2), this.j;
  }
  m() {
    var t2 = new ls();
    hs(t2, "image_in"), hs(t2, "norm_rect"), us(t2, "face_landmarks");
    const e2 = new Qi();
    xr(e2, Qs, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.face_landmarker.FaceLandmarkerGraph"), ns(n2, "IMAGE:image_in"), ns(n2, "NORM_RECT:norm_rect"), rs(n2, "NORM_LANDMARKS:face_landmarks"), n2.o(e2), cs(t2, n2), this.g.attachProtoVectorListener("face_landmarks", ((t3, e3) => {
      for (const e4 of t3) t3 = ks(e4), this.j.faceLandmarks.push(Ho(t3));
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("face_landmarks", ((t3) => {
      ua(this, t3);
    })), this.outputFaceBlendshapes && (us(t2, "blendshapes"), rs(n2, "BLENDSHAPES:blendshapes"), this.g.attachProtoVectorListener("blendshapes", ((t3, e3) => {
      if (this.outputFaceBlendshapes) for (const e4 of t3) t3 = ys(e4), this.j.faceBlendshapes.push(jo(t3.g() ?? []));
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("blendshapes", ((t3) => {
      ua(this, t3);
    }))), this.outputFacialTransformationMatrixes && (us(t2, "face_geometry"), rs(n2, "FACE_GEOMETRY:face_geometry"), this.g.attachProtoVectorListener("face_geometry", ((t3, e3) => {
      if (this.outputFacialTransformationMatrixes) for (const e4 of t3) (t3 = yn(t3 = qs(e4), Ss, 2)) && this.j.facialTransformationMatrixes.push({ rows: kn(t3, 1) ?? 0 ?? 0, columns: kn(t3, 2) ?? 0 ?? 0, data: en(t3, 3, $t, tn()).slice() ?? [] });
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("face_geometry", ((t3) => {
      ua(this, t3);
    }))), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Sc.prototype.detectForVideo = Sc.prototype.G, Sc.prototype.detect = Sc.prototype.F, Sc.prototype.setOptions = Sc.prototype.o, Sc.createFromModelPath = function(t2, e2) {
  return cc(Sc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Sc.createFromModelBuffer = function(t2, e2) {
  return cc(Sc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Sc.createFromOptions = function(t2, e2) {
  return cc(Sc, t2, e2);
}, Sc.FACE_LANDMARKS_LIPS = gc, Sc.FACE_LANDMARKS_LEFT_EYE = mc, Sc.FACE_LANDMARKS_LEFT_EYEBROW = yc, Sc.FACE_LANDMARKS_LEFT_IRIS = _c, Sc.FACE_LANDMARKS_RIGHT_EYE = vc, Sc.FACE_LANDMARKS_RIGHT_EYEBROW = Ec, Sc.FACE_LANDMARKS_RIGHT_IRIS = wc, Sc.FACE_LANDMARKS_FACE_OVAL = Tc, Sc.FACE_LANDMARKS_CONTOURS = Ac, Sc.FACE_LANDMARKS_TESSELATION = bc;
var xc = ic([0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]);
function Lc(t2) {
  t2.gestures = [], t2.landmarks = [], t2.worldLandmarks = [], t2.handedness = [];
}
function Rc(t2) {
  return 0 === t2.gestures.length ? { gestures: [], landmarks: [], worldLandmarks: [], handedness: [], handednesses: [] } : { gestures: t2.gestures, landmarks: t2.landmarks, worldLandmarks: t2.worldLandmarks, handedness: t2.handedness, handednesses: t2.handedness };
}
function Ic(t2, e2 = true) {
  const n2 = [];
  for (const i2 of t2) {
    var r2 = ys(i2);
    t2 = [];
    for (const n3 of r2.g()) r2 = e2 && null != kn(n3, 1) ? kn(n3, 1) ?? 0 : -1, t2.push({ score: Sn(n3, 2) ?? 0, index: r2, categoryName: le($e(n3, 3)) ?? "" ?? "", displayName: le($e(n3, 4)) ?? "" ?? "" });
    n2.push(t2);
  }
  return n2;
}
var Fc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "image_in", "norm_rect", false), this.gestures = [], this.landmarks = [], this.worldLandmarks = [], this.handedness = [], wn(t2 = this.j = new oo(), 0, 1, e2 = new Xs()), this.u = new so(), wn(this.j, 0, 2, this.u), this.D = new io(), wn(this.u, 0, 3, this.D), this.A = new ro(), wn(this.u, 0, 2, this.A), this.h = new no(), wn(this.j, 0, 3, this.h), Ln(this.A, 2, 0.5), Ln(this.u, 4, 0.5), Ln(this.D, 2, 0.5);
  }
  get baseOptions() {
    return yn(this.j, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.j, 0, 1, t2);
  }
  o(t2) {
    if (xn(this.A, 3, t2.numHands ?? 1), "minHandDetectionConfidence" in t2 && Ln(this.A, 2, t2.minHandDetectionConfidence ?? 0.5), "minTrackingConfidence" in t2 && Ln(this.u, 4, t2.minTrackingConfidence ?? 0.5), "minHandPresenceConfidence" in t2 && Ln(this.D, 2, t2.minHandPresenceConfidence ?? 0.5), t2.cannedGesturesClassifierOptions) {
      var e2 = new to(), n2 = e2, r2 = Bo(t2.cannedGesturesClassifierOptions, yn(this.h, to, 3)?.l());
      wn(n2, 0, 2, r2), wn(this.h, 0, 3, e2);
    } else void 0 === t2.cannedGesturesClassifierOptions && yn(this.h, to, 3)?.g();
    return t2.customGesturesClassifierOptions ? (wn(n2 = e2 = new to(), 0, 2, r2 = Bo(t2.customGesturesClassifierOptions, yn(this.h, to, 4)?.l())), wn(this.h, 0, 4, e2)) : void 0 === t2.customGesturesClassifierOptions && yn(this.h, to, 4)?.g(), this.l(t2);
  }
  Ha(t2, e2) {
    return Lc(this), uc(this, t2, e2), Rc(this);
  }
  Ia(t2, e2, n2) {
    return Lc(this), lc(this, t2, n2, e2), Rc(this);
  }
  m() {
    var t2 = new ls();
    hs(t2, "image_in"), hs(t2, "norm_rect"), us(t2, "hand_gestures"), us(t2, "hand_landmarks"), us(t2, "world_hand_landmarks"), us(t2, "handedness");
    const e2 = new Qi();
    xr(e2, lo, this.j);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.gesture_recognizer.GestureRecognizerGraph"), ns(n2, "IMAGE:image_in"), ns(n2, "NORM_RECT:norm_rect"), rs(n2, "HAND_GESTURES:hand_gestures"), rs(n2, "LANDMARKS:hand_landmarks"), rs(n2, "WORLD_LANDMARKS:world_hand_landmarks"), rs(n2, "HANDEDNESS:handedness"), n2.o(e2), cs(t2, n2), this.g.attachProtoVectorListener("hand_landmarks", ((t3, e3) => {
      for (const e4 of t3) {
        t3 = ks(e4);
        const n3 = [];
        for (const e5 of vn(t3, bs, 1)) n3.push({ x: Sn(e5, 1) ?? 0, y: Sn(e5, 2) ?? 0, z: Sn(e5, 3) ?? 0, visibility: Sn(e5, 4) ?? 0 });
        this.landmarks.push(n3);
      }
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("hand_landmarks", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoVectorListener("world_hand_landmarks", ((t3, e3) => {
      for (const e4 of t3) {
        t3 = As(e4);
        const n3 = [];
        for (const e5 of vn(t3, Ts, 1)) n3.push({ x: Sn(e5, 1) ?? 0, y: Sn(e5, 2) ?? 0, z: Sn(e5, 3) ?? 0, visibility: Sn(e5, 4) ?? 0 });
        this.worldLandmarks.push(n3);
      }
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("world_hand_landmarks", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoVectorListener("hand_gestures", ((t3, e3) => {
      this.gestures.push(...Ic(t3, false)), ua(this, e3);
    })), this.g.attachEmptyPacketListener("hand_gestures", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoVectorListener("handedness", ((t3, e3) => {
      this.handedness.push(...Ic(t3)), ua(this, e3);
    })), this.g.attachEmptyPacketListener("handedness", ((t3) => {
      ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
function Mc(t2) {
  return { landmarks: t2.landmarks, worldLandmarks: t2.worldLandmarks, handednesses: t2.handedness, handedness: t2.handedness };
}
Fc.prototype.recognizeForVideo = Fc.prototype.Ia, Fc.prototype.recognize = Fc.prototype.Ha, Fc.prototype.setOptions = Fc.prototype.o, Fc.createFromModelPath = function(t2, e2) {
  return cc(Fc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Fc.createFromModelBuffer = function(t2, e2) {
  return cc(Fc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Fc.createFromOptions = function(t2, e2) {
  return cc(Fc, t2, e2);
}, Fc.HAND_CONNECTIONS = xc;
var Pc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "image_in", "norm_rect", false), this.landmarks = [], this.worldLandmarks = [], this.handedness = [], wn(t2 = this.h = new so(), 0, 1, e2 = new Xs()), this.u = new io(), wn(this.h, 0, 3, this.u), this.j = new ro(), wn(this.h, 0, 2, this.j), xn(this.j, 3, 1), Ln(this.j, 2, 0.5), Ln(this.u, 2, 0.5), Ln(this.h, 4, 0.5);
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    return "numHands" in t2 && xn(this.j, 3, t2.numHands ?? 1), "minHandDetectionConfidence" in t2 && Ln(this.j, 2, t2.minHandDetectionConfidence ?? 0.5), "minTrackingConfidence" in t2 && Ln(this.h, 4, t2.minTrackingConfidence ?? 0.5), "minHandPresenceConfidence" in t2 && Ln(this.u, 2, t2.minHandPresenceConfidence ?? 0.5), this.l(t2);
  }
  F(t2, e2) {
    return this.landmarks = [], this.worldLandmarks = [], this.handedness = [], uc(this, t2, e2), Mc(this);
  }
  G(t2, e2, n2) {
    return this.landmarks = [], this.worldLandmarks = [], this.handedness = [], lc(this, t2, n2, e2), Mc(this);
  }
  m() {
    var t2 = new ls();
    hs(t2, "image_in"), hs(t2, "norm_rect"), us(t2, "hand_landmarks"), us(t2, "world_hand_landmarks"), us(t2, "handedness");
    const e2 = new Qi();
    xr(e2, fo, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.hand_landmarker.HandLandmarkerGraph"), ns(n2, "IMAGE:image_in"), ns(n2, "NORM_RECT:norm_rect"), rs(n2, "LANDMARKS:hand_landmarks"), rs(n2, "WORLD_LANDMARKS:world_hand_landmarks"), rs(n2, "HANDEDNESS:handedness"), n2.o(e2), cs(t2, n2), this.g.attachProtoVectorListener("hand_landmarks", ((t3, e3) => {
      for (const e4 of t3) t3 = ks(e4), this.landmarks.push(Ho(t3));
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("hand_landmarks", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoVectorListener("world_hand_landmarks", ((t3, e3) => {
      for (const e4 of t3) t3 = As(e4), this.worldLandmarks.push(Wo(t3));
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("world_hand_landmarks", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoVectorListener("handedness", ((t3, e3) => {
      var n3 = this.handedness, r2 = n3.push;
      const i2 = [];
      for (const e4 of t3) {
        t3 = ys(e4);
        const n4 = [];
        for (const e5 of t3.g()) n4.push({ score: Sn(e5, 2) ?? 0, index: kn(e5, 1) ?? 0 ?? -1, categoryName: le($e(e5, 3)) ?? "" ?? "", displayName: le($e(e5, 4)) ?? "" ?? "" });
        i2.push(n4);
      }
      r2.call(n3, ...i2), ua(this, e3);
    })), this.g.attachEmptyPacketListener("handedness", ((t3) => {
      ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Pc.prototype.detectForVideo = Pc.prototype.G, Pc.prototype.detect = Pc.prototype.F, Pc.prototype.setOptions = Pc.prototype.o, Pc.createFromModelPath = function(t2, e2) {
  return cc(Pc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Pc.createFromModelBuffer = function(t2, e2) {
  return cc(Pc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Pc.createFromOptions = function(t2, e2) {
  return cc(Pc, t2, e2);
}, Pc.HAND_CONNECTIONS = xc;
var Cc = ic([0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19], [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30], [29, 31], [30, 32], [27, 31], [28, 32]);
function Oc(t2) {
  t2.h = { faceLandmarks: [], faceBlendshapes: [], poseLandmarks: [], poseWorldLandmarks: [], poseSegmentationMasks: [], leftHandLandmarks: [], leftHandWorldLandmarks: [], rightHandLandmarks: [], rightHandWorldLandmarks: [] };
}
function Nc(t2) {
  try {
    if (!t2.D) return t2.h;
    t2.D(t2.h);
  } finally {
    da(t2);
  }
}
function Uc(t2, e2) {
  t2 = ks(t2), e2.push(Ho(t2));
}
var Dc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "input_frames_image", null, false), this.h = { faceLandmarks: [], faceBlendshapes: [], poseLandmarks: [], poseWorldLandmarks: [], poseSegmentationMasks: [], leftHandLandmarks: [], leftHandWorldLandmarks: [], rightHandLandmarks: [], rightHandWorldLandmarks: [] }, this.outputPoseSegmentationMasks = this.outputFaceBlendshapes = false, wn(t2 = this.j = new yo(), 0, 1, e2 = new Xs()), this.I = new io(), wn(this.j, 0, 2, this.I), this.W = new po(), wn(this.j, 0, 3, this.W), this.u = new zs(), wn(this.j, 0, 4, this.u), this.O = new $s(), wn(this.j, 0, 5, this.O), this.A = new go(), wn(this.j, 0, 6, this.A), this.M = new mo(), wn(this.j, 0, 7, this.M), Ln(this.u, 2, 0.5), Ln(this.u, 3, 0.3), Ln(this.O, 2, 0.5), Ln(this.A, 2, 0.5), Ln(this.A, 3, 0.3), Ln(this.M, 2, 0.5), Ln(this.I, 2, 0.5);
  }
  get baseOptions() {
    return yn(this.j, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.j, 0, 1, t2);
  }
  o(t2) {
    return "minFaceDetectionConfidence" in t2 && Ln(this.u, 2, t2.minFaceDetectionConfidence ?? 0.5), "minFaceSuppressionThreshold" in t2 && Ln(this.u, 3, t2.minFaceSuppressionThreshold ?? 0.3), "minFacePresenceConfidence" in t2 && Ln(this.O, 2, t2.minFacePresenceConfidence ?? 0.5), "outputFaceBlendshapes" in t2 && (this.outputFaceBlendshapes = !!t2.outputFaceBlendshapes), "minPoseDetectionConfidence" in t2 && Ln(this.A, 2, t2.minPoseDetectionConfidence ?? 0.5), "minPoseSuppressionThreshold" in t2 && Ln(this.A, 3, t2.minPoseSuppressionThreshold ?? 0.3), "minPosePresenceConfidence" in t2 && Ln(this.M, 2, t2.minPosePresenceConfidence ?? 0.5), "outputPoseSegmentationMasks" in t2 && (this.outputPoseSegmentationMasks = !!t2.outputPoseSegmentationMasks), "minHandLandmarksConfidence" in t2 && Ln(this.I, 2, t2.minHandLandmarksConfidence ?? 0.5), this.l(t2);
  }
  F(t2, e2, n2) {
    const r2 = "function" != typeof e2 ? e2 : {};
    return this.D = "function" == typeof e2 ? e2 : n2, Oc(this), uc(this, t2, r2), Nc(this);
  }
  G(t2, e2, n2, r2) {
    const i2 = "function" != typeof n2 ? n2 : {};
    return this.D = "function" == typeof n2 ? n2 : r2, Oc(this), lc(this, t2, i2, e2), Nc(this);
  }
  m() {
    var t2 = new ls();
    hs(t2, "input_frames_image"), us(t2, "pose_landmarks"), us(t2, "pose_world_landmarks"), us(t2, "face_landmarks"), us(t2, "left_hand_landmarks"), us(t2, "left_hand_world_landmarks"), us(t2, "right_hand_landmarks"), us(t2, "right_hand_world_landmarks");
    const e2 = new Qi(), n2 = new Bi();
    Rn(n2, 1, "type.googleapis.com/mediapipe.tasks.vision.holistic_landmarker.proto.HolisticLandmarkerGraphOptions"), (function(t3, e3) {
      if (null != e3) if (Array.isArray(e3)) Ze(t3, 2, Ie(e3, 0, Me));
      else {
        if (!("string" == typeof e3 || e3 instanceof F || x(e3))) throw Error("invalid value in Any.value field: " + e3 + " expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array");
        hn(t3, 2, ht(e3, false), R());
      }
    })(n2, this.j.g());
    const r2 = new is();
    Rn(r2, 2, "mediapipe.tasks.vision.holistic_landmarker.HolisticLandmarkerGraph"), bn(r2, 8, Bi, n2), ns(r2, "IMAGE:input_frames_image"), rs(r2, "POSE_LANDMARKS:pose_landmarks"), rs(r2, "POSE_WORLD_LANDMARKS:pose_world_landmarks"), rs(r2, "FACE_LANDMARKS:face_landmarks"), rs(r2, "LEFT_HAND_LANDMARKS:left_hand_landmarks"), rs(r2, "LEFT_HAND_WORLD_LANDMARKS:left_hand_world_landmarks"), rs(r2, "RIGHT_HAND_LANDMARKS:right_hand_landmarks"), rs(r2, "RIGHT_HAND_WORLD_LANDMARKS:right_hand_world_landmarks"), r2.o(e2), cs(t2, r2), la(this, t2), this.g.attachProtoListener("pose_landmarks", ((t3, e3) => {
      Uc(t3, this.h.poseLandmarks), ua(this, e3);
    })), this.g.attachEmptyPacketListener("pose_landmarks", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoListener("pose_world_landmarks", ((t3, e3) => {
      var n3 = this.h.poseWorldLandmarks;
      t3 = As(t3), n3.push(Wo(t3)), ua(this, e3);
    })), this.g.attachEmptyPacketListener("pose_world_landmarks", ((t3) => {
      ua(this, t3);
    })), this.outputPoseSegmentationMasks && (rs(r2, "POSE_SEGMENTATION_MASK:pose_segmentation_mask"), fa(this, "pose_segmentation_mask"), this.g.Z("pose_segmentation_mask", ((t3, e3) => {
      this.h.poseSegmentationMasks = [fc(this, t3, true, !this.D)], ua(this, e3);
    })), this.g.attachEmptyPacketListener("pose_segmentation_mask", ((t3) => {
      this.h.poseSegmentationMasks = [], ua(this, t3);
    }))), this.g.attachProtoListener("face_landmarks", ((t3, e3) => {
      Uc(t3, this.h.faceLandmarks), ua(this, e3);
    })), this.g.attachEmptyPacketListener("face_landmarks", ((t3) => {
      ua(this, t3);
    })), this.outputFaceBlendshapes && (us(t2, "extra_blendshapes"), rs(r2, "FACE_BLENDSHAPES:extra_blendshapes"), this.g.attachProtoListener("extra_blendshapes", ((t3, e3) => {
      var n3 = this.h.faceBlendshapes;
      this.outputFaceBlendshapes && (t3 = ys(t3), n3.push(jo(t3.g() ?? []))), ua(this, e3);
    })), this.g.attachEmptyPacketListener("extra_blendshapes", ((t3) => {
      ua(this, t3);
    }))), this.g.attachProtoListener("left_hand_landmarks", ((t3, e3) => {
      Uc(t3, this.h.leftHandLandmarks), ua(this, e3);
    })), this.g.attachEmptyPacketListener("left_hand_landmarks", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoListener("left_hand_world_landmarks", ((t3, e3) => {
      var n3 = this.h.leftHandWorldLandmarks;
      t3 = As(t3), n3.push(Wo(t3)), ua(this, e3);
    })), this.g.attachEmptyPacketListener("left_hand_world_landmarks", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoListener("right_hand_landmarks", ((t3, e3) => {
      Uc(t3, this.h.rightHandLandmarks), ua(this, e3);
    })), this.g.attachEmptyPacketListener("right_hand_landmarks", ((t3) => {
      ua(this, t3);
    })), this.g.attachProtoListener("right_hand_world_landmarks", ((t3, e3) => {
      var n3 = this.h.rightHandWorldLandmarks;
      t3 = As(t3), n3.push(Wo(t3)), ua(this, e3);
    })), this.g.attachEmptyPacketListener("right_hand_world_landmarks", ((t3) => {
      ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Dc.prototype.detectForVideo = Dc.prototype.G, Dc.prototype.detect = Dc.prototype.F, Dc.prototype.setOptions = Dc.prototype.o, Dc.createFromModelPath = function(t2, e2) {
  return cc(Dc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Dc.createFromModelBuffer = function(t2, e2) {
  return cc(Dc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Dc.createFromOptions = function(t2, e2) {
  return cc(Dc, t2, e2);
}, Dc.HAND_CONNECTIONS = xc, Dc.POSE_CONNECTIONS = Cc, Dc.FACE_LANDMARKS_LIPS = gc, Dc.FACE_LANDMARKS_LEFT_EYE = mc, Dc.FACE_LANDMARKS_LEFT_EYEBROW = yc, Dc.FACE_LANDMARKS_LEFT_IRIS = _c, Dc.FACE_LANDMARKS_RIGHT_EYE = vc, Dc.FACE_LANDMARKS_RIGHT_EYEBROW = Ec, Dc.FACE_LANDMARKS_RIGHT_IRIS = wc, Dc.FACE_LANDMARKS_FACE_OVAL = Tc, Dc.FACE_LANDMARKS_CONTOURS = Ac, Dc.FACE_LANDMARKS_TESSELATION = bc;
var Bc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "input_image", "norm_rect", true), this.j = { classifications: [] }, wn(t2 = this.h = new Eo(), 0, 1, e2 = new Xs());
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    return wn(this.h, 0, 2, Bo(t2, yn(this.h, Ns, 2))), this.l(t2);
  }
  sa(t2, e2) {
    return this.j = { classifications: [] }, uc(this, t2, e2), this.j;
  }
  ta(t2, e2, n2) {
    return this.j = { classifications: [] }, lc(this, t2, n2, e2), this.j;
  }
  m() {
    var t2 = new ls();
    hs(t2, "input_image"), hs(t2, "norm_rect"), us(t2, "classifications");
    const e2 = new Qi();
    xr(e2, wo, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.image_classifier.ImageClassifierGraph"), ns(n2, "IMAGE:input_image"), ns(n2, "NORM_RECT:norm_rect"), rs(n2, "CLASSIFICATIONS:classifications"), n2.o(e2), cs(t2, n2), this.g.attachProtoListener("classifications", ((t3, e3) => {
      this.j = Vo(Is(t3)), ua(this, e3);
    })), this.g.attachEmptyPacketListener("classifications", ((t3) => {
      ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Bc.prototype.classifyForVideo = Bc.prototype.ta, Bc.prototype.classify = Bc.prototype.sa, Bc.prototype.setOptions = Bc.prototype.o, Bc.createFromModelPath = function(t2, e2) {
  return cc(Bc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Bc.createFromModelBuffer = function(t2, e2) {
  return cc(Bc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Bc.createFromOptions = function(t2, e2) {
  return cc(Bc, t2, e2);
};
var Gc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "image_in", "norm_rect", true), this.h = new To(), this.embeddings = { embeddings: [] }, wn(t2 = this.h, 0, 1, e2 = new Xs());
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    var e2 = this.h, n2 = yn(this.h, Ds, 2);
    return n2 = n2 ? n2.clone() : new Ds(), void 0 !== t2.l2Normalize ? Ze(n2, 1, Jt(t2.l2Normalize)) : "l2Normalize" in t2 && Ze(n2, 1), void 0 !== t2.quantize ? Ze(n2, 2, Jt(t2.quantize)) : "quantize" in t2 && Ze(n2, 2), wn(e2, 0, 2, n2), this.l(t2);
  }
  za(t2, e2) {
    return uc(this, t2, e2), this.embeddings;
  }
  Aa(t2, e2, n2) {
    return lc(this, t2, n2, e2), this.embeddings;
  }
  m() {
    var t2 = new ls();
    hs(t2, "image_in"), hs(t2, "norm_rect"), us(t2, "embeddings_out");
    const e2 = new Qi();
    xr(e2, Ao, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.image_embedder.ImageEmbedderGraph"), ns(n2, "IMAGE:image_in"), ns(n2, "NORM_RECT:norm_rect"), rs(n2, "EMBEDDINGS:embeddings_out"), n2.o(e2), cs(t2, n2), this.g.attachProtoListener("embeddings_out", ((t3, e3) => {
      t3 = Os(t3), this.embeddings = (function(t4) {
        return { embeddings: vn(t4, Ps, 1).map(((t5) => {
          const e4 = { headIndex: kn(t5, 3) ?? 0 ?? -1, headName: le($e(t5, 4)) ?? "" ?? "" };
          var n3 = t5.v;
          return void 0 !== mn(n3, 0 | n3[Q], Fs, ln(t5, 1)) ? (t5 = en(t5 = yn(t5, Fs, ln(t5, 1), void 0), 1, $t, tn()), e4.floatEmbedding = t5.slice()) : (n3 = new Uint8Array(0), e4.quantizedEmbedding = yn(t5, Ms, ln(t5, 2), void 0)?.na()?.h() ?? n3), e4;
        })), timestampMs: Go($e(t4, 2, void 0, void 0, ce) ?? Ye) };
      })(t3), ua(this, e3);
    })), this.g.attachEmptyPacketListener("embeddings_out", ((t3) => {
      ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Gc.cosineSimilarity = function(t2, e2) {
  if (t2.floatEmbedding && e2.floatEmbedding) t2 = Ko(t2.floatEmbedding, e2.floatEmbedding);
  else {
    if (!t2.quantizedEmbedding || !e2.quantizedEmbedding) throw Error("Cannot compute cosine similarity between quantized and float embeddings.");
    t2 = Ko(zo(t2.quantizedEmbedding), zo(e2.quantizedEmbedding));
  }
  return t2;
}, Gc.prototype.embedForVideo = Gc.prototype.Aa, Gc.prototype.embed = Gc.prototype.za, Gc.prototype.setOptions = Gc.prototype.o, Gc.createFromModelPath = function(t2, e2) {
  return cc(Gc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Gc.createFromModelBuffer = function(t2, e2) {
  return cc(Gc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Gc.createFromOptions = function(t2, e2) {
  return cc(Gc, t2, e2);
};
var jc = class {
  constructor(t2, e2, n2) {
    this.confidenceMasks = t2, this.categoryMask = e2, this.qualityScores = n2;
  }
  close() {
    this.confidenceMasks?.forEach(((t2) => {
      t2.close();
    })), this.categoryMask?.close();
  }
};
function Vc(t2) {
  const e2 = (function(t3) {
    return vn(t3, is, 1);
  })(t2.ca()).filter(((t3) => (le($e(t3, 1)) ?? "").includes("mediapipe.tasks.TensorsToSegmentationCalculator")));
  if (t2.u = [], e2.length > 1) throw Error("The graph has more than one mediapipe.tasks.TensorsToSegmentationCalculator.");
  1 === e2.length && (yn(e2[0], Qi, 7)?.j()?.g() ?? /* @__PURE__ */ new Map()).forEach(((e3, n2) => {
    t2.u[Number(n2)] = le($e(e3, 1)) ?? "";
  }));
}
function Xc(t2) {
  t2.categoryMask = void 0, t2.confidenceMasks = void 0, t2.qualityScores = void 0;
}
function Hc(t2) {
  try {
    const e2 = new jc(t2.confidenceMasks, t2.categoryMask, t2.qualityScores);
    if (!t2.j) return e2;
    t2.j(e2);
  } finally {
    da(t2);
  }
}
jc.prototype.close = jc.prototype.close;
var Wc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "image_in", "norm_rect", false), this.u = [], this.outputCategoryMask = false, this.outputConfidenceMasks = true, this.h = new Lo(), this.A = new bo(), wn(this.h, 0, 3, this.A), wn(t2 = this.h, 0, 1, e2 = new Xs());
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    return void 0 !== t2.displayNamesLocale ? Ze(this.h, 2, ue(t2.displayNamesLocale)) : "displayNamesLocale" in t2 && Ze(this.h, 2), "outputCategoryMask" in t2 && (this.outputCategoryMask = t2.outputCategoryMask ?? false), "outputConfidenceMasks" in t2 && (this.outputConfidenceMasks = t2.outputConfidenceMasks ?? true), super.l(t2);
  }
  L() {
    Vc(this);
  }
  segment(t2, e2, n2) {
    const r2 = "function" != typeof e2 ? e2 : {};
    return this.j = "function" == typeof e2 ? e2 : n2, Xc(this), uc(this, t2, r2), Hc(this);
  }
  La(t2, e2, n2, r2) {
    const i2 = "function" != typeof n2 ? n2 : {};
    return this.j = "function" == typeof n2 ? n2 : r2, Xc(this), lc(this, t2, i2, e2), Hc(this);
  }
  Da() {
    return this.u;
  }
  m() {
    var t2 = new ls();
    hs(t2, "image_in"), hs(t2, "norm_rect");
    const e2 = new Qi();
    xr(e2, Ro, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph"), ns(n2, "IMAGE:image_in"), ns(n2, "NORM_RECT:norm_rect"), n2.o(e2), cs(t2, n2), la(this, t2), this.outputConfidenceMasks && (us(t2, "confidence_masks"), rs(n2, "CONFIDENCE_MASKS:confidence_masks"), fa(this, "confidence_masks"), this.g.aa("confidence_masks", ((t3, e3) => {
      this.confidenceMasks = t3.map(((t4) => fc(this, t4, true, !this.j))), ua(this, e3);
    })), this.g.attachEmptyPacketListener("confidence_masks", ((t3) => {
      this.confidenceMasks = [], ua(this, t3);
    }))), this.outputCategoryMask && (us(t2, "category_mask"), rs(n2, "CATEGORY_MASK:category_mask"), fa(this, "category_mask"), this.g.Z("category_mask", ((t3, e3) => {
      this.categoryMask = fc(this, t3, false, !this.j), ua(this, e3);
    })), this.g.attachEmptyPacketListener("category_mask", ((t3) => {
      this.categoryMask = void 0, ua(this, t3);
    }))), us(t2, "quality_scores"), rs(n2, "QUALITY_SCORES:quality_scores"), this.g.attachFloatVectorListener("quality_scores", ((t3, e3) => {
      this.qualityScores = t3, ua(this, e3);
    })), this.g.attachEmptyPacketListener("quality_scores", ((t3) => {
      this.categoryMask = void 0, ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Wc.prototype.getLabels = Wc.prototype.Da, Wc.prototype.segmentForVideo = Wc.prototype.La, Wc.prototype.segment = Wc.prototype.segment, Wc.prototype.setOptions = Wc.prototype.o, Wc.createFromModelPath = function(t2, e2) {
  return cc(Wc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Wc.createFromModelBuffer = function(t2, e2) {
  return cc(Wc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Wc.createFromOptions = function(t2, e2) {
  return cc(Wc, t2, e2);
};
var zc = class {
  constructor(t2, e2, n2) {
    this.confidenceMasks = t2, this.categoryMask = e2, this.qualityScores = n2;
  }
  close() {
    this.confidenceMasks?.forEach(((t2) => {
      t2.close();
    })), this.categoryMask?.close();
  }
};
zc.prototype.close = zc.prototype.close;
var Kc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "image_in", "norm_rect_in", false), this.outputCategoryMask = false, this.outputConfidenceMasks = true, this.h = new Lo(), this.u = new bo(), wn(this.h, 0, 3, this.u), wn(t2 = this.h, 0, 1, e2 = new Xs());
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    return "outputCategoryMask" in t2 && (this.outputCategoryMask = t2.outputCategoryMask ?? false), "outputConfidenceMasks" in t2 && (this.outputConfidenceMasks = t2.outputConfidenceMasks ?? true), super.l(t2);
  }
  segment(t2, e2, n2, r2) {
    const i2 = "function" != typeof n2 ? n2 : {};
    if (this.j = "function" == typeof n2 ? n2 : r2, this.qualityScores = this.categoryMask = this.confidenceMasks = void 0, n2 = this.C + 1, r2 = new Po(), e2.keypoint && e2.scribble) throw Error("Cannot provide both keypoint and scribble.");
    if (e2.keypoint) {
      var s2 = new Io();
      hn(s2, 3, Jt(true), false), hn(s2, 1, qt(e2.keypoint.x), 0), hn(s2, 2, qt(e2.keypoint.y), 0), Tn(r2, 1, Co, s2);
    } else {
      if (!e2.scribble) throw Error("Must provide either a keypoint or a scribble.");
      {
        const t3 = new Mo();
        for (s2 of e2.scribble) hn(e2 = new Io(), 3, Jt(true), false), hn(e2, 1, qt(s2.x), 0), hn(e2, 2, qt(s2.y), 0), bn(t3, 1, Io, e2);
        Tn(r2, 2, Co, t3);
      }
    }
    this.g.addProtoToStream(r2.g(), "mediapipe.tasks.vision.interactive_segmenter.proto.RegionOfInterest", "roi_in", n2), uc(this, t2, i2);
    t: {
      try {
        const t3 = new zc(this.confidenceMasks, this.categoryMask, this.qualityScores);
        if (!this.j) {
          var o2 = t3;
          break t;
        }
        this.j(t3);
      } finally {
        da(this);
      }
      o2 = void 0;
    }
    return o2;
  }
  m() {
    var t2 = new ls();
    hs(t2, "image_in"), hs(t2, "roi_in"), hs(t2, "norm_rect_in");
    const e2 = new Qi();
    xr(e2, Ro, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.interactive_segmenter.InteractiveSegmenterGraphV2"), ns(n2, "IMAGE:image_in"), ns(n2, "ROI:roi_in"), ns(n2, "NORM_RECT:norm_rect_in"), n2.o(e2), cs(t2, n2), la(this, t2), this.outputConfidenceMasks && (us(t2, "confidence_masks"), rs(n2, "CONFIDENCE_MASKS:confidence_masks"), fa(this, "confidence_masks"), this.g.aa("confidence_masks", ((t3, e3) => {
      this.confidenceMasks = t3.map(((t4) => fc(this, t4, true, !this.j))), ua(this, e3);
    })), this.g.attachEmptyPacketListener("confidence_masks", ((t3) => {
      this.confidenceMasks = [], ua(this, t3);
    }))), this.outputCategoryMask && (us(t2, "category_mask"), rs(n2, "CATEGORY_MASK:category_mask"), fa(this, "category_mask"), this.g.Z("category_mask", ((t3, e3) => {
      this.categoryMask = fc(this, t3, false, !this.j), ua(this, e3);
    })), this.g.attachEmptyPacketListener("category_mask", ((t3) => {
      this.categoryMask = void 0, ua(this, t3);
    }))), us(t2, "quality_scores"), rs(n2, "QUALITY_SCORES:quality_scores"), this.g.attachFloatVectorListener("quality_scores", ((t3, e3) => {
      this.qualityScores = t3, ua(this, e3);
    })), this.g.attachEmptyPacketListener("quality_scores", ((t3) => {
      this.categoryMask = void 0, ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Kc.prototype.segment = Kc.prototype.segment, Kc.prototype.setOptions = Kc.prototype.o, Kc.createFromModelPath = function(t2, e2) {
  return cc(Kc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Kc.createFromModelBuffer = function(t2, e2) {
  return cc(Kc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Kc.createFromOptions = function(t2, e2) {
  return cc(Kc, t2, e2);
};
var Yc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "input_frame_gpu", "norm_rect", false), this.j = { detections: [] }, wn(t2 = this.h = new Oo(), 0, 1, e2 = new Xs());
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    return void 0 !== t2.displayNamesLocale ? Ze(this.h, 2, ue(t2.displayNamesLocale)) : "displayNamesLocale" in t2 && Ze(this.h, 2), void 0 !== t2.maxResults ? xn(this.h, 3, t2.maxResults) : "maxResults" in t2 && Ze(this.h, 3), void 0 !== t2.scoreThreshold ? Ln(this.h, 4, t2.scoreThreshold) : "scoreThreshold" in t2 && Ze(this.h, 4), void 0 !== t2.categoryAllowlist ? In(this.h, 5, t2.categoryAllowlist) : "categoryAllowlist" in t2 && Ze(this.h, 5), void 0 !== t2.categoryDenylist ? In(this.h, 6, t2.categoryDenylist) : "categoryDenylist" in t2 && Ze(this.h, 6), this.l(t2);
  }
  F(t2, e2) {
    return this.j = { detections: [] }, uc(this, t2, e2), this.j;
  }
  G(t2, e2, n2) {
    return this.j = { detections: [] }, lc(this, t2, n2, e2), this.j;
  }
  m() {
    var t2 = new ls();
    hs(t2, "input_frame_gpu"), hs(t2, "norm_rect"), us(t2, "detections");
    const e2 = new Qi();
    xr(e2, No, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.ObjectDetectorGraph"), ns(n2, "IMAGE:input_frame_gpu"), ns(n2, "NORM_RECT:norm_rect"), rs(n2, "DETECTIONS:detections"), n2.o(e2), cs(t2, n2), this.g.attachProtoVectorListener("detections", ((t3, e3) => {
      for (const e4 of t3) t3 = ws(e4), this.j.detections.push(Xo(t3));
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("detections", ((t3) => {
      ua(this, t3);
    })), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Yc.prototype.detectForVideo = Yc.prototype.G, Yc.prototype.detect = Yc.prototype.F, Yc.prototype.setOptions = Yc.prototype.o, Yc.createFromModelPath = async function(t2, e2) {
  return cc(Yc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Yc.createFromModelBuffer = function(t2, e2) {
  return cc(Yc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Yc.createFromOptions = function(t2, e2) {
  return cc(Yc, t2, e2);
};
var qc = class {
  constructor(t2, e2, n2) {
    this.landmarks = t2, this.worldLandmarks = e2, this.segmentationMasks = n2;
  }
  close() {
    this.segmentationMasks?.forEach(((t2) => {
      t2.close();
    }));
  }
};
function $c(t2) {
  t2.landmarks = [], t2.worldLandmarks = [], t2.segmentationMasks = void 0;
}
function Jc(t2) {
  try {
    const e2 = new qc(t2.landmarks, t2.worldLandmarks, t2.segmentationMasks);
    if (!t2.u) return e2;
    t2.u(e2);
  } finally {
    da(t2);
  }
}
qc.prototype.close = qc.prototype.close;
var Zc = class extends dc {
  constructor(t2, e2) {
    super(new ac(t2, e2), "image_in", "norm_rect", false), this.landmarks = [], this.worldLandmarks = [], this.outputSegmentationMasks = false, wn(t2 = this.h = new Uo(), 0, 1, e2 = new Xs()), this.A = new mo(), wn(this.h, 0, 3, this.A), this.j = new go(), wn(this.h, 0, 2, this.j), xn(this.j, 4, 1), Ln(this.j, 2, 0.5), Ln(this.A, 2, 0.5), Ln(this.h, 4, 0.5);
  }
  get baseOptions() {
    return yn(this.h, Xs, 1);
  }
  set baseOptions(t2) {
    wn(this.h, 0, 1, t2);
  }
  o(t2) {
    return "numPoses" in t2 && xn(this.j, 4, t2.numPoses ?? 1), "minPoseDetectionConfidence" in t2 && Ln(this.j, 2, t2.minPoseDetectionConfidence ?? 0.5), "minTrackingConfidence" in t2 && Ln(this.h, 4, t2.minTrackingConfidence ?? 0.5), "minPosePresenceConfidence" in t2 && Ln(this.A, 2, t2.minPosePresenceConfidence ?? 0.5), "outputSegmentationMasks" in t2 && (this.outputSegmentationMasks = t2.outputSegmentationMasks ?? false), this.l(t2);
  }
  F(t2, e2, n2) {
    const r2 = "function" != typeof e2 ? e2 : {};
    return this.u = "function" == typeof e2 ? e2 : n2, $c(this), uc(this, t2, r2), Jc(this);
  }
  G(t2, e2, n2, r2) {
    const i2 = "function" != typeof n2 ? n2 : {};
    return this.u = "function" == typeof n2 ? n2 : r2, $c(this), lc(this, t2, i2, e2), Jc(this);
  }
  m() {
    var t2 = new ls();
    hs(t2, "image_in"), hs(t2, "norm_rect"), us(t2, "normalized_landmarks"), us(t2, "world_landmarks"), us(t2, "segmentation_masks");
    const e2 = new Qi();
    xr(e2, Do, this.h);
    const n2 = new is();
    Rn(n2, 2, "mediapipe.tasks.vision.pose_landmarker.PoseLandmarkerGraph"), ns(n2, "IMAGE:image_in"), ns(n2, "NORM_RECT:norm_rect"), rs(n2, "NORM_LANDMARKS:normalized_landmarks"), rs(n2, "WORLD_LANDMARKS:world_landmarks"), n2.o(e2), cs(t2, n2), la(this, t2), this.g.attachProtoVectorListener("normalized_landmarks", ((t3, e3) => {
      this.landmarks = [];
      for (const e4 of t3) t3 = ks(e4), this.landmarks.push(Ho(t3));
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("normalized_landmarks", ((t3) => {
      this.landmarks = [], ua(this, t3);
    })), this.g.attachProtoVectorListener("world_landmarks", ((t3, e3) => {
      this.worldLandmarks = [];
      for (const e4 of t3) t3 = As(e4), this.worldLandmarks.push(Wo(t3));
      ua(this, e3);
    })), this.g.attachEmptyPacketListener("world_landmarks", ((t3) => {
      this.worldLandmarks = [], ua(this, t3);
    })), this.outputSegmentationMasks && (rs(n2, "SEGMENTATION_MASK:segmentation_masks"), fa(this, "segmentation_masks"), this.g.aa("segmentation_masks", ((t3, e3) => {
      this.segmentationMasks = t3.map(((t4) => fc(this, t4, true, !this.u))), ua(this, e3);
    })), this.g.attachEmptyPacketListener("segmentation_masks", ((t3) => {
      this.segmentationMasks = [], ua(this, t3);
    }))), t2 = t2.g(), this.setGraph(new Uint8Array(t2), true);
  }
};
Zc.prototype.detectForVideo = Zc.prototype.G, Zc.prototype.detect = Zc.prototype.F, Zc.prototype.setOptions = Zc.prototype.o, Zc.createFromModelPath = function(t2, e2) {
  return cc(Zc, t2, { baseOptions: { modelAssetPath: e2 } });
}, Zc.createFromModelBuffer = function(t2, e2) {
  return cc(Zc, t2, { baseOptions: { modelAssetBuffer: e2 } });
}, Zc.createFromOptions = function(t2, e2) {
  return cc(Zc, t2, e2);
}, Zc.POSE_CONNECTIONS = Cc;

// lib/matting/mediapipe-matte.ts
function createMediaPipeMatteProvider(options) {
  let segmenter = null;
  let initPromise = null;
  let lastTimestamp = -1;
  let personCategoryIndex = 1;
  async function ensureInitialised() {
    if (segmenter) return;
    if (!initPromise) {
      initPromise = (async () => {
        const fileset = await Zo.forVisionTasks(options.filesetUrl);
        const seg = await Wc.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: options.modelAssetPath,
            // CPU (XNNPACK) is required: the GPU delegate's WebGL texture
            // readback returns an all-zero category mask on some setups, which
            // would make background effects blur the whole frame. CPU matches
            // the face-detector adapter and is correct everywhere.
            delegate: options.delegate ?? "CPU"
          },
          runningMode: "VIDEO",
          outputCategoryMask: true,
          outputConfidenceMasks: false
        });
        segmenter = seg;
        const labels = seg.getLabels() ?? [];
        const idx = labels.findIndex((l2) => /person|human|foreground/i.test(l2));
        if (idx >= 0) personCategoryIndex = idx;
      })().catch((error) => {
        initPromise = null;
        throw error;
      });
    }
    return initPromise;
  }
  return {
    isReady() {
      return segmenter !== null;
    },
    async segment(source, _width, _height) {
      await ensureInitialised();
      if (!segmenter) {
        return { width: 1, height: 1, data: new Float32Array([1]) };
      }
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const timestamp = Math.max(now, lastTimestamp + 1);
      lastTimestamp = timestamp;
      const result = segmenter.segmentForVideo(source, timestamp);
      const mask = result.categoryMask;
      if (!mask) {
        return { width: 1, height: 1, data: new Float32Array([1]) };
      }
      const u8 = mask.getAsUint8Array();
      const data = new Float32Array(u8.length);
      for (let i2 = 0; i2 < u8.length; i2++) {
        data[i2] = (u8[i2] ?? 0) === personCategoryIndex ? 1 : 0;
      }
      return { width: mask.width, height: mask.height, data };
    },
    destroy() {
      segmenter?.close();
      segmenter = null;
      initPromise = null;
    }
  };
}

// ../../node_modules/.pnpm/onnxruntime-web@1.27.0/node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs
var Hr2 = Object.defineProperty;
var jf = Object.getOwnPropertyDescriptor;
var Hf = Object.getOwnPropertyNames;
var qf = Object.prototype.hasOwnProperty;
var qr2 = ((a2) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(a2, { get: (r2, s2) => (typeof __require < "u" ? __require : r2)[s2] }) : a2)(function(a2) {
  if (typeof __require < "u") return __require.apply(this, arguments);
  throw Error('Dynamic require of "' + a2 + '" is not supported');
});
var k2 = (a2, r2) => () => (a2 && (r2 = a2(a2 = 0)), r2);
var At2 = (a2, r2) => {
  for (var s2 in r2) Hr2(a2, s2, { get: r2[s2], enumerable: true });
};
var Yf = (a2, r2, s2, f2) => {
  if (r2 && typeof r2 == "object" || typeof r2 == "function") for (let i2 of Hf(r2)) !qf.call(a2, i2) && i2 !== s2 && Hr2(a2, i2, { get: () => r2[i2], enumerable: !(f2 = jf(r2, i2)) || f2.enumerable });
  return a2;
};
var zt2 = (a2) => Yf(Hr2({}, "__esModule", { value: true }), a2);
var Vt2;
var Ke2;
var Qe2;
var Jf;
var va2;
var Yr2 = k2(() => {
  "use strict";
  Vt2 = /* @__PURE__ */ new Map(), Ke2 = [], Qe2 = (a2, r2, s2) => {
    if (r2 && typeof r2.init == "function" && typeof r2.createInferenceSessionHandler == "function") {
      let f2 = Vt2.get(a2);
      if (f2 === void 0) Vt2.set(a2, { backend: r2, priority: s2 });
      else {
        if (f2.priority > s2) return;
        if (f2.priority === s2 && f2.backend !== r2) throw new Error(`cannot register backend "${a2}" using priority ${s2}`);
      }
      if (s2 >= 0) {
        let i2 = Ke2.indexOf(a2);
        i2 !== -1 && Ke2.splice(i2, 1);
        for (let d2 = 0; d2 < Ke2.length; d2++) if (Vt2.get(Ke2[d2]).priority <= s2) {
          Ke2.splice(d2, 0, a2);
          return;
        }
        Ke2.push(a2);
      }
      return;
    }
    throw new TypeError("not a valid backend");
  }, Jf = async (a2) => {
    let r2 = Vt2.get(a2);
    if (!r2) return "backend not found.";
    if (r2.initialized) return r2.backend;
    if (r2.aborted) return r2.error;
    {
      let s2 = !!r2.initPromise;
      try {
        return s2 || (r2.initPromise = r2.backend.init(a2)), await r2.initPromise, r2.initialized = true, r2.backend;
      } catch (f2) {
        return s2 || (r2.error = `${f2}`, r2.aborted = true), r2.error;
      } finally {
        delete r2.initPromise;
      }
    }
  }, va2 = async (a2) => {
    let r2 = a2.executionProviders || [], s2 = r2.map((y2) => typeof y2 == "string" ? y2 : y2.name), f2 = s2.length === 0 ? Ke2 : s2, i2, d2 = [], l2 = /* @__PURE__ */ new Set();
    for (let y2 of f2) {
      let w2 = await Jf(y2);
      typeof w2 == "string" ? d2.push({ name: y2, err: w2 }) : (i2 || (i2 = w2), i2 === w2 && l2.add(y2));
    }
    if (!i2) throw new Error(`no available backend found. ERR: ${d2.map((y2) => `[${y2.name}] ${y2.err}`).join(", ")}`);
    for (let { name: y2, err: w2 } of d2) s2.includes(y2) && console.warn(`removing requested execution provider "${y2}" from session options because it is not available: ${w2}`);
    let m2 = r2.filter((y2) => l2.has(typeof y2 == "string" ? y2 : y2.name));
    return [i2, new Proxy(a2, { get: (y2, w2) => w2 === "executionProviders" ? m2 : Reflect.get(y2, w2) })];
  };
});
var Ea2 = k2(() => {
  "use strict";
  Yr2();
});
var Sa2;
var Aa2 = k2(() => {
  "use strict";
  Sa2 = "1.27.0";
});
var Ia2;
var ie2;
var Jr2 = k2(() => {
  "use strict";
  Aa2();
  Ia2 = "warning", ie2 = { wasm: {}, webgl: {}, webgpu: {}, versions: { common: Sa2 }, set logLevel(a2) {
    if (a2 !== void 0) {
      if (typeof a2 != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(a2) === -1) throw new Error(`Unsupported logging level: ${a2}`);
      Ia2 = a2;
    }
  }, get logLevel() {
    return Ia2;
  } };
  Object.defineProperty(ie2, "logLevel", { enumerable: true });
});
var Q2;
var xa2 = k2(() => {
  "use strict";
  Jr2();
  Q2 = ie2;
});
var La2;
var Ba2;
var Oa2 = k2(() => {
  "use strict";
  La2 = (a2, r2) => {
    let s2 = typeof document < "u" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
    s2.width = a2.dims[3], s2.height = a2.dims[2];
    let f2 = s2.getContext("2d");
    if (f2 != null) {
      let i2, d2;
      r2?.tensorLayout !== void 0 && r2.tensorLayout === "NHWC" ? (i2 = a2.dims[2], d2 = a2.dims[3]) : (i2 = a2.dims[3], d2 = a2.dims[2]);
      let l2 = r2?.format !== void 0 ? r2.format : "RGB", m2 = r2?.norm, y2, w2;
      m2 === void 0 || m2.mean === void 0 ? y2 = [255, 255, 255, 255] : typeof m2.mean == "number" ? y2 = [m2.mean, m2.mean, m2.mean, m2.mean] : (y2 = [m2.mean[0], m2.mean[1], m2.mean[2], 0], m2.mean[3] !== void 0 && (y2[3] = m2.mean[3])), m2 === void 0 || m2.bias === void 0 ? w2 = [0, 0, 0, 0] : typeof m2.bias == "number" ? w2 = [m2.bias, m2.bias, m2.bias, m2.bias] : (w2 = [m2.bias[0], m2.bias[1], m2.bias[2], 0], m2.bias[3] !== void 0 && (w2[3] = m2.bias[3]));
      let T2 = d2 * i2, g2 = 0, v2 = T2, S2 = T2 * 2, U2 = -1;
      l2 === "RGBA" ? (g2 = 0, v2 = T2, S2 = T2 * 2, U2 = T2 * 3) : l2 === "RGB" ? (g2 = 0, v2 = T2, S2 = T2 * 2) : l2 === "RBG" && (g2 = 0, S2 = T2, v2 = T2 * 2);
      for (let R2 = 0; R2 < d2; R2++) for (let H2 = 0; H2 < i2; H2++) {
        let C2 = (a2.data[g2++] - w2[0]) * y2[0], M2 = (a2.data[v2++] - w2[1]) * y2[1], q2 = (a2.data[S2++] - w2[2]) * y2[2], B2 = U2 === -1 ? 255 : (a2.data[U2++] - w2[3]) * y2[3];
        f2.fillStyle = "rgba(" + C2 + "," + M2 + "," + q2 + "," + B2 + ")", f2.fillRect(H2, R2, 1, 1);
      }
      if ("toDataURL" in s2) return s2.toDataURL();
      throw new Error("toDataURL is not supported");
    } else throw new Error("Can not access image data");
  }, Ba2 = (a2, r2) => {
    let s2 = typeof document < "u" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d"), f2;
    if (s2 != null) {
      let i2, d2, l2;
      r2?.tensorLayout !== void 0 && r2.tensorLayout === "NHWC" ? (i2 = a2.dims[2], d2 = a2.dims[1], l2 = a2.dims[3]) : (i2 = a2.dims[3], d2 = a2.dims[2], l2 = a2.dims[1]);
      let m2 = r2 !== void 0 && r2.format !== void 0 ? r2.format : "RGB", y2 = r2?.norm, w2, T2;
      y2 === void 0 || y2.mean === void 0 ? w2 = [255, 255, 255, 255] : typeof y2.mean == "number" ? w2 = [y2.mean, y2.mean, y2.mean, y2.mean] : (w2 = [y2.mean[0], y2.mean[1], y2.mean[2], 255], y2.mean[3] !== void 0 && (w2[3] = y2.mean[3])), y2 === void 0 || y2.bias === void 0 ? T2 = [0, 0, 0, 0] : typeof y2.bias == "number" ? T2 = [y2.bias, y2.bias, y2.bias, y2.bias] : (T2 = [y2.bias[0], y2.bias[1], y2.bias[2], 0], y2.bias[3] !== void 0 && (T2[3] = y2.bias[3]));
      let g2 = d2 * i2;
      if (r2 !== void 0 && (r2.format !== void 0 && l2 === 4 && r2.format !== "RGBA" || l2 === 3 && r2.format !== "RGB" && r2.format !== "BGR")) throw new Error("Tensor format doesn't match input tensor dims");
      let v2 = 4, S2 = 0, U2 = 1, R2 = 2, H2 = 3, C2 = 0, M2 = g2, q2 = g2 * 2, B2 = -1;
      m2 === "RGBA" ? (C2 = 0, M2 = g2, q2 = g2 * 2, B2 = g2 * 3) : m2 === "RGB" ? (C2 = 0, M2 = g2, q2 = g2 * 2) : m2 === "RBG" && (C2 = 0, q2 = g2, M2 = g2 * 2), f2 = s2.createImageData(i2, d2);
      for (let W2 = 0; W2 < d2 * i2; S2 += v2, U2 += v2, R2 += v2, H2 += v2, W2++) f2.data[S2] = (a2.data[C2++] - T2[0]) * w2[0], f2.data[U2] = (a2.data[M2++] - T2[1]) * w2[1], f2.data[R2] = (a2.data[q2++] - T2[2]) * w2[2], f2.data[H2] = B2 === -1 ? 255 : (a2.data[B2++] - T2[3]) * w2[3];
    } else throw new Error("Can not access image data");
    return f2;
  };
});
var Xr2;
var Ma2;
var Ua2;
var Ca2;
var Da2;
var Pa2;
var _a2 = k2(() => {
  "use strict";
  jt2();
  Xr2 = (a2, r2) => {
    if (a2 === void 0) throw new Error("Image buffer must be defined");
    if (r2.height === void 0 || r2.width === void 0) throw new Error("Image height and width must be defined");
    if (r2.tensorLayout === "NHWC") throw new Error("NHWC Tensor layout is not supported yet");
    let { height: s2, width: f2 } = r2, i2 = r2.norm ?? { mean: 255, bias: 0 }, d2, l2;
    typeof i2.mean == "number" ? d2 = [i2.mean, i2.mean, i2.mean, i2.mean] : d2 = [i2.mean[0], i2.mean[1], i2.mean[2], i2.mean[3] ?? 255], typeof i2.bias == "number" ? l2 = [i2.bias, i2.bias, i2.bias, i2.bias] : l2 = [i2.bias[0], i2.bias[1], i2.bias[2], i2.bias[3] ?? 0];
    let m2 = r2.format !== void 0 ? r2.format : "RGBA", y2 = r2.tensorFormat !== void 0 && r2.tensorFormat !== void 0 ? r2.tensorFormat : "RGB", w2 = s2 * f2, T2 = y2 === "RGBA" ? new Float32Array(w2 * 4) : new Float32Array(w2 * 3), g2 = 4, v2 = 0, S2 = 1, U2 = 2, R2 = 3, H2 = 0, C2 = w2, M2 = w2 * 2, q2 = -1;
    m2 === "RGB" && (g2 = 3, v2 = 0, S2 = 1, U2 = 2, R2 = -1), y2 === "RGBA" ? q2 = w2 * 3 : y2 === "RBG" ? (H2 = 0, M2 = w2, C2 = w2 * 2) : y2 === "BGR" && (M2 = 0, C2 = w2, H2 = w2 * 2);
    for (let W2 = 0; W2 < w2; W2++, v2 += g2, U2 += g2, S2 += g2, R2 += g2) T2[H2++] = (a2[v2] + l2[0]) / d2[0], T2[C2++] = (a2[S2] + l2[1]) / d2[1], T2[M2++] = (a2[U2] + l2[2]) / d2[2], q2 !== -1 && R2 !== -1 && (T2[q2++] = (a2[R2] + l2[3]) / d2[3]);
    return y2 === "RGBA" ? new le2("float32", T2, [1, 4, s2, f2]) : new le2("float32", T2, [1, 3, s2, f2]);
  }, Ma2 = async (a2, r2) => {
    let s2 = typeof HTMLImageElement < "u" && a2 instanceof HTMLImageElement, f2 = typeof ImageData < "u" && a2 instanceof ImageData, i2 = typeof ImageBitmap < "u" && a2 instanceof ImageBitmap, d2 = typeof a2 == "string", l2, m2 = r2 ?? {}, y2 = () => {
      if (typeof document < "u") return document.createElement("canvas");
      if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(1, 1);
      throw new Error("Canvas is not supported");
    }, w2 = (T2) => typeof HTMLCanvasElement < "u" && T2 instanceof HTMLCanvasElement || T2 instanceof OffscreenCanvas ? T2.getContext("2d") : null;
    if (s2) {
      let T2 = y2();
      T2.width = a2.width, T2.height = a2.height;
      let g2 = w2(T2);
      if (g2 != null) {
        let v2 = a2.height, S2 = a2.width;
        if (r2 !== void 0 && r2.resizedHeight !== void 0 && r2.resizedWidth !== void 0 && (v2 = r2.resizedHeight, S2 = r2.resizedWidth), r2 !== void 0) {
          if (m2 = r2, r2.tensorFormat !== void 0) throw new Error("Image input config format must be RGBA for HTMLImageElement");
          m2.tensorFormat = "RGBA", m2.height = v2, m2.width = S2;
        } else m2.tensorFormat = "RGBA", m2.height = v2, m2.width = S2;
        g2.drawImage(a2, 0, 0), l2 = g2.getImageData(0, 0, S2, v2).data;
      } else throw new Error("Can not access image data");
    } else if (f2) {
      let T2, g2;
      if (r2 !== void 0 && r2.resizedWidth !== void 0 && r2.resizedHeight !== void 0 ? (T2 = r2.resizedHeight, g2 = r2.resizedWidth) : (T2 = a2.height, g2 = a2.width), r2 !== void 0 && (m2 = r2), m2.format = "RGBA", m2.height = T2, m2.width = g2, r2 !== void 0) {
        let v2 = y2();
        v2.width = g2, v2.height = T2;
        let S2 = w2(v2);
        if (S2 != null) S2.putImageData(a2, 0, 0), l2 = S2.getImageData(0, 0, g2, T2).data;
        else throw new Error("Can not access image data");
      } else l2 = a2.data;
    } else if (i2) {
      if (r2 === void 0) throw new Error("Please provide image config with format for Imagebitmap");
      let T2 = y2();
      T2.width = a2.width, T2.height = a2.height;
      let g2 = w2(T2);
      if (g2 != null) {
        let v2 = a2.height, S2 = a2.width;
        return g2.drawImage(a2, 0, 0, S2, v2), l2 = g2.getImageData(0, 0, S2, v2).data, m2.height = v2, m2.width = S2, Xr2(l2, m2);
      } else throw new Error("Can not access image data");
    } else {
      if (d2) return new Promise((T2, g2) => {
        let v2 = y2(), S2 = w2(v2);
        if (!a2 || !S2) return g2();
        let U2 = new Image();
        U2.crossOrigin = "Anonymous", U2.src = a2, U2.onload = () => {
          v2.width = U2.width, v2.height = U2.height, S2.drawImage(U2, 0, 0, v2.width, v2.height);
          let R2 = S2.getImageData(0, 0, v2.width, v2.height);
          m2.height = v2.height, m2.width = v2.width, T2(Xr2(R2.data, m2));
        };
      });
      throw new Error("Input data provided is not supported - aborted tensor creation");
    }
    if (l2 !== void 0) return Xr2(l2, m2);
    throw new Error("Input data provided is not supported - aborted tensor creation");
  }, Ua2 = (a2, r2) => {
    let { width: s2, height: f2, download: i2, dispose: d2 } = r2, l2 = [1, f2, s2, 4];
    return new le2({ location: "texture", type: "float32", texture: a2, dims: l2, download: i2, dispose: d2 });
  }, Ca2 = (a2, r2) => {
    let { dataType: s2, dims: f2, download: i2, dispose: d2 } = r2;
    return new le2({ location: "gpu-buffer", type: s2 ?? "float32", gpuBuffer: a2, dims: f2, download: i2, dispose: d2 });
  }, Da2 = (a2, r2) => {
    let { dataType: s2, dims: f2, download: i2, dispose: d2 } = r2;
    return new le2({ location: "ml-tensor", type: s2 ?? "float32", mlTensor: a2, dims: f2, download: i2, dispose: d2 });
  }, Pa2 = (a2, r2, s2) => new le2({ location: "cpu-pinned", type: a2, data: r2, dims: s2 ?? [r2.length] });
});
var et2;
var It2;
var Ra2;
var Na2;
var ka2 = k2(() => {
  "use strict";
  et2 = /* @__PURE__ */ new Map([["float32", Float32Array], ["uint8", Uint8Array], ["int8", Int8Array], ["uint16", Uint16Array], ["int16", Int16Array], ["int32", Int32Array], ["bool", Uint8Array], ["float64", Float64Array], ["uint32", Uint32Array], ["int4", Uint8Array], ["uint4", Uint8Array]]), It2 = /* @__PURE__ */ new Map([[Float32Array, "float32"], [Uint8Array, "uint8"], [Int8Array, "int8"], [Uint16Array, "uint16"], [Int16Array, "int16"], [Int32Array, "int32"], [Float64Array, "float64"], [Uint32Array, "uint32"]]), Ra2 = false, Na2 = () => {
    if (!Ra2) {
      Ra2 = true;
      let a2 = typeof BigInt64Array < "u" && BigInt64Array.from, r2 = typeof BigUint64Array < "u" && BigUint64Array.from, s2 = globalThis.Float16Array, f2 = typeof s2 < "u" && s2.from;
      a2 && (et2.set("int64", BigInt64Array), It2.set(BigInt64Array, "int64")), r2 && (et2.set("uint64", BigUint64Array), It2.set(BigUint64Array, "uint64")), f2 ? (et2.set("float16", s2), It2.set(s2, "float16")) : et2.set("float16", Uint16Array);
    }
  };
});
var Wa2;
var Fa2;
var Ga2 = k2(() => {
  "use strict";
  jt2();
  Wa2 = (a2) => {
    let r2 = 1;
    for (let s2 = 0; s2 < a2.length; s2++) {
      let f2 = a2[s2];
      if (typeof f2 != "number" || !Number.isSafeInteger(f2)) throw new TypeError(`dims[${s2}] must be an integer, got: ${f2}`);
      if (f2 < 0) throw new RangeError(`dims[${s2}] must be a non-negative integer, got: ${f2}`);
      r2 *= f2;
    }
    return r2;
  }, Fa2 = (a2, r2) => {
    switch (a2.location) {
      case "cpu":
        return new le2(a2.type, a2.data, r2);
      case "cpu-pinned":
        return new le2({ location: "cpu-pinned", data: a2.data, type: a2.type, dims: r2 });
      case "texture":
        return new le2({ location: "texture", texture: a2.texture, type: a2.type, dims: r2 });
      case "gpu-buffer":
        return new le2({ location: "gpu-buffer", gpuBuffer: a2.gpuBuffer, type: a2.type, dims: r2 });
      case "ml-tensor":
        return new le2({ location: "ml-tensor", mlTensor: a2.mlTensor, type: a2.type, dims: r2 });
      default:
        throw new Error(`tensorReshape: tensor location ${a2.location} is not supported`);
    }
  };
});
var le2;
var jt2 = k2(() => {
  "use strict";
  Oa2();
  _a2();
  ka2();
  Ga2();
  le2 = class {
    constructor(r2, s2, f2) {
      Na2();
      let i2, d2;
      if (typeof r2 == "object" && "location" in r2) switch (this.dataLocation = r2.location, i2 = r2.type, d2 = r2.dims, r2.location) {
        case "cpu-pinned": {
          let m2 = et2.get(i2);
          if (!m2) throw new TypeError(`unsupported type "${i2}" to create tensor from pinned buffer`);
          if (!(r2.data instanceof m2)) throw new TypeError(`buffer should be of type ${m2.name}`);
          this.cpuData = r2.data;
          break;
        }
        case "texture": {
          if (i2 !== "float32") throw new TypeError(`unsupported type "${i2}" to create tensor from texture`);
          this.gpuTextureData = r2.texture, this.downloader = r2.download, this.disposer = r2.dispose;
          break;
        }
        case "gpu-buffer": {
          if (i2 !== "float32" && i2 !== "float16" && i2 !== "int32" && i2 !== "int64" && i2 !== "uint32" && i2 !== "uint8" && i2 !== "bool" && i2 !== "uint4" && i2 !== "int4") throw new TypeError(`unsupported type "${i2}" to create tensor from gpu buffer`);
          this.gpuBufferData = r2.gpuBuffer, this.downloader = r2.download, this.disposer = r2.dispose;
          break;
        }
        case "ml-tensor": {
          if (i2 !== "float32" && i2 !== "float16" && i2 !== "int32" && i2 !== "int64" && i2 !== "uint32" && i2 !== "uint64" && i2 !== "int8" && i2 !== "uint8" && i2 !== "bool" && i2 !== "uint4" && i2 !== "int4") throw new TypeError(`unsupported type "${i2}" to create tensor from MLTensor`);
          this.mlTensorData = r2.mlTensor, this.downloader = r2.download, this.disposer = r2.dispose;
          break;
        }
        default:
          throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
      }
      else {
        let m2, y2;
        if (typeof r2 == "string") if (i2 = r2, y2 = f2, r2 === "string") {
          if (!Array.isArray(s2)) throw new TypeError("A string tensor's data must be a string array.");
          m2 = s2;
        } else {
          let w2 = et2.get(r2);
          if (w2 === void 0) throw new TypeError(`Unsupported tensor type: ${r2}.`);
          if (Array.isArray(s2)) {
            if (r2 === "float16" && w2 === Uint16Array || r2 === "uint4" || r2 === "int4") throw new TypeError(`Creating a ${r2} tensor from number array is not supported. Please use ${w2.name} as data.`);
            r2 === "uint64" || r2 === "int64" ? m2 = w2.from(s2, BigInt) : m2 = w2.from(s2);
          } else if (s2 instanceof w2) m2 = s2;
          else if (s2 instanceof Uint8ClampedArray) if (r2 === "uint8") m2 = Uint8Array.from(s2);
          else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");
          else if (r2 === "float16" && s2 instanceof Uint16Array && w2 !== Uint16Array) m2 = new globalThis.Float16Array(s2.buffer, s2.byteOffset, s2.length);
          else throw new TypeError(`A ${i2} tensor's data must be type of ${w2}`);
        }
        else if (y2 = s2, Array.isArray(r2)) {
          if (r2.length === 0) throw new TypeError("Tensor type cannot be inferred from an empty array.");
          let w2 = typeof r2[0];
          if (w2 === "string") i2 = "string", m2 = r2;
          else if (w2 === "boolean") i2 = "bool", m2 = Uint8Array.from(r2);
          else throw new TypeError(`Invalid element type of data array: ${w2}.`);
        } else if (r2 instanceof Uint8ClampedArray) i2 = "uint8", m2 = Uint8Array.from(r2);
        else {
          let w2 = It2.get(r2.constructor);
          if (w2 === void 0) throw new TypeError(`Unsupported type for tensor data: ${r2.constructor}.`);
          i2 = w2, m2 = r2;
        }
        if (y2 === void 0) y2 = [m2.length];
        else if (!Array.isArray(y2)) throw new TypeError("A tensor's dims must be a number array");
        d2 = y2, this.cpuData = m2, this.dataLocation = "cpu";
      }
      let l2 = Wa2(d2);
      if (this.cpuData && l2 !== this.cpuData.length && !((i2 === "uint4" || i2 === "int4") && Math.ceil(l2 / 2) === this.cpuData.length)) throw new Error(`Tensor's size(${l2}) does not match data length(${this.cpuData.length}).`);
      this.type = i2, this.dims = d2, this.size = l2;
    }
    static async fromImage(r2, s2) {
      return Ma2(r2, s2);
    }
    static fromTexture(r2, s2) {
      return Ua2(r2, s2);
    }
    static fromGpuBuffer(r2, s2) {
      return Ca2(r2, s2);
    }
    static fromMLTensor(r2, s2) {
      return Da2(r2, s2);
    }
    static fromPinnedBuffer(r2, s2, f2) {
      return Pa2(r2, s2, f2);
    }
    toDataURL(r2) {
      return La2(this, r2);
    }
    toImageData(r2) {
      return Ba2(this, r2);
    }
    get data() {
      if (this.ensureValid(), !this.cpuData) throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
      return this.cpuData;
    }
    get location() {
      return this.dataLocation;
    }
    get texture() {
      if (this.ensureValid(), !this.gpuTextureData) throw new Error("The data is not stored as a WebGL texture.");
      return this.gpuTextureData;
    }
    get gpuBuffer() {
      if (this.ensureValid(), !this.gpuBufferData) throw new Error("The data is not stored as a WebGPU buffer.");
      return this.gpuBufferData;
    }
    get mlTensor() {
      if (this.ensureValid(), !this.mlTensorData) throw new Error("The data is not stored as a WebNN MLTensor.");
      return this.mlTensorData;
    }
    async getData(r2) {
      switch (this.ensureValid(), this.dataLocation) {
        case "cpu":
        case "cpu-pinned":
          return this.data;
        case "texture":
        case "gpu-buffer":
        case "ml-tensor": {
          if (!this.downloader) throw new Error("The current tensor is not created with a specified data downloader.");
          if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
          try {
            this.isDownloading = true;
            let s2 = await this.downloader();
            return this.downloader = void 0, this.dataLocation = "cpu", this.cpuData = s2, r2 && this.disposer && (this.disposer(), this.disposer = void 0), s2;
          } finally {
            this.isDownloading = false;
          }
        }
        default:
          throw new Error(`cannot get data from location: ${this.dataLocation}`);
      }
    }
    dispose() {
      if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
      this.disposer && (this.disposer(), this.disposer = void 0), this.cpuData = void 0, this.gpuTextureData = void 0, this.gpuBufferData = void 0, this.mlTensorData = void 0, this.downloader = void 0, this.isDownloading = void 0, this.dataLocation = "none";
    }
    ensureValid() {
      if (this.dataLocation === "none") throw new Error("The tensor is disposed.");
    }
    reshape(r2) {
      if (this.ensureValid(), this.downloader || this.disposer) throw new Error("Cannot reshape a tensor that owns GPU resource.");
      return Fa2(this, r2);
    }
  };
});
var Le2;
var Zr2 = k2(() => {
  "use strict";
  jt2();
  Le2 = le2;
});
var $a2;
var za2;
var tt2;
var rt2;
var $e2;
var ze2;
var Kr2 = k2(() => {
  "use strict";
  Jr2();
  $a2 = (a2, r2) => {
    (typeof ie2.trace > "u" ? !ie2.wasm.trace : !ie2.trace) || console.timeStamp(`${a2}::ORT::${r2}`);
  }, za2 = (a2, r2) => {
    let s2 = new Error().stack?.split(/\r\n|\r|\n/g) || [], f2 = false;
    for (let i2 = 0; i2 < s2.length; i2++) {
      if (f2 && !s2[i2].includes("TRACE_FUNC")) {
        let d2 = `FUNC_${a2}::${s2[i2].trim().split(" ")[1]}`;
        r2 && (d2 += `::${r2}`), $a2("CPU", d2);
        return;
      }
      s2[i2].includes("TRACE_FUNC") && (f2 = true);
    }
  }, tt2 = (a2) => {
    (typeof ie2.trace > "u" ? !ie2.wasm.trace : !ie2.trace) || za2("BEGIN", a2);
  }, rt2 = (a2) => {
    (typeof ie2.trace > "u" ? !ie2.wasm.trace : !ie2.trace) || za2("END", a2);
  }, $e2 = (a2) => {
    (typeof ie2.trace > "u" ? !ie2.wasm.trace : !ie2.trace) || console.time(`ORT::${a2}`);
  }, ze2 = (a2) => {
    (typeof ie2.trace > "u" ? !ie2.wasm.trace : !ie2.trace) || console.timeEnd(`ORT::${a2}`);
  };
});
var Ht2;
var Va2 = k2(() => {
  "use strict";
  Yr2();
  Zr2();
  Kr2();
  Ht2 = class a2 {
    constructor(r2) {
      this.handler = r2;
    }
    async run(r2, s2, f2) {
      tt2(), $e2("InferenceSession.run");
      let i2 = {}, d2 = {};
      if (typeof r2 != "object" || r2 === null || r2 instanceof Le2 || Array.isArray(r2)) throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
      let l2 = true;
      if (typeof s2 == "object") {
        if (s2 === null) throw new TypeError("Unexpected argument[1]: cannot be null.");
        if (s2 instanceof Le2) throw new TypeError("'fetches' cannot be a Tensor");
        if (Array.isArray(s2)) {
          if (s2.length === 0) throw new TypeError("'fetches' cannot be an empty array.");
          l2 = false;
          for (let w2 of s2) {
            if (typeof w2 != "string") throw new TypeError("'fetches' must be a string array or an object.");
            if (this.outputNames.indexOf(w2) === -1) throw new RangeError(`'fetches' contains invalid output name: ${w2}.`);
            i2[w2] = null;
          }
          if (typeof f2 == "object" && f2 !== null) d2 = f2;
          else if (typeof f2 < "u") throw new TypeError("'options' must be an object.");
        } else {
          let w2 = false, T2 = Object.getOwnPropertyNames(s2);
          for (let g2 of this.outputNames) if (T2.indexOf(g2) !== -1) {
            let v2 = s2[g2];
            (v2 === null || v2 instanceof Le2) && (w2 = true, l2 = false, i2[g2] = v2);
          }
          if (w2) {
            if (typeof f2 == "object" && f2 !== null) d2 = f2;
            else if (typeof f2 < "u") throw new TypeError("'options' must be an object.");
          } else d2 = s2;
        }
      } else if (typeof s2 < "u") throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
      for (let w2 of this.inputNames) if (typeof r2[w2] > "u") throw new Error(`input '${w2}' is missing in 'feeds'.`);
      if (l2) for (let w2 of this.outputNames) i2[w2] = null;
      let m2 = await this.handler.run(r2, i2, d2), y2 = {};
      for (let w2 in m2) if (Object.hasOwnProperty.call(m2, w2)) {
        let T2 = m2[w2];
        T2 instanceof Le2 ? y2[w2] = T2 : y2[w2] = new Le2(T2.type, T2.data, T2.dims);
      }
      return ze2("InferenceSession.run"), rt2(), y2;
    }
    async release() {
      return this.handler.dispose();
    }
    static async create(r2, s2, f2, i2) {
      tt2(), $e2("InferenceSession.create");
      let d2, l2 = {};
      if (typeof r2 == "string") {
        if (d2 = r2, typeof s2 == "object" && s2 !== null) l2 = s2;
        else if (typeof s2 < "u") throw new TypeError("'options' must be an object.");
      } else if (r2 instanceof Uint8Array) {
        if (d2 = r2, typeof s2 == "object" && s2 !== null) l2 = s2;
        else if (typeof s2 < "u") throw new TypeError("'options' must be an object.");
      } else if (r2 instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && r2 instanceof SharedArrayBuffer) {
        let T2 = r2, g2 = 0, v2 = r2.byteLength;
        if (typeof s2 == "object" && s2 !== null) l2 = s2;
        else if (typeof s2 == "number") {
          if (g2 = s2, !Number.isSafeInteger(g2)) throw new RangeError("'byteOffset' must be an integer.");
          if (g2 < 0 || g2 >= T2.byteLength) throw new RangeError(`'byteOffset' is out of range [0, ${T2.byteLength}).`);
          if (v2 = r2.byteLength - g2, typeof f2 == "number") {
            if (v2 = f2, !Number.isSafeInteger(v2)) throw new RangeError("'byteLength' must be an integer.");
            if (v2 <= 0 || g2 + v2 > T2.byteLength) throw new RangeError(`'byteLength' is out of range (0, ${T2.byteLength - g2}].`);
            if (typeof i2 == "object" && i2 !== null) l2 = i2;
            else if (typeof i2 < "u") throw new TypeError("'options' must be an object.");
          } else if (typeof f2 < "u") throw new TypeError("'byteLength' must be a number.");
        } else if (typeof s2 < "u") throw new TypeError("'options' must be an object.");
        d2 = new Uint8Array(T2, g2, v2);
      } else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
      let [m2, y2] = await va2(l2), w2 = await m2.createInferenceSessionHandler(d2, y2);
      return ze2("InferenceSession.create"), rt2(), new a2(w2);
    }
    startProfiling() {
      this.handler.startProfiling();
    }
    endProfiling() {
      this.handler.endProfiling();
    }
    get inputNames() {
      return this.handler.inputNames;
    }
    get outputNames() {
      return this.handler.outputNames;
    }
    get inputMetadata() {
      return this.handler.inputMetadata;
    }
    get outputMetadata() {
      return this.handler.outputMetadata;
    }
  };
});
var Xf;
var ja2 = k2(() => {
  "use strict";
  Va2();
  Xf = Ht2;
});
var Ha2 = k2(() => {
  "use strict";
});
var qa2 = k2(() => {
  "use strict";
});
var Ya2 = k2(() => {
  "use strict";
});
var Ja2 = k2(() => {
  "use strict";
});
var Qr2 = {};
At2(Qr2, { InferenceSession: () => Xf, TRACE: () => $a2, TRACE_EVENT_BEGIN: () => $e2, TRACE_EVENT_END: () => ze2, TRACE_FUNC_BEGIN: () => tt2, TRACE_FUNC_END: () => rt2, Tensor: () => Le2, env: () => Q2, registerBackend: () => Qe2 });
var Ve2 = k2(() => {
  "use strict";
  Ea2();
  xa2();
  ja2();
  Zr2();
  Ha2();
  qa2();
  Kr2();
  Ya2();
  Ja2();
});
var qt2 = k2(() => {
  "use strict";
});
var Qa2 = {};
At2(Qa2, { default: () => Zf });
var Za2;
var Ka2;
var Zf;
var es2 = k2(() => {
  "use strict";
  en2();
  je2();
  Yt2();
  Za2 = "ort-wasm-proxy-worker", Ka2 = globalThis.self?.name === Za2;
  Ka2 && (self.onmessage = (a2) => {
    let { type: r2, in: s2 } = a2.data;
    try {
      switch (r2) {
        case "init-wasm":
          Jt2(s2.wasm).then(() => {
            Xt2(s2).then(() => {
              postMessage({ type: r2 });
            }, (f2) => {
              postMessage({ type: r2, err: f2 });
            });
          }, (f2) => {
            postMessage({ type: r2, err: f2 });
          });
          break;
        case "init-ep": {
          let { epName: f2, env: i2 } = s2;
          Zt2(i2, f2).then(() => {
            postMessage({ type: r2 });
          }, (d2) => {
            postMessage({ type: r2, err: d2 });
          });
          break;
        }
        case "copy-from": {
          let { buffer: f2 } = s2, i2 = xt2(f2);
          postMessage({ type: r2, out: i2 });
          break;
        }
        case "create": {
          let { model: f2, options: i2 } = s2;
          Kt2(f2, i2).then((d2) => {
            postMessage({ type: r2, out: d2 });
          }, (d2) => {
            postMessage({ type: r2, err: d2 });
          });
          break;
        }
        case "release":
          Qt2(s2), postMessage({ type: r2 });
          break;
        case "run": {
          let { sessionId: f2, inputIndices: i2, inputs: d2, outputIndices: l2, options: m2 } = s2;
          er2(f2, i2, d2, l2, new Array(l2.length).fill(null), m2).then((y2) => {
            y2.some((w2) => w2[3] !== "cpu") ? postMessage({ type: r2, err: "Proxy does not support non-cpu tensor location." }) : postMessage({ type: r2, out: y2 }, rr2([...d2, ...y2]));
          }, (y2) => {
            postMessage({ type: r2, err: y2 });
          });
          break;
        }
        case "end-profiling":
          tr2(s2), postMessage({ type: r2 });
          break;
        default:
      }
    } catch (f2) {
      postMessage({ type: r2, err: f2 });
    }
  });
  Zf = Ka2 ? null : (a2) => new Worker(a2 ?? ge2, { type: "module", name: Za2 });
});
var rs2 = {};
At2(rs2, { default: () => Kf });
async function ts2(a2 = {}) {
  var r2 = a2, s2 = !!globalThis.window, f2 = !!globalThis.WorkerGlobalScope, i2 = f2 && self.name?.startsWith("em-pthread");
  r2.mountExternalData = (e2, t2) => {
    e2.startsWith("./") && (e2 = e2.substring(2)), (r2.Vc || (r2.Vc = /* @__PURE__ */ new Map())).set(e2, t2);
  }, r2.unmountExternalData = () => {
    delete r2.Vc;
  }, globalThis.SharedArrayBuffer ?? new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true }).buffer.constructor;
  let d2 = () => {
    let e2 = (t2) => (...n2) => {
      let o2 = Me2;
      return n2 = t2(...n2), Me2 != o2 ? new Promise((u2, c2) => {
        Br2 = { resolve: u2, reject: c2 };
      }) : n2;
    };
    (() => {
      for (let t2 of ["_OrtAppendExecutionProvider", "_OrtCreateSession", "_OrtRun", "_OrtRunWithBinding", "_OrtBindInput"]) r2[t2] = e2(r2[t2]);
    })(), typeof jsepRunAsync < "u" && (r2._OrtRun = jsepRunAsync(r2._OrtRun), r2._OrtRunWithBinding = jsepRunAsync(r2._OrtRunWithBinding)), d2 = void 0;
  };
  r2.asyncInit = () => {
    d2?.();
  };
  var l2, m2, y2 = (e2, t2) => {
    throw t2;
  }, w2 = import.meta.url, T2 = "";
  if (s2 || f2) {
    try {
      T2 = new URL(".", w2).href;
    } catch {
    }
    f2 && (m2 = (e2) => {
      var t2 = new XMLHttpRequest();
      return t2.open("GET", e2, false), t2.responseType = "arraybuffer", t2.send(null), new Uint8Array(t2.response);
    }), l2 = async (e2) => {
      if (oe2(e2)) return new Promise((n2, o2) => {
        var u2 = new XMLHttpRequest();
        u2.open("GET", e2, true), u2.responseType = "arraybuffer", u2.onload = () => {
          u2.status == 200 || u2.status == 0 && u2.response ? n2(u2.response) : o2(u2.status);
        }, u2.onerror = o2, u2.send(null);
      });
      var t2 = await fetch(e2, { credentials: "same-origin" });
      if (t2.ok) return t2.arrayBuffer();
      throw Error(t2.status + " : " + t2.url);
    };
  }
  var g2, v2, S2, U2, R2, H2, C2 = console.log.bind(console), M2 = console.error.bind(console), q2 = C2, B2 = M2, W2 = false, oe2 = (e2) => e2.startsWith("file://");
  function p2() {
    Fe2.buffer != X2.buffer && se2();
  }
  if (i2) {
    let e2 = function(t2) {
      try {
        var n2 = t2.data, o2 = n2.Pc;
        if (o2 === "load") {
          let u2 = [];
          self.onmessage = (c2) => u2.push(c2), H2 = () => {
            postMessage({ Pc: "loaded" });
            for (let c2 of u2) e2(c2);
            self.onmessage = e2;
          };
          for (let c2 of n2.ee) r2[c2] && !r2[c2].proxy || (r2[c2] = (...h2) => {
            postMessage({ Pc: "callHandler", de: c2, args: h2 });
          }, c2 == "print" && (q2 = r2[c2]), c2 == "printErr" && (B2 = r2[c2]));
          Fe2 = n2.ke, se2(), v2 = n2.le, bt2(), $t2();
        } else if (o2 === "run") {
          (function(u2) {
            var c2 = (p2(), A2)[u2 + 52 >>> 2 >>> 0];
            u2 = (p2(), A2)[u2 + 56 >>> 2 >>> 0], Uo2(c2, c2 - u2), D2(c2);
          })(n2.Oc), Fr2(n2.Oc, 0, 0, 1, 0, 0), bn2(), Ir2(n2.Oc), ne2 || (po2(), ne2 = true);
          try {
            zs2(n2.ie, n2.Xc);
          } catch (u2) {
            if (u2 != "unwind") throw u2;
          }
        } else n2.target !== "setimmediate" && (o2 === "checkMailbox" ? ne2 && Pt2() : o2 && (B2(`worker: received unknown command ${o2}`), B2(n2)));
      } catch (u2) {
        throw xo2(), u2;
      }
    };
    var Sc2 = e2, ne2 = false;
    self.onunhandledrejection = (t2) => {
      throw t2.reason || t2;
    }, self.onmessage = e2;
  }
  var X2, J2, Ce2, Z2, x2, A2, _2, ae2, me2, Y2, we2, re2 = false;
  function se2() {
    var e2 = Fe2.buffer;
    r2.HEAP8 = X2 = new Int8Array(e2), Ce2 = new Int16Array(e2), r2.HEAPU8 = J2 = new Uint8Array(e2), Z2 = new Uint16Array(e2), r2.HEAP32 = x2 = new Int32Array(e2), r2.HEAPU32 = A2 = new Uint32Array(e2), _2 = new Float32Array(e2), ae2 = new Float64Array(e2), me2 = new BigInt64Array(e2), Y2 = new BigUint64Array(e2);
  }
  function yr2() {
    re2 = true, i2 ? H2() : ke2.$b();
  }
  function Te2(e2) {
    throw B2(e2 = "Aborted(" + e2 + ")"), W2 = true, e2 = new WebAssembly.RuntimeError(e2 + ". Build with -sASSERTIONS for more info."), R2?.(e2), e2;
  }
  function qe2() {
    return { a: { f: Vs2, J: js2, k: Hs2, p: qs2, l: Ys2, sa: Js2, b: Xs2, ca: Zs2, Ja: Sn2, q: Ks2, da: Ln2, Za: Bn2, Fa: On2, Ha: Mn2, _a: Un2, Xa: Cn2, Qa: Dn2, Wa: Pn2, oa: _n2, Ga: Rn2, Yb: Nn2, Ya: kn2, Zb: Wn2, db: Qs2, Da: ti2, Tb: ri2, Rb: oi2, Ca: si2, M: ii2, I: ui2, Sb: fi2, ja: yi2, Ub: bi2, Ta: wi2, Wb: Ti2, Ka: vi2, Pb: Ei2, ka: Si2, Sa: Ir2, ab: Ai2, U: Bi2, n: Di2, c: Sr2, rb: Pi2, w: _i2, L: Ri2, z: Ni2, j: ki2, o: qn2, sb: Wi2, G: Fi2, T: Gi2, h: $i2, u: zi2, m: Vi2, i: ji2, Na: Hi2, Oa: qi2, Pa: Yi2, La: Zn2, Ma: Kn2, Qb: Qn2, eb: Xi2, cb: Qi2, Y: eu, qb: tu, la: ru, bb: Zi2, fb: nu, $a: ou, Xb: au, N: Ji2, gb: su, X: iu, Vb: uu, nb: bu, C: wu, ra: gu, qa: Tu, pb: vu, W: Eu, v: Su, mb: Au, lb: Iu, kb: xu, ob: Lu, jb: Bu, ib: Ou, hb: Mu, Ua: ao2, Va: so2, Ia: wr2, V: io2, na: uo2, Ra: fo2, ma: co2, Cb: $f, xa: Rf, Db: Gf, ya: _f, F: Af, e: cf, s: uf, x: sf, B: Tf, Fb: Cf, ba: Uf, D: pf, za: Df, $: Nf, ga: Mf, Gb: Of, Hb: Bf, Ba: If, Aa: Lf, Ib: xf, wa: Ff, aa: Pf, d: ff, A: lf, r: df, Bb: zf, t: hf, y: Ef, H: mf, E: yf, K: Sf, R: kf, ia: gf, _: Wf, Kb: wf, Lb: bf, Jb: vf, g: Cu, a: Fe2, Ob: Ye2, Eb: Du, ha: Pu, O: _u, pa: Ru, Mb: Nu, ta: ku, Q: Wu, yb: Fu, zb: Gu, ua: $u, ea: zu, P: Vu, Ea: ju, va: Hu, Z: qu, wb: Yu, _b: Ju, S: Xu, Ab: Zu, tb: Ku, ub: ef, vb: tf, fa: rf, xb: nf, Nb: of } };
  }
  async function bt2() {
    function e2(o2, u2) {
      var c2 = ke2 = o2.exports;
      o2 = {};
      for (let [h2, b2] of Object.entries(c2)) typeof b2 == "function" ? (c2 = Ii2(b2), o2[h2] = c2) : o2[h2] = b2;
      return ke2 = o2, ke2 = (function() {
        var h2 = ke2, b2 = (I2) => (F2) => I2(F2) >>> 0, E2 = (I2) => () => I2() >>> 0;
        return (h2 = Object.assign({}, h2)).ac = b2(h2.ac), h2.Dc = E2(h2.Dc), h2.Fc = b2(h2.Fc), h2.sd = /* @__PURE__ */ ((I2) => (F2, j2) => I2(F2, j2) >>> 0)(h2.sd), h2.xd = b2(h2.xd), h2.yd = E2(h2.yd), h2.Cd = b2(h2.Cd), h2;
      })(), hn2.push(ke2.jd), lo2 = (o2 = ke2).ac, po2 = o2.bc, r2._OrtInit = o2.cc, r2._OrtGetLastError = o2.dc, r2._OrtCreateSessionOptions = o2.ec, r2._OrtAppendExecutionProvider = o2.fc, r2._OrtAddFreeDimensionOverride = o2.gc, r2._OrtAddSessionConfigEntry = o2.hc, r2._OrtReleaseSessionOptions = o2.ic, r2._OrtCreateSession = o2.jc, r2._OrtReleaseSession = o2.kc, r2._OrtGetInputOutputCount = o2.lc, r2._OrtGetInputOutputMetadata = o2.mc, r2._OrtFree = o2.nc, r2._OrtCreateTensor = o2.oc, r2._OrtGetTensorData = o2.pc, r2._OrtReleaseTensor = o2.qc, r2._OrtCreateRunOptions = o2.rc, r2._OrtAddRunConfigEntry = o2.sc, r2._OrtReleaseRunOptions = o2.tc, r2._OrtCreateBinding = o2.uc, r2._OrtBindInput = o2.vc, r2._OrtBindOutput = o2.wc, r2._OrtClearBoundOutputs = o2.xc, r2._OrtReleaseBinding = o2.yc, r2._OrtRunWithBinding = o2.zc, r2._OrtRun = o2.Ac, r2._OrtEndProfiling = o2.Bc, Pr2 = r2._OrtGetWebGpuDevice = o2.Cc, Ft2 = o2.Dc, xe2 = r2._free = o2.Ec, pt2 = r2._malloc = o2.Fc, mo2 = r2._wgpuBufferRelease = o2.Gc, ho2 = r2._wgpuCreateInstance = o2.Hc, yo2 = o2.Ic, bo2 = o2.Jc, wo2 = o2.Kc, go2 = o2.Lc, To2 = o2.Mc, vo2 = o2.Qc, Eo2 = o2._c, So2 = o2.$c, Ao2 = o2.ad, _r2 = o2.cd, Rr2 = o2.dd, Nr2 = o2.ed, kr2 = o2.fd, Et2 = o2.gd, Wr2 = o2.hd, Io2 = o2.id, Fr2 = o2.ld, xo2 = o2.md, Lo2 = o2.nd, Bo2 = o2.od, Gr2 = o2.pd, Oo2 = o2.qd, Mo2 = o2.rd, $r2 = o2.sd, N2 = o2.td, St2 = o2.ud, Uo2 = o2.vd, D2 = o2.wd, Gt2 = o2.xd, P2 = o2.yd, Co2 = o2.zd, zr2 = o2.Ad, Do2 = o2.Bd, Po2 = o2.Cd, _o2 = o2.Dd, Vr2 = o2.Ed, Ro2 = o2.Fd, No2 = o2.Gd, ko2 = o2.Hd, Wo2 = o2.Id, Fo2 = o2.Jd, Go2 = o2.Kd, $o2 = o2.Ld, zo2 = o2.Md, Vo2 = o2.Nd, jo2 = o2.Od, Ho2 = o2.Pd, qo2 = o2.Qd, Yo2 = o2.Rd, Jo2 = o2.Sd, Xo2 = o2.Ud, Zo2 = o2.Vd, Ko2 = o2.Wd, Qo2 = o2.Xd, ea2 = o2.Zd, ta2 = o2._d, ra2 = o2.$d, na2 = o2.ae, oa2 = o2.be, aa2 = o2.ce, sa2 = o2.qe, ia2 = o2.re, ua2 = o2.se, fa2 = o2.te, ca2 = o2.ue, da2 = o2.ve, la2 = o2.we, pa2 = o2.xe, ma2 = o2.ye, ha2 = o2.ze, ya2 = o2.Ae, ba2 = o2.$e, wa2 = o2.af, ga2 = o2.bf, Ta2 = o2.cf, v2 = u2, ke2;
    }
    var t2, n2 = qe2();
    return r2.instantiateWasm ? new Promise((o2) => {
      r2.instantiateWasm(n2, (u2, c2) => {
        o2(e2(u2, c2));
      });
    }) : i2 ? e2(new WebAssembly.Instance(v2, qe2()), v2) : (we2 ??= r2.locateFile ? r2.locateFile ? r2.locateFile("ort-wasm-simd-threaded.asyncify.wasm", T2) : T2 + "ort-wasm-simd-threaded.asyncify.wasm" : new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href, t2 = await (async function(o2) {
      var u2 = we2;
      if (!g2 && !oe2(u2)) try {
        var c2 = fetch(u2, { credentials: "same-origin" });
        return await WebAssembly.instantiateStreaming(c2, o2);
      } catch (h2) {
        B2(`wasm streaming compile failed: ${h2}`), B2("falling back to ArrayBuffer instantiation");
      }
      return (async function(h2, b2) {
        try {
          var E2 = await (async function(I2) {
            if (!g2) try {
              var F2 = await l2(I2);
              return new Uint8Array(F2);
            } catch {
            }
            if (I2 == we2 && g2) I2 = new Uint8Array(g2);
            else {
              if (!m2) throw "both async and sync fetching of the wasm failed";
              I2 = m2(I2);
            }
            return I2;
          })(h2);
          return await WebAssembly.instantiate(E2, b2);
        } catch (I2) {
          B2(`failed to asynchronously prepare wasm: ${I2}`), Te2(I2);
        }
      })(u2, o2);
    })(n2), e2(t2.instance, t2.module));
  }
  class wt2 {
    name = "ExitStatus";
    constructor(t2) {
      this.message = `Program terminated with exit(${t2})`, this.status = t2;
    }
  }
  var Se2 = (e2) => {
    e2.terminate(), e2.onmessage = () => {
    };
  }, Ae2 = [], Be2 = 0, ee2 = null, K2 = (e2) => {
    We2.length == 0 && (gn2(), wn2(We2[0]));
    var t2 = We2.pop();
    if (!t2) return 6;
    gt2.push(t2), Je2[e2.Oc] = t2, t2.Oc = e2.Oc;
    var n2 = { Pc: "run", ie: e2.he, Xc: e2.Xc, Oc: e2.Oc };
    return t2.postMessage(n2, e2.Zc), 0;
  }, G2 = 0, V2 = (e2, t2, ...n2) => {
    var o2, u2 = 16 * n2.length, c2 = P2(), h2 = Gt2(u2), b2 = h2 >>> 3;
    for (o2 of n2) typeof o2 == "bigint" ? ((p2(), me2)[b2++ >>> 0] = 1n, (p2(), me2)[b2++ >>> 0] = o2) : ((p2(), me2)[b2++ >>> 0] = 0n, (p2(), ae2)[b2++ >>> 0] = o2);
    return e2 = Lo2(e2, 0, u2, h2, t2), D2(c2), e2;
  };
  function Ye2(e2) {
    if (i2) return V2(0, 1, e2);
    if (S2 = e2, !(0 < G2)) {
      for (var t2 of gt2) Se2(t2);
      for (t2 of We2) Se2(t2);
      We2 = [], gt2 = [], Je2 = {}, W2 = true;
    }
    y2(0, new wt2(e2));
  }
  function br2(e2) {
    if (i2) return V2(1, 0, e2);
    wr2(e2);
  }
  var wr2 = (e2) => {
    if (S2 = e2, i2) throw br2(e2), "unwind";
    Ye2(e2);
  }, We2 = [], gt2 = [], hn2 = [], Je2 = {}, yn2 = (e2) => {
    var t2 = e2.Oc;
    delete Je2[t2], We2.push(e2), gt2.splice(gt2.indexOf(e2), 1), e2.Oc = 0, Bo2(t2);
  };
  function bn2() {
    hn2.forEach((e2) => e2());
  }
  var wn2 = (e2) => new Promise((t2) => {
    e2.onmessage = (u2) => {
      var c2 = u2.data;
      if (u2 = c2.Pc, c2.Wc && c2.Wc != Ft2()) {
        var h2 = Je2[c2.Wc];
        h2 ? h2.postMessage(c2, c2.Zc) : B2(`Internal error! Worker sent a message "${u2}" to target pthread ${c2.Wc}, but that thread no longer exists!`);
      } else u2 === "checkMailbox" ? Pt2() : u2 === "spawnThread" ? K2(c2) : u2 === "cleanupThread" ? he2(() => {
        yn2(Je2[c2.je]);
      }) : u2 === "loaded" ? (e2.loaded = true, t2(e2)) : c2.target === "setimmediate" ? e2.postMessage(c2) : u2 === "uncaughtException" ? e2.onerror(c2.error) : u2 === "callHandler" ? r2[c2.de](...c2.args) : u2 && B2(`worker sent an unknown command ${u2}`);
    }, e2.onerror = (u2) => {
      throw B2(`worker sent an error! ${u2.filename}:${u2.lineno}: ${u2.message}`), u2;
    };
    var n2, o2 = [];
    for (n2 of []) r2.propertyIsEnumerable(n2) && o2.push(n2);
    e2.postMessage({ Pc: "load", ee: o2, ke: Fe2, le: v2 });
  });
  function gn2() {
    var e2 = new Worker((() => {
      let t2 = URL;
      return import.meta.url > "file:" && import.meta.url < "file;" ? new t2("ort.webgpu.bundle.min.mjs", import.meta.url) : new URL(import.meta.url);
    })(), { type: "module", workerData: "em-pthread", name: "em-pthread" });
    We2.push(e2);
  }
  var Fe2, zs2 = (e2, t2) => {
    G2 = 0, e2 = Vr2(e2, t2), 0 < G2 ? S2 = e2 : Gr2(e2);
  }, Ct2 = [], Dt2 = 0, ce2 = (e2) => -9007199254740992 > e2 || 9007199254740992 < e2 ? NaN : Number(e2);
  function Vs2(e2) {
    var t2 = new gr2(e2 >>>= 0);
    return (p2(), X2)[t2.Rc + 12 >>> 0] == 0 && (Tn2(t2, true), Dt2--), vn2(t2, false), Ct2.push(t2), Po2(e2);
  }
  var ft2 = 0, js2 = () => {
    N2(0, 0);
    var e2 = Ct2.pop();
    Co2(e2.Yc), ft2 = 0;
  };
  function Tn2(e2, t2) {
    t2 = t2 ? 1 : 0, (p2(), X2)[e2.Rc + 12 >>> 0] = t2;
  }
  function vn2(e2, t2) {
    t2 = t2 ? 1 : 0, (p2(), X2)[e2.Rc + 13 >>> 0] = t2;
  }
  class gr2 {
    constructor(t2) {
      this.Yc = t2, this.Rc = t2 - 24;
    }
  }
  var Tr2 = (e2) => {
    var t2 = ft2;
    if (!t2) return St2(0), 0;
    var n2 = new gr2(t2);
    (p2(), A2)[n2.Rc + 16 >>> 2 >>> 0] = t2;
    var o2 = (p2(), A2)[n2.Rc + 4 >>> 2 >>> 0];
    if (!o2) return St2(0), t2;
    for (var u2 of e2) {
      if (u2 === 0 || u2 === o2) break;
      if (Do2(u2, o2, n2.Rc + 16)) return St2(u2), t2;
    }
    return St2(o2), t2;
  };
  function Hs2() {
    return Tr2([]);
  }
  function qs2(e2) {
    return Tr2([e2 >>> 0]);
  }
  function Ys2(e2, t2, n2, o2) {
    return Tr2([e2 >>> 0, t2 >>> 0, n2 >>> 0, o2 >>> 0]);
  }
  var Js2 = () => {
    var e2 = Ct2.pop();
    e2 || Te2("no exception to throw");
    var t2 = e2.Yc;
    throw (p2(), X2)[e2.Rc + 13 >>> 0] == 0 && (Ct2.push(e2), vn2(e2, true), Tn2(e2, false), Dt2++), zr2(t2), ft2 = t2;
  };
  function Xs2(e2, t2, n2) {
    var o2 = new gr2(e2 >>>= 0);
    throw t2 >>>= 0, n2 >>>= 0, (p2(), A2)[o2.Rc + 16 >>> 2 >>> 0] = 0, (p2(), A2)[o2.Rc + 4 >>> 2 >>> 0] = t2, (p2(), A2)[o2.Rc + 8 >>> 2 >>> 0] = n2, zr2(e2), Dt2++, ft2 = e2;
  }
  var Zs2 = () => Dt2;
  function En2(e2, t2, n2, o2) {
    return i2 ? V2(2, 1, e2, t2, n2, o2) : Sn2(e2, t2, n2, o2);
  }
  function Sn2(e2, t2, n2, o2) {
    if (e2 >>>= 0, t2 >>>= 0, n2 >>>= 0, o2 >>>= 0, !globalThis.SharedArrayBuffer) return 6;
    var u2 = [];
    return i2 && u2.length === 0 ? En2(e2, t2, n2, o2) : (e2 = { he: n2, Oc: e2, Xc: o2, Zc: u2 }, i2 ? (e2.Pc = "spawnThread", postMessage(e2, u2), 0) : K2(e2));
  }
  function Ks2(e2) {
    throw ft2 ||= e2 >>> 0, ft2;
  }
  var An2 = globalThis.TextDecoder && new TextDecoder(), In2 = (e2, t2, n2, o2) => {
    if (n2 = t2 + n2, o2) return n2;
    for (; e2[t2] && !(t2 >= n2); ) ++t2;
    return t2;
  }, xn2 = (e2, t2 = 0, n2, o2) => {
    if (16 < (n2 = In2(e2, t2 >>>= 0, n2, o2)) - t2 && e2.buffer && An2) return An2.decode(e2.buffer instanceof ArrayBuffer ? e2.subarray(t2, n2) : e2.slice(t2, n2));
    for (o2 = ""; t2 < n2; ) {
      var u2 = e2[t2++];
      if (128 & u2) {
        var c2 = 63 & e2[t2++];
        if ((224 & u2) == 192) o2 += String.fromCharCode((31 & u2) << 6 | c2);
        else {
          var h2 = 63 & e2[t2++];
          65536 > (u2 = (240 & u2) == 224 ? (15 & u2) << 12 | c2 << 6 | h2 : (7 & u2) << 18 | c2 << 12 | h2 << 6 | 63 & e2[t2++]) ? o2 += String.fromCharCode(u2) : (u2 -= 65536, o2 += String.fromCharCode(55296 | u2 >> 10, 56320 | 1023 & u2));
        }
      } else o2 += String.fromCharCode(u2);
    }
    return o2;
  }, ct2 = (e2, t2, n2) => (e2 >>>= 0) ? xn2((p2(), J2), e2, t2, n2) : "";
  function Ln2(e2, t2, n2) {
    return i2 ? V2(3, 1, e2, t2, n2) : 0;
  }
  function Bn2(e2, t2) {
    if (i2) return V2(4, 1, e2, t2);
  }
  function On2(e2, t2) {
    if (i2) return V2(5, 1, e2, t2);
  }
  function Mn2(e2, t2, n2) {
    if (i2) return V2(6, 1, e2, t2, n2);
  }
  function Un2(e2, t2, n2) {
    return i2 ? V2(7, 1, e2, t2, n2) : 0;
  }
  function Cn2(e2, t2) {
    if (i2) return V2(8, 1, e2, t2);
  }
  function Dn2(e2, t2, n2) {
    if (i2) return V2(9, 1, e2, t2, n2);
  }
  function Pn2(e2, t2, n2, o2) {
    if (i2) return V2(10, 1, e2, t2, n2, o2);
  }
  function _n2(e2, t2, n2, o2) {
    if (i2) return V2(11, 1, e2, t2, n2, o2);
  }
  function Rn2(e2, t2, n2, o2) {
    if (i2) return V2(12, 1, e2, t2, n2, o2);
  }
  function Nn2(e2) {
    if (i2) return V2(13, 1, e2);
  }
  function kn2(e2, t2) {
    if (i2) return V2(14, 1, e2, t2);
  }
  function Wn2(e2, t2, n2) {
    if (i2) return V2(15, 1, e2, t2, n2);
  }
  var Qs2 = () => Te2(""), Oe2 = (e2) => {
    e2 >>>= 0;
    for (var t2 = ""; ; ) {
      var n2 = (p2(), J2)[e2++ >>> 0];
      if (!n2) return t2;
      t2 += String.fromCharCode(n2);
    }
  }, vr2 = {}, Er2 = {}, ei2 = {}, dt2 = class extends Error {
    constructor(e2) {
      super(e2), this.name = "BindingError";
    }
  };
  function De2(e2, t2, n2 = {}) {
    return (function(o2, u2, c2 = {}) {
      var h2 = u2.name;
      if (!o2) throw new dt2(`type "${h2}" must have a positive integer typeid pointer`);
      if (Er2.hasOwnProperty(o2)) {
        if (c2.fe) return;
        throw new dt2(`Cannot register type '${h2}' twice`);
      }
      Er2[o2] = u2, delete ei2[o2], vr2.hasOwnProperty(o2) && (u2 = vr2[o2], delete vr2[o2], u2.forEach((b2) => b2()));
    })(e2, t2, n2);
  }
  var Fn2 = (e2, t2, n2) => {
    switch (t2) {
      case 1:
        return n2 ? (o2) => (p2(), X2)[o2 >>> 0] : (o2) => (p2(), J2)[o2 >>> 0];
      case 2:
        return n2 ? (o2) => (p2(), Ce2)[o2 >>> 1 >>> 0] : (o2) => (p2(), Z2)[o2 >>> 1 >>> 0];
      case 4:
        return n2 ? (o2) => (p2(), x2)[o2 >>> 2 >>> 0] : (o2) => (p2(), A2)[o2 >>> 2 >>> 0];
      case 8:
        return n2 ? (o2) => (p2(), me2)[o2 >>> 3 >>> 0] : (o2) => (p2(), Y2)[o2 >>> 3 >>> 0];
      default:
        throw new TypeError(`invalid integer width (${t2}): ${e2}`);
    }
  };
  function ti2(e2, t2, n2, o2, u2) {
    e2 >>>= 0, n2 >>>= 0, t2 = Oe2(t2 >>> 0);
    let c2 = (h2) => h2;
    if (o2 = o2 === 0n) {
      let h2 = 8 * n2;
      c2 = (b2) => BigInt.asUintN(h2, b2), u2 = c2(u2);
    }
    De2(e2, { name: t2, Nc: c2, Tc: (h2, b2) => (typeof b2 == "number" && (b2 = BigInt(b2)), b2), Sc: Fn2(t2, n2, !o2), Uc: null });
  }
  function ri2(e2, t2, n2, o2) {
    De2(e2 >>>= 0, { name: t2 = Oe2(t2 >>> 0), Nc: function(u2) {
      return !!u2;
    }, Tc: function(u2, c2) {
      return c2 ? n2 : o2;
    }, Sc: function(u2) {
      return this.Nc((p2(), J2)[u2 >>> 0]);
    }, Uc: null });
  }
  var Gn2 = [], Xe2 = [0, 1, , 1, null, 1, true, 1, false, 1];
  function Sr2(e2) {
    9 < (e2 >>>= 0) && --Xe2[e2 + 1] === 0 && (Xe2[e2] = void 0, Gn2.push(e2));
  }
  var ve2 = (e2) => {
    if (!e2) throw new dt2(`Cannot use deleted val. handle = ${e2}`);
    return Xe2[e2];
  }, Ie2 = (e2) => {
    switch (e2) {
      case void 0:
        return 2;
      case null:
        return 4;
      case true:
        return 6;
      case false:
        return 8;
      default:
        let t2 = Gn2.pop() || Xe2.length;
        return Xe2[t2] = e2, Xe2[t2 + 1] = 1, t2;
    }
  };
  function Ar2(e2) {
    return this.Nc((p2(), A2)[e2 >>> 2 >>> 0]);
  }
  var ni2 = { name: "emscripten::val", Nc: (e2) => {
    var t2 = ve2(e2);
    return Sr2(e2), t2;
  }, Tc: (e2, t2) => Ie2(t2), Sc: Ar2, Uc: null };
  function oi2(e2) {
    return De2(e2 >>> 0, ni2);
  }
  var ai2 = (e2, t2) => {
    switch (t2) {
      case 4:
        return function(n2) {
          return this.Nc((p2(), _2)[n2 >>> 2 >>> 0]);
        };
      case 8:
        return function(n2) {
          return this.Nc((p2(), ae2)[n2 >>> 3 >>> 0]);
        };
      default:
        throw new TypeError(`invalid float width (${t2}): ${e2}`);
    }
  };
  function si2(e2, t2, n2) {
    n2 >>>= 0, De2(e2 >>>= 0, { name: t2 = Oe2(t2 >>> 0), Nc: (o2) => o2, Tc: (o2, u2) => u2, Sc: ai2(t2, n2), Uc: null });
  }
  function ii2(e2, t2, n2, o2, u2) {
    e2 >>>= 0, n2 >>>= 0, t2 = Oe2(t2 >>> 0);
    let c2 = (b2) => b2;
    if (o2 === 0) {
      var h2 = 32 - 8 * n2;
      c2 = (b2) => b2 << h2 >>> h2, u2 = c2(u2);
    }
    De2(e2, { name: t2, Nc: c2, Tc: (b2, E2) => E2, Sc: Fn2(t2, n2, o2 !== 0), Uc: null });
  }
  function ui2(e2, t2, n2) {
    function o2(c2) {
      var h2 = (p2(), A2)[c2 >>> 2 >>> 0];
      return c2 = (p2(), A2)[c2 + 4 >>> 2 >>> 0], new u2((p2(), X2).buffer, c2, h2);
    }
    var u2 = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array][t2];
    De2(e2 >>>= 0, { name: n2 = Oe2(n2 >>> 0), Nc: o2, Sc: o2 }, { fe: true });
  }
  var Pe2 = (e2, t2, n2) => {
    var o2 = (p2(), J2);
    if (t2 >>>= 0, 0 < n2) {
      var u2 = t2;
      n2 = t2 + n2 - 1;
      for (var c2 = 0; c2 < e2.length; ++c2) {
        var h2 = e2.codePointAt(c2);
        if (127 >= h2) {
          if (t2 >= n2) break;
          o2[t2++ >>> 0] = h2;
        } else if (2047 >= h2) {
          if (t2 + 1 >= n2) break;
          o2[t2++ >>> 0] = 192 | h2 >> 6, o2[t2++ >>> 0] = 128 | 63 & h2;
        } else if (65535 >= h2) {
          if (t2 + 2 >= n2) break;
          o2[t2++ >>> 0] = 224 | h2 >> 12, o2[t2++ >>> 0] = 128 | h2 >> 6 & 63, o2[t2++ >>> 0] = 128 | 63 & h2;
        } else {
          if (t2 + 3 >= n2) break;
          o2[t2++ >>> 0] = 240 | h2 >> 18, o2[t2++ >>> 0] = 128 | h2 >> 12 & 63, o2[t2++ >>> 0] = 128 | h2 >> 6 & 63, o2[t2++ >>> 0] = 128 | 63 & h2, c2++;
        }
      }
      o2[t2 >>> 0] = 0, e2 = t2 - u2;
    } else e2 = 0;
    return e2;
  }, _e2 = (e2) => {
    for (var t2 = 0, n2 = 0; n2 < e2.length; ++n2) {
      var o2 = e2.charCodeAt(n2);
      127 >= o2 ? t2++ : 2047 >= o2 ? t2 += 2 : 55296 <= o2 && 57343 >= o2 ? (t2 += 4, ++n2) : t2 += 3;
    }
    return t2;
  };
  function fi2(e2, t2) {
    De2(e2 >>>= 0, { name: t2 = Oe2(t2 >>> 0), Nc(n2) {
      var o2 = (p2(), A2)[n2 >>> 2 >>> 0];
      return o2 = ct2(n2 + 4, o2, true), xe2(n2), o2;
    }, Tc(n2, o2) {
      o2 instanceof ArrayBuffer && (o2 = new Uint8Array(o2));
      var u2 = typeof o2 == "string";
      if (!(u2 || ArrayBuffer.isView(o2) && o2.BYTES_PER_ELEMENT == 1)) throw new dt2("Cannot pass non-string to std::string");
      var c2 = u2 ? _e2(o2) : o2.length, h2 = pt2(4 + c2 + 1), b2 = h2 + 4;
      return (p2(), A2)[h2 >>> 2 >>> 0] = c2, u2 ? Pe2(o2, b2, c2 + 1) : (p2(), J2).set(o2, b2 >>> 0), n2 !== null && n2.push(xe2, h2), h2;
    }, Sc: Ar2, Uc(n2) {
      xe2(n2);
    } });
  }
  var $n2 = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, ci2 = (e2, t2, n2) => {
    if (e2 >>>= 1, 16 < (t2 = In2((p2(), Z2), e2, t2 / 2, n2)) - e2 && $n2) return $n2.decode((p2(), Z2).slice(e2, t2));
    for (n2 = ""; e2 < t2; ++e2) {
      var o2 = (p2(), Z2)[e2 >>> 0];
      n2 += String.fromCharCode(o2);
    }
    return n2;
  }, di2 = (e2, t2, n2) => {
    if (n2 ??= 2147483647, 2 > n2) return 0;
    var o2 = t2;
    n2 = (n2 -= 2) < 2 * e2.length ? n2 / 2 : e2.length;
    for (var u2 = 0; u2 < n2; ++u2) {
      var c2 = e2.charCodeAt(u2);
      (p2(), Ce2)[t2 >>> 1 >>> 0] = c2, t2 += 2;
    }
    return (p2(), Ce2)[t2 >>> 1 >>> 0] = 0, t2 - o2;
  }, li2 = (e2) => 2 * e2.length, pi2 = (e2, t2, n2) => {
    var o2 = "";
    e2 >>>= 2;
    for (var u2 = 0; !(u2 >= t2 / 4); u2++) {
      var c2 = (p2(), A2)[e2 + u2 >>> 0];
      if (!c2 && !n2) break;
      o2 += String.fromCodePoint(c2);
    }
    return o2;
  }, mi2 = (e2, t2, n2) => {
    if (t2 >>>= 0, n2 ??= 2147483647, 4 > n2) return 0;
    var o2 = t2;
    n2 = o2 + n2 - 4;
    for (var u2 = 0; u2 < e2.length; ++u2) {
      var c2 = e2.codePointAt(u2);
      if (65535 < c2 && u2++, (p2(), x2)[t2 >>> 2 >>> 0] = c2, (t2 += 4) + 4 > n2) break;
    }
    return (p2(), x2)[t2 >>> 2 >>> 0] = 0, t2 - o2;
  }, hi2 = (e2) => {
    for (var t2 = 0, n2 = 0; n2 < e2.length; ++n2) 65535 < e2.codePointAt(n2) && n2++, t2 += 4;
    return t2;
  };
  function yi2(e2, t2, n2) {
    if (e2 >>>= 0, t2 >>>= 0, n2 = Oe2(n2 >>>= 0), t2 === 2) var o2 = ci2, u2 = di2, c2 = li2;
    else o2 = pi2, u2 = mi2, c2 = hi2;
    De2(e2, { name: n2, Nc: (h2) => {
      var b2 = (p2(), A2)[h2 >>> 2 >>> 0];
      return b2 = o2(h2 + 4, b2 * t2, true), xe2(h2), b2;
    }, Tc: (h2, b2) => {
      if (typeof b2 != "string") throw new dt2(`Cannot pass non-string to C++ string type ${n2}`);
      var E2 = c2(b2), I2 = pt2(4 + E2 + t2);
      return (p2(), A2)[I2 >>> 2 >>> 0] = E2 / t2, u2(b2, I2 + 4, E2 + t2), h2 !== null && h2.push(xe2, I2), I2;
    }, Sc: Ar2, Uc(h2) {
      xe2(h2);
    } });
  }
  function bi2(e2, t2) {
    De2(e2 >>>= 0, { ge: true, name: t2 = Oe2(t2 >>> 0), Nc: () => {
    }, Tc: () => {
    } });
  }
  function wi2(e2) {
    Fr2(e2 >>> 0, !f2, 1, !s2, 131072, false), bn2();
  }
  var he2 = (e2) => {
    if (!W2) try {
      if (e2(), !(0 < G2)) try {
        i2 ? Ft2() && Gr2(S2) : wr2(S2);
      } catch (t2) {
        t2 instanceof wt2 || t2 == "unwind" || y2(0, t2);
      }
    } catch (t2) {
      t2 instanceof wt2 || t2 == "unwind" || y2(0, t2);
    }
  }, gi2 = !Atomics.waitAsync || globalThis.navigator?.userAgent && 91 > Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]);
  function Ir2(e2) {
    e2 >>>= 0, gi2 || (Atomics.waitAsync((p2(), x2), e2 >>> 2, e2).value.then(Pt2), e2 += 128, Atomics.store((p2(), x2), e2 >>> 2, 1));
  }
  var Pt2 = () => he2(() => {
    var e2 = Ft2();
    e2 && (Ir2(e2), Mo2());
  });
  function Ti2(e2, t2) {
    (e2 >>>= 0) == t2 >>> 0 ? setTimeout(Pt2) : i2 ? postMessage({ Wc: e2, Pc: "checkMailbox" }) : (e2 = Je2[e2]) && e2.postMessage({ Pc: "checkMailbox" });
  }
  var xr2 = [];
  function vi2(e2, t2, n2, o2, u2) {
    for (t2 >>>= 0, u2 >>>= 0, xr2.length = 0, n2 = u2 >>> 3, o2 = u2 + o2 >>> 3; n2 < o2; ) {
      var c2;
      c2 = (p2(), me2)[n2++ >>> 0] ? (p2(), me2)[n2++ >>> 0] : (p2(), ae2)[n2++ >>> 0], xr2.push(c2);
    }
    return (t2 ? jr2[t2] : af[e2])(...xr2);
  }
  var Ei2 = () => {
    G2 = 0;
  };
  function Si2(e2) {
    e2 >>>= 0, i2 ? postMessage({ Pc: "cleanupThread", je: e2 }) : yn2(Je2[e2]);
  }
  function Ai2(e2) {
  }
  var _t2 = (e2) => {
    try {
      e2();
    } catch (t2) {
      Te2(t2);
    }
  };
  function Ii2(e2) {
    var t2 = (...n2) => {
      Rt2.push(e2);
      try {
        return e2(...n2);
      } finally {
        W2 || (Rt2.pop(), Me2 && Ge2 === 1 && Rt2.length === 0 && (Ge2 = 0, G2 += 1, _t2(wa2), typeof Fibers < "u" && Fibers.De()));
      }
    };
    return jn2.set(e2, t2), t2;
  }
  var Ge2 = 0, Me2 = null, zn2 = 0, Rt2 = [], Lr2 = /* @__PURE__ */ new Map(), Vn2 = /* @__PURE__ */ new Map(), jn2 = /* @__PURE__ */ new Map(), xi2 = 0, Br2 = null, Li2 = [], Hn2 = (e2) => (function(t2) {
    if (!W2) {
      if (Ge2 === 0) {
        var n2 = false, o2 = false;
        t2((u2 = 0) => {
          if (!W2 && (zn2 = u2, n2 = true, o2)) {
            Ge2 = 2, _t2(() => ga2(Me2)), typeof MainLoop < "u" && MainLoop.Yd && MainLoop.resume(), u2 = false;
            try {
              var c2 = (function() {
                var E2 = (p2(), x2)[Me2 + 8 >>> 2 >>> 0];
                return E2 = Vn2.get(E2), E2 = jn2.get(E2), --G2, E2();
              })();
            } catch (E2) {
              c2 = E2, u2 = true;
            }
            var h2 = false;
            if (!Me2) {
              var b2 = Br2;
              b2 && (Br2 = null, (u2 ? b2.reject : b2.resolve)(c2), h2 = true);
            }
            if (u2 && !h2) throw c2;
          }
        }), o2 = true, n2 || (Ge2 = 1, Me2 = (function() {
          var u2 = pt2(65548), c2 = u2 + 12;
          if ((p2(), A2)[u2 >>> 2 >>> 0] = c2, (p2(), A2)[u2 + 4 >>> 2 >>> 0] = c2 + 65536, c2 = Rt2[0], !Lr2.has(c2)) {
            var h2 = xi2++;
            Lr2.set(c2, h2), Vn2.set(h2, c2);
          }
          return c2 = Lr2.get(c2), (p2(), x2)[u2 + 8 >>> 2 >>> 0] = c2, u2;
        })(), typeof MainLoop < "u" && MainLoop.Yd && MainLoop.pause(), _t2(() => ba2(Me2)));
      } else Ge2 === 2 ? (Ge2 = 0, _t2(Ta2), xe2(Me2), Me2 = null, Li2.forEach(he2)) : Te2(`invalid state: ${Ge2}`);
      return zn2;
    }
  })((t2) => {
    e2().then(t2);
  });
  function Bi2(e2) {
    return e2 >>>= 0, Hn2(async () => {
      var t2 = await ve2(e2);
      return Ie2(t2);
    });
  }
  var Or2 = [], Oi2 = (e2) => {
    var t2 = Or2.length;
    return Or2.push(e2), t2;
  }, Mi2 = (e2, t2) => {
    for (var n2 = Array(e2), o2 = 0; o2 < e2; ++o2) {
      var u2 = o2, c2 = (p2(), A2)[t2 + 4 * o2 >>> 2 >>> 0], h2 = Er2[c2];
      if (h2 === void 0) throw e2 = `parameter ${o2}`, c2 = lo2(c2), t2 = Oe2(c2), xe2(c2), new dt2(`${e2} has unknown type ${t2}`);
      n2[u2] = h2;
    }
    return n2;
  }, Ui2 = (e2, t2, n2) => {
    var o2 = [];
    return e2 = e2(o2, n2), o2.length && ((p2(), A2)[t2 >>> 2 >>> 0] = Ie2(o2)), e2;
  }, Ci2 = {}, Nt2 = (e2) => {
    var t2 = Ci2[e2];
    return t2 === void 0 ? Oe2(e2) : t2;
  };
  function Di2(e2, t2, n2) {
    var [o2, ...u2] = Mi2(e2, t2 >>> 0);
    t2 = o2.Tc.bind(o2);
    var c2 = u2.map((E2) => E2.Sc.bind(E2));
    e2--;
    var h2 = { toValue: ve2 };
    switch (e2 = c2.map((E2, I2) => {
      var F2 = `argFromPtr${I2}`;
      return h2[F2] = E2, `${F2}(args${I2 ? "+" + 8 * I2 : ""})`;
    }), n2) {
      case 0:
        var b2 = "toValue(handle)";
        break;
      case 2:
        b2 = "new (toValue(handle))";
        break;
      case 3:
        b2 = "";
        break;
      case 1:
        h2.getStringOrSymbol = Nt2, b2 = "toValue(handle)[getStringOrSymbol(methodName)]";
    }
    return b2 += `(${e2})`, o2.ge || (h2.toReturnWire = t2, h2.emval_returnValue = Ui2, b2 = `return emval_returnValue(toReturnWire, destructorsRef, ${b2})`), b2 = `return function (handle, methodName, destructorsRef, args) {
  ${b2}
  }`, n2 = new Function(Object.keys(h2), b2)(...Object.values(h2)), b2 = `methodCaller<(${u2.map((E2) => E2.name)}) => ${o2.name}>`, Oi2(Object.defineProperty(n2, "name", { value: b2 }));
  }
  function Pi2(e2, t2) {
    return t2 >>>= 0, (e2 = ve2(e2 >>> 0)) == ve2(t2);
  }
  function _i2(e2) {
    return (e2 >>>= 0) ? (e2 = Nt2(e2), Ie2(globalThis[e2])) : Ie2(globalThis);
  }
  function Ri2(e2) {
    return e2 = Nt2(e2 >>> 0), Ie2(r2[e2]);
  }
  function Ni2(e2, t2) {
    return t2 >>>= 0, e2 = ve2(e2 >>> 0), t2 = ve2(t2), Ie2(e2[t2]);
  }
  function ki2(e2) {
    9 < (e2 >>>= 0) && (Xe2[e2 + 1] += 1);
  }
  function qn2(e2, t2, n2, o2, u2) {
    return Or2[e2 >>> 0](t2 >>> 0, n2 >>> 0, o2 >>> 0, u2 >>> 0);
  }
  function Wi2(e2, t2, n2, o2, u2) {
    return qn2(e2 >>> 0, t2 >>> 0, n2 >>> 0, o2 >>> 0, u2 >>> 0);
  }
  function Fi2() {
    return Ie2([]);
  }
  function Gi2(e2) {
    e2 = ve2(e2 >>> 0);
    for (var t2 = Array(e2.length), n2 = 0; n2 < e2.length; n2++) t2[n2] = e2[n2];
    return Ie2(t2);
  }
  function $i2(e2) {
    return Ie2(Nt2(e2 >>> 0));
  }
  function zi2() {
    return Ie2({});
  }
  function Vi2(e2) {
    for (var t2 = ve2(e2 >>>= 0); t2.length; ) {
      var n2 = t2.pop();
      t2.pop()(n2);
    }
    Sr2(e2);
  }
  function ji2(e2, t2, n2) {
    t2 >>>= 0, n2 >>>= 0, e2 = ve2(e2 >>> 0), t2 = ve2(t2), n2 = ve2(n2), e2[t2] = n2;
  }
  function Hi2(e2, t2) {
    e2 = ce2(e2), t2 >>>= 0, e2 = new Date(1e3 * e2), (p2(), x2)[t2 >>> 2 >>> 0] = e2.getUTCSeconds(), (p2(), x2)[t2 + 4 >>> 2 >>> 0] = e2.getUTCMinutes(), (p2(), x2)[t2 + 8 >>> 2 >>> 0] = e2.getUTCHours(), (p2(), x2)[t2 + 12 >>> 2 >>> 0] = e2.getUTCDate(), (p2(), x2)[t2 + 16 >>> 2 >>> 0] = e2.getUTCMonth(), (p2(), x2)[t2 + 20 >>> 2 >>> 0] = e2.getUTCFullYear() - 1900, (p2(), x2)[t2 + 24 >>> 2 >>> 0] = e2.getUTCDay(), e2 = (e2.getTime() - Date.UTC(e2.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0, (p2(), x2)[t2 + 28 >>> 2 >>> 0] = e2;
  }
  var Yn2 = (e2) => e2 % 4 == 0 && (e2 % 100 != 0 || e2 % 400 == 0), Jn2 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Xn2 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  function qi2(e2, t2) {
    e2 = ce2(e2), t2 >>>= 0, e2 = new Date(1e3 * e2), (p2(), x2)[t2 >>> 2 >>> 0] = e2.getSeconds(), (p2(), x2)[t2 + 4 >>> 2 >>> 0] = e2.getMinutes(), (p2(), x2)[t2 + 8 >>> 2 >>> 0] = e2.getHours(), (p2(), x2)[t2 + 12 >>> 2 >>> 0] = e2.getDate(), (p2(), x2)[t2 + 16 >>> 2 >>> 0] = e2.getMonth(), (p2(), x2)[t2 + 20 >>> 2 >>> 0] = e2.getFullYear() - 1900, (p2(), x2)[t2 + 24 >>> 2 >>> 0] = e2.getDay();
    var n2 = (Yn2(e2.getFullYear()) ? Jn2 : Xn2)[e2.getMonth()] + e2.getDate() - 1 | 0;
    (p2(), x2)[t2 + 28 >>> 2 >>> 0] = n2, (p2(), x2)[t2 + 36 >>> 2 >>> 0] = -60 * e2.getTimezoneOffset(), n2 = new Date(e2.getFullYear(), 6, 1).getTimezoneOffset();
    var o2 = new Date(e2.getFullYear(), 0, 1).getTimezoneOffset();
    e2 = 0 | (n2 != o2 && e2.getTimezoneOffset() == Math.min(o2, n2)), (p2(), x2)[t2 + 32 >>> 2 >>> 0] = e2;
  }
  function Yi2(e2) {
    e2 >>>= 0;
    var t2 = new Date((p2(), x2)[e2 + 20 >>> 2 >>> 0] + 1900, (p2(), x2)[e2 + 16 >>> 2 >>> 0], (p2(), x2)[e2 + 12 >>> 2 >>> 0], (p2(), x2)[e2 + 8 >>> 2 >>> 0], (p2(), x2)[e2 + 4 >>> 2 >>> 0], (p2(), x2)[e2 >>> 2 >>> 0], 0), n2 = (p2(), x2)[e2 + 32 >>> 2 >>> 0], o2 = t2.getTimezoneOffset(), u2 = new Date(t2.getFullYear(), 6, 1).getTimezoneOffset(), c2 = new Date(t2.getFullYear(), 0, 1).getTimezoneOffset(), h2 = Math.min(c2, u2);
    return 0 > n2 ? (p2(), x2)[e2 + 32 >>> 2 >>> 0] = +(u2 != c2 && h2 == o2) : 0 < n2 != (h2 == o2) && (u2 = Math.max(c2, u2), t2.setTime(t2.getTime() + 6e4 * ((0 < n2 ? h2 : u2) - o2))), (p2(), x2)[e2 + 24 >>> 2 >>> 0] = t2.getDay(), n2 = (Yn2(t2.getFullYear()) ? Jn2 : Xn2)[t2.getMonth()] + t2.getDate() - 1 | 0, (p2(), x2)[e2 + 28 >>> 2 >>> 0] = n2, (p2(), x2)[e2 >>> 2 >>> 0] = t2.getSeconds(), (p2(), x2)[e2 + 4 >>> 2 >>> 0] = t2.getMinutes(), (p2(), x2)[e2 + 8 >>> 2 >>> 0] = t2.getHours(), (p2(), x2)[e2 + 12 >>> 2 >>> 0] = t2.getDate(), (p2(), x2)[e2 + 16 >>> 2 >>> 0] = t2.getMonth(), (p2(), x2)[e2 + 20 >>> 2 >>> 0] = t2.getYear(), e2 = t2.getTime(), BigInt(isNaN(e2) ? -1 : e2 / 1e3);
  }
  function Zn2(e2, t2, n2, o2, u2, c2, h2) {
    return i2 ? V2(16, 1, e2, t2, n2, o2, u2, c2, h2) : -52;
  }
  function Kn2(e2, t2, n2, o2, u2, c2) {
    if (i2) return V2(17, 1, e2, t2, n2, o2, u2, c2);
  }
  var Tt2 = {}, Ji2 = () => performance.timeOrigin + performance.now();
  function Qn2(e2, t2) {
    if (i2) return V2(18, 1, e2, t2);
    if (Tt2[e2] && (clearTimeout(Tt2[e2].id), delete Tt2[e2]), !t2) return 0;
    var n2 = setTimeout(() => {
      delete Tt2[e2], he2(() => Oo2(e2, performance.timeOrigin + performance.now()));
    }, t2);
    return Tt2[e2] = { id: n2, Ce: t2 }, 0;
  }
  function Xi2(e2, t2, n2, o2) {
    e2 >>>= 0, t2 >>>= 0, n2 >>>= 0, o2 >>>= 0;
    var u2 = (/* @__PURE__ */ new Date()).getFullYear(), c2 = new Date(u2, 0, 1).getTimezoneOffset();
    u2 = new Date(u2, 6, 1).getTimezoneOffset();
    var h2 = Math.max(c2, u2);
    (p2(), A2)[e2 >>> 2 >>> 0] = 60 * h2, (p2(), x2)[t2 >>> 2 >>> 0] = +(c2 != u2), e2 = (t2 = (b2) => {
      var E2 = Math.abs(b2);
      return `UTC${0 <= b2 ? "-" : "+"}${String(Math.floor(E2 / 60)).padStart(2, "0")}${String(E2 % 60).padStart(2, "0")}`;
    })(c2), t2 = t2(u2), u2 < c2 ? (Pe2(e2, n2, 17), Pe2(t2, o2, 17)) : (Pe2(e2, o2, 17), Pe2(t2, n2, 17));
  }
  var Zi2 = () => Date.now(), Ki2 = 1;
  function Qi2(e2, t2, n2) {
    if (n2 >>>= 0, !(0 <= e2 && 3 >= e2)) return 28;
    if (e2 === 0) e2 = Date.now();
    else {
      if (!Ki2) return 52;
      e2 = performance.timeOrigin + performance.now();
    }
    return e2 = Math.round(1e6 * e2), (p2(), me2)[n2 >>> 3 >>> 0] = BigInt(e2), 0;
  }
  var Mr2 = [], eo2 = (e2, t2) => {
    Mr2.length = 0;
    for (var n2; n2 = (p2(), J2)[e2++ >>> 0]; ) {
      var o2 = n2 != 105;
      t2 += (o2 &= n2 != 112) && t2 % 8 ? 4 : 0, Mr2.push(n2 == 112 ? (p2(), A2)[t2 >>> 2 >>> 0] : n2 == 106 ? (p2(), me2)[t2 >>> 3 >>> 0] : n2 == 105 ? (p2(), x2)[t2 >>> 2 >>> 0] : (p2(), ae2)[t2 >>> 3 >>> 0]), t2 += o2 ? 8 : 4;
    }
    return Mr2;
  };
  function eu(e2, t2, n2) {
    return e2 >>>= 0, t2 = eo2(t2 >>> 0, n2 >>> 0), jr2[e2](...t2);
  }
  function tu(e2, t2, n2) {
    return e2 >>>= 0, t2 = eo2(t2 >>> 0, n2 >>> 0), jr2[e2](...t2);
  }
  var ru = () => {
  };
  function nu(e2, t2) {
    return B2(ct2(e2 >>> 0, t2 >>> 0));
  }
  var ou = () => {
    throw G2 += 1, "unwind";
  };
  function au() {
    return 4294901760;
  }
  var su = () => 1, iu = () => navigator.hardwareConcurrency;
  function uu(e2) {
    e2 >>>= 0;
    var t2 = (p2(), J2).length;
    if (e2 <= t2 || 4294901760 < e2) return false;
    for (var n2 = 1; 4 >= n2; n2 *= 2) {
      var o2 = t2 * (1 + 0.2 / n2);
      o2 = Math.min(o2, e2 + 100663296);
      e: {
        o2 = (Math.min(4294901760, 65536 * Math.ceil(Math.max(e2, o2) / 65536)) - Fe2.buffer.byteLength + 65535) / 65536 | 0;
        try {
          Fe2.grow(o2), se2();
          var u2 = 1;
          break e;
        } catch {
        }
        u2 = void 0;
      }
      if (u2) return true;
    }
    return false;
  }
  var Ue2 = (e2) => {
    var t2 = _e2(e2) + 1, n2 = Gt2(t2);
    return Pe2(e2, n2, t2), n2;
  }, Ur2 = (e2, t2) => {
    (p2(), A2)[e2 >>> 2 >>> 0] = t2;
    var n2 = (p2(), A2)[e2 >>> 2 >>> 0];
    (p2(), A2)[e2 + 4 >>> 2 >>> 0] = (t2 - n2) / 4294967296;
  }, vt2 = (e2) => (p2(), A2)[e2 >>> 2 >>> 0] + 4294967296 * (p2(), x2)[e2 + 4 >>> 2 >>> 0], de2 = [], fu = (e2, t2) => {
    de2[e2 >>> 0] = t2;
  }, Re2 = [], kt2 = [], lt2 = (e2, t2) => {
    kt2[e2] = new Promise((n2) => t2.finally(() => n2(e2)));
  }, L2 = (e2) => {
    if (e2) return de2[e2 >>> 0];
  }, cu = (e2, t2) => {
    for (e2 = (p2(), A2)[e2 >>> 2 >>> 0]; e2; e2 = (p2(), A2)[e2 >>> 2 >>> 0]) t2[(p2(), x2)[e2 + 4 >>> 2 >>> 0]](e2);
  }, Wt2 = (e2, t2, n2) => {
    (p2(), A2)[e2 >>> 2 >>> 0] = t2, (p2(), A2)[e2 + 4 >>> 2 >>> 0] = n2;
  }, to2 = (e2) => {
    var t2 = (p2(), A2)[e2 >>> 2 >>> 0];
    return e2 = (p2(), A2)[e2 + 4 >>> 2 >>> 0], ct2(t2, e2);
  }, Ne2 = (e2) => {
    var t2 = (p2(), A2)[e2 >>> 2 >>> 0];
    return e2 = (p2(), A2)[e2 + 4 >>> 2 >>> 0], t2 ? ct2(t2, e2) : e2 === 0 ? "" : void 0;
  }, du = (e2) => {
    var t2 = Ne2(e2 + 4), n2 = (n2 = (p2(), A2)[e2 + 12 >>> 2 >>> 0]) ? L2(n2) : "auto";
    if (e2 += 16) {
      var o2 = L2((p2(), A2)[e2 + 4 >>> 2 >>> 0]), u2 = (p2(), A2)[e2 + 16 >>> 2 >>> 0], c2 = (p2(), A2)[e2 + 20 >>> 2 >>> 0];
      if (u2) {
        for (var h2 = {}, b2 = 0; b2 < u2; ++b2) {
          var E2 = c2 + 24 * b2;
          h2[to2(E2 + 4)] = (p2(), ae2)[E2 + 16 >>> 3 >>> 0];
        }
        u2 = h2;
      } else u2 = void 0;
      e2 = { module: o2, constants: u2, entryPoint: Ne2(e2 + 8) };
    } else e2 = void 0;
    return { label: t2, layout: n2, compute: e2 };
  }, ro2 = (e2, t2) => {
    function n2(o2, u2) {
      o2 = e2[o2], (p2(), A2)[t2 + u2 >>> 2 >>> 0] = o2;
    }
    n2("maxTextureDimension1D", 4), n2("maxTextureDimension2D", 8), n2("maxTextureDimension3D", 12), n2("maxTextureArrayLayers", 16), n2("maxBindGroups", 20), n2("maxBindGroupsPlusVertexBuffers", 24), n2("maxBindingsPerBindGroup", 28), n2("maxDynamicUniformBuffersPerPipelineLayout", 32), n2("maxDynamicStorageBuffersPerPipelineLayout", 36), n2("maxSampledTexturesPerShaderStage", 40), n2("maxSamplersPerShaderStage", 44), n2("maxStorageBuffersPerShaderStage", 48), n2("maxStorageTexturesPerShaderStage", 52), n2("maxUniformBuffersPerShaderStage", 56), n2("minUniformBufferOffsetAlignment", 80), n2("minStorageBufferOffsetAlignment", 84), Ur2(t2 + 64, e2.maxUniformBufferBindingSize), Ur2(t2 + 72, e2.maxStorageBufferBindingSize), n2("maxVertexBuffers", 88), Ur2(t2 + 96, e2.maxBufferSize), n2("maxVertexAttributes", 104), n2("maxVertexBufferArrayStride", 108), n2("maxInterStageShaderVariables", 112), n2("maxColorAttachments", 116), n2("maxColorAttachmentBytesPerSample", 120), n2("maxComputeWorkgroupStorageSize", 124), n2("maxComputeInvocationsPerWorkgroup", 128), n2("maxComputeWorkgroupSizeX", 132), n2("maxComputeWorkgroupSizeY", 136), n2("maxComputeWorkgroupSizeZ", 140), n2("maxComputeWorkgroupsPerDimension", 144), e2.Be !== void 0 && n2("maxImmediateSize", 148);
  }, lu = [, "validation", "out-of-memory", "internal"], pu = [, "compatibility", "core"], no2 = { 1: "core-features-and-limits", 2: "depth-clip-control", 3: "depth32float-stencil8", 4: "texture-compression-bc", 5: "texture-compression-bc-sliced-3d", 6: "texture-compression-etc2", 7: "texture-compression-astc", 8: "texture-compression-astc-sliced-3d", 9: "timestamp-query", 10: "indirect-first-instance", 11: "shader-f16", 12: "rg11b10ufloat-renderable", 13: "bgra8unorm-storage", 14: "float32-filterable", 15: "float32-blendable", 16: "clip-distances", 17: "dual-source-blending", 18: "subgroups", 19: "texture-formats-tier1", 20: "texture-formats-tier2", 21: "primitive-index", 22: "texture-component-swizzle", 327692: "chromium-experimental-unorm16-texture-formats", 327729: "chromium-experimental-multi-draw-indirect" }, mu = [, "low-power", "high-performance"], hu = [, "occlusion", "timestamp"], yu = { undefined: 1, unknown: 1, destroyed: 2 };
  function bu(e2, t2, n2, o2, u2, c2) {
    t2 = ce2(t2), n2 = ce2(n2), o2 >>>= 0, u2 >>>= 0, c2 >>>= 0;
    var h2 = L2(e2 >>> 0);
    if (e2 = {}, c2) {
      var b2 = (p2(), A2)[c2 + 12 >>> 2 >>> 0];
      if (b2) {
        var E2 = (p2(), A2)[c2 + 16 >>> 2 >>> 0];
        e2.requiredFeatures = Array.from((p2(), A2).subarray(E2 >>> 2 >>> 0, E2 + 4 * b2 >>> 2 >>> 0), (O2) => no2[O2]);
      }
      var I2 = (p2(), A2)[c2 + 20 >>> 2 >>> 0];
      if (I2) {
        let O2 = function(ye2, fe2, Ze2 = false) {
          fe2 = I2 + fe2, (fe2 = (p2(), A2)[fe2 >>> 2 >>> 0]) == 4294967295 || Ze2 && fe2 == 0 || (F2[ye2] = fe2);
        }, ue2 = function(ye2, fe2) {
          fe2 = I2 + fe2;
          var Ze2 = (p2(), A2)[fe2 >>> 2 >>> 0], Vf = (p2(), A2)[fe2 + 4 >>> 2 >>> 0];
          Ze2 == 4294967295 && Vf == 4294967295 || (F2[ye2] = vt2(fe2));
        };
        var j2 = O2, te2 = ue2, F2 = {};
        O2("maxTextureDimension1D", 4), O2("maxTextureDimension2D", 8), O2("maxTextureDimension3D", 12), O2("maxTextureArrayLayers", 16), O2("maxBindGroups", 20), O2("maxBindGroupsPlusVertexBuffers", 24), O2("maxDynamicUniformBuffersPerPipelineLayout", 32), O2("maxDynamicStorageBuffersPerPipelineLayout", 36), O2("maxSampledTexturesPerShaderStage", 40), O2("maxSamplersPerShaderStage", 44), O2("maxStorageBuffersPerShaderStage", 48), O2("maxStorageTexturesPerShaderStage", 52), O2("maxUniformBuffersPerShaderStage", 56), O2("minUniformBufferOffsetAlignment", 80), O2("minStorageBufferOffsetAlignment", 84), ue2("maxUniformBufferBindingSize", 64), ue2("maxStorageBufferBindingSize", 72), O2("maxVertexBuffers", 88), ue2("maxBufferSize", 96), O2("maxVertexAttributes", 104), O2("maxVertexBufferArrayStride", 108), O2("maxInterStageShaderVariables", 112), O2("maxColorAttachments", 116), O2("maxColorAttachmentBytesPerSample", 120), O2("maxComputeWorkgroupStorageSize", 124), O2("maxComputeInvocationsPerWorkgroup", 128), O2("maxComputeWorkgroupSizeX", 132), O2("maxComputeWorkgroupSizeY", 136), O2("maxComputeWorkgroupSizeZ", 140), O2("maxComputeWorkgroupsPerDimension", 144), O2("maxImmediateSize", 148, true), e2.requiredLimits = F2;
      }
      (b2 = (p2(), A2)[c2 + 24 >>> 2 >>> 0]) && (b2 = { label: Ne2(b2 + 4) }, e2.defaultQueue = b2), e2.label = Ne2(c2 + 4);
    }
    G2 += 1, lt2(t2, h2.requestDevice(e2).then((O2) => {
      --G2, he2(() => {
        de2[u2 >>> 0] = O2.queue, de2[o2 >>> 0] = O2, G2 += 1, lt2(n2, O2.lost.then((ue2) => {
          he2(() => {
            O2.onuncapturederror = () => {
            };
            var ye2 = P2(), fe2 = Ue2(ue2.message);
            Rr2(n2, yu[ue2.reason], fe2), D2(ye2);
          }), --G2;
        })), O2.onuncapturederror = (ue2) => {
          var ye2 = 5;
          ue2.error instanceof GPUValidationError ? ye2 = 2 : ue2.error instanceof GPUOutOfMemoryError ? ye2 = 3 : ue2.error instanceof GPUInternalError && (ye2 = 4);
          var fe2 = P2();
          ue2 = Ue2(ue2.error.message), Io2(o2, ye2, ue2), D2(fe2);
        }, "adapterInfo" in O2 || (O2.adapterInfo = h2.info), Wr2(t2, 1, o2, 0);
      });
    }, (O2) => {
      --G2, he2(() => {
        var ue2 = P2(), ye2 = Ue2(O2.message);
        Wr2(t2, 3, o2, ye2), n2 && Rr2(n2, 4, ye2), D2(ue2);
      });
    }));
  }
  function wu(e2) {
    var t2 = L2(e2 >>>= 0), n2 = Re2[e2];
    if (n2) {
      for (var o2 = 0; o2 < n2.length; ++o2) n2[o2]();
      delete Re2[e2];
    }
    t2.destroy();
  }
  function gu(e2, t2, n2) {
    n2 >>>= 0;
    var o2 = L2(e2 >>>= 0);
    n2 == 4294967295 && (n2 = void 0);
    try {
      var u2 = o2.getMappedRange(t2 >>> 0, n2);
    } catch {
      return 0;
    }
    var c2 = $r2(16, u2.byteLength);
    return (p2(), J2).set(new Uint8Array(u2), c2 >>> 0), Re2[e2].push(() => xe2(c2)), c2;
  }
  function Tu(e2, t2, n2) {
    n2 >>>= 0;
    var o2 = L2(e2 >>>= 0);
    n2 == 4294967295 && (n2 = void 0);
    try {
      var u2 = o2.getMappedRange(t2 >>> 0, n2);
    } catch {
      return 0;
    }
    var c2 = $r2(16, u2.byteLength);
    return (p2(), J2).fill(0, c2, u2.byteLength), Re2[e2].push(() => {
      new Uint8Array(u2).set((p2(), J2).subarray(c2 >>> 0, c2 + u2.byteLength >>> 0)), xe2(c2);
    }), c2;
  }
  function vu(e2, t2, n2, o2, u2) {
    e2 >>>= 0, t2 = ce2(t2), n2 = ce2(n2), u2 >>>= 0;
    var c2 = L2(e2);
    Re2[e2] = [], u2 == 4294967295 && (u2 = void 0), G2 += 1, lt2(t2, c2.mapAsync(n2, o2 >>> 0, u2).then(() => {
      --G2, he2(() => {
        Nr2(t2, 1, 0);
      });
    }, (h2) => {
      --G2, he2(() => {
        P2();
        var b2 = Ue2(h2.message);
        Nr2(t2, h2.name === "AbortError" ? 4 : h2.name === "OperationError" ? 3 : 0, b2), delete Re2[e2];
      });
    }));
  }
  function Eu(e2) {
    var t2 = L2(e2 >>>= 0), n2 = Re2[e2];
    if (n2) {
      for (var o2 = 0; o2 < n2.length; ++o2) n2[o2]();
      delete Re2[e2], t2.unmap();
    }
  }
  function Su(e2) {
    delete de2[e2 >>> 0];
  }
  function Au(e2, t2, n2) {
    e2 >>>= 0, t2 >>>= 0, n2 >>>= 0;
    var o2 = !!(p2(), A2)[t2 + 32 >>> 2 >>> 0];
    t2 = { label: Ne2(t2 + 4), usage: (p2(), A2)[t2 + 16 >>> 2 >>> 0], size: vt2(t2 + 24), mappedAtCreation: o2 }, e2 = L2(e2);
    try {
      var u2 = e2.createBuffer(t2);
    } catch {
      return false;
    }
    return de2[n2 >>> 0] = u2, o2 && (Re2[n2] = []), true;
  }
  function Iu(e2, t2, n2, o2) {
    e2 >>>= 0, t2 = ce2(t2), o2 >>>= 0, n2 = du(n2 >>> 0), e2 = L2(e2), G2 += 1, lt2(t2, e2.createComputePipelineAsync(n2).then((u2) => {
      --G2, he2(() => {
        de2[o2 >>> 0] = u2, _r2(t2, 1, o2, 0);
      });
    }, (u2) => {
      --G2, he2(() => {
        var c2 = P2(), h2 = Ue2(u2.message);
        _r2(t2, u2.reason === "validation" ? 3 : u2.reason === "internal" ? 4 : 0, o2, h2), D2(c2);
      });
    }));
  }
  function xu(e2, t2, n2) {
    e2 >>>= 0, t2 >>>= 0, n2 >>>= 0;
    var o2 = (p2(), A2)[t2 >>> 2 >>> 0], u2 = (p2(), x2)[o2 + 4 >>> 2 >>> 0];
    t2 = { label: Ne2(t2 + 4), code: "" }, u2 === 2 && (t2.code = to2(o2 + 8)), e2 = L2(e2).createShaderModule(t2), de2[n2 >>> 0] = e2;
  }
  var Lu = (e2) => {
    (e2 = L2(e2)).onuncapturederror = null, e2.destroy();
  };
  function Bu(e2, t2) {
    t2 = ce2(t2), e2 = L2(e2 >>> 0), G2 += 1, lt2(t2, e2.popErrorScope().then((n2) => {
      --G2, he2(() => {
        var o2 = 5;
        n2 ? n2 instanceof GPUValidationError ? o2 = 2 : n2 instanceof GPUOutOfMemoryError ? o2 = 3 : n2 instanceof GPUInternalError && (o2 = 4) : o2 = 1;
        var u2 = P2(), c2 = n2 ? Ue2(n2.message) : 0;
        kr2(t2, 1, o2, c2), D2(u2);
      });
    }, (n2) => {
      --G2, he2(() => {
        var o2 = P2(), u2 = Ue2(n2.message);
        kr2(t2, 1, 5, u2), D2(o2);
      });
    }));
  }
  function Ou(e2, t2, n2, o2) {
    if (t2 = ce2(t2), o2 >>>= 0, n2 >>>= 0) {
      var u2 = { featureLevel: pu[(p2(), x2)[n2 + 4 >>> 2 >>> 0]], powerPreference: mu[(p2(), x2)[n2 + 8 >>> 2 >>> 0]], forceFallbackAdapter: !!(p2(), A2)[n2 + 12 >>> 2 >>> 0] };
      (e2 = (p2(), A2)[n2 >>> 2 >>> 0]) !== 0 && (p2(), u2.Fe = !!(p2(), A2)[e2 + 8 >>> 2 >>> 0]);
    }
    "gpu" in navigator ? (G2 += 1, lt2(t2, navigator.gpu.requestAdapter(u2).then((c2) => {
      --G2, he2(() => {
        if (c2) de2[o2 >>> 0] = c2, Et2(t2, 1, o2, 0);
        else {
          var h2 = P2(), b2 = Ue2("WebGPU not available on this browser (requestAdapter returned null)");
          Et2(t2, 3, o2, b2), D2(h2);
        }
      });
    }, (c2) => {
      --G2, he2(() => {
        var h2 = P2(), b2 = Ue2(c2.message);
        Et2(t2, 4, o2, b2), D2(h2);
      });
    }))) : (u2 = P2(), e2 = Ue2("WebGPU not available on this browser (navigator.gpu is not available)"), Et2(t2, 3, o2, e2), D2(u2));
  }
  function Mu(e2, t2, n2) {
    return e2 >>>= 0, t2 >>>= 0, n2 >>>= 0, Hn2(async () => {
      var o2 = [];
      if (n2) {
        var u2 = (p2(), x2)[n2 >>> 2 >>> 0];
        o2.length = t2 + 1, o2[t2] = new Promise((b2) => setTimeout(b2, u2, 0));
      } else o2.length = t2;
      for (var c2 = 0; c2 < t2; ++c2) {
        var h2 = vt2(e2 + 8 * c2);
        if (!(h2 in kt2)) return h2;
        o2[c2] = kt2[h2];
      }
      return o2 = await Promise.race(o2), delete kt2[o2], o2;
    });
  }
  var Cr2, Dr2 = {}, oo2 = () => {
    if (!Cr2) {
      var e2, t2 = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: "./this.program" };
      for (e2 in Dr2) Dr2[e2] === void 0 ? delete t2[e2] : t2[e2] = Dr2[e2];
      var n2 = [];
      for (e2 in t2) n2.push(`${e2}=${t2[e2]}`);
      Cr2 = n2;
    }
    return Cr2;
  };
  function ao2(e2, t2) {
    if (i2) return V2(19, 1, e2, t2);
    e2 >>>= 0, t2 >>>= 0;
    var n2, o2 = 0, u2 = 0;
    for (n2 of oo2()) {
      var c2 = t2 + o2;
      (p2(), A2)[e2 + u2 >>> 2 >>> 0] = c2, o2 += Pe2(n2, c2, 1 / 0) + 1, u2 += 4;
    }
    return 0;
  }
  function so2(e2, t2) {
    if (i2) return V2(20, 1, e2, t2);
    e2 >>>= 0, t2 >>>= 0;
    var n2 = oo2();
    for (var o2 of ((p2(), A2)[e2 >>> 2 >>> 0] = n2.length, e2 = 0, n2)) e2 += _e2(o2) + 1;
    return (p2(), A2)[t2 >>> 2 >>> 0] = e2, 0;
  }
  function io2(e2) {
    return i2 ? V2(21, 1, e2) : 52;
  }
  function uo2(e2, t2, n2, o2) {
    return i2 ? V2(22, 1, e2, t2, n2, o2) : 52;
  }
  function fo2(e2, t2, n2, o2) {
    return i2 ? V2(23, 1, e2, t2, n2, o2) : 70;
  }
  var Uu = [null, [], []];
  function co2(e2, t2, n2, o2) {
    if (i2) return V2(24, 1, e2, t2, n2, o2);
    t2 >>>= 0, n2 >>>= 0, o2 >>>= 0;
    for (var u2 = 0, c2 = 0; c2 < n2; c2++) {
      var h2 = (p2(), A2)[t2 >>> 2 >>> 0], b2 = (p2(), A2)[t2 + 4 >>> 2 >>> 0];
      t2 += 8;
      for (var E2 = 0; E2 < b2; E2++) {
        var I2 = e2, F2 = (p2(), J2)[h2 + E2 >>> 0], j2 = Uu[I2];
        F2 === 0 || F2 === 10 ? ((I2 === 1 ? q2 : B2)(xn2(j2)), j2.length = 0) : j2.push(F2);
      }
      u2 += b2;
    }
    return (p2(), A2)[o2 >>> 2 >>> 0] = u2, 0;
  }
  function Cu(e2) {
    return e2 >>> 0;
  }
  function Du(e2, t2) {
    return ro2(L2(e2 >>> 0).limits, t2 >>> 0), 1;
  }
  function Pu(e2, t2) {
    return L2(e2 >>> 0).features.has(no2[t2]);
  }
  function _u(e2) {
    return BigInt(L2(e2 >>> 0).size);
  }
  function Ru(e2) {
    return BigInt(L2(e2 >>> 0).usage);
  }
  function Nu(e2, t2) {
    if (e2 >>>= 0, t2 >>>= 0) {
      var n2 = Ne2(t2 + 4);
      n2 = { label: n2, timestampWrites: t2 = (t2 = (p2(), A2)[t2 + 12 >>> 2 >>> 0]) !== 0 ? { querySet: L2((p2(), A2)[t2 + 4 >>> 2 >>> 0]), beginningOfPassWriteIndex: (p2(), A2)[t2 + 8 >>> 2 >>> 0], endOfPassWriteIndex: (p2(), A2)[t2 + 12 >>> 2 >>> 0] } : void 0 };
    }
    return t2 = L2(e2), e2 = To2(0), n2 = t2.beginComputePass(n2), de2[e2 >>> 0] = n2, e2;
  }
  function ku(e2, t2, n2, o2) {
    n2 = ce2(n2), (o2 = ce2(o2)) == -1 && (o2 = void 0), (e2 = L2(e2 >>> 0)).clearBuffer(L2(t2 >>> 0), n2, o2);
  }
  function Wu(e2, t2, n2, o2, u2, c2) {
    n2 = ce2(n2), u2 = ce2(u2), c2 = ce2(c2), L2(e2 >>> 0).copyBufferToBuffer(L2(t2 >>> 0), n2, L2(o2 >>> 0), u2, c2);
  }
  function Fu(e2) {
    var t2 = L2(e2 >>> 0);
    return e2 = wo2(0), t2 = t2.finish(), de2[e2 >>> 0] = t2, e2;
  }
  function Gu(e2, t2, n2, o2, u2, c2) {
    c2 = ce2(c2), L2(e2 >>> 0).resolveQuerySet(L2(t2 >>> 0), n2, o2, L2(u2 >>> 0), c2);
  }
  function $u(e2, t2, n2, o2) {
    L2(e2 >>> 0).dispatchWorkgroups(t2, n2, o2);
  }
  function zu(e2, t2, n2) {
    n2 = ce2(n2), L2(e2 >>> 0).dispatchWorkgroupsIndirect(L2(t2 >>> 0), n2);
  }
  function Vu(e2) {
    L2(e2 >>> 0).end();
  }
  function ju(e2, t2, n2, o2, u2) {
    o2 >>>= 0, u2 >>>= 0, e2 = L2(e2 >>> 0), n2 = L2(n2 >>> 0), o2 == 0 ? e2.setBindGroup(t2, n2) : e2.setBindGroup(t2, n2, (p2(), A2), u2 >>> 2, o2);
  }
  function Hu(e2, t2) {
    L2(e2 >>> 0).setPipeline(L2(t2 >>> 0));
  }
  function qu(e2, t2, n2) {
    L2(e2 >>> 0).Ee(L2(t2 >>> 0), n2);
  }
  function Yu(e2, t2) {
    var n2 = L2(e2 >>> 0);
    return e2 = bo2(0), t2 = n2.getBindGroupLayout(t2), de2[e2 >>> 0] = t2, e2;
  }
  function Ju(e2, t2) {
    function n2(u2) {
      var c2 = (p2(), A2)[u2 + 8 >>> 2 >>> 0], h2 = (p2(), A2)[u2 + 32 >>> 2 >>> 0], b2 = (p2(), A2)[u2 + 36 >>> 2 >>> 0], E2 = 0;
      return cu(u2, { 327681: (I2) => {
        E2 = (p2(), A2)[I2 + 8 >>> 2 >>> 0];
      } }), c2 ? ((h2 = vt2(u2 + 24)) == -1 && (h2 = void 0), c2 = { buffer: L2(c2), offset: vt2(u2 + 16), size: h2 }) : c2 = L2(h2 || b2 || E2), { binding: (p2(), A2)[u2 + 4 >>> 2 >>> 0], resource: c2 };
    }
    e2 >>>= 0, t2 = { label: Ne2((t2 >>>= 0) + 4), layout: L2((p2(), A2)[t2 + 12 >>> 2 >>> 0]), entries: (function(u2, c2) {
      for (var h2 = [], b2 = 0; b2 < u2; ++b2) h2.push(n2(c2 + 40 * b2));
      return h2;
    })((p2(), A2)[t2 + 16 >>> 2 >>> 0], (p2(), A2)[t2 + 20 >>> 2 >>> 0]) }, e2 = L2(e2);
    var o2 = yo2(0);
    return fu(o2, e2.createBindGroup(t2)), o2;
  }
  function Xu(e2, t2) {
    var n2;
    return e2 >>>= 0, (t2 >>>= 0) && (n2 = { label: Ne2(t2 + 4) }), t2 = L2(e2), e2 = go2(0), n2 = t2.createCommandEncoder(n2), de2[e2 >>> 0] = n2, e2;
  }
  function Zu(e2, t2) {
    e2 >>>= 0, t2 >>>= 0, t2 = { type: hu[(p2(), x2)[t2 + 12 >>> 2 >>> 0]], count: (p2(), A2)[t2 + 16 >>> 2 >>> 0] };
    var n2 = L2(e2);
    return e2 = vo2(0), t2 = n2.createQuerySet(t2), de2[e2 >>> 0] = t2, e2;
  }
  function Ku(e2, t2) {
    e2 = L2(e2 >>> 0).adapterInfo, t2 >>>= 0, (p2(), A2)[t2 + 52 >>> 2 >>> 0] = e2.subgroupMinSize, (p2(), A2)[t2 + 56 >>> 2 >>> 0] = e2.subgroupMaxSize;
    var n2 = e2.vendor + e2.architecture + e2.device + e2.description, o2 = _e2(n2) + 1, u2 = pt2(o2);
    return u2 && Pe2(n2, u2, o2), n2 = u2, o2 = _e2(e2.vendor), Wt2(t2 + 4, n2, o2), n2 += o2, o2 = _e2(e2.architecture), Wt2(t2 + 12, n2, o2), n2 += o2, o2 = _e2(e2.device), Wt2(t2 + 20, n2, o2), Wt2(t2 + 28, n2 + o2, _e2(e2.description)), (p2(), x2)[t2 + 36 >>> 2 >>> 0] = 2, e2 = e2.isFallbackAdapter ? 3 : 4, (p2(), x2)[t2 + 40 >>> 2 >>> 0] = e2, (p2(), A2)[t2 + 44 >>> 2 >>> 0] = 0, (p2(), A2)[t2 + 48 >>> 2 >>> 0] = 0, 1;
  }
  var Qu = { "core-features-and-limits": 1, "depth-clip-control": 2, "depth32float-stencil8": 3, "texture-compression-bc": 4, "texture-compression-bc-sliced-3d": 5, "texture-compression-etc2": 6, "texture-compression-astc": 7, "texture-compression-astc-sliced-3d": 8, "timestamp-query": 9, "indirect-first-instance": 10, "shader-f16": 11, "rg11b10ufloat-renderable": 12, "bgra8unorm-storage": 13, "float32-filterable": 14, "float32-blendable": 15, "clip-distances": 16, "dual-source-blending": 17, subgroups: 18, "texture-formats-tier1": 19, "texture-formats-tier2": 20, "primitive-index": 21, "texture-component-swizzle": 22, "chromium-experimental-unorm16-texture-formats": 327692, "chromium-experimental-multi-draw-indirect": 327729 };
  function ef(e2, t2) {
    t2 >>>= 0;
    var n2 = L2(e2 >>> 0);
    e2 = pt2(4 * n2.features.size);
    var o2 = 0, u2 = 0;
    for (let c2 of n2.features) 0 <= (n2 = Qu[c2]) && ((p2(), x2)[e2 + o2 >>> 2 >>> 0] = n2, o2 += 4, u2++);
    (p2(), A2)[t2 + 4 >>> 2 >>> 0] = e2, (p2(), A2)[t2 >>> 2 >>> 0] = u2;
  }
  function tf(e2, t2) {
    return ro2(L2(e2 >>> 0).limits, t2 >>> 0), 1;
  }
  function rf(e2, t2) {
    L2(e2 >>> 0).pushErrorScope(lu[t2]);
  }
  function nf(e2, t2, n2) {
    t2 >>>= 0, n2 >>>= 0, e2 = L2(e2 >>> 0), t2 = Array.from((p2(), x2).subarray(n2 >>> 2 >>> 0, n2 + 4 * t2 >>> 2 >>> 0), (o2) => L2(o2)), e2.submit(t2);
  }
  function of(e2, t2, n2, o2, u2) {
    n2 = ce2(n2), o2 >>>= 0, u2 >>>= 0, e2 = L2(e2 >>> 0), t2 = L2(t2 >>> 0), o2 = (p2(), J2).subarray(o2 >>> 0, o2 + u2 >>> 0), e2.writeBuffer(t2, n2, o2, 0, u2);
  }
  i2 || (function() {
    for (var e2 = r2.numThreads - 1; e2--; ) gn2();
    Ae2.push(async () => {
      var t2 = (async function() {
        if (!i2) return Promise.all(We2.map(wn2));
      })();
      Be2++, await t2, --Be2 == 0 && ee2 && (t2 = ee2, ee2 = null, t2());
    });
  })(), i2 || (Fe2 = new WebAssembly.Memory({ initial: 256, maximum: 65536, shared: true }), se2()), r2.wasmBinary && (g2 = r2.wasmBinary), r2.stackSave = () => P2(), r2.stackRestore = (e2) => D2(e2), r2.stackAlloc = (e2) => Gt2(e2), r2.setValue = function(e2, t2, n2 = "i8") {
    switch (n2.endsWith("*") && (n2 = "*"), n2) {
      case "i1":
      case "i8":
        (p2(), X2)[e2 >>> 0] = t2;
        break;
      case "i16":
        (p2(), Ce2)[e2 >>> 1 >>> 0] = t2;
        break;
      case "i32":
        (p2(), x2)[e2 >>> 2 >>> 0] = t2;
        break;
      case "i64":
        (p2(), me2)[e2 >>> 3 >>> 0] = BigInt(t2);
        break;
      case "float":
        (p2(), _2)[e2 >>> 2 >>> 0] = t2;
        break;
      case "double":
        (p2(), ae2)[e2 >>> 3 >>> 0] = t2;
        break;
      case "*":
        (p2(), A2)[e2 >>> 2 >>> 0] = t2;
        break;
      default:
        Te2(`invalid type for setValue: ${n2}`);
    }
  }, r2.getValue = function(e2, t2 = "i8") {
    switch (t2.endsWith("*") && (t2 = "*"), t2) {
      case "i1":
      case "i8":
        return (p2(), X2)[e2 >>> 0];
      case "i16":
        return (p2(), Ce2)[e2 >>> 1 >>> 0];
      case "i32":
        return (p2(), x2)[e2 >>> 2 >>> 0];
      case "i64":
        return (p2(), me2)[e2 >>> 3 >>> 0];
      case "float":
        return (p2(), _2)[e2 >>> 2 >>> 0];
      case "double":
        return (p2(), ae2)[e2 >>> 3 >>> 0];
      case "*":
        return (p2(), A2)[e2 >>> 2 >>> 0];
      default:
        Te2(`invalid type for getValue: ${t2}`);
    }
  }, r2.UTF8ToString = ct2, r2.stringToUTF8 = Pe2, r2.lengthBytesUTF8 = _e2;
  var lo2, po2, Pr2, Ft2, xe2, pt2, mo2, ho2, yo2, bo2, wo2, go2, To2, vo2, Eo2, So2, Ao2, _r2, Rr2, Nr2, kr2, Et2, Wr2, Io2, Fr2, xo2, Lo2, Bo2, Gr2, Oo2, Mo2, $r2, N2, St2, Uo2, D2, Gt2, P2, Co2, zr2, Do2, Po2, _o2, Vr2, Ro2, No2, ko2, Wo2, Fo2, Go2, $o2, zo2, Vo2, jo2, Ho2, qo2, Yo2, Jo2, Xo2, Zo2, Ko2, Qo2, ea2, ta2, ra2, na2, oa2, aa2, sa2, ia2, ua2, fa2, ca2, da2, la2, pa2, ma2, ha2, ya2, ba2, wa2, ga2, Ta2, ke2, af = [Ye2, br2, En2, Ln2, Bn2, On2, Mn2, Un2, Cn2, Dn2, Pn2, _n2, Rn2, Nn2, kn2, Wn2, Zn2, Kn2, Qn2, ao2, so2, io2, uo2, fo2, co2], jr2 = { 1028716: (e2, t2, n2, o2, u2) => {
    if (r2 === void 0 || !r2.Vc) return 1;
    if ((e2 = ct2(Number(e2 >>> 0))).startsWith("./") && (e2 = e2.substring(2)), !(e2 = r2.Vc.get(e2))) return 2;
    if (t2 = Number(t2 >>> 0), n2 = Number(n2 >>> 0), o2 = Number(o2 >>> 0), t2 + n2 > e2.byteLength) return 3;
    try {
      let c2 = e2.subarray(t2, t2 + n2);
      switch (u2) {
        case 0:
          (p2(), J2).set(c2, o2 >>> 0);
          break;
        case 1:
          r2.bd ? r2.bd(o2, c2) : r2.pe(o2, c2);
          break;
        default:
          return 4;
      }
      return 0;
    } catch {
      return 4;
    }
  }, 1029540: (e2, t2, n2) => {
    r2.Td(e2, (p2(), J2).subarray(t2 >>> 0, t2 + n2 >>> 0));
  }, 1029604: () => r2.ne(), 1029646: (e2) => {
    r2.kd(e2);
  }, 1029683: () => typeof wasmOffsetConverter < "u" };
  function sf(e2, t2, n2, o2) {
    var u2 = P2();
    try {
      return zo2(e2, t2, n2, o2);
    } catch (c2) {
      if (D2(u2), c2 !== c2 + 0) throw c2;
      N2(1, 0);
    }
  }
  function uf(e2, t2, n2) {
    var o2 = P2();
    try {
      return Fo2(e2, t2, n2);
    } catch (u2) {
      if (D2(o2), u2 !== u2 + 0) throw u2;
      N2(1, 0);
    }
  }
  function ff(e2) {
    var t2 = P2();
    try {
      Ro2(e2);
    } catch (n2) {
      if (D2(t2), n2 !== n2 + 0) throw n2;
      N2(1, 0);
    }
  }
  function cf(e2, t2) {
    var n2 = P2();
    try {
      return Vr2(e2, t2);
    } catch (o2) {
      if (D2(n2), o2 !== o2 + 0) throw o2;
      N2(1, 0);
    }
  }
  function df(e2, t2, n2) {
    var o2 = P2();
    try {
      _o2(e2, t2, n2);
    } catch (u2) {
      if (D2(o2), u2 !== u2 + 0) throw u2;
      N2(1, 0);
    }
  }
  function lf(e2, t2) {
    var n2 = P2();
    try {
      Vo2(e2, t2);
    } catch (o2) {
      if (D2(n2), o2 !== o2 + 0) throw o2;
      N2(1, 0);
    }
  }
  function pf(e2, t2, n2, o2, u2, c2, h2) {
    var b2 = P2();
    try {
      return Wo2(e2, t2, n2, o2, u2, c2, h2);
    } catch (E2) {
      if (D2(b2), E2 !== E2 + 0) throw E2;
      N2(1, 0);
    }
  }
  function mf(e2, t2, n2, o2, u2, c2) {
    var h2 = P2();
    try {
      No2(e2, t2, n2, o2, u2, c2);
    } catch (b2) {
      if (D2(h2), b2 !== b2 + 0) throw b2;
      N2(1, 0);
    }
  }
  function hf(e2, t2, n2, o2) {
    var u2 = P2();
    try {
      $o2(e2, t2, n2, o2);
    } catch (c2) {
      if (D2(u2), c2 !== c2 + 0) throw c2;
      N2(1, 0);
    }
  }
  function yf(e2, t2, n2, o2, u2, c2, h2) {
    var b2 = P2();
    try {
      Ho2(e2, t2, n2, o2, u2, c2, h2);
    } catch (E2) {
      if (D2(b2), E2 !== E2 + 0) throw E2;
      N2(1, 0);
    }
  }
  function bf(e2, t2, n2, o2, u2, c2, h2) {
    var b2 = P2();
    try {
      qo2(e2, t2, n2, o2, u2, c2, h2);
    } catch (E2) {
      if (D2(b2), E2 !== E2 + 0) throw E2;
      N2(1, 0);
    }
  }
  function wf(e2, t2, n2, o2, u2, c2, h2, b2) {
    var E2 = P2();
    try {
      ra2(e2, t2, n2, o2, u2, c2, h2, b2);
    } catch (I2) {
      if (D2(E2), I2 !== I2 + 0) throw I2;
      N2(1, 0);
    }
  }
  function gf(e2, t2, n2, o2, u2, c2, h2, b2, E2, I2, F2, j2) {
    var te2 = P2();
    try {
      Yo2(e2, t2, n2, o2, u2, c2, h2, b2, E2, I2, F2, j2);
    } catch (O2) {
      if (D2(te2), O2 !== O2 + 0) throw O2;
      N2(1, 0);
    }
  }
  function Tf(e2, t2, n2, o2, u2) {
    var c2 = P2();
    try {
      return jo2(e2, t2, n2, o2, u2);
    } catch (h2) {
      if (D2(c2), h2 !== h2 + 0) throw h2;
      N2(1, 0);
    }
  }
  function vf(e2, t2, n2, o2, u2, c2) {
    var h2 = P2();
    try {
      na2(e2, t2, n2, o2, u2, c2);
    } catch (b2) {
      if (D2(h2), b2 !== b2 + 0) throw b2;
      N2(1, 0);
    }
  }
  function Ef(e2, t2, n2, o2, u2) {
    var c2 = P2();
    try {
      ko2(e2, t2, n2, o2, u2);
    } catch (h2) {
      if (D2(c2), h2 !== h2 + 0) throw h2;
      N2(1, 0);
    }
  }
  function Sf(e2, t2, n2, o2, u2, c2, h2, b2) {
    var E2 = P2();
    try {
      Go2(e2, t2, n2, o2, u2, c2, h2, b2);
    } catch (I2) {
      if (D2(E2), I2 !== I2 + 0) throw I2;
      N2(1, 0);
    }
  }
  function Af(e2) {
    var t2 = P2();
    try {
      return oa2(e2);
    } catch (n2) {
      if (D2(t2), n2 !== n2 + 0) throw n2;
      N2(1, 0);
    }
  }
  function If(e2, t2, n2) {
    var o2 = P2();
    try {
      return aa2(e2, t2, n2);
    } catch (u2) {
      if (D2(o2), u2 !== u2 + 0) throw u2;
      N2(1, 0);
    }
  }
  function xf(e2, t2) {
    var n2 = P2();
    try {
      return ya2(e2, t2);
    } catch (o2) {
      if (D2(n2), o2 !== o2 + 0) throw o2;
      return N2(1, 0), 0n;
    }
  }
  function Lf(e2) {
    var t2 = P2();
    try {
      return Jo2(e2);
    } catch (n2) {
      if (D2(t2), n2 !== n2 + 0) throw n2;
      return N2(1, 0), 0n;
    }
  }
  function Bf(e2, t2, n2, o2) {
    var u2 = P2();
    try {
      return sa2(e2, t2, n2, o2);
    } catch (c2) {
      if (D2(u2), c2 !== c2 + 0) throw c2;
      N2(1, 0);
    }
  }
  function Of(e2, t2, n2, o2, u2) {
    var c2 = P2();
    try {
      return ia2(e2, t2, n2, o2, u2);
    } catch (h2) {
      if (D2(c2), h2 !== h2 + 0) throw h2;
      N2(1, 0);
    }
  }
  function Mf(e2, t2, n2, o2, u2, c2) {
    var h2 = P2();
    try {
      return ua2(e2, t2, n2, o2, u2, c2);
    } catch (b2) {
      if (D2(h2), b2 !== b2 + 0) throw b2;
      N2(1, 0);
    }
  }
  function Uf(e2, t2, n2, o2, u2, c2) {
    var h2 = P2();
    try {
      return ea2(e2, t2, n2, o2, u2, c2);
    } catch (b2) {
      if (D2(h2), b2 !== b2 + 0) throw b2;
      N2(1, 0);
    }
  }
  function Cf(e2, t2, n2, o2, u2, c2) {
    var h2 = P2();
    try {
      return fa2(e2, t2, n2, o2, u2, c2);
    } catch (b2) {
      if (D2(h2), b2 !== b2 + 0) throw b2;
      N2(1, 0);
    }
  }
  function Df(e2, t2, n2, o2, u2, c2, h2, b2) {
    var E2 = P2();
    try {
      return ta2(e2, t2, n2, o2, u2, c2, h2, b2);
    } catch (I2) {
      if (D2(E2), I2 !== I2 + 0) throw I2;
      N2(1, 0);
    }
  }
  function Pf(e2, t2, n2, o2, u2) {
    var c2 = P2();
    try {
      return ca2(e2, t2, n2, o2, u2);
    } catch (h2) {
      if (D2(c2), h2 !== h2 + 0) throw h2;
      return N2(1, 0), 0n;
    }
  }
  function _f(e2, t2, n2, o2) {
    var u2 = P2();
    try {
      return da2(e2, t2, n2, o2);
    } catch (c2) {
      if (D2(u2), c2 !== c2 + 0) throw c2;
      N2(1, 0);
    }
  }
  function Rf(e2, t2, n2, o2) {
    var u2 = P2();
    try {
      return la2(e2, t2, n2, o2);
    } catch (c2) {
      if (D2(u2), c2 !== c2 + 0) throw c2;
      N2(1, 0);
    }
  }
  function Nf(e2, t2, n2, o2, u2, c2, h2, b2, E2, I2, F2, j2) {
    var te2 = P2();
    try {
      return pa2(e2, t2, n2, o2, u2, c2, h2, b2, E2, I2, F2, j2);
    } catch (O2) {
      if (D2(te2), O2 !== O2 + 0) throw O2;
      N2(1, 0);
    }
  }
  function kf(e2, t2, n2, o2, u2, c2, h2, b2, E2, I2, F2) {
    var j2 = P2();
    try {
      ma2(e2, t2, n2, o2, u2, c2, h2, b2, E2, I2, F2);
    } catch (te2) {
      if (D2(j2), te2 !== te2 + 0) throw te2;
      N2(1, 0);
    }
  }
  function Wf(e2, t2, n2, o2, u2, c2, h2, b2, E2, I2, F2, j2, te2, O2, ue2, ye2) {
    var fe2 = P2();
    try {
      ha2(e2, t2, n2, o2, u2, c2, h2, b2, E2, I2, F2, j2, te2, O2, ue2, ye2);
    } catch (Ze2) {
      if (D2(fe2), Ze2 !== Ze2 + 0) throw Ze2;
      N2(1, 0);
    }
  }
  function Ff(e2, t2, n2) {
    var o2 = P2();
    try {
      return Zo2(e2, t2, n2);
    } catch (u2) {
      if (D2(o2), u2 !== u2 + 0) throw u2;
      return N2(1, 0), 0n;
    }
  }
  function Gf(e2, t2, n2) {
    var o2 = P2();
    try {
      return Xo2(e2, t2, n2);
    } catch (u2) {
      if (D2(o2), u2 !== u2 + 0) throw u2;
      N2(1, 0);
    }
  }
  function $f(e2, t2, n2) {
    var o2 = P2();
    try {
      return Ko2(e2, t2, n2);
    } catch (u2) {
      if (D2(o2), u2 !== u2 + 0) throw u2;
      N2(1, 0);
    }
  }
  function zf(e2, t2, n2, o2) {
    var u2 = P2();
    try {
      Qo2(e2, t2, n2, o2);
    } catch (c2) {
      if (D2(u2), c2 !== c2 + 0) throw c2;
      N2(1, 0);
    }
  }
  function $t2() {
    if (0 < Be2) ee2 = $t2;
    else if (i2) U2?.(r2), yr2();
    else {
      for (var e2 = Ae2; 0 < e2.length; ) e2.shift()(r2);
      0 < Be2 ? ee2 = $t2 : (r2.calledRun = true, W2 || (yr2(), U2?.(r2)));
    }
  }
  return i2 || (ke2 = await bt2(), $t2()), r2.PTR_SIZE = 4, r2.webgpuInit = (e2) => {
    let t2 = /* @__PURE__ */ new WeakMap(), n2, o2, u2 = 1;
    r2.webgpuRegisterDevice = (b2) => {
      if (o2 !== void 0) throw Error("another WebGPU EP inference session is being created.");
      if (b2) {
        var E2 = t2.get(b2);
        if (!E2) {
          let I2 = ((F2, j2 = 0) => {
            var te2 = Ao2(j2);
            return j2 = So2(j2, te2), de2[te2 >>> 0] = F2.queue, de2[j2 >>> 0] = F2, j2;
          })(b2, E2 = ho2(0));
          E2 = [u2++, E2, I2], t2.set(b2, E2);
        }
        return n2 = b2, o2 = E2[0], E2;
      }
      n2 = void 0, o2 = 0;
    };
    let c2 = /* @__PURE__ */ new Map();
    r2.webgpuOnCreateSession = (b2) => {
      if (o2 !== void 0) {
        var E2 = o2;
        if (o2 = void 0, b2) {
          let I2 = Pr2(E2);
          c2.set(b2, I2), E2 === 0 && e2(n2 ?? L2(I2));
        }
        n2 = void 0;
      }
    }, r2.webgpuOnReleaseSession = (b2) => {
      c2.delete(b2);
    };
    let h2 = /* @__PURE__ */ Symbol("gpuBufferMetadata");
    r2.webgpuRegisterBuffer = (b2, E2, I2) => {
      if (I2) return b2[h2] = [I2, NaN], I2;
      if (I2 = b2[h2]) return I2[1]++, I2[0];
      if ((E2 = c2.get(E2)) === void 0) throw Error("Invalid session handle passed to webgpuRegisterBuffer");
      return E2 = ((F2, j2 = 0) => (F2.mapState === "unmapped" || Te2(), j2 = Eo2(j2), de2[j2 >>> 0] = F2, j2))(b2, E2), b2[h2] = [E2, 1], E2;
    }, r2.webgpuUnregisterBuffer = (b2) => {
      let E2 = b2[h2];
      if (!E2) throw Error("Buffer is not registered");
      E2[1]--, E2[1] === 0 && (mo2(E2[0]), delete b2[h2]);
    }, r2.webgpuGetBuffer = (b2) => L2(b2), r2.webgpuCreateDownloader = (b2, E2, I2) => {
      if ((I2 = c2.get(I2)) === void 0) throw Error("Invalid session handle passed to webgpuRegisterBuffer");
      let F2 = L2(I2), j2 = 16 * Math.ceil(Number(E2) / 16);
      return async () => {
        let te2 = F2.createBuffer({ size: j2, usage: 9 });
        try {
          let O2 = F2.createCommandEncoder();
          return O2.copyBufferToBuffer(b2, 0, te2, 0, j2), F2.queue.submit([O2.finish()]), await te2.mapAsync(GPUMapMode.READ), te2.getMappedRange().slice(0, E2);
        } finally {
          te2.destroy();
        }
      };
    }, r2.bd = (b2, E2) => {
      var I2 = E2.buffer;
      let F2 = E2.byteOffset, j2 = E2.byteLength;
      if (E2 = 16 * Math.ceil(Number(j2) / 16), b2 = L2(b2), !n2) {
        var te2 = Pr2(o2);
        n2 = L2(te2);
      }
      let O2 = (te2 = n2.createBuffer({ mappedAtCreation: true, size: E2, usage: 6 })).getMappedRange();
      new Uint8Array(O2).set(new Uint8Array(I2, F2, j2)), te2.unmap(), (I2 = n2.createCommandEncoder()).copyBufferToBuffer(te2, 0, b2, 0, E2), n2.queue.submit([I2.finish()]), te2.destroy();
    };
  }, r2.webnnInit = (e2) => {
    let t2 = e2[0];
    [r2.ne, r2.kd, r2.webnnEnsureTensor, r2.Td, r2.webnnDownloadTensor, r2.me, r2.webnnEnableTraceEvent] = e2.slice(1), r2.webnnReleaseTensorId = r2.kd, r2.webnnUploadTensor = r2.Td, r2.webnnRegisterMLContext = r2.me, r2.webnnOnRunStart = (n2) => t2.onRunStart(n2), r2.webnnOnRunEnd = t2.onRunEnd.bind(t2), r2.webnnOnReleaseSession = (n2) => {
      t2.onReleaseSession(n2);
    }, r2.webnnCreateMLTensorDownloader = (n2, o2) => t2.createMLTensorDownloader(n2, o2), r2.webnnRegisterMLTensor = (n2, o2, u2, c2) => t2.registerMLTensor(n2, o2, u2, c2), r2.webnnCreateMLContext = (n2) => t2.createMLContext(n2), r2.webnnRegisterMLConstant = (n2, o2, u2, c2, h2, b2) => t2.registerMLConstant(n2, o2, u2, c2, h2, r2.Vc, b2), r2.webnnRegisterGraphInput = t2.registerGraphInput.bind(t2), r2.webnnIsGraphInput = t2.isGraphInput.bind(t2), r2.webnnRegisterGraphOutput = t2.registerGraphOutput.bind(t2), r2.webnnIsGraphOutput = t2.isGraphOutput.bind(t2), r2.webnnCreateTemporaryTensor = t2.createTemporaryTensor.bind(t2), r2.webnnIsGraphInputOutputTypeSupported = t2.isGraphInputOutputTypeSupported.bind(t2);
  }, re2 ? r2 : new Promise((e2, t2) => {
    U2 = e2, R2 = t2;
  });
}
var Kf;
var Qf;
var ns2 = k2(() => {
  "use strict";
  Kf = ts2, Qf = globalThis.self?.name?.startsWith("em-pthread");
  Qf && ts2();
});
var ss2;
var rn2;
var ec2;
var ge2;
var is2;
var tn2;
var tc2;
var rc2;
var us2;
var nc2;
var os2;
var fs2;
var as2;
var cs2;
var Yt2 = k2(() => {
  "use strict";
  qt2();
  ss2 = typeof location > "u" ? void 0 : location.origin, rn2 = import.meta.url > "file:" && import.meta.url < "file;", ec2 = () => {
    if (true) {
      if (rn2) {
        let a2 = URL;
        return new URL(new a2("ort.webgpu.bundle.min.mjs", import.meta.url).href, ss2).href;
      }
      return import.meta.url;
    }
  }, ge2 = ec2(), is2 = () => {
    if (ge2 && !ge2.startsWith("blob:")) return ge2.substring(0, ge2.lastIndexOf("/") + 1);
  }, tn2 = (a2, r2) => {
    try {
      let s2 = r2 ?? ge2;
      return (s2 ? new URL(a2, s2) : new URL(a2)).origin === ss2;
    } catch {
      return false;
    }
  }, tc2 = (a2, r2) => {
    let s2 = r2 ?? ge2;
    try {
      return (s2 ? new URL(a2, s2) : new URL(a2)).href;
    } catch {
      return;
    }
  }, rc2 = (a2, r2) => `${r2 ?? "./"}${a2}`, us2 = async (a2) => {
    let s2 = await (await fetch(a2, { credentials: "same-origin" })).blob();
    return URL.createObjectURL(s2);
  }, nc2 = async (a2) => (await import(
    /*webpackIgnore:true*/
    /*@vite-ignore*/
    a2
  )).default, os2 = (es2(), zt2(Qa2)).default, fs2 = async () => {
    if (!ge2) throw new Error("Failed to load proxy worker: cannot determine the script source URL.");
    if (tn2(ge2)) return [void 0, os2()];
    let a2 = await us2(ge2);
    return [a2, os2(a2)];
  }, as2 = (ns2(), zt2(rs2)).default, cs2 = async (a2, r2, s2, f2) => {
    let i2 = as2 && !(a2 || r2);
    if (i2) if (ge2) i2 = tn2(ge2) || f2 && !s2;
    else if (f2 && !s2) i2 = true;
    else throw new Error("cannot determine the script source URL.");
    if (i2) return [void 0, as2];
    {
      let d2 = "ort-wasm-simd-threaded.asyncify.mjs", l2 = a2 ?? tc2(d2, r2), m2 = s2 && l2 && !tn2(l2, r2), y2 = m2 ? await us2(l2) : l2 ?? rc2(d2, r2);
      return [m2 ? y2 : void 0, await nc2(y2)];
    }
  };
});
var nn2;
var on2;
var nr2;
var ds2;
var oc2;
var ac2;
var sc2;
var Jt2;
var z2;
var je2 = k2(() => {
  "use strict";
  Yt2();
  on2 = false, nr2 = false, ds2 = false, oc2 = () => {
    if (typeof SharedArrayBuffer > "u") return false;
    try {
      return typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
    } catch {
      return false;
    }
  }, ac2 = () => {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
    } catch {
      return false;
    }
  }, sc2 = () => {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 19, 1, 17, 0, 65, 1, 253, 15, 65, 2, 253, 15, 65, 3, 253, 15, 253, 147, 2, 11]));
    } catch {
      return false;
    }
  }, Jt2 = async (a2) => {
    if (on2) return Promise.resolve();
    if (nr2) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
    if (ds2) throw new Error("previous call to 'initializeWebAssembly()' failed.");
    nr2 = true;
    let r2 = a2.initTimeout, s2 = a2.numThreads;
    if (a2.simd !== false) {
      if (a2.simd === "relaxed") {
        if (!sc2()) throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.");
      } else if (!ac2()) throw new Error("WebAssembly SIMD is not supported in the current environment.");
    }
    let f2 = oc2();
    s2 > 1 && !f2 && (typeof self < "u" && !self.crossOriginIsolated && console.warn("env.wasm.numThreads is set to " + s2 + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."), console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."), a2.numThreads = s2 = 1);
    let i2 = a2.wasmPaths, d2 = typeof i2 == "string" ? i2 : void 0, l2 = i2?.mjs, m2 = l2?.href ?? l2, y2 = i2?.wasm, w2 = y2?.href ?? y2, T2 = a2.wasmBinary, [g2, v2] = await cs2(m2, d2, s2 > 1, !!T2 || !!w2), S2 = false, U2 = [];
    if (r2 > 0 && U2.push(new Promise((R2) => {
      setTimeout(() => {
        S2 = true, R2();
      }, r2);
    })), U2.push(new Promise((R2, H2) => {
      let C2 = { numThreads: s2 };
      if (T2) C2.wasmBinary = T2, C2.locateFile = (M2) => M2;
      else if (w2 || d2) C2.locateFile = (M2) => w2 ?? d2 + M2;
      else if (m2 && m2.indexOf("blob:") !== 0) C2.locateFile = (M2) => new URL(M2, m2).href;
      else if (g2) {
        let M2 = is2();
        M2 && (C2.locateFile = (q2) => M2 + q2);
      }
      v2(C2).then((M2) => {
        nr2 = false, on2 = true, nn2 = M2, R2(), g2 && URL.revokeObjectURL(g2);
      }, (M2) => {
        nr2 = false, ds2 = true, H2(M2);
      });
    })), await Promise.race(U2), S2) throw new Error(`WebAssembly backend initializing failed due to timeout: ${r2}ms`);
  }, z2 = () => {
    if (on2 && nn2) return nn2;
    throw new Error("WebAssembly is not initialized yet.");
  };
});
var be2;
var Lt2;
var $2;
var or2 = k2(() => {
  "use strict";
  je2();
  be2 = (a2, r2) => {
    let s2 = z2(), f2 = s2.lengthBytesUTF8(a2) + 1, i2 = s2._malloc(f2);
    return s2.stringToUTF8(a2, i2, f2), r2.push(i2), i2;
  }, Lt2 = (a2, r2, s2, f2) => {
    if (typeof a2 == "object" && a2 !== null) {
      if (s2.has(a2)) throw new Error("Circular reference in options");
      s2.add(a2);
    }
    Object.entries(a2).forEach(([i2, d2]) => {
      let l2 = r2 ? r2 + i2 : i2;
      if (typeof d2 == "object") Lt2(d2, l2 + ".", s2, f2);
      else if (typeof d2 == "string" || typeof d2 == "number") f2(l2, d2.toString());
      else if (typeof d2 == "boolean") f2(l2, d2 ? "1" : "0");
      else throw new Error(`Can't handle extra config type: ${typeof d2}`);
    });
  }, $2 = (a2) => {
    let r2 = z2(), s2 = r2.stackSave();
    try {
      let f2 = r2.PTR_SIZE, i2 = r2.stackAlloc(2 * f2);
      r2._OrtGetLastError(i2, i2 + f2);
      let d2 = Number(r2.getValue(i2, f2 === 4 ? "i32" : "i64")), l2 = r2.getValue(i2 + f2, "*"), m2 = l2 ? r2.UTF8ToString(l2) : "";
      throw new Error(`${a2} ERROR_CODE: ${d2}, ERROR_MESSAGE: ${m2}`);
    } finally {
      r2.stackRestore(s2);
    }
  };
});
var ls2;
var ps2 = k2(() => {
  "use strict";
  je2();
  or2();
  ls2 = (a2) => {
    let r2 = z2(), s2 = 0, f2 = [], i2 = a2 || {};
    try {
      if (a2?.logSeverityLevel === void 0) i2.logSeverityLevel = 2;
      else if (typeof a2.logSeverityLevel != "number" || !Number.isInteger(a2.logSeverityLevel) || a2.logSeverityLevel < 0 || a2.logSeverityLevel > 4) throw new Error(`log severity level is not valid: ${a2.logSeverityLevel}`);
      if (a2?.logVerbosityLevel === void 0) i2.logVerbosityLevel = 0;
      else if (typeof a2.logVerbosityLevel != "number" || !Number.isInteger(a2.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${a2.logVerbosityLevel}`);
      a2?.terminate === void 0 && (i2.terminate = false);
      let d2 = 0;
      return a2?.tag !== void 0 && (d2 = be2(a2.tag, f2)), s2 = r2._OrtCreateRunOptions(i2.logSeverityLevel, i2.logVerbosityLevel, !!i2.terminate, d2), s2 === 0 && $2("Can't create run options."), a2?.extra !== void 0 && Lt2(a2.extra, "", /* @__PURE__ */ new WeakSet(), (l2, m2) => {
        let y2 = be2(l2, f2), w2 = be2(m2, f2);
        r2._OrtAddRunConfigEntry(s2, y2, w2) !== 0 && $2(`Can't set a run config entry: ${l2} - ${m2}.`);
      }), [s2, f2];
    } catch (d2) {
      throw s2 !== 0 && r2._OrtReleaseRunOptions(s2), f2.forEach((l2) => r2._free(l2)), d2;
    }
  };
});
var ic2;
var uc2;
var fc2;
var Bt2;
var ot2;
var cc2;
var ms2;
var hs2 = k2(() => {
  "use strict";
  je2();
  or2();
  ic2 = (a2) => {
    switch (a2) {
      case "disabled":
        return 0;
      case "basic":
        return 1;
      case "extended":
        return 2;
      case "layout":
        return 3;
      case "all":
        return 99;
      default:
        throw new Error(`unsupported graph optimization level: ${a2}`);
    }
  }, uc2 = (a2) => {
    switch (a2) {
      case "sequential":
        return 0;
      case "parallel":
        return 1;
      default:
        throw new Error(`unsupported execution mode: ${a2}`);
    }
  }, fc2 = (a2) => {
    a2.extra || (a2.extra = {}), a2.extra.session || (a2.extra.session = {});
    let r2 = a2.extra.session;
    r2.use_ort_model_bytes_directly || (r2.use_ort_model_bytes_directly = "1"), a2.executionProviders && a2.executionProviders.some((s2) => (typeof s2 == "string" ? s2 : s2.name) === "webgpu") && (a2.enableMemPattern = false);
  }, Bt2 = (a2, r2, s2, f2) => {
    let i2 = be2(r2, f2), d2 = be2(s2, f2);
    z2()._OrtAddSessionConfigEntry(a2, i2, d2) !== 0 && $2(`Can't set a session config entry: ${r2} - ${s2}.`);
  }, ot2 = (a2, r2, s2, f2) => {
    let i2 = be2(r2, f2), d2 = be2(s2, f2);
    a2.push([i2, d2]);
  }, cc2 = async (a2, r2, s2) => {
    let f2 = r2.executionProviders;
    for (let i2 of f2) {
      let d2 = typeof i2 == "string" ? i2 : i2.name, l2 = [];
      switch (d2) {
        case "webnn":
          if (d2 = "WEBNN", Bt2(a2, "session.disable_quant_qdq", "1", s2), Bt2(a2, "session.disable_qdq_constant_folding", "1", s2), typeof i2 != "string") {
            let v2 = i2?.deviceType;
            v2 && Bt2(a2, "deviceType", v2, s2);
          }
          break;
        case "webgpu":
          {
            d2 = "WebGPU";
            let g2;
            if (typeof i2 != "string") {
              let S2 = i2;
              if (S2.device) if (typeof GPUDevice < "u" && S2.device instanceof GPUDevice) g2 = S2.device;
              else throw new Error("Invalid GPU device set in WebGPU EP options.");
              let { enableGraphCapture: U2 } = r2;
              if (typeof U2 == "boolean" && U2 && ot2(l2, "enableGraphCapture", "1", s2), typeof S2.preferredLayout == "string" && ot2(l2, "preferredLayout", S2.preferredLayout, s2), S2.forceCpuNodeNames) {
                let R2 = Array.isArray(S2.forceCpuNodeNames) ? S2.forceCpuNodeNames : [S2.forceCpuNodeNames];
                ot2(l2, "forceCpuNodeNames", R2.join(`
`), s2);
              }
              S2.validationMode && ot2(l2, "validationMode", S2.validationMode, s2);
            }
            let v2 = z2().webgpuRegisterDevice(g2);
            if (v2) {
              let [S2, U2, R2] = v2;
              ot2(l2, "deviceId", S2.toString(), s2), ot2(l2, "webgpuInstance", U2.toString(), s2), ot2(l2, "webgpuDevice", R2.toString(), s2);
            }
          }
          break;
        case "wasm":
        case "cpu":
          continue;
        default:
          throw new Error(`not supported execution provider: ${d2}`);
      }
      let m2 = be2(d2, s2), y2 = l2.length, w2 = 0, T2 = 0;
      if (y2 > 0) {
        w2 = z2()._malloc(y2 * z2().PTR_SIZE), s2.push(w2), T2 = z2()._malloc(y2 * z2().PTR_SIZE), s2.push(T2);
        for (let g2 = 0; g2 < y2; g2++) z2().setValue(w2 + g2 * z2().PTR_SIZE, l2[g2][0], "*"), z2().setValue(T2 + g2 * z2().PTR_SIZE, l2[g2][1], "*");
      }
      await z2()._OrtAppendExecutionProvider(a2, m2, w2, T2, y2) !== 0 && $2(`Can't append execution provider: ${d2}.`);
    }
  }, ms2 = async (a2) => {
    let r2 = z2(), s2 = 0, f2 = [], i2 = a2 || {};
    fc2(i2);
    try {
      let d2 = ic2(i2.graphOptimizationLevel ?? "all"), l2 = uc2(i2.executionMode ?? "sequential"), m2 = typeof i2.logId == "string" ? be2(i2.logId, f2) : 0, y2 = i2.logSeverityLevel ?? 2;
      if (!Number.isInteger(y2) || y2 < 0 || y2 > 4) throw new Error(`log severity level is not valid: ${y2}`);
      let w2 = i2.logVerbosityLevel ?? 0;
      if (!Number.isInteger(w2) || w2 < 0 || w2 > 4) throw new Error(`log verbosity level is not valid: ${w2}`);
      let T2 = typeof i2.optimizedModelFilePath == "string" ? be2(i2.optimizedModelFilePath, f2) : 0;
      if (s2 = r2._OrtCreateSessionOptions(d2, !!i2.enableCpuMemArena, !!i2.enableMemPattern, l2, !!i2.enableProfiling, 0, m2, y2, w2, T2), s2 === 0 && $2("Can't create session options."), i2.executionProviders && await cc2(s2, i2, f2), i2.enableGraphCapture !== void 0) {
        if (typeof i2.enableGraphCapture != "boolean") throw new Error(`enableGraphCapture must be a boolean value: ${i2.enableGraphCapture}`);
        Bt2(s2, "enableGraphCapture", i2.enableGraphCapture.toString(), f2);
      }
      if (i2.freeDimensionOverrides) for (let [g2, v2] of Object.entries(i2.freeDimensionOverrides)) {
        if (typeof g2 != "string") throw new Error(`free dimension override name must be a string: ${g2}`);
        if (typeof v2 != "number" || !Number.isInteger(v2) || v2 < 0) throw new Error(`free dimension override value must be a non-negative integer: ${v2}`);
        let S2 = be2(g2, f2);
        r2._OrtAddFreeDimensionOverride(s2, S2, v2) !== 0 && $2(`Can't set a free dimension override: ${g2} - ${v2}.`);
      }
      return i2.extra !== void 0 && Lt2(i2.extra, "", /* @__PURE__ */ new WeakSet(), (g2, v2) => {
        Bt2(s2, g2, v2, f2);
      }), [s2, f2];
    } catch (d2) {
      throw s2 !== 0 && r2._OrtReleaseSessionOptions(s2) !== 0 && $2("Can't release session options."), f2.forEach((l2) => r2._free(l2)), d2;
    }
  };
});
var He2;
var ar2;
var mt2;
var at2;
var Ot2;
var sr2;
var ir2;
var an2;
var st2 = k2(() => {
  "use strict";
  He2 = (a2) => {
    switch (a2) {
      case "int8":
        return 3;
      case "uint8":
        return 2;
      case "bool":
        return 9;
      case "int16":
        return 5;
      case "uint16":
        return 4;
      case "int32":
        return 6;
      case "uint32":
        return 12;
      case "float16":
        return 10;
      case "float32":
        return 1;
      case "float64":
        return 11;
      case "string":
        return 8;
      case "int64":
        return 7;
      case "uint64":
        return 13;
      case "int4":
        return 22;
      case "uint4":
        return 21;
      default:
        throw new Error(`unsupported data type: ${a2}`);
    }
  }, ar2 = (a2) => {
    switch (a2) {
      case 3:
        return "int8";
      case 2:
        return "uint8";
      case 9:
        return "bool";
      case 5:
        return "int16";
      case 4:
        return "uint16";
      case 6:
        return "int32";
      case 12:
        return "uint32";
      case 10:
        return "float16";
      case 1:
        return "float32";
      case 11:
        return "float64";
      case 8:
        return "string";
      case 7:
        return "int64";
      case 13:
        return "uint64";
      case 22:
        return "int4";
      case 21:
        return "uint4";
      default:
        throw new Error(`unsupported data type: ${a2}`);
    }
  }, mt2 = (a2, r2) => {
    let s2 = [-1, 4, 1, 1, 2, 2, 4, 8, -1, 1, 2, 8, 4, 8, -1, -1, -1, -1, -1, -1, -1, 0.5, 0.5][a2], f2 = typeof r2 == "number" ? r2 : r2.reduce((i2, d2) => i2 * d2, 1);
    return s2 > 0 ? Math.ceil(f2 * s2) : void 0;
  }, at2 = (a2) => {
    switch (a2) {
      case "float16":
        return typeof Float16Array < "u" ? Float16Array : Uint16Array;
      case "float32":
        return Float32Array;
      case "uint8":
        return Uint8Array;
      case "int8":
        return Int8Array;
      case "uint16":
        return Uint16Array;
      case "int16":
        return Int16Array;
      case "int32":
        return Int32Array;
      case "bool":
        return Uint8Array;
      case "float64":
        return Float64Array;
      case "uint32":
        return Uint32Array;
      case "int64":
        return BigInt64Array;
      case "uint64":
        return BigUint64Array;
      default:
        throw new Error(`unsupported type: ${a2}`);
    }
  }, Ot2 = (a2) => {
    switch (a2) {
      case "verbose":
        return 0;
      case "info":
        return 1;
      case "warning":
        return 2;
      case "error":
        return 3;
      case "fatal":
        return 4;
      default:
        throw new Error(`unsupported logging level: ${a2}`);
    }
  }, sr2 = (a2) => a2 === "float32" || a2 === "float16" || a2 === "int32" || a2 === "int64" || a2 === "uint32" || a2 === "uint8" || a2 === "bool" || a2 === "uint4" || a2 === "int4", ir2 = (a2) => a2 === "float32" || a2 === "float16" || a2 === "int32" || a2 === "int64" || a2 === "uint32" || a2 === "uint64" || a2 === "int8" || a2 === "uint8" || a2 === "bool" || a2 === "uint4" || a2 === "int4", an2 = (a2) => {
    switch (a2) {
      case "none":
        return 0;
      case "cpu":
        return 1;
      case "cpu-pinned":
        return 2;
      case "texture":
        return 3;
      case "gpu-buffer":
        return 4;
      case "ml-tensor":
        return 5;
      default:
        throw new Error(`unsupported data location: ${a2}`);
    }
  };
});
var Mt2;
var sn2 = k2(() => {
  "use strict";
  qt2();
  Mt2 = async (a2) => {
    if (typeof a2 == "string") if (false) try {
      let { readFile: r2 } = qr2("node:fs/promises");
      return new Uint8Array(await r2(a2));
    } catch (r2) {
      if (r2.code === "ERR_FS_FILE_TOO_LARGE") {
        let { createReadStream: s2 } = qr2("node:fs"), f2 = s2(a2), i2 = [];
        for await (let d2 of f2) i2.push(d2);
        return new Uint8Array(Buffer.concat(i2));
      }
      throw r2;
    }
    else {
      let r2 = await fetch(a2);
      if (!r2.ok) throw new Error(`failed to load external data file: ${a2}`);
      let s2 = r2.headers.get("Content-Length"), f2 = s2 ? parseInt(s2, 10) : 0;
      if (f2 < 1073741824) return new Uint8Array(await r2.arrayBuffer());
      {
        if (!r2.body) throw new Error(`failed to load external data file: ${a2}, no response body.`);
        let i2 = r2.body.getReader(), d2;
        try {
          d2 = new ArrayBuffer(f2);
        } catch (m2) {
          if (m2 instanceof RangeError) {
            let y2 = Math.ceil(f2 / 65536);
            d2 = new WebAssembly.Memory({ initial: y2, maximum: y2 }).buffer;
          } else throw m2;
        }
        let l2 = 0;
        for (; ; ) {
          let { done: m2, value: y2 } = await i2.read();
          if (m2) break;
          let w2 = y2.byteLength;
          new Uint8Array(d2, l2, w2).set(y2), l2 += w2;
        }
        return new Uint8Array(d2, 0, f2);
      }
    }
    else return a2 instanceof Blob ? new Uint8Array(await a2.arrayBuffer()) : a2 instanceof Uint8Array ? a2 : new Uint8Array(a2);
  };
});
var ys2;
var bs2 = k2(() => {
  "use strict";
  st2();
  ys2 = (a2, r2) => new (at2(r2))(a2);
});
var dc2;
var lc2;
var ws2;
var gs2;
var Ts2;
var pc2;
var pe2;
var un2 = k2(() => {
  "use strict";
  st2();
  dc2 = ["V", "I", "W", "E", "F"], lc2 = (a2, r2) => {
    console.log(`[${dc2[a2]},${(/* @__PURE__ */ new Date()).toISOString()}]${r2}`);
  }, Ts2 = (a2, r2) => {
    ws2 = a2, gs2 = r2;
  }, pc2 = (a2, r2) => {
    let s2 = Ot2(a2), f2 = Ot2(ws2);
    s2 >= f2 && lc2(s2, typeof r2 == "function" ? r2() : r2);
  }, pe2 = (...a2) => {
    gs2 && pc2(...a2);
  };
});
var Es2;
var cn2;
var Ss2;
var mc2;
var vs2;
var hc2;
var As2;
var ur2;
var fr2;
var fn2;
var Is2;
var xs2 = k2(() => {
  "use strict";
  st2();
  un2();
  Es2 = /* @__PURE__ */ new Map([["float32", 32], ["float16", 16], ["int32", 32], ["uint32", 32], ["int64", 64], ["uint64", 64], ["int8", 8], ["uint8", 8], ["int4", 4], ["uint4", 4]]), cn2 = (a2, r2) => {
    if (r2 === "int32") return a2;
    let s2 = Es2.get(r2);
    if (!s2) throw new Error(`WebNN backend does not support data type: ${r2}`);
    let f2 = s2 / 8;
    if (a2.byteLength % f2 !== 0) throw new Error(`Invalid Uint8Array length - must be a multiple of ${f2}.`);
    let i2 = a2.byteLength / f2, d2 = new (at2(r2))(a2.buffer, a2.byteOffset, i2);
    switch (r2) {
      case "int64":
      case "uint64": {
        let l2 = new Int32Array(i2);
        for (let m2 = 0; m2 < i2; m2++) {
          let y2 = d2[m2];
          if (y2 > 2147483647n || y2 < -2147483648n) throw new Error("Can not convert int64 data to int32 - value out of range.");
          l2[m2] = Number(y2);
        }
        return new Uint8Array(l2.buffer);
      }
      case "int8":
      case "uint8":
      case "uint32": {
        if (r2 === "uint32" && d2.some((m2) => m2 > 2147483647)) throw new Error("Can not convert uint32 data to int32 - value out of range.");
        let l2 = Int32Array.from(d2, Number);
        return new Uint8Array(l2.buffer);
      }
      default:
        throw new Error(`Unsupported data conversion from ${r2} to 'int32'`);
    }
  }, Ss2 = (a2, r2) => {
    if (r2 === "int32") return a2;
    if (a2.byteLength % 4 !== 0) throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");
    let s2 = a2.byteLength / 4, f2 = new Int32Array(a2.buffer, a2.byteOffset, s2);
    switch (r2) {
      case "int64": {
        let i2 = BigInt64Array.from(f2, BigInt);
        return new Uint8Array(i2.buffer);
      }
      case "uint64": {
        if (f2.some((d2) => d2 < 0)) throw new Error("Can not convert int32 data to uin64 - negative value found.");
        let i2 = BigUint64Array.from(f2, BigInt);
        return new Uint8Array(i2.buffer);
      }
      case "int8": {
        if (f2.some((d2) => d2 < -128 || d2 > 127)) throw new Error("Can not convert int32 data to int8 - value out of range.");
        let i2 = Int8Array.from(f2, Number);
        return new Uint8Array(i2.buffer);
      }
      case "uint8": {
        if (f2.some((i2) => i2 < 0 || i2 > 255)) throw new Error("Can not convert int32 data to uint8 - value out of range.");
        return Uint8Array.from(f2, Number);
      }
      case "uint32": {
        if (f2.some((d2) => d2 < 0)) throw new Error("Can not convert int32 data to uint32 - negative value found.");
        let i2 = Uint32Array.from(f2, Number);
        return new Uint8Array(i2.buffer);
      }
      default:
        throw new Error(`Unsupported data conversion from 'int32' to ${r2}`);
    }
  }, mc2 = 1, vs2 = () => mc2++, hc2 = /* @__PURE__ */ new Map([["int8", "int32"], ["uint8", "int32"], ["uint32", "int32"], ["int64", "int32"]]), As2 = (a2, r2) => {
    let s2 = Es2.get(a2);
    if (!s2) throw new Error(`WebNN backend does not support data type: ${a2}`);
    return r2.length > 0 ? Math.ceil(r2.reduce((f2, i2) => f2 * i2) * s2 / 8) : 0;
  }, ur2 = class {
    constructor(r2) {
      this.isDataConverted = false;
      let { sessionId: s2, context: f2, tensor: i2, dataType: d2, shape: l2, fallbackDataType: m2 } = r2;
      this.sessionId = s2, this.mlContext = f2, this.mlTensor = i2, this.dataType = d2, this.tensorShape = l2, this.fallbackDataType = m2;
    }
    get tensor() {
      return this.mlTensor;
    }
    get type() {
      return this.dataType;
    }
    get fallbackType() {
      return this.fallbackDataType;
    }
    get shape() {
      return this.tensorShape;
    }
    get byteLength() {
      return As2(this.dataType, this.tensorShape);
    }
    destroy() {
      pe2("verbose", () => "[WebNN] TensorWrapper.destroy"), this.mlTensor.destroy();
    }
    write(r2) {
      this.mlContext.writeTensor(this.mlTensor, r2);
    }
    async read(r2) {
      if (this.fallbackDataType) {
        let s2 = await this.mlContext.readTensor(this.mlTensor), f2 = Ss2(new Uint8Array(s2), this.dataType);
        if (r2) {
          (r2 instanceof ArrayBuffer ? new Uint8Array(r2) : new Uint8Array(r2.buffer, r2.byteOffset, r2.byteLength)).set(f2);
          return;
        } else return new Uint8Array(f2).buffer;
      } else return r2 ? this.mlContext.readTensor(this.mlTensor, r2) : this.mlContext.readTensor(this.mlTensor);
    }
    canReuseTensor(r2, s2, f2) {
      return this.mlContext === r2 && this.dataType === s2 && this.tensorShape.length === f2.length && this.tensorShape.every((i2, d2) => i2 === f2[d2]);
    }
    setIsDataConverted(r2) {
      this.isDataConverted = r2;
    }
  }, fr2 = class {
    constructor(r2, s2) {
      this.tensorManager = r2;
      this.wrapper = s2;
    }
    get tensorWrapper() {
      return this.wrapper;
    }
    releaseTensor() {
      this.tensorWrapper && (this.tensorManager.releaseTensor(this.tensorWrapper), this.wrapper = void 0);
    }
    async ensureTensor(r2, s2, f2, i2) {
      let d2 = this.tensorManager.getMLContext(r2), l2 = this.tensorManager.getMLOpSupportLimits(r2), m2;
      if (!l2?.input.dataTypes.includes(s2)) {
        if (m2 = hc2.get(s2), !m2 || l2?.input.dataTypes.includes(m2)) throw new Error(`WebNN backend does not support data type: ${s2}`);
        pe2("verbose", () => `[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${s2} to ${m2}`);
      }
      if (this.wrapper) {
        if (this.wrapper.canReuseTensor(d2, s2, f2)) return this.wrapper.tensor;
        if (i2) {
          if (this.wrapper.byteLength !== As2(s2, f2)) throw new Error("Unable to copy data to tensor with different size.");
          this.activeUpload = new Uint8Array(await this.wrapper.read());
        }
        this.tensorManager.releaseTensor(this.wrapper);
      }
      let y2 = typeof MLTensorUsage > "u" ? void 0 : MLTensorUsage.READ | MLTensorUsage.WRITE;
      return this.wrapper = await this.tensorManager.getCachedTensor(r2, s2, f2, y2, true, true, m2), i2 && this.activeUpload && (this.wrapper.write(this.activeUpload), this.activeUpload = void 0), this.wrapper.tensor;
    }
    upload(r2) {
      let s2 = r2;
      if (this.wrapper) {
        if (this.wrapper.fallbackType) if (this.wrapper.fallbackType === "int32") s2 = cn2(r2, this.wrapper.type), this.wrapper.setIsDataConverted(true);
        else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);
        if (r2.byteLength === this.wrapper.byteLength) {
          this.wrapper.write(s2);
          return;
        } else pe2("verbose", () => "Data size does not match tensor size. Releasing tensor."), this.releaseTensor();
      }
      this.activeUpload ? this.activeUpload.set(s2) : this.activeUpload = new Uint8Array(s2);
    }
    async download(r2) {
      if (this.activeUpload) {
        let s2 = this.wrapper?.isDataConverted ? Ss2(this.activeUpload, this.wrapper?.type) : this.activeUpload;
        if (r2) {
          r2 instanceof ArrayBuffer ? new Uint8Array(r2).set(s2) : new Uint8Array(r2.buffer, r2.byteOffset, r2.byteLength).set(s2);
          return;
        } else return s2.buffer;
      }
      if (!this.wrapper) throw new Error("Tensor has not been created.");
      return r2 ? this.wrapper.read(r2) : this.wrapper.read();
    }
  }, fn2 = class {
    constructor(r2) {
      this.backend = r2;
      this.tensorTrackersById = /* @__PURE__ */ new Map();
      this.freeTensors = [];
      this.externalTensors = /* @__PURE__ */ new Set();
    }
    getMLContext(r2) {
      let s2 = this.backend.getMLContext(r2);
      if (!s2) throw new Error("MLContext not found for session.");
      return s2;
    }
    getMLOpSupportLimits(r2) {
      return this.backend.getMLOpSupportLimits(r2);
    }
    reserveTensorId() {
      let r2 = vs2();
      return this.tensorTrackersById.set(r2, new fr2(this)), r2;
    }
    releaseTensorId(r2) {
      let s2 = this.tensorTrackersById.get(r2);
      s2 && (this.tensorTrackersById.delete(r2), s2.tensorWrapper && this.releaseTensor(s2.tensorWrapper));
    }
    async ensureTensor(r2, s2, f2, i2, d2) {
      pe2("verbose", () => `[WebNN] TensorManager.ensureTensor {tensorId: ${s2}, dataType: ${f2}, shape: ${i2}, copyOld: ${d2}}`);
      let l2 = this.tensorTrackersById.get(s2);
      if (!l2) throw new Error("Tensor not found.");
      return l2.ensureTensor(r2, f2, i2, d2);
    }
    upload(r2, s2) {
      let f2 = this.tensorTrackersById.get(r2);
      if (!f2) throw new Error("Tensor not found.");
      f2.upload(s2);
    }
    async download(r2, s2) {
      pe2("verbose", () => `[WebNN] TensorManager.download {tensorId: ${r2}, dstBuffer: ${s2?.byteLength}}`);
      let f2 = this.tensorTrackersById.get(r2);
      if (!f2) throw new Error("Tensor not found.");
      return f2.download(s2);
    }
    releaseTensorsForSession(r2) {
      for (let s2 of this.freeTensors) s2.sessionId === r2 && s2.destroy();
      this.freeTensors = this.freeTensors.filter((s2) => s2.sessionId !== r2);
    }
    registerTensor(r2, s2, f2, i2) {
      let d2 = this.getMLContext(r2), l2 = vs2(), m2 = new ur2({ sessionId: r2, context: d2, tensor: s2, dataType: f2, shape: i2 });
      return this.tensorTrackersById.set(l2, new fr2(this, m2)), this.externalTensors.add(m2), l2;
    }
    async getCachedTensor(r2, s2, f2, i2, d2, l2, m2) {
      let y2 = this.getMLContext(r2);
      for (let [T2, g2] of this.freeTensors.entries()) if (g2.canReuseTensor(y2, s2, f2)) {
        pe2("verbose", () => `[WebNN] Reusing tensor {dataType: ${s2}, ${m2 ? `fallbackDataType: ${m2},` : ""} shape: ${f2}`);
        let v2 = this.freeTensors.splice(T2, 1)[0];
        return v2.sessionId = r2, v2;
      }
      pe2("verbose", () => `[WebNN] MLContext.createTensor {dataType: ${s2}, ${m2 ? `fallbackDataType: ${m2},` : ""} shape: ${f2}}`);
      let w2 = await y2.createTensor({ dataType: m2 ?? s2, shape: f2, dimensions: f2, usage: i2, writable: d2, readable: l2 });
      return new ur2({ sessionId: r2, context: y2, tensor: w2, dataType: s2, shape: f2, fallbackDataType: m2 });
    }
    releaseTensor(r2) {
      this.externalTensors.has(r2) && this.externalTensors.delete(r2), this.freeTensors.push(r2);
    }
  }, Is2 = (...a2) => new fn2(...a2);
});
var Ls2 = {};
At2(Ls2, { WebNNBackend: () => dn2 });
var cr2;
var yc2;
var dn2;
var Bs2 = k2(() => {
  "use strict";
  st2();
  je2();
  bs2();
  xs2();
  un2();
  cr2 = /* @__PURE__ */ new Map([[1, "float32"], [10, "float16"], [6, "int32"], [12, "uint32"], [7, "int64"], [13, "uint64"], [22, "int4"], [21, "uint4"], [3, "int8"], [2, "uint8"], [9, "uint8"]]), yc2 = (a2, r2) => {
    if (a2 === r2) return true;
    if (a2 === void 0 || r2 === void 0) return false;
    let s2 = Object.keys(a2).sort(), f2 = Object.keys(r2).sort();
    return s2.length === f2.length && s2.every((i2, d2) => i2 === f2[d2] && a2[i2] === r2[i2]);
  }, dn2 = class {
    constructor(r2) {
      this.tensorManager = Is2(this);
      this.mlContextBySessionId = /* @__PURE__ */ new Map();
      this.sessionIdsByMLContext = /* @__PURE__ */ new Map();
      this.mlContextCache = [];
      this.sessionGraphInputs = /* @__PURE__ */ new Map();
      this.sessionGraphOutputs = /* @__PURE__ */ new Map();
      this.temporaryGraphInputs = [];
      this.temporaryGraphOutputs = [];
      this.temporarySessionTensorIds = /* @__PURE__ */ new Map();
      this.mlOpSupportLimitsBySessionId = /* @__PURE__ */ new Map();
      Ts2(r2.logLevel, !!r2.debug);
    }
    get currentSessionId() {
      if (this.activeSessionId === void 0) throw new Error("No active session");
      return this.activeSessionId;
    }
    onRunStart(r2) {
      pe2("verbose", () => `[WebNN] onRunStart {sessionId: ${r2}}`), this.activeSessionId = r2;
    }
    onRunEnd(r2) {
      pe2("verbose", () => `[WebNN] onRunEnd {sessionId: ${r2}}`);
      let s2 = this.temporarySessionTensorIds.get(r2);
      if (s2) {
        for (let f2 of s2) pe2("verbose", () => `[WebNN] releasing temporary tensor {tensorId: ${f2}}`), this.tensorManager.releaseTensorId(f2);
        this.temporarySessionTensorIds.delete(r2), this.activeSessionId = void 0;
      }
    }
    async createMLContext(r2) {
      if (r2 instanceof GPUDevice) {
        let f2 = this.mlContextCache.findIndex((i2) => i2.gpuDevice === r2);
        if (f2 !== -1) return this.mlContextCache[f2].mlContext;
        {
          let i2 = await navigator.ml.createContext(r2);
          return this.mlContextCache.push({ gpuDevice: r2, mlContext: i2 }), i2;
        }
      } else if (r2 === void 0) {
        let f2 = this.mlContextCache.findIndex((i2) => i2.options === void 0 && i2.gpuDevice === void 0);
        if (f2 !== -1) return this.mlContextCache[f2].mlContext;
        {
          let i2 = await navigator.ml.createContext();
          return this.mlContextCache.push({ mlContext: i2 }), i2;
        }
      }
      let s2 = this.mlContextCache.findIndex((f2) => yc2(f2.options, r2));
      if (s2 !== -1) return this.mlContextCache[s2].mlContext;
      {
        let f2 = await navigator.ml.createContext(r2);
        return this.mlContextCache.push({ options: r2, mlContext: f2 }), f2;
      }
    }
    registerMLContext(r2, s2) {
      this.mlContextBySessionId.set(r2, s2);
      let f2 = this.sessionIdsByMLContext.get(s2);
      f2 || (f2 = /* @__PURE__ */ new Set(), this.sessionIdsByMLContext.set(s2, f2)), f2.add(r2), this.mlOpSupportLimitsBySessionId.has(r2) || this.mlOpSupportLimitsBySessionId.set(r2, s2.opSupportLimits()), this.temporaryGraphInputs.length > 0 && (this.sessionGraphInputs.set(r2, this.temporaryGraphInputs), this.temporaryGraphInputs = []), this.temporaryGraphOutputs.length > 0 && (this.sessionGraphOutputs.set(r2, this.temporaryGraphOutputs), this.temporaryGraphOutputs = []);
    }
    onReleaseSession(r2) {
      this.sessionGraphInputs.delete(r2), this.sessionGraphOutputs.delete(r2);
      let s2 = this.mlContextBySessionId.get(r2);
      if (!s2) return;
      this.tensorManager.releaseTensorsForSession(r2), this.mlContextBySessionId.delete(r2), this.mlOpSupportLimitsBySessionId.delete(r2);
      let f2 = this.sessionIdsByMLContext.get(s2);
      if (f2.delete(r2), f2.size === 0) {
        this.sessionIdsByMLContext.delete(s2);
        let i2 = this.mlContextCache.findIndex((d2) => d2.mlContext === s2);
        i2 !== -1 && this.mlContextCache.splice(i2, 1);
      }
    }
    getMLContext(r2) {
      return this.mlContextBySessionId.get(r2);
    }
    getMLOpSupportLimits(r2) {
      return this.mlOpSupportLimitsBySessionId.get(r2);
    }
    reserveTensorId() {
      return this.tensorManager.reserveTensorId();
    }
    releaseTensorId(r2) {
      pe2("verbose", () => `[WebNN] releaseTensorId {tensorId: ${r2}}`), this.tensorManager.releaseTensorId(r2);
    }
    async ensureTensor(r2, s2, f2, i2, d2) {
      let l2 = cr2.get(f2);
      if (!l2) throw new Error(`Unsupported ONNX data type: ${f2}`);
      return this.tensorManager.ensureTensor(r2 ?? this.currentSessionId, s2, l2, i2, d2);
    }
    async createTemporaryTensor(r2, s2, f2) {
      pe2("verbose", () => `[WebNN] createTemporaryTensor {onnxDataType: ${s2}, shape: ${f2}}`);
      let i2 = cr2.get(s2);
      if (!i2) throw new Error(`Unsupported ONNX data type: ${s2}`);
      let d2 = this.tensorManager.reserveTensorId();
      await this.tensorManager.ensureTensor(r2, d2, i2, f2, false);
      let l2 = this.temporarySessionTensorIds.get(r2);
      return l2 ? l2.push(d2) : this.temporarySessionTensorIds.set(r2, [d2]), d2;
    }
    uploadTensor(r2, s2) {
      if (!z2().shouldTransferToMLTensor) throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");
      pe2("verbose", () => `[WebNN] uploadTensor {tensorId: ${r2}, data: ${s2.byteLength}}`), this.tensorManager.upload(r2, s2);
    }
    async downloadTensor(r2, s2) {
      return this.tensorManager.download(r2, s2);
    }
    createMLTensorDownloader(r2, s2) {
      return async () => {
        let f2 = await this.tensorManager.download(r2);
        return ys2(f2, s2);
      };
    }
    registerMLTensor(r2, s2, f2, i2) {
      let d2 = cr2.get(f2);
      if (!d2) throw new Error(`Unsupported ONNX data type: ${f2}`);
      let l2 = this.tensorManager.registerTensor(r2, s2, d2, i2);
      return pe2("verbose", () => `[WebNN] registerMLTensor {tensor: ${s2}, dataType: ${d2}, dimensions: ${i2}} -> {tensorId: ${l2}}`), l2;
    }
    registerMLConstant(r2, s2, f2, i2, d2, l2, m2 = false) {
      if (!l2) throw new Error("External mounted files are not available.");
      let y2 = r2;
      r2.startsWith("./") && (y2 = r2.substring(2));
      let w2 = l2.get(y2);
      if (!w2) throw new Error(`File with name ${y2} not found in preloaded files.`);
      if (s2 + f2 > w2.byteLength) throw new Error("Out of bounds: data offset and length exceed the external file data size.");
      let T2 = w2.slice(s2, s2 + f2).buffer, g2;
      switch (d2.dataType) {
        case "float32":
          g2 = new Float32Array(T2);
          break;
        case "float16":
          g2 = typeof Float16Array < "u" ? new Float16Array(T2) : new Uint16Array(T2);
          break;
        case "int32":
          g2 = new Int32Array(T2);
          break;
        case "uint32":
          g2 = new Uint32Array(T2);
          break;
        case "int64":
          if (m2) {
            let v2 = cn2(new Uint8Array(T2), "int64");
            g2 = new Int32Array(v2.buffer), d2.dataType = "int32";
          } else g2 = new BigInt64Array(T2);
          break;
        case "uint64":
          g2 = new BigUint64Array(T2);
          break;
        case "int8":
          g2 = new Int8Array(T2);
          break;
        case "int4":
        case "uint4":
        case "uint8":
          g2 = new Uint8Array(T2);
          break;
        default:
          throw new Error(`Unsupported data type: ${d2.dataType} in creating WebNN Constant from external data.`);
      }
      return pe2("verbose", () => `[WebNN] registerMLConstant {dataType: ${d2.dataType}, shape: ${d2.shape}}} ${m2 ? "(Note: it was int64 data type and registered to int32 as workaround)" : ""}`), i2.constant(d2, g2);
    }
    registerGraphInput(r2) {
      this.temporaryGraphInputs.push(r2);
    }
    registerGraphOutput(r2) {
      this.temporaryGraphOutputs.push(r2);
    }
    isGraphInput(r2, s2) {
      let f2 = this.sessionGraphInputs.get(r2);
      return f2 ? f2.includes(s2) : false;
    }
    isGraphOutput(r2, s2) {
      let f2 = this.sessionGraphOutputs.get(r2);
      return f2 ? f2.includes(s2) : false;
    }
    isGraphInputOutputTypeSupported(r2, s2, f2 = true) {
      let i2 = cr2.get(He2(s2)), d2 = this.mlOpSupportLimitsBySessionId.get(r2);
      return typeof i2 > "u" ? false : f2 ? !!d2?.input.dataTypes.includes(i2) : !!d2?.output.dataTypes.includes(i2);
    }
    flush() {
    }
  };
});
var bc2;
var Xt2;
var Zt2;
var it2;
var wc2;
var Os2;
var xt2;
var Kt2;
var Qt2;
var Ms2;
var er2;
var tr2;
var rr2;
var en2 = k2(() => {
  "use strict";
  Ve2();
  ps2();
  hs2();
  st2();
  je2();
  or2();
  sn2();
  bc2 = (a2, r2) => {
    z2()._OrtInit(a2, r2) !== 0 && $2("Can't initialize onnxruntime.");
  }, Xt2 = async (a2) => {
    bc2(a2.wasm.numThreads, Ot2(a2.logLevel));
  }, Zt2 = async (a2, r2) => {
    z2().asyncInit?.();
    let s2 = a2.webgpu.adapter;
    if (r2 === "webgpu") {
      if (typeof navigator > "u" || !navigator.gpu) throw new Error("WebGPU is not supported in current environment");
      if (s2) {
        if (typeof s2.limits != "object" || typeof s2.features != "object" || typeof s2.requestDevice != "function") throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.");
      } else {
        let f2 = a2.webgpu.powerPreference;
        if (f2 !== void 0 && f2 !== "low-power" && f2 !== "high-performance") throw new Error(`Invalid powerPreference setting: "${f2}"`);
        let i2 = a2.webgpu.forceFallbackAdapter;
        if (i2 !== void 0 && typeof i2 != "boolean") throw new Error(`Invalid forceFallbackAdapter setting: "${i2}"`);
        if (s2 = await navigator.gpu.requestAdapter({ powerPreference: f2, forceFallbackAdapter: i2 }), !s2) throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.');
      }
    }
    if (r2 === "webnn" && (typeof navigator > "u" || !navigator.ml)) throw new Error("WebNN is not supported in current environment");
    if (r2 === "webgpu" && z2().webgpuInit((f2) => {
      a2.webgpu.device = f2;
    }), r2 === "webnn") {
      let f2 = new (Bs2(), zt2(Ls2)).WebNNBackend(a2);
      z2().webnnInit([f2, () => f2.reserveTensorId(), (i2) => f2.releaseTensorId(i2), async (i2, d2, l2, m2, y2) => f2.ensureTensor(i2, d2, l2, m2, y2), (i2, d2) => {
        f2.uploadTensor(i2, d2);
      }, async (i2, d2) => f2.downloadTensor(i2, d2), (i2, d2) => f2.registerMLContext(i2, d2), !!a2.trace]);
    }
  }, it2 = /* @__PURE__ */ new Map(), wc2 = (a2) => {
    let r2 = z2(), s2 = r2.stackSave();
    try {
      let f2 = r2.PTR_SIZE, i2 = r2.stackAlloc(2 * f2);
      r2._OrtGetInputOutputCount(a2, i2, i2 + f2) !== 0 && $2("Can't get session input/output count.");
      let l2 = f2 === 4 ? "i32" : "i64";
      return [Number(r2.getValue(i2, l2)), Number(r2.getValue(i2 + f2, l2))];
    } finally {
      r2.stackRestore(s2);
    }
  }, Os2 = (a2, r2) => {
    let s2 = z2(), f2 = s2.stackSave(), i2 = 0;
    try {
      let d2 = s2.PTR_SIZE, l2 = s2.stackAlloc(2 * d2);
      s2._OrtGetInputOutputMetadata(a2, r2, l2, l2 + d2) !== 0 && $2("Can't get session input/output metadata.");
      let y2 = Number(s2.getValue(l2, "*"));
      i2 = Number(s2.getValue(l2 + d2, "*"));
      let w2 = s2.HEAP32[i2 / 4];
      if (w2 === 0) return [y2, 0];
      let T2 = s2.HEAPU32[i2 / 4 + 1], g2 = [];
      for (let v2 = 0; v2 < T2; v2++) {
        let S2 = Number(s2.getValue(i2 + 8 + v2 * d2, "*"));
        g2.push(S2 !== 0 ? s2.UTF8ToString(S2) : Number(s2.getValue(i2 + 8 + (v2 + T2) * d2, "*")));
      }
      return [y2, w2, g2];
    } finally {
      s2.stackRestore(f2), i2 !== 0 && s2._OrtFree(i2);
    }
  }, xt2 = (a2) => {
    let r2 = z2(), s2 = r2._malloc(a2.byteLength);
    if (s2 === 0) throw new Error(`Can't create a session. failed to allocate a buffer of size ${a2.byteLength}.`);
    return r2.HEAPU8.set(a2, s2), [s2, a2.byteLength];
  }, Kt2 = async (a2, r2) => {
    let s2, f2, i2 = z2();
    Array.isArray(a2) ? [s2, f2] = a2 : a2.buffer === i2.HEAPU8.buffer ? [s2, f2] = [a2.byteOffset, a2.byteLength] : [s2, f2] = xt2(a2);
    let d2 = 0, l2 = 0, m2 = 0, y2 = [], w2 = [], T2 = [];
    try {
      if ([l2, y2] = await ms2(r2), r2?.externalData && i2.mountExternalData) {
        let B2 = [];
        for (let W2 of r2.externalData) {
          let oe2 = typeof W2 == "string" ? W2 : W2.path;
          B2.push(Mt2(typeof W2 == "string" ? W2 : W2.data).then((p2) => {
            i2.mountExternalData(oe2, p2);
          }));
        }
        await Promise.all(B2);
      }
      for (let B2 of r2?.executionProviders ?? []) if ((typeof B2 == "string" ? B2 : B2.name) === "webnn") {
        if (i2.shouldTransferToMLTensor = false, typeof B2 != "string") {
          let oe2 = B2, p2 = oe2?.context, ne2 = oe2?.gpuDevice, X2 = oe2?.deviceType, J2 = oe2?.powerPreference;
          p2 ? i2.currentContext = p2 : ne2 ? i2.currentContext = await i2.webnnCreateMLContext(ne2) : i2.currentContext = await i2.webnnCreateMLContext({ deviceType: X2, powerPreference: J2 });
        } else i2.currentContext = await i2.webnnCreateMLContext();
        break;
      }
      d2 = await i2._OrtCreateSession(s2, f2, l2), i2.webgpuOnCreateSession?.(d2), d2 === 0 && $2("Can't create a session."), i2.jsepOnCreateSession?.(), i2.currentContext && (i2.webnnRegisterMLContext(d2, i2.currentContext), i2.currentContext = void 0, i2.shouldTransferToMLTensor = true);
      let [g2, v2] = wc2(d2), S2 = !!r2?.enableGraphCapture, U2 = [], R2 = [], H2 = [], C2 = [], M2 = [];
      for (let B2 = 0; B2 < g2; B2++) {
        let [W2, oe2, p2] = Os2(d2, B2);
        W2 === 0 && $2("Can't get an input name."), w2.push(W2);
        let ne2 = i2.UTF8ToString(W2);
        U2.push(ne2), H2.push(oe2 === 0 ? { name: ne2, isTensor: false } : { name: ne2, isTensor: true, type: ar2(oe2), shape: p2 });
      }
      for (let B2 = 0; B2 < v2; B2++) {
        let [W2, oe2, p2] = Os2(d2, B2 + g2);
        W2 === 0 && $2("Can't get an output name."), T2.push(W2);
        let ne2 = i2.UTF8ToString(W2);
        R2.push(ne2), C2.push(oe2 === 0 ? { name: ne2, isTensor: false } : { name: ne2, isTensor: true, type: ar2(oe2), shape: p2 });
        {
          if (S2 && r2?.preferredOutputLocation === void 0) {
            M2.push("gpu-buffer");
            continue;
          }
          let X2 = typeof r2?.preferredOutputLocation == "string" ? r2.preferredOutputLocation : r2?.preferredOutputLocation?.[ne2] ?? "cpu", J2 = i2.webnnIsGraphOutput;
          if (X2 === "cpu" && J2 && J2(d2, ne2)) {
            M2.push("ml-tensor-cpu-output");
            continue;
          }
          if (X2 !== "cpu" && X2 !== "cpu-pinned" && X2 !== "gpu-buffer" && X2 !== "ml-tensor") throw new Error(`Not supported preferred output location: ${X2}.`);
          if (S2 && X2 !== "gpu-buffer") throw new Error(`Not supported preferred output location: ${X2}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);
          M2.push(X2);
        }
      }
      let q2 = null;
      return M2.some((B2) => B2 === "gpu-buffer" || B2 === "ml-tensor" || B2 === "ml-tensor-cpu-output") && (m2 = i2._OrtCreateBinding(d2), m2 === 0 && $2("Can't create IO binding."), q2 = { handle: m2, outputPreferredLocations: M2, outputPreferredLocationsEncoded: M2.map((B2) => B2 === "ml-tensor-cpu-output" ? "ml-tensor" : B2).map((B2) => an2(B2)) }), it2.set(d2, [d2, w2, T2, q2, S2, false]), [d2, U2, R2, H2, C2];
    } catch (g2) {
      throw w2.forEach((v2) => i2._OrtFree(v2)), T2.forEach((v2) => i2._OrtFree(v2)), m2 !== 0 && i2._OrtReleaseBinding(m2) !== 0 && $2("Can't release IO binding."), d2 !== 0 && i2._OrtReleaseSession(d2) !== 0 && $2("Can't release session."), g2;
    } finally {
      i2._free(s2), l2 !== 0 && i2._OrtReleaseSessionOptions(l2) !== 0 && $2("Can't release session options."), y2.forEach((g2) => i2._free(g2)), i2.unmountExternalData?.();
    }
  }, Qt2 = (a2) => {
    let r2 = z2(), s2 = it2.get(a2);
    if (!s2) throw new Error(`cannot release session. invalid session id: ${a2}`);
    let [f2, i2, d2, l2, m2] = s2;
    l2 && (m2 && r2._OrtClearBoundOutputs(l2.handle) !== 0 && $2("Can't clear bound outputs."), r2._OrtReleaseBinding(l2.handle) !== 0 && $2("Can't release IO binding.")), r2.jsepOnReleaseSession?.(a2), r2.webnnOnReleaseSession?.(a2), r2.webgpuOnReleaseSession?.(a2), i2.forEach((y2) => r2._OrtFree(y2)), d2.forEach((y2) => r2._OrtFree(y2)), r2._OrtReleaseSession(f2) !== 0 && $2("Can't release session."), it2.delete(a2);
  }, Ms2 = async (a2, r2, s2, f2, i2, d2, l2 = false) => {
    if (!a2) {
      r2.push(0);
      return;
    }
    let m2 = z2(), y2 = m2.PTR_SIZE, w2 = a2[0], T2 = a2[1], g2 = a2[3], v2 = g2, S2, U2;
    if (w2 === "string" && (g2 === "gpu-buffer" || g2 === "ml-tensor")) throw new Error("String tensor is not supported on GPU.");
    if (l2 && g2 !== "gpu-buffer") throw new Error(`External buffer must be provided for input/output index ${d2} when enableGraphCapture is true.`);
    if (g2 === "gpu-buffer") {
      let C2 = a2[2].gpuBuffer;
      U2 = mt2(He2(w2), T2);
      {
        let M2 = m2.webgpuRegisterBuffer;
        if (!M2) throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
        S2 = M2(C2, f2);
      }
    } else if (g2 === "ml-tensor") {
      let C2 = a2[2].mlTensor;
      U2 = mt2(He2(w2), T2);
      let M2 = m2.webnnRegisterMLTensor;
      if (!M2) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
      S2 = M2(f2, C2, He2(w2), T2);
    } else {
      let C2 = a2[2];
      if (Array.isArray(C2)) {
        U2 = y2 * C2.length, S2 = m2._malloc(U2), s2.push(S2);
        for (let M2 = 0; M2 < C2.length; M2++) {
          if (typeof C2[M2] != "string") throw new TypeError(`tensor data at index ${M2} is not a string`);
          m2.setValue(S2 + M2 * y2, be2(C2[M2], s2), "*");
        }
      } else {
        let M2 = m2.webnnIsGraphInput, q2 = m2.webnnIsGraphOutput;
        if (w2 !== "string" && M2 && q2) {
          let B2 = m2.UTF8ToString(i2);
          if (M2(f2, B2) || q2(f2, B2)) {
            let W2 = He2(w2);
            U2 = mt2(W2, T2), v2 = "ml-tensor";
            let oe2 = m2.webnnCreateTemporaryTensor, p2 = m2.webnnUploadTensor;
            if (!oe2 || !p2) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
            let ne2 = await oe2(f2, W2, T2);
            p2(ne2, new Uint8Array(C2.buffer, C2.byteOffset, C2.byteLength)), S2 = ne2;
          } else U2 = C2.byteLength, S2 = m2._malloc(U2), s2.push(S2), m2.HEAPU8.set(new Uint8Array(C2.buffer, C2.byteOffset, U2), S2);
        } else U2 = C2.byteLength, S2 = m2._malloc(U2), s2.push(S2), m2.HEAPU8.set(new Uint8Array(C2.buffer, C2.byteOffset, U2), S2);
      }
    }
    let R2 = m2.stackSave(), H2 = m2.stackAlloc(4 * T2.length);
    try {
      T2.forEach((M2, q2) => m2.setValue(H2 + q2 * y2, M2, y2 === 4 ? "i32" : "i64"));
      let C2 = m2._OrtCreateTensor(He2(w2), S2, U2, H2, T2.length, an2(v2));
      C2 === 0 && $2(`Can't create tensor for input/output. session=${f2}, index=${d2}.`), r2.push(C2);
    } finally {
      m2.stackRestore(R2);
    }
  }, er2 = async (a2, r2, s2, f2, i2, d2) => {
    let l2 = z2(), m2 = l2.PTR_SIZE, y2 = it2.get(a2);
    if (!y2) throw new Error(`cannot run inference. invalid session id: ${a2}`);
    let w2 = y2[0], T2 = y2[1], g2 = y2[2], v2 = y2[3], S2 = y2[4], U2 = y2[5], R2 = r2.length, H2 = f2.length, C2 = 0, M2 = [], q2 = [], B2 = [], W2 = [], oe2 = [], p2 = l2.stackSave(), ne2 = l2.stackAlloc(R2 * m2), X2 = l2.stackAlloc(R2 * m2), J2 = l2.stackAlloc(H2 * m2), Ce2 = l2.stackAlloc(H2 * m2);
    try {
      [C2, M2] = ls2(d2), $e2("wasm prepareInputOutputTensor");
      for (let _2 = 0; _2 < R2; _2++) await Ms2(s2[_2], q2, W2, a2, T2[r2[_2]], r2[_2], S2);
      for (let _2 = 0; _2 < H2; _2++) await Ms2(i2[_2], B2, W2, a2, g2[f2[_2]], R2 + f2[_2], S2);
      ze2("wasm prepareInputOutputTensor");
      for (let _2 = 0; _2 < R2; _2++) l2.setValue(ne2 + _2 * m2, q2[_2], "*"), l2.setValue(X2 + _2 * m2, T2[r2[_2]], "*");
      for (let _2 = 0; _2 < H2; _2++) l2.setValue(J2 + _2 * m2, B2[_2], "*"), l2.setValue(Ce2 + _2 * m2, g2[f2[_2]], "*");
      if (v2 && !U2) {
        let { handle: _2, outputPreferredLocations: ae2, outputPreferredLocationsEncoded: me2 } = v2;
        if (T2.length !== R2) throw new Error(`input count from feeds (${R2}) is expected to be always equal to model's input count (${T2.length}).`);
        $e2("wasm bindInputsOutputs");
        for (let Y2 = 0; Y2 < R2; Y2++) {
          let we2 = r2[Y2];
          await l2._OrtBindInput(_2, T2[we2], q2[Y2]) !== 0 && $2(`Can't bind input[${Y2}] for session=${a2}.`);
        }
        for (let Y2 = 0; Y2 < H2; Y2++) {
          let we2 = f2[Y2];
          i2[Y2]?.[3] ? (oe2.push(B2[Y2]), l2._OrtBindOutput(_2, g2[we2], B2[Y2], 0) !== 0 && $2(`Can't bind pre-allocated output[${Y2}] for session=${a2}.`)) : l2._OrtBindOutput(_2, g2[we2], 0, me2[we2]) !== 0 && $2(`Can't bind output[${Y2}] to ${ae2[Y2]} for session=${a2}.`);
        }
        ze2("wasm bindInputsOutputs"), it2.set(a2, [w2, T2, g2, v2, S2, true]);
      }
      l2.jsepOnRunStart?.(w2), l2.webnnOnRunStart?.(w2);
      let Z2;
      v2 ? Z2 = await l2._OrtRunWithBinding(w2, v2.handle, H2, J2, C2) : Z2 = await l2._OrtRun(w2, X2, ne2, R2, Ce2, H2, J2, C2), Z2 !== 0 && $2("failed to call OrtRun().");
      let x2 = [], A2 = [];
      $e2("wasm ProcessOutputTensor");
      for (let _2 = 0; _2 < H2; _2++) {
        let ae2 = Number(l2.getValue(J2 + _2 * m2, "*"));
        if (ae2 === B2[_2] || oe2.includes(B2[_2])) {
          x2.push(i2[_2]), ae2 !== B2[_2] && l2._OrtReleaseTensor(ae2) !== 0 && $2("Can't release tensor.");
          continue;
        }
        let me2 = l2.stackSave(), Y2 = l2.stackAlloc(4 * m2), we2 = false, re2, se2 = 0;
        try {
          l2._OrtGetTensorData(ae2, Y2, Y2 + m2, Y2 + 2 * m2, Y2 + 3 * m2) !== 0 && $2(`Can't access output tensor data on index ${_2}.`);
          let Te2 = m2 === 4 ? "i32" : "i64", qe2 = Number(l2.getValue(Y2, Te2));
          se2 = l2.getValue(Y2 + m2, "*");
          let bt2 = l2.getValue(Y2 + m2 * 2, "*"), wt2 = Number(l2.getValue(Y2 + m2 * 3, Te2)), Se2 = [];
          for (let ee2 = 0; ee2 < wt2; ee2++) Se2.push(Number(l2.getValue(bt2 + ee2 * m2, Te2)));
          l2._OrtFree(bt2) !== 0 && $2("Can't free memory for tensor dims.");
          let Ae2 = Se2.reduce((ee2, K2) => ee2 * K2, 1);
          re2 = ar2(qe2);
          let Be2 = v2?.outputPreferredLocations[f2[_2]];
          if (re2 === "string") {
            if (Be2 === "gpu-buffer" || Be2 === "ml-tensor") throw new Error("String tensor is not supported on GPU.");
            let ee2 = [];
            for (let K2 = 0; K2 < Ae2; K2++) {
              let G2 = l2.getValue(se2 + K2 * m2, "*"), V2 = l2.getValue(se2 + (K2 + 1) * m2, "*"), Ye2 = K2 === Ae2 - 1 ? void 0 : V2 - G2;
              ee2.push(l2.UTF8ToString(G2, Ye2));
            }
            x2.push([re2, Se2, ee2, "cpu"]);
          } else if (Be2 === "gpu-buffer" && Ae2 > 0) {
            let ee2 = l2.webgpuGetBuffer;
            if (!ee2) throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
            let K2 = ee2(se2), G2 = mt2(qe2, Ae2);
            if (G2 === void 0 || !sr2(re2)) throw new Error(`Unsupported data type: ${re2}`);
            we2 = true;
            {
              l2.webgpuRegisterBuffer(K2, a2, se2);
              let V2 = l2.webgpuCreateDownloader(K2, G2, a2);
              x2.push([re2, Se2, { gpuBuffer: K2, download: async () => {
                let Ye2 = await V2();
                return new (at2(re2))(Ye2);
              }, dispose: () => {
                l2._OrtReleaseTensor(ae2) !== 0 && $2("Can't release tensor.");
              } }, "gpu-buffer"]);
            }
          } else if (Be2 === "ml-tensor" && Ae2 > 0) {
            let ee2 = l2.webnnEnsureTensor, K2 = l2.webnnIsGraphInputOutputTypeSupported;
            if (!ee2 || !K2) throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');
            if (mt2(qe2, Ae2) === void 0 || !ir2(re2)) throw new Error(`Unsupported data type: ${re2}`);
            if (!K2(a2, re2, false)) throw new Error(`preferredLocation "ml-tensor" for ${re2} output is not supported by current WebNN Context.`);
            let V2 = await ee2(a2, se2, qe2, Se2, false);
            we2 = true, x2.push([re2, Se2, { mlTensor: V2, download: l2.webnnCreateMLTensorDownloader(se2, re2), dispose: () => {
              l2.webnnReleaseTensorId(se2), l2._OrtReleaseTensor(ae2);
            } }, "ml-tensor"]);
          } else if (Be2 === "ml-tensor-cpu-output" && Ae2 > 0) {
            let ee2 = l2.webnnCreateMLTensorDownloader(se2, re2)(), K2 = x2.length;
            we2 = true, A2.push((async () => {
              let G2 = [K2, await ee2];
              return l2.webnnReleaseTensorId(se2), l2._OrtReleaseTensor(ae2), G2;
            })()), x2.push([re2, Se2, [], "cpu"]);
          } else {
            let ee2 = at2(re2), K2 = new ee2(Ae2);
            new Uint8Array(K2.buffer, K2.byteOffset, K2.byteLength).set(l2.HEAPU8.subarray(se2, se2 + K2.byteLength)), x2.push([re2, Se2, K2, "cpu"]);
          }
        } finally {
          l2.stackRestore(me2), re2 === "string" && se2 && l2._free(se2), we2 || l2._OrtReleaseTensor(ae2);
        }
      }
      v2 && !S2 && (l2._OrtClearBoundOutputs(v2.handle) !== 0 && $2("Can't clear bound outputs."), it2.set(a2, [w2, T2, g2, v2, S2, false]));
      for (let [_2, ae2] of await Promise.all(A2)) x2[_2][2] = ae2;
      return ze2("wasm ProcessOutputTensor"), x2;
    } finally {
      l2.webnnOnRunEnd?.(w2), l2.stackRestore(p2), s2.forEach((Z2) => {
        Z2 && Z2[3] === "gpu-buffer" && l2.webgpuUnregisterBuffer(Z2[2].gpuBuffer);
      }), i2.forEach((Z2) => {
        Z2 && Z2[3] === "gpu-buffer" && l2.webgpuUnregisterBuffer(Z2[2].gpuBuffer);
      }), q2.forEach((Z2) => l2._OrtReleaseTensor(Z2)), B2.forEach((Z2) => l2._OrtReleaseTensor(Z2)), W2.forEach((Z2) => l2._free(Z2)), C2 !== 0 && l2._OrtReleaseRunOptions(C2), M2.forEach((Z2) => l2._free(Z2));
    }
  }, tr2 = (a2) => {
    let r2 = z2(), s2 = it2.get(a2);
    if (!s2) throw new Error("invalid session id");
    let f2 = s2[0], i2 = r2._OrtEndProfiling(f2);
    i2 === 0 && $2("Can't get an profile file name."), r2._OrtFree(i2);
  }, rr2 = (a2) => {
    let r2 = [];
    for (let s2 of a2) {
      let f2 = s2[2];
      !Array.isArray(f2) && "buffer" in f2 && r2.push(f2.buffer);
    }
    return r2;
  };
});
var ut2;
var Ee2;
var Ut2;
var lr2;
var pr2;
var dr2;
var ln2;
var pn2;
var ht2;
var yt2;
var Tc2;
var Us2;
var Cs2;
var Ds2;
var Ps2;
var _s2;
var Rs2;
var Ns2;
var mn2 = k2(() => {
  "use strict";
  Ve2();
  en2();
  je2();
  Yt2();
  ut2 = () => !!Q2.wasm.proxy && typeof document < "u", Ut2 = false, lr2 = false, pr2 = false, pn2 = /* @__PURE__ */ new Map(), ht2 = (a2, r2) => {
    let s2 = pn2.get(a2);
    s2 ? s2.push(r2) : pn2.set(a2, [r2]);
  }, yt2 = () => {
    if (Ut2 || !lr2 || pr2 || !Ee2) throw new Error("worker not ready");
  }, Tc2 = (a2) => {
    switch (a2.data.type) {
      case "init-wasm":
        Ut2 = false, a2.data.err ? (pr2 = true, ln2[1](a2.data.err)) : (lr2 = true, ln2[0]()), dr2 && (URL.revokeObjectURL(dr2), dr2 = void 0);
        break;
      case "init-ep":
      case "copy-from":
      case "create":
      case "release":
      case "run":
      case "end-profiling": {
        let r2 = pn2.get(a2.data.type);
        a2.data.err ? r2.shift()[1](a2.data.err) : r2.shift()[0](a2.data.out);
        break;
      }
      default:
    }
  }, Us2 = async () => {
    if (!lr2) {
      if (Ut2) throw new Error("multiple calls to 'initWasm()' detected.");
      if (pr2) throw new Error("previous call to 'initWasm()' failed.");
      if (Ut2 = true, ut2()) return new Promise((a2, r2) => {
        Ee2?.terminate(), fs2().then(([s2, f2]) => {
          try {
            Ee2 = f2, Ee2.onerror = (d2) => r2(d2), Ee2.onmessage = Tc2, ln2 = [a2, r2];
            let i2 = { type: "init-wasm", in: Q2 };
            !i2.in.wasm.wasmPaths && (s2 || rn2) && (i2.in.wasm.wasmPaths = { wasm: new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href }), Ee2.postMessage(i2), dr2 = s2;
          } catch (i2) {
            r2(i2);
          }
        }, r2);
      });
      try {
        await Jt2(Q2.wasm), await Xt2(Q2), lr2 = true;
      } catch (a2) {
        throw pr2 = true, a2;
      } finally {
        Ut2 = false;
      }
    }
  }, Cs2 = async (a2) => {
    if (ut2()) return yt2(), new Promise((r2, s2) => {
      ht2("init-ep", [r2, s2]);
      let f2 = { type: "init-ep", in: { epName: a2, env: Q2 } };
      Ee2.postMessage(f2);
    });
    await Zt2(Q2, a2);
  }, Ds2 = async (a2) => ut2() ? (yt2(), new Promise((r2, s2) => {
    ht2("copy-from", [r2, s2]);
    let f2 = { type: "copy-from", in: { buffer: a2 } };
    Ee2.postMessage(f2, [a2.buffer]);
  })) : xt2(a2), Ps2 = async (a2, r2) => {
    if (ut2()) {
      if (r2?.preferredOutputLocation) throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
      return yt2(), new Promise((s2, f2) => {
        ht2("create", [s2, f2]);
        let i2 = { type: "create", in: { model: a2, options: { ...r2 } } }, d2 = [];
        a2 instanceof Uint8Array && d2.push(a2.buffer), Ee2.postMessage(i2, d2);
      });
    } else return Kt2(a2, r2);
  }, _s2 = async (a2) => {
    if (ut2()) return yt2(), new Promise((r2, s2) => {
      ht2("release", [r2, s2]);
      let f2 = { type: "release", in: a2 };
      Ee2.postMessage(f2);
    });
    Qt2(a2);
  }, Rs2 = async (a2, r2, s2, f2, i2, d2) => {
    if (ut2()) {
      if (s2.some((l2) => l2[3] !== "cpu")) throw new Error("input tensor on GPU is not supported for proxy.");
      if (i2.some((l2) => l2)) throw new Error("pre-allocated output tensor is not supported for proxy.");
      return yt2(), new Promise((l2, m2) => {
        ht2("run", [l2, m2]);
        let y2 = s2, w2 = { type: "run", in: { sessionId: a2, inputIndices: r2, inputs: y2, outputIndices: f2, options: d2 } };
        Ee2.postMessage(w2, rr2(y2));
      });
    } else return er2(a2, r2, s2, f2, i2, d2);
  }, Ns2 = async (a2) => {
    if (ut2()) return yt2(), new Promise((r2, s2) => {
      ht2("end-profiling", [r2, s2]);
      let f2 = { type: "end-profiling", in: a2 };
      Ee2.postMessage(f2);
    });
    tr2(a2);
  };
});
var ks2;
var vc2;
var mr2;
var Ws2 = k2(() => {
  "use strict";
  Ve2();
  mn2();
  st2();
  qt2();
  sn2();
  ks2 = (a2, r2) => {
    switch (a2.location) {
      case "cpu":
        return [a2.type, a2.dims, a2.data, "cpu"];
      case "gpu-buffer":
        return [a2.type, a2.dims, { gpuBuffer: a2.gpuBuffer }, "gpu-buffer"];
      case "ml-tensor":
        return [a2.type, a2.dims, { mlTensor: a2.mlTensor }, "ml-tensor"];
      default:
        throw new Error(`invalid data location: ${a2.location} for ${r2()}`);
    }
  }, vc2 = (a2) => {
    switch (a2[3]) {
      case "cpu":
        return new Le2(a2[0], a2[2], a2[1]);
      case "gpu-buffer": {
        let r2 = a2[0];
        if (!sr2(r2)) throw new Error(`not supported data type: ${r2} for deserializing GPU tensor`);
        let { gpuBuffer: s2, download: f2, dispose: i2 } = a2[2];
        return Le2.fromGpuBuffer(s2, { dataType: r2, dims: a2[1], download: f2, dispose: i2 });
      }
      case "ml-tensor": {
        let r2 = a2[0];
        if (!ir2(r2)) throw new Error(`not supported data type: ${r2} for deserializing MLTensor tensor`);
        let { mlTensor: s2, download: f2, dispose: i2 } = a2[2];
        return Le2.fromMLTensor(s2, { dataType: r2, dims: a2[1], download: f2, dispose: i2 });
      }
      default:
        throw new Error(`invalid data location: ${a2[3]}`);
    }
  }, mr2 = class {
    async fetchModelAndCopyToWasmMemory(r2) {
      return Ds2(await Mt2(r2));
    }
    async loadModel(r2, s2) {
      tt2();
      let f2;
      typeof r2 == "string" ? f2 = await this.fetchModelAndCopyToWasmMemory(r2) : f2 = r2, [this.sessionId, this.inputNames, this.outputNames, this.inputMetadata, this.outputMetadata] = await Ps2(f2, s2), rt2();
    }
    async dispose() {
      return _s2(this.sessionId);
    }
    async run(r2, s2, f2) {
      tt2();
      let i2 = [], d2 = [];
      Object.entries(r2).forEach((v2) => {
        let S2 = v2[0], U2 = v2[1], R2 = this.inputNames.indexOf(S2);
        if (R2 === -1) throw new Error(`invalid input '${S2}'`);
        i2.push(U2), d2.push(R2);
      });
      let l2 = [], m2 = [];
      Object.entries(s2).forEach((v2) => {
        let S2 = v2[0], U2 = v2[1], R2 = this.outputNames.indexOf(S2);
        if (R2 === -1) throw new Error(`invalid output '${S2}'`);
        l2.push(U2), m2.push(R2);
      });
      let y2 = i2.map((v2, S2) => ks2(v2, () => `input "${this.inputNames[d2[S2]]}"`)), w2 = l2.map((v2, S2) => v2 ? ks2(v2, () => `output "${this.outputNames[m2[S2]]}"`) : null), T2 = await Rs2(this.sessionId, d2, y2, m2, w2, f2), g2 = {};
      for (let v2 = 0; v2 < T2.length; v2++) g2[this.outputNames[m2[v2]]] = l2[v2] ?? vc2(T2[v2]);
      return rt2(), g2;
    }
    startProfiling() {
    }
    endProfiling() {
      Ns2(this.sessionId);
    }
  };
});
var Gs2 = {};
At2(Gs2, { OnnxruntimeWebAssemblyBackend: () => hr2, initializeFlags: () => Fs2, wasmBackend: () => Ec2 });
var Fs2;
var hr2;
var Ec2;
var $s2 = k2(() => {
  "use strict";
  Ve2();
  mn2();
  Ws2();
  Fs2 = () => {
    (typeof Q2.wasm.initTimeout != "number" || Q2.wasm.initTimeout < 0) && (Q2.wasm.initTimeout = 0);
    let a2 = Q2.wasm.simd;
    if (typeof a2 != "boolean" && a2 !== void 0 && a2 !== "fixed" && a2 !== "relaxed" && (console.warn(`Property "env.wasm.simd" is set to unknown value "${a2}". Reset it to \`false\` and ignore SIMD feature checking.`), Q2.wasm.simd = false), typeof Q2.wasm.proxy != "boolean" && (Q2.wasm.proxy = false), typeof Q2.wasm.trace != "boolean" && (Q2.wasm.trace = false), typeof Q2.wasm.numThreads != "number" || !Number.isInteger(Q2.wasm.numThreads) || Q2.wasm.numThreads <= 0) if (typeof self < "u" && !self.crossOriginIsolated) Q2.wasm.numThreads = 1;
    else {
      let r2 = typeof navigator > "u" ? qr2("node:os").cpus().length : navigator.hardwareConcurrency;
      Q2.wasm.numThreads = Math.min(4, Math.ceil((r2 || 1) / 2));
    }
  }, hr2 = class {
    async init(r2) {
      Fs2(), await Us2(), await Cs2(r2);
    }
    async createInferenceSessionHandler(r2, s2) {
      let f2 = new mr2();
      return await f2.loadModel(r2, s2), f2;
    }
  }, Ec2 = new hr2();
});
Ve2();
Ve2();
Ve2();
var Xa2 = "1.27.0";
{
  let a2 = ($s2(), zt2(Gs2)).wasmBackend;
  Qe2("webgpu", a2, 5), Qe2("webnn", a2, 5), Qe2("cpu", a2, 10), Qe2("wasm", a2, 10);
}
Object.defineProperty(Q2.versions, "web", { value: Xa2, enumerable: true });

// lib/matting/rvm-matte.ts
var STATE_CHANNELS = [16, 20, 40, 64, 80, 128];
function stateDims(srcH, srcW) {
  return STATE_CHANNELS.map((channels, i2) => {
    const div = 2 ** (i2 + 1);
    return {
      channels,
      h: Math.max(1, Math.floor(srcH / div)),
      w: Math.max(1, Math.floor(srcW / div))
    };
  });
}
function zeroState(channels, h2, w2) {
  return new Le2(
    "float32",
    new Float32Array(channels * h2 * w2),
    [1, channels, h2, w2]
  );
}
function roundUp(value, m2) {
  return Math.max(m2, Math.ceil(value / m2) * m2);
}
async function createRvmMatteProvider(options) {
  if (options.wasmPaths) {
    Q2.wasm.wasmPaths = options.wasmPaths;
  }
  const session = await Xf.create(options.modelUrl, {
    executionProviders: ["webgpu", "wasm"],
    graphOptimizationLevel: "all"
  });
  let canvas = null;
  let ctx = null;
  let state = null;
  let procW = 0;
  let procH = 0;
  let downsampleRatio;
  const DSR = 0.25;
  downsampleRatio = new Le2("float32", [DSR], [1]);
  let lastAlpha = new Float32Array([1]);
  function ensureCanvas(w2, h2) {
    if (!canvas) {
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get 2D context for RVM");
    }
    if (procW !== w2 || procH !== h2) {
      procW = w2;
      procH = h2;
      canvas.width = w2;
      canvas.height = h2;
      const dims = stateDims(h2, w2);
      const states = dims.map((d2) => zeroState(d2.channels, d2.h, d2.w));
      state = {
        r1: states[0],
        r2: states[1],
        r3: states[2],
        r4: states[3],
        r5: states[4],
        r6: states[5]
      };
      lastAlpha = new Float32Array(w2 * h2).fill(1);
    }
  }
  return {
    isReady() {
      return session !== null && state !== null;
    },
    async segment(source, width, height) {
      const maxSide = 512;
      const scale = Math.min(1, maxSide / Math.max(width, height));
      const w2 = roundUp(Math.round(width * scale), 64);
      const h2 = roundUp(Math.round(height * scale), 64);
      ensureCanvas(w2, h2);
      ctx.clearRect(0, 0, w2, h2);
      ctx.drawImage(source, 0, 0, w2, h2);
      const pixels = ctx.getImageData(0, 0, w2, h2).data;
      const srcData = new Float32Array(4 * h2 * w2);
      for (let i2 = 0; i2 < w2 * h2; i2++) {
        const s2 = i2 * 4;
        const d2 = i2 * 4;
        srcData[d2] = (pixels[s2] ?? 0) / 255;
        srcData[d2 + 1] = (pixels[s2 + 1] ?? 0) / 255;
        srcData[d2 + 2] = (pixels[s2 + 2] ?? 0) / 255;
        srcData[d2 + 3] = lastAlpha[i2] ?? 1;
      }
      const srcTensor = new Le2("float32", srcData, [1, 4, h2, w2]);
      const feeds = {
        src: srcTensor,
        r1i: state.r1,
        r2i: state.r2,
        r3i: state.r3,
        r4i: state.r4,
        r5i: state.r5,
        r6i: state.r6,
        downsample_ratio: downsampleRatio
      };
      const out = await session.run(feeds);
      const pha = out["pha"];
      if (!pha || !(pha.data instanceof Float32Array)) {
        return { width: w2, height: h2, data: lastAlpha };
      }
      const alpha = new Float32Array(pha.data);
      lastAlpha = alpha;
      const next = (name, prev) => out[name] instanceof Le2 ? out[name] : prev;
      state.r1 = next("r1o", state.r1);
      state.r2 = next("r2o", state.r2);
      state.r3 = next("r3o", state.r3);
      state.r4 = next("r4o", state.r4);
      state.r5 = next("r5o", state.r5);
      state.r6 = next("r6o", state.r6);
      return { width: w2, height: h2, data: alpha };
    },
    destroy() {
      state = null;
      canvas = null;
      ctx = null;
      void session.release();
    }
  };
}

// lib/matting/index.ts
async function isWebGpuAvailable() {
  try {
    const gpu = navigator.gpu;
    if (!gpu) return false;
    const adapter = await navigator.gpu?.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}
async function createMatteProvider(options) {
  const wantRvm = options.rvmModelUrl && (options.quality === "high" || options.quality === "auto" && await isWebGpuAvailable());
  if (wantRvm && options.rvmModelUrl) {
    try {
      const provider2 = await createRvmMatteProvider({
        modelUrl: options.rvmModelUrl,
        wasmPaths: options.ortWasmPaths
      });
      return { provider: provider2, backend: "rvm" };
    } catch (error) {
      console.warn(
        "[CamTuner] RVM matte unavailable, falling back to MediaPipe:",
        error
      );
    }
  }
  const provider = createMediaPipeMatteProvider({
    filesetUrl: options.filesetUrl,
    modelAssetPath: options.selfieModelUrl
  });
  return { provider, backend: "mediapipe" };
}
export {
  createMatteProvider
};
