import { jsxs as V, jsx as C, Fragment as Oe } from "react/jsx-runtime";
import Kn, { useMemo as ft, useRef as lt, useCallback as Y, useEffect as wt, useState as St, createContext as Qn, useContext as Jn, createElement as Ir, memo as Yo } from "react";
import { Select as Ar, Text as cn, Button as _c, Popover as fe, Skeleton as Ae, Checkbox as wn } from "@harnessio/ui/components";
import { isNil as pe, indexOf as Ec, last as Go, defaults as ni, minBy as Nc, isEmpty as en, defaultsDeep as Or, uniq as Hn, compact as Rc, cloneDeep as Lc, isUndefined as cr, groupBy as Vo, forEach as kc, uniqueId as ri, clone as Ic, isString as Oc, trim as Bc, upperCase as es, startCase as Pc, lowerCase as Fc, isEqual as Uc, first as ns, throttle as Hc } from "lodash-es";
import { EMPTY as Xo, Subject as Aa, BehaviorSubject as zc } from "rxjs";
function kS() {
  return /* @__PURE__ */ V("div", { children: [
    /* @__PURE__ */ C("h1", { children: "Welcome to Visualization Library!" }),
    /* @__PURE__ */ C("p", { children: "React 17 compatible visualization components" })
  ] });
}
var yi = {}, rs;
function $c() {
  return rs || (rs = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.toSeconds = e.end = e.parse = e.pattern = void 0;
    var t = "\\d+", n = "".concat(t, "(?:[\\.,]").concat(t, ")?"), r = "(".concat(t, "Y)?(").concat(t, "M)?(").concat(t, "W)?(").concat(t, "D)?"), i = "T(".concat(n, "H)?(").concat(n, "M)?(").concat(n, "S)?"), a = "P(?:".concat(r, "(?:").concat(i, ")?)"), s = [
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds"
    ], o = Object.freeze({
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    e.pattern = new RegExp(a);
    var c = function(h) {
      var d = h.replace(/,/g, ".").match(e.pattern);
      if (!d)
        throw new RangeError("invalid duration: ".concat(h));
      var f = d.slice(1);
      if (f.filter(function(m) {
        return m != null;
      }).length === 0)
        throw new RangeError("invalid duration: ".concat(h));
      if (f.filter(function(m) {
        return /\./.test(m || "");
      }).length > 1)
        throw new RangeError("only the smallest unit can be fractional");
      return f.reduce(function(m, y, g) {
        return m[s[g]] = parseFloat(y || "0") || 0, m;
      }, {});
    };
    e.parse = c;
    var l = function(h, d) {
      d === void 0 && (d = /* @__PURE__ */ new Date());
      var f = Object.assign({}, o, h), m = d.getTime(), y = new Date(m);
      y.setFullYear(y.getFullYear() + f.years), y.setMonth(y.getMonth() + f.months), y.setDate(y.getDate() + f.days);
      var g = f.hours * 3600 * 1e3, p = f.minutes * 60 * 1e3;
      return y.setMilliseconds(y.getMilliseconds() + f.seconds * 1e3 + g + p), y.setDate(y.getDate() + f.weeks * 7), y;
    };
    e.end = l;
    var u = function(h, d) {
      d === void 0 && (d = /* @__PURE__ */ new Date());
      var f = Object.assign({}, o, h), m = d.getTime(), y = new Date(m), g = (0, e.end)(f, y), p = d.getTimezoneOffset(), x = g.getTimezoneOffset(), w = (p - x) * 60, v = (g.getTime() - y.getTime()) / 1e3;
      return v + w;
    };
    e.toSeconds = u, e.default = {
      end: e.end,
      toSeconds: e.toSeconds,
      pattern: e.pattern,
      parse: e.parse
    };
  })(yi)), yi;
}
var is = $c();
const Bn = (e, t = `Unexpectedly reached unreachable code with value: ${e}`) => {
  throw Error(t);
}, Ne = (e, t = "Unexpectedly found undefined value") => {
  if (e == null)
    throw Error(t);
  return e;
};
var j = /* @__PURE__ */ ((e) => (e.Millisecond = "ms", e.Second = "s", e.Minute = "m", e.Hour = "h", e.Day = "d", e.Week = "w", e.Month = "M", e.Year = "y", e))(j || {}), Wc = /* @__PURE__ */ ((e) => (e.Long = "long", e.Short = "short", e))(Wc || {});
class ct {
  constructor(t, n) {
    this.value = t, this.unit = n, this.toUnitString(), this.millis = this.normalizeToMillis(isNaN(t) ? 0 : t, n);
  }
  static TIME_UNITS = [
    j.Year,
    j.Month,
    j.Week,
    j.Day,
    j.Hour,
    j.Minute,
    j.Second,
    j.Millisecond
  ];
  millis;
  toMillis() {
    return this.millis;
  }
  static parse(t) {
    return new ct(is.toSeconds(is.parse(t)), j.Second);
  }
  getAmountForUnit(t) {
    return this.toMillis() / this.unitInMillis(t);
  }
  static reduce(t) {
    const n = t.reduce(
      (r, i) => r + i.toMillis(),
      0
    );
    return new ct(n, j.Millisecond);
  }
  toIso8601DurationString() {
    return `PT${this.toMillis() / 1e3}S`;
  }
  toMultiUnitDurations(t = j.Second, n, r = !0) {
    const i = this.getMostSignificantUnitOnly(n), a = this.millis - i.toMillis();
    if (i.getAmountForUnit(t) < 1)
      return r ? [new ct(0, t)] : [];
    if (i.unit === t || a === 0)
      return [i];
    const s = a >= this.unitInMillis(j.Millisecond);
    return [
      i,
      ...s ? new ct(
        a,
        j.Millisecond
      ).toMultiUnitDurations(t, n, !1) : []
    ];
  }
  toMultiUnitString(t = j.Second, n = !0, r = "short") {
    const i = this.getMostSignificantUnitOnly(), a = this.millis - i.toMillis();
    if (i.getAmountForUnit(t) < 1)
      return n ? new ct(0, t).toFormattedString(r) : "";
    if (i.unit === t || a === 0)
      return i.toFormattedString(r);
    const s = r === "long" ? " " : "";
    return [
      i.toFormattedString(r),
      new ct(a, j.Millisecond).toMultiUnitString(
        t,
        !1,
        r
      )
    ].join(s);
  }
  toFormattedString(t = "short") {
    return t === "short" ? this.toString() : this.toLongString();
  }
  getMostSignificantUnitOnly(t) {
    const r = (pe(t) ? ct.TIME_UNITS : ct.TIME_UNITS.slice(
      Ec(ct.TIME_UNITS, t)
    )).find((a) => this.getAmountForUnit(a) >= 1) || j.Millisecond, i = Math.floor(
      this.getAmountForUnit(r)
    );
    return new ct(i, r);
  }
  /**
   * Returns the most significant whole unit of the duration.
   * Eg:
   * - `PT1H40M` -> `PT100M`
   * - `P1W2D` -> `P9D`
   * - `P1W2DT2H` -> `P218H`
   *
   * @param minSupportedUnit
   * @param maxSupportedUnit
   */
  getMostSignificantWholeUnitOnly(t, n) {
    const r = this.toMultiUnitDurations(
      t,
      n,
      !1
    ), i = Go(r)?.unit ?? t ?? j.Millisecond, a = Math.floor(
      this.getAmountForUnit(i)
    );
    return new ct(a, i);
  }
  toString() {
    return `${this.value}${this.unit}`;
  }
  toRelativeString() {
    return `Last ${this.toLongString()}`;
  }
  toLongString() {
    return `${this.value} ${this.value === 1 ? this.toUnitString() : `${this.toUnitString()}s`}`;
  }
  isEqualDuration(t) {
    return this.unit === t.unit && this.value === t.value;
  }
  isEquivalentDuration(t) {
    return this.toMillis() === t.toMillis();
  }
  isGreaterDuration(t) {
    return this.toMillis() > t.toMillis();
  }
  isLesserDuration(t) {
    return this.toMillis() < t.toMillis();
  }
  normalizeToMillis(t, n) {
    switch (n) {
      case j.Year: {
        const r = /* @__PURE__ */ new Date(), i = new Date(r);
        return i.setFullYear(i.getFullYear() - t), r.getTime() - i.getTime();
      }
      case j.Month: {
        const r = /* @__PURE__ */ new Date(), i = new Date(r);
        return i.setMonth(i.getMonth() - t), r.getTime() - i.getTime();
      }
      case j.Week:
      case j.Day:
      case j.Hour:
      case j.Minute:
      case j.Second:
      case j.Millisecond:
        return t * this.unitInMillis(n);
      default:
        return Bn(n);
    }
  }
  toUnitString() {
    switch (this.unit) {
      case j.Year:
        return "year";
      case j.Month:
        return "month";
      case j.Week:
        return "week";
      case j.Day:
        return "day";
      case j.Hour:
        return "hour";
      case j.Minute:
        return "minute";
      case j.Second:
        return "second";
      case j.Millisecond:
        return "millisecond";
      default:
        return Bn(this.unit);
    }
  }
  unitInMillis(t) {
    switch (t) {
      case j.Year:
        return 365 * 24 * 60 * 60 * 1e3;
      case j.Month:
        return 720 * 60 * 60 * 1e3;
      case j.Week:
        return 1440 * 60 * 1e3 * 7;
      case j.Day:
        return 1440 * 60 * 1e3;
      case j.Hour:
        return 3600 * 1e3;
      case j.Minute:
        return 60 * 1e3;
      case j.Second:
        return 1e3;
      case j.Millisecond:
        return 1;
      default:
        return Bn(t);
    }
  }
}
function Yc(e, t) {
  if (e === "NONE")
    return "None";
  if (e === "AUTO") {
    const n = t.filter(
      (i) => i instanceof ct
    );
    return `Auto (${Gc(n).toString()})`;
  }
  return e.toString();
}
function Gc(e) {
  return e[0] || {};
}
function Vc({
  interval: e,
  intervalOptions: t = [],
  disabled: n = !1,
  onChange: r,
  label: i,
  placeholder: a = "Select interval"
}) {
  const s = ft(() => t.map((c) => ({
    label: Yc(c, t),
    value: c
  })), [t]), o = n || s.length <= 1;
  return /* @__PURE__ */ C(
    Ar,
    {
      options: s,
      value: e,
      onChange: r,
      disabled: o,
      label: i,
      placeholder: a
    }
  );
}
const Xc = 250;
function vn(e, t, n) {
  const { debounceMs: r = Xc, threshold: i = 1 } = n ?? {}, a = lt(null), s = lt(t);
  s.current = t;
  const o = lt(i);
  o.current = i;
  const c = Y(
    (l) => {
      const u = l[0];
      if (!u) return;
      const { width: h, height: d } = u.contentRect, f = a.current;
      f !== null && Math.abs(h - f.width) < o.current && Math.abs(d - f.height) < o.current || (a.current = { width: h, height: d }, s.current({ width: h, height: d }));
    },
    []
  );
  wt(() => {
    const l = e.current;
    if (!l) return;
    let u = null, h = null;
    const d = new ResizeObserver((f) => {
      u && (clearTimeout(u), u = null), h && (cancelAnimationFrame(h), h = null), u = setTimeout(() => {
        h = requestAnimationFrame(() => {
          c(f);
        });
      }, r);
    });
    return d.observe(l), () => {
      u && clearTimeout(u), h && cancelAnimationFrame(h), d.disconnect();
    };
  }, [e, r, c]);
}
var dt = /* @__PURE__ */ ((e) => (e.Row = "row", e.Column = "column", e))(dt || {}), tr = /* @__PURE__ */ ((e) => (e.ExtraSmall = "extra-small", e.Small = "small", e.Medium = "medium", e))(tr || {}), B = /* @__PURE__ */ ((e) => (e.Bottom = "bottom", e.Right = "right", e.TopRight = "top-right", e.TopLeft = "top-left", e.Top = "top", e.Left = "left", e.Auto = "auto", e.None = "none", e))(B || {});
function jc(e) {
  return null;
}
const Da = (...e) => e.filter(Boolean).join(" ");
function qc({
  bgColor: e,
  label: t,
  className: n,
  isDisabled: r,
  value: i
}) {
  return /* @__PURE__ */ V(Oe, { children: [
    /* @__PURE__ */ C(
      "span",
      {
        className: Da(
          n,
          "legend-symbol min-h-2 min-w-2 mb-cn-4xs rounded-cn-1",
          { "opacity-38 bg-cn-gray-primary": r }
        ),
        style: { backgroundColor: r ? void 0 : e }
      }
    ),
    /* @__PURE__ */ C(cn, { variant: "body-single-line-code", children: t }),
    i && /* @__PURE__ */ C(cn, { variant: "body-single-line-code", children: i })
  ] });
}
function as({
  entry: e,
  fontSize: t,
  isClickable: n,
  isDisabled: r,
  onClick: i
}) {
  const a = {
    "extra-small": "text-cn-size-1",
    // tr-text-utility-01
    small: "text-cn-size-2",
    // tr-text-utility-02
    medium: "text-cn-size-4"
    // tr-text-body-01
  }[t], s = e.data.displayValue || e.data.value;
  return /* @__PURE__ */ V(
    "div",
    {
      className: "legend-entry group flex min-w-0 flex-row items-center",
      onClick: () => i(e),
      children: [
        e.name ? /* @__PURE__ */ C(_c, { size: "sm", variant: "ghost", disabled: !n, children: /* @__PURE__ */ C(
          qc,
          {
            bgColor: e.color,
            isDisabled: r,
            label: e.name,
            value: s
          }
        ) }) : /* @__PURE__ */ C(
          "span",
          {
            className: `legend-label empty min-w-[1.5rem] flex-1 truncate italic text-cn-3 hover:!text-cn-brand ${a}`,
            children: "<EMPTY>"
          }
        ),
        e.filterData && /* @__PURE__ */ C(
          jc,
          {
            className: "pl-cn-xs opacity-0 group-hover:opacity-100",
            attribute: e.filterData.attribute,
            metadata: e.filterData.allMetadata,
            value: e.name,
            subpath: e.filterData.subpath
          }
        )
      ]
    }
  );
}
const Zc = 14, Kc = 32, Qc = 16, ss = 14, Jc = 16, tu = 8;
function eu(e) {
  const t = e.name.length * ss * 0.55, n = (e.data.displayValue ?? e.data.value ?? "").toString().length * ss * 0.55 + tu;
  return Math.min(
    Jc + t + n + Kc,
    500
  );
}
function os() {
  return Zc + Qc;
}
function nu(e, t, n, r) {
  const i = {
    width: 84,
    height: os()
  }, a = [], s = [];
  if (e.reduce((o, c) => {
    if (r) {
      const l = os();
      if (o + l >= n - i.height)
        s.push(c);
      else
        return a.push(c), o + l;
    } else {
      const l = eu(c);
      if (o + l >= t - i.width)
        s.push(c);
      else
        return a.push(c), o + l;
    }
    return o;
  }, 0), a.length === 0 && s.length > 0) {
    const o = s.shift();
    o && a.push(o);
  }
  return s.length === 1 && (a.push(s[0]), s.pop()), { legendsInView: a, legendsInTooltip: s };
}
function Ma({ legendData: e, className: t }) {
  const n = lt(null), [r, i] = St(e.series), [a, s] = St([]), o = e.interactionHandler?.onClick !== void 0, c = ru(e.layout, e.position), l = {
    "extra-small": "text-cn-size-1",
    small: "text-cn-size-2",
    medium: "text-cn-size-4 font-semibold"
  }[e.fontSize], u = Y(() => {
    if (!n.current) return;
    const { width: m, height: y } = n.current.getBoundingClientRect(), g = e.layout === dt.Column, { legendsInView: p, legendsInTooltip: x } = nu(e.series, m, y, g);
    i(p), s(x);
  }, [e.series, e.layout]);
  wt(() => {
    u();
  }, [u]), vn(n, u);
  const h = (m) => {
    e.interactionHandler?.onClick?.(m);
  }, d = (m) => m.disabled ?? !1, f = r.length > 0 ? r : e.series;
  return /* @__PURE__ */ V(
    "div",
    {
      ref: n,
      className: `legend-entries flex-1 flex flex-wrap gap-2 ${c} ${t || ""}`,
      children: [
        f.map((m, y) => /* @__PURE__ */ C(
          as,
          {
            entry: m,
            fontSize: e.fontSize,
            isClickable: o,
            isDisabled: d(m),
            onClick: h
          },
          m.name || `legend-${y}`
        )),
        a.length > 0 && /* @__PURE__ */ V(fe.Root, { children: [
          /* @__PURE__ */ C(fe.Trigger, { asChild: !0, children: /* @__PURE__ */ V(
            "button",
            {
              type: "button",
              className: `max-w-max cursor-pointer whitespace-nowrap rounded-cn-2 px-cn-xs py-cn-4xs text-cn-3 hover:bg-cn-2 ${l}`,
              children: [
                "+",
                a.length,
                " More"
              ]
            }
          ) }),
          /* @__PURE__ */ C(
            fe.Content,
            {
              className: "legend-popover rounded-cn-2 bg-cn-1 p-cn-xs shadow-cn-2",
              side: "bottom",
              align: "start",
              sideOffset: 4,
              children: /* @__PURE__ */ C("div", { className: "legend-popover-scroll overflow-auto", children: a.map((m, y) => /* @__PURE__ */ C(
                as,
                {
                  entry: m,
                  fontSize: e.fontSize,
                  isClickable: o,
                  isDisabled: d(m),
                  onClick: h
                },
                m.name || `overflow-${y}`
              )) })
            }
          )
        ] })
      ]
    }
  );
}
function ru(e, t) {
  const n = `position-${t}`;
  switch (e) {
    case dt.Row:
      return t === B.TopLeft ? `legend-row ${n} flex-row justify-start items-center` : t === B.TopRight ? `legend-row ${n} flex-row justify-end items-center` : `legend-row ${n} flex-row justify-center items-center`;
    case dt.Column:
    default:
      return t === B.Right ? `legend-column ${n} flex-col justify-start items-start h-3/5` : `legend-column ${n} flex-col justify-center items-center`;
  }
}
const jo = {
  info(...e) {
    console.info(...e);
  },
  debug(...e) {
    console.debug(...e);
  },
  error(...e) {
    console.error(...e);
  },
  warn(...e) {
    console.warn(...e);
  }
}, qo = Qn(void 0);
function IS({
  children: e,
  logger: t = jo
}) {
  return /* @__PURE__ */ C(qo.Provider, { value: t, children: e });
}
function OS() {
  const e = Jn(qo);
  return e === void 0 ? jo : e;
}
const Zo = {
  navigate(e) {
    window.location.href = e;
  },
  addQueryParametersToUrl(e) {
  }
}, Ko = Qn(void 0);
function BS({
  children: e,
  navigation: t = Zo
}) {
  return /* @__PURE__ */ C(Ko.Provider, { value: t, children: e });
}
function PS() {
  const e = Jn(Ko);
  return e === void 0 ? Zo : e;
}
class un {
  constructor(t, n) {
    this.startTime = t, this.endTime = n;
  }
  static fromUrlString(t) {
    const r = /(\d+)-(\d+)/.exec(t);
    if (!(!r || r.length !== 3))
      try {
        return new un(
          new Date(parseInt(r[1])),
          new Date(parseInt(r[2]))
        );
      } catch {
        return;
      }
  }
  toUrlString() {
    return `${this.startTime.getTime()}-${this.endTime.getTime()}`;
  }
  toDisplayString() {
    return `${this.startTime.toLocaleString()} - ${this.endTime.toLocaleString()}`;
  }
  isCustom() {
    return !1;
  }
  toDurationMillis() {
    return this.endTime.getTime() - this.startTime.getTime();
  }
}
class zn {
  constructor(t) {
    this.duration = t, this.endTime.setTime(Date.now()), this.startTime.setTime(this.endTime.getTime() - this.duration.toMillis());
  }
  startTime = /* @__PURE__ */ new Date();
  endTime = /* @__PURE__ */ new Date();
  isCustom() {
    return !0;
  }
  toUrlString() {
    return this.duration.toString();
  }
  toDisplayString() {
    return this.duration.toRelativeString();
  }
  toDurationMillis() {
    return this.duration.toMillis();
  }
}
function Qo(e) {
  return new ct(
    e.endTime.getTime() - e.startTime.getTime(),
    j.Millisecond
  );
}
function FS(e) {
  return Qo(e).toMillis();
}
function Jo(e) {
  const n = /(\d+)(\w+)/.exec(e);
  if (!(!n || n.length !== 3))
    try {
      const r = parseInt(n[1]), i = n[2];
      if (iu(i))
        return new ct(r, i);
    } catch {
    }
}
function iu(e) {
  try {
    return new ct(1, e), !0;
  } catch {
    return !1;
  }
}
function au(e) {
  const t = new ct(5, j.Minute).toMillis();
  return Math.floor(e / t) * t;
}
function su(e, t) {
  if (!e)
    return;
  const n = Jo(e);
  if (n) {
    if (t?.stabilizeTimeRange) {
      const a = Date.now(), s = au(a);
      return {
        startTime: (s - n.toMillis()).toString(),
        endTime: s.toString()
      };
    }
    const i = new zn(n);
    return {
      startTime: i.startTime.getTime().toString(),
      endTime: i.endTime.getTime().toString()
    };
  }
  const r = un.fromUrlString(e);
  if (r)
    return {
      startTime: r.startTime.getTime().toString(),
      endTime: r.endTime.getTime().toString()
    };
}
function US(e, t) {
  const n = su(e, t);
  if (!n) return;
  const r = Number(n.endTime) - Number(n.startTime);
  return {
    startTime: (Number(n.startTime) - r).toString(),
    endTime: n.startTime
  };
}
const ou = "time", HS = "active-time-range", lu = new zn(
  new ct(1, j.Day)
), tl = Qn(
  void 0
);
function zS({
  children: e,
  initialTimeRange: t = lu
}) {
  const [n, r] = St(t), i = Y((u, h) => {
    const d = uu(u, h);
    r(d);
  }, []), a = Y((u, h) => {
    const d = hu(u, h);
    r(d);
  }, []), s = Y(() => {
    const u = n.toUrlString(), h = o(u);
    r(h);
  }, [n]), o = Y(
    (u, h) => {
      const d = Jo(u);
      if (d) {
        if (h && d.toMillis() > h.toMillis()) {
          const m = new zn(h);
          return r(m), m;
        }
        return new zn(d);
      }
      const f = un.fromUrlString(u);
      if (f) {
        if (h && f.toDurationMillis() > h.toMillis()) {
          const m = new un(
            new Date(Date.now() - h.toMillis()),
            /* @__PURE__ */ new Date()
          );
          return r(m), m;
        }
        return f;
      }
      throw new Error("Invalid time range string");
    },
    []
  ), c = Y((u) => ({
    [ou]: u.toUrlString()
  }), []), l = {
    timeRange: n,
    setRelativeRange: i,
    setFixedRange: a,
    refresh: s,
    timeRangeFromUrlString: o,
    toQueryParams: c
  };
  return /* @__PURE__ */ C(tl.Provider, { value: l, children: e });
}
function cu() {
  const e = Jn(tl);
  if (e === void 0)
    throw new Error("useTimeRange must be used within TimeRangeProvider");
  return e;
}
function uu(e, t) {
  return new zn(new ct(e, t));
}
function hu(e, t) {
  return new un(e, t);
}
const Qi = [
  new ct(1, j.Minute),
  new ct(5, j.Minute),
  new ct(15, j.Minute),
  new ct(30, j.Minute),
  new ct(1, j.Hour),
  new ct(6, j.Hour),
  new ct(12, j.Hour),
  new ct(1, j.Day)
], du = Qi[Qi.length - 1];
function fu(e, t = 500) {
  return pu(e, 3, t);
}
function gu(e, t, n, r) {
  const i = t.toMillis(), a = i / n, s = i / r;
  return e.toMillis() >= s && e.toMillis() <= a;
}
function pu(e, t, n) {
  const r = Qo(e), i = Qi.filter(
    (a) => gu(
      a,
      r,
      t,
      n
    )
  );
  return i.length === 0 ? [du] : i;
}
const el = Qn(void 0);
function $S({
  children: e,
  maximumDataPoints: t = 500
}) {
  const { timeRange: n } = cu(), r = ft(() => fu(n, t), [n, t]);
  return /* @__PURE__ */ C(el.Provider, { value: { availableIntervals: r }, children: e });
}
function WS() {
  const e = Jn(el);
  if (e === void 0)
    throw new Error(
      "useIntervalDuration must be used within IntervalDurationProvider"
    );
  return e;
}
var ee = /* @__PURE__ */ ((e) => (e.Relative = "relative", e.Fixed = "fixed", e.FollowMouse = "follow-mouse", e.Hidden = "hidden", e))(ee || {}), Qt = /* @__PURE__ */ ((e) => (e.BelowCentered = "below-centered", e.BelowRightAligned = "below-right", e.BelowLeftAligned = "below-left", e.AboveCentered = "above-centered", e.AboveRightAligned = "above-right", e.AboveLeftAligned = "above-left", e.LeftCentered = "left-centered", e.RightCentered = "right-centered", e))(Qt || {}), _n = /* @__PURE__ */ ((e) => (e.BottomCenter = "bottom-center", e.Centered = "centered", e.Right = "right", e.Custom = "custom", e))(_n || {});
const nl = Qn(void 0);
function YS({ children: e }) {
  const [t, n] = St(
    null
  ), r = lt(/* @__PURE__ */ new Set()), i = lt(!1), a = lt(null);
  a.current = t;
  const s = Y((g, p) => {
    n({ id: g, visible: !0, options: p });
  }, []), o = Y(() => {
    n((g) => g ? { ...g, visible: !1 } : null);
  }, []), c = Y(() => {
    n(null), i.current = !1;
  }, []), l = Y(() => a.current?.visible ?? !1, []), u = Y(() => a.current?.id ?? null, []), h = Y((g) => (r.current.add(g), () => {
    r.current.delete(g);
  }), []), d = Y(() => {
    r.current.forEach((g) => g());
  }, []), f = Y(() => i.current, []), m = Y(
    (g) => {
      i.current = g, g || d();
    },
    [d]
  ), y = ft(
    () => ({
      showPopover: s,
      hidePopover: o,
      closePopover: c,
      isVisible: l,
      getActiveId: u,
      onPopoverMouseLeave: h,
      isPopoverHovered: f,
      setPopoverHovered: m
    }),
    [
      s,
      o,
      c,
      l,
      u,
      h,
      f,
      m
    ]
  );
  return /* @__PURE__ */ V(nl.Provider, { value: y, children: [
    e,
    t && /* @__PURE__ */ C(
      mu,
      {
        visible: t?.visible ?? !1,
        options: t.options,
        onHide: o,
        onHoverChange: m
      }
    )
  ] });
}
function mu({
  options: e,
  onHide: t,
  visible: n,
  onHoverChange: r
}) {
  const { anchorStyle: i, side: a, align: s } = yu(
    e.position
  ), o = lt({
    getBoundingClientRect: () => new DOMRect(i.left, i.top)
  });
  o.current.getBoundingClientRect = () => new DOMRect(i.left, i.top);
  const c = typeof e.content == "function" ? e.content(e.data) : Ir(e.content, {
    data: e.data
  });
  return /* @__PURE__ */ V(fe.Root, { open: n, onOpenChange: (l) => !l && t(), children: [
    /* @__PURE__ */ C(fe.Anchor, { virtualRef: o, asChild: !0 }),
    /* @__PURE__ */ C(
      fe.Content,
      {
        hideArrow: !0,
        sideOffset: 10,
        alignOffset: 10,
        side: a,
        align: s,
        className: Da(e.className, "p-0 border-0"),
        onMouseEnter: () => r(!0),
        onMouseLeave: () => r(!1),
        children: c
      }
    )
  ] });
}
function yu(e) {
  switch (e.type) {
    case ee.Relative: {
      const { side: t, align: n } = vu(e.location), r = e.anchorElement.getBoundingClientRect();
      return {
        side: t,
        align: n,
        anchorStyle: {
          left: r.left + (e.offsetX || 0),
          top: r.top + (e.offsetY || 0)
        }
      };
    }
    case ee.Fixed: {
      const { left: t, top: n, width: r, height: i } = Su(
        e.location,
        e.customLocation
      );
      return {
        side: "bottom",
        align: "center",
        anchorStyle: {
          position: "fixed",
          left: t,
          top: n,
          width: r || 0,
          height: i || 0,
          pointerEvents: "none"
        }
      };
    }
    case ee.FollowMouse:
      return {
        side: "top",
        align: "end",
        anchorStyle: {
          position: "fixed",
          left: e.offsetX || 0,
          top: e.offsetY || 0,
          width: 0,
          height: 0,
          pointerEvents: "none"
        }
      };
    case ee.Hidden:
    default:
      return {
        side: "bottom",
        align: "center",
        anchorStyle: { display: "none" }
      };
  }
}
function vu(e) {
  switch (e) {
    case Qt.AboveCentered:
      return { side: "top", align: "center" };
    case Qt.AboveLeftAligned:
      return { side: "top", align: "start" };
    case Qt.AboveRightAligned:
      return { side: "top", align: "end" };
    case Qt.BelowCentered:
      return { side: "bottom", align: "center" };
    case Qt.BelowLeftAligned:
      return { side: "bottom", align: "start" };
    case Qt.BelowRightAligned:
      return { side: "bottom", align: "end" };
    case Qt.LeftCentered:
      return { side: "left", align: "center" };
    case Qt.RightCentered:
      return { side: "right", align: "center" };
    default:
      return { side: "bottom", align: "center" };
  }
}
function Su(e, t) {
  const n = window.innerWidth, r = window.innerHeight;
  switch (e) {
    case _n.Centered:
      return {
        left: n / 2,
        top: r / 2
      };
    case _n.BottomCenter:
      return {
        left: n / 2,
        top: r
      };
    case _n.Right:
      return {
        left: n,
        top: 0
      };
    case _n.Custom:
      return {
        left: t?.x || 0,
        top: t?.y || 0
      };
    default:
      return { left: 0, top: 0 };
  }
}
function rl() {
  const e = Jn(nl);
  if (!e)
    throw new Error("usePopover must be used within PopoverServiceProvider");
  const t = lt(
    `popover-${Date.now()}-${Math.random().toString(36).slice(2)}`
  ), n = lt(/* @__PURE__ */ new Map()), r = lt([]), i = lt(!1);
  wt(() => {
    const d = t.current;
    return () => {
      e.getActiveId() === d && e.closePopover(), r.current.forEach((f) => f()), r.current = [];
    };
  }, []);
  const a = Y(
    (d) => {
      i.current = !1, e.showPopover(t.current, d), n.current.get("shown")?.forEach((f) => f());
    },
    [e]
  ), s = Y(() => {
    e.getActiveId() === t.current && (e.hidePopover(), n.current.get("hidden")?.forEach((d) => d()));
  }, [e]), o = Y(() => {
    i.current = !0, e.getActiveId() === t.current && e.closePopover(), r.current.forEach((d) => d()), r.current = [], n.current.get("closed")?.forEach((d) => d());
  }, [e]), c = Y(
    (d, f) => (n.current.has(d) || n.current.set(d, /* @__PURE__ */ new Set()), n.current.get(d)?.add(f), () => {
      n.current.get(d)?.delete(f);
    }),
    []
  ), l = Y(() => {
    const d = (m) => {
      m.key === "Escape" && e.getActiveId() === t.current && o();
    };
    document.addEventListener("keydown", d);
    const f = () => document.removeEventListener("keydown", d);
    return r.current.push(f), f;
  }, [o, e]), u = Y(() => e.isPopoverHovered(), [e]), h = Y(
    (d) => e.onPopoverMouseLeave(d),
    [e]
  );
  return {
    show: a,
    hide: s,
    close: o,
    get visible() {
      return e.getActiveId() === t.current && e.isVisible();
    },
    get closed() {
      return i.current;
    },
    isHovered: u,
    onMouseLeave: h,
    on: c,
    closeOnEscapeKey: l
  };
}
class GS {
  constructor(t, n) {
    this.id = t, this.closeCallback = n;
  }
  _visible = !1;
  _closed = !1;
  eventListeners = /* @__PURE__ */ new Map();
  cleanupFunctions = [];
  /**
   * Check if popover is visible
   * Maps to: PopoverRef.visible getter (lines 20-22)
   */
  get visible() {
    return this._visible;
  }
  /**
   * Check if popover is closed
   * Maps to: PopoverRef.closed getter (lines 16-18)
   */
  get closed() {
    return this._closed;
  }
  /**
   * Show the popover
   * Maps to: PopoverRef.show() (lines 60-64)
   */
  show() {
    this._closed || (this._visible = !0, this.emit("shown"));
  }
  /**
   * Hide the popover (but don't destroy)
   * Maps to: PopoverRef.hide() (lines 54-58)
   */
  hide() {
    this._closed || (this._visible = !1, this.emit("hidden"));
  }
  /**
   * Close and destroy the popover
   * Maps to: PopoverRef.close() (lines 66-71)
   */
  close() {
    this._closed || (this._closed = !0, this._visible = !1, this.cleanup(), this.emit("closed"), this.closeCallback());
  }
  /**
   * Subscribe to popover events
   * Replaces: RxJS observables (backdropClick$, shown$, hidden$, closed$)
   */
  on(t, n) {
    return this.eventListeners.has(t) || this.eventListeners.set(t, /* @__PURE__ */ new Set()), this.eventListeners.get(t).add(n), () => {
      this.eventListeners.get(t)?.delete(n);
    };
  }
  /**
   * Emit an event to all listeners
   */
  emit(t, n) {
    this.eventListeners.get(t)?.forEach((r) => r(n));
  }
  /**
   * Close on backdrop click
   * Maps to: PopoverRef.closeOnBackdropClick() (lines 98-103)
   */
  closeOnBackdropClick() {
    const t = this.on("backdropClick", () => this.close());
    return this.cleanupFunctions.push(t), t;
  }
  /**
   * Hide on backdrop click
   * Maps to: PopoverRef.hideOnBackdropClick() (lines 105-110)
   */
  hideOnBackdropClick() {
    const t = this.on("backdropClick", () => this.hide());
    return this.cleanupFunctions.push(t), t;
  }
  /**
   * Close on escape key
   * Maps to: PopoverRef.closeOnEscapeKey() (lines 119-128)
   */
  closeOnEscapeKey() {
    const t = (r) => {
      r.key === "Escape" && this.close();
    };
    document.addEventListener("keydown", t);
    const n = () => document.removeEventListener("keydown", t);
    return this.cleanupFunctions.push(n), n;
  }
  /**
   * Close on viewport resize
   * Maps to: PopoverRef.closeOnViewportResize() (lines 136-142)
   */
  closeOnViewportResize() {
    const t = () => this.close();
    window.addEventListener("resize", t);
    const n = () => window.removeEventListener("resize", t);
    return this.cleanupFunctions.push(n), n;
  }
  /**
   * Trigger backdrop click event
   * Called internally by service
   */
  triggerBackdropClick(t) {
    this.emit("backdropClick", t);
  }
  /**
   * Cleanup all event listeners
   */
  cleanup() {
    this.cleanupFunctions.forEach((t) => t()), this.cleanupFunctions = [], this.eventListeners.clear();
  }
}
var xu = /* @__PURE__ */ ((e) => (e.Link = "link", e.Custom = "custom", e))(xu || {});
function ii({
  data: e
}) {
  return /* @__PURE__ */ V(
    "div",
    {
      className: "chart-tooltip cn-tooltip cn-tooltip-default",
      style: {
        minWidth: "120px",
        maxHeight: "400px",
        overflow: "auto",
        overscrollBehavior: "contain"
      },
      children: [
        e.groups.map((t, n) => /* @__PURE__ */ V("div", { children: [
          t.title && t.title !== t.labeledValues?.[0]?.label && /* @__PURE__ */ C("div", { style: { fontWeight: 600, marginBottom: "8px" }, children: t.title }),
          t.labeledValues.length === 0 && /* @__PURE__ */ C("div", { style: { fontStyle: "italic" }, children: "No data" }),
          t.labeledValues.map((r, i) => /* @__PURE__ */ V(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "4px 0"
              },
              children: [
                /* @__PURE__ */ V(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flex: 1,
                      minWidth: 0
                    },
                    children: [
                      /* @__PURE__ */ C(
                        "span",
                        {
                          style: {
                            display: "inline-block",
                            width: "4px",
                            height: "20px",
                            borderRadius: "4px",
                            backgroundColor: r.color || "#8B5CF6",
                            flexShrink: 0
                          }
                        }
                      ),
                      /* @__PURE__ */ C(
                        "span",
                        {
                          style: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          },
                          children: r.label
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ V(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      flexShrink: 0
                    },
                    children: [
                      /* @__PURE__ */ C("span", { style: { fontWeight: 600 }, children: wu(r.value) }),
                      r.units && /* @__PURE__ */ C("span", { style: { color: "#9CA3AF", fontSize: "12px" }, children: r.units })
                    ]
                  }
                )
              ]
            },
            i
          ))
        ] }, n)),
        e.title && /* @__PURE__ */ C(
          "div",
          {
            style: {
              borderTop: "1px solid var(--cn-border-1)",
              marginTop: "8px",
              paddingTop: "8px",
              fontSize: "12px"
            },
            children: e.title
          }
        )
      ]
    }
  );
}
function wu(e) {
  return e == null ? "-" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }) : e instanceof Date ? e.toLocaleString() : String(e);
}
const ls = 250;
function ai(e, t) {
  const {
    show: n,
    hide: r,
    close: i,
    isHovered: a,
    onMouseLeave: s
  } = rl(), o = lt(), c = lt(!1), l = lt(!1);
  wt(() => () => {
    c.current = !0, o.current && clearTimeout(o.current);
  }, []), wt(() => s(() => {
    l.current && !c.current && (o.current && clearTimeout(o.current), o.current = setTimeout(() => {
      r(), l.current = !1;
    }, ls));
  }), [s, r]);
  const u = Y(
    (m, y, g, p) => {
      if (c.current || !t) return;
      o.current && (clearTimeout(o.current), o.current = void 0);
      const x = e ? e(y) : y;
      x && (n({
        content: () => Ir(t, {
          data: x,
          onClose: () => r()
        }),
        data: x,
        position: p ?? {
          type: ee.Relative,
          anchorElement: m,
          location: Qt.AboveRightAligned,
          offsetX: g.x,
          offsetY: g.y
        }
      }), l.current = !0);
    },
    [n, r, e, t]
  ), h = Y(() => {
    c.current || a() || (o.current && clearTimeout(o.current), o.current = setTimeout(() => {
      a() || (r(), l.current = !1);
    }, ls));
  }, [a, r]), d = Y(() => {
    c.current = !0, o.current && clearTimeout(o.current), i(), l.current = !1;
  }, [i]), f = lt({
    showWithData: u,
    hide: h,
    destroy: d
  });
  return wt(() => {
    f.current.showWithData = u, f.current.hide = h, f.current.destroy = d;
  }, [u, h, d]), f.current;
}
var bu = /* @__PURE__ */ ((e) => (e.Wrap = "wrap", e.Rotate = "rotate", e.Truncate = "truncate", e))(bu || {}), Tu = /* @__PURE__ */ ((e) => (e.Bottom = "bottom", e.Right = "right", e.TopRight = "top-right", e.TopLeft = "top-left", e.Top = "top", e.Left = "left", e.Auto = "auto", e.None = "none", e))(Tu || {});
class Au {
  charts = /* @__PURE__ */ new Map();
  eventHandlers = /* @__PURE__ */ new Map();
  /**
   * Register a chart for synchronization
   */
  register(t) {
    this.charts.has(t.groupId) || this.charts.set(t.groupId, /* @__PURE__ */ new Set()), this.charts.get(t.groupId).add(t);
  }
  /**
   * Unregister a chart
   */
  unregister(t) {
    const n = this.charts.get(t.groupId);
    n && (n.delete(t), n.size === 0 && this.charts.delete(t.groupId));
  }
  /**
   * Broadcast crosshair move event to all charts in group
   */
  broadcastCrosshairMove(t, n, r, i, a) {
    const s = this.charts.get(t.groupId);
    if (!s) return;
    s.forEach((c) => {
      c.id !== t.id && c.showCrosshair(n, r, i, a);
    });
    const o = {
      groupId: t.groupId,
      x: r,
      y: i,
      event: n,
      data: a
    };
    this.triggerEvent("crosshair-move", o);
  }
  /**
   * Broadcast crosshair hide event
   */
  broadcastCrosshairHide(t) {
    const n = this.charts.get(t.groupId);
    n && (n.forEach((r) => {
      r.id !== t.id && r.hideCrosshair();
    }), this.triggerEvent("crosshair-hide", { groupId: t.groupId }));
  }
  /**
   * Subscribe to sync events
   */
  on(t, n) {
    return this.eventHandlers.has(t) || this.eventHandlers.set(t, /* @__PURE__ */ new Set()), this.eventHandlers.get(t).add(n), () => {
      this.eventHandlers.get(t)?.delete(n);
    };
  }
  /**
   * Trigger event
   */
  triggerEvent(t, n) {
    const r = this.eventHandlers.get(t);
    r && r.forEach((i) => {
      try {
        i(n);
      } catch (a) {
        console.error("Error in sync event handler:", a);
      }
    });
  }
  /**
   * Get all charts in a group
   */
  getGroupCharts(t) {
    return Array.from(this.charts.get(t) || []);
  }
  /**
   * Clear all registrations
   */
  clear() {
    this.charts.clear(), this.eventHandlers.clear();
  }
}
const cs = new Au();
function VS(e, t, n, r) {
  if (!t)
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onMouseMove: () => {
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onMouseLeave: () => {
      }
    };
  const i = {
    id: e,
    groupId: t,
    showCrosshair: n,
    hideCrosshair: r
  };
  return {
    onMouseMove: (a, s, o, c) => {
      cs.broadcastCrosshairMove(i, a, s, o, c);
    },
    onMouseLeave: () => {
      cs.broadcastCrosshairHide(i);
    }
  };
}
class Ca {
  options;
  constructor(t) {
    this.options = this.assignDefaults(t);
  }
  coerce(t) {
    const n = this.collectValuesToCheck(t);
    for (const r of n) {
      const i = this.tryCoerceSingleValue(r);
      if (i !== void 0)
        return i;
    }
    return this.options.defaultValue;
  }
  assignDefaults(t) {
    return {
      useSelf: !0,
      ...t
    };
  }
  canCoerce(t) {
    return this.coerce(t) !== void 0;
  }
  collectValuesToCheck(t) {
    return [
      this.options.useSelf ? t : void 0,
      ...this.extractObjectKeys(t),
      ...this.extractArrayIndices(t)
    ];
  }
  extractObjectKeys(t) {
    return !Array.isArray(this.options.extractObjectKeys) || this.options.extractObjectKeys.length === 0 ? [] : typeof t != "object" || t === null ? [] : this.options.extractObjectKeys.map(
      (n) => t[n]
    );
  }
  extractArrayIndices(t) {
    return !Array.isArray(this.options.extractArrayIndices) || this.options.extractArrayIndices.length === 0 ? [] : Array.isArray(t) ? this.options.maxArrayLength !== void 0 && this.options.maxArrayLength < t.length ? [] : this.options.extractArrayIndices.map((n) => t[n]) : [];
  }
}
class $e extends Ca {
  static DEFAULT_TIME_WINDOW = {
    earliestDate: new Date(
      Date.now() - new ct(10, j.Year).toMillis()
    ),
    latestDate: new Date(
      Date.now() + new ct(10, j.Year).toMillis()
    )
  };
  constructor(t = {}) {
    super(t);
  }
  assignDefaults(t) {
    return {
      ...$e.DEFAULT_TIME_WINDOW,
      ...super.assignDefaults(t)
    };
  }
  tryCoerceSingleValue(t) {
    if (!(typeof t == "string" || typeof t == "number" || t instanceof Date))
      return;
    const n = typeof t == "string" && !isNaN(Number(t)) ? /* @__PURE__ */ new Date(+t) : new Date(t);
    if (!(isNaN(n.getTime()) || !this.isDateInAllowableRange(n)))
      return n;
  }
  isDateInAllowableRange(t) {
    return !(this.options.earliestDate && this.options.earliestDate > t || this.options.latestDate && this.options.latestDate < t);
  }
}
var Ot = /* @__PURE__ */ ((e) => (e[e.TimeOnly = 0] = "TimeOnly", e[e.TimeWithSeconds = 1] = "TimeWithSeconds", e[e.DateOnly = 2] = "DateOnly", e[e.MonthAndDayOnly = 3] = "MonthAndDayOnly", e[e.MonthAndYearOnly = 4] = "MonthAndYearOnly", e[e.FullMonthAndYearOnly = 5] = "FullMonthAndYearOnly", e[e.DateWithYearAndTime = 6] = "DateWithYearAndTime", e[e.DateAndTimeWithSeconds = 7] = "DateAndTimeWithSeconds", e[e.DateOnlyAndTime = 8] = "DateOnlyAndTime", e[e.DateWithYearAndTimeWithTimeZone = 9] = "DateWithYearAndTimeWithTimeZone", e[e.TimeWithTimeZoneOffset = 10] = "TimeWithTimeZoneOffset", e[e.DateWithYearAndMonth = 11] = "DateWithYearAndMonth", e))(Ot || {});
class ke {
  static DEFAULT_OPTIONS = {
    mode: 6
    /* DateWithYearAndTime */
  };
  options;
  dateCoercer = new $e();
  // Temporary placeholder, need to flesh this out
  constructor(t = {}) {
    this.options = this.applyOptionDefaults(t);
  }
  format(t, n) {
    return this.convertDateToString(t, n);
  }
  applyOptionDefaults(t) {
    return ni({}, t, ke.DEFAULT_OPTIONS);
  }
  convertDateToString(t, n) {
    const r = this.dateCoercer.coerce(t);
    return r === void 0 ? "-" : this.formatDateWithMode(r, this.options.mode, n);
  }
  formatDateWithMode(t, n, r) {
    const i = { timeZone: r };
    switch (n) {
      case 0:
        return t.toLocaleTimeString("en-US", {
          ...i,
          hour: "numeric",
          minute: "2-digit"
        });
      case 1:
        return t.toLocaleTimeString("en-US", {
          ...i,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      case 3:
        return t.toLocaleDateString("en-US", {
          ...i,
          month: "short",
          day: "numeric"
        });
      case 4:
        return t.toLocaleDateString("en-US", {
          ...i,
          month: "short",
          year: "2-digit"
        });
      case 5:
        return t.toLocaleDateString("en-US", {
          ...i,
          month: "long",
          year: "numeric"
        });
      case 2:
        return t.toLocaleDateString("en-US", {
          ...i,
          day: "numeric",
          month: "short",
          year: "numeric"
        });
      case 6:
        return t.toLocaleString("en-US", {
          ...i,
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        });
      case 8:
        return t.toLocaleString("en-US", {
          ...i,
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit"
        });
      case 11: {
        const a = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), o = String(t.getDate()).padStart(2, "0");
        return `${a}-${s}-${o}`;
      }
      case 10:
        return t.toISOString().slice(11, 19) + this.getTimezoneOffset(t);
      case 9:
        return t.toLocaleString("en-US", {
          ...i,
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "shortOffset"
        });
      case 7:
      default:
        return t.toLocaleString("en-US", {
          ...i,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
    }
  }
  getTimezoneOffset(t) {
    const n = -t.getTimezoneOffset();
    if (n === 0) return "Z";
    const r = n >= 0 ? "+" : "-", i = String(Math.floor(Math.abs(n) / 60)).padStart(2, "0"), a = String(Math.abs(n) % 60).padStart(2, "0");
    return `${r}${i}:${a}`;
  }
  getFormatString() {
    switch (this.options.mode) {
      case 10:
        return "HH:mm:ssZZZZZ";
      case 1:
        return "hh:mm:ss a";
      case 0:
        return "h:mm a";
      case 3:
        return "MMM d";
      case 4:
        return "MMM yy";
      case 5:
        return "MMMM yyyy";
      case 2:
        return "d MMM y";
      case 6:
        return "d MMM y h:mm a";
      case 8:
        return "d MMM h:mm a";
      case 9:
        return "d MMM y h:mm a zzzz";
      case 11:
        return "yyyy-MM-dd";
      case 7:
      default:
        return "y-MM-dd hh:mm:ss a";
    }
  }
}
var En = /* @__PURE__ */ ((e) => (e[e.Circle = 0] = "Circle", e[e.Square = 1] = "Square", e[e.Triangle = 2] = "Triangle", e[e.Cross = 3] = "Cross", e))(En || {}), qe = /* @__PURE__ */ ((e) => (e[e.Svg = 0] = "Svg", e[e.Canvas = 1] = "Canvas", e[e.Auto = 2] = "Auto", e))(qe || {}), pt = /* @__PURE__ */ ((e) => (e.Bar = "bar", e.Column = "column", e.Line = "line", e.DashedLine = "dashed-line", e.Scatter = "scatter", e.Area = "area", e))(pt || {}), G = /* @__PURE__ */ ((e) => (e[e.X = 0] = "X", e[e.Y = 1] = "Y", e))(G || {}), ot = /* @__PURE__ */ ((e) => (e[e.Left = 0] = "Left", e[e.Right = 1] = "Right", e[e.Top = 2] = "Top", e[e.Bottom = 3] = "Bottom", e))(ot || {}), xt = /* @__PURE__ */ ((e) => (e.Linear = "linear", e.Log = "log", e.Time = "time", e.Band = "band", e))(xt || {}), il = /* @__PURE__ */ ((e) => (e.Wrap = "wrap", e.Rotate = "rotate", e))(il || {}), ge = /* @__PURE__ */ ((e) => (e.None = "none", e.Enter = "enter", e.Exit = "exit", e.Update = "update", e))(ge || {});
function al(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function er(e) {
  let t = e, n = e;
  e.length === 1 && (t = (s, o) => e(s) - o, n = Du(e));
  function r(s, o, c, l) {
    for (c == null && (c = 0), l == null && (l = s.length); c < l; ) {
      const u = c + l >>> 1;
      n(s[u], o) < 0 ? c = u + 1 : l = u;
    }
    return c;
  }
  function i(s, o, c, l) {
    for (c == null && (c = 0), l == null && (l = s.length); c < l; ) {
      const u = c + l >>> 1;
      n(s[u], o) > 0 ? l = u : c = u + 1;
    }
    return c;
  }
  function a(s, o, c, l) {
    c == null && (c = 0), l == null && (l = s.length);
    const u = r(s, o, c, l - 1);
    return u > c && t(s[u - 1], o) > -t(s[u], o) ? u - 1 : u;
  }
  return { left: r, center: a, right: i };
}
function Du(e) {
  return (t, n) => al(e(t), n);
}
function Mu(e) {
  return e === null ? NaN : +e;
}
const sl = er(al), Cu = sl.right;
sl.left;
er(Mu).center;
function us(e, t) {
  let n, r;
  for (const i of e)
    i != null && (n === void 0 ? i >= i && (n = r = i) : (n > i && (n = i), r < i && (r = i)));
  return [n, r];
}
class hs extends Map {
  constructor(t, n = Nu) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: n } }), t != null) for (const [r, i] of t) this.set(r, i);
  }
  get(t) {
    return super.get(ds(this, t));
  }
  has(t) {
    return super.has(ds(this, t));
  }
  set(t, n) {
    return super.set(_u(this, t), n);
  }
  delete(t) {
    return super.delete(Eu(this, t));
  }
}
function ds({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) ? e.get(r) : n;
}
function _u({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function Eu({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) && (n = e.get(n), e.delete(r)), n;
}
function Nu(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
var Ji = Math.sqrt(50), ta = Math.sqrt(10), ea = Math.sqrt(2);
function na(e, t, n) {
  var r, i = -1, a, s, o;
  if (t = +t, e = +e, n = +n, e === t && n > 0) return [e];
  if ((r = t < e) && (a = e, e = t, t = a), (o = ol(e, t, n)) === 0 || !isFinite(o)) return [];
  if (o > 0) {
    let c = Math.round(e / o), l = Math.round(t / o);
    for (c * o < e && ++c, l * o > t && --l, s = new Array(a = l - c + 1); ++i < a; ) s[i] = (c + i) * o;
  } else {
    o = -o;
    let c = Math.round(e * o), l = Math.round(t * o);
    for (c / o < e && ++c, l / o > t && --l, s = new Array(a = l - c + 1); ++i < a; ) s[i] = (c + i) / o;
  }
  return r && s.reverse(), s;
}
function ol(e, t, n) {
  var r = (t - e) / Math.max(0, n), i = Math.floor(Math.log(r) / Math.LN10), a = r / Math.pow(10, i);
  return i >= 0 ? (a >= Ji ? 10 : a >= ta ? 5 : a >= ea ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (a >= Ji ? 10 : a >= ta ? 5 : a >= ea ? 2 : 1);
}
function ra(e, t, n) {
  var r = Math.abs(t - e) / Math.max(0, n), i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)), a = r / i;
  return a >= Ji ? i *= 10 : a >= ta ? i *= 5 : a >= ea && (i *= 2), t < e ? -i : i;
}
function Ru(e, t) {
  let n;
  for (const r of e)
    r != null && (n < r || n === void 0 && r >= r) && (n = r);
  return n;
}
function ll(e, t, n) {
  e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
  for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, a = new Array(i); ++r < i; )
    a[r] = e + r * n;
  return a;
}
function fs(e, t) {
  let n = 0;
  for (let r of e)
    (r = +r) && (n += r);
  return n;
}
class si {
  constructor(t, n, r, i, a = 1 / 0, s = G.X) {
    this.xScale = r, this.yScale = i, this.searchRadius = a, this.axisType = s, this.locationBisector = er(
      (o) => this.getRangeValueFromLocation(o.location)
    ), this.locationData = n.map((o) => ({
      dataPoint: o,
      context: t,
      location: this.dataToLocationCoordinates(o)
    })).sort(
      (o, c) => this.getRangeValueFromLocation(o.location) - this.getRangeValueFromLocation(c.location)
    );
  }
  locationBisector;
  locationData;
  dataForLocation(t) {
    const n = this.getRangeValueFromLocation(t), r = this.findClosestValue(n);
    return r !== void 0 && this.isValueWithinRadius(n, r) ? [r] : [];
  }
  dataToLocationCoordinates(t) {
    return {
      x: this.xScale.transformToTooltipAnchor(t),
      y: this.yScale.transformToTooltipAnchor(t)
    };
  }
  getRangeValueFromLocation(t) {
    switch (this.axisType) {
      case G.Y:
        return -t.y;
      case G.X:
      default:
        return t.x;
    }
  }
  isValueWithinRadius(t, n) {
    return Math.abs(t - this.getRangeValueFromLocation(n.location)) < this.searchRadius;
  }
  findClosestValue(t) {
    const n = this.locationBisector.left(
      this.locationData,
      t
    ), r = this.locationData[n - 1], i = this.locationData[n];
    if (r === void 0)
      return i;
    if (i === void 0)
      return r;
    const a = this.getRangeValueFromLocation(r.location), s = this.getRangeValueFromLocation(i.location);
    return t - a > s - t ? i : r;
  }
}
class cl {
  constructor(t, n, r) {
    this.visualization = t, this.scaleBuilder = n, this.xScale = this.buildXScale(), this.yScale = this.buildYScale(), r && (this.dataLookupStrategy = this.buildDataLookupStrategy(
      t,
      r
    ));
  }
  dataLookupStrategy;
  xScale;
  yScale;
  dataForLocation(t) {
    return this.dataLookupStrategy ? this.dataLookupStrategy.dataForLocation(t) : [];
  }
  buildXScale() {
    return this.scaleBuilder.build(G.X);
  }
  buildYScale() {
    return this.scaleBuilder.build(G.Y);
  }
  getXAxisValue(t) {
    return new Date(this.xScale.invert(t));
  }
  getDatumKey(t, n) {
    return this.scaleBuilder.getDataAccessorForDomain(n ?? G.X)(
      t
    ).toString();
  }
}
class nr extends cl {
  constructor(t, n, r, i) {
    super(t, n, r), this.series = t, this.scaleBuilder = n, this.dataClickActionHandler = i;
  }
  dataClickActionHandler;
  buildDataLookupStrategy(t, n) {
    return n.followSingleAxis !== void 0 ? new si(
      t,
      t.data,
      this.xScale,
      this.yScale,
      n.radius,
      n.followSingleAxis
    ) : this.buildMultiAxisDataLookupStrategy(n);
  }
  getUniqueCartesianDataKey() {
    return this.series.name;
  }
}
const De = (e) => !!e?.some((t) => t.type === pt.Bar), Yt = 150, Lu = 200;
function Br(e) {
  return e > Lu ? 0 : Yt;
}
const gs = "data-series", vi = "chart-visualization", jt = "common";
var $n = /* @__PURE__ */ ((e) => (e.Blue = "var(--cn-comp-data-viz-01-blue)", e.Purple = "var(--cn-comp-data-viz-02-purple)", e.Pink = "var(--cn-comp-data-viz-03-pink)", e.Green = "var(--cn-comp-data-viz-04-green)", e.Indigo = "var(--cn-comp-data-viz-05-indigo)", e.Brown = "var(--cn-comp-data-viz-06-brown)", e.Cyan = "var(--cn-comp-data-viz-07-cyan)", e.Orange = "var(--cn-comp-data-viz-08-orange)", e.Forest = "var(--cn-comp-data-viz-09-forest)", e.Red = "var(--cn-comp-data-viz-10-red)", e.Yellow = "var(--cn-comp-data-viz-11-yellow)", e.Gray = "var(--cn-comp-data-viz-12-gray)", e))($n || {});
const ul = [
  "var(--cn-comp-data-viz-01-blue)",
  "var(--cn-comp-data-viz-02-purple)",
  "var(--cn-comp-data-viz-03-pink)",
  "var(--cn-comp-data-viz-04-green)",
  "var(--cn-comp-data-viz-05-indigo)",
  "var(--cn-comp-data-viz-06-brown)",
  "var(--cn-comp-data-viz-07-cyan)",
  "var(--cn-comp-data-viz-08-orange)",
  "var(--cn-comp-data-viz-09-forest)",
  "var(--cn-comp-data-viz-10-red)",
  "var(--cn-comp-data-viz-11-yellow)",
  "var(--cn-comp-data-viz-12-gray)"
  /* Gray */
], ps = "chart_shadow_filters", ku = {
  sm: 4,
  md: 8,
  lg: 12
};
function hl(e, t = "lg") {
  return `shadow${e}-${t}`;
}
function Iu(e, t, n) {
  const r = ku[n];
  return `<filter id="${hl(e, n)}" x="-75%" y="-75%" width="250%" height="250%" >
    <feDropShadow dx="0" dy="0" stdDeviation="${r}" flood-color="${t}" flood-opacity="0.5" />
  </filter>`;
}
function Ou() {
  const e = ["sm", "md", "lg"];
  return `<defs>${Object.keys($n).flatMap(
    (n) => e.map(
      (r) => Iu(n, $n[n], r)
    )
  ).join("")}</defs>`;
}
function Bu() {
  if (typeof document > "u" || document.getElementById(ps))
    return;
  const t = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  t.setAttribute("id", ps), t.setAttribute("width", "0"), t.setAttribute("height", "0"), t.style.position = "absolute", t.innerHTML = Ou(), document.body.appendChild(t);
}
const ms = Object.fromEntries(
  Object.entries($n).map(([e, t]) => [t, e])
);
class Ht {
  colors;
  constructor(t = ul) {
    this.colors = t;
  }
  /**
   * Get the human-readable label for a VizColor value (e.g., VizColor.Blue → "Blue")
   */
  static getVizColorLabel(t) {
    return ms[t];
  }
  static getDropShadowColor(t, n = "lg") {
    Bu();
    const r = ms[t];
    return r ? `url(#${hl(r, "sm")})` : "";
  }
  getColorPalette() {
    return {
      forNColors: (t) => {
        const n = [];
        for (let r = 0; r < t; r++)
          n.push(this.colors[r % this.colors.length]);
        return n;
      }
    };
  }
  /**
   * Get a single color by index
   */
  getColor(t) {
    return this.colors[t % this.colors.length];
  }
  /**
   * Get all available colors
   */
  getAllColors() {
    return [...this.colors];
  }
}
var Jt = /* @__PURE__ */ ((e) => (e[e.Click = 0] = "Click", e[e.DoubleClick = 1] = "DoubleClick", e[e.RightClick = 2] = "RightClick", e[e.Hover = 3] = "Hover", e[e.Select = 4] = "Select", e[e.MouseLeave = 5] = "MouseLeave", e))(Jt || {}), Pu = { value: () => {
} };
function rr() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new Dr(n);
}
function Dr(e) {
  this._ = e;
}
function Fu(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", i = n.indexOf(".");
    if (i >= 0 && (r = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
Dr.prototype = rr.prototype = {
  constructor: Dr,
  on: function(e, t) {
    var n = this._, r = Fu(e + "", n), i, a = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++a < s; ) if ((i = (e = r[a]).type) && (i = Uu(n[i], e.name))) return i;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++a < s; )
      if (i = (e = r[a]).type) n[i] = ys(n[i], e.name, t);
      else if (t == null) for (i in n) n[i] = ys(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new Dr(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
  }
};
function Uu(e, t) {
  for (var n = 0, r = e.length, i; n < r; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function ys(e, t, n) {
  for (var r = 0, i = e.length; r < i; ++r)
    if (e[r].name === t) {
      e[r] = Pu, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var ia = "http://www.w3.org/1999/xhtml";
const aa = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ia,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function oi(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), aa.hasOwnProperty(t) ? { space: aa[t], local: e } : e;
}
function Hu(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === ia && t.documentElement.namespaceURI === ia ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function zu(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function dl(e) {
  var t = oi(e);
  return (t.local ? zu : Hu)(t);
}
function $u() {
}
function _a(e) {
  return e == null ? $u : function() {
    return this.querySelector(e);
  };
}
function Wu(e) {
  typeof e != "function" && (e = _a(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], s = a.length, o = r[i] = new Array(s), c, l, u = 0; u < s; ++u)
      (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), o[u] = l);
  return new Lt(r, this._parents);
}
function fl(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Yu() {
  return [];
}
function gl(e) {
  return e == null ? Yu : function() {
    return this.querySelectorAll(e);
  };
}
function Gu(e) {
  return function() {
    return fl(e.apply(this, arguments));
  };
}
function Vu(e) {
  typeof e == "function" ? e = Gu(e) : e = gl(e);
  for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a)
    for (var s = t[a], o = s.length, c, l = 0; l < o; ++l)
      (c = s[l]) && (r.push(e.call(c, c.__data__, l, s)), i.push(c));
  return new Lt(r, i);
}
function pl(e) {
  return function() {
    return this.matches(e);
  };
}
function ml(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Xu = Array.prototype.find;
function ju(e) {
  return function() {
    return Xu.call(this.children, e);
  };
}
function qu() {
  return this.firstElementChild;
}
function Zu(e) {
  return this.select(e == null ? qu : ju(typeof e == "function" ? e : ml(e)));
}
var Ku = Array.prototype.filter;
function Qu() {
  return Array.from(this.children);
}
function Ju(e) {
  return function() {
    return Ku.call(this.children, e);
  };
}
function th(e) {
  return this.selectAll(e == null ? Qu : Ju(typeof e == "function" ? e : ml(e)));
}
function eh(e) {
  typeof e != "function" && (e = pl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], s = a.length, o = r[i] = [], c, l = 0; l < s; ++l)
      (c = a[l]) && e.call(c, c.__data__, l, a) && o.push(c);
  return new Lt(r, this._parents);
}
function yl(e) {
  return new Array(e.length);
}
function nh() {
  return new Lt(this._enter || this._groups.map(yl), this._parents);
}
function Pr(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Pr.prototype = {
  constructor: Pr,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function rh(e) {
  return function() {
    return e;
  };
}
function ih(e, t, n, r, i, a) {
  for (var s = 0, o, c = t.length, l = a.length; s < l; ++s)
    (o = t[s]) ? (o.__data__ = a[s], r[s] = o) : n[s] = new Pr(e, a[s]);
  for (; s < c; ++s)
    (o = t[s]) && (i[s] = o);
}
function ah(e, t, n, r, i, a, s) {
  var o, c, l = /* @__PURE__ */ new Map(), u = t.length, h = a.length, d = new Array(u), f;
  for (o = 0; o < u; ++o)
    (c = t[o]) && (d[o] = f = s.call(c, c.__data__, o, t) + "", l.has(f) ? i[o] = c : l.set(f, c));
  for (o = 0; o < h; ++o)
    f = s.call(e, a[o], o, a) + "", (c = l.get(f)) ? (r[o] = c, c.__data__ = a[o], l.delete(f)) : n[o] = new Pr(e, a[o]);
  for (o = 0; o < u; ++o)
    (c = t[o]) && l.get(d[o]) === c && (i[o] = c);
}
function sh(e) {
  return e.__data__;
}
function oh(e, t) {
  if (!arguments.length) return Array.from(this, sh);
  var n = t ? ah : ih, r = this._parents, i = this._groups;
  typeof e != "function" && (e = rh(e));
  for (var a = i.length, s = new Array(a), o = new Array(a), c = new Array(a), l = 0; l < a; ++l) {
    var u = r[l], h = i[l], d = h.length, f = lh(e.call(u, u && u.__data__, l, r)), m = f.length, y = o[l] = new Array(m), g = s[l] = new Array(m), p = c[l] = new Array(d);
    n(u, h, y, g, p, f, t);
    for (var x = 0, w = 0, v, T; x < m; ++x)
      if (v = y[x]) {
        for (x >= w && (w = x + 1); !(T = g[w]) && ++w < m; ) ;
        v._next = T || null;
      }
  }
  return s = new Lt(s, r), s._enter = o, s._exit = c, s;
}
function lh(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function ch() {
  return new Lt(this._exit || this._groups.map(yl), this._parents);
}
function uh(e, t, n) {
  var r = this.enter(), i = this, a = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
function hh(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, s = Math.min(i, a), o = new Array(i), c = 0; c < s; ++c)
    for (var l = n[c], u = r[c], h = l.length, d = o[c] = new Array(h), f, m = 0; m < h; ++m)
      (f = l[m] || u[m]) && (d[m] = f);
  for (; c < i; ++c)
    o[c] = n[c];
  return new Lt(o, this._parents);
}
function dh() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], i = r.length - 1, a = r[i], s; --i >= 0; )
      (s = r[i]) && (a && s.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(s, a), a = s);
  return this;
}
function fh(e) {
  e || (e = gh);
  function t(h, d) {
    return h && d ? e(h.__data__, d.__data__) : !h - !d;
  }
  for (var n = this._groups, r = n.length, i = new Array(r), a = 0; a < r; ++a) {
    for (var s = n[a], o = s.length, c = i[a] = new Array(o), l, u = 0; u < o; ++u)
      (l = s[u]) && (c[u] = l);
    c.sort(t);
  }
  return new Lt(i, this._parents).order();
}
function gh(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function ph() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function mh() {
  return Array.from(this);
}
function yh() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
      var s = r[i];
      if (s) return s;
    }
  return null;
}
function vh() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Sh() {
  return !this.node();
}
function xh(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var i = t[n], a = 0, s = i.length, o; a < s; ++a)
      (o = i[a]) && e.call(o, o.__data__, a, i);
  return this;
}
function wh(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function bh(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Th(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Ah(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Dh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Mh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Ch(e, t) {
  var n = oi(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? bh : wh : typeof t == "function" ? n.local ? Mh : Dh : n.local ? Ah : Th)(n, t));
}
function vl(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function _h(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Eh(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Nh(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function Rh(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? _h : typeof t == "function" ? Nh : Eh)(e, t, n ?? "")) : hn(this.node(), e);
}
function hn(e, t) {
  return e.style.getPropertyValue(t) || vl(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Lh(e) {
  return function() {
    delete this[e];
  };
}
function kh(e, t) {
  return function() {
    this[e] = t;
  };
}
function Ih(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Oh(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Lh : typeof t == "function" ? Ih : kh)(e, t)) : this.node()[e];
}
function Sl(e) {
  return e.trim().split(/^|\s+/);
}
function Ea(e) {
  return e.classList || new xl(e);
}
function xl(e) {
  this._node = e, this._names = Sl(e.getAttribute("class") || "");
}
xl.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function wl(e, t) {
  for (var n = Ea(e), r = -1, i = t.length; ++r < i; ) n.add(t[r]);
}
function bl(e, t) {
  for (var n = Ea(e), r = -1, i = t.length; ++r < i; ) n.remove(t[r]);
}
function Bh(e) {
  return function() {
    wl(this, e);
  };
}
function Ph(e) {
  return function() {
    bl(this, e);
  };
}
function Fh(e, t) {
  return function() {
    (t.apply(this, arguments) ? wl : bl)(this, e);
  };
}
function Uh(e, t) {
  var n = Sl(e + "");
  if (arguments.length < 2) {
    for (var r = Ea(this.node()), i = -1, a = n.length; ++i < a; ) if (!r.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Fh : t ? Bh : Ph)(n, t));
}
function Hh() {
  this.textContent = "";
}
function zh(e) {
  return function() {
    this.textContent = e;
  };
}
function $h(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Wh(e) {
  return arguments.length ? this.each(e == null ? Hh : (typeof e == "function" ? $h : zh)(e)) : this.node().textContent;
}
function Yh() {
  this.innerHTML = "";
}
function Gh(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Vh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Xh(e) {
  return arguments.length ? this.each(e == null ? Yh : (typeof e == "function" ? Vh : Gh)(e)) : this.node().innerHTML;
}
function jh() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function qh() {
  return this.each(jh);
}
function Zh() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Kh() {
  return this.each(Zh);
}
function Qh(e) {
  var t = typeof e == "function" ? e : dl(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Jh() {
  return null;
}
function td(e, t) {
  var n = typeof e == "function" ? e : dl(e), r = t == null ? Jh : typeof t == "function" ? t : _a(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function ed() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function nd() {
  return this.each(ed);
}
function rd() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function id() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function ad(e) {
  return this.select(e ? id : rd);
}
function sd(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function od(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function ld(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function cd(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, i = t.length, a; n < i; ++n)
        a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function ud(e, t, n) {
  return function() {
    var r = this.__on, i, a = od(t);
    if (r) {
      for (var s = 0, o = r.length; s < o; ++s)
        if ((i = r[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, a, n), i = { type: e.type, name: e.name, value: t, listener: a, options: n }, r ? r.push(i) : this.__on = [i];
  };
}
function hd(e, t, n) {
  var r = ld(e + ""), i, a = r.length, s;
  if (arguments.length < 2) {
    var o = this.node().__on;
    if (o) {
      for (var c = 0, l = o.length, u; c < l; ++c)
        for (i = 0, u = o[c]; i < a; ++i)
          if ((s = r[i]).type === u.type && s.name === u.name)
            return u.value;
    }
    return;
  }
  for (o = t ? ud : cd, i = 0; i < a; ++i) this.each(o(r[i], t, n));
  return this;
}
function Tl(e, t, n) {
  var r = vl(e), i = r.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function dd(e, t) {
  return function() {
    return Tl(this, e, t);
  };
}
function fd(e, t) {
  return function() {
    return Tl(this, e, t.apply(this, arguments));
  };
}
function gd(e, t) {
  return this.each((typeof t == "function" ? fd : dd)(e, t));
}
function* pd() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], i = 0, a = r.length, s; i < a; ++i)
      (s = r[i]) && (yield s);
}
var Na = [null];
function Lt(e, t) {
  this._groups = e, this._parents = t;
}
function ir() {
  return new Lt([[document.documentElement]], Na);
}
function md() {
  return this;
}
Lt.prototype = ir.prototype = {
  constructor: Lt,
  select: Wu,
  selectAll: Vu,
  selectChild: Zu,
  selectChildren: th,
  filter: eh,
  data: oh,
  enter: nh,
  exit: ch,
  join: uh,
  merge: hh,
  selection: md,
  order: dh,
  sort: fh,
  call: ph,
  nodes: mh,
  node: yh,
  size: vh,
  empty: Sh,
  each: xh,
  attr: Ch,
  style: Rh,
  property: Oh,
  classed: Uh,
  text: Wh,
  html: Xh,
  raise: qh,
  lower: Kh,
  append: Qh,
  insert: td,
  remove: nd,
  clone: ad,
  datum: sd,
  on: hd,
  dispatch: gd,
  [Symbol.iterator]: pd
};
function P(e) {
  return typeof e == "string" ? new Lt([[document.querySelector(e)]], [document.documentElement]) : new Lt([[e]], Na);
}
function yd(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Et(e, t) {
  if (e = yd(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var r = n.createSVGPoint();
      return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
function vd(e) {
  return typeof e == "string" ? new Lt([document.querySelectorAll(e)], [document.documentElement]) : new Lt([fl(e)], Na);
}
const Sd = { passive: !1 }, Wn = { capture: !0, passive: !1 };
function Si(e) {
  e.stopImmediatePropagation();
}
function nn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Ra(e) {
  var t = e.document.documentElement, n = P(e).on("dragstart.drag", nn, Wn);
  "onselectstart" in t ? n.on("selectstart.drag", nn, Wn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function La(e, t) {
  var n = e.document.documentElement, r = P(e).on("dragstart.drag", null);
  t && (r.on("click.drag", nn, Wn), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const ur = (e) => () => e;
function sa(e, {
  sourceEvent: t,
  subject: n,
  target: r,
  identifier: i,
  active: a,
  x: s,
  y: o,
  dx: c,
  dy: l,
  dispatch: u
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: r, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: a, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: o, enumerable: !0, configurable: !0 },
    dx: { value: c, enumerable: !0, configurable: !0 },
    dy: { value: l, enumerable: !0, configurable: !0 },
    _: { value: u }
  });
}
sa.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function xd(e) {
  return !e.ctrlKey && !e.button;
}
function wd() {
  return this.parentNode;
}
function bd(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Td() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ad() {
  var e = xd, t = wd, n = bd, r = Td, i = {}, a = rr("start", "drag", "end"), s = 0, o, c, l, u, h = 0;
  function d(v) {
    v.on("mousedown.drag", f).filter(r).on("touchstart.drag", g).on("touchmove.drag", p, Sd).on("touchend.drag touchcancel.drag", x).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function f(v, T) {
    if (!(u || !e.call(this, v, T))) {
      var A = w(this, t.call(this, v, T), v, T, "mouse");
      A && (P(v.view).on("mousemove.drag", m, Wn).on("mouseup.drag", y, Wn), Ra(v.view), Si(v), l = !1, o = v.clientX, c = v.clientY, A("start", v));
    }
  }
  function m(v) {
    if (nn(v), !l) {
      var T = v.clientX - o, A = v.clientY - c;
      l = T * T + A * A > h;
    }
    i.mouse("drag", v);
  }
  function y(v) {
    P(v.view).on("mousemove.drag mouseup.drag", null), La(v.view, l), nn(v), i.mouse("end", v);
  }
  function g(v, T) {
    if (e.call(this, v, T)) {
      var A = v.changedTouches, R = t.call(this, v, T), O = A.length, E, N;
      for (E = 0; E < O; ++E)
        (N = w(this, R, v, T, A[E].identifier, A[E])) && (Si(v), N("start", v, A[E]));
    }
  }
  function p(v) {
    var T = v.changedTouches, A = T.length, R, O;
    for (R = 0; R < A; ++R)
      (O = i[T[R].identifier]) && (nn(v), O("drag", v, T[R]));
  }
  function x(v) {
    var T = v.changedTouches, A = T.length, R, O;
    for (u && clearTimeout(u), u = setTimeout(function() {
      u = null;
    }, 500), R = 0; R < A; ++R)
      (O = i[T[R].identifier]) && (Si(v), O("end", v, T[R]));
  }
  function w(v, T, A, R, O, E) {
    var N = a.copy(), _ = Et(E || A, T), D, b, S;
    if ((S = n.call(v, new sa("beforestart", {
      sourceEvent: A,
      target: d,
      identifier: O,
      active: s,
      x: _[0],
      y: _[1],
      dx: 0,
      dy: 0,
      dispatch: N
    }), R)) != null)
      return D = S.x - _[0] || 0, b = S.y - _[1] || 0, function L(M, k, H) {
        var F = _, U;
        switch (M) {
          case "start":
            i[O] = L, U = s++;
            break;
          case "end":
            delete i[O], --s;
          // falls through
          case "drag":
            _ = Et(H || k, T), U = s;
            break;
        }
        N.call(
          M,
          v,
          new sa(M, {
            sourceEvent: k,
            subject: S,
            target: d,
            identifier: O,
            active: U,
            x: _[0] + D,
            y: _[1] + b,
            dx: _[0] - F[0],
            dy: _[1] - F[1],
            dispatch: N
          }),
          R
        );
      };
  }
  return d.filter = function(v) {
    return arguments.length ? (e = typeof v == "function" ? v : ur(!!v), d) : e;
  }, d.container = function(v) {
    return arguments.length ? (t = typeof v == "function" ? v : ur(v), d) : t;
  }, d.subject = function(v) {
    return arguments.length ? (n = typeof v == "function" ? v : ur(v), d) : n;
  }, d.touchable = function(v) {
    return arguments.length ? (r = typeof v == "function" ? v : ur(!!v), d) : r;
  }, d.on = function() {
    var v = a.on.apply(a, arguments);
    return v === a ? d : v;
  }, d.clickDistance = function(v) {
    return arguments.length ? (h = (v = +v) * v, d) : Math.sqrt(h);
  }, d;
}
function ka(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Al(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function ar() {
}
var Yn = 0.7, Fr = 1 / Yn, rn = "\\s*([+-]?\\d+)\\s*", Gn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", ne = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Dd = /^#([0-9a-f]{3,8})$/, Md = new RegExp(`^rgb\\(${rn},${rn},${rn}\\)$`), Cd = new RegExp(`^rgb\\(${ne},${ne},${ne}\\)$`), _d = new RegExp(`^rgba\\(${rn},${rn},${rn},${Gn}\\)$`), Ed = new RegExp(`^rgba\\(${ne},${ne},${ne},${Gn}\\)$`), Nd = new RegExp(`^hsl\\(${Gn},${ne},${ne}\\)$`), Rd = new RegExp(`^hsla\\(${Gn},${ne},${ne},${Gn}\\)$`), vs = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
ka(ar, Ue, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ss,
  // Deprecated! Use color.formatHex.
  formatHex: Ss,
  formatHex8: Ld,
  formatHsl: kd,
  formatRgb: xs,
  toString: xs
});
function Ss() {
  return this.rgb().formatHex();
}
function Ld() {
  return this.rgb().formatHex8();
}
function kd() {
  return Dl(this).formatHsl();
}
function xs() {
  return this.rgb().formatRgb();
}
function Ue(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Dd.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? ws(t) : n === 3 ? new Pt(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? hr(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? hr(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Md.exec(e)) ? new Pt(t[1], t[2], t[3], 1) : (t = Cd.exec(e)) ? new Pt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = _d.exec(e)) ? hr(t[1], t[2], t[3], t[4]) : (t = Ed.exec(e)) ? hr(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Nd.exec(e)) ? As(t[1], t[2] / 100, t[3] / 100, 1) : (t = Rd.exec(e)) ? As(t[1], t[2] / 100, t[3] / 100, t[4]) : vs.hasOwnProperty(e) ? ws(vs[e]) : e === "transparent" ? new Pt(NaN, NaN, NaN, 0) : null;
}
function ws(e) {
  return new Pt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function hr(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Pt(e, t, n, r);
}
function Id(e) {
  return e instanceof ar || (e = Ue(e)), e ? (e = e.rgb(), new Pt(e.r, e.g, e.b, e.opacity)) : new Pt();
}
function oa(e, t, n, r) {
  return arguments.length === 1 ? Id(e) : new Pt(e, t, n, r ?? 1);
}
function Pt(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
ka(Pt, oa, Al(ar, {
  brighter(e) {
    return e = e == null ? Fr : Math.pow(Fr, e), new Pt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Yn : Math.pow(Yn, e), new Pt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Pt(Be(this.r), Be(this.g), Be(this.b), Ur(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: bs,
  // Deprecated! Use color.formatHex.
  formatHex: bs,
  formatHex8: Od,
  formatRgb: Ts,
  toString: Ts
}));
function bs() {
  return `#${Ie(this.r)}${Ie(this.g)}${Ie(this.b)}`;
}
function Od() {
  return `#${Ie(this.r)}${Ie(this.g)}${Ie(this.b)}${Ie((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Ts() {
  const e = Ur(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Be(this.r)}, ${Be(this.g)}, ${Be(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Ur(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Be(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ie(e) {
  return e = Be(e), (e < 16 ? "0" : "") + e.toString(16);
}
function As(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new qt(e, t, n, r);
}
function Dl(e) {
  if (e instanceof qt) return new qt(e.h, e.s, e.l, e.opacity);
  if (e instanceof ar || (e = Ue(e)), !e) return new qt();
  if (e instanceof qt) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), s = NaN, o = a - i, c = (a + i) / 2;
  return o ? (t === a ? s = (n - r) / o + (n < r) * 6 : n === a ? s = (r - t) / o + 2 : s = (t - n) / o + 4, o /= c < 0.5 ? a + i : 2 - a - i, s *= 60) : o = c > 0 && c < 1 ? 0 : s, new qt(s, o, c, e.opacity);
}
function Bd(e, t, n, r) {
  return arguments.length === 1 ? Dl(e) : new qt(e, t, n, r ?? 1);
}
function qt(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
ka(qt, Bd, Al(ar, {
  brighter(e) {
    return e = e == null ? Fr : Math.pow(Fr, e), new qt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Yn : Math.pow(Yn, e), new qt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - r;
    return new Pt(
      xi(e >= 240 ? e - 240 : e + 120, i, r),
      xi(e, i, r),
      xi(e < 120 ? e + 240 : e - 120, i, r),
      this.opacity
    );
  },
  clamp() {
    return new qt(Ds(this.h), dr(this.s), dr(this.l), Ur(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Ur(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Ds(this.h)}, ${dr(this.s) * 100}%, ${dr(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Ds(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function dr(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function xi(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Ia = (e) => () => e;
function Pd(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Fd(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Ud(e) {
  return (e = +e) == 1 ? Ml : function(t, n) {
    return n - t ? Fd(t, n, e) : Ia(isNaN(t) ? n : t);
  };
}
function Ml(e, t) {
  var n = t - e;
  return n ? Pd(e, n) : Ia(isNaN(e) ? t : e);
}
const Hr = (function e(t) {
  var n = Ud(t);
  function r(i, a) {
    var s = n((i = oa(i)).r, (a = oa(a)).r), o = n(i.g, a.g), c = n(i.b, a.b), l = Ml(i.opacity, a.opacity);
    return function(u) {
      return i.r = s(u), i.g = o(u), i.b = c(u), i.opacity = l(u), i + "";
    };
  }
  return r.gamma = e, r;
})(1);
function Hd(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
  return function(a) {
    for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
    return r;
  };
}
function zd(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function $d(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = new Array(r), a = new Array(n), s;
  for (s = 0; s < r; ++s) i[s] = Pe(e[s], t[s]);
  for (; s < n; ++s) a[s] = t[s];
  return function(o) {
    for (s = 0; s < r; ++s) a[s] = i[s](o);
    return a;
  };
}
function Wd(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Ft(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Yd(e, t) {
  var n = {}, r = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = Pe(e[i], t[i]) : r[i] = t[i];
  return function(a) {
    for (i in n) r[i] = n[i](a);
    return r;
  };
}
var la = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, wi = new RegExp(la.source, "g");
function Gd(e) {
  return function() {
    return e;
  };
}
function Vd(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Cl(e, t) {
  var n = la.lastIndex = wi.lastIndex = 0, r, i, a, s = -1, o = [], c = [];
  for (e = e + "", t = t + ""; (r = la.exec(e)) && (i = wi.exec(t)); )
    (a = i.index) > n && (a = t.slice(n, a), o[s] ? o[s] += a : o[++s] = a), (r = r[0]) === (i = i[0]) ? o[s] ? o[s] += i : o[++s] = i : (o[++s] = null, c.push({ i: s, x: Ft(r, i) })), n = wi.lastIndex;
  return n < t.length && (a = t.slice(n), o[s] ? o[s] += a : o[++s] = a), o.length < 2 ? c[0] ? Vd(c[0].x) : Gd(t) : (t = c.length, function(l) {
    for (var u = 0, h; u < t; ++u) o[(h = c[u]).i] = h.x(l);
    return o.join("");
  });
}
function Pe(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Ia(t) : (n === "number" ? Ft : n === "string" ? (r = Ue(t)) ? (t = r, Hr) : Cl : t instanceof Ue ? Hr : t instanceof Date ? Wd : zd(t) ? Hd : Array.isArray(t) ? $d : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Yd : Ft)(e, t);
}
function Xd(e, t) {
  return e = +e, t = +t, function(n) {
    return Math.round(e * (1 - n) + t * n);
  };
}
var Ms = 180 / Math.PI, ca = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function _l(e, t, n, r, i, a) {
  var s, o, c;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (c = e * n + t * r) && (n -= e * c, r -= t * c), (o = Math.sqrt(n * n + r * r)) && (n /= o, r /= o, c /= o), e * r < t * n && (e = -e, t = -t, c = -c, s = -s), {
    translateX: i,
    translateY: a,
    rotate: Math.atan2(t, e) * Ms,
    skewX: Math.atan(c) * Ms,
    scaleX: s,
    scaleY: o
  };
}
var fr;
function jd(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? ca : _l(t.a, t.b, t.c, t.d, t.e, t.f);
}
function qd(e) {
  return e == null || (fr || (fr = document.createElementNS("http://www.w3.org/2000/svg", "g")), fr.setAttribute("transform", e), !(e = fr.transform.baseVal.consolidate())) ? ca : (e = e.matrix, _l(e.a, e.b, e.c, e.d, e.e, e.f));
}
function El(e, t, n, r) {
  function i(l) {
    return l.length ? l.pop() + " " : "";
  }
  function a(l, u, h, d, f, m) {
    if (l !== h || u !== d) {
      var y = f.push("translate(", null, t, null, n);
      m.push({ i: y - 4, x: Ft(l, h) }, { i: y - 2, x: Ft(u, d) });
    } else (h || d) && f.push("translate(" + h + t + d + n);
  }
  function s(l, u, h, d) {
    l !== u ? (l - u > 180 ? u += 360 : u - l > 180 && (l += 360), d.push({ i: h.push(i(h) + "rotate(", null, r) - 2, x: Ft(l, u) })) : u && h.push(i(h) + "rotate(" + u + r);
  }
  function o(l, u, h, d) {
    l !== u ? d.push({ i: h.push(i(h) + "skewX(", null, r) - 2, x: Ft(l, u) }) : u && h.push(i(h) + "skewX(" + u + r);
  }
  function c(l, u, h, d, f, m) {
    if (l !== h || u !== d) {
      var y = f.push(i(f) + "scale(", null, ",", null, ")");
      m.push({ i: y - 4, x: Ft(l, h) }, { i: y - 2, x: Ft(u, d) });
    } else (h !== 1 || d !== 1) && f.push(i(f) + "scale(" + h + "," + d + ")");
  }
  return function(l, u) {
    var h = [], d = [];
    return l = e(l), u = e(u), a(l.translateX, l.translateY, u.translateX, u.translateY, h, d), s(l.rotate, u.rotate, h, d), o(l.skewX, u.skewX, h, d), c(l.scaleX, l.scaleY, u.scaleX, u.scaleY, h, d), l = u = null, function(f) {
      for (var m = -1, y = d.length, g; ++m < y; ) h[(g = d[m]).i] = g.x(f);
      return h.join("");
    };
  };
}
var Zd = El(jd, "px, ", "px)", "deg)"), Kd = El(qd, ", ", ")", ")"), Qd = 1e-12;
function Cs(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Jd(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function tf(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const ef = (function e(t, n, r) {
  function i(a, s) {
    var o = a[0], c = a[1], l = a[2], u = s[0], h = s[1], d = s[2], f = u - o, m = h - c, y = f * f + m * m, g, p;
    if (y < Qd)
      p = Math.log(d / l) / t, g = function(R) {
        return [
          o + R * f,
          c + R * m,
          l * Math.exp(t * R * p)
        ];
      };
    else {
      var x = Math.sqrt(y), w = (d * d - l * l + r * y) / (2 * l * n * x), v = (d * d - l * l - r * y) / (2 * d * n * x), T = Math.log(Math.sqrt(w * w + 1) - w), A = Math.log(Math.sqrt(v * v + 1) - v);
      p = (A - T) / t, g = function(R) {
        var O = R * p, E = Cs(T), N = l / (n * x) * (E * tf(t * O + T) - Jd(T));
        return [
          o + N * f,
          c + N * m,
          l * E / Cs(t * O + T)
        ];
      };
    }
    return g.duration = p * 1e3 * t / Math.SQRT2, g;
  }
  return i.rho = function(a) {
    var s = Math.max(1e-3, +a), o = s * s, c = o * o;
    return e(s, o, c);
  }, i;
})(Math.SQRT2, 2, 4);
var dn = 0, Nn = 0, bn = 0, Nl = 1e3, zr, Rn, $r = 0, He = 0, li = 0, Vn = typeof performance == "object" && performance.now ? performance : Date, Rl = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Oa() {
  return He || (Rl(nf), He = Vn.now() + li);
}
function nf() {
  He = 0;
}
function Wr() {
  this._call = this._time = this._next = null;
}
Wr.prototype = Ba.prototype = {
  constructor: Wr,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Oa() : +n) + (t == null ? 0 : +t), !this._next && Rn !== this && (Rn ? Rn._next = this : zr = this, Rn = this), this._call = e, this._time = n, ua();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ua());
  }
};
function Ba(e, t, n) {
  var r = new Wr();
  return r.restart(e, t, n), r;
}
function rf() {
  Oa(), ++dn;
  for (var e = zr, t; e; )
    (t = He - e._time) >= 0 && e._call.call(null, t), e = e._next;
  --dn;
}
function _s() {
  He = ($r = Vn.now()) + li, dn = Nn = 0;
  try {
    rf();
  } finally {
    dn = 0, sf(), He = 0;
  }
}
function af() {
  var e = Vn.now(), t = e - $r;
  t > Nl && (li -= t, $r = e);
}
function sf() {
  for (var e, t = zr, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : zr = n);
  Rn = e, ua(r);
}
function ua(e) {
  if (!dn) {
    Nn && (Nn = clearTimeout(Nn));
    var t = e - He;
    t > 24 ? (e < 1 / 0 && (Nn = setTimeout(_s, e - Vn.now() - li)), bn && (bn = clearInterval(bn))) : (bn || ($r = Vn.now(), bn = setInterval(af, Nl)), dn = 1, Rl(_s));
  }
}
function Es(e, t, n) {
  var r = new Wr();
  return t = t == null ? 0 : +t, r.restart((i) => {
    r.stop(), e(i + t);
  }, t, n), r;
}
var of = rr("start", "end", "cancel", "interrupt"), lf = [], Ll = 0, Ns = 1, ha = 2, Mr = 3, Rs = 4, da = 5, Cr = 6;
function ci(e, t, n, r, i, a) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  cf(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: i,
    // For context during callback.
    on: of,
    tween: lf,
    time: a.time,
    delay: a.delay,
    duration: a.duration,
    ease: a.ease,
    timer: null,
    state: Ll
  });
}
function Pa(e, t) {
  var n = Zt(e, t);
  if (n.state > Ll) throw new Error("too late; already scheduled");
  return n;
}
function ie(e, t) {
  var n = Zt(e, t);
  if (n.state > Mr) throw new Error("too late; already running");
  return n;
}
function Zt(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function cf(e, t, n) {
  var r = e.__transition, i;
  r[t] = n, n.timer = Ba(a, 0, n.time);
  function a(l) {
    n.state = Ns, n.timer.restart(s, n.delay, n.time), n.delay <= l && s(l - n.delay);
  }
  function s(l) {
    var u, h, d, f;
    if (n.state !== Ns) return c();
    for (u in r)
      if (f = r[u], f.name === n.name) {
        if (f.state === Mr) return Es(s);
        f.state === Rs ? (f.state = Cr, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[u]) : +u < t && (f.state = Cr, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[u]);
      }
    if (Es(function() {
      n.state === Mr && (n.state = Rs, n.timer.restart(o, n.delay, n.time), o(l));
    }), n.state = ha, n.on.call("start", e, e.__data__, n.index, n.group), n.state === ha) {
      for (n.state = Mr, i = new Array(d = n.tween.length), u = 0, h = -1; u < d; ++u)
        (f = n.tween[u].value.call(e, e.__data__, n.index, n.group)) && (i[++h] = f);
      i.length = h + 1;
    }
  }
  function o(l) {
    for (var u = l < n.duration ? n.ease.call(null, l / n.duration) : (n.timer.restart(c), n.state = da, 1), h = -1, d = i.length; ++h < d; )
      i[h].call(e, u);
    n.state === da && (n.on.call("end", e, e.__data__, n.index, n.group), c());
  }
  function c() {
    n.state = Cr, n.timer.stop(), delete r[t];
    for (var l in r) return;
    delete e.__transition;
  }
}
function an(e, t) {
  var n = e.__transition, r, i, a = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        a = !1;
        continue;
      }
      i = r.state > ha && r.state < da, r.state = Cr, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    a && delete e.__transition;
  }
}
function uf(e) {
  return this.each(function() {
    an(this, e);
  });
}
function hf(e, t) {
  var n, r;
  return function() {
    var i = ie(this, e), a = i.tween;
    if (a !== n) {
      r = n = a;
      for (var s = 0, o = r.length; s < o; ++s)
        if (r[s].name === t) {
          r = r.slice(), r.splice(s, 1);
          break;
        }
    }
    i.tween = r;
  };
}
function df(e, t, n) {
  var r, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var a = ie(this, e), s = a.tween;
    if (s !== r) {
      i = (r = s).slice();
      for (var o = { name: t, value: n }, c = 0, l = i.length; c < l; ++c)
        if (i[c].name === t) {
          i[c] = o;
          break;
        }
      c === l && i.push(o);
    }
    a.tween = i;
  };
}
function ff(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = Zt(this.node(), n).tween, i = 0, a = r.length, s; i < a; ++i)
      if ((s = r[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? hf : df)(n, e, t));
}
function Fa(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var i = ie(this, r);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return Zt(i, r).value[t];
  };
}
function kl(e, t) {
  var n;
  return (typeof t == "number" ? Ft : t instanceof Ue ? Hr : (n = Ue(t)) ? (t = n, Hr) : Cl)(e, t);
}
function gf(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function pf(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function mf(e, t, n) {
  var r, i = n + "", a;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === r ? a : a = t(r = s, n);
  };
}
function yf(e, t, n) {
  var r, i = n + "", a;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === r ? a : a = t(r = s, n);
  };
}
function vf(e, t, n) {
  var r, i, a;
  return function() {
    var s, o = n(this), c;
    return o == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), c = o + "", s === c ? null : s === r && c === i ? a : (i = c, a = t(r = s, o)));
  };
}
function Sf(e, t, n) {
  var r, i, a;
  return function() {
    var s, o = n(this), c;
    return o == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), c = o + "", s === c ? null : s === r && c === i ? a : (i = c, a = t(r = s, o)));
  };
}
function xf(e, t) {
  var n = oi(e), r = n === "transform" ? Kd : kl;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Sf : vf)(n, r, Fa(this, "attr." + e, t)) : t == null ? (n.local ? pf : gf)(n) : (n.local ? yf : mf)(n, r, t));
}
function wf(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function bf(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Tf(e, t) {
  var n, r;
  function i() {
    var a = t.apply(this, arguments);
    return a !== r && (n = (r = a) && bf(e, a)), n;
  }
  return i._value = t, i;
}
function Af(e, t) {
  var n, r;
  function i() {
    var a = t.apply(this, arguments);
    return a !== r && (n = (r = a) && wf(e, a)), n;
  }
  return i._value = t, i;
}
function Df(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = oi(e);
  return this.tween(n, (r.local ? Tf : Af)(r, t));
}
function Mf(e, t) {
  return function() {
    Pa(this, e).delay = +t.apply(this, arguments);
  };
}
function Cf(e, t) {
  return t = +t, function() {
    Pa(this, e).delay = t;
  };
}
function _f(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Mf : Cf)(t, e)) : Zt(this.node(), t).delay;
}
function Ef(e, t) {
  return function() {
    ie(this, e).duration = +t.apply(this, arguments);
  };
}
function Nf(e, t) {
  return t = +t, function() {
    ie(this, e).duration = t;
  };
}
function Rf(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Ef : Nf)(t, e)) : Zt(this.node(), t).duration;
}
function Lf(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    ie(this, e).ease = t;
  };
}
function kf(e) {
  var t = this._id;
  return arguments.length ? this.each(Lf(t, e)) : Zt(this.node(), t).ease;
}
function If(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    ie(this, e).ease = n;
  };
}
function Of(e) {
  if (typeof e != "function") throw new Error();
  return this.each(If(this._id, e));
}
function Bf(e) {
  typeof e != "function" && (e = pl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], s = a.length, o = r[i] = [], c, l = 0; l < s; ++l)
      (c = a[l]) && e.call(c, c.__data__, l, a) && o.push(c);
  return new me(r, this._parents, this._name, this._id);
}
function Pf(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), s = new Array(r), o = 0; o < a; ++o)
    for (var c = t[o], l = n[o], u = c.length, h = s[o] = new Array(u), d, f = 0; f < u; ++f)
      (d = c[f] || l[f]) && (h[f] = d);
  for (; o < r; ++o)
    s[o] = t[o];
  return new me(s, this._parents, this._name, this._id);
}
function Ff(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Uf(e, t, n) {
  var r, i, a = Ff(t) ? Pa : ie;
  return function() {
    var s = a(this, e), o = s.on;
    o !== r && (i = (r = o).copy()).on(t, n), s.on = i;
  };
}
function Hf(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Zt(this.node(), n).on.on(e) : this.each(Uf(n, e, t));
}
function zf(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function $f() {
  return this.on("end.remove", zf(this._id));
}
function Wf(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = _a(e));
  for (var r = this._groups, i = r.length, a = new Array(i), s = 0; s < i; ++s)
    for (var o = r[s], c = o.length, l = a[s] = new Array(c), u, h, d = 0; d < c; ++d)
      (u = o[d]) && (h = e.call(u, u.__data__, d, o)) && ("__data__" in u && (h.__data__ = u.__data__), l[d] = h, ci(l[d], t, n, d, l, Zt(u, n)));
  return new me(a, this._parents, t, n);
}
function Yf(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = gl(e));
  for (var r = this._groups, i = r.length, a = [], s = [], o = 0; o < i; ++o)
    for (var c = r[o], l = c.length, u, h = 0; h < l; ++h)
      if (u = c[h]) {
        for (var d = e.call(u, u.__data__, h, c), f, m = Zt(u, n), y = 0, g = d.length; y < g; ++y)
          (f = d[y]) && ci(f, t, n, y, d, m);
        a.push(d), s.push(u);
      }
  return new me(a, s, t, n);
}
var Gf = ir.prototype.constructor;
function Vf() {
  return new Gf(this._groups, this._parents);
}
function Xf(e, t) {
  var n, r, i;
  return function() {
    var a = hn(this, e), s = (this.style.removeProperty(e), hn(this, e));
    return a === s ? null : a === n && s === r ? i : i = t(n = a, r = s);
  };
}
function Il(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function jf(e, t, n) {
  var r, i = n + "", a;
  return function() {
    var s = hn(this, e);
    return s === i ? null : s === r ? a : a = t(r = s, n);
  };
}
function qf(e, t, n) {
  var r, i, a;
  return function() {
    var s = hn(this, e), o = n(this), c = o + "";
    return o == null && (c = o = (this.style.removeProperty(e), hn(this, e))), s === c ? null : s === r && c === i ? a : (i = c, a = t(r = s, o));
  };
}
function Zf(e, t) {
  var n, r, i, a = "style." + t, s = "end." + a, o;
  return function() {
    var c = ie(this, e), l = c.on, u = c.value[a] == null ? o || (o = Il(t)) : void 0;
    (l !== n || i !== u) && (r = (n = l).copy()).on(s, i = u), c.on = r;
  };
}
function Kf(e, t, n) {
  var r = (e += "") == "transform" ? Zd : kl;
  return t == null ? this.styleTween(e, Xf(e, r)).on("end.style." + e, Il(e)) : typeof t == "function" ? this.styleTween(e, qf(e, r, Fa(this, "style." + e, t))).each(Zf(this._id, e)) : this.styleTween(e, jf(e, r, t), n).on("end.style." + e, null);
}
function Qf(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function Jf(e, t, n) {
  var r, i;
  function a() {
    var s = t.apply(this, arguments);
    return s !== i && (r = (i = s) && Qf(e, s, n)), r;
  }
  return a._value = t, a;
}
function tg(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, Jf(e, t, n ?? ""));
}
function eg(e) {
  return function() {
    this.textContent = e;
  };
}
function ng(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function rg(e) {
  return this.tween("text", typeof e == "function" ? ng(Fa(this, "text", e)) : eg(e == null ? "" : e + ""));
}
function ig(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function ag(e) {
  var t, n;
  function r() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && ig(i)), t;
  }
  return r._value = e, r;
}
function sg(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, ag(e));
}
function og() {
  for (var e = this._name, t = this._id, n = Ol(), r = this._groups, i = r.length, a = 0; a < i; ++a)
    for (var s = r[a], o = s.length, c, l = 0; l < o; ++l)
      if (c = s[l]) {
        var u = Zt(c, t);
        ci(c, e, n, l, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new me(r, this._parents, e, n);
}
function lg() {
  var e, t, n = this, r = n._id, i = n.size();
  return new Promise(function(a, s) {
    var o = { value: s }, c = { value: function() {
      --i === 0 && a();
    } };
    n.each(function() {
      var l = ie(this, r), u = l.on;
      u !== e && (t = (e = u).copy(), t._.cancel.push(o), t._.interrupt.push(o), t._.end.push(c)), l.on = t;
    }), i === 0 && a();
  });
}
var cg = 0;
function me(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ol() {
  return ++cg;
}
var ae = ir.prototype;
me.prototype = {
  constructor: me,
  select: Wf,
  selectAll: Yf,
  selectChild: ae.selectChild,
  selectChildren: ae.selectChildren,
  filter: Bf,
  merge: Pf,
  selection: Vf,
  transition: og,
  call: ae.call,
  nodes: ae.nodes,
  node: ae.node,
  size: ae.size,
  empty: ae.empty,
  each: ae.each,
  on: Hf,
  attr: xf,
  attrTween: Df,
  style: Kf,
  styleTween: tg,
  text: rg,
  textTween: sg,
  remove: $f,
  tween: ff,
  delay: _f,
  duration: Rf,
  ease: kf,
  easeVarying: Of,
  end: lg,
  [Symbol.iterator]: ae[Symbol.iterator]
};
function ug(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var hg = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: ug
};
function dg(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function fg(e) {
  var t, n;
  e instanceof me ? (t = e._id, e = e._name) : (t = Ol(), (n = hg).time = Oa(), e = e == null ? null : e + "");
  for (var r = this._groups, i = r.length, a = 0; a < i; ++a)
    for (var s = r[a], o = s.length, c, l = 0; l < o; ++l)
      (c = s[l]) && ci(c, e, t, l, s, n || dg(c, t));
  return new me(r, this._parents, e, t);
}
ir.prototype.interrupt = uf;
ir.prototype.transition = fg;
const bi = (e) => () => e;
function gg(e, {
  sourceEvent: t,
  target: n,
  selection: r,
  mode: i,
  dispatch: a
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    selection: { value: r, enumerable: !0, configurable: !0 },
    mode: { value: i, enumerable: !0, configurable: !0 },
    _: { value: a }
  });
}
function pg(e) {
  e.stopImmediatePropagation();
}
function Ti(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
var Ls = { name: "drag" }, Ai = { name: "space" }, Ge = { name: "handle" }, Ve = { name: "center" };
const { abs: ks, max: Dt, min: Mt } = Math;
function Is(e) {
  return [+e[0], +e[1]];
}
function fa(e) {
  return [Is(e[0]), Is(e[1])];
}
var _r = {
  name: "x",
  handles: ["w", "e"].map(Yr),
  input: function(e, t) {
    return e == null ? null : [[+e[0], t[0][1]], [+e[1], t[1][1]]];
  },
  output: function(e) {
    return e && [e[0][0], e[1][0]];
  }
}, Di = {}, mg = {
  name: "xy",
  handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(Yr),
  input: function(e) {
    return e == null ? null : fa(e);
  },
  output: function(e) {
    return e;
  }
}, se = {
  overlay: "crosshair",
  selection: "move",
  n: "ns-resize",
  e: "ew-resize",
  s: "ns-resize",
  w: "ew-resize",
  nw: "nwse-resize",
  ne: "nesw-resize",
  se: "nwse-resize",
  sw: "nesw-resize"
}, Os = {
  e: "w",
  w: "e",
  nw: "ne",
  ne: "nw",
  se: "sw",
  sw: "se"
}, Bs = {
  n: "s",
  s: "n",
  nw: "sw",
  ne: "se",
  se: "ne",
  sw: "nw"
}, yg = {
  overlay: 1,
  selection: 1,
  n: null,
  e: 1,
  s: null,
  w: -1,
  nw: -1,
  ne: 1,
  se: 1,
  sw: -1
}, vg = {
  overlay: 1,
  selection: 1,
  n: -1,
  e: null,
  s: 1,
  w: null,
  nw: -1,
  ne: -1,
  se: 1,
  sw: 1
};
function Yr(e) {
  return { type: e };
}
function Sg(e) {
  return !e.ctrlKey && !e.button;
}
function xg() {
  var e = this.ownerSVGElement || this;
  return e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
}
function wg() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Mi(e) {
  for (; !e.__brush; ) if (!(e = e.parentNode)) return;
  return e.__brush;
}
function bg(e) {
  return e[0][0] === e[1][0] || e[0][1] === e[1][1];
}
function Tg() {
  return Bl(_r);
}
function Ag() {
  return Bl(mg);
}
function Bl(e) {
  var t = xg, n = Sg, r = wg, i = !0, a = rr("start", "brush", "end"), s = 6, o;
  function c(g) {
    var p = g.property("__brush", y).selectAll(".overlay").data([Yr("overlay")]);
    p.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", se.overlay).merge(p).each(function() {
      var w = Mi(this).extent;
      P(this).attr("x", w[0][0]).attr("y", w[0][1]).attr("width", w[1][0] - w[0][0]).attr("height", w[1][1] - w[0][1]);
    }), g.selectAll(".selection").data([Yr("selection")]).enter().append("rect").attr("class", "selection").attr("cursor", se.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");
    var x = g.selectAll(".handle").data(e.handles, function(w) {
      return w.type;
    });
    x.exit().remove(), x.enter().append("rect").attr("class", function(w) {
      return "handle handle--" + w.type;
    }).attr("cursor", function(w) {
      return se[w.type];
    }), g.each(l).attr("fill", "none").attr("pointer-events", "all").on("mousedown.brush", d).filter(r).on("touchstart.brush", d).on("touchmove.brush", f).on("touchend.brush touchcancel.brush", m).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  c.move = function(g, p, x) {
    g.tween ? g.on("start.brush", function(w) {
      u(this, arguments).beforestart().start(w);
    }).on("interrupt.brush end.brush", function(w) {
      u(this, arguments).end(w);
    }).tween("brush", function() {
      var w = this, v = w.__brush, T = u(w, arguments), A = v.selection, R = e.input(typeof p == "function" ? p.apply(this, arguments) : p, v.extent), O = Pe(A, R);
      function E(N) {
        v.selection = N === 1 && R === null ? null : O(N), l.call(w), T.brush();
      }
      return A !== null && R !== null ? E : E(1);
    }) : g.each(function() {
      var w = this, v = arguments, T = w.__brush, A = e.input(typeof p == "function" ? p.apply(w, v) : p, T.extent), R = u(w, v).beforestart();
      an(w), T.selection = A === null ? null : A, l.call(w), R.start(x).brush(x).end(x);
    });
  }, c.clear = function(g, p) {
    c.move(g, null, p);
  };
  function l() {
    var g = P(this), p = Mi(this).selection;
    p ? (g.selectAll(".selection").style("display", null).attr("x", p[0][0]).attr("y", p[0][1]).attr("width", p[1][0] - p[0][0]).attr("height", p[1][1] - p[0][1]), g.selectAll(".handle").style("display", null).attr("x", function(x) {
      return x.type[x.type.length - 1] === "e" ? p[1][0] - s / 2 : p[0][0] - s / 2;
    }).attr("y", function(x) {
      return x.type[0] === "s" ? p[1][1] - s / 2 : p[0][1] - s / 2;
    }).attr("width", function(x) {
      return x.type === "n" || x.type === "s" ? p[1][0] - p[0][0] + s : s;
    }).attr("height", function(x) {
      return x.type === "e" || x.type === "w" ? p[1][1] - p[0][1] + s : s;
    })) : g.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
  }
  function u(g, p, x) {
    var w = g.__brush.emitter;
    return w && (!x || !w.clean) ? w : new h(g, p, x);
  }
  function h(g, p, x) {
    this.that = g, this.args = p, this.state = g.__brush, this.active = 0, this.clean = x;
  }
  h.prototype = {
    beforestart: function() {
      return ++this.active === 1 && (this.state.emitter = this, this.starting = !0), this;
    },
    start: function(g, p) {
      return this.starting ? (this.starting = !1, this.emit("start", g, p)) : this.emit("brush", g), this;
    },
    brush: function(g, p) {
      return this.emit("brush", g, p), this;
    },
    end: function(g, p) {
      return --this.active === 0 && (delete this.state.emitter, this.emit("end", g, p)), this;
    },
    emit: function(g, p, x) {
      var w = P(this.that).datum();
      a.call(
        g,
        this.that,
        new gg(g, {
          sourceEvent: p,
          target: c,
          selection: e.output(this.state.selection),
          mode: x,
          dispatch: a
        }),
        w
      );
    }
  };
  function d(g) {
    if (o && !g.touches || !n.apply(this, arguments)) return;
    var p = this, x = g.target.__data__.type, w = (i && g.metaKey ? x = "overlay" : x) === "selection" ? Ls : i && g.altKey ? Ve : Ge, v = e === Di ? null : yg[x], T = e === _r ? null : vg[x], A = Mi(p), R = A.extent, O = A.selection, E = R[0][0], N, _, D = R[0][1], b, S, L = R[1][0], M, k, H = R[1][1], F, U, W = 0, X = 0, Q, Z = v && T && i && g.shiftKey, et, ut, J = Array.from(g.touches || [g], ($) => {
      const tt = $.identifier;
      return $ = Et($, p), $.point0 = $.slice(), $.identifier = tt, $;
    });
    an(p);
    var mt = u(p, arguments, !0).beforestart();
    if (x === "overlay") {
      O && (Q = !0);
      const $ = [J[0], J[1] || J[0]];
      A.selection = O = [[
        N = e === Di ? E : Mt($[0][0], $[1][0]),
        b = e === _r ? D : Mt($[0][1], $[1][1])
      ], [
        M = e === Di ? L : Dt($[0][0], $[1][0]),
        F = e === _r ? H : Dt($[0][1], $[1][1])
      ]], J.length > 1 && rt(g);
    } else
      N = O[0][0], b = O[0][1], M = O[1][0], F = O[1][1];
    _ = N, S = b, k = M, U = F;
    var z = P(p).attr("pointer-events", "none"), K = z.selectAll(".overlay").attr("cursor", se[x]);
    if (g.touches)
      mt.moved = I, mt.ended = nt;
    else {
      var q = P(g.view).on("mousemove.brush", I, !0).on("mouseup.brush", nt, !0);
      i && q.on("keydown.brush", gt, !0).on("keyup.brush", at, !0), Ra(g.view);
    }
    l.call(p), mt.start(g, w.name);
    function I($) {
      for (const tt of $.changedTouches || [$])
        for (const zt of J)
          zt.identifier === tt.identifier && (zt.cur = Et(tt, p));
      if (Z && !et && !ut && J.length === 1) {
        const tt = J[0];
        ks(tt.cur[0] - tt[0]) > ks(tt.cur[1] - tt[1]) ? ut = !0 : et = !0;
      }
      for (const tt of J)
        tt.cur && (tt[0] = tt.cur[0], tt[1] = tt.cur[1]);
      Q = !0, Ti($), rt($);
    }
    function rt($) {
      const tt = J[0], zt = tt.point0;
      var vt;
      switch (W = tt[0] - zt[0], X = tt[1] - zt[1], w) {
        case Ai:
        case Ls: {
          v && (W = Dt(E - N, Mt(L - M, W)), _ = N + W, k = M + W), T && (X = Dt(D - b, Mt(H - F, X)), S = b + X, U = F + X);
          break;
        }
        case Ge: {
          J[1] ? (v && (_ = Dt(E, Mt(L, J[0][0])), k = Dt(E, Mt(L, J[1][0])), v = 1), T && (S = Dt(D, Mt(H, J[0][1])), U = Dt(D, Mt(H, J[1][1])), T = 1)) : (v < 0 ? (W = Dt(E - N, Mt(L - N, W)), _ = N + W, k = M) : v > 0 && (W = Dt(E - M, Mt(L - M, W)), _ = N, k = M + W), T < 0 ? (X = Dt(D - b, Mt(H - b, X)), S = b + X, U = F) : T > 0 && (X = Dt(D - F, Mt(H - F, X)), S = b, U = F + X));
          break;
        }
        case Ve: {
          v && (_ = Dt(E, Mt(L, N - W * v)), k = Dt(E, Mt(L, M + W * v))), T && (S = Dt(D, Mt(H, b - X * T)), U = Dt(D, Mt(H, F + X * T)));
          break;
        }
      }
      k < _ && (v *= -1, vt = N, N = M, M = vt, vt = _, _ = k, k = vt, x in Os && K.attr("cursor", se[x = Os[x]])), U < S && (T *= -1, vt = b, b = F, F = vt, vt = S, S = U, U = vt, x in Bs && K.attr("cursor", se[x = Bs[x]])), A.selection && (O = A.selection), et && (_ = O[0][0], k = O[1][0]), ut && (S = O[0][1], U = O[1][1]), (O[0][0] !== _ || O[0][1] !== S || O[1][0] !== k || O[1][1] !== U) && (A.selection = [[_, S], [k, U]], l.call(p), mt.brush($, w.name));
    }
    function nt($) {
      if (pg($), $.touches) {
        if ($.touches.length) return;
        o && clearTimeout(o), o = setTimeout(function() {
          o = null;
        }, 500);
      } else
        La($.view, Q), q.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
      z.attr("pointer-events", "all"), K.attr("cursor", se.overlay), A.selection && (O = A.selection), bg(O) && (A.selection = null, l.call(p)), mt.end($, w.name);
    }
    function gt($) {
      switch ($.keyCode) {
        case 16: {
          Z = v && T;
          break;
        }
        case 18: {
          w === Ge && (v && (M = k - W * v, N = _ + W * v), T && (F = U - X * T, b = S + X * T), w = Ve, rt($));
          break;
        }
        case 32: {
          (w === Ge || w === Ve) && (v < 0 ? M = k - W : v > 0 && (N = _ - W), T < 0 ? F = U - X : T > 0 && (b = S - X), w = Ai, K.attr("cursor", se.selection), rt($));
          break;
        }
        default:
          return;
      }
      Ti($);
    }
    function at($) {
      switch ($.keyCode) {
        case 16: {
          Z && (et = ut = Z = !1, rt($));
          break;
        }
        case 18: {
          w === Ve && (v < 0 ? M = k : v > 0 && (N = _), T < 0 ? F = U : T > 0 && (b = S), w = Ge, rt($));
          break;
        }
        case 32: {
          w === Ai && ($.altKey ? (v && (M = k - W * v, N = _ + W * v), T && (F = U - X * T, b = S + X * T), w = Ve) : (v < 0 ? M = k : v > 0 && (N = _), T < 0 ? F = U : T > 0 && (b = S), w = Ge), K.attr("cursor", se[x]), rt($));
          break;
        }
        default:
          return;
      }
      Ti($);
    }
  }
  function f(g) {
    u(this, arguments).moved(g);
  }
  function m(g) {
    u(this, arguments).ended(g);
  }
  function y() {
    var g = this.__brush || { selection: null };
    return g.extent = fa(t.apply(this, arguments)), g.dim = e, g;
  }
  return c.extent = function(g) {
    return arguments.length ? (t = typeof g == "function" ? g : bi(fa(g)), c) : t;
  }, c.filter = function(g) {
    return arguments.length ? (n = typeof g == "function" ? g : bi(!!g), c) : n;
  }, c.touchable = function(g) {
    return arguments.length ? (r = typeof g == "function" ? g : bi(!!g), c) : r;
  }, c.handleSize = function(g) {
    return arguments.length ? (s = +g, c) : s;
  }, c.keyModifiers = function(g) {
    return arguments.length ? (i = !!g, c) : i;
  }, c.on = function() {
    var g = a.on.apply(a, arguments);
    return g === a ? c : g;
  }, c;
}
const { floor: gr, abs: Dg, min: Mg } = Math;
function Cg(e, t, n, r) {
  const i = e.length;
  if (t >= i || t < 3)
    return e;
  const a = [], s = (i - 2) / (t - 2);
  let o = 0;
  a.push(e[o]);
  for (let c = 0; c < t - 2; c++) {
    const l = gr((c + 1) * s) + 1, u = Mg(gr((c + 2) * s) + 1, i), h = u - l;
    let d = 0, f = 0;
    for (let v = l; v < u; v++)
      d += n(e[v]), f += r(e[v]);
    d /= h, f /= h;
    const m = gr(c * s) + 1, y = gr((c + 1) * s) + 1, g = n(e[o]), p = r(e[o]);
    let x = -1, w = m;
    for (let v = m; v < y; v++) {
      const T = Dg(
        (g - d) * (r(e[v]) - p) - (g - n(e[v])) * (f - p)
      ) * 0.5;
      T > x && (x = T, w = v);
    }
    a.push(e[w]), o = w;
  }
  return a.push(e[i - 1]), a;
}
class Sn {
  constructor(t, n) {
    this.domElementMeasurerService = t, this.d3UtilService = n;
  }
  static DEFAULT_DROPSHADOWS = [
    {
      dx: 0,
      dy: 1,
      blurStdDeviation: 3,
      opacity: 0.5
    },
    {
      dx: 0,
      dy: 3,
      blurStdDeviation: 2,
      opacity: 0.36
    },
    {
      dx: 0,
      dy: 2,
      blurStdDeviation: 2,
      opacity: 0.32
    }
  ];
  addDefinitionDeclarationToSvgIfNotExists(t) {
    return this.d3UtilService.select(this.getParentSvgElement(t)).selectAll("defs").data([void 0]).join("defs").node();
  }
  addDropshadowFilterToParentSvgIfNotExists(t, n, r = "black") {
    const i = this.d3UtilService.select(this.addDefinitionDeclarationToSvgIfNotExists(t)).selectAll(`filter#${n}`).data([void 0]).join("filter").attr("id", n);
    return i.selectAll("feDropShadow").data(Sn.DEFAULT_DROPSHADOWS).enter().append("feDropShadow").attr("dx", (a) => a.dx).attr("dy", (a) => a.dy).attr("stdDeviation", (a) => a.blurStdDeviation).attr("flood-color", r).attr("flood-opacity", (a) => a.opacity), i.node();
  }
  getParentSvgElement(t) {
    let n = t;
    for (; n; ) {
      if (n.tagName === "svg")
        return n;
      n = n.parentElement;
    }
    throw Error("No parent SVG tag found for provided element");
  }
  getElementTextLength(t) {
    return this.domElementMeasurerService.getComputedTextLength(t);
  }
  truncateText(t, n) {
    let r = this.domElementMeasurerService.getComputedTextLength(t);
    if (r <= n)
      return;
    const i = t.textContent, a = i.length, s = Math.floor(i.length / 2);
    let o = "";
    for (let c = 1; c < s; c++) {
      const l = `${i.substr(0, c)}...${i.substr(a - c)}`;
      if (t.textContent = l, r = this.domElementMeasurerService.getComputedTextLength(t), r > n) {
        t.textContent = o;
        break;
      }
      o = l;
    }
  }
  /**
   * Wraps text in the given text element so that it doesn't exceed the specified width.
   * If a single word can't fit in the given width then it is truncated.
   *
   * @param element The original SVG Text element that needs to be wrapped
   * @param width The final width of the wrapped text
   * @param truncateText If true, the text will be truncated if it doesn't fit in the given width
   * @param maxLines Optional maximum number of lines to wrap to (undefined = unlimited)
   * @return Object with truncated flag and original text for tooltip
   */
  wrapTextIfNeeded(t, n, r = !0, i) {
    const a = P(t), s = a.text();
    if (this.domElementMeasurerService.getComputedTextLength(t) <= n)
      return { truncated: !1, originalText: s };
    let c = !1;
    const l = () => a.append("tspan").attr("x", a.attr("x")).attr("y", a.attr("y")), u = s.split(" ").reverse();
    let h = 0;
    a.text("");
    let d = l().text(""), f = [];
    for (; u.length > 0; ) {
      const m = u.pop();
      if (f.push(m), d.text(f.join(" ")), this.domElementMeasurerService.getComputedTextLength(d.node()) > n)
        if (f.length === 1)
          r && this.truncateText(d.node(), n), c = !0;
        else {
          if (i !== void 0 && h >= i - 1) {
            const p = [...f, ...u.reverse()].join(
              " "
            );
            d.text(p), r && this.truncateText(d.node(), n), c = !0;
            break;
          }
          const y = a.attr("y"), g = parseFloat(a.attr("dy") ?? "0");
          f.pop(), d.text(f.join(" ")), f = [m], d = l().attr("x", 0).attr("y", y).attr("dy", `${++h * 1.1 + g}em`).text(m);
        }
    }
    return { truncated: c, originalText: s };
  }
  unWrapText(t) {
    const n = P(t);
    if (!n.selectAll("tspan").size())
      return;
    const r = n.selectAll("tspan").nodes().map((i) => i?.textContent ?? "").join(" ").trim();
    n.selectAll("tspan").remove(), n.text(r);
  }
}
class xn {
  getNamespaceUri(t) {
    return aa[t];
  }
  select(t) {
    return P(t);
  }
  selectAll(t) {
    return vd(t);
  }
}
class sr {
  measureSvgElement(t) {
    return t.getBBox();
  }
  getComputedTextLength(t) {
    return t.getComputedTextLength();
  }
  measureHtmlElement(t) {
    return t.getBoundingClientRect();
  }
}
var Ci = Array.prototype.slice;
function _g(e) {
  return e;
}
var Er = 1, Nr = 2, ga = 3, Ln = 4, Ps = 1e-6;
function Eg(e) {
  return "translate(" + (e + 0.5) + ",0)";
}
function Ng(e) {
  return "translate(0," + (e + 0.5) + ")";
}
function Rg(e) {
  return function(t) {
    return +e(t);
  };
}
function Lg(e) {
  var t = Math.max(0, e.bandwidth() - 1) / 2;
  return e.round() && (t = Math.round(t)), function(n) {
    return +e(n) + t;
  };
}
function kg() {
  return !this.__axis;
}
function ui(e, t) {
  var n = [], r = null, i = null, a = 6, s = 6, o = 3, c = e === Er || e === Ln ? -1 : 1, l = e === Ln || e === Nr ? "x" : "y", u = e === Er || e === ga ? Eg : Ng;
  function h(d) {
    var f = r ?? (t.ticks ? t.ticks.apply(t, n) : t.domain()), m = i ?? (t.tickFormat ? t.tickFormat.apply(t, n) : _g), y = Math.max(a, 0) + o, g = t.range(), p = +g[0] + 0.5, x = +g[g.length - 1] + 0.5, w = (t.bandwidth ? Lg : Rg)(t.copy()), v = d.selection ? d.selection() : d, T = v.selectAll(".domain").data([null]), A = v.selectAll(".tick").data(f, t).order(), R = A.exit(), O = A.enter().append("g").attr("class", "tick"), E = A.select("line"), N = A.select("text");
    T = T.merge(T.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor")), A = A.merge(O), E = E.merge(O.append("line").attr("stroke", "currentColor").attr(l + "2", c * a)), N = N.merge(O.append("text").attr("fill", "currentColor").attr(l, c * y).attr("dy", e === Er ? "0em" : e === ga ? "0.71em" : "0.32em")), d !== v && (T = T.transition(d), A = A.transition(d), E = E.transition(d), N = N.transition(d), R = R.transition(d).attr("opacity", Ps).attr("transform", function(_) {
      return isFinite(_ = w(_)) ? u(_) : this.getAttribute("transform");
    }), O.attr("opacity", Ps).attr("transform", function(_) {
      var D = this.parentNode.__axis;
      return u(D && isFinite(D = D(_)) ? D : w(_));
    })), R.remove(), T.attr("d", e === Ln || e == Nr ? s ? "M" + c * s + "," + p + "H0.5V" + x + "H" + c * s : "M0.5," + p + "V" + x : s ? "M" + p + "," + c * s + "V0.5H" + x + "V" + c * s : "M" + p + ",0.5H" + x), A.attr("opacity", 1).attr("transform", function(_) {
      return u(w(_));
    }), E.attr(l + "2", c * a), N.attr(l, c * y).text(m), v.filter(kg).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", e === Nr ? "start" : e === Ln ? "end" : "middle"), v.each(function() {
      this.__axis = w;
    });
  }
  return h.scale = function(d) {
    return arguments.length ? (t = d, h) : t;
  }, h.ticks = function() {
    return n = Ci.call(arguments), h;
  }, h.tickArguments = function(d) {
    return arguments.length ? (n = d == null ? [] : Ci.call(d), h) : n.slice();
  }, h.tickValues = function(d) {
    return arguments.length ? (r = d == null ? null : Ci.call(d), h) : r && r.slice();
  }, h.tickFormat = function(d) {
    return arguments.length ? (i = d, h) : i;
  }, h.tickSize = function(d) {
    return arguments.length ? (a = s = +d, h) : a;
  }, h.tickSizeInner = function(d) {
    return arguments.length ? (a = +d, h) : a;
  }, h.tickSizeOuter = function(d) {
    return arguments.length ? (s = +d, h) : s;
  }, h.tickPadding = function(d) {
    return arguments.length ? (o = +d, h) : o;
  }, h;
}
function Ig(e) {
  return ui(Er, e);
}
function Og(e) {
  return ui(Nr, e);
}
function Bg(e) {
  return ui(ga, e);
}
function Pg(e) {
  return ui(Ln, e);
}
function Gt(e) {
  return `.${e}`;
}
class ce {
  constructor(t, n, r = "No data to display") {
    this.hostElement = t, this.series = n, this.message = r;
  }
  static CSS_CLASS = "no-data-message";
  static NO_DATA_HIDABLE_CSS_CLASS = "no-data-hidable";
  updateMessage() {
    const t = P(this.hostElement);
    this.seriesContainData() ? (t.selectAll(Gt(ce.CSS_CLASS)).remove(), t.selectAll(Gt(ce.NO_DATA_HIDABLE_CSS_CLASS)).classed("hidden", !1)) : (t.selectAll(Gt(ce.NO_DATA_HIDABLE_CSS_CLASS)).classed("hidden", !0), t.append("text").classed(ce.CSS_CLASS, !0).text(this.message).attr("x", "50%").attr("y", "50%"));
  }
  seriesContainData() {
    return Array.isArray(this.series) && this.series.some((t) => t.data.length > 0);
  }
}
class Fg {
  constructor(t, n, r) {
    this.axisType = t, this.axisCrosshair = n, this.bounds = r;
  }
  crosshairFromAxis = /* @__PURE__ */ new WeakMap();
  draw(t, n, r) {
    this.initializeCrosshairIfMissing(n);
    const i = this.axisCrosshair.snap === !0, a = this.getSnappableData(
      t,
      n,
      r
    );
    if (i && a.length === 0) {
      this.hide(n);
      return;
    }
    const s = i ? this.getDataRangeValue(a[0]) : this.getMouseRangeValue(t, n), o = this.getCrosshairSelection(n);
    this.updatePosition(
      o,
      s,
      r.map((c) => ({
        location: c.location,
        color: c.context.color
      }))
    ), o.attr("hidden", null);
  }
  hide(t) {
    this.getCrosshairSelection(t).attr("hidden", !0);
  }
  initializeCrosshairIfMissing(t) {
    if (!this.getCrosshairSelection(t).empty())
      return;
    const r = this.getCrosshairParentSelection(t).selectAll(`.crosshair-${this.axisType.toString()}`).data([null]).join("g").classed("crosshair", !0).classed(`crosshair-${this.axisType.toString()}`, !0).style("will-change", "transform").raise();
    r.selectAll("line").data([null]).join("line"), this.crosshairFromAxis.set(t, r.node());
  }
  getCrosshairSelection(t) {
    return P(this.crosshairFromAxis.get(t));
  }
  getCrosshairParentSelection(t) {
    return P(t.parentElement);
  }
  updatePosition(t, n, r) {
    this.updateLinePosition(t, n), this.updatePointPosition(t, r);
  }
  updateLinePosition(t, n) {
    const r = t.select("line");
    switch (this.axisType) {
      case G.X:
        r.attr("x1", n).attr("y1", this.bounds.startY).attr("x2", n).attr("y2", this.bounds.endY);
        break;
      case G.Y:
        r.attr("x1", this.bounds.startX).attr("y1", n).attr("x2", this.bounds.endX).attr("y2", n);
        break;
    }
  }
  updatePointPosition(t, n) {
    const r = t.selectAll(".crosshair-point").data(n);
    r.exit().remove(), r.enter().append("circle").classed("crosshair-point", !0).attr("r", 4).merge(r).attr("cx", (i) => i.location.x).attr("cy", (i) => i.location.y).attr("stroke", (i) => i.color);
  }
  getMouseRangeValue(t, n) {
    const r = Et(t, n);
    switch (this.axisType) {
      case G.Y:
        return r[1];
      case G.X:
      default:
        return r[0];
    }
  }
  getDataRangeValue(t) {
    switch (this.axisType) {
      case G.Y:
        return t.location.y;
      case G.X:
      default:
        return t.location.x;
    }
  }
  getSnappableData(t, n, r) {
    const i = this.getMouseRangeValue(t, n), a = Nc(
      r,
      (o) => Math.abs(this.getDataRangeValue(o) - i)
    );
    if (!a)
      return [];
    const s = this.getDataRangeValue(a);
    return r.filter(
      (o) => this.getDataRangeValue(o) === s
    );
  }
}
class yt {
  constructor(t, n, r) {
    this.scaleBuilder = n, this.svgUtilService = r, this.scale = this.scaleBuilder.withAxis(t).build(t.type), this.configuration = this.applyDefaults(t), this.crosshair = this.configuration.crosshair && new Fg(
      this.configuration.type,
      this.configuration.crosshair,
      this.scale.initData.bounds
    );
  }
  static CSS_CLASS = "axis";
  static CSS_SELECTOR = `.${yt.CSS_CLASS}`;
  static AXIS_TICKS_TEXT_SELECTOR = ".axis .tick text";
  static AXIS_TICK_PADDING = 9;
  static MIN_TICK_BANDWIDTH_FOR_LABELS = 12;
  static DEFAULT_X_AXIS_HEIGHT = 16;
  static DEFAULT_Y_AXIS_WIDTH = 48;
  configuration;
  crosshair;
  scale;
  axisElement;
  draw(t) {
    const n = this.getAxisConstructor()(
      this.scale.d3Implementation
    );
    this.addTicksToAxis(n), this.configuration.getLabel && n.tickFormat(this.configuration.getLabel);
    const r = P(t).selectAll(yt.CSS_SELECTOR).data([null]), i = P(t).selectAll(".tick text").size(), a = Br(i);
    r.exit().remove();
    const s = r.transition().duration(a).attr("transform", this.getAxisTransform()).call(n).selectAll(".tick text").style("font-size", "100%").transition().duration(a), o = s.size();
    let c = 0;
    s.on("end", () => {
      c++, c >= o && this.customizeAxis(P(t));
    });
    const l = r.enter().append("g").classed(yt.CSS_CLASS, !0).classed(
      ce.NO_DATA_HIDABLE_CSS_CLASS,
      this.configuration.type === G.Y
    ).attr("transform", this.getAxisTransform()).transition().duration(a).call(n).selectAll(".tick text").style("font-size", "100%").transition().duration(a), u = l.size();
    let h = 0;
    return l.on("end", () => {
      h++, h >= u && this.customizeAxis(P(t));
    }), this.axisElement = P(t).node(), this.addGridLinesIfNeeded(), this.addAxisTitleIfNeeded(), this;
  }
  onMouseMove(t, n) {
    this.crosshair && this.axisElement && this.crosshair.draw(t, this.axisElement, n);
  }
  onMouseLeave() {
    this.crosshair && this.axisElement && this.crosshair.hide(this.axisElement);
  }
  getAxisType() {
    return this.configuration.type;
  }
  getAxisKey() {
    return `${this.getAxisType()}-${this.configuration.location}`;
  }
  addTicksToAxis(t) {
    t.ticks(this.calculateAxisTickCount()).tickPadding(yt.AXIS_TICK_PADDING).tickSizeOuter(0).tickSizeInner(0).tickFormat(
      this.scale.getTickFormatter()
    );
  }
  customizeAxis(t) {
    if (this.configuration.tickLabels || t.selectAll(yt.AXIS_TICKS_TEXT_SELECTOR).remove(), t.selectAll(yt.AXIS_TICKS_TEXT_SELECTOR).attr("visibility", null), this.configuration.location === ot.Bottom || this.configuration.location === ot.Top) {
      if (this.scale.getScaleType() === xt.Band) {
        const n = t.selectAll(yt.AXIS_TICKS_TEXT_SELECTOR).size();
        if (n > 0 && (this.scale.getRangeEnd() - this.scale.getRangeStart()) / n < yt.MIN_TICK_BANDWIDTH_FOR_LABELS) {
          this.hideAllTickLabels(t);
          return;
        }
      }
      t.selectAll(yt.AXIS_TICKS_TEXT_SELECTOR).attr("y", yt.AXIS_TICK_PADDING).attr("transform", null).style("text-anchor", null), this.configuration.labelOverflow === il.Rotate ? this.rotateAxisTicks(t) : this.tickTextWrap(t);
    } else {
      if (this.scale.getScaleType() === xt.Band) {
        const n = t.selectAll(yt.AXIS_TICKS_TEXT_SELECTOR).size();
        if (n > 0 && Math.abs(this.scale.getRangeEnd() - this.scale.getRangeStart()) / n < yt.MIN_TICK_BANDWIDTH_FOR_LABELS) {
          this.hideAllTickLabels(t);
          return;
        }
      }
      this.maybeTruncateAxisTicks(t);
    }
  }
  getTextTicksLength(t) {
    const n = t.selectAll("text"), r = [];
    return n.each(
      (i, a, s) => r.push(
        this.svgUtilService.getElementTextLength(
          s[a]
        )
      )
    ), r;
  }
  maybeTruncateAxisTicks(t) {
    t.selectAll("text").each(
      (r, i, a) => this.svgUtilService.truncateText(
        a[i],
        this.configuration.size
      )
    );
  }
  hideAllTickLabels(t) {
    t.selectAll(yt.AXIS_TICKS_TEXT_SELECTOR).attr("visibility", "hidden");
  }
  getTickTransformValue(t, n) {
    const r = n === "x" ? 0 : 1, a = t.attr("transform").replace(/.*\(|\).*/g, "").split(",")[r] ?? "0";
    return parseInt(a);
  }
  tickTextWrap(t) {
    const s = t.selectAll(yt.AXIS_TICKS_TEXT_SELECTOR).attr("y", yt.AXIS_TICK_PADDING);
    s.each(
      (u, h, d) => this.svgUtilService.unWrapText(d[h])
    );
    const o = (this.scale.getRangeEnd() - this.scale.getRangeStart()) / s.size(), c = o - 4, l = Math.max(
      ...s.nodes().map(
        (u) => this.svgUtilService.getElementTextLength(u)
      )
    ) - 0.01;
    if (o < 60) {
      let u = !1;
      l > c && (s.each((h, d, f) => {
        u || (u = this.svgUtilService.wrapTextIfNeeded(
          f[d],
          o,
          !1
        ).truncated);
      }), u && (s.each(
        (h, d, f) => this.svgUtilService.unWrapText(f[d])
      ), this.rotateAxisTicks(t)));
    } else
      s.each((u, h, d) => {
        const f = this.svgUtilService.wrapTextIfNeeded(
          d[h],
          o,
          !0,
          // truncate if needed
          2
          // max 2 lines
        );
        f.truncated && (P(d[h]).selectAll("title").remove(), P(d[h]).insert("title", ":first-child").text(f.originalText));
      });
  }
  rotateAxisTicks(t) {
    t.selectAll(".tick text").each((s, o, c) => {
      const l = c[o], u = l.textContent ?? "";
      this.svgUtilService.getElementTextLength(l) > 80 && (this.svgUtilService.truncateText(l, 80), P(l).selectAll("title").remove(), P(l).append("title").text(u));
    });
    const r = this.getTextTicksLength(t), i = [];
    if (t.selectAll(".tick").each((s, o, c) => {
      const l = P(c[o]);
      i.push(this.getTickTransformValue(l, "x"));
    }), en(i))
      return;
    let a = !1;
    (i[0] - this.scale.initData.bounds.startX < r[0] / 2 || this.scale.initData.bounds.endX - i[i.length - 1] < r[i.length - 1] / 2) && (a = !0);
    for (let s = 0; s < i.length - 1 && !a; s++)
      if (i[s + 1] - i[s] < (r[s] + r[s + 1]) / 2) {
        a = !0;
        break;
      }
    if (a && (t.selectAll(".tick text").style("text-anchor", "end").attr("y", "3").attr("transform", "rotate(-25)"), this.scale.getScaleType() === xt.Band)) {
      const s = this.getTextTicksLength(t), o = Math.cos(Math.PI * 25 / 180);
      let c = !1;
      for (let l = 0; l < i.length - 1 && !c; l++) {
        const u = s[l] * o, h = s[l + 1] * o;
        i[l + 1] - i[l] < (u + h) / 2 && (c = !0);
      }
      c && this.hideAllTickLabels(t);
    }
  }
  getAxisTransform() {
    switch (this.configuration.location) {
      case ot.Left:
        return `translate(${this.scale.initData.bounds.startX}, 0)`;
      case ot.Right:
        return `translate(${this.scale.initData.bounds.endX}, 0)`;
      case ot.Top:
        return `translate(0, ${this.scale.initData.bounds.endY})`;
      case ot.Bottom:
      default:
        return `translate(0, ${this.scale.initData.bounds.startY})`;
    }
  }
  getAxisConstructor() {
    switch (this.configuration.location) {
      case ot.Left:
        return Pg;
      case ot.Right:
        return Og;
      case ot.Top:
        return Ig;
      case ot.Bottom:
      default:
        return Bg;
    }
  }
  calculateAxisTickCount() {
    return this.configuration?.tickCount !== void 0 ? this.configuration.tickCount : 6;
  }
  addGridLinesIfNeeded() {
    if (!this.axisElement || !this.configuration.gridLines)
      return;
    const t = this.getAxisConstructor()(
      this.scale.d3Implementation
    ).ticks(this.calculateAxisTickCount()).tickSize(-this.getPerpendicularDistance()).tickFormat(() => ""), n = P(this.axisElement).selectAll(".grid-line").data([null]);
    n.exit().remove();
    const r = P(this.axisElement).selectAll(".grid-line .tick").size(), i = Br(r);
    n.transition().duration(i).attr("transform", this.getAxisTransform()).call(t), n.enter().append("g").classed("grid-line", !0).classed(ce.NO_DATA_HIDABLE_CSS_CLASS, !0).attr("transform", this.getAxisTransform()).transition().duration(i).call(t);
  }
  addAxisTitleIfNeeded() {
    if (!this.axisElement || !this.configuration.title) {
      this.axisElement && P(this.axisElement).selectAll(".axis-title").remove();
      return;
    }
    const t = P(this.axisElement).selectAll(".axis-title").data([null]), { x: n, y: r, rotation: i } = this.getAxisTitlePosition();
    t.exit().remove(), t.attr("x", n).attr("y", r).attr("transform", i ? `rotate(${i}, ${n}, ${r})` : null).text(this.configuration.title), t.enter().append("text").classed("axis-title", !0).classed(ce.NO_DATA_HIDABLE_CSS_CLASS, !0).attr("x", n).attr("y", r).attr("transform", i ? `rotate(${i}, ${n}, ${r})` : null).attr("text-anchor", "middle").attr("fill", "currentColor").style("font-size", "11px").style("font-weight", "500").text(this.configuration.title);
  }
  getAxisTitlePosition() {
    const t = this.scale.initData.bounds, n = 35;
    switch (this.configuration.location) {
      case ot.Left:
        return {
          x: t.startX - n,
          y: (t.startY + t.endY) / 2,
          rotation: -90
        };
      case ot.Right:
        return {
          x: t.endX + n,
          y: (t.startY + t.endY) / 2,
          rotation: 90
        };
      case ot.Top:
        return {
          x: (t.startX + t.endX) / 2,
          y: t.endY - n
        };
      case ot.Bottom:
      default:
        return {
          x: (t.startX + t.endX) / 2,
          y: t.startY + n
        };
    }
  }
  getPerpendicularDistance() {
    switch (this.configuration.location) {
      case ot.Left:
      case ot.Right:
        return Math.abs(
          this.scale.initData.bounds.endX - this.scale.initData.bounds.startX
        );
      default:
      case ot.Top:
      case ot.Bottom:
        return Math.abs(
          this.scale.initData.bounds.endY - this.scale.initData.bounds.startY
        );
    }
  }
  applyDefaults(t) {
    const n = {
      gridLines: !1,
      axisLine: !0,
      tickLabels: !0,
      size: t.type === G.X ? yt.DEFAULT_X_AXIS_HEIGHT : yt.DEFAULT_Y_AXIS_WIDTH
    };
    return Or(
      {},
      this.scale.initData,
      t,
      n
    );
  }
}
var pa = Math.PI, ma = 2 * pa, Re = 1e-6, Ug = ma - Re;
function ya() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null, this._ = "";
}
function Se() {
  return new ya();
}
ya.prototype = Se.prototype = {
  constructor: ya,
  moveTo: function(e, t) {
    this._ += "M" + (this._x0 = this._x1 = +e) + "," + (this._y0 = this._y1 = +t);
  },
  closePath: function() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._ += "Z");
  },
  lineTo: function(e, t) {
    this._ += "L" + (this._x1 = +e) + "," + (this._y1 = +t);
  },
  quadraticCurveTo: function(e, t, n, r) {
    this._ += "Q" + +e + "," + +t + "," + (this._x1 = +n) + "," + (this._y1 = +r);
  },
  bezierCurveTo: function(e, t, n, r, i, a) {
    this._ += "C" + +e + "," + +t + "," + +n + "," + +r + "," + (this._x1 = +i) + "," + (this._y1 = +a);
  },
  arcTo: function(e, t, n, r, i) {
    e = +e, t = +t, n = +n, r = +r, i = +i;
    var a = this._x1, s = this._y1, o = n - e, c = r - t, l = a - e, u = s - t, h = l * l + u * u;
    if (i < 0) throw new Error("negative radius: " + i);
    if (this._x1 === null)
      this._ += "M" + (this._x1 = e) + "," + (this._y1 = t);
    else if (h > Re) if (!(Math.abs(u * o - c * l) > Re) || !i)
      this._ += "L" + (this._x1 = e) + "," + (this._y1 = t);
    else {
      var d = n - a, f = r - s, m = o * o + c * c, y = d * d + f * f, g = Math.sqrt(m), p = Math.sqrt(h), x = i * Math.tan((pa - Math.acos((m + h - y) / (2 * g * p))) / 2), w = x / p, v = x / g;
      Math.abs(w - 1) > Re && (this._ += "L" + (e + w * l) + "," + (t + w * u)), this._ += "A" + i + "," + i + ",0,0," + +(u * d > l * f) + "," + (this._x1 = e + v * o) + "," + (this._y1 = t + v * c);
    }
  },
  arc: function(e, t, n, r, i, a) {
    e = +e, t = +t, n = +n, a = !!a;
    var s = n * Math.cos(r), o = n * Math.sin(r), c = e + s, l = t + o, u = 1 ^ a, h = a ? r - i : i - r;
    if (n < 0) throw new Error("negative radius: " + n);
    this._x1 === null ? this._ += "M" + c + "," + l : (Math.abs(this._x1 - c) > Re || Math.abs(this._y1 - l) > Re) && (this._ += "L" + c + "," + l), n && (h < 0 && (h = h % ma + ma), h > Ug ? this._ += "A" + n + "," + n + ",0,1," + u + "," + (e - s) + "," + (t - o) + "A" + n + "," + n + ",0,1," + u + "," + (this._x1 = c) + "," + (this._y1 = l) : h > Re && (this._ += "A" + n + "," + n + ",0," + +(h >= pa) + "," + u + "," + (this._x1 = e + n * Math.cos(i)) + "," + (this._y1 = t + n * Math.sin(i))));
  },
  rect: function(e, t, n, r) {
    this._ += "M" + (this._x0 = this._x1 = +e) + "," + (this._y0 = this._y1 = +t) + "h" + +n + "v" + +r + "h" + -n + "Z";
  },
  toString: function() {
    return this._;
  }
};
function it(e) {
  return function() {
    return e;
  };
}
var Fs = Math.abs, Ct = Math.atan2, Ce = Math.cos, Hg = Math.max, _i = Math.min, Kt = Math.sin, Ze = Math.sqrt, It = 1e-12, fn = Math.PI, Gr = fn / 2, Pn = 2 * fn;
function zg(e) {
  return e > 1 ? 0 : e < -1 ? fn : Math.acos(e);
}
function Us(e) {
  return e >= 1 ? Gr : e <= -1 ? -Gr : Math.asin(e);
}
function $g(e) {
  return e.innerRadius;
}
function Wg(e) {
  return e.outerRadius;
}
function Yg(e) {
  return e.startAngle;
}
function Gg(e) {
  return e.endAngle;
}
function Vg(e) {
  return e && e.padAngle;
}
function Xg(e, t, n, r, i, a, s, o) {
  var c = n - e, l = r - t, u = s - i, h = o - a, d = h * c - u * l;
  if (!(d * d < It))
    return d = (u * (t - a) - h * (e - i)) / d, [e + d * c, t + d * l];
}
function pr(e, t, n, r, i, a, s) {
  var o = e - n, c = t - r, l = (s ? a : -a) / Ze(o * o + c * c), u = l * c, h = -l * o, d = e + u, f = t + h, m = n + u, y = r + h, g = (d + m) / 2, p = (f + y) / 2, x = m - d, w = y - f, v = x * x + w * w, T = i - a, A = d * y - m * f, R = (w < 0 ? -1 : 1) * Ze(Hg(0, T * T * v - A * A)), O = (A * w - x * R) / v, E = (-A * x - w * R) / v, N = (A * w + x * R) / v, _ = (-A * x + w * R) / v, D = O - g, b = E - p, S = N - g, L = _ - p;
  return D * D + b * b > S * S + L * L && (O = N, E = _), {
    cx: O,
    cy: E,
    x01: -u,
    y01: -h,
    x11: O * (i / T - 1),
    y11: E * (i / T - 1)
  };
}
function Pl() {
  var e = $g, t = Wg, n = it(0), r = null, i = Yg, a = Gg, s = Vg, o = null;
  function c() {
    var l, u, h = +e.apply(this, arguments), d = +t.apply(this, arguments), f = i.apply(this, arguments) - Gr, m = a.apply(this, arguments) - Gr, y = Fs(m - f), g = m > f;
    if (o || (o = l = Se()), d < h && (u = d, d = h, h = u), !(d > It)) o.moveTo(0, 0);
    else if (y > Pn - It)
      o.moveTo(d * Ce(f), d * Kt(f)), o.arc(0, 0, d, f, m, !g), h > It && (o.moveTo(h * Ce(m), h * Kt(m)), o.arc(0, 0, h, m, f, g));
    else {
      var p = f, x = m, w = f, v = m, T = y, A = y, R = s.apply(this, arguments) / 2, O = R > It && (r ? +r.apply(this, arguments) : Ze(h * h + d * d)), E = _i(Fs(d - h) / 2, +n.apply(this, arguments)), N = E, _ = E, D, b;
      if (O > It) {
        var S = Us(O / h * Kt(R)), L = Us(O / d * Kt(R));
        (T -= S * 2) > It ? (S *= g ? 1 : -1, w += S, v -= S) : (T = 0, w = v = (f + m) / 2), (A -= L * 2) > It ? (L *= g ? 1 : -1, p += L, x -= L) : (A = 0, p = x = (f + m) / 2);
      }
      var M = d * Ce(p), k = d * Kt(p), H = h * Ce(v), F = h * Kt(v);
      if (E > It) {
        var U = d * Ce(x), W = d * Kt(x), X = h * Ce(w), Q = h * Kt(w), Z;
        if (y < fn && (Z = Xg(M, k, X, Q, U, W, H, F))) {
          var et = M - Z[0], ut = k - Z[1], J = U - Z[0], mt = W - Z[1], z = 1 / Kt(zg((et * J + ut * mt) / (Ze(et * et + ut * ut) * Ze(J * J + mt * mt))) / 2), K = Ze(Z[0] * Z[0] + Z[1] * Z[1]);
          N = _i(E, (h - K) / (z - 1)), _ = _i(E, (d - K) / (z + 1));
        }
      }
      A > It ? _ > It ? (D = pr(X, Q, M, k, d, _, g), b = pr(U, W, H, F, d, _, g), o.moveTo(D.cx + D.x01, D.cy + D.y01), _ < E ? o.arc(D.cx, D.cy, _, Ct(D.y01, D.x01), Ct(b.y01, b.x01), !g) : (o.arc(D.cx, D.cy, _, Ct(D.y01, D.x01), Ct(D.y11, D.x11), !g), o.arc(0, 0, d, Ct(D.cy + D.y11, D.cx + D.x11), Ct(b.cy + b.y11, b.cx + b.x11), !g), o.arc(b.cx, b.cy, _, Ct(b.y11, b.x11), Ct(b.y01, b.x01), !g))) : (o.moveTo(M, k), o.arc(0, 0, d, p, x, !g)) : o.moveTo(M, k), !(h > It) || !(T > It) ? o.lineTo(H, F) : N > It ? (D = pr(H, F, U, W, h, -N, g), b = pr(M, k, X, Q, h, -N, g), o.lineTo(D.cx + D.x01, D.cy + D.y01), N < E ? o.arc(D.cx, D.cy, N, Ct(D.y01, D.x01), Ct(b.y01, b.x01), !g) : (o.arc(D.cx, D.cy, N, Ct(D.y01, D.x01), Ct(D.y11, D.x11), !g), o.arc(0, 0, h, Ct(D.cy + D.y11, D.cx + D.x11), Ct(b.cy + b.y11, b.cx + b.x11), g), o.arc(b.cx, b.cy, N, Ct(b.y11, b.x11), Ct(b.y01, b.x01), !g))) : o.arc(0, 0, h, v, w, g);
    }
    if (o.closePath(), l) return o = null, l + "" || null;
  }
  return c.centroid = function() {
    var l = (+e.apply(this, arguments) + +t.apply(this, arguments)) / 2, u = (+i.apply(this, arguments) + +a.apply(this, arguments)) / 2 - fn / 2;
    return [Ce(u) * l, Kt(u) * l];
  }, c.innerRadius = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : it(+l), c) : e;
  }, c.outerRadius = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : it(+l), c) : t;
  }, c.cornerRadius = function(l) {
    return arguments.length ? (n = typeof l == "function" ? l : it(+l), c) : n;
  }, c.padRadius = function(l) {
    return arguments.length ? (r = l == null ? null : typeof l == "function" ? l : it(+l), c) : r;
  }, c.startAngle = function(l) {
    return arguments.length ? (i = typeof l == "function" ? l : it(+l), c) : i;
  }, c.endAngle = function(l) {
    return arguments.length ? (a = typeof l == "function" ? l : it(+l), c) : a;
  }, c.padAngle = function(l) {
    return arguments.length ? (s = typeof l == "function" ? l : it(+l), c) : s;
  }, c.context = function(l) {
    return arguments.length ? (o = l ?? null, c) : o;
  }, c;
}
function Fl(e) {
  this._context = e;
}
Fl.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // proceed
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function Ua(e) {
  return new Fl(e);
}
function Ul(e) {
  return e[0];
}
function Hl(e) {
  return e[1];
}
function Xn() {
  var e = Ul, t = Hl, n = it(!0), r = null, i = Ua, a = null;
  function s(o) {
    var c, l = o.length, u, h = !1, d;
    for (r == null && (a = i(d = Se())), c = 0; c <= l; ++c)
      !(c < l && n(u = o[c], c, o)) === h && ((h = !h) ? a.lineStart() : a.lineEnd()), h && a.point(+e(u, c, o), +t(u, c, o));
    if (d) return a = null, d + "" || null;
  }
  return s.x = function(o) {
    return arguments.length ? (e = typeof o == "function" ? o : it(+o), s) : e;
  }, s.y = function(o) {
    return arguments.length ? (t = typeof o == "function" ? o : it(+o), s) : t;
  }, s.defined = function(o) {
    return arguments.length ? (n = typeof o == "function" ? o : it(!!o), s) : n;
  }, s.curve = function(o) {
    return arguments.length ? (i = o, r != null && (a = i(r)), s) : i;
  }, s.context = function(o) {
    return arguments.length ? (o == null ? r = a = null : a = i(r = o), s) : r;
  }, s;
}
function va() {
  var e = Ul, t = null, n = it(0), r = Hl, i = it(!0), a = null, s = Ua, o = null;
  function c(u) {
    var h, d, f, m = u.length, y, g = !1, p, x = new Array(m), w = new Array(m);
    for (a == null && (o = s(p = Se())), h = 0; h <= m; ++h) {
      if (!(h < m && i(y = u[h], h, u)) === g)
        if (g = !g)
          d = h, o.areaStart(), o.lineStart();
        else {
          for (o.lineEnd(), o.lineStart(), f = h - 1; f >= d; --f)
            o.point(x[f], w[f]);
          o.lineEnd(), o.areaEnd();
        }
      g && (x[h] = +e(y, h, u), w[h] = +n(y, h, u), o.point(t ? +t(y, h, u) : x[h], r ? +r(y, h, u) : w[h]));
    }
    if (p) return o = null, p + "" || null;
  }
  function l() {
    return Xn().defined(i).curve(s).context(a);
  }
  return c.x = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : it(+u), t = null, c) : e;
  }, c.x0 = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : it(+u), c) : e;
  }, c.x1 = function(u) {
    return arguments.length ? (t = u == null ? null : typeof u == "function" ? u : it(+u), c) : t;
  }, c.y = function(u) {
    return arguments.length ? (n = typeof u == "function" ? u : it(+u), r = null, c) : n;
  }, c.y0 = function(u) {
    return arguments.length ? (n = typeof u == "function" ? u : it(+u), c) : n;
  }, c.y1 = function(u) {
    return arguments.length ? (r = u == null ? null : typeof u == "function" ? u : it(+u), c) : r;
  }, c.lineX0 = c.lineY0 = function() {
    return l().x(e).y(n);
  }, c.lineY1 = function() {
    return l().x(e).y(r);
  }, c.lineX1 = function() {
    return l().x(t).y(n);
  }, c.defined = function(u) {
    return arguments.length ? (i = typeof u == "function" ? u : it(!!u), c) : i;
  }, c.curve = function(u) {
    return arguments.length ? (s = u, a != null && (o = s(a)), c) : s;
  }, c.context = function(u) {
    return arguments.length ? (u == null ? a = o = null : o = s(a = u), c) : a;
  }, c;
}
function jg(e, t) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function qg(e) {
  return e;
}
function Zg() {
  var e = qg, t = jg, n = null, r = it(0), i = it(Pn), a = it(0);
  function s(o) {
    var c, l = o.length, u, h, d = 0, f = new Array(l), m = new Array(l), y = +r.apply(this, arguments), g = Math.min(Pn, Math.max(-Pn, i.apply(this, arguments) - y)), p, x = Math.min(Math.abs(g) / l, a.apply(this, arguments)), w = x * (g < 0 ? -1 : 1), v;
    for (c = 0; c < l; ++c)
      (v = m[f[c] = c] = +e(o[c], c, o)) > 0 && (d += v);
    for (t != null ? f.sort(function(T, A) {
      return t(m[T], m[A]);
    }) : n != null && f.sort(function(T, A) {
      return n(o[T], o[A]);
    }), c = 0, h = d ? (g - l * w) / d : 0; c < l; ++c, y = p)
      u = f[c], v = m[u], p = y + (v > 0 ? v * h : 0) + w, m[u] = {
        data: o[u],
        index: c,
        value: v,
        startAngle: y,
        endAngle: p,
        padAngle: x
      };
    return m;
  }
  return s.value = function(o) {
    return arguments.length ? (e = typeof o == "function" ? o : it(+o), s) : e;
  }, s.sortValues = function(o) {
    return arguments.length ? (t = o, n = null, s) : t;
  }, s.sort = function(o) {
    return arguments.length ? (n = o, t = null, s) : n;
  }, s.startAngle = function(o) {
    return arguments.length ? (r = typeof o == "function" ? o : it(+o), s) : r;
  }, s.endAngle = function(o) {
    return arguments.length ? (i = typeof o == "function" ? o : it(+o), s) : i;
  }, s.padAngle = function(o) {
    return arguments.length ? (a = typeof o == "function" ? o : it(+o), s) : a;
  }, s;
}
var Kg = $l(Ua);
function zl(e) {
  this._curve = e;
}
zl.prototype = {
  areaStart: function() {
    this._curve.areaStart();
  },
  areaEnd: function() {
    this._curve.areaEnd();
  },
  lineStart: function() {
    this._curve.lineStart();
  },
  lineEnd: function() {
    this._curve.lineEnd();
  },
  point: function(e, t) {
    this._curve.point(t * Math.sin(e), t * -Math.cos(e));
  }
};
function $l(e) {
  function t(n) {
    return new zl(e(n));
  }
  return t._curve = e, t;
}
function Qg(e) {
  var t = e.curve;
  return e.angle = e.x, delete e.x, e.radius = e.y, delete e.y, e.curve = function(n) {
    return arguments.length ? t($l(n)) : t()._curve;
  }, e;
}
function Jg() {
  return Qg(Xn().curve(Kg));
}
var Hs = Array.prototype.slice;
const Wl = {
  draw: function(e, t) {
    var n = Math.sqrt(t / fn);
    e.moveTo(n, 0), e.arc(0, 0, n, 0, Pn);
  }
}, tp = {
  draw: function(e, t) {
    var n = Math.sqrt(t / 5) / 2;
    e.moveTo(-3 * n, -n), e.lineTo(-n, -n), e.lineTo(-n, -3 * n), e.lineTo(n, -3 * n), e.lineTo(n, -n), e.lineTo(3 * n, -n), e.lineTo(3 * n, n), e.lineTo(n, n), e.lineTo(n, 3 * n), e.lineTo(-n, 3 * n), e.lineTo(-n, n), e.lineTo(-3 * n, n), e.closePath();
  }
}, ep = {
  draw: function(e, t) {
    var n = Math.sqrt(t), r = -n / 2;
    e.rect(r, r, n, n);
  }
};
var Ei = Math.sqrt(3);
const np = {
  draw: function(e, t) {
    var n = -Math.sqrt(t / (Ei * 3));
    e.moveTo(0, n * 2), e.lineTo(-Ei * n, -n), e.lineTo(Ei * n, -n), e.closePath();
  }
};
function rp() {
  var e = it(Wl), t = it(64), n = null;
  function r() {
    var i;
    if (n || (n = i = Se()), e.apply(this, arguments).draw(n, +t.apply(this, arguments)), i) return n = null, i + "" || null;
  }
  return r.type = function(i) {
    return arguments.length ? (e = typeof i == "function" ? i : it(i), r) : e;
  }, r.size = function(i) {
    return arguments.length ? (t = typeof i == "function" ? i : it(+i), r) : t;
  }, r.context = function(i) {
    return arguments.length ? (n = i ?? null, r) : n;
  }, r;
}
function zs() {
}
function Yl(e) {
  this._context = e;
}
Yl.prototype = {
  areaStart: zs,
  areaEnd: zs,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function ip(e) {
  return new Yl(e);
}
function $s(e) {
  return e < 0 ? -1 : 1;
}
function Ws(e, t, n) {
  var r = e._x1 - e._x0, i = t - e._x1, a = (e._y1 - e._y0) / (r || i < 0 && -0), s = (n - e._y1) / (i || r < 0 && -0), o = (a * i + s * r) / (r + i);
  return ($s(a) + $s(s)) * Math.min(Math.abs(a), Math.abs(s), 0.5 * Math.abs(o)) || 0;
}
function Ys(e, t) {
  var n = e._x1 - e._x0;
  return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function Ni(e, t, n) {
  var r = e._x0, i = e._y0, a = e._x1, s = e._y1, o = (a - r) / 3;
  e._context.bezierCurveTo(r + o, i + o * t, a - o, s - o * n, a, s);
}
function Vr(e) {
  this._context = e;
}
Vr.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Ni(this, this._t0, Ys(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var n = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, Ni(this, Ys(this, n = Ws(this, e, t)), n);
          break;
        default:
          Ni(this, this._t0, n = Ws(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
    }
  }
};
Object.create(Vr.prototype).point = function(e, t) {
  Vr.prototype.point.call(this, t, e);
};
function gn(e) {
  return new Vr(e);
}
function Sa(e, t) {
  if ((s = e.length) > 1)
    for (var n = 1, r, i, a = e[t[0]], s, o = a.length; n < s; ++n)
      for (i = a, a = e[t[n]], r = 0; r < o; ++r)
        a[r][1] += a[r][0] = isNaN(i[r][1]) ? i[r][0] : i[r][1];
}
function xa(e) {
  for (var t = e.length, n = new Array(t); --t >= 0; ) n[t] = t;
  return n;
}
function ap(e, t) {
  return e[t];
}
function sp() {
  var e = it([]), t = xa, n = Sa, r = ap;
  function i(a) {
    var s = e.apply(this, arguments), o, c = a.length, l = s.length, u = new Array(l), h;
    for (o = 0; o < l; ++o) {
      for (var d = s[o], f = u[o] = new Array(c), m = 0, y; m < c; ++m)
        f[m] = y = [0, +r(a[m], d, m, a)], y.data = a[m];
      f.key = d;
    }
    for (o = 0, h = t(u); o < l; ++o)
      u[h[o]].index = o;
    return n(u, h), u;
  }
  return i.keys = function(a) {
    return arguments.length ? (e = typeof a == "function" ? a : it(Hs.call(a)), i) : e;
  }, i.value = function(a) {
    return arguments.length ? (r = typeof a == "function" ? a : it(+a), i) : r;
  }, i.order = function(a) {
    return arguments.length ? (t = a == null ? xa : typeof a == "function" ? a : it(Hs.call(a)), i) : t;
  }, i.offset = function(a) {
    return arguments.length ? (n = a ?? Sa, i) : n;
  }, i;
}
function op(e) {
  var t = +this._x.call(null, e), n = +this._y.call(null, e);
  return Gl(this.cover(t, n), t, n, e);
}
function Gl(e, t, n, r) {
  if (isNaN(t) || isNaN(n)) return e;
  var i, a = e._root, s = { data: r }, o = e._x0, c = e._y0, l = e._x1, u = e._y1, h, d, f, m, y, g, p, x;
  if (!a) return e._root = s, e;
  for (; a.length; )
    if ((y = t >= (h = (o + l) / 2)) ? o = h : l = h, (g = n >= (d = (c + u) / 2)) ? c = d : u = d, i = a, !(a = a[p = g << 1 | y])) return i[p] = s, e;
  if (f = +e._x.call(null, a.data), m = +e._y.call(null, a.data), t === f && n === m) return s.next = a, i ? i[p] = s : e._root = s, e;
  do
    i = i ? i[p] = new Array(4) : e._root = new Array(4), (y = t >= (h = (o + l) / 2)) ? o = h : l = h, (g = n >= (d = (c + u) / 2)) ? c = d : u = d;
  while ((p = g << 1 | y) === (x = (m >= d) << 1 | f >= h));
  return i[x] = a, i[p] = s, e;
}
function lp(e) {
  var t, n, r = e.length, i, a, s = new Array(r), o = new Array(r), c = 1 / 0, l = 1 / 0, u = -1 / 0, h = -1 / 0;
  for (n = 0; n < r; ++n)
    isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (s[n] = i, o[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > h && (h = a));
  if (c > u || l > h) return this;
  for (this.cover(c, l).cover(u, h), n = 0; n < r; ++n)
    Gl(this, s[n], o[n], e[n]);
  return this;
}
function cp(e, t) {
  if (isNaN(e = +e) || isNaN(t = +t)) return this;
  var n = this._x0, r = this._y0, i = this._x1, a = this._y1;
  if (isNaN(n))
    i = (n = Math.floor(e)) + 1, a = (r = Math.floor(t)) + 1;
  else {
    for (var s = i - n, o = this._root, c, l; n > e || e >= i || r > t || t >= a; )
      switch (l = (t < r) << 1 | e < n, c = new Array(4), c[l] = o, o = c, s *= 2, l) {
        case 0:
          i = n + s, a = r + s;
          break;
        case 1:
          n = i - s, a = r + s;
          break;
        case 2:
          i = n + s, r = a - s;
          break;
        case 3:
          n = i - s, r = a - s;
          break;
      }
    this._root && this._root.length && (this._root = o);
  }
  return this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this;
}
function up() {
  var e = [];
  return this.visit(function(t) {
    if (!t.length) do
      e.push(t.data);
    while (t = t.next);
  }), e;
}
function hp(e) {
  return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function Nt(e, t, n, r, i) {
  this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
function dp(e, t, n) {
  var r, i = this._x0, a = this._y0, s, o, c, l, u = this._x1, h = this._y1, d = [], f = this._root, m, y;
  for (f && d.push(new Nt(f, i, a, u, h)), n == null ? n = 1 / 0 : (i = e - n, a = t - n, u = e + n, h = t + n, n *= n); m = d.pop(); )
    if (!(!(f = m.node) || (s = m.x0) > u || (o = m.y0) > h || (c = m.x1) < i || (l = m.y1) < a))
      if (f.length) {
        var g = (s + c) / 2, p = (o + l) / 2;
        d.push(
          new Nt(f[3], g, p, c, l),
          new Nt(f[2], s, p, g, l),
          new Nt(f[1], g, o, c, p),
          new Nt(f[0], s, o, g, p)
        ), (y = (t >= p) << 1 | e >= g) && (m = d[d.length - 1], d[d.length - 1] = d[d.length - 1 - y], d[d.length - 1 - y] = m);
      } else {
        var x = e - +this._x.call(null, f.data), w = t - +this._y.call(null, f.data), v = x * x + w * w;
        if (v < n) {
          var T = Math.sqrt(n = v);
          i = e - T, a = t - T, u = e + T, h = t + T, r = f.data;
        }
      }
  return r;
}
function fp(e) {
  if (isNaN(u = +this._x.call(null, e)) || isNaN(h = +this._y.call(null, e))) return this;
  var t, n = this._root, r, i, a, s = this._x0, o = this._y0, c = this._x1, l = this._y1, u, h, d, f, m, y, g, p;
  if (!n) return this;
  if (n.length) for (; ; ) {
    if ((m = u >= (d = (s + c) / 2)) ? s = d : c = d, (y = h >= (f = (o + l) / 2)) ? o = f : l = f, t = n, !(n = n[g = y << 1 | m])) return this;
    if (!n.length) break;
    (t[g + 1 & 3] || t[g + 2 & 3] || t[g + 3 & 3]) && (r = t, p = g);
  }
  for (; n.data !== e; ) if (i = n, !(n = n.next)) return this;
  return (a = n.next) && delete n.next, i ? (a ? i.next = a : delete i.next, this) : t ? (a ? t[g] = a : delete t[g], (n = t[0] || t[1] || t[2] || t[3]) && n === (t[3] || t[2] || t[1] || t[0]) && !n.length && (r ? r[p] = n : this._root = n), this) : (this._root = a, this);
}
function gp(e) {
  for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
  return this;
}
function pp() {
  return this._root;
}
function mp() {
  var e = 0;
  return this.visit(function(t) {
    if (!t.length) do
      ++e;
    while (t = t.next);
  }), e;
}
function yp(e) {
  var t = [], n, r = this._root, i, a, s, o, c;
  for (r && t.push(new Nt(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop(); )
    if (!e(r = n.node, a = n.x0, s = n.y0, o = n.x1, c = n.y1) && r.length) {
      var l = (a + o) / 2, u = (s + c) / 2;
      (i = r[3]) && t.push(new Nt(i, l, u, o, c)), (i = r[2]) && t.push(new Nt(i, a, u, l, c)), (i = r[1]) && t.push(new Nt(i, l, s, o, u)), (i = r[0]) && t.push(new Nt(i, a, s, l, u));
    }
  return this;
}
function vp(e) {
  var t = [], n = [], r;
  for (this._root && t.push(new Nt(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop(); ) {
    var i = r.node;
    if (i.length) {
      var a, s = r.x0, o = r.y0, c = r.x1, l = r.y1, u = (s + c) / 2, h = (o + l) / 2;
      (a = i[0]) && t.push(new Nt(a, s, o, u, h)), (a = i[1]) && t.push(new Nt(a, u, o, c, h)), (a = i[2]) && t.push(new Nt(a, s, h, u, l)), (a = i[3]) && t.push(new Nt(a, u, h, c, l));
    }
    n.push(r);
  }
  for (; r = n.pop(); )
    e(r.node, r.x0, r.y0, r.x1, r.y1);
  return this;
}
function Sp(e) {
  return e[0];
}
function xp(e) {
  return arguments.length ? (this._x = e, this) : this._x;
}
function wp(e) {
  return e[1];
}
function bp(e) {
  return arguments.length ? (this._y = e, this) : this._y;
}
function hi(e, t, n) {
  var r = new Ha(t ?? Sp, n ?? wp, NaN, NaN, NaN, NaN);
  return e == null ? r : r.addAll(e);
}
function Ha(e, t, n, r, i, a) {
  this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function Gs(e) {
  for (var t = { data: e.data }, n = t; e = e.next; ) n = n.next = { data: e.data };
  return t;
}
var kt = hi.prototype = Ha.prototype;
kt.copy = function() {
  var e = new Ha(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
  if (!t) return e;
  if (!t.length) return e._root = Gs(t), e;
  for (n = [{ source: t, target: e._root = new Array(4) }]; t = n.pop(); )
    for (var i = 0; i < 4; ++i)
      (r = t.source[i]) && (r.length ? n.push({ source: r, target: t.target[i] = new Array(4) }) : t.target[i] = Gs(r));
  return e;
};
kt.add = op;
kt.addAll = lp;
kt.cover = cp;
kt.data = up;
kt.extent = hp;
kt.find = dp;
kt.remove = fp;
kt.removeAll = gp;
kt.root = pp;
kt.size = mp;
kt.visit = yp;
kt.visitAfter = vp;
kt.x = xp;
kt.y = bp;
class di {
  constructor(t, n, r, i, a) {
    this.xScale = r, this.yScale = i, this.searchRadius = a;
    const s = n.map((o) => ({
      dataPoint: o,
      context: t,
      location: this.dataToLocationCoordinates(o)
    }));
    this.quadTree = hi().x((o) => this.xScale.transformData(o.dataPoint)).y((o) => this.yScale.transformData(o.dataPoint)).addAll(s);
  }
  quadTree;
  dataForLocation(t) {
    const n = this.quadTree.find(
      t.x,
      t.y,
      this.searchRadius
    );
    return n === void 0 ? [] : [n];
  }
  dataToLocationCoordinates(t) {
    return {
      x: this.xScale.transformToTooltipAnchor(t),
      y: this.yScale.transformToTooltipAnchor(t)
    };
  }
}
class Me extends nr {
  static CSS_CLASS = "points-data-series";
  drawSvg(t, n) {
    const r = P(t).selectAll(Gt(Me.CSS_CLASS)).data([null]).join("g").classed(Me.CSS_CLASS, !0);
    this.drawSvgSymbols(r, n);
  }
  getColor(t) {
    return this.series.symbol?.getColor?.(t) ?? this.series.getColor?.(t) ?? this.series.color;
  }
  drawCanvas(t) {
    const n = this.getSymbolGenerator(this.series.symbol?.type).size(48).context(t);
    this.series.data.filter((r) => this.series.symbol?.show?.(r)).forEach((r) => {
      t.translate(
        this.xScale.transformData(r),
        this.yScale.transformData(r)
      ), t.beginPath(), n(), t.closePath(), t.strokeStyle = this.getColor(r), t.fillStyle = this.getColor(r), t.fill(), t.stroke(), t.resetTransform();
    });
  }
  buildMultiAxisDataLookupStrategy() {
    return new di(
      this.series,
      this.series.data,
      this.xScale,
      this.yScale
    );
  }
  drawSvgSymbols(t, n) {
    const r = this.getSymbolGenerator().size(48), i = n === ge.Exit ? [] : this.series.data.filter(
      (o) => this.series.symbol?.show?.(o) ?? !0
    ), a = this.xScale.getScaleType() === xt.Band && this.series.type === pt.Line ? this.xScale.getBandwidth() / 2 : 0, s = t.selectAll("path.point").data(i, (o) => this.getDatumKey(o));
    s.exit().transition().duration(Yt).attr(
      "transform",
      (o) => `translate(${this.xScale.transformData(o) + a}, ${this.yScale.getRangeStart()})`
    ).remove(), s.transition().duration(Yt).attr("fill", (o) => this.getColor(o)).attr("d", r).attr(
      "transform",
      (o) => `translate(${this.xScale.transformData(o) + a}, ${this.yScale.transformData(o)})`
    ), s.enter().append("path").classed("point", !0).attr("fill", (o) => this.getColor(o)).attr("d", r).attr(
      "transform",
      (o) => `translate(${this.xScale.transformData(o) + a}, ${this.yScale.getRangeStart()})`
    ).transition().duration(Yt).attr(
      "transform",
      (o) => `translate(${this.xScale.transformData(o) + a}, ${this.yScale.transformData(o)})`
    );
  }
  getSymbolGenerator(t) {
    return rp().type(this.lookupSymbolType(t));
  }
  lookupSymbolType(t) {
    switch (t) {
      case En.Square:
        return ep;
      case En.Triangle:
        return np;
      case En.Cross:
        return tp;
      case En.Circle:
      default:
        return Wl;
    }
  }
}
class we extends cl {
  constructor(t, n, r, i) {
    super(n, r, i), this.d3Utils = t, this.band = n, this.scaleBuilder = r;
  }
  static CSS_BAND_CLASS = "band-group";
  static CSS_SERIES_CLASS = "band-data-series";
  static LINE_WIDTH = 2;
  buildDataLookupStrategy(t, n) {
    return n.followSingleAxis !== void 0 ? new si(
      t,
      this.getCombinedData(t),
      this.xScale,
      this.yScale,
      n.radius,
      n.followSingleAxis
    ) : this.buildMultiAxisDataLookupStrategy();
  }
  getCombinedData(t) {
    return [t.upper.data, t.lower.data].flatMap((n) => n);
  }
  getPairedData(t) {
    return t.upper.data.length !== t.lower.data.length ? [] : t.upper.data.map((n, r) => [
      n,
      t.lower.data[r]
    ]);
  }
  /*
   * SVG
   */
  drawSvg(t) {
    if (this.band.hide)
      return;
    const n = this.d3Utils.select(t).selectAll(Gt(we.CSS_BAND_CLASS)).data([null]).join("g").classed(we.CSS_BAND_CLASS, !0), r = [this.band.upper, this.band.lower];
    n.selectAll(
      Gt(we.CSS_SERIES_CLASS)
    ).data(r, (i) => i.name).join("g").classed(we.CSS_SERIES_CLASS, !0).attr("fill", "none").attr("stroke-width", we.LINE_WIDTH).attr("stroke", (i) => i.color).attr("stroke-dasharray", "3, 3").each((i, a, s) => {
      this.drawSvgLine(r[a], P(s[a])), this.drawSvgPointsIfRequested(r[a], s[a]);
    }), this.drawSvgArea(n);
  }
  drawSvgLine(t, n) {
    n.selectAll("path.line").data([t.name]).join("path").classed("line", !0).attr("d", this.buildLine()(t.data));
  }
  drawSvgArea(t) {
    t.selectAll("path.area").data([null]).join("path").classed("area", !0).attr("d", this.buildArea()(this.getPairedData(this.band))).style("fill", this.band.color).style("opacity", this.band.opacity);
  }
  drawSvgPointsIfRequested(t, n) {
    t.symbol?.type !== void 0 && new Me(t, this.scaleBuilder).drawSvg(n);
  }
  /*
   * Canvas
   */
  drawCanvas(t) {
    this.drawCanvasLine(this.band.upper, t), this.drawCanvasLine(this.band.lower, t), this.drawCanvasPointsIfRequested(this.band.upper, t), this.drawCanvasPointsIfRequested(this.band.lower, t), this.drawCanvasArea(t);
  }
  getUniqueCartesianDataKey() {
    return this.band.upper.name + this.band.lower.name;
  }
  buildMultiAxisDataLookupStrategy() {
    return new di(
      this.band,
      this.getCombinedData(this.band),
      this.xScale,
      this.yScale,
      10
    );
  }
  drawCanvasLine(t, n) {
    n.beginPath(), this.buildLine().context(n)(t.data), n.strokeStyle = t.color, n.lineWidth = we.LINE_WIDTH, n.stroke();
  }
  drawCanvasArea(t) {
    t.save(), t.beginPath(), this.buildArea().context(t)(this.getPairedData(this.band)), t.strokeStyle = this.band.color, t.fillStyle = this.band.color, t.globalAlpha = 0.4, t.fill(), t.restore();
  }
  drawCanvasPointsIfRequested(t, n) {
    t.symbol?.type !== void 0 && new Me(t, this.scaleBuilder).drawCanvas(n);
  }
  /*
   * Build
   */
  buildLine() {
    return Xn().x((t) => this.xScale.transformData(t)).y((t) => this.yScale.transformData(t)).curve(gn);
  }
  buildArea() {
    return va().x0((t) => this.xScale.transformData(t[0])).x1((t) => this.xScale.transformData(t[1])).y0((t) => this.yScale.transformData(t[0])).y1((t) => this.yScale.transformData(t[1])).curve(gn);
  }
}
function Vs(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Tp(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Vs(Object(n), !0).forEach(function(r) {
      Ap(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Vs(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Fn(e) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Fn = function(t) {
    return typeof t;
  } : Fn = function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Fn(e);
}
function Ap(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function Xr() {
  return Xr = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Xr.apply(this, arguments);
}
function Dp(e, t) {
  if (e) {
    if (typeof e == "string") return Xs(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Xs(e, t);
  }
}
function Xs(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Vl(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (!n) {
    if (Array.isArray(e) || (n = Dp(e)) || t) {
      n && (e = n);
      var r = 0, i = function() {
      };
      return {
        s: i,
        n: function() {
          return r >= e.length ? {
            done: !0
          } : {
            done: !1,
            value: e[r++]
          };
        },
        e: function(c) {
          throw c;
        },
        f: i
      };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var a = !0, s = !1, o;
  return {
    s: function() {
      n = n.call(e);
    },
    n: function() {
      var c = n.next();
      return a = c.done, c;
    },
    e: function(c) {
      s = !0, o = c;
    },
    f: function() {
      try {
        !a && n.return != null && n.return();
      } finally {
        if (s) throw o;
      }
    }
  };
}
function Mp(e, t) {
  var n = [], r = [];
  function i(a, s) {
    if (a.length === 1)
      n.push(a[0]), r.push(a[0]);
    else {
      for (var o = Array(a.length - 1), c = 0; c < o.length; c++)
        c === 0 && n.push(a[0]), c === o.length - 1 && r.push(a[c + 1]), o[c] = [(1 - s) * a[c][0] + s * a[c + 1][0], (1 - s) * a[c][1] + s * a[c + 1][1]];
      i(o, s);
    }
  }
  return e.length && i(e, t), {
    left: n,
    right: r.reverse()
  };
}
function Cp(e) {
  var t = {};
  return e.length === 4 && (t.x2 = e[2][0], t.y2 = e[2][1]), e.length >= 3 && (t.x1 = e[1][0], t.y1 = e[1][1]), t.x = e[e.length - 1][0], t.y = e[e.length - 1][1], e.length === 4 ? t.type = "C" : e.length === 3 ? t.type = "Q" : t.type = "L", t;
}
function _p(e, t) {
  t = t || 2;
  for (var n = [], r = e, i = 1 / t, a = 0; a < t - 1; a++) {
    var s = i / (1 - i * a), o = Mp(r, s);
    n.push(o.left), r = o.right;
  }
  return n.push(r), n;
}
function Ep(e, t, n) {
  var r = [[e.x, e.y]];
  return t.x1 != null && r.push([t.x1, t.y1]), t.x2 != null && r.push([t.x2, t.y2]), r.push([t.x, t.y]), _p(r, n).map(Cp);
}
var Np = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g, sn = {
  M: ["x", "y"],
  L: ["x", "y"],
  H: ["x"],
  V: ["y"],
  C: ["x1", "y1", "x2", "y2", "x", "y"],
  S: ["x2", "y2", "x", "y"],
  Q: ["x1", "y1", "x", "y"],
  T: ["x", "y"],
  A: ["rx", "ry", "xAxisRotation", "largeArcFlag", "sweepFlag", "x", "y"],
  Z: []
};
Object.keys(sn).forEach(function(e) {
  sn[e.toLowerCase()] = sn[e];
});
function wa(e, t) {
  for (var n = Array(e), r = 0; r < e; r++)
    n[r] = t;
  return n;
}
function Rp(e) {
  return "".concat(e.type).concat(sn[e.type].map(function(t) {
    return e[t];
  }).join(","));
}
function Lp(e, t) {
  var n = {
    x1: "x",
    y1: "y",
    x2: "x",
    y2: "y"
  }, r = ["xAxisRotation", "largeArcFlag", "sweepFlag"];
  if (e.type !== t.type && t.type.toUpperCase() !== "M") {
    var i = {};
    Object.keys(t).forEach(function(a) {
      var s = t[a], o = e[a];
      o === void 0 && (r.includes(a) ? o = s : (o === void 0 && n[a] && (o = e[n[a]]), o === void 0 && (o = 0))), i[a] = o;
    }), i.type = t.type, e = i;
  }
  return e;
}
function kp(e, t, n) {
  var r = [];
  if (t.type === "L" || t.type === "Q" || t.type === "C")
    r = r.concat(Ep(e, t, n));
  else {
    var i = Xr({}, e);
    i.type === "M" && (i.type = "L"), r = r.concat(wa(n - 1).map(function() {
      return i;
    })), r.push(t);
  }
  return r;
}
function js(e, t, n) {
  var r = e.length - 1, i = t.length - 1, a = r / i, s = wa(i).reduce(function(c, l, u) {
    var h = Math.floor(a * u);
    if (n && h < e.length - 1 && n(e[h], e[h + 1])) {
      var d = a * u % 1 < 0.5;
      c[h] && (d ? h > 0 ? h -= 1 : h < e.length - 1 && (h += 1) : h < e.length - 1 ? h += 1 : h > 0 && (h -= 1));
    }
    return c[h] = (c[h] || 0) + 1, c;
  }, []), o = s.reduce(function(c, l, u) {
    if (u === e.length - 1) {
      var h = wa(l, Xr({}, e[e.length - 1]));
      return h[0].type === "M" && h.forEach(function(d) {
        d.type = "L";
      }), c.concat(h);
    }
    return c.concat(kp(e[u], e[u + 1], l));
  }, []);
  return o.unshift(e[0]), o;
}
function qs(e) {
  for (var t = (e || "").match(Np) || [], n = [], r, i, a = 0; a < t.length; ++a)
    if (r = sn[t[a]], r) {
      i = {
        type: t[a]
      };
      for (var s = 0; s < r.length; ++s)
        i[r[s]] = +t[a + s + 1];
      a += r.length, n.push(i);
    }
  return n;
}
function Ip(e, t, n) {
  var r = e == null ? [] : e.slice(), i = t == null ? [] : t.slice(), a = Fn(n) === "object" ? n : {
    excludeSegment: n,
    snapEndsToInput: !0
  }, s = a.excludeSegment, o = a.snapEndsToInput;
  if (!r.length && !i.length)
    return function() {
      return [];
    };
  var c = (r.length === 0 || r[r.length - 1].type === "Z") && (i.length === 0 || i[i.length - 1].type === "Z");
  r.length > 0 && r[r.length - 1].type === "Z" && r.pop(), i.length > 0 && i[i.length - 1].type === "Z" && i.pop(), r.length ? i.length || i.push(r[0]) : r.push(i[0]);
  var l = Math.abs(i.length - r.length);
  l !== 0 && (i.length > r.length ? r = js(r, i, s) : i.length < r.length && (i = js(i, r, s))), r = r.map(function(h, d) {
    return Lp(h, i[d]);
  });
  var u = r.map(function(h) {
    return Tp({}, h);
  });
  return c && (u.push({
    type: "Z"
  }), r.push({
    type: "Z"
  })), function(d) {
    if (d === 1 && o)
      return t ?? [];
    if (d === 0)
      return r;
    for (var f = 0; f < u.length; ++f) {
      var m = r[f], y = i[f], g = u[f], p = Vl(sn[g.type]), x;
      try {
        for (p.s(); !(x = p.n()).done; ) {
          var w = x.value;
          g[w] = (1 - d) * m[w] + d * y[w], (w === "largeArcFlag" || w === "sweepFlag") && (g[w] = Math.round(g[w]));
        }
      } catch (v) {
        p.e(v);
      } finally {
        p.f();
      }
    }
    return u;
  };
}
function on(e, t, n) {
  var r = qs(e), i = qs(t), a = Fn(n) === "object" ? n : {
    excludeSegment: n,
    snapEndsToInput: !0
  }, s = a.excludeSegment, o = a.snapEndsToInput;
  if (!r.length && !i.length)
    return function() {
      return "";
    };
  var c = Ip(r, i, {
    excludeSegment: s,
    snapEndsToInput: o
  });
  return function(u) {
    if (u === 1 && o)
      return t ?? "";
    var h = c(u), d = "", f = Vl(h), m;
    try {
      for (f.s(); !(m = f.n()).done; ) {
        var y = m.value;
        d += Rp(y);
      }
    } catch (g) {
      f.e(g);
    } finally {
      f.f();
    }
    return d;
  };
}
class le extends nr {
  static CSS_LINE_CLASS = "line-data-series";
  static LINE_WIDTH = 2;
  static DROP_SHADOW_FILTER = (t) => Ht.getDropShadowColor(t);
  drawSvg(t, n) {
    if (this.series.hide)
      return;
    const r = P(t).selectAll(Gt(le.CSS_LINE_CLASS)).data([null]).join("g").classed(le.CSS_LINE_CLASS, !0).attr("fill", "none").attr("stroke-width", le.LINE_WIDTH).attr("stroke", this.series.color).style("filter", le.DROP_SHADOW_FILTER(this.series.color));
    this.drawSvgLine(r, n), this.drawSvgPointsIfRequested(r.node(), n), this.drawSvgVerticalLinesIfRequested(r);
  }
  drawCanvas(t) {
    this.drawCanvasLine(t), this.drawCanvasPointsIfRequested(t);
  }
  buildMultiAxisDataLookupStrategy() {
    return new di(
      this.series,
      this.series.data,
      this.xScale,
      this.yScale,
      10
    );
  }
  drawSvgLine(t, n) {
    const r = this.buildLine(), i = this.buildStartingLine(), a = n === ge.Exit ? [] : [this.series], s = t.selectAll("path.line").data(a, (o) => o.name);
    s.exit().transition().duration(Yt).attrTween("d", (o, c, l) => {
      const u = P(l[c]).attr("d"), h = i(this.series.data) ?? "", d = on(u, h);
      return (f) => d(f);
    }).remove(), s.transition().duration(Yt).attrTween("d", (o, c, l) => {
      const u = P(l[c]).attr("d"), h = r(this.series.data) ?? "", d = on(u, h);
      return (f) => d(f);
    }), s.enter().append("path").classed("line", !0).transition().duration(Yt).attrTween("d", () => {
      const o = i(this.series.data) ?? "", c = r(this.series.data) ?? "", l = on(o, c);
      return (u) => l(u);
    });
  }
  drawCanvasLine(t) {
    t.beginPath(), this.buildLine().context(t)(this.series.data), t.strokeStyle = this.series.color, t.lineWidth = le.LINE_WIDTH, t.stroke();
  }
  buildLine() {
    const t = this.xScale.getScaleType() === xt.Band ? this.xScale.getBandwidth() / 2 : 0;
    return Xn().x((n) => this.xScale.transformData(n) + t).y((n) => this.getDatumY(n)).curve(gn);
  }
  // Build a line for the starting point of the line chart to animate
  buildStartingLine() {
    const t = this.xScale.getScaleType() === xt.Band ? this.xScale.getBandwidth() / 2 : 0;
    return Xn().x((n) => this.xScale.transformData(n) + t).y((n) => this.getDatumOriginY(n)).curve(gn);
  }
  /**
   * Get the height of the datum from the Y value.
   * Matches CartesianColumn.getDatumHeight pattern.
   */
  getDatumHeight(t) {
    return this.yScale.getRangeStart() - this.yScale.transformData(t);
  }
  /**
   * Get the Y position for a data point (line position for stacking).
   * Matches CartesianColumn.getBarOriginY pattern.
   * For stacked series: origin minus height (stacks on top of previous)
   * For non-stacked series: just the raw Y position
   */
  getDatumY(t) {
    return this.series.stacking ? this.yScale.transformDataOrigin(t) - this.getDatumHeight(t) : this.yScale.transformData(t);
  }
  /**
   * Get the baseline Y position for a data point.
   * Uses transformDataOrigin which handles stacking baseline.
   * For stacked series: where the previous series ended
   * For non-stacked series: bottom of chart (range start)
   */
  getDatumOriginY(t) {
    return this.series.stacking ? this.yScale.transformDataOrigin(t) : this.yScale.getRangeStart();
  }
  drawSvgPointsIfRequested(t, n) {
    this.series.symbol?.type !== void 0 && new Me(this.series, this.scaleBuilder).drawSvg(
      t,
      n
    );
  }
  drawCanvasPointsIfRequested(t) {
    this.series.symbol?.type !== void 0 && new Me(this.series, this.scaleBuilder).drawCanvas(t);
  }
  drawSvgVerticalLinesIfRequested(t) {
    if (!this.series.verticalLine?.show)
      return;
    const n = t.selectAll(".vertical-lines").data([null]).join("g").classed("vertical-lines", !0);
    this.series.data.filter(
      (i) => this.series.verticalLine?.show?.(i) ?? !1
    ).forEach((i) => {
      const a = this.xScale.transformData(i), s = this.yScale.transformData(i);
      n.selectAll(".vertical-line").data([i], (o) => this.getDatumKey(o)).join("line").classed("vertical-line", !0).attr("x1", a).attr("y1", s).attr("x2", a).attr("y2", this.yScale.getRangeStart()).attr(
        "stroke",
        this.series.verticalLine?.getColor?.(i) ?? this.series.getColor?.(i) ?? this.series.color
      ).attr("stroke-width", 1).attr("stroke-dasharray", "4,2");
    });
  }
}
const Op = (e, t) => {
  const n = t.x - e.x, r = e.y - t.y;
  return Xl(Math.atan2(r, n));
}, Xl = (e) => {
  const t = 2 * Math.PI;
  return e >= 0 ? e % t : (e % t + t) % t;
}, ba = (e, t) => ({
  x: Bp(e, t),
  y: Pp(e, t)
}), Bp = (e, t) => e * Math.sin(t), Pp = (e, t) => e * -Math.cos(t), jl = (e, t) => {
  const n = 2 * Math.PI, r = (Math.atan2(t, e) + n) % n;
  return (n - r + Math.PI / 2) % n;
}, Zs = (e, t) => Math.sqrt(
  Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)
), Fp = (e) => Array.from(e).reduce((t, n) => Math.imul(31, t) + n.charCodeAt(0) | 0, 0);
class jr extends nr {
  static CSS_CLASS = "area-data-series";
  drawSvg(t, n) {
    const r = P(t).selectAll(Gt(jr.CSS_CLASS)).data([null]).join("g").classed(jr.CSS_CLASS, !0);
    this.drawAreaGradient(t), this.drawSvgArea(r, n), this.buildLine().drawSvg(r.node(), n);
  }
  drawCanvas(t) {
    this.drawCanvasArea(t), this.buildLine().drawCanvas(t);
  }
  buildMultiAxisDataLookupStrategy() {
    return new di(
      this.series,
      this.series.data,
      this.xScale,
      this.yScale
    );
  }
  drawSvgArea(t, n) {
    const r = this.buildArea(), i = this.buildStartingArea(), a = n === ge.Exit ? [] : [this.series], s = t.selectAll("path.area").data(a, (o) => o.name);
    s.exit().transition().duration(Yt).attrTween("d", (o, c, l) => {
      const u = P(l[c]).attr("d"), h = i(this.series.data) ?? "", d = on(u, h);
      return (f) => d(f);
    }).remove(), s.transition().duration(Yt).attrTween("d", (o, c, l) => {
      const u = P(l[c]).attr("d"), h = r(this.series.data) ?? "", d = on(u, h);
      return (f) => d(f);
    }), s.enter().append("path").classed("area", !0).attr("fill", `url(#linear-gradient-${this.getColorIdentifier()})`).transition().duration(Yt).attrTween("d", () => {
      const o = i(this.series.data) ?? "", c = r(this.series.data) ?? "", l = on(o, c);
      return (u) => l(u);
    });
  }
  drawCanvasArea(t) {
    t.save(), t.beginPath(), this.buildArea().context(t)(this.series.data), t.strokeStyle = this.series.color, t.fillStyle = this.series.color, t.globalAlpha = 0.4, t.fill(), t.restore();
  }
  buildArea() {
    const t = this.xScale.getScaleType() === xt.Band ? this.xScale.getBandwidth() / 2 : 0;
    return va().x((n) => this.xScale.transformData(n) + t).y1((n) => this.getDatumY(n)).y0((n) => this.getDatumOriginY(n)).curve(gn);
  }
  buildStartingArea() {
    const t = this.xScale.getScaleType() === xt.Band ? this.xScale.getBandwidth() / 2 : 0;
    return va().x((n) => this.xScale.transformData(n) + t).y1((n) => this.getDatumOriginY(n)).y0((n) => this.getDatumOriginY(n)).curve(gn);
  }
  /**
   * Get the height of the datum from the Y value.
   * Matches CartesianColumn.getDatumHeight pattern.
   */
  getDatumHeight(t) {
    return this.yScale.getRangeStart() - this.yScale.transformData(t);
  }
  /**
   * Get the Y position for a data point (top of area for stacking).
   * Matches CartesianColumn.getBarOriginY pattern.
   * For stacked series: origin minus height (stacks on top of previous)
   * For non-stacked series: just the raw Y position
   */
  getDatumY(t) {
    return this.series.stacking ? this.yScale.transformDataOrigin(t) - this.getDatumHeight(t) : this.yScale.transformData(t);
  }
  /**
   * Get the baseline Y position for a data point (bottom of area).
   * Uses transformDataOrigin which handles stacking baseline.
   * For stacked series: where the previous series ended
   * For non-stacked series: bottom of chart (range start)
   */
  getDatumOriginY(t) {
    return this.series.stacking ? this.yScale.transformDataOrigin(t) : this.yScale.getRangeStart();
  }
  buildLine() {
    return new le(
      { ...this.series, symbol: void 0 },
      this.scaleBuilder
    );
  }
  drawAreaGradient(t) {
    const r = P(t).selectAll(`defs.area-gradient-${this.getColorIdentifier()}`).data([this.series]).join("defs").append("linearGradient").attr("id", `linear-gradient-${this.getColorIdentifier()}`).attr("gradientTransform", "rotate(90)").classed(`area-gradient-${this.getColorIdentifier()}`, !0);
    r.selectAll("stop").nodes().length || (r.append("stop").attr("offset", "0%").attr("stop-color", (i) => i.color).attr("stop-opacity", "0.24"), r.append("stop").attr("offset", "80%").attr("stop-color", (i) => i.color).attr("stop-opacity", "0"));
  }
  getColorIdentifier() {
    return Fp(this.series.color).toString();
  }
}
class be extends nr {
  static CSS_CLASS = "bar-data-series";
  static MAX_BAR_HEIGHT = 24;
  static MIN_BAR_WIDTH = 0;
  static BAR_ROUNDING_RADIUS = 2;
  drawSvg(t, n) {
    if (this.series.hide === !0)
      return;
    const r = P(t).selectAll(Gt(be.CSS_CLASS)).data([null]).join("g").classed(be.CSS_CLASS, !0);
    this.drawSvgColumns(r, n);
  }
  drawCanvas(t) {
    const n = this.getColumnHeight(), r = this.getOriginYAdjustment(n);
    this.series.data.forEach((i) => {
      t.translate(
        this.xScale.transformData(i),
        this.yScale.transformData(i)
      ), t.beginPath(), this.addColumnPath(
        t,
        this.getBarOriginX(i),
        this.getBarOriginY(i, r),
        this.getDatumWidth(i),
        n,
        be.BAR_ROUNDING_RADIUS
      ), t.closePath(), t.strokeStyle = this.getColorForDatum(i), t.fillStyle = this.getColorForDatum(i), t.fill(), t.stroke(), t.resetTransform();
    });
  }
  getColorForDatum(t) {
    return this.series.getColor?.(t) ?? this.series.color;
  }
  buildMultiAxisDataLookupStrategy() {
    return new si(
      this.series,
      this.series.data,
      this.xScale,
      this.yScale,
      100,
      G.Y
    );
  }
  drawSvgColumns(t, n) {
    const r = this.getColumnHeight(), i = this.getOriginYAdjustment(r), a = n === ge.Exit ? [] : this.series.data, s = r > 60 ? "lg" : r > 30 ? "md" : "sm", o = t.attr(
      "transform",
      `translate(0,${this.yScale.getStartBandwidthAdjustment()})`
    ).selectAll("path.column").data(a, (u) => this.getDatumKey(u, G.Y)), c = Br(a.length);
    o.exit().transition().duration(c).attr(
      "transform",
      (u) => `translate(${this.xScale.getRangeStart()}, ${this.getBarOriginY(u, i)})`
    ).attr("d", () => this.generateColumnPathString(0, r)), o.transition().duration(c).attr(
      "transform",
      (u) => `translate(${this.getBarOriginX(u)}, ${this.getBarOriginY(u, i)})`
    ).attrTween("d", (u, h, d) => {
      const f = P(d[h]).attr("data-width"), m = f ? parseFloat(f) : 0, y = this.getDatumWidth(u), g = Ft(m, y);
      return (p) => this.generateColumnPathString(g(p), r);
    }).style("fill", (u) => this.getColorForDatum(u)).attr(
      "filter",
      (u) => Ht.getDropShadowColor(
        this.getColorForDatum(u),
        s
      )
    ).attr("data-width", (u) => this.getDatumWidth(u));
    const l = o.enter().append("path").classed("column", !0).style("fill", (u) => this.getColorForDatum(u)).attr(
      "filter",
      (u) => Ht.getDropShadowColor(
        this.getColorForDatum(u),
        s
      )
    );
    l.attr(
      "transform",
      (u) => `translate(${this.xScale.getRangeStart()}, ${this.getBarOriginY(u, i)})`
    ).attr("d", () => this.generateColumnPathString(0, r)).transition().duration(c).attr(
      "transform",
      (u) => `translate(${this.getBarOriginX(u)}, ${this.getBarOriginY(u, i)})`
    ).attr(
      "d",
      (u) => this.generateColumnPathString(this.getDatumWidth(u), r)
    ).attr("data-width", (u) => this.getDatumWidth(u)), this.dataClickActionHandler && l.on("click", (u, h) => {
      this.dataClickActionHandler(h, this.series);
    }).on("mouseover", (u) => {
      P(u.currentTarget).style("cursor", "pointer").style("opacity", "0.8");
    }).on("mouseout", (u) => {
      P(u.currentTarget).style("cursor", "default").style("opacity", "1");
    });
  }
  getDatumWidth(t) {
    return Math.max(
      this.xScale.transformData(t) - this.xScale.getRangeStart(),
      be.MIN_BAR_WIDTH
    );
  }
  getBarOriginX(t) {
    return this.xScale.transformDataOrigin(t);
  }
  getBarOriginY(t, n) {
    return this.yScale.transformData(t) + n;
  }
  getColumnHeight() {
    return Math.min(
      this.yScale.getBandwidth() / this.yScale.getGroupedColumnSeriesLength(this.series),
      be.MAX_BAR_HEIGHT
    );
  }
  getOriginYAdjustment(t) {
    const n = this.yScale.getGroupedColumnSeriesLength(
      this.series
    ), r = (this.yScale.getBandwidth() - t * n) / 2;
    return n === 1 ? r : r + this.yScale.getGroupedColumnSeriesPosition(this.series) * t;
  }
  isShowBarTopRounding() {
    return this.xScale.isShowColumnRounding(this.series);
  }
  generateColumnPathString(t, n) {
    if (t <= 0) return "";
    const r = Se();
    return this.addColumnPath(
      r,
      0,
      0,
      t,
      n,
      be.BAR_ROUNDING_RADIUS
    ), r.toString();
  }
  addColumnPath(t, n, r, i, a, s) {
    this.isShowBarTopRounding() ? (t.moveTo(n, r), t.lineTo(n + i - s, r), t.quadraticCurveTo(
      n + i,
      r,
      n + i,
      r + s
    ), t.lineTo(n + i, r + a - s), t.quadraticCurveTo(
      n + i,
      r + a,
      n + i - s,
      r + a
    ), t.lineTo(n, r + a)) : t.rect(n, r, i, a);
  }
}
class _t extends nr {
  static CSS_CLASS = "columns-data-series";
  static MIN_COLUMN_WIDTH = 1;
  static MAX_COLUMN_WIDTH = 60;
  // Increased from 12 for better visibility
  static MIN_COLUMN_HEIGHT = 0;
  static COLUMN_ROUNDING_RADIUS = 2;
  static COLUMN_SPACING = 2;
  drawSvg(t, n) {
    if (this.series.hide === !0)
      return;
    const r = P(t).selectAll(Gt(_t.CSS_CLASS)).data([null]).join("g").classed(_t.CSS_CLASS, !0);
    this.drawSvgColumns(r, n);
  }
  drawCanvas(t) {
    const n = this.getColumnWidth(), r = this.getOriginXAdjustment(n);
    this.series.data.forEach((i) => {
      t.save(), t.translate(
        this.xScale.transformData(i),
        this.yScale.transformData(i)
      );
      const a = this.getColorForDatum(i);
      t.beginPath(), this.addColumnPath(
        t,
        this.getBarOriginX(i, r),
        this.getBarOriginY(i),
        n,
        this.getDatumHeight(i),
        _t.COLUMN_ROUNDING_RADIUS
      ), t.closePath(), t.strokeStyle = a, t.fillStyle = a, t.fill(), t.stroke(), t.restore(), t.resetTransform();
    });
  }
  getColorForDatum(t) {
    return this.series.getColor?.(t) ?? this.series.color;
  }
  buildMultiAxisDataLookupStrategy() {
    return new si(
      this.series,
      this.series.data,
      this.xScale,
      this.yScale
    );
  }
  drawSvgColumns(t, n) {
    const r = this.getColumnWidth(), i = this.getOriginXAdjustment(r), a = n === ge.Exit ? [] : this.series.data, s = r > 60 ? "lg" : r > 30 ? "md" : "sm", o = t.attr(
      "transform",
      `translate(${this.xScale.getStartBandwidthAdjustment()}, 0)`
    ).selectAll("path.column").data(a, (u) => this.getDatumKey(u)), c = Br(a.length);
    o.exit().transition().duration(c).attr(
      "transform",
      (u) => `translate(${this.getBarOriginX(u, i)}, ${this.yScale.getRangeStart()})`
    ).attr("d", () => this.generateColumnPathString(r, 0)).remove(), o.transition().duration(c).attr(
      "transform",
      (u) => `translate(${this.getBarOriginX(u, i)}, ${this.getBarOriginY(u)})`
    ).attrTween("d", (u, h, d) => {
      const f = P(d[h]).attr("data-height"), m = f ? parseFloat(f) : 0, y = this.getDatumHeight(u), g = Ft(m, y);
      return (p) => this.generateColumnPathString(r, g(p));
    }).style("fill", (u) => this.getColorForDatum(u)).attr(
      "filter",
      (u) => Ht.getDropShadowColor(
        this.getColorForDatum(u),
        s
      )
    ).attr("data-height", (u) => this.getDatumHeight(u));
    const l = o.enter().append("path").classed("column", !0).style("fill", (u) => this.getColorForDatum(u)).attr(
      "filter",
      (u) => Ht.getDropShadowColor(
        this.getColorForDatum(u),
        s
      )
    );
    l.attr(
      "transform",
      (u) => `translate(${this.getBarOriginX(u, i)}, ${this.yScale.getRangeStart()})`
    ).attr("d", () => this.generateColumnPathString(r, 0)).transition().duration(c).attr(
      "transform",
      (u) => `translate(${this.getBarOriginX(u, i)}, ${this.getBarOriginY(u)})`
    ).attr(
      "d",
      (u) => this.generateColumnPathString(r, this.getDatumHeight(u))
    ).attr("data-height", (u) => this.getDatumHeight(u)), this.dataClickActionHandler && l.on("click", (u, h) => {
      this.dataClickActionHandler(h, this.series);
    }).on("mouseover", (u) => {
      P(u.currentTarget).style("cursor", "pointer").style("opacity", "0.8");
    }).on("mouseout", (u) => {
      P(u.currentTarget).style("cursor", "default").style("opacity", "1");
    });
  }
  getDatumHeight(t) {
    const n = Math.max(
      this.yScale.getRangeStart() - this.yScale.transformData(t),
      _t.MIN_COLUMN_HEIGHT
    );
    return this.series.stacking ? Math.max(
      n - _t.COLUMN_SPACING,
      _t.MIN_COLUMN_HEIGHT
    ) : n;
  }
  getBarOriginY(t) {
    const n = this.yScale.transformDataOrigin(t) - this.getDatumHeight(t);
    return this.series.stacking ? n - _t.COLUMN_SPACING : n;
  }
  getBarOriginX(t, n) {
    return this.xScale.transformData(t) + n;
  }
  getColumnWidth() {
    const t = this.xScale.getBandwidth();
    if (this.series.stacking)
      return t >= _t.MAX_COLUMN_WIDTH ? _t.MAX_COLUMN_WIDTH : Math.max(_t.MIN_COLUMN_WIDTH, t);
    const n = this.xScale.getGroupedColumnSeriesLength(
      this.series
    ), r = t / n;
    return Math.max(_t.MIN_COLUMN_WIDTH, r);
  }
  getOriginXAdjustment(t) {
    const n = this.xScale.getGroupedColumnSeriesLength(
      this.series
    ), r = (this.xScale.getBandwidth() - t * n) / 2;
    return n === 1 ? r : r + this.xScale.getGroupedColumnSeriesPosition(this.series) * t;
  }
  generateColumnPathString(t, n) {
    if (n <= 0) return "";
    const r = Se();
    return this.addColumnPath(
      r,
      0,
      0,
      t,
      n,
      _t.COLUMN_ROUNDING_RADIUS
    ), r.toString();
  }
  addColumnPath(t, n, r, i, a, s) {
    const o = s, c = n + i, l = r + a;
    t.moveTo(n + o, r), t.lineTo(c - o, r), t.arcTo(c, r, c, r + o, o), t.lineTo(c, l - o), t.arcTo(c, l, c - o, l, o), t.lineTo(n + o, l), t.arcTo(n, l, n, l - o, o), t.lineTo(n, r + o), t.arcTo(n, r, n + o, r, o);
  }
}
class Un extends le {
  static CSS_DASHED_LINE_CLASS = "dashed-line-data-series";
  static DASHED_LINE_WIDTH = 2;
  drawSvg(t, n) {
    if (this.series.hide)
      return;
    const r = P(t).selectAll(Gt(Un.CSS_DASHED_LINE_CLASS)).data([null]).join("g").classed(Un.CSS_DASHED_LINE_CLASS, !0).attr("fill", "none").attr("stroke-width", Un.DASHED_LINE_WIDTH).attr("stroke", this.series.color).attr("stroke-dasharray", "3, 3");
    this.drawSvgLine(r, n), this.drawSvgPointsIfRequested(r.node(), n);
  }
}
function or(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
const Ks = Symbol("implicit");
function ql() {
  var e = new hs(), t = [], n = [], r = Ks;
  function i(a) {
    let s = e.get(a);
    if (s === void 0) {
      if (r !== Ks) return r;
      e.set(a, s = t.push(a) - 1);
    }
    return n[s % n.length];
  }
  return i.domain = function(a) {
    if (!arguments.length) return t.slice();
    t = [], e = new hs();
    for (const s of a)
      e.has(s) || e.set(s, t.push(s) - 1);
    return i;
  }, i.range = function(a) {
    return arguments.length ? (n = Array.from(a), i) : n.slice();
  }, i.unknown = function(a) {
    return arguments.length ? (r = a, i) : r;
  }, i.copy = function() {
    return ql(t, n).unknown(r);
  }, or.apply(i, arguments), i;
}
function Zl() {
  var e = ql().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, a, s, o = !1, c = 0, l = 0, u = 0.5;
  delete e.unknown;
  function h() {
    var d = t().length, f = i < r, m = f ? i : r, y = f ? r : i;
    a = (y - m) / Math.max(1, d - c + l * 2), o && (a = Math.floor(a)), m += (y - m - a * (d - c)) * u, s = a * (1 - c), o && (m = Math.round(m), s = Math.round(s));
    var g = ll(d).map(function(p) {
      return m + a * p;
    });
    return n(f ? g.reverse() : g);
  }
  return e.domain = function(d) {
    return arguments.length ? (t(d), h()) : t();
  }, e.range = function(d) {
    return arguments.length ? ([r, i] = d, r = +r, i = +i, h()) : [r, i];
  }, e.rangeRound = function(d) {
    return [r, i] = d, r = +r, i = +i, o = !0, h();
  }, e.bandwidth = function() {
    return s;
  }, e.step = function() {
    return a;
  }, e.round = function(d) {
    return arguments.length ? (o = !!d, h()) : o;
  }, e.padding = function(d) {
    return arguments.length ? (c = Math.min(1, l = +d), h()) : c;
  }, e.paddingInner = function(d) {
    return arguments.length ? (c = Math.min(1, d), h()) : c;
  }, e.paddingOuter = function(d) {
    return arguments.length ? (l = +d, h()) : l;
  }, e.align = function(d) {
    return arguments.length ? (u = Math.max(0, Math.min(1, d)), h()) : u;
  }, e.copy = function() {
    return Zl(t(), [r, i]).round(o).paddingInner(c).paddingOuter(l).align(u);
  }, or.apply(h(), arguments);
}
function Up(e) {
  return function() {
    return e;
  };
}
function Hp(e) {
  return +e;
}
var Qs = [0, 1];
function Ke(e) {
  return e;
}
function Ta(e, t) {
  return (t -= e = +e) ? function(n) {
    return (n - e) / t;
  } : Up(isNaN(t) ? NaN : 0.5);
}
function zp(e, t) {
  var n;
  return e > t && (n = e, e = t, t = n), function(r) {
    return Math.max(e, Math.min(t, r));
  };
}
function $p(e, t, n) {
  var r = e[0], i = e[1], a = t[0], s = t[1];
  return i < r ? (r = Ta(i, r), a = n(s, a)) : (r = Ta(r, i), a = n(a, s)), function(o) {
    return a(r(o));
  };
}
function Wp(e, t, n) {
  var r = Math.min(e.length, t.length) - 1, i = new Array(r), a = new Array(r), s = -1;
  for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++s < r; )
    i[s] = Ta(e[s], e[s + 1]), a[s] = n(t[s], t[s + 1]);
  return function(o) {
    var c = Cu(e, o, 1, r) - 1;
    return a[c](i[c](o));
  };
}
function za(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Kl() {
  var e = Qs, t = Qs, n = Pe, r, i, a, s = Ke, o, c, l;
  function u() {
    var d = Math.min(e.length, t.length);
    return s !== Ke && (s = zp(e[0], e[d - 1])), o = d > 2 ? Wp : $p, c = l = null, h;
  }
  function h(d) {
    return d == null || isNaN(d = +d) ? a : (c || (c = o(e.map(r), t, n)))(r(s(d)));
  }
  return h.invert = function(d) {
    return s(i((l || (l = o(t, e.map(r), Ft)))(d)));
  }, h.domain = function(d) {
    return arguments.length ? (e = Array.from(d, Hp), u()) : e.slice();
  }, h.range = function(d) {
    return arguments.length ? (t = Array.from(d), u()) : t.slice();
  }, h.rangeRound = function(d) {
    return t = Array.from(d), n = Xd, u();
  }, h.clamp = function(d) {
    return arguments.length ? (s = d ? !0 : Ke, u()) : s !== Ke;
  }, h.interpolate = function(d) {
    return arguments.length ? (n = d, u()) : n;
  }, h.unknown = function(d) {
    return arguments.length ? (a = d, h) : a;
  }, function(d, f) {
    return r = d, i = f, u();
  };
}
function Ql() {
  return Kl()(Ke, Ke);
}
function Yp(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function qr(e, t) {
  if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var n, r = e.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +e.slice(n + 1)
  ];
}
function pn(e) {
  return e = qr(Math.abs(e)), e ? e[1] : NaN;
}
function Gp(e, t) {
  return function(n, r) {
    for (var i = n.length, a = [], s = 0, o = e[0], c = 0; i > 0 && o > 0 && (c + o + 1 > r && (o = Math.max(1, r - c)), a.push(n.substring(i -= o, i + o)), !((c += o + 1) > r)); )
      o = e[s = (s + 1) % e.length];
    return a.reverse().join(t);
  };
}
function Vp(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var Xp = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function jn(e) {
  if (!(t = Xp.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new $a({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10]
  });
}
jn.prototype = $a.prototype;
function $a(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
$a.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function jp(e) {
  t: for (var t = e.length, n = 1, r = -1, i; n < t; ++n)
    switch (e[n]) {
      case ".":
        r = i = n;
        break;
      case "0":
        r === 0 && (r = n), i = n;
        break;
      default:
        if (!+e[n]) break t;
        r > 0 && (r = 0);
        break;
    }
  return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
var Jl;
function qp(e, t) {
  var n = qr(e, t);
  if (!n) return e + "";
  var r = n[0], i = n[1], a = i - (Jl = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, s = r.length;
  return a === s ? r : a > s ? r + new Array(a - s + 1).join("0") : a > 0 ? r.slice(0, a) + "." + r.slice(a) : "0." + new Array(1 - a).join("0") + qr(e, Math.max(0, t + a - 1))[0];
}
function Js(e, t) {
  var n = qr(e, t);
  if (!n) return e + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const to = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: Yp,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => Js(e * 100, t),
  r: Js,
  s: qp,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function eo(e) {
  return e;
}
var no = Array.prototype.map, ro = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function Zp(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? eo : Gp(no.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", a = e.numerals === void 0 ? eo : Vp(no.call(e.numerals, String)), s = e.percent === void 0 ? "%" : e.percent + "", o = e.minus === void 0 ? "−" : e.minus + "", c = e.nan === void 0 ? "NaN" : e.nan + "";
  function l(h) {
    h = jn(h);
    var d = h.fill, f = h.align, m = h.sign, y = h.symbol, g = h.zero, p = h.width, x = h.comma, w = h.precision, v = h.trim, T = h.type;
    T === "n" ? (x = !0, T = "g") : to[T] || (w === void 0 && (w = 12), v = !0, T = "g"), (g || d === "0" && f === "=") && (g = !0, d = "0", f = "=");
    var A = y === "$" ? n : y === "#" && /[boxX]/.test(T) ? "0" + T.toLowerCase() : "", R = y === "$" ? r : /[%p]/.test(T) ? s : "", O = to[T], E = /[defgprs%]/.test(T);
    w = w === void 0 ? 6 : /[gprs]/.test(T) ? Math.max(1, Math.min(21, w)) : Math.max(0, Math.min(20, w));
    function N(_) {
      var D = A, b = R, S, L, M;
      if (T === "c")
        b = O(_) + b, _ = "";
      else {
        _ = +_;
        var k = _ < 0 || 1 / _ < 0;
        if (_ = isNaN(_) ? c : O(Math.abs(_), w), v && (_ = jp(_)), k && +_ == 0 && m !== "+" && (k = !1), D = (k ? m === "(" ? m : o : m === "-" || m === "(" ? "" : m) + D, b = (T === "s" ? ro[8 + Jl / 3] : "") + b + (k && m === "(" ? ")" : ""), E) {
          for (S = -1, L = _.length; ++S < L; )
            if (M = _.charCodeAt(S), 48 > M || M > 57) {
              b = (M === 46 ? i + _.slice(S + 1) : _.slice(S)) + b, _ = _.slice(0, S);
              break;
            }
        }
      }
      x && !g && (_ = t(_, 1 / 0));
      var H = D.length + _.length + b.length, F = H < p ? new Array(p - H + 1).join(d) : "";
      switch (x && g && (_ = t(F + _, F.length ? p - b.length : 1 / 0), F = ""), f) {
        case "<":
          _ = D + _ + b + F;
          break;
        case "=":
          _ = D + F + _ + b;
          break;
        case "^":
          _ = F.slice(0, H = F.length >> 1) + D + _ + b + F.slice(H);
          break;
        default:
          _ = F + D + _ + b;
          break;
      }
      return a(_);
    }
    return N.toString = function() {
      return h + "";
    }, N;
  }
  function u(h, d) {
    var f = l((h = jn(h), h.type = "f", h)), m = Math.max(-8, Math.min(8, Math.floor(pn(d) / 3))) * 3, y = Math.pow(10, -m), g = ro[8 + m / 3];
    return function(p) {
      return f(y * p) + g;
    };
  }
  return {
    format: l,
    formatPrefix: u
  };
}
var mr, Wa, tc;
Kp({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function Kp(e) {
  return mr = Zp(e), Wa = mr.format, tc = mr.formatPrefix, mr;
}
function Qp(e) {
  return Math.max(0, -pn(Math.abs(e)));
}
function Jp(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(pn(t) / 3))) * 3 - pn(Math.abs(e)));
}
function tm(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, pn(t) - pn(e)) + 1;
}
function em(e, t, n, r) {
  var i = ra(e, t, n), a;
  switch (r = jn(r ?? ",f"), r.type) {
    case "s": {
      var s = Math.max(Math.abs(e), Math.abs(t));
      return r.precision == null && !isNaN(a = Jp(i, s)) && (r.precision = a), tc(r, s);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      r.precision == null && !isNaN(a = tm(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = a - (r.type === "e"));
      break;
    }
    case "f":
    case "%": {
      r.precision == null && !isNaN(a = Qp(i)) && (r.precision = a - (r.type === "%") * 2);
      break;
    }
  }
  return Wa(r);
}
function nm(e) {
  var t = e.domain;
  return e.ticks = function(n) {
    var r = t();
    return na(r[0], r[r.length - 1], n ?? 10);
  }, e.tickFormat = function(n, r) {
    var i = t();
    return em(i[0], i[i.length - 1], n ?? 10, r);
  }, e.nice = function(n) {
    n == null && (n = 10);
    var r = t(), i = 0, a = r.length - 1, s = r[i], o = r[a], c, l, u = 10;
    for (o < s && (l = s, s = o, o = l, l = i, i = a, a = l); u-- > 0; ) {
      if (l = ol(s, o, n), l === c)
        return r[i] = s, r[a] = o, t(r);
      if (l > 0)
        s = Math.floor(s / l) * l, o = Math.ceil(o / l) * l;
      else if (l < 0)
        s = Math.ceil(s * l) / l, o = Math.floor(o * l) / l;
      else
        break;
      c = l;
    }
    return e;
  }, e;
}
function Ya() {
  var e = Ql();
  return e.copy = function() {
    return za(e, Ya());
  }, or.apply(e, arguments), nm(e);
}
function ec(e, t) {
  e = e.slice();
  var n = 0, r = e.length - 1, i = e[n], a = e[r], s;
  return a < i && (s = n, n = r, r = s, s = i, i = a, a = s), e[n] = t.floor(i), e[r] = t.ceil(a), e;
}
function io(e) {
  return Math.log(e);
}
function ao(e) {
  return Math.exp(e);
}
function rm(e) {
  return -Math.log(-e);
}
function im(e) {
  return -Math.exp(-e);
}
function am(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function sm(e) {
  return e === 10 ? am : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function om(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function so(e) {
  return (t, n) => -e(-t, n);
}
function lm(e) {
  const t = e(io, ao), n = t.domain;
  let r = 10, i, a;
  function s() {
    return i = om(r), a = sm(r), n()[0] < 0 ? (i = so(i), a = so(a), e(rm, im)) : e(io, ao), t;
  }
  return t.base = function(o) {
    return arguments.length ? (r = +o, s()) : r;
  }, t.domain = function(o) {
    return arguments.length ? (n(o), s()) : n();
  }, t.ticks = (o) => {
    const c = n();
    let l = c[0], u = c[c.length - 1];
    const h = u < l;
    h && ([l, u] = [u, l]);
    let d = i(l), f = i(u), m, y;
    const g = o == null ? 10 : +o;
    let p = [];
    if (!(r % 1) && f - d < g) {
      if (d = Math.floor(d), f = Math.ceil(f), l > 0) {
        for (; d <= f; ++d)
          for (m = 1; m < r; ++m)
            if (y = d < 0 ? m / a(-d) : m * a(d), !(y < l)) {
              if (y > u) break;
              p.push(y);
            }
      } else for (; d <= f; ++d)
        for (m = r - 1; m >= 1; --m)
          if (y = d > 0 ? m / a(-d) : m * a(d), !(y < l)) {
            if (y > u) break;
            p.push(y);
          }
      p.length * 2 < g && (p = na(l, u, g));
    } else
      p = na(d, f, Math.min(f - d, g)).map(a);
    return h ? p.reverse() : p;
  }, t.tickFormat = (o, c) => {
    if (o == null && (o = 10), c == null && (c = r === 10 ? "s" : ","), typeof c != "function" && (!(r % 1) && (c = jn(c)).precision == null && (c.trim = !0), c = Wa(c)), o === 1 / 0) return c;
    const l = Math.max(1, r * o / t.ticks().length);
    return (u) => {
      let h = u / a(Math.round(i(u)));
      return h * r < r - 0.5 && (h *= r), h <= l ? c(u) : "";
    };
  }, t.nice = () => n(ec(n(), {
    floor: (o) => a(Math.floor(i(o))),
    ceil: (o) => a(Math.ceil(i(o)))
  })), t;
}
function nc() {
  const e = lm(Kl()).domain([1, 10]);
  return e.copy = () => za(e, nc()).base(e.base()), or.apply(e, arguments), e;
}
const Ri = /* @__PURE__ */ new Date(), Li = /* @__PURE__ */ new Date();
function bt(e, t, n, r) {
  function i(a) {
    return e(a = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+a)), a;
  }
  return i.floor = (a) => (e(a = /* @__PURE__ */ new Date(+a)), a), i.ceil = (a) => (e(a = new Date(a - 1)), t(a, 1), e(a), a), i.round = (a) => {
    const s = i(a), o = i.ceil(a);
    return a - s < o - a ? s : o;
  }, i.offset = (a, s) => (t(a = /* @__PURE__ */ new Date(+a), s == null ? 1 : Math.floor(s)), a), i.range = (a, s, o) => {
    const c = [];
    if (a = i.ceil(a), o = o == null ? 1 : Math.floor(o), !(a < s) || !(o > 0)) return c;
    let l;
    do
      c.push(l = /* @__PURE__ */ new Date(+a)), t(a, o), e(a);
    while (l < a && a < s);
    return c;
  }, i.filter = (a) => bt((s) => {
    if (s >= s) for (; e(s), !a(s); ) s.setTime(s - 1);
  }, (s, o) => {
    if (s >= s)
      if (o < 0) for (; ++o <= 0; )
        for (; t(s, -1), !a(s); )
          ;
      else for (; --o >= 0; )
        for (; t(s, 1), !a(s); )
          ;
  }), n && (i.count = (a, s) => (Ri.setTime(+a), Li.setTime(+s), e(Ri), e(Li), Math.floor(n(Ri, Li))), i.every = (a) => (a = Math.floor(a), !isFinite(a) || !(a > 0) ? null : a > 1 ? i.filter(r ? (s) => r(s) % a === 0 : (s) => i.count(0, s) % a === 0) : i)), i;
}
const Zr = bt(() => {
}, (e, t) => {
  e.setTime(+e + t);
}, (e, t) => t - e);
Zr.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? bt((t) => {
  t.setTime(Math.floor(t / e) * e);
}, (t, n) => {
  t.setTime(+t + n * e);
}, (t, n) => (n - t) / e) : Zr);
Zr.range;
const ue = 1e3, Wt = ue * 60, he = Wt * 60, ye = he * 24, Ga = ye * 7, oo = ye * 30, ki = ye * 365, Qe = bt((e) => {
  e.setTime(e - e.getMilliseconds());
}, (e, t) => {
  e.setTime(+e + t * ue);
}, (e, t) => (t - e) / ue, (e) => e.getUTCSeconds());
Qe.range;
const Va = bt((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * ue);
}, (e, t) => {
  e.setTime(+e + t * Wt);
}, (e, t) => (t - e) / Wt, (e) => e.getMinutes());
Va.range;
const cm = bt((e) => {
  e.setUTCSeconds(0, 0);
}, (e, t) => {
  e.setTime(+e + t * Wt);
}, (e, t) => (t - e) / Wt, (e) => e.getUTCMinutes());
cm.range;
const Xa = bt((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * ue - e.getMinutes() * Wt);
}, (e, t) => {
  e.setTime(+e + t * he);
}, (e, t) => (t - e) / he, (e) => e.getHours());
Xa.range;
const um = bt((e) => {
  e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
  e.setTime(+e + t * he);
}, (e, t) => (t - e) / he, (e) => e.getUTCHours());
um.range;
const lr = bt(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Wt) / ye,
  (e) => e.getDate() - 1
);
lr.range;
const ja = bt((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / ye, (e) => e.getUTCDate() - 1);
ja.range;
const hm = bt((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / ye, (e) => Math.floor(e / ye));
hm.range;
function We(e) {
  return bt((t) => {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, (t, n) => {
    t.setDate(t.getDate() + n * 7);
  }, (t, n) => (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * Wt) / Ga);
}
const fi = We(0), Kr = We(1), dm = We(2), fm = We(3), mn = We(4), gm = We(5), pm = We(6);
fi.range;
Kr.range;
dm.range;
fm.range;
mn.range;
gm.range;
pm.range;
function Ye(e) {
  return bt((t) => {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, (t, n) => {
    t.setUTCDate(t.getUTCDate() + n * 7);
  }, (t, n) => (n - t) / Ga);
}
const rc = Ye(0), Qr = Ye(1), mm = Ye(2), ym = Ye(3), yn = Ye(4), vm = Ye(5), Sm = Ye(6);
rc.range;
Qr.range;
mm.range;
ym.range;
yn.range;
vm.range;
Sm.range;
const qa = bt((e) => {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
qa.range;
const xm = bt((e) => {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
xm.range;
const ve = bt((e) => {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
ve.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : bt((t) => {
  t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, n) => {
  t.setFullYear(t.getFullYear() + n * e);
});
ve.range;
const ze = bt((e) => {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
ze.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : bt((t) => {
  t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, n) => {
  t.setUTCFullYear(t.getUTCFullYear() + n * e);
});
ze.range;
function wm(e, t, n, r, i, a) {
  const s = [
    [Qe, 1, ue],
    [Qe, 5, 5 * ue],
    [Qe, 15, 15 * ue],
    [Qe, 30, 30 * ue],
    [a, 1, Wt],
    [a, 5, 5 * Wt],
    [a, 15, 15 * Wt],
    [a, 30, 30 * Wt],
    [i, 1, he],
    [i, 3, 3 * he],
    [i, 6, 6 * he],
    [i, 12, 12 * he],
    [r, 1, ye],
    [r, 2, 2 * ye],
    [n, 1, Ga],
    [t, 1, oo],
    [t, 3, 3 * oo],
    [e, 1, ki]
  ];
  function o(l, u, h) {
    const d = u < l;
    d && ([l, u] = [u, l]);
    const f = h && typeof h.range == "function" ? h : c(l, u, h), m = f ? f.range(l, +u + 1) : [];
    return d ? m.reverse() : m;
  }
  function c(l, u, h) {
    const d = Math.abs(u - l) / h, f = er(([, , g]) => g).right(s, d);
    if (f === s.length) return e.every(ra(l / ki, u / ki, h));
    if (f === 0) return Zr.every(Math.max(ra(l, u, h), 1));
    const [m, y] = s[d / s[f - 1][2] < s[f][2] / d ? f - 1 : f];
    return m.every(y);
  }
  return [o, c];
}
const [bm, Tm] = wm(ve, qa, fi, lr, Xa, Va);
function Ii(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Oi(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function Tn(e, t, n) {
  return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
}
function Am(e) {
  var t = e.dateTime, n = e.date, r = e.time, i = e.periods, a = e.days, s = e.shortDays, o = e.months, c = e.shortMonths, l = An(i), u = Dn(i), h = An(a), d = Dn(a), f = An(s), m = Dn(s), y = An(o), g = Dn(o), p = An(c), x = Dn(c), w = {
    a: k,
    A: H,
    b: F,
    B: U,
    c: null,
    d: go,
    e: go,
    f: Xm,
    g: r0,
    G: a0,
    H: Ym,
    I: Gm,
    j: Vm,
    L: ic,
    m: jm,
    M: qm,
    p: W,
    q: X,
    Q: yo,
    s: vo,
    S: Zm,
    u: Km,
    U: Qm,
    V: Jm,
    w: t0,
    W: e0,
    x: null,
    X: null,
    y: n0,
    Y: i0,
    Z: s0,
    "%": mo
  }, v = {
    a: Q,
    A: Z,
    b: et,
    B: ut,
    c: null,
    d: po,
    e: po,
    f: u0,
    g: x0,
    G: b0,
    H: o0,
    I: l0,
    j: c0,
    L: sc,
    m: h0,
    M: d0,
    p: J,
    q: mt,
    Q: yo,
    s: vo,
    S: f0,
    u: g0,
    U: p0,
    V: m0,
    w: y0,
    W: v0,
    x: null,
    X: null,
    y: S0,
    Y: w0,
    Z: T0,
    "%": mo
  }, T = {
    a: N,
    A: _,
    b: D,
    B: b,
    c: S,
    d: ho,
    e: ho,
    f: Hm,
    g: uo,
    G: co,
    H: fo,
    I: fo,
    j: Bm,
    L: Um,
    m: Om,
    M: Pm,
    p: E,
    q: Im,
    Q: $m,
    s: Wm,
    S: Fm,
    u: Em,
    U: Nm,
    V: Rm,
    w: _m,
    W: Lm,
    x: L,
    X: M,
    y: uo,
    Y: co,
    Z: km,
    "%": zm
  };
  w.x = A(n, w), w.X = A(r, w), w.c = A(t, w), v.x = A(n, v), v.X = A(r, v), v.c = A(t, v);
  function A(z, K) {
    return function(q) {
      var I = [], rt = -1, nt = 0, gt = z.length, at, $, tt;
      for (q instanceof Date || (q = /* @__PURE__ */ new Date(+q)); ++rt < gt; )
        z.charCodeAt(rt) === 37 && (I.push(z.slice(nt, rt)), ($ = lo[at = z.charAt(++rt)]) != null ? at = z.charAt(++rt) : $ = at === "e" ? " " : "0", (tt = K[at]) && (at = tt(q, $)), I.push(at), nt = rt + 1);
      return I.push(z.slice(nt, rt)), I.join("");
    };
  }
  function R(z, K) {
    return function(q) {
      var I = Tn(1900, void 0, 1), rt = O(I, z, q += "", 0), nt, gt;
      if (rt != q.length) return null;
      if ("Q" in I) return new Date(I.Q);
      if ("s" in I) return new Date(I.s * 1e3 + ("L" in I ? I.L : 0));
      if (K && !("Z" in I) && (I.Z = 0), "p" in I && (I.H = I.H % 12 + I.p * 12), I.m === void 0 && (I.m = "q" in I ? I.q : 0), "V" in I) {
        if (I.V < 1 || I.V > 53) return null;
        "w" in I || (I.w = 1), "Z" in I ? (nt = Oi(Tn(I.y, 0, 1)), gt = nt.getUTCDay(), nt = gt > 4 || gt === 0 ? Qr.ceil(nt) : Qr(nt), nt = ja.offset(nt, (I.V - 1) * 7), I.y = nt.getUTCFullYear(), I.m = nt.getUTCMonth(), I.d = nt.getUTCDate() + (I.w + 6) % 7) : (nt = Ii(Tn(I.y, 0, 1)), gt = nt.getDay(), nt = gt > 4 || gt === 0 ? Kr.ceil(nt) : Kr(nt), nt = lr.offset(nt, (I.V - 1) * 7), I.y = nt.getFullYear(), I.m = nt.getMonth(), I.d = nt.getDate() + (I.w + 6) % 7);
      } else ("W" in I || "U" in I) && ("w" in I || (I.w = "u" in I ? I.u % 7 : "W" in I ? 1 : 0), gt = "Z" in I ? Oi(Tn(I.y, 0, 1)).getUTCDay() : Ii(Tn(I.y, 0, 1)).getDay(), I.m = 0, I.d = "W" in I ? (I.w + 6) % 7 + I.W * 7 - (gt + 5) % 7 : I.w + I.U * 7 - (gt + 6) % 7);
      return "Z" in I ? (I.H += I.Z / 100 | 0, I.M += I.Z % 100, Oi(I)) : Ii(I);
    };
  }
  function O(z, K, q, I) {
    for (var rt = 0, nt = K.length, gt = q.length, at, $; rt < nt; ) {
      if (I >= gt) return -1;
      if (at = K.charCodeAt(rt++), at === 37) {
        if (at = K.charAt(rt++), $ = T[at in lo ? K.charAt(rt++) : at], !$ || (I = $(z, q, I)) < 0) return -1;
      } else if (at != q.charCodeAt(I++))
        return -1;
    }
    return I;
  }
  function E(z, K, q) {
    var I = l.exec(K.slice(q));
    return I ? (z.p = u.get(I[0].toLowerCase()), q + I[0].length) : -1;
  }
  function N(z, K, q) {
    var I = f.exec(K.slice(q));
    return I ? (z.w = m.get(I[0].toLowerCase()), q + I[0].length) : -1;
  }
  function _(z, K, q) {
    var I = h.exec(K.slice(q));
    return I ? (z.w = d.get(I[0].toLowerCase()), q + I[0].length) : -1;
  }
  function D(z, K, q) {
    var I = p.exec(K.slice(q));
    return I ? (z.m = x.get(I[0].toLowerCase()), q + I[0].length) : -1;
  }
  function b(z, K, q) {
    var I = y.exec(K.slice(q));
    return I ? (z.m = g.get(I[0].toLowerCase()), q + I[0].length) : -1;
  }
  function S(z, K, q) {
    return O(z, t, K, q);
  }
  function L(z, K, q) {
    return O(z, n, K, q);
  }
  function M(z, K, q) {
    return O(z, r, K, q);
  }
  function k(z) {
    return s[z.getDay()];
  }
  function H(z) {
    return a[z.getDay()];
  }
  function F(z) {
    return c[z.getMonth()];
  }
  function U(z) {
    return o[z.getMonth()];
  }
  function W(z) {
    return i[+(z.getHours() >= 12)];
  }
  function X(z) {
    return 1 + ~~(z.getMonth() / 3);
  }
  function Q(z) {
    return s[z.getUTCDay()];
  }
  function Z(z) {
    return a[z.getUTCDay()];
  }
  function et(z) {
    return c[z.getUTCMonth()];
  }
  function ut(z) {
    return o[z.getUTCMonth()];
  }
  function J(z) {
    return i[+(z.getUTCHours() >= 12)];
  }
  function mt(z) {
    return 1 + ~~(z.getUTCMonth() / 3);
  }
  return {
    format: function(z) {
      var K = A(z += "", w);
      return K.toString = function() {
        return z;
      }, K;
    },
    parse: function(z) {
      var K = R(z += "", !1);
      return K.toString = function() {
        return z;
      }, K;
    },
    utcFormat: function(z) {
      var K = A(z += "", v);
      return K.toString = function() {
        return z;
      }, K;
    },
    utcParse: function(z) {
      var K = R(z += "", !0);
      return K.toString = function() {
        return z;
      }, K;
    }
  };
}
var lo = { "-": "", _: " ", 0: "0" }, Tt = /^\s*\d+/, Dm = /^%/, Mm = /[\\^$*+?|[\]().{}]/g;
function st(e, t, n) {
  var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", a = i.length;
  return r + (a < n ? new Array(n - a + 1).join(t) + i : i);
}
function Cm(e) {
  return e.replace(Mm, "\\$&");
}
function An(e) {
  return new RegExp("^(?:" + e.map(Cm).join("|") + ")", "i");
}
function Dn(e) {
  return new Map(e.map((t, n) => [t.toLowerCase(), n]));
}
function _m(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 1));
  return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function Em(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 1));
  return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function Nm(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function Rm(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function Lm(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function co(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 4));
  return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function uo(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function km(e, t, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
  return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function Im(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 1));
  return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function Om(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function ho(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function Bm(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 3));
  return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function fo(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function Pm(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function Fm(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 2));
  return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function Um(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 3));
  return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function Hm(e, t, n) {
  var r = Tt.exec(t.slice(n, n + 6));
  return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function zm(e, t, n) {
  var r = Dm.exec(t.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function $m(e, t, n) {
  var r = Tt.exec(t.slice(n));
  return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function Wm(e, t, n) {
  var r = Tt.exec(t.slice(n));
  return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function go(e, t) {
  return st(e.getDate(), t, 2);
}
function Ym(e, t) {
  return st(e.getHours(), t, 2);
}
function Gm(e, t) {
  return st(e.getHours() % 12 || 12, t, 2);
}
function Vm(e, t) {
  return st(1 + lr.count(ve(e), e), t, 3);
}
function ic(e, t) {
  return st(e.getMilliseconds(), t, 3);
}
function Xm(e, t) {
  return ic(e, t) + "000";
}
function jm(e, t) {
  return st(e.getMonth() + 1, t, 2);
}
function qm(e, t) {
  return st(e.getMinutes(), t, 2);
}
function Zm(e, t) {
  return st(e.getSeconds(), t, 2);
}
function Km(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function Qm(e, t) {
  return st(fi.count(ve(e) - 1, e), t, 2);
}
function ac(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? mn(e) : mn.ceil(e);
}
function Jm(e, t) {
  return e = ac(e), st(mn.count(ve(e), e) + (ve(e).getDay() === 4), t, 2);
}
function t0(e) {
  return e.getDay();
}
function e0(e, t) {
  return st(Kr.count(ve(e) - 1, e), t, 2);
}
function n0(e, t) {
  return st(e.getFullYear() % 100, t, 2);
}
function r0(e, t) {
  return e = ac(e), st(e.getFullYear() % 100, t, 2);
}
function i0(e, t) {
  return st(e.getFullYear() % 1e4, t, 4);
}
function a0(e, t) {
  var n = e.getDay();
  return e = n >= 4 || n === 0 ? mn(e) : mn.ceil(e), st(e.getFullYear() % 1e4, t, 4);
}
function s0(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + st(t / 60 | 0, "0", 2) + st(t % 60, "0", 2);
}
function po(e, t) {
  return st(e.getUTCDate(), t, 2);
}
function o0(e, t) {
  return st(e.getUTCHours(), t, 2);
}
function l0(e, t) {
  return st(e.getUTCHours() % 12 || 12, t, 2);
}
function c0(e, t) {
  return st(1 + ja.count(ze(e), e), t, 3);
}
function sc(e, t) {
  return st(e.getUTCMilliseconds(), t, 3);
}
function u0(e, t) {
  return sc(e, t) + "000";
}
function h0(e, t) {
  return st(e.getUTCMonth() + 1, t, 2);
}
function d0(e, t) {
  return st(e.getUTCMinutes(), t, 2);
}
function f0(e, t) {
  return st(e.getUTCSeconds(), t, 2);
}
function g0(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function p0(e, t) {
  return st(rc.count(ze(e) - 1, e), t, 2);
}
function oc(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? yn(e) : yn.ceil(e);
}
function m0(e, t) {
  return e = oc(e), st(yn.count(ze(e), e) + (ze(e).getUTCDay() === 4), t, 2);
}
function y0(e) {
  return e.getUTCDay();
}
function v0(e, t) {
  return st(Qr.count(ze(e) - 1, e), t, 2);
}
function S0(e, t) {
  return st(e.getUTCFullYear() % 100, t, 2);
}
function x0(e, t) {
  return e = oc(e), st(e.getUTCFullYear() % 100, t, 2);
}
function w0(e, t) {
  return st(e.getUTCFullYear() % 1e4, t, 4);
}
function b0(e, t) {
  var n = e.getUTCDay();
  return e = n >= 4 || n === 0 ? yn(e) : yn.ceil(e), st(e.getUTCFullYear() % 1e4, t, 4);
}
function T0() {
  return "+0000";
}
function mo() {
  return "%";
}
function yo(e) {
  return +e;
}
function vo(e) {
  return Math.floor(+e / 1e3);
}
var Xe, lc;
A0({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function A0(e) {
  return Xe = Am(e), lc = Xe.format, Xe.parse, Xe.utcFormat, Xe.utcParse, Xe;
}
function D0(e) {
  return new Date(e);
}
function M0(e) {
  return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function cc(e, t, n, r, i, a, s, o, c, l) {
  var u = Ql(), h = u.invert, d = u.domain, f = l(".%L"), m = l(":%S"), y = l("%I:%M"), g = l("%I %p"), p = l("%a %d"), x = l("%b %d"), w = l("%B"), v = l("%Y");
  function T(A) {
    return (c(A) < A ? f : o(A) < A ? m : s(A) < A ? y : a(A) < A ? g : r(A) < A ? i(A) < A ? p : x : n(A) < A ? w : v)(A);
  }
  return u.invert = function(A) {
    return new Date(h(A));
  }, u.domain = function(A) {
    return arguments.length ? d(Array.from(A, M0)) : d().map(D0);
  }, u.ticks = function(A) {
    var R = d();
    return e(R[0], R[R.length - 1], A ?? 10);
  }, u.tickFormat = function(A, R) {
    return R == null ? T : l(R);
  }, u.nice = function(A) {
    var R = d();
    return (!A || typeof A.range != "function") && (A = t(R[0], R[R.length - 1], A ?? 10)), A ? d(ec(R, A)) : u;
  }, u.copy = function() {
    return za(u, cc(e, t, n, r, i, a, s, o, c, l));
  }, u;
}
function C0() {
  return or.apply(cc(bm, Tm, ve, qa, fi, lr, Xa, Va, Qe, lc).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
class uc {
  constructor(t, n) {
    this.axisType = t, this.initData = n, this.dataAccessor = n.dataAccessor, this.buildScale();
  }
  d3Implementation;
  dataAccessor;
  transformData(t) {
    return this.transformDomain(this.getValueFromData(t));
  }
  getValueFromData(t) {
    return this.dataAccessor(t);
  }
  transformToTooltipAnchor(t) {
    return this.transformDomain(this.getValueFromData(t));
  }
  getRangeStart() {
    return this.d3Implementation ? this.d3Implementation.range()[0] : 0;
  }
  getRangeEnd() {
    return this.d3Implementation ? this.d3Implementation.range()[1] : 0;
  }
  getStartBandwidthAdjustment() {
    return 0;
  }
  getGroupedColumnSeriesPosition(t) {
    if (t.stacking)
      return 0;
    const n = this.initData.allSeriesAndBandSeries.filter(
      (a) => a.type === t.type
    ), r = n.some((a) => a.stacking), i = n.filter((a) => !a.stacking).findIndex((a) => a === t);
    return r ? i + 1 : i;
  }
  getGroupedColumnSeriesLength(t) {
    const n = this.initData.allSeriesAndBandSeries.filter(
      (i) => i.type === t.type
    );
    return n.some((i) => i.stacking) ? n.filter((i) => !i.stacking).length + 1 : n.length;
  }
  isShowColumnRounding(t) {
    if (t.stacking) {
      const n = this.initData.allSeriesAndBandSeries.filter(
        (r) => r.type === t.type
      );
      return t === Go(n.filter((r) => r.stacking));
    }
    return !0;
  }
  buildScale() {
    try {
      const t = this.getEmptyScale();
      this.d3Implementation = t, this.setDomain(), this.setRange();
    } catch (t) {
      throw console.error(
        "[CartesianScale] ERROR in buildScale():",
        t,
        t instanceof Error ? t.stack : ""
      ), t;
    }
  }
  buildRange() {
    switch (this.axisType) {
      case G.Y:
        return [this.initData.bounds.startY, this.initData.bounds.endY];
      case G.X:
      default:
        return [this.initData.bounds.startX, this.initData.bounds.endX];
    }
  }
}
class _0 extends uc {
  getScaleType() {
    return xt.Band;
  }
  transformDomain(t) {
    return this.d3Implementation ? this.d3Implementation(t) : 0;
  }
  transformToTooltipAnchor(t) {
    return this.transformDomain(this.getValueFromData(t)) + this.getBandwidth() / 2;
  }
  getTickFormatter() {
    return (t) => t;
  }
  getBandwidth() {
    return this.d3Implementation ? this.d3Implementation.bandwidth() : 1;
  }
  transformDataOrigin() {
    return this.getRangeStart();
  }
  setDomain() {
    this.d3Implementation.domain(
      Hn(
        this.initData.allSeriesAndBandSeries.flatMap((t) => t.data).map((t) => this.getValueFromData(t))
      )
    );
  }
  setRange() {
    this.d3Implementation.range(this.buildRange());
  }
  getEmptyScale() {
    return Zl().paddingInner(0.4).paddingOuter(0.1).align(1);
  }
  invert(t) {
    return t;
  }
}
class hc extends Ca {
  constructor(t = {}) {
    super(t);
  }
  tryCoerceSingleValue(t) {
    return t;
  }
}
class E0 extends Ca {
  constructor(t = {}) {
    super(t);
  }
  tryCoerceSingleValue(t) {
    if (typeof t == "number" && !isNaN(t))
      return t;
    if (typeof t == "object" && t !== null) {
      const n = t.valueOf();
      if (typeof n != "object")
        return this.tryCoerceSingleValue(n);
    }
    if (typeof t == "string") {
      const n = Number(t);
      if (!isNaN(n))
        return n;
    }
  }
}
const N0 = new $e(), R0 = new E0(), L0 = new hc({
  useSelf: !1,
  extractObjectKeys: ["y", "value"],
  extractArrayIndices: [1]
}), k0 = new hc({
  useSelf: !1,
  extractObjectKeys: ["x", "timestamp", "name"],
  extractArrayIndices: [0]
}), I0 = (e) => {
  const t = L0.coerce(e);
  if (t === void 0)
    throw Error("Data is unknown shape");
  return t;
}, O0 = (e) => {
  const t = k0.coerce(e);
  if (t === void 0)
    throw Error("Data is unknown shape");
  return t;
}, B0 = (e) => N0.canCoerce(e) ? xt.Time : R0.canCoerce(e) ? xt.Linear : xt.Band;
class Za extends uc {
  getBandwidth() {
    const t = this.getClosestDistance(), n = Math.min(this.getTickDistance(), t), r = Math.max(n * 0.4, 2), i = n - r;
    return i > 0 ? i : 1;
  }
  getMinMax() {
    const t = this.getDataValues(), n = this.getMinAndMaxFromData(
      t,
      this.initData.seriesState
    ), r = [
      this.initData.min,
      this.initData.max
    ];
    return us([...r, ...n]);
  }
  getMinAndMaxFromData(t, n) {
    const r = t;
    (this.axisType === G.Y || this.axisType === G.X && n && De(this.initData.allSeriesAndBandSeries)) && r.push(0), n && (this.axisType === G.Y || this.axisType === G.X && De(this.initData.allSeriesAndBandSeries)) && r.push(n.getMaxValue());
    const [i, a] = us(r), s = i === void 0 ? 0 : i, o = a === void 0 || a.valueOf() === 0 ? 1 : a;
    return [s, o];
  }
  getDataValues() {
    return Hn(
      this.initData.allSeriesAndBandSeries.flatMap((t) => t.data).map((t) => this.getValueFromData(t))
    );
  }
  getClosestDistance() {
    return Math.min(
      ...Rc(
        Hn(
          this.initData.allSeriesAndBandSeries.flatMap((t) => t.data).map((t) => this.transformData(t))
        ).sort((t, n) => t - n).map(
          (t, n, r) => n !== 0 ? t - r[n - 1] : void 0
        )
      )
    );
  }
}
class re {
  static STANDARD_VALUES = [
    { minimumValue: 1e3, suffix: "K", unitValue: 1e3 },
    { minimumValue: 1e6, suffix: "M", unitValue: 1e6 },
    { minimumValue: 1e9, suffix: "B", unitValue: 1e9 },
    { minimumValue: 1e12, suffix: "T", unitValue: 1e12 }
  ];
  static DEFAULT_THRESHOLD = {
    minimumValue: -1 / 0,
    suffix: "",
    unitValue: 1
  };
  static DEFAULT_OPTIONS = {
    trailingUnscaledDigits: 1,
    trailingScaledDigits: 1,
    trimTrailingZeros: !0,
    thresholds: [...re.STANDARD_VALUES]
  };
  options;
  constructor(t = {}) {
    this.options = this.applyOptionDefaults(t);
  }
  format(t) {
    const n = this.findAppropriateThreshold(t);
    return this.convertNumberToString(t, n);
  }
  applyOptionDefaults(t) {
    const n = ni(
      Lc(t),
      re.DEFAULT_OPTIONS
    );
    return n.thresholds.sort(
      (r, i) => r.minimumValue - i.minimumValue
    ), n;
  }
  findAppropriateThreshold(t) {
    const n = this.options.thresholds.findIndex(
      (r) => r.minimumValue > t
    );
    return n === -1 ? this.options.thresholds[this.options.thresholds.length - 1] : n === 0 ? re.DEFAULT_THRESHOLD : this.options.thresholds[n - 1];
  }
  convertToScaledNumberForThreshold(t, n) {
    return t / n.unitValue;
  }
  convertNumberToString(t, n) {
    const r = this.getNumberOfDigitsForThreshold(n), i = this.convertToScaledNumberForThreshold(
      t,
      n
    ), a = this.roundToDecimalPlaces(i, r);
    return `${this.options.trimTrailingZeros ? `${a}` : a.toFixed(r)}${n.suffix}`;
  }
  getNumberOfDigitsForThreshold(t) {
    return t.unitValue === 1 ? this.options.trailingUnscaledDigits : this.options.trailingScaledDigits;
  }
  roundToDecimalPlaces(t, n) {
    const r = +`${t}e${n}`, i = isNaN(r) ? t * Math.pow(10, n) : r;
    return +`${Math.round(i)}e-${n}`;
  }
}
const P0 = new re({
  trailingScaledDigits: 2,
  trailingUnscaledDigits: 0,
  trimTrailingZeros: !1
}), F0 = new re({
  trailingScaledDigits: 2,
  trailingUnscaledDigits: 2,
  trimTrailingZeros: !1
});
class U0 extends Za {
  numberFormatter = new re();
  getScaleType() {
    return xt.Linear;
  }
  transformDomain(t) {
    return this.d3Implementation ? this.d3Implementation(t) : 0;
  }
  getTickFormatter() {
    return (t) => this.numberFormatter.format(t.valueOf());
  }
  getTickDistance() {
    if (!this.d3Implementation)
      return 1;
    const t = this.d3Implementation.ticks(), n = t.length;
    return this.d3Implementation(t[n - 1]) - this.d3Implementation(t[n - 2]);
  }
  transformDataOrigin(t) {
    if (this.initData.seriesState && (this.axisType === G.Y || this.axisType === G.X && De(this.initData.allSeriesAndBandSeries))) {
      const n = this.initData.seriesState.getBaseline(t);
      if (n !== void 0)
        return this.transformDomain(n);
    }
    return this.getRangeStart();
  }
  setDomain() {
    const t = this.getMinMax();
    this.d3Implementation.domain(t).nice();
  }
  setRange() {
    this.d3Implementation.range(this.buildRange());
  }
  getEmptyScale() {
    return Ya();
  }
  invert(t) {
    return this.d3Implementation ? this.d3Implementation.invert(t) : 0;
  }
  transformToTooltipAnchor(t) {
    const n = this.initData.seriesState && this.initData.allSeriesAndBandSeries.some(
      (i) => i.type === pt.Column || i.type === pt.Bar
    ), r = this.initData.seriesState?.getBaseline?.(t);
    return r && n && (this.axisType === G.Y || this.axisType === G.X && De(this.initData.allSeriesAndBandSeries)) ? this.transformDomain(r) - (this.getRangeStart() - this.transformData(t)) : super.transformToTooltipAnchor(t);
  }
}
class Jr extends Za {
  numberFormatter = new re();
  // Minimum value for log scale (cannot be 0 or negative)
  static MIN_LOG_VALUE = 0.1;
  getScaleType() {
    return xt.Log;
  }
  transformDomain(t) {
    if (!this.d3Implementation)
      return 0;
    const n = Math.max(t, Jr.MIN_LOG_VALUE);
    return this.d3Implementation(n);
  }
  getTickFormatter() {
    return (t) => this.numberFormatter.format(t.valueOf());
  }
  getTickDistance() {
    if (!this.d3Implementation)
      return 1;
    const t = this.d3Implementation.ticks(), n = t.length;
    return n < 2 ? 1 : this.d3Implementation(t[n - 1]) - this.d3Implementation(t[n - 2]);
  }
  transformDataOrigin(t) {
    if (this.initData.seriesState && (this.axisType === G.Y || this.axisType === G.X && De(this.initData.allSeriesAndBandSeries))) {
      const n = this.initData.seriesState.getBaseline(t);
      if (n !== void 0)
        return this.transformDomain(n);
    }
    return this.getRangeStart();
  }
  setDomain() {
    const t = this.getMinMax(), n = Math.max(
      t[0].valueOf(),
      Jr.MIN_LOG_VALUE
    ), r = Math.max(t[1].valueOf(), n * 10);
    this.d3Implementation.domain([n, r]).nice();
  }
  setRange() {
    this.d3Implementation.range(this.buildRange());
  }
  getEmptyScale() {
    return nc().clamp(!0);
  }
  invert(t) {
    return this.d3Implementation ? this.d3Implementation.invert(t) : 0;
  }
  transformToTooltipAnchor(t) {
    const n = this.initData.seriesState && this.initData.allSeriesAndBandSeries.some(
      (i) => i.type === pt.Column || i.type === pt.Bar
    ), r = this.initData.seriesState?.getBaseline?.(t);
    return r && n && (this.axisType === G.Y || this.axisType === G.X && De(this.initData.allSeriesAndBandSeries)) ? this.transformDomain(r) - (this.getRangeStart() - this.transformData(t)) : super.transformToTooltipAnchor(t);
  }
}
class H0 extends Za {
  getScaleType() {
    return xt.Time;
  }
  transformDomain(t) {
    return this.d3Implementation ? this.d3Implementation(t) : 0;
  }
  getTickFormatter() {
    const t = this.getFormatter();
    return (n) => t.format(n);
  }
  transformDataOrigin() {
    return this.getRangeStart();
  }
  getStartBandwidthAdjustment() {
    return -this.getBandwidth() / 2;
  }
  getFormatter() {
    if (!this.d3Implementation)
      return new ke({ mode: Ot.DateOnlyAndTime });
    const t = this.d3Implementation.ticks();
    if (t.length === 0)
      return new ke({ mode: Ot.DateOnlyAndTime });
    const n = this.determineOptimalFormatMode(t);
    return new ke({ mode: n });
  }
  /**
   * Determines the optimal format mode by checking which level of granularity
   * is needed to make all tick labels unique
   */
  determineOptimalFormatMode(t) {
    if (t.length < 2)
      return this.inferFormatFromDateRange();
    const n = [
      Ot.MonthAndDayOnly,
      // "Jan 16"
      Ot.DateOnlyAndTime,
      // "16 Jan 11:00 AM"
      Ot.DateWithYearAndTime,
      // "16 Jan 1990 11:00 AM"
      Ot.DateAndTimeWithSeconds
      // "1990-01-16 11:00:00 AM"
    ];
    for (const r of n)
      if (this.areLabelsUnique(t, r))
        return r;
    return Ot.DateAndTimeWithSeconds;
  }
  /**
   * Infer the best format based on the date range when we can't check for duplicates
   */
  inferFormatFromDateRange() {
    if (!this.d3Implementation)
      return Ot.DateOnlyAndTime;
    const [t, n] = this.d3Implementation.domain(), r = n.getTime() - t.getTime(), i = 3600 * 1e3, a = 24 * i, s = 7 * a;
    return r < i ? Ot.DateAndTimeWithSeconds : r < a || r < s ? Ot.DateOnlyAndTime : Ot.MonthAndDayOnly;
  }
  /**
   * Checks if all tick labels would be unique with the given format mode
   */
  areLabelsUnique(t, n) {
    const r = new ke({ mode: n }), i = /* @__PURE__ */ new Set();
    for (const a of t) {
      const s = r.format(a);
      if (i.has(s))
        return !1;
      i.add(s);
    }
    return !0;
  }
  getTickDistance() {
    if (!this.d3Implementation)
      return 1;
    const t = this.d3Implementation.ticks(), n = this.d3Implementation.range();
    return (n[1] - n[0]) / t.length;
  }
  setDomain() {
    const t = this.getMinMax();
    this.d3Implementation.domain(t);
  }
  setRange() {
    const t = this.buildRange(), r = this.initData.allSeriesAndBandSeries.some(
      (i) => i.stacking && i.type === pt.Column
    ) ? 1 : this.initData.allSeriesAndBandSeries.filter(
      (i) => i.type === pt.Column
    ).length;
    this.d3Implementation.rangeRound([
      t[0] + _t.MAX_COLUMN_WIDTH / 2 * r,
      t[1] - _t.MAX_COLUMN_WIDTH / 2 * r
    ]);
  }
  getEmptyScale() {
    return C0();
  }
  invert(t) {
    return this.d3Implementation ? this.d3Implementation.invert(t) : /* @__PURE__ */ new Date();
  }
}
class z0 {
  constructor(t, n, r) {
    this.stackingSeriesList = t, this.xDataAccessor = n, this.yDataAccessor = r, this.transformToStackData();
  }
  baselineMap = /* @__PURE__ */ new Map();
  maxValue = 0;
  getBaseline(t) {
    return this.baselineMap.get(t);
  }
  getMaxValue() {
    return this.maxValue;
  }
  transformToStackData() {
    const t = this.buildDataMap(), n = this.buildMergedSeriesData(t), r = Array.from(t.keys()).sort(
      (s, o) => s - o
    ), i = /* @__PURE__ */ new Map();
    r.forEach((s, o) => {
      i.set(s, o);
    });
    const a = sp().keys(this.stackingSeriesList.map((s) => s.name)).order(xa).offset(Sa)(n);
    this.stackingSeriesList.forEach((s, o) => {
      s.data.forEach((c) => {
        let l = 0, u = 0;
        const h = s.type === pt.Bar ? this.yDataAccessor(c).valueOf() : this.xDataAccessor(c).valueOf(), d = i.get(h);
        d !== void 0 && !isNaN(a[o][d][1]) && !pe(a[o][d][1]) && !isNaN(a[o][d][0]) && !pe(a[o][d][0]) && (l = a[o][d][0], u = a[o][d][1]), this.baselineMap.set(c, l), this.maxValue = Math.max(this.maxValue, u);
      });
    });
  }
  buildDataMap() {
    const t = /* @__PURE__ */ new Map();
    return this.stackingSeriesList.forEach(
      (n) => n.data.forEach((r) => {
        let i;
        const a = n.type === pt.Bar ? this.yDataAccessor(r).valueOf() : this.xDataAccessor(r).valueOf();
        t.has(a) ? i = t.get(a) : (i = {}, t.set(a, i)), i[`${n.name}`] = n.type === pt.Bar ? this.xDataAccessor(r) : this.yDataAccessor(r);
      })
    ), t;
  }
  buildMergedSeriesData(t) {
    const n = [];
    return Array.from(t.keys()).sort((r, i) => r - i).forEach((r) => {
      n.push(t.get(r));
    }), n;
  }
}
class ln {
  constructor(t = {}) {
    this.scaleState = t;
  }
  static newBuilder() {
    return new ln();
  }
  withScaleType(t) {
    return this.cloneWith({ scaleType: t });
  }
  withDefaultXRange(t) {
    return this.cloneWith({ defaultXMinMax: t });
  }
  withDefaultYRange(t) {
    return this.cloneWith({ defaultYMinMax: t });
  }
  withAxis(t) {
    switch (t.type) {
      case G.Y:
        return this.cloneWith({ yAxis: t }).cloneWith({
          yDataAccessor: t.dataAccessor ?? this.getDataAccessor(t.type)
        });
      case G.X:
      default:
        return this.cloneWith({ xAxis: t }).cloneWith({
          xDataAccessor: t.dataAccessor ?? this.getDataAccessor(t.type)
        });
    }
  }
  withXDataAccessor(t) {
    return this.cloneWith({ xDataAccessor: t });
  }
  withYDataAccessor(t) {
    return this.cloneWith({ yDataAccessor: t });
  }
  withSeries(t) {
    return this.cloneWith({ series: t });
  }
  withBands(t) {
    return this.cloneWith({ bands: t });
  }
  withBounds(t) {
    return this.cloneWith({ bounds: t });
  }
  build(t) {
    const n = this.buildScaleInitData(t);
    switch (this.getScaleType(t)) {
      case xt.Band:
        return new _0(t, n);
      case xt.Time:
        return new H0(t, n);
      case xt.Log:
        return new Jr(t, n);
      case xt.Linear:
      default:
        return new U0(t, n);
    }
  }
  buildScaleInitData(t) {
    const n = this.buildSeriesState(t);
    return {
      ...this.resolveMinMax(t),
      bounds: this.bounds,
      dataAccessor: this.getDataAccessorForDomain(t),
      allSeriesAndBandSeries: this.allSeriesAndBandSeries,
      seriesState: n
    };
  }
  getDataAccessorForDomain(t) {
    return this.getDataAccessor(t);
  }
  getDataAccessor(t) {
    return t === G.X ? this.getXDataAccessor() : this.getYDataAccessor();
  }
  getXDataAccessor() {
    return this.scaleState.xDataAccessor ? this.scaleState.xDataAccessor : O0;
  }
  getYDataAccessor() {
    return this.scaleState.yDataAccessor ? this.scaleState.yDataAccessor : I0;
  }
  getScaleType(t) {
    if (this.scaleState.scaleType !== void 0)
      return this.scaleState.scaleType;
    const n = this.getAxis(t);
    return n && n.scale !== void 0 ? n.scale : B0(this.getFirstDataValue(t));
  }
  getFirstDataValue(t) {
    return this.data.map(this.getDataAccessor(t)).filter((n) => n !== void 0)[0];
  }
  buildSeriesState(t) {
    return this.buildStackingState();
  }
  buildStackingState() {
    const t = this.allSeriesAndBandSeries.filter(
      (n) => n.stacking
    );
    if (t.length > 0) {
      const n = this.getXDataAccessor(), r = this.getYDataAccessor();
      return new z0(
        t,
        n,
        r
      );
    }
  }
  getAxis(t) {
    switch (t) {
      case G.Y:
        return this.scaleState.yAxis;
      case G.X:
      default:
        return this.scaleState.xAxis;
    }
  }
  resolveMinMax(t) {
    const n = this.getAxis(t), r = this.getDefaultMinMax(t), i = n && n.min, a = n && n.max;
    return {
      min: i !== void 0 ? i : r && r.min,
      max: a !== void 0 ? a : r && r.max
    };
  }
  getDefaultMinMax(t) {
    switch (t) {
      case G.Y:
        return this.scaleState.defaultYMinMax;
      case G.X:
        return this.scaleState.defaultXMinMax;
      default:
        Bn(t);
    }
  }
  get bounds() {
    return this.scaleState.bounds !== void 0 ? this.scaleState.bounds : {
      startX: 0,
      endX: 0,
      startY: 0,
      endY: 0
    };
  }
  get allSeriesAndBandSeries() {
    const t = this.scaleState.series !== void 0 ? this.scaleState.series.filter((r) => !r.hide) : [], n = this.scaleState.bands !== void 0 ? this.scaleState.bands.filter((r) => !r.hide).flatMap((r) => [r.upper, r.lower]) : [];
    return [...t, ...n];
  }
  get data() {
    const t = this.scaleState.series !== void 0 ? this.scaleState.series.flatMap((r) => r.data) : [], n = this.scaleState.bands !== void 0 ? this.scaleState.bands.flatMap(
      (r) => [r.lower.data, r.upper.data].flat()
    ) : [];
    return [...t, ...n];
  }
  cloneWith(t) {
    return new ln({
      ...this.scaleState,
      ...t
    });
  }
}
class $0 {
  constructor(t, n = qe.Auto, r, i) {
    this.hostElement = t, this.renderingStrategy = n, this.groupId = r, this.padding = this.getPadding(i);
    const a = new sr();
    this.d3Utils = new xn(), this.svgUtilService = new Sn(
      a,
      this.d3Utils
    ), this.addAndReturnCartesianScaleBuilder(jt);
  }
  // Updated on draw
  chartContainerElement;
  chartBackgroundSvgElement;
  dataElement;
  mouseEventContainer;
  allSeriesData = [];
  allCartesianData = [];
  renderedAxes = [];
  scaleBuilders = [];
  scaleBuildersIndexMapper = /* @__PURE__ */ new Map();
  padding;
  // Services - instantiated internally
  svgUtilService;
  d3Utils;
  // User configuration
  legendPosition;
  legendElement;
  timeRange;
  requestedAxes = [];
  series = [];
  bands = [];
  eventListeners = [];
  dataClickActionHandler;
  // Callbacks for framework integration
  tooltipCallback;
  legendCallbacks;
  downsamplingConfig;
  // Active series tracking (for legend filtering)
  activeSeries = [];
  // RAF throttle for mousemove
  pendingMouseMoveFrame = null;
  getCartesianScaleBuilder(t = jt) {
    const n = this.scaleBuildersIndexMapper.get(t);
    if (cr(n)) {
      const r = this.scaleBuildersIndexMapper.get(
        jt
      );
      return cr(r) ? ln.newBuilder() : this.scaleBuilders[r];
    }
    return this.scaleBuilders[n];
  }
  addAndReturnCartesianScaleBuilder(t, n) {
    const r = this.scaleBuilders.length;
    return cr(n) ? (this.scaleBuilders.push(ln.newBuilder()), this.scaleBuildersIndexMapper.set(t, r), this.scaleBuilders[r]) : (this.scaleBuilders.push(n), this.scaleBuildersIndexMapper.set(t, r), this.scaleBuilders[r]);
  }
  updateCartesianScaleBuilder(t, n) {
    const r = this.scaleBuildersIndexMapper.get(t);
    if (cr(r)) {
      this.scaleBuildersIndexMapper.set(t, this.scaleBuilders.length), this.scaleBuilders.push(n);
      return;
    }
    this.scaleBuilders[r] = n;
  }
  resetCartesianScales() {
    this.scaleBuilders = [], this.scaleBuildersIndexMapper.clear(), this.addAndReturnCartesianScaleBuilder(jt);
  }
  updateScaleBuilderWithExistingData() {
    this.resetCartesianScales(), this.updateScaleBuildersWithSeries(this.activeSeries), this.updateScaleBuildersWithBands(this.bands), this.updateScaleBuildersWithAxes(this.requestedAxes), this.updateScaleBuildersWithTimeRange(this.timeRange), this.scaleBuilders = this.scaleBuilders.map(
      (t) => t.withBounds(this.buildScaleBounds())
    );
  }
  showCrosshair(t, n) {
    if (n.length > 0) {
      const r = n[0].location, i = this.allSeriesData.flatMap(
        (a) => a.dataForLocation({ x: r.x, y: r.y })
      );
      this.renderedAxes.forEach(
        (a) => a.onMouseMove(t, i)
      );
    }
  }
  hideCrosshair() {
    this.renderedAxes.forEach((t) => t.onMouseLeave());
  }
  getDataAccessor(t) {
    return this.getCartesianScaleBuilder().getDataAccessorForDomain(t);
  }
  onBrushSelection(t) {
    t.selection && this.eventListeners.forEach((n) => {
      if (n.event === Jt.Select) {
        const { height: r } = this.mouseEventContainer.getBoundingClientRect(), [i, a] = t.selection, s = this.allSeriesData[0].getXAxisValue(i), o = this.allSeriesData[0].getXAxisValue(a), c = this.allSeriesData.flatMap(
          (m) => m.dataForLocation({ x: i, y: r })
        ), l = this.allSeriesData.flatMap(
          (m) => m.dataForLocation({ x: a, y: r })
        ), u = s instanceof Date ? s : new Date(s), h = o instanceof Date ? o : new Date(o), f = {
          timeRange: {
            startTime: u,
            endTime: h,
            toUrlString: () => `${u.getTime()}-${h.getTime()}`,
            toDisplayString: () => `${u.toLocaleString()} - ${h.toLocaleString()}`,
            isCustom: () => !0,
            toDurationMillis: () => h.getTime() - u.getTime()
          },
          selectedData: [c[0], l[0]],
          location: {
            x: t.sourceEvent.clientX,
            y: t.sourceEvent.clientY
          }
        };
        n.onEvent(f);
      }
    });
  }
  destroy() {
    return this.clear(), this;
  }
  /**
   * Clear all registered axes so they can be reconfigured via withAxis().
   * This prevents accumulation when the chart is reconfigured without being recreated.
   */
  clearAxes() {
    return this.requestedAxes.length = 0, this;
  }
  /**
   * Clear all registered event listeners so they can be reconfigured via withEventListener().
   * This prevents accumulation when the chart is reconfigured without being recreated.
   */
  clearEventListeners() {
    return this.eventListeners.length = 0, this;
  }
  clearDownsampling() {
    return this.downsamplingConfig = void 0, this;
  }
  draw() {
    return this.drawContainer(), this.updateData(), this;
  }
  isDrawn() {
    return !!this.chartBackgroundSvgElement;
  }
  withLegend(t, n) {
    return this.legendPosition = t, this.legendElement = n, this;
  }
  withSeries(...t) {
    return this.series.length = 0, this.series.push(...t), this.activeSeries = [...t.filter((n) => !n.disabled)], this.updateScaleBuildersWithSeries(t), this;
  }
  /**
   * Update active series (called from legend interaction)
   */
  setActiveSeries(t) {
    return this.activeSeries = t, this.redrawVisualization(), this;
  }
  /**
   * Get current active series
   */
  getActiveSeries() {
    return this.activeSeries;
  }
  updateScaleBuildersWithSeries(t) {
    const n = Vo(
      t,
      (r) => r.yAxisName ?? jt
    );
    kc(n, (r, i) => {
      this.addAndReturnCartesianScaleBuilder(
        i,
        ln.newBuilder().withSeries(r)
      );
    }), this.updateCartesianScaleBuilder(
      jt,
      this.getCartesianScaleBuilder().withSeries(t)
    );
  }
  withBands(...t) {
    return this.bands.length = 0, this.bands.push(...t), this.updateScaleBuildersWithBands(t), this;
  }
  updateScaleBuildersWithBands(t) {
    this.scaleBuilders = this.scaleBuilders.map(
      (n) => n.withBands(t)
    );
  }
  withEventListener(t, n) {
    return this.eventListeners.push({
      event: t,
      onEvent: n
    }), this;
  }
  withDataClickAction(t) {
    return this.dataClickActionHandler = t, this;
  }
  withAxis(t) {
    return this.requestedAxes.push(t), this.updateScaleBuildersWithAxes([t]), this;
  }
  updateScaleBuildersWithAxes(t) {
    t.forEach((n) => {
      n.name && this.updateCartesianScaleBuilder(
        n.name,
        this.getCartesianScaleBuilder(n.name).withAxis(n)
      ), this.updateCartesianScaleBuilder(
        jt,
        this.getCartesianScaleBuilder().withAxis(n)
      );
    });
  }
  withTooltip(t) {
    return this.tooltipCallback = t, this;
  }
  withTimeRange(t) {
    return this.timeRange = t, this.updateScaleBuildersWithTimeRange(t), this;
  }
  withDownsampling(t) {
    return this.downsamplingConfig = t, this;
  }
  updateScaleBuildersWithTimeRange(t) {
    t && (this.scaleBuilders = this.scaleBuilders.map(
      (n) => n.withDefaultXRange({
        min: t.startTime.getTime(),
        max: t.endTime.getTime()
      })
    ));
  }
  drawData() {
    switch (this.renderingStrategy) {
      case qe.Canvas:
        this.drawDataCanvas(this.buildCanvasContext());
        break;
      case qe.Auto:
      case qe.Svg:
      default:
        this.drawDataSvg();
    }
  }
  drawDataSvg() {
    const t = this.calculateRange(G.X), n = this.calculateRange(G.Y);
    this.dataElement = P(this.chartBackgroundSvgElement).selectAll(".data-layer").data([null]).join("g").classed("data-layer", !0).node();
    let r = P(this.dataElement).select("rect").node();
    r || (r = P(this.dataElement).append("rect").style("position", "absolute").attr("fill", "transparent").node()), P(r).attr("width", Math.abs(t[1] - t[0])).attr("height", Math.abs(n[1] - n[0])).attr("x", t[0]).attr("y", n[1]);
    const i = P(this.dataElement).selectAll(`.${gs}`).data(this.allCartesianData, (a) => a.getUniqueCartesianDataKey());
    i.exit().transition().duration(Yt).attr("opacity", 0).each(
      (a, s, o) => a.drawSvg(o[s], ge.Exit)
    ).remove(), i.each(
      (a, s, o) => a.drawSvg(o[s], ge.Update)
    ), i.enter().append("g").classed(gs, !0).attr("opacity", 0).transition().duration(Yt).attr("opacity", 1).each(
      (a, s, o) => a.drawSvg(o[s], ge.Enter)
    );
  }
  drawDataCanvas(t) {
    this.allCartesianData.forEach(
      (n) => n.drawCanvas(t)
    );
  }
  getChartBox() {
    const t = this.hostElement.getBoundingClientRect();
    return {
      top: 0,
      left: 0,
      width: t.width,
      height: t.height
    };
  }
  calculateRange(t) {
    const { width: n, height: r } = this.getChartBox(), i = this.getXAxes(), a = this.getYAxes();
    let s = 0, o = 0;
    switch (t) {
      case G.Y: {
        const c = i.filter((u) => u.location === ot.Top).reduce(
          (u, h) => u + (h.size ?? yt.DEFAULT_X_AXIS_HEIGHT),
          0
        ), l = i.filter((u) => u.location === ot.Bottom).reduce(
          (u, h) => u + (h.size ?? yt.DEFAULT_Y_AXIS_WIDTH),
          0
        );
        s = r - (this.padding.bottom + l), o = this.padding.top + c;
        break;
      }
      default:
      case G.X: {
        const c = a.filter((u) => u.location === ot.Left).reduce(
          (u, h) => u + (h.size ?? yt.DEFAULT_Y_AXIS_WIDTH),
          0
        ), l = a.filter((u) => u.location === ot.Right).reduce(
          (u, h) => u + (h.size ?? yt.DEFAULT_Y_AXIS_WIDTH),
          0
        );
        s = this.padding.left + c, o = n - this.padding.right - l;
        break;
      }
    }
    return [s, o];
  }
  setupEventListeners() {
    if (!this.mouseEventContainer || !this.dataElement)
      return;
    const t = P(this.mouseEventContainer);
    t.on("mousemove", (n) => {
      this.pendingMouseMoveFrame === null && (this.pendingMouseMoveFrame = requestAnimationFrame(() => {
        this.pendingMouseMoveFrame = null, this.onMouseMove(n);
      }));
    }).on("mouseleave", () => this.onMouseLeave()), this.eventListeners.forEach((n) => {
      switch (n.event) {
        case Jt.Select:
          this.attachBrush();
          break;
        default:
          t.on(
            this.getNativeEventName(n.event),
            (r) => {
              n.onEvent(this.getMouseDataForCurrentEvent(r).data);
            }
          );
          break;
      }
    });
  }
  clear() {
    this.pendingMouseMoveFrame !== null && (cancelAnimationFrame(this.pendingMouseMoveFrame), this.pendingMouseMoveFrame = null), this.chartContainerElement && (P(this.chartContainerElement).remove(), this.chartContainerElement = void 0);
  }
  getPadding(t) {
    return Or({}, t, {
      top: 4,
      left: 4,
      bottom: 4,
      right: 40
    });
  }
  updateData() {
    this.updateScaleBuilderWithExistingData(), this.drawVisualizations();
  }
  drawVisualizations() {
    this.buildVisualizations(), this.drawChartBackground(), this.drawAxes(), this.drawData(), this.addNoDataMessageIfNeeded(), this.moveDataOnTopOfAxes(), this.drawMouseEventContainer(), this.setupEventListeners();
  }
  attachBrush() {
    const t = Tg().on(
      "end",
      (a) => this.onBrushSelection(a)
    );
    if (!this.mouseEventContainer)
      return;
    const n = this.calculateRange(G.X), r = this.calculateRange(G.Y);
    t.extent([
      [n[0], r[1]],
      [n[1], r[0]]
    ]);
    const i = P(this.mouseEventContainer).selectAll(".brush").data([null]).join("g").classed("brush", !0).node();
    P(i).call(t);
  }
  redrawVisualization() {
    P(this.chartContainerElement).selectAll(
      `.${vi}`
    ).nodes().length > 0 && (this.updateScaleBuilderWithExistingData(), this.drawVisualizations());
  }
  moveDataOnTopOfAxes() {
    this.dataElement && this.dataElement.parentNode.appendChild(this.dataElement);
  }
  drawContainer() {
    this.chartContainerElement = P(this.hostElement).selectAll(".main-div").data([null]).join("div").style("position", "relative").style("width", "100%").style("height", "100%").classed("main-div", !0).node();
  }
  getXAxes() {
    return this.requestedAxes.filter((t) => t.type === G.X);
  }
  getYAxes() {
    return this.requestedAxes.filter((t) => t.type === G.Y);
  }
  drawAxes() {
    if (!this.chartBackgroundSvgElement)
      return;
    this.renderedAxes = this.requestedAxes.map(
      (n) => new yt(
        n,
        this.getCartesianScaleBuilder(n.name),
        this.svgUtilService
      )
    );
    const t = P(this.chartBackgroundSvgElement).selectAll(".axis-group").data(this.renderedAxes, (n) => n.getAxisKey());
    t.exit().remove(), t.each((n, r, i) => n.draw(i[r])), t.enter().append("g").classed("axis-group", !0).each((n, r, i) => n.draw(i[r]));
  }
  addNoDataMessageIfNeeded() {
    this.chartBackgroundSvgElement && new ce(
      this.chartBackgroundSvgElement,
      this.activeSeries
    ).updateMessage();
  }
  drawChartBackground() {
    if (!this.chartContainerElement)
      return;
    const t = this.getChartBox();
    this.chartBackgroundSvgElement = P(this.chartContainerElement).selectAll(Gt(vi)).data([null]).join("svg").classed(vi, !0).classed("viz-font-family", !0).attr("width", `${t.width}px`).attr("height", `${t.height}px`).style("top", `${t.top}px`).style("left", `${t.left}px`).style("position", "absolute").style("overflow", "visible").node();
  }
  buildCanvasContext() {
    const t = this.getChartBox(), n = P(this.chartContainerElement).append("canvas").style("position", "absolute").attr("width", t.width).attr("height", t.height).style("top", `${t.top}px`).style("left", `${t.left}px`).node(), r = n.getContext("2d");
    return r.clearRect(0, 0, n.width, n.height), this.dataElement = n, r;
  }
  drawMouseEventContainer() {
    this.dataElement && (this.mouseEventContainer = this.dataElement);
  }
  getMouseDataForCurrentEvent(t) {
    if (!this.dataElement)
      return { data: [] };
    const n = Et(t, this.dataElement), r = { x: n[0], y: n[1] }, i = this.allSeriesData.flatMap((a) => a.dataForLocation(r)).filter((a) => !a.context.hideTooltip);
    if (i.length > 0) {
      const s = this.getTooltipTrackingStrategy().followSingleAxis === G.Y, o = s ? G.Y : G.X, c = this.getDataAccessor(o), l = s ? r.y : r.x, u = i.reduce((g, p) => {
        const x = s ? g.location.y : g.location.x, w = s ? p.location.y : p.location.x, v = Math.abs(x - l);
        return Math.abs(w - l) < v ? p : g;
      }), h = c(u.dataPoint), d = i.filter((g) => {
        const p = c(g.dataPoint);
        return h instanceof Date && p instanceof Date ? h.getTime() === p.getTime() : h === p;
      }), f = s ? G.X : G.Y, m = this.getDataAccessor(f), y = [...d].sort((g, p) => {
        const x = m(g.dataPoint), w = m(p.dataPoint);
        return (typeof w == "number" ? w : 0) - (typeof x == "number" ? x : 0);
      });
      return {
        relativeMouseLocation: r,
        data: y
      };
    }
    return {
      relativeMouseLocation: r,
      data: i
    };
  }
  getNativeEventName(t) {
    switch (t) {
      case Jt.Click:
        return "click";
      case Jt.DoubleClick:
        return "dblclick";
      case Jt.RightClick:
        return "contextmenu";
      case Jt.Select:
        return "select";
      default:
        return "";
    }
  }
  buildVisualizations() {
    let t = this.activeSeries, n = this.bands;
    this.downsamplingConfig && (t = this.getDownsampledSeries(t), n = this.getDownsampledBands(n)), this.allSeriesData = [
      ...t.map(
        (r) => this.getChartSeriesVisualization(
          r,
          this.getCartesianScaleBuilder(r.yAxisName)
        )
      ),
      ...n.flatMap((r) => [
        this.getChartSeriesVisualization(
          r.upper,
          this.getCartesianScaleBuilder()
        ),
        this.getChartSeriesVisualization(
          r.lower,
          this.getCartesianScaleBuilder()
        )
      ])
    ], this.allCartesianData = [
      ...n.map(
        (r) => new we(
          this.d3Utils,
          r,
          this.getCartesianScaleBuilder(),
          this.getTooltipTrackingStrategy()
        )
      ),
      ...this.allSeriesData
    ];
  }
  downsampleData(t, n) {
    if (t.length <= n)
      return t;
    const r = this.getCartesianScaleBuilder(), i = r.getDataAccessorForDomain(G.X), a = r.getDataAccessorForDomain(G.Y);
    return Cg(t, n, (o) => {
      const c = i(o);
      return c instanceof Date ? c.getTime() : Number(c);
    }, a);
  }
  getDownsampledSeries(t) {
    if (!this.downsamplingConfig)
      return t;
    const { dataPointLimit: n } = this.downsamplingConfig;
    return t.map(
      (r) => r.data.length <= n ? r : { ...r, data: this.downsampleData(r.data, n) }
    );
  }
  getDownsampledBands(t) {
    if (!this.downsamplingConfig)
      return t;
    const { dataPointLimit: n } = this.downsamplingConfig;
    return t.map((r) => ({
      ...r,
      upper: {
        ...r.upper,
        data: this.downsampleData(r.upper.data, n)
      },
      lower: {
        ...r.lower,
        data: this.downsampleData(r.lower.data, n)
      }
    }));
  }
  getChartSeriesVisualization(t, n) {
    switch (t.type) {
      case pt.Area:
        return new jr(
          t,
          n,
          this.getTooltipTrackingStrategy()
        );
      case pt.Scatter:
        return new Me(
          t,
          n,
          this.getTooltipTrackingStrategy()
        );
      case pt.Column:
        return new _t(
          t,
          n,
          this.getTooltipTrackingStrategy(),
          this.dataClickActionHandler
        );
      case pt.Bar:
        return new be(
          t,
          n,
          this.getTooltipTrackingStrategy(),
          this.dataClickActionHandler
        );
      case pt.DashedLine:
        return new Un(
          t,
          n,
          this.getTooltipTrackingStrategy()
        );
      case pt.Line:
      default:
        return new le(
          t,
          n,
          this.getTooltipTrackingStrategy()
        );
    }
  }
  buildScaleBounds() {
    const [t, n] = this.calculateRange(G.X), [r, i] = this.calculateRange(G.Y);
    return {
      startX: t,
      endX: n,
      startY: r,
      endY: i
    };
  }
  getTooltipTrackingStrategy() {
    return {
      followSingleAxis: this.series.some(
        (n) => n.type === pt.Bar
      ) ? G.Y : G.X
    };
  }
  onMouseMove(t) {
    const n = this.getMouseDataForCurrentEvent(t);
    this.eventListeners.forEach((r) => {
      r.event === Jt.Hover && r.onEvent(n.data, t);
    }), this.tooltipCallback && n.data.length && this.tooltipCallback.show(
      this.chartBackgroundSvgElement,
      n.data,
      n.relativeMouseLocation ?? n.data[0].location,
      t
    ), this.renderedAxes.forEach(
      (r) => r.onMouseMove(t, n.data)
    );
  }
  onMouseLeave() {
    this.pendingMouseMoveFrame !== null && (cancelAnimationFrame(this.pendingMouseMoveFrame), this.pendingMouseMoveFrame = null), this.tooltipCallback && this.tooltipCallback.hide(), this.eventListeners.forEach((t) => {
      t.event === Jt.MouseLeave && t.onEvent();
    }), this.hideCrosshair();
  }
}
function W0(e) {
  const {
    chartContainerRef: t,
    legendContainerRef: n,
    strategy: r,
    groupId: i,
    padding: a,
    visibleSeries: s,
    bands: o,
    enableTooltips: c,
    convertToTooltipRenderData: l,
    tooltipShowWithData: u,
    tooltipHide: h,
    dataClickAction: d,
    onDataPointClick: f,
    rangeSelectionEnabled: m,
    onSelectionChange: y,
    showXAxis: g,
    showYAxis: p,
    getXAxis: x,
    getYAxes: w,
    timeRange: v,
    legend: T,
    downsampling: A
  } = e, [R, O] = St(null), [E, N] = St(null);
  wt(() => {
    if (!t.current) return;
    const D = t.current, b = new $0(
      D,
      r,
      i,
      a
    );
    return O(b), () => {
      b.destroy(), O(null);
    };
  }, [t, r, i, a]), wt(() => {
    if (!(!R || !t.current)) {
      N(null);
      try {
        R.clearAxes(), R.clearEventListeners(), g && R.withAxis(x()), p && w().forEach((D) => {
          R.withAxis(D);
        }), R.withSeries(...s), o && o.length > 0 && R.withBands(...o), c && R.withTooltip({
          show: (D, b, S, L) => {
            const M = l(
              b,
              R
            );
            M && u(
              D,
              [
                {
                  dataPoint: M,
                  context: {},
                  location: S
                }
              ],
              { x: L.clientX, y: L.clientY },
              {
                type: ee.FollowMouse,
                boundingElement: D,
                offsetX: L.clientX,
                offsetY: L.clientY
              }
            );
          },
          hide: () => {
            h();
          }
        }), (d || f) && R.withDataClickAction(
          (D, b) => {
            f && f(D, b), d?.onClick && d.onClick(D, b);
          }
        ), m && y && R.withEventListener(Jt.Select, (D) => {
          y(
            D
          );
        }), v && R.withTimeRange(v), T !== B.None && n.current && R.withLegend(T, n.current), R.draw();
      } catch (D) {
        console.error("Error rendering cartesian chart:", D), N(D instanceof Error ? D.message : "Unknown error");
      }
    }
  }, [
    t,
    n,
    R,
    s,
    o,
    c,
    l,
    u,
    h,
    d,
    f,
    m,
    y,
    g,
    p,
    x,
    w,
    v,
    T
  ]), wt(() => {
    R?.clearDownsampling(), A && R?.withDownsampling(A);
  }, [A, R]);
  const _ = Y(() => {
    R?.isDrawn() && R.draw();
  }, [R]);
  return vn(t, _), { error: E };
}
function Y0(e) {
  switch (e) {
    case B.Bottom:
      return {
        legendPosition: B.Bottom,
        legendLayout: dt.Row
      };
    case B.Right:
      return {
        legendPosition: B.Right,
        legendLayout: dt.Row
      };
    case B.TopRight:
      return {
        legendPosition: B.TopRight,
        legendLayout: dt.Row
      };
    case B.TopLeft:
      return {
        legendPosition: B.TopLeft,
        legendLayout: dt.Row
      };
    case B.Top:
      return {
        legendPosition: B.Top,
        legendLayout: dt.Row
      };
    case B.Left:
      return {
        legendPosition: B.Left,
        legendLayout: dt.Row
      };
    case B.None:
      return {
        legendPosition: B.None,
        legendLayout: dt.Row
      };
    case B.Auto:
    default:
      return {
        legendPosition: B.Bottom,
        legendLayout: dt.Row
      };
  }
}
function G0(e) {
  switch (e) {
    case B.Top:
    case B.TopLeft:
    case B.TopRight:
      return "flex flex-col";
    // Legend at TOP
    case B.Bottom:
    case B.Right:
    case B.Left:
    default:
      return "flex flex-col-reverse";
  }
}
function XS({
  series: e,
  bands: t,
  xAxisOption: n,
  yAxisOption: r,
  showYAxis: i = !1,
  showXAxis: a = !0,
  legend: s = B.Bottom,
  strategy: o = qe.Auto,
  timeRange: c,
  rangeSelectionEnabled: l = !1,
  selectableInterval: u = !1,
  intervalOptions: h,
  selectedInterval: d,
  groupId: f,
  tooltipClickAction: m,
  padding: y,
  dataClickAction: g,
  onIntervalChange: p,
  onSelectionChange: x,
  onDataPointClick: w,
  colorPalette: v = ul,
  enableTooltips: T = !0,
  enableCrosshairs: A = !0,
  downsampling: R
}) {
  const O = lt(null), E = lt(null), [N, _] = St(/* @__PURE__ */ new Set()), [D, b] = St(d), S = ft(() => new $e(), []), L = ft(
    () => new ke({ mode: Ot.DateAndTimeWithSeconds }),
    []
  ), M = ft(
    () => new Ht(v),
    [v]
  ), k = Y(
    (q) => q[0]?.dataPoint,
    []
  ), { showWithData: H, hide: F } = ai(k, ii), U = ft(() => {
    if (!e) return [];
    const q = De(e), I = M.getColorPalette().forNColors(e.length);
    return (q ? [...e].reverse() : e).map(
      (rt, nt) => ({
        ...rt,
        color: rt.color ?? I[nt]
      })
    );
  }, [e, M]), W = ft(() => U.filter((q) => !N.has(q.name)), [U, N]), X = Y(() => ni(n, {
    type: G.X,
    location: ot.Bottom,
    axisLine: !0,
    gridLines: !0,
    crosshair: A ? {
      enable: !0,
      snap: !0
    } : void 0
  }), [n, A]), Q = Y(() => {
    const q = {
      type: G.Y,
      location: ot.Left,
      tickLabels: !0,
      axisLine: !0,
      crosshair: A ? {
        enable: !0,
        snap: !0
      } : void 0
    }, I = ($) => !$ || en($) ? [q] : ("left" in $ ? [
      $.left,
      $.right
    ] : [$]).map((tt) => ({
      ...q,
      ...tt
    })), rt = () => U.length ? Hn(
      U.map(
        ($) => $.yAxisName ?? jt
      )
    ) : [jt], nt = I(r), gt = rt(), at = nt.filter(
      ($) => gt.includes($.name ?? jt)
    );
    if (gt.forEach(($) => {
      if (!at.some(
        (tt) => (tt.name ?? jt) === $
      )) {
        const tt = at.some(
          (zt) => zt.location === ot.Left
        ) ? ot.Right : ot.Left;
        at.push({ ...q, name: $, location: tt });
      }
    }), at.length > 2 && (console.warn(
      `A maximum of two different yAxis options are allowed, but ${at.length} were provided`
    ), at.splice(2)), at.length === 2) {
      const [$, tt] = at;
      $.location === tt.location && (console.warn("Both axes cannot be placed on the same side."), at[1].location = $.location === ot.Left ? ot.Right : ot.Left);
    }
    return at;
  }, [r, U, A]), Z = Y(
    (q, I) => {
      if (q.length === 0)
        return;
      const rt = I.getDataAccessor(G.X), nt = I.getDataAccessor(G.Y), gt = De(U), at = () => {
        const tt = q[0];
        if (tt.context.getTooltipTitle)
          return tt.context.getTooltipTitle(tt.dataPoint);
        const zt = gt ? nt(tt.dataPoint) : rt(tt.dataPoint), vt = S.coerce(zt);
        return vt ? L.format(vt) : String(zt);
      }, $ = Object.entries(
        Vo(
          q,
          (tt) => tt.context.groupName ?? tt.context.displayName ?? tt.context.name
        )
      ).map(([tt, zt]) => ({
        title: tt,
        labeledValues: zt.map((vt) => ({
          label: vt.context.displayName ?? vt.context.name,
          value: gt ? rt(vt.dataPoint) : nt(vt.dataPoint),
          units: vt.context.units,
          color: vt.context.getColor?.(vt.dataPoint) ?? vt.context.color,
          dataPoint: vt.dataPoint,
          context: vt.context
        }))
      }));
      return {
        chartType: q[0].context.type,
        title: at(),
        groups: $,
        config: {
          titleAction: m,
          dataAction: g
        }
      };
    },
    [
      U,
      S,
      L,
      m,
      g
    ]
  ), et = ft(() => {
    if (s === B.None || !U.length) return null;
    const { legendPosition: q, legendLayout: I } = Y0(s);
    return {
      position: q,
      layout: I,
      fontSize: tr.Small,
      series: U.map((rt) => ({
        name: rt.displayName || rt.name,
        color: rt.legendColor || rt.color,
        disabled: N.has(rt.name),
        data: {
          value: rt.summary?.value,
          displayValue: rt.summary?.displayValue
        }
      })),
      interactionHandler: {
        onClick: (rt) => {
          const nt = U.find(
            (gt) => (gt.displayName || gt.name) === rt.name
          );
          nt && _((gt) => {
            const at = new Set(gt);
            return at.has(nt.name) ? at.delete(nt.name) : at.add(nt.name), at;
          });
        }
      }
    };
  }, [U, s, N]), ut = Y(
    (q) => {
      b(q), p?.(q);
    },
    [p]
  ), { error: J } = W0({
    chartContainerRef: O,
    legendContainerRef: E,
    strategy: o,
    groupId: f,
    padding: y,
    visibleSeries: W,
    bands: t,
    enableTooltips: T,
    convertToTooltipRenderData: Z,
    tooltipShowWithData: H,
    tooltipHide: F,
    dataClickAction: g,
    onDataPointClick: w,
    rangeSelectionEnabled: l,
    onSelectionChange: x,
    showXAxis: a,
    showYAxis: i,
    getXAxis: X,
    getYAxes: Q,
    timeRange: c,
    legend: s,
    downsampling: R
  });
  if (J)
    return /* @__PURE__ */ C("div", { className: "flex items-center justify-center h-full p-4 text-center", children: /* @__PURE__ */ V("div", { children: [
      /* @__PURE__ */ C("p", { className: "text-red-500 font-semibold", children: "Chart Rendering Error" }),
      /* @__PURE__ */ C("p", { className: "text-sm text-cn-foreground-3 mt-2", children: J })
    ] }) });
  const mt = s !== B.None && et, z = G0(s), K = () => {
    switch (s) {
      case B.Right:
      case B.TopRight:
        return "justify-end";
      // Align to right
      case B.Left:
      case B.TopLeft:
        return "justify-start";
      // Align to left
      default:
        return "justify-between";
    }
  };
  return /* @__PURE__ */ V(
    "div",
    {
      className: `cartesian-chart flex w-full h-full ${z}`,
      children: [
        (mt || u) && /* @__PURE__ */ C(
          "div",
          {
            ref: E,
            className: "legend-wrapper py-cn-sm w-full h-auto",
            children: /* @__PURE__ */ V(
              "div",
              {
                className: `flex items-center gap-2 ${K()}`,
                children: [
                  mt && /* @__PURE__ */ C(Ma, { legendData: et }),
                  u && h && D && /* @__PURE__ */ C(
                    Vc,
                    {
                      interval: D,
                      intervalOptions: h,
                      onChange: ut
                    }
                  )
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ C("div", { className: "chart-area flex-1 min-h-0 min-w-0 relative", children: /* @__PURE__ */ C(
          "div",
          {
            ref: O,
            className: "position-relative w-full h-full",
            style: { overflow: "visible" }
          }
        ) })
      ]
    }
  );
}
const So = 6, V0 = Array.from(
  { length: So },
  (e, t) => t / (So - 1)
), gi = Kn.memo(() => /* @__PURE__ */ C(
  "svg",
  {
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    className: "absolute inset-0 w-full h-full z-0",
    children: V0.map((e, t) => /* @__PURE__ */ C(
      "line",
      {
        x1: "0",
        y1: e * 100,
        x2: "100",
        y2: e * 100,
        stroke: "currentColor",
        strokeWidth: "0.5",
        strokeDasharray: "1 3",
        className: "text-cn-disabled",
        opacity: 0.1
      },
      t
    ))
  }
));
gi.displayName = "GridLinesSVG";
const xo = [
  {
    // Back area (lighter): multiple peaks and valleys across the width
    closedPath: "M 0,0.50 C 0.05,0.42 0.10,0.35 0.15,0.38 C 0.20,0.42 0.25,0.30 0.32,0.25 C 0.38,0.20 0.45,0.35 0.52,0.42 C 0.58,0.48 0.65,0.32 0.72,0.28 C 0.78,0.24 0.85,0.38 0.92,0.45 C 0.96,0.48 1,0.42 1,0.42 L 1,1 L 0,1 Z",
    gradientOpacity: 0.5
  },
  {
    // Front area (slightly darker): offset peaks and valleys for visual interest
    closedPath: "M 0,0.38 C 0.06,0.45 0.12,0.55 0.18,0.48 C 0.24,0.40 0.30,0.50 0.38,0.58 C 0.44,0.52 0.50,0.38 0.58,0.30 C 0.64,0.24 0.70,0.35 0.78,0.45 C 0.84,0.52 0.90,0.40 0.95,0.35 C 0.98,0.32 1,0.38 1,0.38 L 1,1 L 0,1 Z",
    gradientOpacity: 0.7
  }
], dc = Kn.memo(({ maskId: e }) => /* @__PURE__ */ C("svg", { viewBox: "0 0 1 1", className: "absolute inset-0 w-full h-full", children: /* @__PURE__ */ V("defs", { children: [
  xo.map((t, n) => /* @__PURE__ */ V(
    "linearGradient",
    {
      id: `${e}-gradient-${n}`,
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1",
      gradientUnits: "objectBoundingBox",
      children: [
        /* @__PURE__ */ C(
          "stop",
          {
            offset: "0%",
            stopColor: "white",
            stopOpacity: t.gradientOpacity
          }
        ),
        /* @__PURE__ */ C("stop", { offset: "100%", stopColor: "white", stopOpacity: 0 })
      ]
    },
    `gradient-${n}`
  )),
  /* @__PURE__ */ C(
    "mask",
    {
      id: e,
      maskUnits: "objectBoundingBox",
      maskContentUnits: "objectBoundingBox",
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      children: xo.map((t, n) => /* @__PURE__ */ C(
        "path",
        {
          d: t.closedPath,
          fill: `url(#${e}-gradient-${n})`
        },
        n
      ))
    }
  )
] }) }));
dc.displayName = "AreasSVG";
const X0 = ({
  showTitle: e = !0
}) => {
  const t = ft(() => ri("area-mask-"), []);
  return /* @__PURE__ */ V("div", { className: "h-full flex flex-col p-cn-md", children: [
    e && /* @__PURE__ */ C("div", { className: "mb-cn-md", children: /* @__PURE__ */ C(Ae.Box, { className: "w-16 h-6 rounded-cn-2" }) }),
    /* @__PURE__ */ V("div", { className: "flex-1 flex flex-col items-center justify-center gap-cn-md", children: [
      /* @__PURE__ */ V("div", { className: "relative", style: { width: "90%", height: "60%" }, children: [
        /* @__PURE__ */ C(gi, {}),
        /* @__PURE__ */ C(dc, { maskId: t }),
        /* @__PURE__ */ C(
          "div",
          {
            className: "cn-skeleton-base absolute inset-0 z-10",
            style: {
              maskImage: `url(#${t})`,
              WebkitMaskImage: `url(#${t})`
            }
          }
        )
      ] }),
      /* @__PURE__ */ C(cn, { variant: "caption-normal", className: "text-cn-4", children: "Loading data..." }),
      /* @__PURE__ */ C(Ae.Box, { className: "w-3/4 max-w-96 h-4 rounded-cn-2" })
    ] })
  ] });
}, j0 = [
  { x: 0.05, width: 0.055, height: 0.55, opacity: 0.7 },
  { x: 0.12, width: 0.055, height: 0.75, opacity: 0.4 },
  { x: 0.19, width: 0.055, height: 0.45, opacity: 0.7 },
  { x: 0.26, width: 0.055, height: 0.85, opacity: 0.4 },
  { x: 0.33, width: 0.055, height: 0.6, opacity: 0.7 },
  { x: 0.4, width: 0.055, height: 0.7, opacity: 0.4 },
  { x: 0.47, width: 0.055, height: 0.5, opacity: 0.7 },
  { x: 0.54, width: 0.055, height: 0.9, opacity: 0.4 },
  { x: 0.61, width: 0.055, height: 0.65, opacity: 0.7 },
  { x: 0.68, width: 0.055, height: 0.55, opacity: 0.4 },
  { x: 0.75, width: 0.055, height: 0.8, opacity: 0.7 },
  { x: 0.82, width: 0.055, height: 0.4, opacity: 0.4 }
], fc = Kn.memo(({ maskId: e }) => /* @__PURE__ */ C("svg", { viewBox: "0 0 1 1", className: "absolute inset-0 w-full h-full", children: /* @__PURE__ */ C("defs", { children: /* @__PURE__ */ C(
  "mask",
  {
    id: e,
    maskUnits: "objectBoundingBox",
    maskContentUnits: "objectBoundingBox",
    x: "0",
    y: "0",
    width: "1",
    height: "1",
    children: j0.map((t, n) => /* @__PURE__ */ C(
      "rect",
      {
        x: t.x,
        y: 1 - t.height,
        width: t.width,
        height: t.height,
        fill: "white",
        fillOpacity: t.opacity
      },
      n
    ))
  }
) }) }));
fc.displayName = "ColumnsSVG";
const Bi = ({
  showTitle: e = !0
}) => {
  const t = ft(() => ri("column-mask-"), []);
  return /* @__PURE__ */ V("div", { className: "h-full flex flex-col p-cn-md", children: [
    e && /* @__PURE__ */ C("div", { className: "mb-cn-md", children: /* @__PURE__ */ C(Ae.Box, { className: "w-16 h-6 rounded-cn-2" }) }),
    /* @__PURE__ */ V("div", { className: "flex-1 flex flex-col items-center justify-center gap-cn-md", children: [
      /* @__PURE__ */ V("div", { className: "relative", style: { width: "90%", height: "60%" }, children: [
        /* @__PURE__ */ C(gi, {}),
        /* @__PURE__ */ C(fc, { maskId: t }),
        /* @__PURE__ */ C(
          "div",
          {
            className: "cn-skeleton-base absolute inset-0 z-10",
            style: {
              maskImage: `url(#${t})`,
              WebkitMaskImage: `url(#${t})`
            }
          }
        )
      ] }),
      /* @__PURE__ */ C(cn, { variant: "caption-normal", className: "text-cn-4", children: "Loading data..." }),
      /* @__PURE__ */ C(Ae.Box, { className: "w-3/4 max-w-96 h-4 rounded-cn-2" })
    ] })
  ] });
}, q0 = [
  {
    // Line 1: down → way up → way down → way way up
    d: "M 0,0.40 C 0.08,0.55 0.12,0.60 0.20,0.55 C 0.28,0.45 0.35,0.25 0.45,0.25 C 0.55,0.25 0.62,0.55 0.70,0.65 C 0.78,0.75 0.85,0.50 0.92,0.25 C 0.96,0.15 1,0.10 1,0.10",
    opacity: 0.7,
    strokeWidth: 0.02
  },
  {
    // Line 2: up → slightly down → up → slightly down more → up
    d: "M 0,0.60 C 0.10,0.50 0.18,0.45 0.25,0.48 C 0.32,0.52 0.40,0.40 0.50,0.35 C 0.60,0.30 0.68,0.42 0.75,0.45 C 0.82,0.48 0.90,0.35 1,0.30",
    opacity: 0.5,
    strokeWidth: 0.02
  }
], gc = Kn.memo(({ maskId: e }) => /* @__PURE__ */ C("svg", { viewBox: "0 0 1 1", className: "absolute inset-0 w-full h-full", children: /* @__PURE__ */ C("defs", { children: /* @__PURE__ */ C(
  "mask",
  {
    id: e,
    maskUnits: "objectBoundingBox",
    maskContentUnits: "objectBoundingBox",
    x: "0",
    y: "0",
    width: "1",
    height: "1",
    children: q0.map((t, n) => /* @__PURE__ */ C(
      "path",
      {
        d: t.d,
        fill: "none",
        stroke: "white",
        strokeWidth: t.strokeWidth,
        strokeOpacity: t.opacity,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      },
      n
    ))
  }
) }) }));
gc.displayName = "LinesSVG";
const Z0 = ({
  showTitle: e = !0
}) => {
  const t = ft(() => ri("line-mask-"), []);
  return /* @__PURE__ */ V("div", { className: "h-full flex flex-col p-cn-md", children: [
    e && /* @__PURE__ */ C("div", { className: "mb-cn-md", children: /* @__PURE__ */ C(Ae.Box, { className: "w-16 h-6 rounded-cn-2" }) }),
    /* @__PURE__ */ V("div", { className: "flex-1 flex flex-col items-center justify-center gap-cn-md", children: [
      /* @__PURE__ */ V("div", { className: "relative", style: { width: "90%", height: "60%" }, children: [
        /* @__PURE__ */ C(gi, {}),
        /* @__PURE__ */ C(gc, { maskId: t }),
        /* @__PURE__ */ C(
          "div",
          {
            className: "cn-skeleton-base absolute inset-0 z-10",
            style: {
              maskImage: `url(#${t})`,
              WebkitMaskImage: `url(#${t})`
            }
          }
        )
      ] }),
      /* @__PURE__ */ C(cn, { variant: "caption-normal", className: "text-cn-4", children: "Loading data..." }),
      /* @__PURE__ */ C(Ae.Box, { className: "w-3/4 max-w-96 h-4 rounded-cn-2" })
    ] })
  ] });
}, jS = ({
  type: e = pt.Column,
  showTitle: t = !0
}) => {
  switch (e) {
    case pt.Bar:
      return /* @__PURE__ */ C(Bi, { showTitle: t });
    case pt.Line:
    case pt.DashedLine:
      return /* @__PURE__ */ C(Z0, { showTitle: t });
    case pt.Area:
      return /* @__PURE__ */ C(X0, { showTitle: t });
    case pt.Scatter:
      return /* @__PURE__ */ C(Bi, { showTitle: t });
    case pt.Column:
    default:
      return /* @__PURE__ */ C(Bi, { showTitle: t });
  }
}, Fe = {
  Plot: "plot-section",
  Axis: "axis-section",
  Legend: "legend-section"
};
class K0 {
  constructor(t) {
    this.svgUtilService = t;
  }
  /**
   * Draws all axes on the radar chart
   */
  drawAxes(t, n) {
    this.buildAxis(t, n);
  }
  /**
   * Gets axis data for a specific axis by name
   */
  getAxisData(t, n) {
    return this.getAxisDataMap(t).get(n);
  }
  /**
   * Gets the complete axis data map from the chart selection
   */
  getAxisDataMap(t) {
    return t.selectAll(`.${Fe.Axis}`).datum();
  }
  buildAxis(t, n) {
    const r = t.selectAll(`.${Fe.Axis}`);
    this.setAxisData(r, n), this.drawTickCircles(r, n), this.drawRadianAxis(r, n);
  }
  drawTickCircles(t, n) {
    const r = Number(t.attr("width")), i = Number(t.attr("height")), a = Math.min(r / 2, i / 2);
    t.selectAll(".grid-circle").data(ll(1, n.levels + 1)).enter().append("g").classed("dotted-grid-circle", (s, o) => o !== n.levels - 1).classed("last-grid-circle", (s, o) => o === n.levels - 1).append("circle").classed("circle-path", !0).attr("r", (s) => a / n.levels * s).style("fill", "none").style("stroke", "#f0f0f0").style("stroke-width", "1px").style(
      "stroke-dasharray",
      (s, o) => o !== n.levels - 1 ? "5" : "none"
    );
  }
  drawRadianAxis(t, n) {
    const r = t.datum(), i = Number(t.attr("width")), a = t.selectAll(".axis").data(n.axes.map((s) => r.get(s.name))).enter().append("g").classed("axis", !0);
    a.append("line").datum(
      (s) => ba(s.scale.range()[1], s.axisRadian)
    ).attr("x1", 0).attr("y1", 0).attr("x2", (s) => s.x).attr("y2", (s) => s.y).classed("line", !0).style("stroke", "#e5e5e5").style("stroke-width", "1"), a.append("text").text((s) => s.axisName).each((s, o, c) => {
      const l = c[o], u = s.scale.range()[1], d = ba(
        u + 8,
        s.axisRadian
      );
      P(l).attr("x", d.x).attr("y", d.y), this.svgUtilService.wrapTextIfNeeded(
        l,
        this.getAvailableTextWidth(
          s.axisRadian,
          d.x + i / 2,
          i
        )
      );
    }).classed("axis-title", !0).attr(
      "dominant-baseline",
      (s) => this.getTextBaseline(s.axisRadian)
    ).attr(
      "text-anchor",
      (s) => this.getTextAnchor(s.axisRadian)
    ).style("font-size", "12px").style("font-weight", "500").style("fill", "currentColor");
  }
  setAxisData(t, n) {
    const r = Number(t.attr("width")), i = Number(t.attr("height")), a = /* @__PURE__ */ new Map(), s = 0, o = Math.min(r / 2, i / 2);
    n.axes.forEach((c, l) => {
      const u = this.getMaxAxisValue(c.name, n), h = this.buildScale(
        s,
        o,
        u,
        n.levels
      );
      a.set(c.name, {
        scale: h,
        axisName: c.name,
        axisRadian: Math.PI * 2 / n.axes.length * l
        // 0 is at 12'o clock
      });
    }), t.datum(a);
  }
  buildScale(t, n, r, i) {
    const a = Ya().range([t, n]);
    return this.setDomain(a, r, i), a;
  }
  setDomain(t, n, r) {
    const i = n / (r - 1);
    t.domain([0, i * r]);
  }
  getMaxAxisValue(t, n) {
    return Ru(
      n.series.flatMap(
        (r) => r.data.filter((i) => i.axis === t).map((i) => i.value)
      )
    );
  }
  getTextAnchor(t) {
    return this.isAxisTitleOnLeft(t) ? "end" : this.isAxisTitleOnRight(t) ? "start" : "middle";
  }
  getAvailableTextWidth(t, n, r) {
    return this.isAxisTitleOnLeft(t) ? n : this.isAxisTitleOnRight(t) ? r - n : r;
  }
  getTextBaseline(t) {
    return this.isAxisTitleBelowCenter(t) ? "hanging" : this.isAxisTitleAboveCenter(t) ? "baseline" : "center";
  }
  isAxisTitleBelowCenter(t) {
    return t > Math.PI / 2 && t < 3 * Math.PI / 2;
  }
  isAxisTitleAboveCenter(t) {
    return t > 3 * Math.PI / 2 && t < 2 * Math.PI || t > 0 && t < Math.PI / 2;
  }
  isAxisTitleOnLeft(t) {
    return t > Math.PI && t < 2 * Math.PI;
  }
  isAxisTitleOnRight(t) {
    return t > 0 && t < Math.PI;
  }
}
class Q0 {
  /**
   * Draws the main layout sections (plot and legend)
   */
  drawLayout(t, n) {
    this.buildPlotSection(t, n), this.buildLegendSection(t, n);
  }
  buildPlotSection(t, n) {
    const r = Number(t.attr("width")), i = Number(t.attr("height")), a = r - n.plotMargin.left - n.plotMargin.right, s = i - n.plotMargin.top - n.plotMargin.bottom - this.getLegendHeight(n), o = {
      width: a,
      height: s,
      position: {
        x: 0,
        y: -(i - s) / 2
      }
    }, c = this.addSection(
      t,
      o,
      Fe.Plot
    );
    this.buildAxisSection(c);
  }
  buildAxisSection(t) {
    const n = Number(t.attr("width")), r = Number(t.attr("height")), i = {
      width: n,
      height: r,
      position: {
        x: 0,
        y: 0
      }
    };
    this.addSection(t, i, Fe.Axis);
  }
  buildLegendSection(t, n) {
    const r = Number(t.attr("width")), i = Number(t.attr("height")), a = this.getLegendHeight(n), s = {
      width: r,
      height: a,
      position: {
        x: 0,
        y: i / 2 - a
      }
    };
    this.addSection(
      t,
      s,
      Fe.Legend
    );
  }
  addSection(t, n, r) {
    return t.append("svg:g").attr("width", n.width).attr("height", n.height).classed(r, !0).attr(
      "transform",
      `translate(${n.position.x}, ${n.position.y})`
    );
  }
  getLegendHeight(t) {
    return t.legendPosition !== B.None ? t.legendHeight : 0;
  }
}
class te {
  constructor(t) {
    this.domElementMeasurerService = t;
  }
  static CIRCLE_RADIUS = 4;
  static LEGEND_ITEM_PADDING = 10;
  static LEGENDS_Y_BASELINE = 12;
  static LEGEND_ITEM_CIRCLE_BASELINE = 4;
  static LEGEND_ITEM_TEXT_START_X = 16;
  /**
   * Draws the legend section of the radar chart
   */
  drawLegend(t, n) {
    const r = t.select(`.${Fe.Legend}`).append("g").classed("legends", !0);
    this.drawLegendItems(r, n), this.transformLegends(r);
  }
  drawLegendItems(t, n) {
    const r = t.selectAll(".legend-item").data(n.series).enter().append("g").classed("legend-item", !0).style("cursor", "pointer");
    r.append("circle").classed("legend-symbol", !0).attr("cx", te.LEGEND_ITEM_CIRCLE_BASELINE).attr("cy", te.LEGEND_ITEM_CIRCLE_BASELINE).attr("r", te.CIRCLE_RADIUS).attr("fill", (i) => i.color), r.append("text").text((i) => i.name).classed("legend-title", !0).attr("dominant-baseline", "central").attr(
      "transform",
      `translate(${te.LEGEND_ITEM_TEXT_START_X}, ${te.LEGEND_ITEM_CIRCLE_BASELINE})`
    ).style("font-size", "10px").style("font-weight", "500").style("text-transform", "uppercase").style("letter-spacing", "0.5px").style("fill", "currentColor");
  }
  transformLegends(t) {
    const n = [];
    t.selectAll(".legend-item").selectAll("text").each(
      (r, i, a) => n.push(
        te.LEGEND_ITEM_TEXT_START_X + te.LEGEND_ITEM_PADDING + this.domElementMeasurerService.getComputedTextLength(a[i])
      )
    ), t.selectAll(".legend-item").attr(
      "transform",
      (r, i) => `translate(${fs(n.slice(0, i))}, 0)`
    ), t.attr(
      "transform",
      `translate(${-fs(n) / 2}, ${te.LEGENDS_Y_BASELINE})`
    );
  }
}
class J0 {
  constructor(t, n, r) {
    this.containerSelection = t, this.options = n, this.radarChartService = r;
  }
  destroyed = !1;
  /**
   * Destroys the chart and removes all SVG elements.
   * After calling this, the object cannot be used for redraw.
   */
  destroy() {
    this.containerSelection.selectAll("svg").remove(), this.destroyed = !0;
  }
  /**
   * Redraws the chart with the current options.
   * Throws if the chart has been destroyed.
   */
  redraw() {
    this.throwIfDestroyed(), this.radarChartService.redraw(this.containerSelection, this.options);
  }
  throwIfDestroyed() {
    if (this.destroyed)
      throw new Error("This RadarObject has been destroyed");
  }
}
class ty {
  constructor(t) {
    this.radarChartAxisService = t;
  }
  /**
   * Draws all series on the radar chart
   */
  drawSeries(t, n) {
    this.drawSeriesPathAndPoints(t, n);
  }
  drawSeriesPathAndPoints(t, n) {
    const r = this.radarChartAxisService.getAxisDataMap(t), a = t.select(
      `.${Fe.Plot}`
    ).selectAll(".series").data(n.series).enter().append("g").attr("class", "series").on("click", (s, o) => n.onSeriesClicked(o.name));
    this.drawRadialLine(a, r), this.drawPoints(a, r, n.onPointClicked);
  }
  drawRadialLine(t, n) {
    t.append("path").attr("class", "radar-area").attr("d", (r) => this.buildRadialLine(n)(r.data)).style("stroke", (r) => r.color).style("fill", "none").style("stroke-width", "2px").style(
      "filter",
      (r) => Ht.getDropShadowColor(r.color)
    );
  }
  drawPoints(t, n, r) {
    t.filter((a) => a.showPoints).append("g").classed("points", !0).attr("fill", (a) => a.color).attr("stroke", (a) => a.color).selectAll(".point").data((a) => this.buildPointSelectionData(a, n)).enter().append("circle").classed("point", !0).on(
      "click",
      (a, s) => r(s.radarPoint, s.seriesName)
    ).attr("cx", (a) => a.coordinates.x).attr("cy", (a) => a.coordinates.y).attr("r", 5).style("stroke-width", "2px").style("cursor", "pointer");
  }
  buildRadialLine(t) {
    return Jg().curve(ip).radius((n) => t.get(n.axis).scale(n.value)).angle((n) => t.get(n.axis).axisRadian);
  }
  getPointCoordinates(t, n) {
    const r = t.scale(n.value), i = t.axisRadian;
    return ba(r, i);
  }
  buildPointSelectionData(t, n) {
    return t.data.map((r) => {
      const i = n.get(r.axis);
      return {
        radarPoint: r,
        seriesName: t.name,
        axisData: i,
        coordinates: this.getPointCoordinates(i, r)
      };
    });
  }
}
class ey {
  constructor(t, n) {
    this.allSeries = t, this.radialBisector = er((r) => r.axisRadian), this.radialAxisData = Ic(n).sort(
      (r, i) => r.axisRadian - i.axisRadian
    ), this.addCyclicRedundancy();
  }
  radialBisector;
  radialAxisData;
  axisDataPointMap = /* @__PURE__ */ new WeakMap();
  /**
   * Finds data points closest to the given mouse location
   */
  dataForLocation(t) {
    const n = this.findClosestAxis(t);
    if (n === void 0)
      return [];
    if (!this.axisDataPointMap.has(n)) {
      const r = this.buildLocationData(
        n.axisName,
        t
      );
      this.axisDataPointMap.set(n, r);
    }
    return this.axisDataPointMap.get(n);
  }
  findClosestAxis(t) {
    const n = jl(t.x, t.y), r = this.radialBisector.left(
      this.radialAxisData,
      n
    ), i = this.radialAxisData[r - 1], a = this.radialAxisData[r];
    return i === void 0 ? a : a === void 0 ? i : n - i.axisRadian > a.axisRadian - n ? a : i;
  }
  addCyclicRedundancy() {
    const n = { ...this.radialAxisData.sort(
      (r, i) => r.axisRadian - i.axisRadian
    )[0] };
    n.axisRadian += 2 * Math.PI, this.radialAxisData.push(n);
  }
  buildLocationData(t, n) {
    return this.allSeries.flatMap(
      (r) => r.data.filter((i) => i.axis === t).map((i) => ({
        dataPoint: i,
        context: r,
        location: n
      }))
    );
  }
}
class pc {
  constructor(t) {
    this.radarChartAxisService = t;
  }
  tooltipRef = null;
  /**
   * Sets the tooltip reference (provided from React's useChartTooltipBuilder hook)
   */
  setTooltipRef(t) {
    this.tooltipRef = t;
  }
  /**
   * Cleans up the tooltip reference
   */
  destroy() {
    this.tooltipRef && (this.tooltipRef.destroy(), this.tooltipRef = null);
  }
  /**
   * Adds tooltip tracking to the radar chart
   */
  addTooltipTracking(t, n) {
    if (!n.tooltipOption.visible || !this.tooltipRef)
      return;
    const r = this.radarChartAxisService.getAxisDataMap(t), i = new ey(
      n.series,
      Array.from(r.values())
    ), a = t.selectAll(".point"), s = t.node();
    s && a.on(
      "mousemove",
      (o) => this.onMouseMove(o, s, i)
    ).on("mouseleave", () => this.onMouseOut());
  }
  onMouseMove(t, n, r) {
    if (!this.tooltipRef)
      return;
    const i = n.parentNode, [a, s] = Et(t, n), [o, c] = Et(t, i), l = { x: a, y: -s }, u = r.dataForLocation(l);
    this.tooltipRef.showWithData(i, u, { x: o, y: c });
  }
  onMouseOut() {
    this.tooltipRef && this.tooltipRef.hide();
  }
  /**
   * Converts radar data to default tooltip render data format
   */
  static convertToDefaultTooltipRenderData(t) {
    return {
      chartType: "radar",
      title: "",
      groups: [
        {
          title: "",
          labeledValues: t.map((n) => ({
            label: n.dataPoint.axis,
            value: n.dataPoint.value,
            color: n.context.color,
            dataPoint: n.dataPoint,
            context: n.context
          }))
        }
      ]
    };
  }
}
class ny {
  radarChartLayoutService;
  radarChartAxisService;
  radarSeriesRendererService;
  radarChartLegendService;
  radarChartTooltipService;
  constructor() {
    const t = new sr(), n = new xn(), r = new Sn(
      t,
      n
    );
    this.radarChartLayoutService = new Q0(), this.radarChartAxisService = new K0(r), this.radarSeriesRendererService = new ty(
      this.radarChartAxisService
    ), this.radarChartLegendService = new te(
      t
    ), this.radarChartTooltipService = new pc(
      this.radarChartAxisService
    );
  }
  /**
   * Gets the tooltip service for setting up tooltip reference
   */
  getTooltipService() {
    return this.radarChartTooltipService;
  }
  /**
   * Builds a radar chart in the given container
   * Returns undefined if container has invalid dimensions
   */
  buildChart(t, n) {
    const r = P(t), i = this.getResolvedOptions(n), a = t.offsetWidth, s = t.offsetHeight;
    if (a <= 0 || s <= 0)
      return;
    this.clearSvg(r), this.drawChart(r, i);
    const o = new J0(
      r,
      i,
      this
    );
    return r.datum(o), o;
  }
  /**
   * Redraws an existing chart
   */
  redraw(t, n) {
    this.clearSvg(t), this.drawChart(t, n);
  }
  /**
   * Gets the chart object from an element if one exists
   */
  getChartFromElement(t) {
    return P(
      t
    ).datum();
  }
  drawChart(t, n) {
    const r = this.buildChartSelection(
      t,
      n
    );
    this.drawLayout(r, n), this.drawAxes(r, n), this.drawSeries(r, n), this.drawLegend(r, n), this.maybeEnableTooltip(r, n);
  }
  buildChartSelection(t, n) {
    const r = t.node().offsetWidth, i = t.node().offsetHeight, a = r - n.chartMargin.left - n.chartMargin.right, s = i - n.chartMargin.top - n.chartMargin.bottom;
    return t.append("svg").classed("radar-svg viz-font-family", !0).attr("width", r).attr("height", i).append("svg:g").attr("width", a).attr("height", s).attr(
      "transform",
      `translate(${n.chartMargin.left + a / 2}, ${n.chartMargin.top + s / 2})`
    );
  }
  clearSvg(t) {
    t.selectAll("svg").remove();
  }
  drawLayout(t, n) {
    this.radarChartLayoutService.drawLayout(t, n);
  }
  drawAxes(t, n) {
    this.radarChartAxisService.drawAxes(t, n);
  }
  drawSeries(t, n) {
    this.radarSeriesRendererService.drawSeries(t, n);
  }
  drawLegend(t, n) {
    n.legendPosition !== B.None && this.radarChartLegendService.drawLegend(t, n);
  }
  maybeEnableTooltip(t, n) {
    n.tooltipOption.visible && this.radarChartTooltipService.addTooltipTracking(t, n);
  }
  getResolvedOptions(t) {
    return t.series = t.series?.map(
      (n) => Or({}, n, this.getDefaultSeries())
    ), Or({}, t, this.getDefaultOptions());
  }
  getDefaultSeries() {
    return {
      showPoints: !0
    };
  }
  getDefaultOptions() {
    return {
      title: "",
      axes: [],
      series: [],
      legendHeight: 25,
      legendPosition: B.Bottom,
      levels: 10,
      tooltipOption: {
        visible: !0
      },
      chartMargin: {
        top: 40,
        left: 0,
        bottom: 16,
        right: 0
      },
      plotMargin: {
        top: 24,
        left: 0,
        bottom: 44,
        right: 0
      },
      onPointClicked: () => {
      },
      onSeriesClicked: () => {
      }
    };
  }
}
function ry(e) {
  const t = lt(null), n = lt(null), r = lt(null), i = ai(
    pc.convertToDefaultTooltipRenderData,
    ii
  ), a = Y(() => ({
    title: e.title ?? "",
    axes: e.axes,
    series: e.series,
    legendHeight: e.legendHeight,
    legendPosition: e.legendPosition,
    levels: e.levels,
    tooltipOption: {
      visible: e.showTooltip ?? !0
    },
    onPointClicked: (o, c) => {
      e.onPointClicked?.({
        point: o,
        seriesName: c
      });
    },
    onSeriesClicked: (o) => {
      e.onSeriesClicked?.(o);
    }
  }), [
    e.title,
    e.axes,
    e.series,
    e.legendHeight,
    e.legendPosition,
    e.levels,
    e.showTooltip,
    e.onPointClicked,
    e.onSeriesClicked
  ]), s = Y(() => {
    if (!t.current) return;
    n.current || (n.current = new ny()), e.showTooltip !== !1 && n.current.getTooltipService().setTooltipRef(i);
    const o = n.current.buildChart(
      t.current,
      a()
    );
    o && (r.current = o);
  }, [a, i, e.showTooltip]);
  return wt(() => {
    s();
  }, [s]), vn(t, s), wt(() => () => {
    r.current && (r.current.destroy(), r.current = null), n.current && (n.current.getTooltipService().destroy(), n.current = null);
  }, []), {
    containerRef: t,
    rebuild: s
  };
}
function iy(e) {
  switch (e) {
    case B.Bottom:
      return {
        legendPosition: B.Bottom,
        legendLayout: dt.Row
      };
    case B.Right:
      return {
        legendPosition: B.Right,
        legendLayout: dt.Row
      };
    case B.TopRight:
      return {
        legendPosition: B.TopRight,
        legendLayout: dt.Row
      };
    case B.TopLeft:
      return {
        legendPosition: B.TopLeft,
        legendLayout: dt.Row
      };
    case B.Top:
      return {
        legendPosition: B.Top,
        legendLayout: dt.Row
      };
    case B.Left:
      return {
        legendPosition: B.Left,
        legendLayout: dt.Row
      };
    case B.None:
      return {
        legendPosition: B.None,
        legendLayout: dt.Row
      };
    case B.Auto:
    default:
      return {
        legendPosition: B.TopRight,
        legendLayout: dt.Row
      };
  }
}
function ay(e) {
  switch (e) {
    case B.Top:
    case B.TopLeft:
    case B.TopRight:
      return "flex flex-col-reverse";
    case B.Bottom:
    case B.Left:
    case B.Right:
      return "flex flex-col";
    case B.None:
    default:
      return "flex flex-col";
  }
}
function sy(e) {
  switch (e) {
    case B.Left:
      return "flex justify-start";
    case B.Right:
      return "flex justify-end";
    default:
      return "";
  }
}
function qS({
  title: e,
  axes: t,
  series: n,
  levels: r,
  // legendHeight is kept for API compatibility but React Legend handles its own sizing
  legendPosition: i = B.Bottom,
  showTooltip: a = !0,
  onPointClicked: s,
  onSeriesClicked: o,
  className: c
}) {
  const [l, u] = St(
    /* @__PURE__ */ new Set()
  ), { legendPosition: h, legendLayout: d } = iy(i), f = ft(() => n.filter((v) => !l.has(v.name)), [n, l]), m = ft(() => {
    const v = n.map((T) => ({
      name: T.name,
      color: T.color,
      disabled: l.has(T.name),
      data: {
        displayValue: T.name
      }
    }));
    return {
      position: h,
      layout: d,
      fontSize: tr.Small,
      series: v,
      interactionHandler: {
        onClick: (T) => {
          u((A) => {
            const R = new Set(A);
            return R.has(T.name) ? R.delete(T.name) : R.add(T.name), R;
          });
        }
      }
    };
  }, [n, l, h, d]), y = {
    title: e,
    axes: t,
    series: f,
    levels: r,
    legendHeight: 0,
    // No D3 legend
    legendPosition: B.None,
    // Disable D3 legend
    showTooltip: a,
    onPointClicked: s,
    onSeriesClicked: o
  }, { containerRef: g } = ry(y), p = i !== B.None, x = ay(i), w = sy(i);
  return /* @__PURE__ */ V(
    "div",
    {
      className: `ht-radar-chart ${x} w-full h-full ${c ?? ""}`,
      children: [
        /* @__PURE__ */ C(
          "div",
          {
            ref: g,
            className: "flex-1 min-h-0",
            style: { display: "flex" }
          }
        ),
        p && /* @__PURE__ */ C("div", { className: `shrink-0 py-2 ${w}`, children: /* @__PURE__ */ C(Ma, { legendData: m }) })
      ]
    }
  );
}
var kn = /* @__PURE__ */ ((e) => (e.Float = "float", e.Integer = "int", e.Auto = "auto", e.None = "none", e))(kn || {});
class Je {
  static INTEGER_FORMATTER = P0;
  static FLOAT_FORMATTER = F0;
  transform(t, n = "auto") {
    if (t == null)
      return "-";
    const r = Number(t);
    return isNaN(r) ? "-" : n === "none" ? r.toString() : this.getFormatter(r, n).format(r);
  }
  getFormatter(t, n) {
    switch (n) {
      case "float":
        return Je.FLOAT_FORMATTER;
      case "int":
        return Je.INTEGER_FORMATTER;
      case "auto":
      default:
        return this.isInteger(t) ? Je.INTEGER_FORMATTER : Je.FLOAT_FORMATTER;
    }
  }
  isInteger(t) {
    return t % 1 === 0;
  }
}
class oy {
  transform(t) {
    let n = Math.floor(Math.log(t) / Math.log(1024));
    n = Math.min(n, wo.length - 1);
    const r = t / Math.pow(1024, n), i = Math.round(r * 100) / 100, a = wo[n];
    return `${i} ${a}`;
  }
}
const wo = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], ly = (e) => {
  if (e === void 0)
    return "-";
  const n = Math.abs(Math.trunc(e / 864e5)), r = new Date(e), i = r.getUTCHours(), a = r.getUTCMinutes(), s = r.getUTCSeconds(), o = r.getUTCMilliseconds();
  return n !== 0 ? i === 0 && a === 0 ? `${n}d` : `${n}d ${i}h ${Pi(a)}m` : i !== 0 ? `${i}h ${Pi(a)}m` : a !== 0 ? `${a}m ${Pi(s)}s` : s !== 0 ? `${s}s` : `${o}ms`;
}, Pi = (e) => e < 10 ? `0${e}` : `${e}`;
class Ka {
  static ordinals = ["th", "st", "nd", "rd"];
  format(t) {
    const n = t % 100, r = n % 10, i = Ka.ordinals;
    return n > 10 && n < 20 ? `${t}${i[0]}` : r >= 0 && r < i.length ? `${t}${i[r]}` : `${t}${i[0]}`;
  }
}
const yr = new Je(), cy = new oy(), uy = new Ka(), hy = new $e();
var mc = /* @__PURE__ */ ((e) => (e.Auto = "auto", e.Integer = "integer", e.Decimal = "decimal", e.Percentage = "percentage", e.Duration = "duration", e.FileSize = "fileSize", e.Ordinal = "ordinal", e.Date = "date", e.Raw = "raw", e))(mc || {});
function ti(e, t) {
  if (e == null)
    return "-";
  const n = t?.valueType ?? "auto", r = t?.decimalPlaces ?? 2;
  switch (n) {
    case "auto":
      return yr.transform(e, kn.Auto);
    case "integer":
      return yr.transform(e, kn.Integer);
    case "decimal":
      return dy(e, r);
    case "percentage":
      return fy(e, t?.decimalPlaces ?? 1);
    case "duration":
      return ly(e);
    case "fileSize":
      return cy.transform(e);
    case "ordinal":
      return uy.format(Math.round(e));
    case "date":
      return gy(e);
    case "raw":
      return yr.transform(e, kn.None);
    default:
      return yr.transform(e, kn.Auto);
  }
}
function dy(e, t) {
  return new re({
    trailingScaledDigits: t,
    trailingUnscaledDigits: t,
    trimTrailingZeros: !1
  }).format(e);
}
function fy(e, t) {
  return `${e.toFixed(t).replace(/\.?0+$/, "")}%`;
}
function gy(e) {
  const t = e > 1e10 ? e : e * 1e3, n = hy.coerce(t);
  return n ? n.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }) : "-";
}
function ZS(e) {
  return {
    auto: "Auto (Number)",
    integer: "Integer",
    decimal: "Decimal",
    percentage: "Percentage",
    duration: "Duration",
    fileSize: "File Size",
    ordinal: "Ordinal",
    date: "Date",
    raw: "Raw (No formatting)"
  }[e] ?? "Auto";
}
var yc = /* @__PURE__ */ ((e) => (e.Left = "left-alignment", e.Center = "center-alignment", e.Right = "right-alignment", e))(yc || {}), In = /* @__PURE__ */ ((e) => (e[e.Entry = 0] = "Entry", e[e.Exit = 1] = "Exit", e[e.Update = 2] = "Update", e))(In || {});
class py {
  constructor(t, n = !0) {
    this.pieData = t, this.invertedY = n;
  }
  dataForLocation(t) {
    const n = this.findClosestSlice(t);
    return n === void 0 ? [] : [
      {
        dataPoint: n.data,
        context: void 0,
        location: t
      }
    ];
  }
  findClosestSlice(t) {
    const n = jl(
      t.x,
      this.invertedY ? -t.y : t.y
    );
    return this.pieData.find(
      (r) => n >= r.startAngle && n <= r.endAngle
    );
  }
}
class my {
  constructor(t, n, r) {
    this.containerSelection = t, this.config = n, this.donutBuilderService = r;
  }
  destroyed = !1;
  /**
   * Destroys the chart and removes all elements.
   * After calling this, the object cannot be used for redraw.
   */
  destroy() {
    this.donutBuilderService.clear(this.containerSelection), this.destroyed = !0;
  }
  /**
   * Reflows the chart with updated dimensions.
   * Optionally accepts new configuration.
   */
  reflow(t) {
    this.throwIfDestroyed(), this.donutBuilderService.reflow(this.containerSelection, t);
  }
  /**
   * Redraws the chart with new configuration.
   */
  redraw(t) {
    this.throwIfDestroyed(), this.donutBuilderService.redraw(this.containerSelection, t);
  }
  /**
   * Gets the current internal configuration
   */
  getConfig() {
    return this.config;
  }
  throwIfDestroyed() {
    if (this.destroyed)
      throw new Error("This DonutObject has been destroyed");
  }
}
function Vt(e) {
  return `.${e}`;
}
class ht {
  // CSS class names
  static DONUT_CHART_SVG_CLASS = "donut-svg";
  static DONUT_ARC_GROUP_CLASS = "donut-arc-group";
  static DONUT_VALUE_TEXT_GROUP_CLASS = "donut-value-text-group";
  static DONUT_VALUE_TITLE_CLASS = "donut-value-title";
  static DONUT_VALUE_CLASS = "donut-value";
  static DONUT_ARC_CLASS = "donut-arc";
  static OUTER_CONTAINER_CLASS = "chart-container";
  static VISUALIZATION_CONTAINER_CLASS = "chart-visualization-container";
  // Layout constants
  static DONUT_PADDING_PX = 10;
  static MIN_FONT_SIZE_FOR_TITLE = 12;
  static MAX_FONT_SIZE_FOR_TITLE = 15;
  static MAX_FONT_SIZE_FOR_VALUE = 64;
  static MONO_CHAR_WIDTH_RATIO = 0.6;
  // Services - instantiated internally
  colorService;
  measurer;
  // Tooltip ref (set externally via hook)
  tooltipRef;
  constructor(t) {
    this.colorService = new Ht(t), this.measurer = new sr();
  }
  /**
   * Set the tooltip ref from the useChartTooltip hook
   */
  setTooltipRef(t) {
    this.tooltipRef = t;
  }
  /**
   * Get the tooltip ref
   */
  getTooltipRef() {
    return this.tooltipRef;
  }
  /**
   * Builds a donut chart in the given container
   * Returns undefined if container has invalid dimensions
   */
  buildChart(t, n) {
    const r = P(
      t
    ), i = t.offsetWidth, a = t.offsetHeight;
    if (i <= 0 || a <= 0)
      return;
    this.destroyAnyExistingChart(r);
    const s = this.fillConfigurationDefaults(n), o = this.draw(r, s);
    return r.datum(o), o;
  }
  /**
   * Redraws the chart with new dimensions
   */
  reflow(t, n) {
    if (!t.node()) return;
    const i = n ? this.fillConfigurationDefaults(n) : this.getExistingConfig(t);
    if (!i) return;
    const a = this.measure(t);
    this.updateSize(t, i, a);
  }
  /**
   * Redraws visualization with new config
   */
  redraw(t, n) {
    const r = this.fillConfigurationDefaults(n), i = this.measure(t);
    this.updateVisualization(
      t.select(
        Vt(ht.VISUALIZATION_CONTAINER_CLASS)
      ),
      i,
      r
    );
  }
  /**
   * Clears the chart from the container
   */
  clear(t) {
    t.selectAll(Vt(ht.OUTER_CONTAINER_CLASS)).remove();
  }
  /**
   * Static method to convert tooltip data
   * Can be passed to useChartTooltip hook
   */
  static convertToDefaultTooltipRenderData(t) {
    if (t.length !== 0)
      return {
        chartType: "donut",
        title: "",
        groups: [
          {
            title: "",
            labeledValues: t.map((n) => ({
              label: n.dataPoint.name,
              value: n.dataPoint.value,
              color: n.dataPoint.color ?? "",
              dataPoint: n.dataPoint,
              context: void 0
            }))
          }
        ]
      };
  }
  // ========================================================================
  // Private methods - D3 rendering logic (preserved from Angular)
  // ========================================================================
  draw(t, n) {
    const i = this.drawOuterContainer(t).append("div").classed(ht.VISUALIZATION_CONTAINER_CLASS, !0);
    this.drawVisualization(i, n);
    const a = this.measure(t);
    return this.updateSize(t, n, a), new my(t, n, this);
  }
  drawOuterContainer(t) {
    return t.append("div").classed(ht.OUTER_CONTAINER_CLASS, !0);
  }
  /**
   * Draw the initial SVG structure
   * Maps to: Angular drawVisualization (lines 202-226)
   */
  drawVisualization(t, n) {
    if (t.append("svg").classed(ht.DONUT_CHART_SVG_CLASS, !0).classed("viz-font-family", !0).style("overflow", "visible").append("g").classed(ht.DONUT_ARC_GROUP_CLASS, !0), n.center !== void 0) {
      const r = n.center, i = t.select(Vt(ht.DONUT_CHART_SVG_CLASS)).append("g").classed(ht.DONUT_VALUE_TEXT_GROUP_CLASS, !0);
      i.append("text").classed(ht.DONUT_VALUE_TITLE_CLASS, !0).text(() => String(r.title)), i.append("text").classed(ht.DONUT_VALUE_CLASS, !0).text(
        () => ti(r.value, {
          valueType: r.valueType,
          decimalPlaces: r.decimalPlaces
        })
      );
    }
  }
  /**
   * Update visualization with arc animations
   * Maps to: Angular updateVisualization (lines 71-160)
   */
  updateVisualization(t, n, r) {
    const i = r.series.filter((y) => !y.disabled), a = n.donutOuterRadius - n.donutInnerRadius, s = a > 30 ? "lg" : a > 15 ? "md" : "sm", o = 2 / n.donutOuterRadius, c = Pl().innerRadius(n.donutInnerRadius).outerRadius(n.donutOuterRadius).padAngle(o).padRadius(n.donutOuterRadius), l = this.getMinimumVisibleValue(
      i.map((y) => y.value)
    ), u = Zg().padAngle(o).value(
      (y) => y.value ? Math.max(l, y.value) : y.value
    )(i), h = t.select(Vt(ht.DONUT_ARC_GROUP_CLASS)).selectAll(Vt(ht.DONUT_ARC_CLASS)), d = h.data(), f = h.data(
      u,
      (y) => y.data.name
    ), m = f.enter().append("path").classed(ht.DONUT_ARC_CLASS, !0).attr("fill", (y) => y.data.color).style(
      "filter",
      (y) => Ht.getDropShadowColor(y.data.color, s)
    );
    m.transition().duration(500).attrTween("d", (y, g) => {
      const p = this.animationStartPieDatumValue(
        d,
        u,
        g,
        In.Entry
      ), x = Pe(p, y);
      return (w) => c(x(w)) ?? "";
    }), f.attr("fill", (y) => y.data.color).style(
      "filter",
      (y) => Ht.getDropShadowColor(y.data.color, s)
    ).transition().duration(500).attrTween("d", (y, g) => {
      const p = this.animationStartPieDatumValue(
        d,
        u,
        g,
        In.Update
      ), x = Pe(p, y);
      return (w) => c(x(w)) ?? "";
    }), f.exit().transition().duration(500).attrTween("d", (y, g) => {
      const p = this.animationStartPieDatumValue(
        u,
        d,
        g,
        In.Exit
      ), x = Pe(y, p);
      return (w) => c(x(w)) ?? "";
    }).remove(), r.eventHandlers.dataClicked && m.style("transition", "scale 0.3s ease-in-out").on(
      "click",
      (y, g) => r.eventHandlers?.dataClicked?.(g.data)
    ).on("mouseover", (y) => {
      P(y.currentTarget).style("cursor", "pointer").style("opacity", "0.8").style("scale", "1.02");
    }).on("mouseout", (y) => {
      P(y.currentTarget).style("cursor", "default").style("opacity", "1").style("scale", "1");
    }), this.maybeAddTooltipTracking(
      t.select(Vt(ht.DONUT_ARC_GROUP_CLASS)).node(),
      r,
      u
    );
  }
  /**
   * Largest font size that keeps `text` within `maxWidth`
   * using monospace character width, capped by `upperBound`.
   */
  static calcFontSizeForText(t, n, r) {
    const i = t.length;
    if (i === 0) return r;
    const a = n / (i * ht.MONO_CHAR_WIDTH_RATIO);
    return Math.min(r, Math.floor(a));
  }
  /**
   * Update visualization size
   * Maps to: Angular updateVisualizationSize (lines 162-200)
   */
  updateVisualizationSize(t, n, r) {
    t.select(Vt(ht.DONUT_CHART_SVG_CLASS)).attr("width", n.visualizationWidth).attr("height", n.visualizationHeight).select(Vt(ht.DONUT_ARC_GROUP_CLASS)).attr(
      "transform",
      `translate(${n.visualizationWidth / 2},${n.visualizationHeight / 2})`
    ), this.updateVisualization(t, n, r);
    const i = n.donutOuterRadius, a = n.donutOuterRadius, s = t.select(
      Vt(ht.DONUT_VALUE_CLASS)
    ), o = Math.min(
      Math.floor(n.donutInnerRadius / 2),
      ht.MAX_FONT_SIZE_FOR_VALUE
    ), c = n.donutInnerRadius * 2 * 0.85, l = s.node()?.textContent ?? "", u = ht.calcFontSizeForText(
      l,
      c,
      o
    );
    s.attr("transform", `translate(${i},${a})`).attr("font-size", u);
    const h = Math.min(
      Math.max(
        ht.MIN_FONT_SIZE_FOR_TITLE,
        Math.floor(n.donutInnerRadius / 8)
      ),
      ht.MAX_FONT_SIZE_FOR_TITLE
    );
    t.select(Vt(ht.DONUT_VALUE_TITLE_CLASS)).attr("transform", `translate(${i},${a - u / 2 - 8})`).attr("font-size", h);
  }
  /**
   * Calculate minimum visible value for arcs
   * Maps to: Angular getMinimumVisibleValue (lines 228-233)
   */
  getMinimumVisibleValue(t) {
    return 3 * t.reduce((r, i) => r + i, 0) / 360;
  }
  /**
   * Calculate animation start position for arc
   * Maps to: Angular animationStartPieDatumValue (lines 330-356)
   */
  animationStartPieDatumValue(t, n, r, i) {
    const a = n[r];
    if (en(t))
      return { ...a, startAngle: 0, endAngle: 0 };
    if (i === In.Update)
      return t.find(
        (o) => o.data.name === a.data.name
      ) ?? a;
    switch (r) {
      case 0:
        return { ...a, endAngle: a.startAngle };
      case n.length - 1:
        return { ...a, startAngle: a.endAngle };
      default: {
        const s = t[r - 1]?.endAngle ?? 0;
        return {
          ...a,
          startAngle: s,
          endAngle: s
        };
      }
    }
  }
  /**
   * Decorate calculated dimensions with donut-specific values
   * Maps to: Angular decorateDimensions (lines 235-249)
   */
  decorateDimensions(t) {
    let n = Math.min(
      t.visualizationWidth,
      t.visualizationHeight
    );
    return n -= ht.DONUT_PADDING_PX, {
      ...t,
      visualizationWidth: n,
      visualizationHeight: n,
      donutOuterRadius: n / 2,
      donutInnerRadius: n / 2 * 0.8
    };
  }
  /**
   * Fill configuration with defaults
   * Maps to: Angular fillConfigurationDefaults (lines 251-270)
   */
  fillConfigurationDefaults(t) {
    const n = t.series.filter(
      (i) => en(i.color)
    ).length, r = this.colorService.getColorPalette().forNColors(n);
    return {
      series: t.series.map((i) => {
        const a = en(i.color) ? r.shift() : i.color;
        return {
          ...i,
          color: a ?? "",
          disabled: i.disabled ?? !1
        };
      }),
      center: t.center,
      legend: t.legendPosition === void 0 ? B.None : t.legendPosition,
      tooltipOption: t.tooltipOption === void 0 ? { title: "" } : t.tooltipOption,
      displayLegendCounts: t.displayLegendCounts ?? !0,
      legendFontSize: t.legendFontSize ?? tr.ExtraSmall,
      formatLegendValue: t.formatLegendValue,
      legendInteractionHandler: t?.legendInteractionHandler,
      eventHandlers: t.eventHandlers ?? {}
    };
  }
  /**
   * Measure container and calculate dimensions
   * Inlined from D3VisualizationBuilderService.measure()
   * Note: In React version, legend is handled by React component, so no config needed
   */
  measure(t) {
    const n = t.node();
    if (!n)
      throw Error("Elements must be drawn before being measured");
    const r = this.measurer.measureHtmlElement(n), i = r.width, a = r.height;
    return this.decorateDimensions({
      visualizationWidth: i,
      visualizationHeight: a,
      legendWidth: 0,
      legendHeight: 0
    });
  }
  /**
   * Update size
   */
  updateSize(t, n, r) {
    this.updateVisualizationSize(
      t.select(
        Vt(ht.VISUALIZATION_CONTAINER_CLASS)
      ),
      r,
      n
    );
  }
  /**
   * Add tooltip tracking to the arc group
   */
  maybeAddTooltipTracking(t, n, r) {
    if (!t || !this.tooltipRef || !n.tooltipOption)
      return;
    const i = new py(r);
    P(t).on("mousemove", (a) => {
      const [s, o] = Et(a), c = t.getBoundingClientRect(), l = { x: s, y: o }, u = {
        x: c.width / 2 + l.x,
        y: c.height / 2 + l.y
      }, h = i.dataForLocation(l);
      h.length > 0 && this.tooltipRef?.showWithData(
        t,
        h,
        u
      );
    }).on("mouseleave", () => {
      this.tooltipRef?.hide();
    });
  }
  /**
   * Destroy any existing chart
   */
  destroyAnyExistingChart(t) {
    const n = t.datum();
    n && typeof n.destroy == "function" && n.destroy(), this.clear(t);
  }
  /**
   * Get existing config from chart object
   */
  getExistingConfig(t) {
    return t.datum()?.getConfig();
  }
}
function bo(e) {
  return {
    series: e.series ?? [],
    center: e.center,
    legendPosition: e.legendPosition ?? B.None,
    legendFontSize: e.legendFontSize,
    formatLegendValue: e.formatLegendValue,
    displayLegendCounts: e.displayLegendCounts,
    tooltipOption: e.showTooltip !== !1 ? { title: "" } : void 0,
    eventHandlers: e.onDataClick ? { dataClicked: e.onDataClick } : void 0
  };
}
function yy(e) {
  const t = lt(null), n = lt(null), r = lt(null), i = lt(null), a = ai(ht.convertToDefaultTooltipRenderData, ii), s = Y(() => {
    if (!t.current) return;
    n.current || (n.current = new ht()), e.showTooltip !== !1 && n.current.setTooltipRef(a);
    const o = n.current.buildChart(
      t.current,
      bo(e)
    );
    if (o) {
      i.current !== null && (cancelAnimationFrame(i.current), i.current = null), r.current = o;
      return;
    }
    i.current !== null && cancelAnimationFrame(i.current), i.current = requestAnimationFrame(() => {
      if (i.current = null, !t.current || !n.current) return;
      const c = n.current.buildChart(
        t.current,
        bo(e)
      );
      c && (r.current = c);
    });
  }, [
    e.series,
    e.center,
    e.legendPosition,
    e.legendFontSize,
    e.formatLegendValue,
    e.displayLegendCounts,
    e.onDataClick,
    e.showTooltip,
    a
  ]);
  return wt(() => {
    s();
  }, [s]), vn(t, s), wt(() => () => {
    i.current !== null && (cancelAnimationFrame(i.current), i.current = null), r.current && (r.current.destroy(), r.current = null), n.current = null;
  }, []), {
    containerRef: t,
    rebuild: s
  };
}
function vy(e) {
  switch (e) {
    case B.Bottom:
      return {
        legendPosition: B.Bottom,
        legendLayout: dt.Row
      };
    case B.Right:
      return {
        legendPosition: B.Right,
        legendLayout: dt.Column
      };
    case B.TopRight:
      return {
        legendPosition: B.TopRight,
        legendLayout: dt.Row
      };
    case B.TopLeft:
      return {
        legendPosition: B.TopLeft,
        legendLayout: dt.Row
      };
    case B.Top:
      return {
        legendPosition: B.Top,
        legendLayout: dt.Row
      };
    case B.Left:
      return {
        legendPosition: B.Left,
        legendLayout: dt.Column
      };
    case B.None:
      return {
        legendPosition: B.None,
        legendLayout: dt.Row
      };
    case B.Auto:
    default:
      return {
        legendPosition: B.TopRight,
        legendLayout: dt.Row
      };
  }
}
function Sy(e) {
  switch (e) {
    case B.Top:
    case B.TopLeft:
    case B.TopRight:
      return "flex flex-col-reverse";
    case B.Bottom:
      return "flex flex-col";
    case B.Left:
      return "flex flex-row-reverse";
    case B.Right:
      return "flex flex-row";
    case B.None:
    default:
      return "flex flex-col";
  }
}
function xy(e) {
  switch (e) {
    case B.Left:
    case B.Right:
      return "flex items-center";
    default:
      return "";
  }
}
function KS({
  series: e,
  center: t,
  legendPosition: n = B.Bottom,
  legendFontSize: r = tr.ExtraSmall,
  formatLegendValue: i = !0,
  applyDefaultSorting: a = !0,
  displayLegendCounts: s = !0,
  alignment: o = yc.Center,
  onDataClick: c,
  colorPalette: l,
  showTooltip: u = !0,
  className: h
}) {
  const [d, f] = St(
    /* @__PURE__ */ new Set()
  ), m = ft(
    () => new re({
      trailingScaledDigits: 2,
      trailingUnscaledDigits: 0,
      trimTrailingZeros: !0
    }),
    []
  ), { legendPosition: y, legendLayout: g } = vy(n), p = ft(() => {
    if (!e) return [];
    const N = [...e];
    a && N.sort((b, S) => S.value - b.value);
    const D = new Ht(l).getColorPalette().forNColors(N.length);
    return N.map((b, S) => ({
      ...b,
      color: b.color ?? D[S]
    }));
  }, [e, a, l]), x = ft(() => p.filter((N) => !d.has(N.name)), [p, d]), w = ft(() => {
    const N = p.map(
      (_) => ({
        name: _.name,
        color: _.color,
        disabled: d.has(_.name),
        data: {
          value: s ? _.value : void 0,
          displayValue: i ? m.format(_.value) : void 0
        }
      })
    );
    return {
      position: y,
      layout: g,
      fontSize: r,
      series: N,
      interactionHandler: {
        onClick: (_) => {
          f((D) => {
            const b = new Set(D);
            return b.has(_.name) ? b.delete(_.name) : b.add(_.name), b;
          });
        }
      }
    };
  }, [
    p,
    d,
    y,
    g,
    r,
    s,
    i,
    m
  ]), v = ft(() => {
    if (!t) return;
    if (d.size === 0) return t;
    const N = x.reduce((_, D) => _ + D.value, 0);
    return { ...t, value: N };
  }, [t, x, d.size]), T = {
    series: x,
    center: v,
    legendPosition: B.None,
    // Disable D3 legend - React handles it
    legendFontSize: r,
    formatLegendValue: i,
    displayLegendCounts: s,
    onDataClick: c,
    showTooltip: u
  }, { containerRef: A } = yy(T), R = n !== B.None, O = Sy(n), E = xy(n);
  return /* @__PURE__ */ V(
    "div",
    {
      className: `donut-chart ${O} w-full h-full ${h ?? ""}`,
      children: [
        /* @__PURE__ */ C(
          "div",
          {
            ref: A,
            className: `donut-container flex-1 min-h-0 min-w-0 ${o}`
          }
        ),
        R && /* @__PURE__ */ C("div", { className: `shrink-0 py-2 ${E}`, children: /* @__PURE__ */ C(Ma, { legendData: w }) })
      ]
    }
  );
}
function vr(e, t, n, r) {
  const i = (r - 90) * Math.PI / 180;
  return {
    x: e + n * Math.cos(i),
    y: t + n * Math.sin(i)
  };
}
function Fi(e, t, n, r, i, a) {
  const s = vr(e, t, r, a), o = vr(e, t, r, i), c = vr(e, t, n, a), l = vr(e, t, n, i), h = a - i > 180 ? 1 : 0;
  return [
    "M",
    s.x,
    s.y,
    "A",
    r,
    r,
    0,
    h,
    0,
    o.x,
    o.y,
    "L",
    l.x,
    l.y,
    "A",
    n,
    n,
    0,
    h,
    1,
    c.x,
    c.y,
    "Z"
  ].join(" ");
}
const wy = [
  { startAngle: 340, endAngle: 65, opacity: 0.7 },
  { startAngle: 70, endAngle: 140, opacity: 0.4 },
  { startAngle: 145, endAngle: 200, opacity: 0.7 },
  { startAngle: 205, endAngle: 265, opacity: 0.4 },
  { startAngle: 270, endAngle: 335, opacity: 0.7 }
], je = 0.5, Ui = 0.48, Hi = 0.35, by = wy.flatMap((e) => e.startAngle > e.endAngle ? [
  {
    d: Fi(
      je,
      je,
      Hi,
      Ui,
      e.startAngle,
      360
    ),
    opacity: e.opacity
  },
  {
    d: Fi(
      je,
      je,
      Hi,
      Ui,
      0,
      e.endAngle
    ),
    opacity: e.opacity
  }
] : [
  {
    d: Fi(
      je,
      je,
      Hi,
      Ui,
      e.startAngle,
      e.endAngle
    ),
    opacity: e.opacity
  }
]), vc = Kn.memo(({ maskId: e }) => /* @__PURE__ */ C("svg", { viewBox: "0 0 1 1", className: "absolute inset-0 w-full h-full", children: /* @__PURE__ */ C("defs", { children: /* @__PURE__ */ C(
  "mask",
  {
    id: e,
    maskUnits: "objectBoundingBox",
    maskContentUnits: "objectBoundingBox",
    x: "0",
    y: "0",
    width: "1",
    height: "1",
    children: by.map((t, n) => /* @__PURE__ */ C(
      "path",
      {
        d: t.d,
        fill: "white",
        fillOpacity: t.opacity
      },
      n
    ))
  }
) }) }));
vc.displayName = "DonutRingSVG";
const QS = ({
  showTitle: e = !0
}) => {
  const t = ft(() => ri("donut-mask-"), []);
  return /* @__PURE__ */ V("div", { className: "h-full flex flex-col p-cn-md", children: [
    e && /* @__PURE__ */ C("div", { className: "mb-cn-md", children: /* @__PURE__ */ C(Ae.Box, { className: "w-16 h-6 rounded-cn-2" }) }),
    /* @__PURE__ */ V("div", { className: "flex-1 flex flex-col items-center justify-center gap-cn-md", children: [
      /* @__PURE__ */ V(
        "div",
        {
          className: "relative",
          style: { height: "50%", maxWidth: "80%", aspectRatio: "1 / 1" },
          children: [
            /* @__PURE__ */ C(vc, { maskId: t }),
            /* @__PURE__ */ C(
              "div",
              {
                className: "cn-skeleton-base absolute inset-0",
                style: {
                  maskImage: `url(#${t})`,
                  WebkitMaskImage: `url(#${t})`
                }
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ C(cn, { variant: "caption-normal", className: "text-cn-4", children: "Loading data..." }),
      /* @__PURE__ */ C(Ae.Box, { className: "w-1/2 max-w-96 h-4 rounded-cn-2" })
    ] })
  ] });
}, Rr = 24, Ty = 9, Ay = 12, Dy = 2, Sc = 4, My = 4, Cy = 30, To = 4, _y = 20, $t = Math.PI / 56, Ey = $n.Blue, Ao = "var(--cn-comp-data-viz-inactive-12-gray)", Ny = (e) => (t) => {
  if (t.length === 0)
    return;
  const n = t[0].dataPoint;
  return {
    chartType: "gauge",
    groups: [
      {
        labeledValues: [
          {
            label: n.label,
            value: `(${ti(n.rangeStart, e)} - ${ti(n.rangeEnd, e)})`,
            color: n.color,
            dataPoint: n
          }
        ]
      }
    ]
  };
}, Ry = 2, Ly = (e, t, n) => {
  const r = t - Math.PI / 2, i = e - n - Dy, a = i - Ty, s = Math.cos(r) * i, o = Math.sin(r) * i, c = r + Math.PI / 2, l = Ay / 2, u = Math.cos(r) * a + Math.cos(c) * l, h = Math.sin(r) * a + Math.sin(c) * l, d = Math.cos(r) * a - Math.cos(c) * l, f = Math.sin(r) * a - Math.sin(c) * l, m = Ry, y = Math.sqrt((u - s) ** 2 + (h - o) ** 2), g = (u - s) / y, p = (h - o) / y, x = Math.sqrt(
    (d - u) ** 2 + (f - h) ** 2
  ), w = (d - u) / x, v = (f - h) / x, T = Math.sqrt((s - d) ** 2 + (o - f) ** 2), A = (s - d) / T, R = (o - f) / T, O = s - A * m, E = o - R * m, N = s + g * m, _ = o + p * m, D = u - g * m, b = h - p * m, S = u + w * m, L = h + v * m, M = d - w * m, k = f - v * m, H = d + A * m, F = f + R * m;
  return `M ${N} ${_} L ${D} ${b} Q ${u} ${h} ${S} ${L} L ${M} ${k} Q ${d} ${f} ${H} ${F} L ${O} ${E} Q ${s} ${o} ${N} ${_} Z`;
}, ky = (e, t, n, r, i) => {
  const a = -(Math.PI / 2 + $t), o = Math.PI / 2 + $t - a, c = Sc / e, l = o / t.length;
  return t.map((u, h) => {
    const d = h > 0 ? c / 2 : 0, f = h < t.length - 1 ? c / 2 : 0, m = a + h * l + d, y = a + (h + 1) * l - f, g = r >= u.start && r <= u.end;
    return { path: i({
      innerRadius: e - Rr,
      outerRadius: e,
      startAngle: m,
      endAngle: y
    }) ?? "", isActive: g, color: u.color, threshold: u };
  });
};
function JS({
  value: e,
  maxValue: t,
  thresholds: n = [],
  defaultLabel: r,
  defaultColor: i = Ey,
  className: a,
  valueFormatOptions: s = { valueType: mc.Auto },
  variant: o = "default",
  showArrow: c = !0,
  enableTooltip: l = !0
}) {
  const u = lt(null), h = lt(null), [d, f] = St({ width: 0, height: 0 }), m = ai(Ny(s), ii), y = Y(
    (b) => {
      f(b);
    },
    []
  );
  vn(u, y);
  const g = Y(
    (b, S) => {
      if (!l || o !== "segmented" || !h.current) return;
      const L = {
        label: S.threshold.tooltipLabel ?? S.threshold.label,
        rangeStart: S.threshold.start,
        rangeEnd: S.threshold.end,
        color: S.color
      };
      m.showWithData(
        h.current,
        [
          {
            dataPoint: L,
            context: void 0,
            location: { x: b.clientX, y: b.clientY }
          }
        ],
        { x: b.clientX, y: b.clientY },
        {
          type: ee.FollowMouse,
          boundingElement: h.current,
          offsetX: b.clientX,
          offsetY: b.clientY
        }
      );
    },
    [l, o, e, m]
  ), p = Y(() => {
    !l || o !== "segmented" || m.hide();
  }, [l, o, m]), x = Y(() => Pl().cornerRadius(My), []), w = Y(
    (b) => x()({
      innerRadius: b - Rr,
      outerRadius: b,
      startAngle: -Math.PI / 2 - $t,
      endAngle: Math.PI / 2 + $t
    }) ?? "",
    [x]
  ), v = Y(
    (b, S) => {
      const L = -(Math.PI / 2 + $t), k = Math.PI / 2 + $t - L, H = Math.min(S.value / S.maxValue, 1), F = L + H * k;
      return x()({
        innerRadius: b - Rr,
        outerRadius: b,
        startAngle: L,
        endAngle: F
      }) ?? "";
    },
    [x]
  ), T = Y(
    (b, S) => {
      const L = -(Math.PI / 2 + $t), k = Math.PI / 2 + $t - L, H = Math.min(b / S, 1);
      return L + H * k;
    },
    []
  ), A = Y(
    (b, S, L) => {
      const M = -(Math.PI / 2 + $t), H = Math.PI / 2 + $t - M, F = n.find(
        (J) => b >= J.start && b <= J.end
      );
      if (!F) {
        const J = Math.min(b / S, 1);
        return M + J * H;
      }
      const U = n.indexOf(F), W = Sc / L, X = H / n.length, Q = U > 0 ? W / 2 : 0, Z = U < n.length - 1 ? W / 2 : 0, et = M + U * X + Q, ut = M + (U + 1) * X - Z;
      return (et + ut) / 2;
    },
    [n]
  ), R = Y((b) => b * $t, []), O = Y((b) => b / (1 + $t), []), E = Y(
    (b, S) => {
      if (S > b / 2) {
        const L = b / 2;
        return R(L) + L <= S ? L : O(S);
      }
      return O(S);
    },
    [R, O]
  ), N = Y(() => {
    if (e !== void 0 && t !== void 0 && t > 0) {
      const b = n.find(
        (S) => e >= S.start && e <= S.end
      );
      return {
        value: e,
        maxValue: t,
        label: b?.label ?? r ?? "",
        color: b?.color ?? i
      };
    }
  }, [e, t, n, r, i]), _ = Y(
    (b, S) => {
      if (S !== void 0)
        return {
          valueArc: v(b, S),
          ...S
        };
    },
    [v]
  ), D = ft(() => {
    const b = N();
    if (!b)
      return;
    const { width: S, height: L } = d;
    if (S === 0 || L === 0)
      return;
    const M = L - To - _y;
    if (S <= 0 || M <= 0)
      return;
    const k = E(S, M), H = x(), F = o === "segmented" && n.length > 0 ? A(
      b.value,
      b.maxValue,
      k
    ) : T(b.value, b.maxValue), U = c ? Ly(k, F, Rr) : void 0, W = o === "segmented" && n.length > 0 ? ky(
      k,
      n,
      b.maxValue,
      b.value,
      H
    ) : void 0;
    return {
      origin: { x: S / 2, y: To + k },
      radius: k,
      backgroundArc: w(k),
      data: _(k, b),
      arrowPath: U,
      segmentArcs: W,
      activeColor: b.color
    };
  }, [
    N,
    d,
    E,
    w,
    _,
    x,
    T,
    A,
    o,
    n,
    c
  ]);
  return /* @__PURE__ */ C(
    "div",
    {
      ref: u,
      className: `gauge-container h-full w-full min-w-[80px] ${a ?? ""}`,
      children: D && /* @__PURE__ */ C("svg", { ref: h, className: "gauge h-full w-full viz-font-family", children: /* @__PURE__ */ V(
        "g",
        {
          transform: `translate(${D.origin.x}, ${D.origin.y})`,
          children: [
            D.radius > Cy && /* @__PURE__ */ V(Oe, { children: [
              o === "segmented" && D.segmentArcs ? (
                // Segmented variant - render individual segment arcs
                /* @__PURE__ */ C(Oe, { children: D.segmentArcs.map((b, S) => /* @__PURE__ */ C(
                  "path",
                  {
                    className: Da("gauge-segment", {
                      pointer: l
                    }),
                    d: b.path,
                    fill: b.isActive ? b.color : Ao,
                    filter: b.isActive ? Ht.getDropShadowColor(b.color) : void 0,
                    onMouseMove: (L) => g(L, b),
                    onMouseLeave: p
                  },
                  S
                )) })
              ) : (
                // Default variant - background ring and value arc
                /* @__PURE__ */ V(Oe, { children: [
                  /* @__PURE__ */ C(
                    "path",
                    {
                      className: "gauge-ring",
                      d: D.backgroundArc,
                      fill: Ao
                    }
                  ),
                  D.data && /* @__PURE__ */ C(
                    "path",
                    {
                      className: "value-ring",
                      d: D.data.valueArc,
                      fill: D.data.color,
                      filter: Ht.getDropShadowColor(
                        D.data.color
                      )
                    }
                  )
                ] })
              ),
              D.arrowPath && /* @__PURE__ */ C("path", { className: "gauge-arrow", d: D.arrowPath })
            ] }),
            D.data && /* @__PURE__ */ V(
              "g",
              {
                className: "gauge-data-group",
                "aria-label": `${D.data.value} of ${D.data.maxValue}`,
                children: [
                  /* @__PURE__ */ C(
                    "text",
                    {
                      x: "0",
                      y: D.data.label ? "-36" : "-16",
                      className: "gauge-value-display font-heading-section",
                      children: ti(D.data.value, s)
                    }
                  ),
                  D.data.label && /* @__PURE__ */ C(
                    "text",
                    {
                      x: "0",
                      y: "-8",
                      className: "gauge-label-display font-caption-normal",
                      children: D.data.label
                    }
                  )
                ]
              }
            )
          ]
        }
      ) })
    }
  );
}
class tx {
  dateCoercer = new $e();
  transform(t, n = "ago", r) {
    if (t == null || t === 0)
      return "-";
    const i = this.calcSecondsAgo(
      t,
      r ?? this.dateCoercer
    );
    if (pe(i))
      return "-";
    const a = new ct(i, j.Second);
    return a.getAmountForUnit(j.Minute) < 1 ? "Just now" : `${a.getMostSignificantUnitOnly().toLongString()} ${n}`;
  }
  calcSecondsAgo(t, n) {
    const r = n.coerce(t);
    if (!pe(r))
      return Math.floor((Date.now() - r.getTime()) / 1e3);
  }
}
const Iy = (e, t = "-", n = !0) => {
  if (e === null || e === "null" || !n && Oc(e) && en(Bc(e)))
    return t;
  switch (typeof e) {
    case "object":
      return Array.isArray(e) ? `${e.map((r) => Iy(r, t)).join(", ")}` : "Object";
    case "undefined":
      return t;
    case "function":
      return "Function";
    case "string":
      return e;
    case "boolean":
    case "number":
    case "bigint":
    case "symbol":
    default:
      return String(e);
  }
}, ex = (e) => (
  // Replace all whitespace with a single space
  e.replace(/\s\s+/g, " ")
), nx = (e) => e.split(",").map((t) => t.trim()).filter((t) => t !== ""), Oy = ["API", "GRPC", "HTTP", "ID", "IP", "URL"], rx = (e, t = "-") => {
  const n = new RegExp(
    `\\b(${Oy.map(es).join("|")})\\b`,
    "gi"
  );
  return pe(e) ? t : Pc(Fc(e)).replace(
    n,
    (r) => es(r)
  );
}, By = Yo(
  function({
    stateManager: t,
    zoom: n,
    currentTopology: r,
    onRelayout: i,
    enableDemarcation: a = !1,
    zoomable: s = !0,
    settingsSlot: o
  }) {
    const [c, l] = St("100"), [u, h] = St(!0), [d, f] = St(!0), m = a ? 60 : 0;
    wt(() => {
      if (!n) return;
      const w = n.zoomChange$.subscribe((v) => {
        l((v * 100).toFixed()), h(n.canIncreaseScale()), f(n.canDecreaseScale());
      });
      return () => w.unsubscribe();
    }, [n]);
    const y = Y(() => {
      n?.setZoomScale(n.getZoomScale() + 0.1);
    }, [n]), g = Y(() => {
      n?.setZoomScale(n.getZoomScale() - 0.1);
    }, [n]), p = Y(() => {
      n && r && n.zoomToFit(r().nodes, m);
    }, [n, r, m]), x = Y(() => {
      i?.(), n && r && n.panToTopLeft(r().nodes, m);
    }, [i, n, r, m]);
    return t ? /* @__PURE__ */ V("div", { className: "flex flex-row items-center gap-cn-xs", children: [
      /* @__PURE__ */ C(
        "button",
        {
          onClick: x,
          className: "rounded-cn-2 bg-cn-background-1 text-cn-foreground-2 border border-cn-borders-3 flex items-center justify-center h-6 w-6 cursor-pointer",
          type: "button",
          title: "Relayout",
          children: /* @__PURE__ */ V(
            "svg",
            {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ C("path", { d: "M23 4v6h-6M1 20v-6h6" }),
                /* @__PURE__ */ C("path", { d: "M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" })
              ]
            }
          )
        }
      ),
      s && /* @__PURE__ */ V(Oe, { children: [
        /* @__PURE__ */ C(
          "button",
          {
            onClick: p,
            className: "rounded-cn-2 bg-cn-background-1 text-cn-foreground-2 border border-cn-borders-3 flex items-center justify-center h-6 w-6 cursor-pointer",
            type: "button",
            title: "Zoom to fit",
            children: /* @__PURE__ */ C(
              "svg",
              {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: /* @__PURE__ */ C("path", { d: "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" })
              }
            )
          }
        ),
        /* @__PURE__ */ V("div", { className: "rounded-cn-2 bg-cn-background-1 text-cn-foreground-2 border border-cn-borders-3 flex flex-row items-center", children: [
          /* @__PURE__ */ C(
            "button",
            {
              onClick: g,
              disabled: !d,
              className: "flex items-center justify-center h-6 w-6 border-none bg-transparent cursor-pointer disabled:cursor-default disabled:opacity-40",
              type: "button",
              title: "Decrease Zoom",
              children: /* @__PURE__ */ C(
                "svg",
                {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ C("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
                }
              )
            }
          ),
          /* @__PURE__ */ C(
            "button",
            {
              onClick: y,
              disabled: !u,
              className: "flex items-center justify-center h-6 w-6 border-none bg-transparent cursor-pointer disabled:cursor-default disabled:opacity-40",
              type: "button",
              title: "Increase Zoom",
              children: /* @__PURE__ */ V(
                "svg",
                {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ C("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
                    /* @__PURE__ */ C("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ V("span", { className: "w-[60px] text-center text-cn-foreground-2 text-cn-size-1 font-medium border-l border-cn-borders-3 ml-0.5 pl-cn-sm pr-cn-xs", children: [
            c,
            "%"
          ] })
        ] })
      ] }),
      o
    ] }) : null;
  }
);
var pi = /* @__PURE__ */ ((e) => (e.GroupNode = "group-node", e))(pi || {}), On = /* @__PURE__ */ ((e) => (e.ForceLayout = "force-layout", e.TreeLayout = "tree-layout", e.CustomTreeLayout = "custom-tree-layout", e.GraphLayout = "graph-layout", e.VerticalGraphLayout = "vertical-graph-layout", e))(On || {}), At = /* @__PURE__ */ ((e) => (e.Normal = "normal", e.Emphasized = "emphasized", e.Focused = "focused", e.Background = "background", e.Hidden = "hidden", e))(At || {});
function xc(e, t, n) {
  const r = new Set(t), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  t.forEach((s) => {
    s.edges.forEach((o) => {
      r.has(o.fromNode) && !r.has(o.toNode) && i.add(o.toNode), !r.has(o.fromNode) && r.has(o.toNode) && a.add(o.fromNode);
    });
  }), i.forEach((s) => {
    const o = Do(e, s, n);
    e.edges.push(o), s.edges.push(o);
  }), a.forEach((s) => {
    const o = Do(s, e, n);
    e.edges.push(o), s.edges.push(o);
  });
}
function Do(e, t, n) {
  const r = { fromNode: e, toNode: t };
  return n && (r.edgeType = n), r;
}
const Py = 3;
function Fy(e, t) {
  const n = e.metadata?.[t];
  if (n !== void 0) return n.toString();
  const r = e[t];
  if (r !== void 0 && typeof r != "object")
    return String(r);
}
function Uy(e, t, n) {
  return `${e} (${n})`;
}
function Hy(e, t) {
  const n = t.fieldExtractor ?? Fy, r = t.groupTitleBuilder ?? Uy, i = t.minGroupSize ?? Py, a = t.maxSubGroupSize;
  return t.discriminator && t.rules ? zy(
    e,
    t,
    n,
    r,
    i,
    a
  ) : t.fields && t.fields.length > 0 ? Qa(
    e,
    t.fields,
    n,
    r,
    i,
    t.groupColorResolver,
    a
  ) : e;
}
function zy(e, t, n, r, i, a) {
  const s = t.discriminator, o = /* @__PURE__ */ new Map();
  e.forEach((l) => {
    const u = l[s]?.toString() ?? "__other__";
    o.has(u) || o.set(u, []), o.get(u).push(l);
  });
  const c = [];
  return o.forEach((l, u) => {
    const h = t.rules?.[u] ?? t.defaultRule;
    if (!h || h.fields.length === 0) {
      c.push(...l);
      return;
    }
    const d = Qa(
      l,
      h.fields,
      n,
      r,
      i,
      t.groupColorResolver,
      a
    );
    c.push(...d);
  }), c;
}
function Qa(e, t, n, r, i, a, s, o = 0) {
  if (t.length === 0 || e.length === 0)
    return e;
  const c = t[0], l = t.slice(1), u = /* @__PURE__ */ new Map();
  e.forEach((d) => {
    const f = n(d, c) ?? "__ungrouped__";
    u.has(f) || u.set(f, []), u.get(f).push(d);
  });
  const h = [];
  return u.forEach((d, f) => {
    if (d.length < i) {
      h.push(...d);
      return;
    }
    let m;
    l.length > 0 ? m = Qa(
      d,
      l,
      n,
      r,
      i,
      a,
      s,
      o + 1
    ) : s && d.length > s ? m = $y(d, s, f) : m = d;
    const y = {
      title: r(f, c, d.length),
      color: a?.(f, c)
    }, g = {
      nodeType: pi.GroupNode,
      expanded: !1,
      data: y,
      children: m,
      edges: []
    }, p = wc(d);
    xc(g, d, p), h.push(g), h.push(...m);
  }), h;
}
function wc(e) {
  for (const t of e)
    for (const n of t.edges)
      if ("edgeType" in n)
        return n.edgeType;
}
function $y(e, t, n) {
  const r = [], i = Math.ceil(e.length / t);
  for (let a = 0; a < i; a++) {
    const s = a * t, o = e.slice(s, s + t), c = {
      title: `${n} ${a + 1}/${i} (${o.length})`
    }, l = {
      nodeType: pi.GroupNode,
      expanded: !1,
      data: c,
      children: o,
      edges: []
    }, u = wc(o);
    xc(l, o, u), r.push(l), r.push(...o);
  }
  return r;
}
const Wy = /* @__PURE__ */ new Set([
  "edges",
  "metadata",
  "nodeType",
  "edgeType",
  "color",
  "icon",
  "name"
]);
function bc(e, t) {
  const n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = {}, a = {}, s = /* @__PURE__ */ new Set();
  e.forEach((c) => {
    c.metadata && Object.keys(c.metadata).forEach((l) => n.add(l));
    for (const l of Object.keys(c)) {
      if (Wy.has(l)) continue;
      typeof c[l] == "string" && s.add(l);
    }
  }), s.forEach((c) => {
    const l = /* @__PURE__ */ new Set();
    e.forEach((u) => {
      const h = u[c];
      typeof h == "string" && l.add(h);
    }), l.size > 1 && l.size < e.length * 0.5 && (r.add(c), i[c] = Array.from(l));
  });
  const o = t ?? Array.from(r)[0];
  if (o) {
    const c = /* @__PURE__ */ new Map();
    e.forEach((l) => {
      const u = l[o]?.toString() ?? "__other__";
      c.has(u) || c.set(u, []), c.get(u).push(l);
    }), c.forEach((l, u) => {
      const h = /* @__PURE__ */ new Set();
      l.forEach((d) => {
        d.metadata && Object.keys(d.metadata).forEach((f) => h.add(f));
      }), a[u] = Array.from(h);
    }), i[o] || (i[o] = Array.from(
      new Set(
        e.map(
          (l) => l[o]?.toString() ?? "__other__"
        )
      )
    ));
  }
  return {
    discriminatorOptions: Array.from(r),
    discriminatorValues: i,
    metadataKeys: Array.from(n),
    perTypeMetadataKeys: a
  };
}
class Ut {
  static isTopologyGroupNode(t) {
    return "nodeType" in t && t.nodeType === pi.GroupNode;
  }
  static getUpdatedNodesOnGroupNodeClick(t, n) {
    const r = t.children;
    return t.expanded = !t.expanded, t.expanded ? [n, r].flat() : n.filter((i) => !r.includes(i));
  }
  static updateLayoutForGroupNode(t, n) {
    const r = t.nodes.find(
      (u) => u.userNode === n
    ), i = t.nodes.filter(
      (u) => n.children.includes(u.userNode)
    ), a = 0;
    if (!r)
      return;
    const s = r.renderedData()?.getBoudingBox();
    if (!s)
      return;
    const o = t.nodes.filter((u) => {
      const h = u.renderedData()?.getBoudingBox();
      return h ? !n.children.includes(u.userNode) && (h.left >= s.left && h.left <= s.right || h.right >= s.left && h.right <= s.right) && h.top > s.bottom : !1;
    }), c = (s.height + 20) * n.children.length;
    if (!n.expanded) {
      o.forEach((u) => u.y = u.y - c), t.demarcations?.forEach((u) => {
        u.verticalDimension.end = u.verticalDimension.end - c;
      });
      return;
    }
    if (i.length === 0)
      return;
    let l = s.bottom + 20;
    i.forEach((u) => {
      u.x = r.x + a, u.y = l, l += (u.renderedData()?.getBoudingBox()?.height ?? 36) + 20;
    }), o.forEach((u) => u.y = u.y + c), t.demarcations?.forEach((u) => {
      u.verticalDimension.end = u.verticalDimension.end + c;
    });
  }
  static updateLayoutOnGroupNodeDrag(t, n) {
    const r = t.node.userNode;
    if (this.isTopologyGroupNode(r)) {
      const i = r.children;
      let a = t.node.y + (t.node.renderedData()?.getBoudingBox()?.height ?? 36) + 20;
      n.nodes.forEach((s) => {
        i.includes(s.userNode) && (s.x = 20 + t.node.x, s.y = a, a += (s.renderedData()?.getBoudingBox()?.height ?? 36) + 20);
      });
    }
  }
  static collapseGroupNodes(t) {
    const n = t.filter(
      (i) => this.isTopologyGroupNode(i)
    );
    let r = t;
    return n.forEach((i) => {
      const a = i.children;
      i.expanded = !1, r = r.filter((s) => !a.includes(s));
    }), r;
  }
}
const Yy = 80, Gy = 16, Mo = 80;
function Co(e, t) {
  const n = e[t];
  if (typeof n == "string") return n;
  const r = e.metadata?.[t];
  if (r !== void 0) return String(r);
}
function Vy(e, t) {
  const n = Co(e, t);
  if (n !== void 0) return n;
  if (Ut.isTopologyGroupNode(e)) {
    const r = Tc(e);
    if (r)
      return Co(r, t) ?? "__other__";
  }
  return "__other__";
}
function Tc(e) {
  for (const t of e.children) {
    if (!Ut.isTopologyGroupNode(t)) return t;
    const n = Tc(t);
    if (n) return n;
  }
}
function Xy(e, t) {
  if (e.nodes.length === 0) return [];
  const n = /* @__PURE__ */ new Map();
  if (e.nodes.forEach((o) => {
    const c = Vy(o.userNode, t);
    n.has(c) || n.set(c, []), n.get(c).push(o);
  }), n.size <= 1) return [];
  const r = Math.min(...e.nodes.map((o) => o.y)), i = Math.max(
    ...e.nodes.map(
      (o) => o.renderedData()?.getBoudingBox()?.bottom ?? o.y
    )
  ), a = {
    start: r - Yy,
    end: i + Gy
  }, s = [];
  return n.forEach((o, c) => {
    if (o.length === 0) return;
    const l = Math.min(...o.map((h) => h.x)), u = Math.max(
      ...o.map(
        (h) => h.renderedData()?.getBoudingBox()?.right ?? h.x + 160
      )
    );
    s.push({
      title: c,
      horizontalDimension: {
        start: l - Mo,
        end: u + Mo
      },
      verticalDimension: a,
      bordered: !0,
      backgroundColor: "var(--cn-bg-2)",
      sortX: l
    });
  }), s.sort((o, c) => o.sortX - c.sortX), s.map(({ sortX: o, ...c }) => c);
}
const Sr = "type", jy = [2, 3, 5, 10, 20, 40, 50, 100].map((e) => ({
  value: String(e),
  label: String(e)
})), qy = [
  { value: "", label: "No limit" },
  ...[5, 10, 15, 20, 40, 50].map((e) => ({
    value: String(e),
    label: String(e)
  }))
];
function Zy(e) {
  if (!e?.rules) return {};
  const t = {};
  return Object.entries(e.rules).forEach(([n, r]) => {
    t[n] = [...r.fields];
  }), t;
}
const Ky = Yo(function({
  nodes: t,
  autoGroupConfig: n,
  onGroupingChange: r,
  settingsState: i,
  onSettingsChange: a
}) {
  const s = !!n, [o, c] = St(
    String(n?.minGroupSize ?? 3)
  ), [l, u] = St(
    n?.maxSubGroupSize ? String(n.maxSubGroupSize) : ""
  ), [h, d] = St(
    () => Zy(n)
  ), f = ft(
    () => bc(
      t,
      Sr
    ),
    [t]
  ), m = ft(
    () => f.discriminatorValues[Sr] ?? [],
    [f]
  ), y = ft(() => {
    const E = {};
    return t.forEach((N) => {
      const _ = N[Sr]?.toString() ?? "?";
      E[_] = (E[_] ?? 0) + 1;
    }), E;
  }, [t]), g = Y(
    (E, N, _, D) => {
      if (!E) {
        r(void 0);
        return;
      }
      const b = {};
      if (Object.entries(N).forEach(([S, L]) => {
        L.length > 0 && (b[S] = { fields: L });
      }), Object.keys(b).length === 0) {
        r(void 0);
        return;
      }
      r({
        discriminator: Sr,
        rules: b,
        minGroupSize: Number(_),
        maxSubGroupSize: D ? Number(D) : void 0
      });
    },
    [r]
  ), p = Y(
    (E) => {
      if (E) {
        const N = {};
        m.forEach((_) => {
          const D = f.perTypeMetadataKeys[_] ?? [];
          D.length > 0 && (N[_] = [D[0]]);
        }), d(N), g(!0, N, o, l);
      } else
        d({}), g(!1, {}, o, l);
    },
    [
      m,
      f.perTypeMetadataKeys,
      o,
      l,
      g
    ]
  ), x = Y(
    (E) => {
      c(E), g(s, h, E, l);
    },
    [s, h, l, g]
  ), w = Y(
    (E) => {
      u(E), g(s, h, o, E);
    },
    [s, h, o, g]
  ), v = Y(
    (E) => {
      d((N) => {
        const _ = N[E] ?? [], D = (f.perTypeMetadataKeys[E] ?? []).filter((S) => !_.includes(S));
        if (D.length === 0) return N;
        const b = { ...N, [E]: [..._, D[0]] };
        return g(!0, b, o, l), b;
      });
    },
    [
      f.perTypeMetadataKeys,
      o,
      l,
      g
    ]
  ), T = Y(
    (E, N) => {
      d((_) => {
        const D = {
          ..._,
          [E]: (_[E] ?? []).filter((b, S) => S !== N)
        };
        return g(!0, D, o, l), D;
      });
    },
    [o, l, g]
  ), A = Y(
    (E, N, _) => {
      d((D) => {
        const b = [...D[E] ?? []];
        b[N] = _;
        const S = { ...D, [E]: b };
        return g(!0, S, o, l), S;
      });
    },
    [o, l, g]
  ), R = Y(
    (E, N) => {
      a({ ...i, [E]: N });
    },
    [i, a]
  ), O = m.length > 1;
  return /* @__PURE__ */ V(fe.Root, { children: [
    /* @__PURE__ */ C(fe.Trigger, { asChild: !0, children: /* @__PURE__ */ C(
      "button",
      {
        className: "rounded-cn-2 bg-cn-background-1 text-cn-foreground-2 border border-cn-borders-3 flex items-center justify-center h-6 w-6 cursor-pointer",
        type: "button",
        title: "Topology settings",
        children: /* @__PURE__ */ V(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ C("circle", { cx: "12", cy: "12", r: "3" }),
              /* @__PURE__ */ C("path", { d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" })
            ]
          }
        )
      }
    ) }),
    /* @__PURE__ */ C(
      fe.Content,
      {
        side: "bottom",
        align: "end",
        sideOffset: 4,
        className: "w-96 p-0",
        children: /* @__PURE__ */ V("div", { className: "flex flex-col gap-cn-sm p-cn-md", children: [
          /* @__PURE__ */ C("span", { className: "text-cn-foreground-1 font-semibold text-cn-size-4", children: "Settings" }),
          /* @__PURE__ */ V("div", { className: "flex flex-col gap-cn-xs", children: [
            /* @__PURE__ */ C(
              wn,
              {
                id: "topo-move-nodes",
                checked: i.draggableNodes,
                onCheckedChange: (E) => R("draggableNodes", E === !0),
                label: "Move nodes"
              }
            ),
            /* @__PURE__ */ C(
              wn,
              {
                id: "topo-zoom",
                checked: i.zoomable,
                onCheckedChange: (E) => R("zoomable", E === !0),
                label: "Zoom & pan"
              }
            ),
            /* @__PURE__ */ C(
              wn,
              {
                id: "topo-brush",
                checked: i.showBrush,
                onCheckedChange: (E) => R("showBrush", E === !0),
                label: "Brush selection"
              }
            ),
            /* @__PURE__ */ C(
              wn,
              {
                id: "topo-fit",
                checked: i.shouldAutoZoomToFit,
                onCheckedChange: (E) => R("shouldAutoZoomToFit", E === !0),
                label: "Auto zoom to fit"
              }
            )
          ] }),
          O && /* @__PURE__ */ V(Oe, { children: [
            /* @__PURE__ */ C("div", { className: "border-t border-cn-borders-3" }),
            /* @__PURE__ */ C(
              wn,
              {
                id: "group-by-type",
                checked: s,
                onCheckedChange: (E) => p(E === !0),
                label: "Group by node type"
              }
            ),
            s && /* @__PURE__ */ V(Oe, { children: [
              /* @__PURE__ */ V("div", { className: "flex items-center gap-cn-md", children: [
                /* @__PURE__ */ V("div", { className: "flex items-center gap-cn-2xs", children: [
                  /* @__PURE__ */ C("span", { className: "text-cn-foreground-3 text-cn-size-2", children: "Group when nodes >" }),
                  /* @__PURE__ */ C("div", { className: "w-20", children: /* @__PURE__ */ C(
                    Ar,
                    {
                      options: jy,
                      value: o,
                      onChange: (E) => E && x(E)
                    }
                  ) })
                ] }),
                /* @__PURE__ */ V("div", { className: "flex items-center gap-cn-2xs", children: [
                  /* @__PURE__ */ C("span", { className: "text-cn-foreground-3 text-cn-size-2", children: "Max nodes per group" }),
                  /* @__PURE__ */ C("div", { className: "w-24", children: /* @__PURE__ */ C(
                    Ar,
                    {
                      options: qy,
                      value: l,
                      onChange: (E) => w(E ?? "")
                    }
                  ) })
                ] })
              ] }),
              /* @__PURE__ */ C("div", { className: "border-t border-cn-borders-3 pt-cn-sm flex flex-col gap-cn-sm", children: m.map((E) => {
                const N = h[E] ?? [], _ = (f.perTypeMetadataKeys[E] ?? []).map((D) => ({ value: D, label: D }));
                return /* @__PURE__ */ V("div", { className: "flex flex-col gap-cn-2xs", children: [
                  /* @__PURE__ */ V("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ V("span", { className: "text-cn-foreground-2 font-medium text-cn-size-3", children: [
                      E,
                      " ",
                      /* @__PURE__ */ V("span", { className: "text-cn-foreground-3 font-normal", children: [
                        "(",
                        y[E] ?? 0,
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ C(
                      "button",
                      {
                        onClick: () => v(E),
                        disabled: N.length >= _.length,
                        className: "text-cn-foreground-3 hover:text-cn-foreground-1 cursor-pointer disabled:opacity-40 disabled:cursor-default text-cn-size-2 px-1",
                        type: "button",
                        title: "Add grouping level",
                        children: "+"
                      }
                    )
                  ] }),
                  N.length === 0 && /* @__PURE__ */ C("span", { className: "text-cn-foreground-3 italic text-cn-size-2 pl-cn-xs", children: "(none)" }),
                  N.map((D, b) => /* @__PURE__ */ V(
                    "div",
                    {
                      className: "flex items-center gap-cn-2xs pl-cn-xs",
                      children: [
                        b > 0 && /* @__PURE__ */ C("span", { className: "text-cn-foreground-3 text-cn-size-2", children: "then" }),
                        /* @__PURE__ */ C("div", { className: "flex-1", children: /* @__PURE__ */ C(
                          Ar,
                          {
                            options: _,
                            value: D,
                            onChange: (S) => S && A(E, b, S)
                          }
                        ) }),
                        /* @__PURE__ */ C(
                          "button",
                          {
                            onClick: () => T(E, b),
                            className: "text-cn-foreground-3 hover:text-cn-foreground-1 cursor-pointer text-cn-size-2",
                            type: "button",
                            children: "x"
                          }
                        )
                      ]
                    },
                    b
                  ))
                ] }, E);
              }) })
            ] })
          ] })
        ] })
      }
    )
  ] });
});
var qn = /* @__PURE__ */ ((e) => (e.Meta = "Meta", e.Control = "Control", e))(qn || {});
class Qy {
  convertTopology(t, n, r, i, a = !1) {
    const s = this.buildRenderableNodeMap(
      t,
      n,
      r,
      i && i.nodes
    ), o = this.findUniqueEdges(t);
    return {
      nodes: Array.from(s.values()),
      edges: this.convertEdgesToRenderableEdges(
        o,
        s,
        n,
        a
      ),
      neighborhood: {
        nodes: t,
        edges: o
      },
      demarcations: i?.demarcations ?? []
    };
  }
  buildRenderableNodeMap(t, n, r, i = []) {
    const a = new WeakMap(
      i.map((o) => [o.userNode, o])
    ), s = /* @__PURE__ */ new Map();
    return t.forEach((o) => {
      s.set(
        o,
        this.buildNewTopologyNode(
          o,
          n.getNodeState(o),
          r,
          a.get(o)
        )
      );
    }), s;
  }
  findUniqueEdges(t) {
    const n = /* @__PURE__ */ new WeakMap(), r = [];
    return t.forEach((i) => {
      i.edges.forEach((a) => {
        const s = n.get(a.fromNode) || /* @__PURE__ */ new WeakSet();
        n.set(a.fromNode, s), s.has(a.toNode) || (r.push(a), s.add(a.toNode));
      });
    }), r;
  }
  convertEdgesToRenderableEdges(t, n, r, i = !1) {
    let a = t;
    return i && (a = t.filter(
      (s) => n.get(s.fromNode) !== void 0 && n.get(s.toNode) !== void 0
    ).filter((s) => this.handleEdgeFilteringBasedOnGroupNode(s))), a.filter(
      (s) => n.get(s.fromNode) !== void 0 && n.get(s.toNode) !== void 0
    ).map((s) => {
      const o = n.get(s.fromNode), c = n.get(s.toNode);
      return this.buildNewTopologyEdge(
        s,
        o,
        c,
        r.getEdgeState(s)
      );
    });
  }
  handleEdgeFilteringBasedOnGroupNode(t) {
    return !(Ut.isTopologyGroupNode(t.fromNode) && t.fromNode.expanded || Ut.isTopologyGroupNode(t.toNode) && t.toNode.expanded);
  }
  buildNewTopologyNode(t, n, r, i) {
    const a = {
      incoming: [],
      outgoing: [],
      state: n,
      x: i ? i.x : 0,
      y: i ? i.y : 0,
      userNode: t,
      renderedData: () => r.getRenderedNodeData(a)
    };
    return a;
  }
  buildNewTopologyEdge(t, n, r, i) {
    const a = {
      source: n,
      target: r,
      userEdge: t,
      state: i
    };
    return n.outgoing.push(a), r.incoming.push(a), a;
  }
}
class Jy {
  neighborhoodForNode(t) {
    return {
      nodes: Hn([
        t,
        ...t.edges.flatMap((n) => [n.fromNode, n.toNode]),
        ...Ut.isTopologyGroupNode(t) && t.expanded ? t.children : []
      ]),
      edges: [...t.edges]
    };
  }
  neighborhoodForEdge(t) {
    return {
      nodes: [t.fromNode, t.toNode],
      edges: [t]
    };
  }
  singleNodeNeighborhood(t) {
    return {
      nodes: [t],
      edges: []
    };
  }
  emptyNeighborhood() {
    return {
      nodes: [],
      edges: []
    };
  }
}
class Ja {
  constructor(t, n) {
    this.d3Utils = t, this.eventScope = n;
  }
  buildLookupMap(t, n) {
    return new Map(
      t.map(
        (r) => [n(r), r]
      ).filter(
        (r) => r[0] !== void 0
      )
    );
  }
  buildObservableForEvents(t, n, ...r) {
    if (t.length === 0)
      return Xo;
    const i = new Aa(), a = this.buildLookupMap(t, n), s = this.d3Utils.selectAll(Array.from(a.keys()));
    return r.forEach(({ eventName: o, callback: c }) => {
      s.on(this.scopeEventName(o), (l) => {
        c(a.get(l.currentTarget), i);
      });
    }), i.asObservable();
  }
  scopeEventName(t) {
    return this.eventScope !== void 0 ? `${t}.${this.eventScope}` : t;
  }
}
class tv extends Ja {
  constructor(t) {
    super(t, "topology-click");
  }
  addNodeClickBehavior(t, n) {
    return this.buildObservableForEvents(
      t,
      (r) => n.getElementForNode(r),
      {
        eventName: "click",
        callback: (r, i) => this.onNodeClick(r, i)
      }
    );
  }
  addEdgeClickBehavior(t, n) {
    return this.buildObservableForEvents(
      t,
      (r) => n.getElementForEdge(r),
      {
        eventName: "click",
        callback: (r, i) => this.onEdgeClick(r, i)
      }
    );
  }
  onNodeClick(t, n) {
    n.next(t);
  }
  onEdgeClick(t, n) {
    n.next(t);
  }
}
class ev extends Ja {
  addDragBehavior(t, n, r) {
    if (t.nodes.length === 0)
      return Xo;
    let i = this.buildLookupMap(
      t.nodes,
      (l) => n.getElementForNode(l)
    );
    if (r) {
      const l = t.nodes.filter((h) => Ut.isTopologyGroupNode(h.userNode)).flatMap((h) => h.userNode.children), u = t.nodes.filter(
        (h) => l.includes(h.userNode)
      );
      i = this.buildLookupMap(
        t.nodes.filter(
          (h) => !u.includes(h)
        ),
        (h) => n.getElementForNode(h)
      );
    }
    const a = new Aa(), s = (l, u) => {
      const h = i.get(l);
      h.x = u.x, h.y = u.y, a.next({
        type: "drag",
        node: h
      }), this.d3Utils.select(l).dispatch(this.getDragEventName());
    }, o = (l) => {
      a.next({
        type: "start",
        node: l
      });
    }, c = (l) => {
      a.next({
        type: "end",
        node: l
      });
    };
    return this.d3Utils.selectAll(Array.from(i.keys())).call(
      Ad().subject(function() {
        return i.get(this);
      }).on("drag", function(l) {
        s(this, { x: l.x, y: l.y });
      }).on("start", function() {
        o(i.get(this));
      }).on("end", function() {
        c(i.get(this));
      })
    ), a.asObservable();
  }
  getDragEventName() {
    return "topology-node-drag";
  }
}
class ei extends Ja {
  static DEFAULT_HOVER_OPTIONS = {
    delayMillis: 0,
    endHoverEvents: ["mouseleave"]
  };
  constructor(t) {
    super(t, "topology-hover");
  }
  delayMap = /* @__PURE__ */ new WeakMap();
  addNodeHoverBehavior(t, n, r = {}) {
    return this.buildObservableForHover(
      t,
      (i) => n.getElementForNode(i),
      this.buildDefaultedOptions(r)
    );
  }
  addEdgeHoverBehavior(t, n, r = {}) {
    return this.buildObservableForHover(
      t,
      (i) => n.getElementForEdge(i),
      this.buildDefaultedOptions(r)
    );
  }
  buildObservableForHover(t, n, r) {
    return this.buildObservableForEvents(
      t,
      n,
      {
        eventName: "mouseenter",
        callback: (i, a) => this.onMouseEnter(i, a, r.delayMillis)
      },
      ...r.endHoverEvents.map((i) => ({
        eventName: i,
        callback: (a, s) => this.onHoverEnd(a, s)
      }))
    );
  }
  buildDefaultedOptions(t) {
    const n = t.endHoverEvents ? {
      endHoverEvents: t.endHoverEvents.concat(
        ei.DEFAULT_HOVER_OPTIONS.endHoverEvents
      )
    } : {};
    return ni(n, t, ei.DEFAULT_HOVER_OPTIONS);
  }
  onMouseEnter(t, n, r) {
    this.clearAnyPendingState(t), this.delayMap.set(t, {
      id: setTimeout(
        () => this.fireStartEventAndUpdateState(t, n),
        r
      ),
      firedStart: !1
    });
  }
  onHoverEnd(t, n) {
    const r = this.clearAnyPendingState(t);
    r && r.firedStart && this.fireEndEvent(t, n);
  }
  fireStartEventAndUpdateState(t, n) {
    const r = this.delayMap.get(t);
    r && this.delayMap.set(t, {
      id: r.id,
      firedStart: !0
    }), n.next({
      source: t,
      event: "start"
    });
  }
  fireEndEvent(t, n) {
    n.next({
      source: t,
      event: "end"
    });
  }
  clearAnyPendingState(t) {
    const n = this.delayMap.get(t);
    if (n)
      return clearTimeout(n.id), this.delayMap.delete(t), n;
  }
}
class nv {
  constructor(t) {
    this.config = t, this.currentSelectedNodeSpecifier = t.nodeDataSpecifiers[0], this.currentSelectedEdgeSpecifier = t.edgeDataSpecifiers[0];
  }
  stateChangeSubject = new Aa();
  stateChange$ = this.stateChangeSubject.asObservable();
  currentStateByNode = /* @__PURE__ */ new WeakMap();
  currentStateByEdge = /* @__PURE__ */ new WeakMap();
  currentSelectedNodeSpecifier;
  currentSelectedEdgeSpecifier;
  getNodeState(t) {
    return {
      ...this.getNodeUniqueState(t),
      selectedDataSpecifier: this.currentSelectedNodeSpecifier && {
        ...this.currentSelectedNodeSpecifier
      },
      dataSpecifiers: this.config.nodeDataSpecifiers
    };
  }
  getEdgeState(t) {
    return {
      ...this.getEdgeUniqueState(t),
      selectedDataSpecifier: this.currentSelectedEdgeSpecifier && {
        ...this.currentSelectedEdgeSpecifier
      },
      dataSpecifiers: this.config.edgeDataSpecifiers
    };
  }
  updateState(...t) {
    t.forEach((n) => this.applyStateUpdate(n)), this.stateChangeSubject.next();
  }
  getSelectedNodeDataSpecifier() {
    return this.currentSelectedNodeSpecifier;
  }
  setSelectedNodeDataSpecifier(t) {
    this.currentSelectedNodeSpecifier = t, this.stateChangeSubject.next();
  }
  getSelectedEdgeDataSpecifier() {
    return this.currentSelectedEdgeSpecifier;
  }
  setSelectedEdgeDataSpecifier(t) {
    this.currentSelectedEdgeSpecifier = t, this.stateChangeSubject.next();
  }
  buildInitialNodeState() {
    return {
      visibility: At.Normal,
      dragging: !1
    };
  }
  buildInitialEdgeState() {
    return {
      visibility: At.Normal
    };
  }
  getNodeUniqueState(t) {
    const n = this.currentStateByNode.get(t) || this.buildInitialNodeState();
    return this.currentStateByNode.set(t, n), n;
  }
  getEdgeUniqueState(t) {
    const n = this.currentStateByEdge.get(t) || this.buildInitialEdgeState();
    return this.currentStateByEdge.set(t, n), n;
  }
  applyStateUpdate(t) {
    this.isNeighborhoodUpdate(t) && (this.applyNodeUpdate(t.neighborhood.nodes, t.update), this.applyEdgeUpdate(t.neighborhood.edges, t.update)), this.isNodeUpdate(t) && this.applyNodeUpdate(t.nodes, t.update), this.isEdgeUpdate(t) && this.applyEdgeUpdate(t.edges, t.update);
  }
  applyNodeUpdate(t, n) {
    t.forEach((r) => {
      this.currentStateByNode.set(r, {
        ...this.getNodeUniqueState(r),
        ...n
      });
    });
  }
  applyEdgeUpdate(t, n) {
    t.forEach((r) => {
      this.currentStateByEdge.set(r, {
        ...this.getEdgeUniqueState(r),
        ...n
      });
    });
  }
  isNeighborhoodUpdate(t) {
    return t.neighborhood !== void 0;
  }
  isNodeUpdate(t) {
    return t.nodes !== void 0;
  }
  isEdgeUpdate(t) {
    return t.edges !== void 0;
  }
}
const xr = (e) => () => e;
function rv(e, {
  sourceEvent: t,
  target: n,
  transform: r,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function de(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
de.prototype = {
  constructor: de,
  scale: function(e) {
    return e === 1 ? this : new de(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new de(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var ts = new de(1, 0, 0);
de.prototype;
function zi(e) {
  e.stopImmediatePropagation();
}
function Mn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function iv(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function av() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function _o() {
  return this.__zoom || ts;
}
function sv(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function ov() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function lv(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i),
    s > a ? (a + s) / 2 : Math.min(0, a) || Math.max(0, s)
  );
}
function cv() {
  var e = iv, t = av, n = lv, r = sv, i = ov, a = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], o = 250, c = ef, l = rr("start", "zoom", "end"), u, h, d, f = 500, m = 150, y = 0, g = 10;
  function p(S) {
    S.property("__zoom", _o).on("wheel.zoom", O, { passive: !1 }).on("mousedown.zoom", E).on("dblclick.zoom", N).filter(i).on("touchstart.zoom", _).on("touchmove.zoom", D).on("touchend.zoom touchcancel.zoom", b).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  p.transform = function(S, L, M, k) {
    var H = S.selection ? S.selection() : S;
    H.property("__zoom", _o), S !== H ? T(S, L, M, k) : H.interrupt().each(function() {
      A(this, arguments).event(k).start().zoom(null, typeof L == "function" ? L.apply(this, arguments) : L).end();
    });
  }, p.scaleBy = function(S, L, M, k) {
    p.scaleTo(S, function() {
      var H = this.__zoom.k, F = typeof L == "function" ? L.apply(this, arguments) : L;
      return H * F;
    }, M, k);
  }, p.scaleTo = function(S, L, M, k) {
    p.transform(S, function() {
      var H = t.apply(this, arguments), F = this.__zoom, U = M == null ? v(H) : typeof M == "function" ? M.apply(this, arguments) : M, W = F.invert(U), X = typeof L == "function" ? L.apply(this, arguments) : L;
      return n(w(x(F, X), U, W), H, s);
    }, M, k);
  }, p.translateBy = function(S, L, M, k) {
    p.transform(S, function() {
      return n(this.__zoom.translate(
        typeof L == "function" ? L.apply(this, arguments) : L,
        typeof M == "function" ? M.apply(this, arguments) : M
      ), t.apply(this, arguments), s);
    }, null, k);
  }, p.translateTo = function(S, L, M, k, H) {
    p.transform(S, function() {
      var F = t.apply(this, arguments), U = this.__zoom, W = k == null ? v(F) : typeof k == "function" ? k.apply(this, arguments) : k;
      return n(ts.translate(W[0], W[1]).scale(U.k).translate(
        typeof L == "function" ? -L.apply(this, arguments) : -L,
        typeof M == "function" ? -M.apply(this, arguments) : -M
      ), F, s);
    }, k, H);
  };
  function x(S, L) {
    return L = Math.max(a[0], Math.min(a[1], L)), L === S.k ? S : new de(L, S.x, S.y);
  }
  function w(S, L, M) {
    var k = L[0] - M[0] * S.k, H = L[1] - M[1] * S.k;
    return k === S.x && H === S.y ? S : new de(S.k, k, H);
  }
  function v(S) {
    return [(+S[0][0] + +S[1][0]) / 2, (+S[0][1] + +S[1][1]) / 2];
  }
  function T(S, L, M, k) {
    S.on("start.zoom", function() {
      A(this, arguments).event(k).start();
    }).on("interrupt.zoom end.zoom", function() {
      A(this, arguments).event(k).end();
    }).tween("zoom", function() {
      var H = this, F = arguments, U = A(H, F).event(k), W = t.apply(H, F), X = M == null ? v(W) : typeof M == "function" ? M.apply(H, F) : M, Q = Math.max(W[1][0] - W[0][0], W[1][1] - W[0][1]), Z = H.__zoom, et = typeof L == "function" ? L.apply(H, F) : L, ut = c(Z.invert(X).concat(Q / Z.k), et.invert(X).concat(Q / et.k));
      return function(J) {
        if (J === 1) J = et;
        else {
          var mt = ut(J), z = Q / mt[2];
          J = new de(z, X[0] - mt[0] * z, X[1] - mt[1] * z);
        }
        U.zoom(null, J);
      };
    });
  }
  function A(S, L, M) {
    return !M && S.__zooming || new R(S, L);
  }
  function R(S, L) {
    this.that = S, this.args = L, this.active = 0, this.sourceEvent = null, this.extent = t.apply(S, L), this.taps = 0;
  }
  R.prototype = {
    event: function(S) {
      return S && (this.sourceEvent = S), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(S, L) {
      return this.mouse && S !== "mouse" && (this.mouse[1] = L.invert(this.mouse[0])), this.touch0 && S !== "touch" && (this.touch0[1] = L.invert(this.touch0[0])), this.touch1 && S !== "touch" && (this.touch1[1] = L.invert(this.touch1[0])), this.that.__zoom = L, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(S) {
      var L = P(this.that).datum();
      l.call(
        S,
        this.that,
        new rv(S, {
          sourceEvent: this.sourceEvent,
          target: p,
          transform: this.that.__zoom,
          dispatch: l
        }),
        L
      );
    }
  };
  function O(S, ...L) {
    if (!e.apply(this, arguments)) return;
    var M = A(this, L).event(S), k = this.__zoom, H = Math.max(a[0], Math.min(a[1], k.k * Math.pow(2, r.apply(this, arguments)))), F = Et(S);
    if (M.wheel)
      (M.mouse[0][0] !== F[0] || M.mouse[0][1] !== F[1]) && (M.mouse[1] = k.invert(M.mouse[0] = F)), clearTimeout(M.wheel);
    else {
      if (k.k === H) return;
      M.mouse = [F, k.invert(F)], an(this), M.start();
    }
    Mn(S), M.wheel = setTimeout(U, m), M.zoom("mouse", n(w(x(k, H), M.mouse[0], M.mouse[1]), M.extent, s));
    function U() {
      M.wheel = null, M.end();
    }
  }
  function E(S, ...L) {
    if (d || !e.apply(this, arguments)) return;
    var M = S.currentTarget, k = A(this, L, !0).event(S), H = P(S.view).on("mousemove.zoom", X, !0).on("mouseup.zoom", Q, !0), F = Et(S, M), U = S.clientX, W = S.clientY;
    Ra(S.view), zi(S), k.mouse = [F, this.__zoom.invert(F)], an(this), k.start();
    function X(Z) {
      if (Mn(Z), !k.moved) {
        var et = Z.clientX - U, ut = Z.clientY - W;
        k.moved = et * et + ut * ut > y;
      }
      k.event(Z).zoom("mouse", n(w(k.that.__zoom, k.mouse[0] = Et(Z, M), k.mouse[1]), k.extent, s));
    }
    function Q(Z) {
      H.on("mousemove.zoom mouseup.zoom", null), La(Z.view, k.moved), Mn(Z), k.event(Z).end();
    }
  }
  function N(S, ...L) {
    if (e.apply(this, arguments)) {
      var M = this.__zoom, k = Et(S.changedTouches ? S.changedTouches[0] : S, this), H = M.invert(k), F = M.k * (S.shiftKey ? 0.5 : 2), U = n(w(x(M, F), k, H), t.apply(this, L), s);
      Mn(S), o > 0 ? P(this).transition().duration(o).call(T, U, k, S) : P(this).call(p.transform, U, k, S);
    }
  }
  function _(S, ...L) {
    if (e.apply(this, arguments)) {
      var M = S.touches, k = M.length, H = A(this, L, S.changedTouches.length === k).event(S), F, U, W, X;
      for (zi(S), U = 0; U < k; ++U)
        W = M[U], X = Et(W, this), X = [X, this.__zoom.invert(X), W.identifier], H.touch0 ? !H.touch1 && H.touch0[2] !== X[2] && (H.touch1 = X, H.taps = 0) : (H.touch0 = X, F = !0, H.taps = 1 + !!u);
      u && (u = clearTimeout(u)), F && (H.taps < 2 && (h = X[0], u = setTimeout(function() {
        u = null;
      }, f)), an(this), H.start());
    }
  }
  function D(S, ...L) {
    if (this.__zooming) {
      var M = A(this, L).event(S), k = S.changedTouches, H = k.length, F, U, W, X;
      for (Mn(S), F = 0; F < H; ++F)
        U = k[F], W = Et(U, this), M.touch0 && M.touch0[2] === U.identifier ? M.touch0[0] = W : M.touch1 && M.touch1[2] === U.identifier && (M.touch1[0] = W);
      if (U = M.that.__zoom, M.touch1) {
        var Q = M.touch0[0], Z = M.touch0[1], et = M.touch1[0], ut = M.touch1[1], J = (J = et[0] - Q[0]) * J + (J = et[1] - Q[1]) * J, mt = (mt = ut[0] - Z[0]) * mt + (mt = ut[1] - Z[1]) * mt;
        U = x(U, Math.sqrt(J / mt)), W = [(Q[0] + et[0]) / 2, (Q[1] + et[1]) / 2], X = [(Z[0] + ut[0]) / 2, (Z[1] + ut[1]) / 2];
      } else if (M.touch0) W = M.touch0[0], X = M.touch0[1];
      else return;
      M.zoom("touch", n(w(U, W, X), M.extent, s));
    }
  }
  function b(S, ...L) {
    if (this.__zooming) {
      var M = A(this, L).event(S), k = S.changedTouches, H = k.length, F, U;
      for (zi(S), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, f), F = 0; F < H; ++F)
        U = k[F], M.touch0 && M.touch0[2] === U.identifier ? delete M.touch0 : M.touch1 && M.touch1[2] === U.identifier && delete M.touch1;
      if (M.touch1 && !M.touch0 && (M.touch0 = M.touch1, delete M.touch1), M.touch0) M.touch0[1] = this.__zoom.invert(M.touch0[0]);
      else if (M.end(), M.taps === 2 && (U = Et(U, this), Math.hypot(h[0] - U[0], h[1] - U[1]) < g)) {
        var W = P(this).on("dblclick.zoom");
        W && W.apply(this, arguments);
      }
    }
  }
  return p.wheelDelta = function(S) {
    return arguments.length ? (r = typeof S == "function" ? S : xr(+S), p) : r;
  }, p.filter = function(S) {
    return arguments.length ? (e = typeof S == "function" ? S : xr(!!S), p) : e;
  }, p.touchable = function(S) {
    return arguments.length ? (i = typeof S == "function" ? S : xr(!!S), p) : i;
  }, p.extent = function(S) {
    return arguments.length ? (t = typeof S == "function" ? S : xr([[+S[0][0], +S[0][1]], [+S[1][0], +S[1][1]]]), p) : t;
  }, p.scaleExtent = function(S) {
    return arguments.length ? (a[0] = +S[0], a[1] = +S[1], p) : [a[0], a[1]];
  }, p.translateExtent = function(S) {
    return arguments.length ? (s[0][0] = +S[0][0], s[1][0] = +S[1][0], s[0][1] = +S[0][1], s[1][1] = +S[1][1], p) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, p.constrain = function(S) {
    return arguments.length ? (n = S, p) : n;
  }, p.duration = function(S) {
    return arguments.length ? (o = +S, p) : o;
  }, p.interpolate = function(S) {
    return arguments.length ? (c = S, p) : c;
  }, p.on = function() {
    var S = l.on.apply(l, arguments);
    return S === l ? p : S;
  }, p.clickDistance = function(S) {
    return arguments.length ? (y = (S = +S) * S, p) : Math.sqrt(y);
  }, p.tapDistance = function(S) {
    return arguments.length ? (g = +S, p) : g;
  }, p;
}
var Ac = /* @__PURE__ */ ((e) => (e[e.Primary = 0] = "Primary", e[e.Middle = 1] = "Middle", e[e.Secondary = 2] = "Secondary", e))(Ac || {});
class Bt {
  static DEFAULT_MIN_ZOOM = 0.2;
  static DEFAULT_MAX_ZOOM = 5;
  static DATA_BRUSH_CONTEXT_CLASS = "brush-context";
  static DATA_BRUSH_OVERLAY_CLASS = "overlay";
  static DATA_BRUSH_SELECTION_CLASS = "selection";
  static DATA_BRUSH_OVERLAY_WIDTH = 200;
  static DATA_BRUSH_OVERLAY_HEIGHT = 200;
  config;
  zoomBehavior;
  zoomChangeSubject = new zc(1);
  brushBehaviour;
  zoomChange$ = this.zoomChangeSubject.asObservable();
  get minScale() {
    return this.config && this.config.minScale !== void 0 ? this.config.minScale : Bt.DEFAULT_MIN_ZOOM;
  }
  get maxScale() {
    return this.config && this.config.maxScale !== void 0 ? this.config.maxScale : Bt.DEFAULT_MAX_ZOOM;
  }
  constructor() {
    this.zoomBehavior = cv().duration(750).on(
      "zoom",
      (t) => this.updateZoom(t.transform)
    ).on("start.drag", (t) => this.updateDraggingClassIfNeeded(t)).on("end.drag", (t) => this.updateDraggingClassIfNeeded(t)), this.brushBehaviour = Ag().on(
      "start end",
      (t) => this.onBrushSelection(t)
    );
  }
  attachZoom(t) {
    return this.config = { ...t }, this.zoomBehavior.scaleExtent([this.minScale, this.maxScale]), this.config.container.call(this.zoomBehavior).on("dblclick.zoom", null), this.config.showBrush && this.showBrushOverlay(), this;
  }
  getZoomScale() {
    return this.zoomChangeSubject.getValue();
  }
  setZoomScale(t) {
    this.zoomBehavior.scaleTo(this.getContainerSelectionOrThrow(), t);
  }
  resetZoom() {
    this.zoomBehavior.transform(
      this.getContainerSelectionOrThrow(),
      ts
    );
  }
  canIncreaseScale() {
    return this.maxScale > this.getZoomScale();
  }
  canDecreaseScale() {
    return this.minScale < this.getZoomScale();
  }
  zoomToRect(t, n) {
    const r = Ne(
      this.config && this.config.container.node()
    ).getBoundingClientRect(), i = r.width / (t.width + 24), a = r.height / (t.height + 24), s = Math.min(i, a), o = Math.max(this.minScale, s), c = pe(n) ? o : Math.min(o, n);
    this.setZoomScale(c), this.translateToRect(t);
  }
  panToRect(t) {
    const n = Ne(
      this.config && this.config.container.node()
    ).getBoundingClientRect();
    this.zoomBehavior.translateTo(
      this.getContainerSelectionOrThrow(),
      t.left + n.width / 2,
      t.top + n.height / 2
    );
  }
  showBrushOverlay(t = 1) {
    if (!this.config?.showBrush)
      return;
    const n = this.getContainerSelectionOrThrow();
    n.select(`.${Bt.DATA_BRUSH_CONTEXT_CLASS}`).remove();
    const r = Ne(
      n.node()
    ).getBoundingClientRect(), i = {
      bottom: r.bottom,
      top: r.height - Bt.DATA_BRUSH_OVERLAY_HEIGHT,
      left: r.width - Bt.DATA_BRUSH_OVERLAY_WIDTH,
      right: r.right,
      width: Bt.DATA_BRUSH_OVERLAY_WIDTH,
      height: Bt.DATA_BRUSH_OVERLAY_HEIGHT
    };
    this.brushBehaviour.extent([
      [0, 0],
      [
        Bt.DATA_BRUSH_OVERLAY_WIDTH / t,
        Bt.DATA_BRUSH_OVERLAY_HEIGHT / t
      ]
    ]), this.config.brushOverlay = Ne(this.config).target.clone(!0).classed(Bt.DATA_BRUSH_CONTEXT_CLASS, !0).attr("width", i.width).attr("height", i.height).attr(
      "transform",
      `translate(${i.left - 20}, ${i.top - 40}) scale(${t})`
    ).insert("g", ":first-child").call(this.brushBehaviour), this.styleBrushSelection(this.config.brushOverlay, t);
  }
  styleBrushSelection(t, n) {
    const r = 4 / n, i = 4 / n, a = 1 / n;
    t.select(`.${Bt.DATA_BRUSH_OVERLAY_CLASS}`).attr("rx", r).attr("ry", r), t.select(`.${Bt.DATA_BRUSH_SELECTION_CLASS}`).attr("rx", i).attr("ry", i).style("stroke-width", a).style("stroke-dasharray", `${a}, ${a}`);
  }
  onBrushSelection(t) {
    if (!t.selection)
      return;
    const [n, r] = t.selection;
    if (Uc(n, r))
      return;
    const i = this.getZoomScale(), a = {
      top: n[1] * i,
      left: n[0] * i,
      bottom: r[1] * i,
      right: r[0] * i,
      width: r[0] * i - n[0] * i,
      height: r[1] * i - n[1] * i
    };
    this.panToRect(a);
  }
  translateToRect(t) {
    const n = t.left + t.width / 2, r = t.top + t.height / 2;
    this.zoomBehavior.translateTo(
      this.getContainerSelectionOrThrow(),
      n,
      r
    );
  }
  updateZoom(t) {
    this.getTargetSelectionOrThrow().attr("transform", t.toString()), this.zoomChangeSubject.next(t.k);
  }
  checkValidZoomEvent(t) {
    return this.isScrollEvent(t) ? this.isValidTriggerEvent(
      t,
      this.config && this.config.scroll
    ) : this.isPrimaryMouseOrTouchEvent(t) ? this.isValidTriggerEvent(
      t,
      this.config && this.config.pan
    ) : !1;
  }
  isValidTriggerEvent(t, n) {
    return n ? n.requireModifiers ? n.requireModifiers.some(
      (r) => this.eventHasModifier(t, r)
    ) : !0 : !1;
  }
  eventHasModifier(t, n) {
    switch (n) {
      case qn.Control:
        return t.ctrlKey;
      case qn.Meta:
        return t.metaKey;
      default:
        return !1;
    }
  }
  isPrimaryMouseOrTouchEvent(t) {
    return "TouchEvent" in window && t instanceof TouchEvent || t instanceof MouseEvent && !this.isScrollEvent(t) && t.button === Ac.Primary;
  }
  isScrollEvent(t) {
    return t instanceof WheelEvent;
  }
  updateDraggingClassIfNeeded(t) {
    this.getContainerSelectionOrThrow().classed(
      "dragging",
      this.isPanStartEvent(t)
    );
  }
  isPanStartEvent(t) {
    return t.type === "start" && this.isPrimaryMouseOrTouchEvent(t.sourceEvent);
  }
  getTargetSelectionOrThrow() {
    return Ne(this.config).target;
  }
  getContainerSelectionOrThrow() {
    return Ne(this.config).container;
  }
}
const $i = (...e) => {
  const t = e.reduce(
    (n, r) => ({
      left: Math.min(n.left, r.left),
      right: Math.max(n.right, r.right),
      top: Math.min(n.top, r.top),
      bottom: Math.max(n.bottom, r.bottom)
    })
  );
  return {
    ...t,
    width: t.right - t.left,
    height: t.bottom - t.top
  };
};
class Le extends Bt {
  zoomToFit(t, n = 0) {
    const r = t.map((a) => a.renderedData()).filter(
      (a) => !!a
    ).map((a) => a.getBoudingBox()).filter((a) => a.width > 0 || a.height > 0);
    if (r.length === 0) return;
    const i = this.offsetAndGetClientRect(
      $i(...r),
      n
    );
    this.zoomToRect(i, 1);
  }
  panToTopLeft(t, n = 0) {
    const r = t.map((a) => a.renderedData()).filter(
      (a) => !!a
    ).map((a) => a.getBoudingBox()).filter((a) => a.width > 0 || a.height > 0);
    if (r.length === 0) return;
    this.setZoomScale(1);
    const i = this.offsetAndGetClientRect(
      $i(...r),
      n
    );
    this.panToRect(i);
  }
  determineZoomScale(t, n) {
    const r = t.map((c) => c.renderedData()).filter(
      (c) => !!c
    ).map((c) => c.getBoudingBox()), i = $i(...r), a = n.width / i.width, s = n.height / i.height;
    return Math.min(a, s);
  }
  updateBrushOverlayWithData(t) {
    const n = this.getContainerSelectionOrThrow();
    n.select(`.${Le.DATA_BRUSH_CONTEXT_CLASS}`).remove();
    const r = Ne(
      n.node()
    ).getBoundingClientRect(), i = {
      bottom: r.bottom,
      top: r.height - Le.DATA_BRUSH_OVERLAY_HEIGHT,
      left: r.width - Le.DATA_BRUSH_OVERLAY_WIDTH,
      right: r.right,
      width: Le.DATA_BRUSH_OVERLAY_WIDTH,
      height: Le.DATA_BRUSH_OVERLAY_HEIGHT
    }, a = this.determineZoomScale(t, i);
    this.showBrushOverlay(a);
  }
  offsetAndGetClientRect(t, n) {
    const { width: r, height: i, top: a, bottom: s, left: o, right: c } = t;
    return {
      width: r + 2 * n,
      height: i + 2 * n,
      top: a - n,
      bottom: s + n,
      left: o - n,
      right: c + n
    };
  }
}
function uv(e) {
  var t = 0, n = e.children, r = n && n.length;
  if (!r) t = 1;
  else for (; --r >= 0; ) t += n[r].value;
  e.value = t;
}
function hv() {
  return this.eachAfter(uv);
}
function dv(e) {
  var t = this, n, r = [t], i, a, s;
  do
    for (n = r.reverse(), r = []; t = n.pop(); )
      if (e(t), i = t.children, i) for (a = 0, s = i.length; a < s; ++a)
        r.push(i[a]);
  while (r.length);
  return this;
}
function fv(e) {
  for (var t = this, n = [t], r, i; t = n.pop(); )
    if (e(t), r = t.children, r) for (i = r.length - 1; i >= 0; --i)
      n.push(r[i]);
  return this;
}
function gv(e) {
  for (var t = this, n = [t], r = [], i, a, s; t = n.pop(); )
    if (r.push(t), i = t.children, i) for (a = 0, s = i.length; a < s; ++a)
      n.push(i[a]);
  for (; t = r.pop(); )
    e(t);
  return this;
}
function pv(e) {
  return this.eachAfter(function(t) {
    for (var n = +e(t.data) || 0, r = t.children, i = r && r.length; --i >= 0; ) n += r[i].value;
    t.value = n;
  });
}
function mv(e) {
  return this.eachBefore(function(t) {
    t.children && t.children.sort(e);
  });
}
function yv(e) {
  for (var t = this, n = vv(t, e), r = [t]; t !== n; )
    t = t.parent, r.push(t);
  for (var i = r.length; e !== n; )
    r.splice(i, 0, e), e = e.parent;
  return r;
}
function vv(e, t) {
  if (e === t) return e;
  var n = e.ancestors(), r = t.ancestors(), i = null;
  for (e = n.pop(), t = r.pop(); e === t; )
    i = e, e = n.pop(), t = r.pop();
  return i;
}
function Sv() {
  for (var e = this, t = [e]; e = e.parent; )
    t.push(e);
  return t;
}
function xv() {
  var e = [];
  return this.each(function(t) {
    e.push(t);
  }), e;
}
function wv() {
  var e = [];
  return this.eachBefore(function(t) {
    t.children || e.push(t);
  }), e;
}
function bv() {
  var e = this, t = [];
  return e.each(function(n) {
    n !== e && t.push({ source: n.parent, target: n });
  }), t;
}
function mi(e, t) {
  var n = new Zn(e), r = +e.value && (n.value = e.value), i, a = [n], s, o, c, l;
  for (t == null && (t = Av); i = a.pop(); )
    if (r && (i.value = +i.data.value), (o = t(i.data)) && (l = o.length))
      for (i.children = new Array(l), c = l - 1; c >= 0; --c)
        a.push(s = i.children[c] = new Zn(o[c])), s.parent = i, s.depth = i.depth + 1;
  return n.eachBefore(Mv);
}
function Tv() {
  return mi(this).eachBefore(Dv);
}
function Av(e) {
  return e.children;
}
function Dv(e) {
  e.data = e.data.data;
}
function Mv(e) {
  var t = 0;
  do
    e.height = t;
  while ((e = e.parent) && e.height < ++t);
}
function Zn(e) {
  this.data = e, this.depth = this.height = 0, this.parent = null;
}
Zn.prototype = mi.prototype = {
  constructor: Zn,
  count: hv,
  each: dv,
  eachAfter: gv,
  eachBefore: fv,
  sum: pv,
  sort: mv,
  path: yv,
  ancestors: Sv,
  descendants: xv,
  leaves: wv,
  links: bv,
  copy: Tv
};
function Cv(e, t) {
  return e.parent === t.parent ? 1 : 2;
}
function Wi(e) {
  var t = e.children;
  return t ? t[0] : e.t;
}
function Yi(e) {
  var t = e.children;
  return t ? t[t.length - 1] : e.t;
}
function _v(e, t, n) {
  var r = n / (t.i - e.i);
  t.c -= r, t.s += n, e.c += r, t.z += n, t.m += n;
}
function Ev(e) {
  for (var t = 0, n = 0, r = e.children, i = r.length, a; --i >= 0; )
    a = r[i], a.z += t, a.m += t, t += a.s + (n += a.c);
}
function Nv(e, t, n) {
  return e.a.parent === t.parent ? e.a : n;
}
function Lr(e, t) {
  this._ = e, this.parent = null, this.children = null, this.A = null, this.a = this, this.z = 0, this.m = 0, this.c = 0, this.s = 0, this.t = null, this.i = t;
}
Lr.prototype = Object.create(Zn.prototype);
function Rv(e) {
  for (var t = new Lr(e, 0), n, r = [t], i, a, s, o; n = r.pop(); )
    if (a = n._.children)
      for (n.children = new Array(o = a.length), s = o - 1; s >= 0; --s)
        r.push(i = n.children[s] = new Lr(a[s], s)), i.parent = n;
  return (t.parent = new Lr(null, 0)).children = [t], t;
}
function Lv() {
  var e = Cv, t = 1, n = 1, r = null;
  function i(l) {
    var u = Rv(l);
    if (u.eachAfter(a), u.parent.m = -u.z, u.eachBefore(s), r) l.eachBefore(c);
    else {
      var h = l, d = l, f = l;
      l.eachBefore(function(x) {
        x.x < h.x && (h = x), x.x > d.x && (d = x), x.depth > f.depth && (f = x);
      });
      var m = h === d ? 1 : e(h, d) / 2, y = m - h.x, g = t / (d.x + m + y), p = n / (f.depth || 1);
      l.eachBefore(function(x) {
        x.x = (x.x + y) * g, x.y = x.depth * p;
      });
    }
    return l;
  }
  function a(l) {
    var u = l.children, h = l.parent.children, d = l.i ? h[l.i - 1] : null;
    if (u) {
      Ev(l);
      var f = (u[0].z + u[u.length - 1].z) / 2;
      d ? (l.z = d.z + e(l._, d._), l.m = l.z - f) : l.z = f;
    } else d && (l.z = d.z + e(l._, d._));
    l.parent.A = o(l, d, l.parent.A || h[0]);
  }
  function s(l) {
    l._.x = l.z + l.parent.m, l.m += l.parent.m;
  }
  function o(l, u, h) {
    if (u) {
      for (var d = l, f = l, m = u, y = d.parent.children[0], g = d.m, p = f.m, x = m.m, w = y.m, v; m = Yi(m), d = Wi(d), m && d; )
        y = Wi(y), f = Yi(f), f.a = l, v = m.z + x - d.z - g + e(m._, d._), v > 0 && (_v(Nv(m, l, h), l, v), g += v, p += v), x += m.m, g += d.m, w += y.m, p += f.m;
      m && !Yi(f) && (f.t = m, f.m += x - p), d && !Wi(y) && (y.t = d, y.m += g - w, h = l);
    }
    return h;
  }
  function c(l) {
    l.x *= t, l.y = l.depth * n;
  }
  return i.separation = function(l) {
    return arguments.length ? (e = l, i) : e;
  }, i.size = function(l) {
    return arguments.length ? (r = !1, t = +l[0], n = +l[1], i) : r ? null : [t, n];
  }, i.nodeSize = function(l) {
    return arguments.length ? (r = !0, t = +l[0], n = +l[1], i) : r ? [t, n] : null;
  }, i;
}
class Dc {
  layout(t) {
    const n = mi(
      this.buildHierarchyProxyNodes(t.nodes, { x: 0, y: 0 })
    ), r = Lv().nodeSize([
      this.getNodeHeight(n),
      this.getNodeWidth(n)
    ]).separation(() => 1)(n);
    r.children.forEach(
      (i) => this.updatePositions(
        i,
        i.y,
        this.getMinYPosition(r)
      )
    );
  }
  updatePositions(t, n, r) {
    t.data.sourceNode.x = t.y - n, t.data.sourceNode.y = t.x + Math.abs(r), t.children?.forEach(
      (i) => this.updatePositions(i, n, r)
    );
  }
  getMinYPosition(t) {
    return Math.min(
      t.x,
      ...(t.children ?? []).map(
        (n) => this.getMinYPosition(n)
      )
    );
  }
  buildHierarchyProxyNodes(t, n) {
    const r = this.buildTopologyHierarchyNodeMap(
      t,
      n
    ), i = {
      sourceNode: void 0,
      hasIncomingEdges: !1,
      children: [],
      x: 0,
      y: 0
    };
    return r.forEach((a) => {
      a.hasIncomingEdges || i.children.push(a);
    }), i;
  }
  getNodeWidth(t) {
    const n = ns(t.leaves());
    let r = 240;
    if (n !== void 0) {
      const i = n.data.sourceNode.renderedData();
      i !== void 0 && (r = i.getBoudingBox().width);
    }
    return r + 160;
  }
  getNodeHeight(t) {
    return this.getRenderedNodeHeight(ns(t.leaves()));
  }
  getRenderedNodeHeight(t) {
    if (t !== void 0) {
      const r = t.data.sourceNode.renderedData();
      if (r !== void 0)
        return r.getBoudingBox().height;
    }
    return 36;
  }
  buildTopologyHierarchyNodeMap(t, n) {
    const r = new Map(
      t.map((i) => {
        i.x = n.x, i.y = n.y;
        const a = {
          sourceNode: i,
          ...n,
          children: [],
          hasIncomingEdges: !1
        };
        return [i, a];
      })
    );
    return r.forEach((i, a) => {
      this.removeSelfLinks(a), i.children = a.outgoing.map((s) => s.target).map((s) => r.get(s)).filter((s) => !this.nodeIntroducesCycle(s)).map((s) => (s.hasIncomingEdges = !0, s));
    }), r;
  }
  nodeIntroducesCycle(t) {
    const n = /* @__PURE__ */ new Set(), r = (a) => a.children.some((s) => s === t ? !0 : n.has(s) ? !1 : (n.add(s), r(s)));
    return r(t);
  }
  removeSelfLinks(t) {
    t.incoming = t.incoming.filter(
      (n) => n.source !== n.target
    ), t.outgoing = t.outgoing.filter(
      (n) => n.source !== n.target
    );
  }
}
class kv extends Dc {
  layout(t) {
    const n = mi(
      this.buildHierarchyProxyNodes(t.nodes, { x: 0, y: 0 })
    ), r = this.getNodeWidth(n), i = this.getNodeHeight(n);
    this.updateLayout(
      n,
      0,
      -1,
      r * 1.2,
      i * 1.2
    );
  }
  updateLayout(t, n, r, i, a) {
    return t.data.sourceNode !== void 0 && (t.data.sourceNode.x = r * i, t.data.sourceNode.y = n * a), t.children?.forEach((s, o) => {
      this.updateLayout(
        s,
        n + o,
        r + 1,
        i,
        a
      );
    }), t.children?.length ?? 1;
  }
}
function Iv(e, t) {
  var n, r = 1;
  e == null && (e = 0), t == null && (t = 0);
  function i() {
    var a, s = n.length, o, c = 0, l = 0;
    for (a = 0; a < s; ++a)
      o = n[a], c += o.x, l += o.y;
    for (c = (c / s - e) * r, l = (l / s - t) * r, a = 0; a < s; ++a)
      o = n[a], o.x -= c, o.y -= l;
  }
  return i.initialize = function(a) {
    n = a;
  }, i.x = function(a) {
    return arguments.length ? (e = +a, i) : e;
  }, i.y = function(a) {
    return arguments.length ? (t = +a, i) : t;
  }, i.strength = function(a) {
    return arguments.length ? (r = +a, i) : r;
  }, i;
}
function Rt(e) {
  return function() {
    return e;
  };
}
function Te(e) {
  return (e() - 0.5) * 1e-6;
}
function Ov(e) {
  return e.x + e.vx;
}
function Bv(e) {
  return e.y + e.vy;
}
function Pv(e) {
  var t, n, r, i = 1, a = 1;
  typeof e != "function" && (e = Rt(e == null ? 1 : +e));
  function s() {
    for (var l, u = t.length, h, d, f, m, y, g, p = 0; p < a; ++p)
      for (h = hi(t, Ov, Bv).visitAfter(o), l = 0; l < u; ++l)
        d = t[l], y = n[d.index], g = y * y, f = d.x + d.vx, m = d.y + d.vy, h.visit(x);
    function x(w, v, T, A, R) {
      var O = w.data, E = w.r, N = y + E;
      if (O) {
        if (O.index > d.index) {
          var _ = f - O.x - O.vx, D = m - O.y - O.vy, b = _ * _ + D * D;
          b < N * N && (_ === 0 && (_ = Te(r), b += _ * _), D === 0 && (D = Te(r), b += D * D), b = (N - (b = Math.sqrt(b))) / b * i, d.vx += (_ *= b) * (N = (E *= E) / (g + E)), d.vy += (D *= b) * N, O.vx -= _ * (N = 1 - N), O.vy -= D * N);
        }
        return;
      }
      return v > f + N || A < f - N || T > m + N || R < m - N;
    }
  }
  function o(l) {
    if (l.data) return l.r = n[l.data.index];
    for (var u = l.r = 0; u < 4; ++u)
      l[u] && l[u].r > l.r && (l.r = l[u].r);
  }
  function c() {
    if (t) {
      var l, u = t.length, h;
      for (n = new Array(u), l = 0; l < u; ++l) h = t[l], n[h.index] = +e(h, l, t);
    }
  }
  return s.initialize = function(l, u) {
    t = l, r = u, c();
  }, s.iterations = function(l) {
    return arguments.length ? (a = +l, s) : a;
  }, s.strength = function(l) {
    return arguments.length ? (i = +l, s) : i;
  }, s.radius = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : Rt(+l), c(), s) : e;
  }, s;
}
function Fv(e) {
  return e.index;
}
function Eo(e, t) {
  var n = e.get(t);
  if (!n) throw new Error("node not found: " + t);
  return n;
}
function Uv(e) {
  var t = Fv, n = h, r, i = Rt(30), a, s, o, c, l, u = 1;
  e == null && (e = []);
  function h(g) {
    return 1 / Math.min(o[g.source.index], o[g.target.index]);
  }
  function d(g) {
    for (var p = 0, x = e.length; p < u; ++p)
      for (var w = 0, v, T, A, R, O, E, N; w < x; ++w)
        v = e[w], T = v.source, A = v.target, R = A.x + A.vx - T.x - T.vx || Te(l), O = A.y + A.vy - T.y - T.vy || Te(l), E = Math.sqrt(R * R + O * O), E = (E - a[w]) / E * g * r[w], R *= E, O *= E, A.vx -= R * (N = c[w]), A.vy -= O * N, T.vx += R * (N = 1 - N), T.vy += O * N;
  }
  function f() {
    if (s) {
      var g, p = s.length, x = e.length, w = new Map(s.map((T, A) => [t(T, A, s), T])), v;
      for (g = 0, o = new Array(p); g < x; ++g)
        v = e[g], v.index = g, typeof v.source != "object" && (v.source = Eo(w, v.source)), typeof v.target != "object" && (v.target = Eo(w, v.target)), o[v.source.index] = (o[v.source.index] || 0) + 1, o[v.target.index] = (o[v.target.index] || 0) + 1;
      for (g = 0, c = new Array(x); g < x; ++g)
        v = e[g], c[g] = o[v.source.index] / (o[v.source.index] + o[v.target.index]);
      r = new Array(x), m(), a = new Array(x), y();
    }
  }
  function m() {
    if (s)
      for (var g = 0, p = e.length; g < p; ++g)
        r[g] = +n(e[g], g, e);
  }
  function y() {
    if (s)
      for (var g = 0, p = e.length; g < p; ++g)
        a[g] = +i(e[g], g, e);
  }
  return d.initialize = function(g, p) {
    s = g, l = p, f();
  }, d.links = function(g) {
    return arguments.length ? (e = g, f(), d) : e;
  }, d.id = function(g) {
    return arguments.length ? (t = g, d) : t;
  }, d.iterations = function(g) {
    return arguments.length ? (u = +g, d) : u;
  }, d.strength = function(g) {
    return arguments.length ? (n = typeof g == "function" ? g : Rt(+g), m(), d) : n;
  }, d.distance = function(g) {
    return arguments.length ? (i = typeof g == "function" ? g : Rt(+g), y(), d) : i;
  }, d;
}
var Hv = { value: () => {
} };
function Mc() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new kr(n);
}
function kr(e) {
  this._ = e;
}
function zv(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", i = n.indexOf(".");
    if (i >= 0 && (r = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
kr.prototype = Mc.prototype = {
  constructor: kr,
  on: function(e, t) {
    var n = this._, r = zv(e + "", n), i, a = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++a < s; ) if ((i = (e = r[a]).type) && (i = $v(n[i], e.name))) return i;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++a < s; )
      if (i = (e = r[a]).type) n[i] = No(n[i], e.name, t);
      else if (t == null) for (i in n) n[i] = No(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new kr(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
  }
};
function $v(e, t) {
  for (var n = 0, r = e.length, i; n < r; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function No(e, t, n) {
  for (var r = 0, i = e.length; r < i; ++r)
    if (e[r].name === t) {
      e[r] = Hv, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
const Wv = 1664525, Yv = 1013904223, Ro = 4294967296;
function Gv() {
  let e = 1;
  return () => (e = (Wv * e + Yv) % Ro) / Ro;
}
function Vv(e) {
  return e.x;
}
function Xv(e) {
  return e.y;
}
var jv = 10, qv = Math.PI * (3 - Math.sqrt(5));
function Zv(e) {
  var t, n = 1, r = 1e-3, i = 1 - Math.pow(r, 1 / 300), a = 0, s = 0.6, o = /* @__PURE__ */ new Map(), c = Ba(h), l = Mc("tick", "end"), u = Gv();
  e == null && (e = []);
  function h() {
    d(), l.call("tick", t), n < r && (c.stop(), l.call("end", t));
  }
  function d(y) {
    var g, p = e.length, x;
    y === void 0 && (y = 1);
    for (var w = 0; w < y; ++w)
      for (n += (a - n) * i, o.forEach(function(v) {
        v(n);
      }), g = 0; g < p; ++g)
        x = e[g], x.fx == null ? x.x += x.vx *= s : (x.x = x.fx, x.vx = 0), x.fy == null ? x.y += x.vy *= s : (x.y = x.fy, x.vy = 0);
    return t;
  }
  function f() {
    for (var y = 0, g = e.length, p; y < g; ++y) {
      if (p = e[y], p.index = y, p.fx != null && (p.x = p.fx), p.fy != null && (p.y = p.fy), isNaN(p.x) || isNaN(p.y)) {
        var x = jv * Math.sqrt(0.5 + y), w = y * qv;
        p.x = x * Math.cos(w), p.y = x * Math.sin(w);
      }
      (isNaN(p.vx) || isNaN(p.vy)) && (p.vx = p.vy = 0);
    }
  }
  function m(y) {
    return y.initialize && y.initialize(e, u), y;
  }
  return f(), t = {
    tick: d,
    restart: function() {
      return c.restart(h), t;
    },
    stop: function() {
      return c.stop(), t;
    },
    nodes: function(y) {
      return arguments.length ? (e = y, f(), o.forEach(m), t) : e;
    },
    alpha: function(y) {
      return arguments.length ? (n = +y, t) : n;
    },
    alphaMin: function(y) {
      return arguments.length ? (r = +y, t) : r;
    },
    alphaDecay: function(y) {
      return arguments.length ? (i = +y, t) : +i;
    },
    alphaTarget: function(y) {
      return arguments.length ? (a = +y, t) : a;
    },
    velocityDecay: function(y) {
      return arguments.length ? (s = 1 - y, t) : 1 - s;
    },
    randomSource: function(y) {
      return arguments.length ? (u = y, o.forEach(m), t) : u;
    },
    force: function(y, g) {
      return arguments.length > 1 ? (g == null ? o.delete(y) : o.set(y, m(g)), t) : o.get(y);
    },
    find: function(y, g, p) {
      var x = 0, w = e.length, v, T, A, R, O;
      for (p == null ? p = 1 / 0 : p *= p, x = 0; x < w; ++x)
        R = e[x], v = y - R.x, T = g - R.y, A = v * v + T * T, A < p && (O = R, p = A);
      return O;
    },
    on: function(y, g) {
      return arguments.length > 1 ? (l.on(y, g), t) : l.on(y);
    }
  };
}
function Kv() {
  var e, t, n, r, i = Rt(-30), a, s = 1, o = 1 / 0, c = 0.81;
  function l(f) {
    var m, y = e.length, g = hi(e, Vv, Xv).visitAfter(h);
    for (r = f, m = 0; m < y; ++m) t = e[m], g.visit(d);
  }
  function u() {
    if (e) {
      var f, m = e.length, y;
      for (a = new Array(m), f = 0; f < m; ++f) y = e[f], a[y.index] = +i(y, f, e);
    }
  }
  function h(f) {
    var m = 0, y, g, p = 0, x, w, v;
    if (f.length) {
      for (x = w = v = 0; v < 4; ++v)
        (y = f[v]) && (g = Math.abs(y.value)) && (m += y.value, p += g, x += g * y.x, w += g * y.y);
      f.x = x / p, f.y = w / p;
    } else {
      y = f, y.x = y.data.x, y.y = y.data.y;
      do
        m += a[y.data.index];
      while (y = y.next);
    }
    f.value = m;
  }
  function d(f, m, y, g) {
    if (!f.value) return !0;
    var p = f.x - t.x, x = f.y - t.y, w = g - m, v = p * p + x * x;
    if (w * w / c < v)
      return v < o && (p === 0 && (p = Te(n), v += p * p), x === 0 && (x = Te(n), v += x * x), v < s && (v = Math.sqrt(s * v)), t.vx += p * f.value * r / v, t.vy += x * f.value * r / v), !0;
    if (f.length || v >= o) return;
    (f.data !== t || f.next) && (p === 0 && (p = Te(n), v += p * p), x === 0 && (x = Te(n), v += x * x), v < s && (v = Math.sqrt(s * v)));
    do
      f.data !== t && (w = a[f.data.index] * r / v, t.vx += p * w, t.vy += x * w);
    while (f = f.next);
  }
  return l.initialize = function(f, m) {
    e = f, n = m, u();
  }, l.strength = function(f) {
    return arguments.length ? (i = typeof f == "function" ? f : Rt(+f), u(), l) : i;
  }, l.distanceMin = function(f) {
    return arguments.length ? (s = f * f, l) : Math.sqrt(s);
  }, l.distanceMax = function(f) {
    return arguments.length ? (o = f * f, l) : Math.sqrt(o);
  }, l.theta = function(f) {
    return arguments.length ? (c = f * f, l) : Math.sqrt(c);
  }, l;
}
function Qv(e) {
  var t = Rt(0.1), n, r, i;
  typeof e != "function" && (e = Rt(e == null ? 0 : +e));
  function a(o) {
    for (var c = 0, l = n.length, u; c < l; ++c)
      u = n[c], u.vx += (i[c] - u.x) * r[c] * o;
  }
  function s() {
    if (n) {
      var o, c = n.length;
      for (r = new Array(c), i = new Array(c), o = 0; o < c; ++o)
        r[o] = isNaN(i[o] = +e(n[o], o, n)) ? 0 : +t(n[o], o, n);
    }
  }
  return a.initialize = function(o) {
    n = o, s();
  }, a.strength = function(o) {
    return arguments.length ? (t = typeof o == "function" ? o : Rt(+o), s(), a) : t;
  }, a.x = function(o) {
    return arguments.length ? (e = typeof o == "function" ? o : Rt(+o), s(), a) : e;
  }, a;
}
function Jv(e) {
  var t = Rt(0.1), n, r, i;
  typeof e != "function" && (e = Rt(e == null ? 0 : +e));
  function a(o) {
    for (var c = 0, l = n.length, u; c < l; ++c)
      u = n[c], u.vy += (i[c] - u.y) * r[c] * o;
  }
  function s() {
    if (n) {
      var o, c = n.length;
      for (r = new Array(c), i = new Array(c), o = 0; o < c; ++o)
        r[o] = isNaN(i[o] = +e(n[o], o, n)) ? 0 : +t(n[o], o, n);
    }
  }
  return a.initialize = function(o) {
    n = o, s();
  }, a.strength = function(o) {
    return arguments.length ? (t = typeof o == "function" ? o : Rt(+o), s(), a) : t;
  }, a.y = function(o) {
    return arguments.length ? (e = typeof o == "function" ? o : Rt(+o), s(), a) : e;
  }, a;
}
class tS {
  buildEdgeDirectionalityForce(t, n = 1.2) {
    const r = this.getTopologySizeFactor(t, 1, 0.1);
    return (i) => t.forEach(
      (a) => this.applyDirectionalityToEdge(a, i * r * n)
    );
  }
  buildStraightEdgeForce(t, n = 0.06) {
    const r = this.getTopologySizeFactor(t, 1, 0.1);
    return (i) => t.forEach(
      (a) => this.applyFlatteningForceToEdge(a, i * r * n)
    );
  }
  applyDirectionalityToEdge(t, n, r = 100) {
    const i = Math.max(
      0,
      t.source.x + r - t.target.x
    );
    i > 0 && (this.changeNodeVelocity(t.source, {
      deltaVx: -n * this.getRelativeEdgeImportanceForSource(t) * i
    }), this.changeNodeVelocity(t.target, {
      deltaVx: n * this.getRelativeEdgeImportanceForTarget(t) * i
    }));
  }
  applyFlatteningForceToEdge(t, n) {
    const r = t.target.y - t.source.y;
    this.changeNodeVelocity(t.source, {
      deltaVy: n * this.getRelativeEdgeImportanceForSource(t) * r
    }), this.changeNodeVelocity(t.target, {
      deltaVy: -n * this.getRelativeEdgeImportanceForTarget(t) * r
    });
  }
  changeNodeVelocity(t, n) {
    const r = t.vx === void 0 ? 0 : t.vx, i = t.vy === void 0 ? 0 : t.vy;
    t.vx = n.deltaVx === void 0 ? t.vx : r + n.deltaVx, t.vy = n.deltaVy === void 0 ? t.vy : i + n.deltaVy;
  }
  getRelativeEdgeImportanceForSource(t) {
    return 1 / t.source.sourceNode.outgoing.length;
  }
  getRelativeEdgeImportanceForTarget(t) {
    return 1 / t.target.sourceNode.incoming.length;
  }
  getTopologySizeFactor(t, n, r) {
    if (t.length < 6)
      return n;
    if (t.length > 24)
      return r;
    const s = r - n;
    return n + s * (t.length - 6) / 18;
  }
}
class eS {
  layout(t, n, r) {
    const i = n / 2, a = r / 2, s = this.getProxyNodes(t.nodes, {
      x: i,
      y: a
    }), o = this.getProxyEdges(t.edges, s), c = Array.from(s.values()), l = new tS(), u = Zv().stop().force("x", Qv(i).strength(0.15)).force("y", Jv(a).strength(0.2)).force("center", Iv(i, a)).force("charge", Kv().strength(-6e3)).force(
      "collide",
      Pv().radius((h) => this.getCollisionRadiusForNode(h.sourceNode)).strength(1)
    ).force("link", Uv(o).distance(200)).force(
      "edgeDirection",
      l.buildEdgeDirectionalityForce(o)
    ).force("flatten", l.buildStraightEdgeForce(o)).nodes(c);
    for (let h = 0; h < 100; h++)
      u.tick();
    c.forEach((h) => {
      h.sourceNode.x = h.x, h.sourceNode.y = h.y;
    });
  }
  getProxyNodes(t, n) {
    return new Map(
      t.map((r) => {
        const i = {
          sourceNode: r,
          ...n
        };
        return [r, i];
      })
    );
  }
  getCollisionRadiusForNode(t) {
    const n = t.renderedData();
    if (!n)
      return 0;
    const r = n.getBoudingBox();
    return Math.max(r.width, r.height) / 2;
  }
  getProxyEdges(t, n) {
    return t.map((r) => ({
      source: n.get(r.source),
      target: n.get(r.target)
    }));
  }
}
class Cc {
  levelToNodesMap = /* @__PURE__ */ new Map([[0, []]]);
  nodeToLevelMap = /* @__PURE__ */ new Map();
  layoutConfig = this.getLayoutConfig();
  layout(t) {
    this.initialize(), this.findRootNodes(t), this.fillNodeAndLevelMaps(), this.assignCoordinatesToNodes(), this.verticallyCenterAlignNodes();
  }
  initialize() {
    this.levelToNodesMap = /* @__PURE__ */ new Map([[0, []]]), this.nodeToLevelMap.clear();
  }
  findRootNodes(t) {
    t.nodes.forEach((n) => {
      n.incoming.length === 0 && (this.nodeToLevelMap.set(n, 0), this.levelToNodesMap.get(0)?.push(n));
    });
  }
  fillNodeAndLevelMaps() {
    const t = [...this.levelToNodesMap.get(0) ?? []], n = /* @__PURE__ */ new Set([
      ...t
    ]);
    this.levelOrderTraversal(
      t,
      n
    );
  }
  levelOrderTraversal(t, n) {
    for (; t.length > 0; ) {
      const r = t.shift(), i = this.nodeToLevelMap.get(r) + 1;
      this.levelToNodesMap.has(i) || this.levelToNodesMap.set(i, []), r.outgoing.forEach((a) => {
        const s = a.target;
        n.has(s) || (n.add(s), t.push(s), this.nodeToLevelMap.set(s, i), this.levelToNodesMap.get(i)?.push(s));
      });
    }
  }
  assignCoordinatesToNodes() {
    let t = this.layoutConfig.startX;
    Array.from(this.levelToNodesMap.values()).forEach((n) => {
      let r = this.layoutConfig.startY, i = 0;
      n.forEach((a) => {
        a.x = t, a.y = r, r += (a.renderedData()?.getBoudingBox()?.height ?? this.layoutConfig.defaultNodeHeight) + this.layoutConfig.verticalNodeGap, i = Math.max(
          i,
          a.renderedData()?.getBoudingBox()?.width ?? this.layoutConfig.defaultNodeWidth
        );
      }), t += i + this.layoutConfig.horizontalNodeGap;
    });
  }
  verticallyCenterAlignNodes() {
    const t = Math.max(
      ...Array.from(this.levelToNodesMap.values()).map((n) => n.length)
    );
    Array.from(this.levelToNodesMap.values()).forEach((n) => {
      n.forEach((r) => {
        r.y += (t - n.length) * ((r.renderedData()?.getBoudingBox()?.height ?? this.layoutConfig.defaultNodeHeight) + this.layoutConfig.verticalNodeGap) / 2;
      });
    });
  }
  getLayoutConfig() {
    return {
      horizontalNodeGap: 240,
      verticalNodeGap: 20,
      startX: 1,
      startY: 1,
      defaultNodeWidth: 240,
      defaultNodeHeight: 36
    };
  }
}
class nS extends Cc {
  assignCoordinatesToNodes() {
    const t = this.getLayoutConfig();
    let n = t.startY;
    Array.from(this.levelToNodesMap.values()).forEach((r) => {
      let i = t.startX, a = 0;
      r.forEach((s) => {
        s.x = i, s.y = n, i += (s.renderedData()?.getBoudingBox()?.width ?? t.defaultNodeWidth) + t.horizontalNodeGap, a = Math.max(
          a,
          s.renderedData()?.getBoudingBox()?.height ?? t.defaultNodeHeight
        );
      }), n += a + t.verticalNodeGap;
    });
  }
  verticallyCenterAlignNodes() {
    const t = this.getLayoutConfig(), n = Math.max(
      ...Array.from(this.levelToNodesMap.values()).map((r) => r.length)
    );
    Array.from(this.levelToNodesMap.values()).forEach((r) => {
      r.forEach((i) => {
        i.x += (n - r.length) * ((i.renderedData()?.getBoudingBox()?.width ?? t.defaultNodeWidth) + t.horizontalNodeGap) / 2;
      });
    });
  }
  getLayoutConfig() {
    return {
      horizontalNodeGap: 40,
      verticalNodeGap: 100,
      startX: 1,
      startY: 1,
      defaultNodeWidth: 160,
      defaultNodeHeight: 56
    };
  }
}
const rS = "#b7bfc2", iS = "#f0f6ff", Lo = "#080909", aS = "#1868f1";
class sS {
  constructor(t) {
    this.svgUtils = t;
  }
  className = "demarcation";
  classIcon = "demarcation-icon";
  draw(t, n) {
    const r = P(t);
    r.selectAll(`.${this.className}`).remove(), n.forEach((i, a) => {
      const s = r.append("g").classed(this.className, !0);
      if (this.getLinePositionsForDemarcation(
        i,
        a,
        n.length
      ).forEach((h) => {
        s.append("path").attr("d", () => this.getLinePathString(h)).attr("stroke", rS).attr("stroke-width", 1).attr("stroke-dasharray", "4, 4");
      }), i.backgroundColor) {
        const h = i.horizontalDimension.end - i.horizontalDimension.start, d = i.verticalDimension.end - i.verticalDimension.start;
        s.append("rect").attr("x", i.horizontalDimension.start).attr("y", i.verticalDimension.start).attr("width", h).attr("height", d).attr("fill", i.backgroundColor).attr("opacity", 0.3);
      }
      const c = 40, l = i.horizontalDimension.end - i.horizontalDimension.start - c;
      s.append("rect").attr("x", i.horizontalDimension.start + c / 2).attr("y", i.verticalDimension.start + c / 2).attr("width", l).attr("height", 24).attr("rx", 4).attr("ry", 4).attr("fill", iS).on("mouseover", () => {
        i.icon && s.select(`g.${this.classIcon}`).attr("visibility", "visible");
      }).on("mouseleave", () => {
        i.icon && s.select(`g.${this.classIcon}`).attr("visibility", "hidden");
      });
      const u = i.horizontalDimension.start + (i.horizontalDimension.end - i.horizontalDimension.start) / 2;
      if (s.append("text").text(i.title.toUpperCase()).attr("text-anchor", "middle").attr("x", u).attr("y", i.verticalDimension.start + 32).attr("dominant-baseline", "central").attr("font-size", "12px").attr("font-weight", "600"), i.icon) {
        const h = this.svgUtils.getElementTextLength(
          s.select("text").node()
        ), f = s.append("g").classed(this.classIcon, !0).attr("visibility", "hidden").append("svg").attr("width", 12).attr("height", 12).attr("x", u + h / 2 + 6).attr("y", i.verticalDimension.start + 26).attr("viewBox", "0 0 24 24").style("cursor", "pointer").style("color", Lo);
        f.append("path").attr("d", i.icon.svgPathData).attr("fill", "currentColor"), f.on("mouseover", function() {
          P(this).style("color", aS);
        }).on("mouseleave", function() {
          P(this).style("color", Lo);
        }).on("click", (m) => {
          i.icon?.onClick(), m.stopPropagation();
        });
      }
    });
  }
  getLinePositionsForDemarcation(t, n, r) {
    const i = [];
    return n !== 0 && i.push({
      source: {
        x: t.horizontalDimension.start,
        y: t.verticalDimension.start
      },
      target: {
        x: t.horizontalDimension.start,
        y: t.verticalDimension.end
      }
    }), (t.bordered ?? !1) && (n === 0 && i.push({
      source: {
        x: t.horizontalDimension.start,
        y: t.verticalDimension.start
      },
      target: {
        x: t.horizontalDimension.start,
        y: t.verticalDimension.end
      }
    }), n === r - 1 && i.push({
      source: {
        x: t.horizontalDimension.end,
        y: t.verticalDimension.start
      },
      target: {
        x: t.horizontalDimension.end,
        y: t.verticalDimension.end
      }
    }), i.push(
      {
        source: {
          x: t.horizontalDimension.start,
          y: t.verticalDimension.start
        },
        target: {
          x: t.horizontalDimension.end,
          y: t.verticalDimension.start
        }
      },
      {
        source: {
          x: t.horizontalDimension.start,
          y: t.verticalDimension.end
        },
        target: {
          x: t.horizontalDimension.end,
          y: t.verticalDimension.end
        }
      }
    )), i;
  }
  getLinePathString(t) {
    const n = t.source.x, r = t.source.y, i = t.target.x, a = t.target.y, s = Se();
    return s.moveTo(n, r), s.lineTo(i, a), s.toString();
  }
}
class tn {
  constructor(t, n) {
    this.hostElement = t, this.config = n, this.userNodes = n.nodes, this.nodeRenderer = n.nodeRenderer, this.edgeRenderer = n.edgeRenderer, this.tooltipCallbacks = n.tooltipCallbacks, this.stateManager = new nv(this.config), this.supportGroupNode = this.config.supportGroupNode ?? !1, this.enableDemarcation = this.config.enableDemarcation ?? !1, this.topologyData = this.topologyConverter.convertTopology(
      this.userNodes,
      this.stateManager,
      this.nodeRenderer,
      void 0,
      this.supportGroupNode
    ), this.d3Util = new xn();
    const r = new Sn(
      new sr(),
      this.d3Util
    );
    this.drag = new ev(this.d3Util), this.hover = new ei(this.d3Util), this.click = new tv(this.d3Util), this.zoom = new Le(), this.layout = this.config.customLayout ?? this.initializeLayout(this.config.layoutType), this.demarcationRenderer = new sS(r);
  }
  static CONTAINER_CLASS = "topology-internal-container";
  static SVG_CLASS = "topology-svg";
  static DATA_CLASS = "topology-data";
  destroyCallbacks = [];
  topologyData;
  zoom;
  drag;
  hover;
  click;
  stateManager;
  dataClearCallbacks = [];
  container;
  tooltipCallbacks;
  layout;
  supportGroupNode;
  enableDemarcation;
  userNodes;
  nodeRenderer;
  edgeRenderer;
  d3Util;
  width = 0;
  height = 0;
  topologyConverter = new Qy();
  neighborhoodFinder = new Jy();
  demarcationRenderer;
  getStateManager() {
    return this.stateManager;
  }
  getZoom() {
    return this.zoom;
  }
  getConfig() {
    return this.config;
  }
  getCurrentTopology() {
    return this.topologyData;
  }
  relayout() {
    this.updateLayout();
  }
  initializeLayout(t) {
    switch (t) {
      case On.GraphLayout:
        return new Cc();
      case On.VerticalGraphLayout:
        return new nS();
      case On.TreeLayout:
        return new Dc();
      case On.ForceLayout:
        return new eS();
      default:
        return new kv();
    }
  }
  draw() {
    if (this.updateMeasuredDimensions(), !this.container) {
      this.container = this.initializeContainer();
      const t = this.stateManager.stateChange$.subscribe(
        () => this.updateRenderedState()
      );
      this.onDestroy(() => t.unsubscribe());
    }
    return this.clearAndDrawNewData(), this;
  }
  destroy() {
    this.runAndDrainCallbacks(this.destroyCallbacks);
  }
  onDestroy(t) {
    return this.destroyCallbacks.push(t), this;
  }
  updatePositions = Hc(() => {
    this.topologyData.nodes.forEach(
      (t) => this.nodeRenderer.updateNodePosition(t)
    ), this.topologyData.edges.forEach(
      (t) => this.edgeRenderer.updateEdgePosition(t)
    );
  }, 20);
  updateRenderedState() {
    this.topologyData.nodes.forEach((t) => {
      t.state = this.stateManager.getNodeState(t.userNode), this.nodeRenderer.updateNodeState(t);
    }), this.topologyData.edges.forEach((t) => {
      t.state = this.stateManager.getEdgeState(t.userEdge), this.edgeRenderer.updateEdgeState(t);
    });
  }
  updateLayout() {
    this.supportGroupNode ? (this.runAndDrainCallbacks(this.dataClearCallbacks), this.collapseGroupNodesIfPresent(), this.layout.layout(this.topologyData, this.width, this.height), this.drawData(this.topologyData, this.nodeRenderer, this.edgeRenderer)) : (this.layout.layout(this.topologyData, this.width, this.height), this.updatePositions());
  }
  initializeContainer() {
    if (this.container)
      return this.container;
    const n = P(this.hostElement).append("div").classed(tn.CONTAINER_CLASS, !0).style("width", "100%").style("height", "100%").style("overflow", "hidden"), r = n.node(), i = n.append("svg").classed(tn.SVG_CLASS, !0).classed("viz-font-family", !0).attr("width", "100%").attr("height", "100%"), a = i.append("g").classed(tn.DATA_CLASS, !0), s = {
      requireModifiers: [qn.Control, qn.Meta]
    }, o = {};
    return this.zoom.attachZoom({
      container: i,
      target: a,
      scroll: this.config.zoomable ? s : void 0,
      pan: this.config.zoomable ? o : void 0,
      showBrush: this.config.showBrush
    }), this.onDestroy(() => {
      this.runAndDrainCallbacks(this.dataClearCallbacks), n.remove(), this.container = void 0;
    }), r;
  }
  drawData(t, n, r) {
    const i = P(this.hostElement).select(
      `.${tn.DATA_CLASS}`
    );
    if (this.drawNodesAndEdges(i.node(), t, n, r), this.dataClearCallbacks.push(
      () => t.edges.forEach((a) => r.destroyEdge(a))
    ), this.dataClearCallbacks.push(
      () => t.nodes.forEach((a) => n.destroyNode(a))
    ), this.config.draggableNodes) {
      const a = this.drag.addDragBehavior(t, n, this.supportGroupNode).subscribe((s) => this.onNodeDrag(s));
      this.dataClearCallbacks.push(() => a.unsubscribe());
    }
    if (this.config.hoverableNodes) {
      const a = this.hover.addNodeHoverBehavior(t.nodes, n, {
        endHoverEvents: this.getHoverEndEventsFromConfig()
      }).subscribe((s) => this.onNodeHoverEvent(s));
      this.dataClearCallbacks.push(() => a.unsubscribe());
    }
    if (this.config.hoverableEdges) {
      const a = this.hover.addEdgeHoverBehavior(t.edges, r, {
        endHoverEvents: this.getHoverEndEventsFromConfig()
      }).subscribe((s) => this.onEdgeHoverEvent(s));
      this.dataClearCallbacks.push(() => a.unsubscribe());
    }
    if (this.config.clickableNodes) {
      const a = this.click.addNodeClickBehavior(t.nodes, n).subscribe((s) => this.onNodeClick(s));
      this.dataClearCallbacks.push(() => a.unsubscribe());
    }
    if (this.config.clickableEdges) {
      const a = this.click.addEdgeClickBehavior(t.edges, r).subscribe((s) => this.onEdgeClick(s));
      this.dataClearCallbacks.push(() => a.unsubscribe());
    }
  }
  drawNodesAndEdges(t, n, r, i) {
    this.enableDemarcation && this.demarcationRenderer.draw(
      t,
      n.demarcations ?? []
    ), n.nodes.forEach(
      (a) => r.drawNode(t, a)
    ), n.edges.forEach(
      (a) => i.drawEdge(t, a)
    ), n.nodes.forEach(
      (a) => P(r.getElementForNode(a)).raise()
    ), this.zoom.updateBrushOverlayWithData(n.nodes);
  }
  updateMeasuredDimensions() {
    const t = this.hostElement.getBoundingClientRect();
    this.width = t.width, this.height = t.height;
  }
  runAndDrainCallbacks(t) {
    t.forEach((n) => n()), t.length = 0;
  }
  clearAndDrawNewData() {
    this.runAndDrainCallbacks(this.dataClearCallbacks), this.supportGroupNode && (this.userNodes = Ut.collapseGroupNodes(this.userNodes)), this.topologyData = this.topologyConverter.convertTopology(
      this.userNodes,
      this.stateManager,
      this.nodeRenderer,
      this.topologyData,
      this.supportGroupNode
    ), this.layout.layout(this.topologyData, this.width, this.height), this.config.autoGroupDiscriminator && (this.topologyData.demarcations = Xy(
      this.topologyData,
      this.config.autoGroupDiscriminator
    )), this.drawData(this.topologyData, this.nodeRenderer, this.edgeRenderer);
  }
  onNodeHoverEvent(t) {
    t.event === "end" ? (this.resetVisibility(), this.tooltipCallbacks?.hide()) : (this.emphasizeTopologyNeighborhood(
      this.neighborhoodFinder.neighborhoodForNode(t.source.userNode),
      this.neighborhoodFinder.singleNodeNeighborhood(
        t.source.userNode
      )
    ), (this.config.nodeInteractionHandler?.disableTooltipOnHover ?? !1) || this.showNodeTooltip(t.source, !1));
  }
  onEdgeHoverEvent(t) {
    t.event === "end" ? (this.resetVisibility(), this.tooltipCallbacks?.hide()) : (this.emphasizeTopologyNeighborhood(
      this.neighborhoodFinder.neighborhoodForEdge(t.source.userEdge)
    ), (this.config.edgeInteractionHandler?.disableTooltipOnHover ?? !1) || this.showEdgeTooltip(t.source, !1));
  }
  resetVisibility() {
    this.stateManager.updateState({
      neighborhood: this.topologyData.neighborhood,
      update: {
        visibility: At.Normal
      }
    });
  }
  emphasizeTopologyNeighborhood(t, n = this.neighborhoodFinder.emptyNeighborhood()) {
    this.stateManager.updateState(
      {
        neighborhood: this.topologyData.neighborhood,
        update: {
          visibility: At.Background
        }
      },
      {
        neighborhood: t,
        update: {
          visibility: At.Emphasized
        }
      },
      {
        neighborhood: n,
        update: {
          visibility: At.Focused
        }
      }
    );
  }
  getHoverEndEventsFromConfig() {
    const t = [];
    return this.config.clickableNodes && t.push("click"), this.config.draggableNodes && t.push(this.drag.getDragEventName()), t;
  }
  onNodeClick(t) {
    this.emphasizeTopologyNeighborhood(
      this.neighborhoodFinder.neighborhoodForNode(t.userNode),
      this.neighborhoodFinder.singleNodeNeighborhood(t.userNode)
    ), this.supportGroupNode && this.checkAndHandleGroupNodeClick(t), pe(this.config.nodeInteractionHandler?.click) ? this.tooltipCallbacks && (this.showNodeTooltip(t, !0), this.tooltipCallbacks.onHidden(() => this.resetVisibility())) : this.config.nodeInteractionHandler?.click(t.userNode).subscribe(() => this.resetVisibility());
  }
  checkAndHandleGroupNodeClick(t) {
    const n = t.userNode;
    Ut.isTopologyGroupNode(n) && (this.userNodes = Ut.getUpdatedNodesOnGroupNodeClick(
      n,
      this.userNodes
    ), this.runAndDrainCallbacks(this.dataClearCallbacks), this.convertTopology(), Ut.updateLayoutForGroupNode(this.topologyData, n), this.drawData(this.topologyData, this.nodeRenderer, this.edgeRenderer));
  }
  collapseGroupNodesIfPresent() {
    this.userNodes = Ut.collapseGroupNodes(this.userNodes), this.convertTopology();
  }
  convertTopology() {
    this.topologyData = this.topologyConverter.convertTopology(
      this.userNodes,
      this.stateManager,
      this.nodeRenderer,
      this.topologyData,
      this.supportGroupNode
    );
  }
  onEdgeClick(t) {
    this.emphasizeTopologyNeighborhood(
      this.neighborhoodFinder.neighborhoodForEdge(t.userEdge)
    ), pe(this.config.edgeInteractionHandler?.click) ? this.tooltipCallbacks && (this.showEdgeTooltip(t, !0), this.tooltipCallbacks.onHidden(() => this.resetVisibility())) : this.config.edgeInteractionHandler?.click(t.userEdge).subscribe(() => this.resetVisibility());
  }
  onNodeDrag(t) {
    switch (t.type) {
      case "start":
      case "end":
        this.stateManager.updateState({
          nodes: [t.node.userNode],
          update: {
            dragging: t.type === "start"
          }
        });
        break;
      case "drag":
        this.supportGroupNode && Ut.updateLayoutOnGroupNodeDrag(
          t,
          this.topologyData
        ), this.updatePositions();
        break;
      default:
        Bn(t.type);
    }
  }
  showNodeTooltip(t, n) {
    const r = this.nodeRenderer.getElementForNode(t);
    !r || !this.tooltipCallbacks || this.tooltipCallbacks.showNodeTooltip(t.userNode, r, n);
  }
  showEdgeTooltip(t, n) {
    const r = this.edgeRenderer.getElementForEdge(t);
    !r || !this.tooltipCallbacks || this.tooltipCallbacks.showEdgeTooltip(t.userEdge, r, n);
  }
}
const ko = [];
function oS(e) {
  const {
    containerRef: t,
    nodes: n,
    nodeRenderer: r,
    edgeRenderer: i,
    layoutType: a,
    customLayout: s,
    nodeDataSpecifiers: o,
    edgeDataSpecifiers: c,
    tooltipComponent: l,
    nodeInteractionHandler: u,
    edgeInteractionHandler: h,
    draggableNodes: d = !0,
    hoverableNodes: f = !0,
    hoverableEdges: m = !0,
    clickableNodes: y = !0,
    clickableEdges: g = !0,
    showBrush: p = !0,
    shouldAutoZoomToFit: x = !1,
    supportGroupNode: w = !1,
    enableDemarcation: v = !1,
    autoGroupDiscriminator: T,
    zoomable: A = !0
  } = e, R = o ?? ko, O = c ?? ko, [E, N] = St(
    null
  ), [_, D] = St(null), b = lt(null), S = lt({
    tooltipCallbacks: void 0,
    nodeDataSpecifiers: R,
    edgeDataSpecifiers: O,
    nodeInteractionHandler: u,
    edgeInteractionHandler: h,
    draggableNodes: d,
    hoverableNodes: f,
    hoverableEdges: m,
    clickableNodes: y,
    clickableEdges: g,
    zoomable: A,
    showBrush: p,
    shouldAutoZoomToFit: x,
    supportGroupNode: w,
    enableDemarcation: v,
    autoGroupDiscriminator: T
  });
  S.current = {
    ...S.current,
    nodeDataSpecifiers: R,
    edgeDataSpecifiers: O,
    nodeInteractionHandler: u,
    edgeInteractionHandler: h,
    draggableNodes: d,
    hoverableNodes: f,
    hoverableEdges: m,
    clickableNodes: y,
    clickableEdges: g,
    zoomable: A,
    showBrush: p,
    shouldAutoZoomToFit: x,
    supportGroupNode: w,
    enableDemarcation: v,
    autoGroupDiscriminator: T
  };
  const { show: L, hide: M, on: k } = rl();
  wt(() => {
    if (!l) {
      S.current.tooltipCallbacks = void 0;
      return;
    }
    const Q = l;
    S.current.tooltipCallbacks = {
      showNodeTooltip: (Z, et) => {
        L({
          content: () => Ir(Q, {
            data: { type: "node", node: Z },
            onClose: () => M()
          }),
          position: {
            type: ee.FollowMouse,
            boundingElement: et,
            offsetX: 50,
            offsetY: 30
          }
        });
      },
      showEdgeTooltip: (Z, et) => {
        L({
          content: () => Ir(Q, {
            data: { type: "edge", edge: Z },
            onClose: () => M()
          }),
          position: {
            type: ee.FollowMouse,
            boundingElement: et,
            offsetX: 50,
            offsetY: 30
          }
        });
      },
      hide: () => {
        M();
      },
      onHidden: (Z) => {
        b.current = Z;
      }
    };
  }, [l, L, M]), wt(() => b.current ? k("hidden", () => {
    b.current?.(), b.current = null;
  }) : void 0, [k]), wt(() => {
    if (t.current)
      return () => {
        N((Q) => (Q?.destroy(), null));
      };
  }, [t, a, s]), wt(() => {
    if (!(!t.current || !n || !r || !i)) {
      D(null);
      try {
        const Q = S.current, Z = {
          nodes: n,
          nodeRenderer: r,
          edgeRenderer: i,
          tooltipCallbacks: Q.tooltipCallbacks,
          nodeDataSpecifiers: Q.nodeDataSpecifiers,
          edgeDataSpecifiers: Q.edgeDataSpecifiers,
          nodeInteractionHandler: Q.nodeInteractionHandler,
          edgeInteractionHandler: Q.edgeInteractionHandler,
          draggableNodes: d,
          hoverableNodes: f,
          hoverableEdges: m,
          clickableNodes: y,
          clickableEdges: g,
          zoomable: A,
          showBrush: p,
          shouldAutoZoomToFit: x,
          layoutType: a,
          customLayout: s,
          supportGroupNode: w,
          enableDemarcation: v,
          autoGroupDiscriminator: T
        }, et = new tn(t.current, Z);
        return N(et), setTimeout(() => {
          et.draw(), x && requestAnimationFrame(() => {
            const ut = et.getCurrentTopology()?.nodes;
            if (ut && ut.length > 0) {
              const J = v ? 60 : 0;
              et.getZoom()?.zoomToFit(ut, J);
            }
          });
        }), () => {
          et.destroy(), N(null);
        };
      } catch (Q) {
        console.error("Error creating topology:", Q), D(Q instanceof Error ? Q.message : "Unknown error");
      }
    }
  }, [
    t,
    n,
    r,
    i,
    a,
    s,
    d,
    f,
    m,
    y,
    g,
    A,
    p,
    x,
    w,
    v,
    T
  ]);
  const H = Y(() => {
    E?.draw();
  }, [E]);
  vn(
    t,
    H
  );
  const F = E?.getStateManager() ?? null, U = E?.getZoom() ?? null, W = Y(
    () => E?.getCurrentTopology() ?? {
      nodes: [],
      edges: [],
      neighborhood: { nodes: [], edges: [] }
    },
    [E]
  ), X = Y(() => {
    E?.relayout();
  }, [E]);
  return ft(
    () => ({
      stateManager: F,
      zoom: U,
      currentTopology: E ? W : null,
      relayout: E ? X : null,
      error: _
    }),
    [
      F,
      U,
      E,
      W,
      X,
      _
    ]
  );
}
function lS(e) {
  if (e.length <= 50) return;
  const t = bc(
    e,
    "type"
  ), n = t.discriminatorValues.type ?? [];
  if (n.length <= 1) return;
  const r = {};
  if (n.forEach((i) => {
    const a = t.perTypeMetadataKeys[i] ?? [];
    a.length > 0 && (r[i] = { fields: [a[0]] });
  }), Object.keys(r).length !== 0)
    return {
      discriminator: "type",
      rules: r,
      minGroupSize: 3
    };
}
function ix({
  nodes: e,
  nodeRenderer: t,
  edgeRenderer: n,
  layoutType: r,
  customLayout: i,
  nodeDataSpecifiers: a,
  edgeDataSpecifiers: s,
  tooltipComponent: o,
  nodeInteractionHandler: c,
  edgeInteractionHandler: l,
  draggableNodes: u = !0,
  hoverableNodes: h = !0,
  hoverableEdges: d = !0,
  clickableNodes: f = !0,
  clickableEdges: m = !0,
  showBrush: y = !1,
  shouldAutoZoomToFit: g = !0,
  supportGroupNode: p = !1,
  enableDemarcation: x = !1,
  zoomable: w = !0,
  autoGroup: v
}) {
  const T = lt(null), A = ft(
    () => v ? void 0 : lS(e),
    [e, v]
  ), [R, O] = St(null), E = lt(e);
  wt(() => {
    E.current !== e && (E.current = e, O(null));
  }, [e]);
  const [N, _] = St({
    draggableNodes: u,
    zoomable: w,
    showBrush: y,
    shouldAutoZoomToFit: g
  }), D = !v, b = v ?? (R !== null ? R.value : A), S = Y(
    (et) => {
      O({ value: et });
    },
    []
  ), L = Y((et) => {
    _(et);
  }, []), M = ft(() => b ? Hy(e, b) : e, [e, b]), k = p || !!b, H = x || !!b?.discriminator, F = b?.discriminator || void 0, { stateManager: U, zoom: W, currentTopology: X, relayout: Q, error: Z } = oS({
    containerRef: T,
    nodes: M,
    nodeRenderer: t,
    edgeRenderer: n,
    layoutType: r,
    customLayout: i,
    nodeDataSpecifiers: a,
    edgeDataSpecifiers: s,
    tooltipComponent: o,
    nodeInteractionHandler: c,
    edgeInteractionHandler: l,
    draggableNodes: N.draggableNodes,
    hoverableNodes: h,
    hoverableEdges: d,
    clickableNodes: f,
    clickableEdges: m,
    showBrush: N.showBrush,
    shouldAutoZoomToFit: N.shouldAutoZoomToFit,
    supportGroupNode: k,
    enableDemarcation: H,
    autoGroupDiscriminator: F,
    zoomable: N.zoomable
  });
  return Z ? /* @__PURE__ */ C("div", { className: "flex items-center justify-center h-full p-cn-md text-center", children: /* @__PURE__ */ V("div", { children: [
    /* @__PURE__ */ C("p", { className: "text-cn-danger-primary font-semibold", children: "Topology Rendering Error" }),
    /* @__PURE__ */ C("p", { className: "text-cn-size-2 text-cn-3 mt-cn-xs", children: Z })
  ] }) }) : /* @__PURE__ */ V("div", { className: "topology-chart w-full h-full flex flex-col", children: [
    /* @__PURE__ */ C("div", { className: "flex justify-end px-cn-xs py-cn-4xs shrink-0", children: /* @__PURE__ */ C(
      By,
      {
        stateManager: U,
        zoom: W,
        currentTopology: X,
        onRelayout: Q,
        enableDemarcation: x,
        zoomable: N.zoomable,
        nodeDataSpecifiers: a,
        edgeDataSpecifiers: s,
        settingsSlot: D ? /* @__PURE__ */ C(
          Ky,
          {
            nodes: e,
            autoGroupConfig: b,
            onGroupingChange: S,
            settingsState: N,
            onSettingsChange: L
          }
        ) : void 0
      }
    ) }),
    /* @__PURE__ */ C(
      "div",
      {
        ref: T,
        className: "w-full flex-1 min-h-0 overflow-hidden"
      }
    )
  ] });
}
class ax {
  rendererDelegates = [];
  renderedNodeMap = /* @__PURE__ */ new WeakMap();
  d3Utils = new xn();
  withDelegate(t) {
    return this.rendererDelegates.push(t), this;
  }
  drawNode(t, n) {
    const r = this.getMatchingDelegate(n.userNode);
    if (!r)
      return;
    const i = this.createNodeContainer(t);
    r.draw(i, n.userNode, n.state), this.renderedNodeMap.set(n, {
      element: i,
      delegate: r
    }), this.updateNodePosition(n);
  }
  getRenderedNodeData(t) {
    const n = this.getMatchingDelegate(t.userNode);
    if (n)
      return {
        getAttachmentPoint: (r) => this.mapNodeCoordinatesToTopologyCoordinates(
          n.getAttachmentPoint(r, t.userNode),
          t
        ),
        getBoudingBox: () => this.getBoundingBox(t, n)
      };
  }
  updateNodePosition(t) {
    const n = this.renderedNodeMap.get(t);
    if (!n)
      return;
    const r = this.getBoundedX(t), i = this.getBoundedY(t);
    this.d3Utils.select(n.element).attr("transform", `translate(${r}, ${i})`);
  }
  updateNodeState(t) {
    const n = this.renderedNodeMap.get(t);
    n && n.delegate.updateState(
      n.element,
      t.userNode,
      t.state
    );
  }
  getElementForNode(t) {
    const n = this.renderedNodeMap.get(t);
    return n && n.element;
  }
  destroyNode(t) {
    const n = this.renderedNodeMap.get(t);
    n && (n.element.remove(), n.delegate.destroy?.(t.userNode), this.renderedNodeMap.delete(t));
  }
  createNodeContainer(t) {
    return this.d3Utils.select(t).append("g").node();
  }
  getBoundedX(t) {
    return t.x;
  }
  getBoundedY(t) {
    return t.y;
  }
  mapNodeCoordinatesToTopologyCoordinates(t, n) {
    return {
      x: t.x + this.getBoundedX(n),
      y: t.y + this.getBoundedY(n)
    };
  }
  getMatchingDelegate(t) {
    return this.rendererDelegates.find((n) => n.matches(t));
  }
  getBoundingBox(t, n) {
    const r = n.width(t.userNode), i = n.height(t.userNode);
    return {
      left: t.x,
      top: t.y,
      right: t.x + r,
      bottom: t.y + i,
      width: r,
      height: i
    };
  }
}
class sx {
  rendererDelegates = [];
  rendererEdgeMap = /* @__PURE__ */ new WeakMap();
  d3Utils = new xn();
  withDelegate(t) {
    return this.rendererDelegates.push(t), this;
  }
  drawEdge(t, n) {
    const r = this.getMatchingDelegate(n.userEdge), i = this.buildEdgePosition(n);
    if (!r || !i)
      return;
    const a = this.createEdgeContainer(t);
    r.draw(a, n.userEdge, i, n.state), this.rendererEdgeMap.set(n, {
      element: a,
      delegate: r
    });
  }
  updateEdgePosition(t) {
    const n = this.rendererEdgeMap.get(t), r = this.buildEdgePosition(t);
    !n || !r || n.delegate.updatePosition(
      n.element,
      t.userEdge,
      r
    );
  }
  updateEdgeState(t) {
    const n = this.rendererEdgeMap.get(t);
    n && n.delegate.updateState(
      n.element,
      t.userEdge,
      t.state
    );
  }
  destroyEdge(t) {
    const n = this.rendererEdgeMap.get(t);
    n && (n.element.remove(), this.rendererEdgeMap.delete(t));
  }
  getElementForEdge(t) {
    const n = this.rendererEdgeMap.get(t);
    return n && n.element;
  }
  createEdgeContainer(t) {
    return this.d3Utils.select(t).append("g").node();
  }
  buildEdgePosition(t) {
    const n = t.source.renderedData(), r = t.target.renderedData();
    if (!n || !r)
      return;
    const i = Op(t.source, t.target), a = Xl(i + Math.PI), s = n.getAttachmentPoint(i), o = r.getAttachmentPoint(a);
    return Zs(t.source, s) > Zs(t.source, o) ? {
      source: o,
      sourceRad: a,
      target: s,
      targetRad: i
    } : {
      source: s,
      sourceRad: i,
      target: o,
      targetRad: a
    };
  }
  getMatchingDelegate(t) {
    return this.rendererDelegates.find((n) => n.matches(t));
  }
}
const xe = 160, Xt = 56, Io = 8, _e = 32, wr = 12, Ee = 14, Gi = "topology-node-shadow-hover", Vi = "topology-node-shadow-focus", cS = "var(--cn-bg-1)", Oo = "var(--cn-border-3)", uS = "var(--cn-border-1)", Bo = "var(--cn-brand)", hS = "var(--cn-text-1)", br = "var(--cn-text-3)", dS = "#0278d5", fS = "M3 4.5h18v2H3v-2zm3 5h12v2H6v-2zm3 5h6v2H9v-2z";
class ox {
  svgUtils;
  onFilterClick;
  nodeElementMap = /* @__PURE__ */ new WeakMap();
  constructor(t) {
    const n = new xn();
    this.svgUtils = new Sn(
      new sr(),
      n
    ), this.onFilterClick = t?.onFilterClick;
  }
  matches(t) {
    return t.nodeType === "default-node";
  }
  draw(t, n, r) {
    this.defineFilters(t), this.nodeElementMap.set(n, t);
    const i = P(t).classed("default-topology-node", !0).style("cursor", "pointer");
    i.append("rect").classed("node-bg", !0).attr("width", xe).attr("height", Xt).attr("rx", Io).attr("ry", Io).style("fill", cS).style("stroke", Oo).attr("stroke-width", 1);
    const a = n.color ?? br;
    i.append("circle").classed("node-icon-bg", !0).attr("cx", wr + _e / 2).attr("cy", Xt / 2).attr("r", _e / 2).style("fill", a).attr("opacity", 0.12), n.icon ? i.append("svg").attr("x", wr + 4).attr("y", (Xt - _e + 8) / 2).attr("width", _e - 8).attr("height", _e - 8).attr("viewBox", "0 0 24 24").append("path").attr("d", n.icon).style("fill", a) : i.append("text").classed("node-icon-letter", !0).attr("x", wr + _e / 2).attr("y", Xt / 2).attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-size", "14px").attr("font-weight", "600").style("fill", a).text(n.name.charAt(0).toUpperCase());
    const s = wr + _e + 10, o = this.onFilterClick ? xe - s - Ee - 12 : xe - s - 10, c = i.append("text").classed("node-name", !0).attr("x", s).attr("y", n.type ? Xt / 2 - 7 : Xt / 2).attr("dominant-baseline", "central").attr("font-size", "13px").attr("font-weight", "500").style("fill", hS).text(n.name);
    if (this.svgUtils.truncateText(c.node(), o), c.node().textContent !== n.name && c.append("title").text(n.name), n.type && i.append("text").classed("node-type", !0).attr("x", s).attr("y", Xt / 2 + 9).attr("dominant-baseline", "central").attr("font-size", "11px").style("fill", br).text(n.type), this.onFilterClick) {
      const l = i.append("g").classed("filter-action", !0).attr("visibility", "hidden").style("cursor", "pointer"), u = xe - Ee - 8, h = (Xt - Ee) / 2;
      l.append("rect").attr("x", u - 4).attr("y", h - 4).attr("width", Ee + 8).attr("height", Ee + 8).attr("fill", "transparent"), l.append("svg").attr("x", u).attr("y", h).attr("width", Ee).attr("height", Ee).attr("viewBox", "0 0 24 24").style("color", br).style("pointer-events", "none").append("path").attr("d", fS).attr("fill", "currentColor");
      const d = this.onFilterClick;
      l.on("mouseover", function() {
        P(this).select("svg").style("color", Bo);
      }).on("mouseleave", function() {
        P(this).select("svg").style("color", br);
      }).on("click", function(f) {
        f.stopPropagation(), d?.(n);
      });
    }
    this.updateState(t, n, r);
  }
  updateState(t, n, r) {
    const i = P(t), a = i.select("rect.node-bg"), s = i.select("g.filter-action");
    i.style("filter", ""), i.style("opacity", ""), a.style("stroke", Oo).attr("stroke-width", 1), s.empty() || s.attr("visibility", "hidden");
    const o = r.visibility;
    (o === At.Emphasized || r.dragging) && (i.style("filter", `url(#${Gi})`), a.style("stroke", uS)), o === At.Focused && (i.style("filter", `url(#${Vi})`), a.style("stroke", Bo).attr("stroke-width", 1.5), s.empty() || s.attr("visibility", "visible")), o === At.Background && i.style("opacity", "0.2");
  }
  destroy(t) {
    this.nodeElementMap.delete(t);
  }
  height(t) {
    return Xt;
  }
  width(t) {
    return xe;
  }
  getAttachmentPoint(t, n) {
    return gS(t) ? { x: xe / 2, y: 0 } : pS(t) ? { x: xe / 2, y: Xt } : {
      x: t >= 0 && t < Math.PI / 4 || t > 7 * Math.PI / 4 && t <= 2 * Math.PI ? xe : 0,
      y: Xt / 2
    };
  }
  defineFilters(t) {
    let n = t;
    for (; n && n.tagName !== "svg"; )
      n = n.parentElement;
    if (!n) return;
    const i = P(n).selectAll("defs").data([null]).join("defs");
    if (i.select(`#${Gi}`).empty()) {
      const a = i.append("filter").attr("id", Gi).attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
      a.append("feDropShadow").attr("dx", 0).attr("dy", 1).attr("stdDeviation", 2).attr("flood-color", "#000").attr("flood-opacity", 0.08), a.append("feDropShadow").attr("dx", 0).attr("dy", 2).attr("stdDeviation", 4).attr("flood-color", "#000").attr("flood-opacity", 0.06);
    }
    i.select(`#${Vi}`).empty() && i.append("filter").attr("id", Vi).attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%").append("feDropShadow").attr("dx", 0).attr("dy", 0).attr("stdDeviation", 3).attr("flood-color", dS).attr("flood-opacity", 0.25);
  }
}
function gS(e) {
  return e > Math.PI / 4 && e < 3 * Math.PI / 4;
}
function pS(e) {
  return e > 5 * Math.PI / 4 && e < 7 * Math.PI / 4;
}
const mS = "default-topology-edge", Xi = "edge-line", Po = "edge-label", ji = "default-edge-arrow", Fo = "var(--cn-border-3)", yS = "var(--cn-border-1)", vS = "var(--cn-brand)", Uo = "var(--cn-text-3)";
function Ho(e) {
  return e > Math.PI / 4 && e < 3 * Math.PI / 4 || e > 5 * Math.PI / 4 && e < 7 * Math.PI / 4;
}
function SS(e) {
  const { source: t, target: n, sourceRad: r, targetRad: i } = e, a = n.x - t.x, s = n.y - t.y, o = Se();
  if (o.moveTo(t.x, t.y), Math.abs(a) < 1 && Math.abs(s) < 1)
    return o.lineTo(n.x, n.y), o.toString();
  const c = (t.x + n.x) / 2, l = (t.y + n.y) / 2, u = Ho(r), h = Ho(i), d = u ? t.x : c, f = u ? l : t.y, m = h ? n.x : c, y = h ? l : n.y;
  return o.bezierCurveTo(d, f, m, y, n.x, n.y), o.toString();
}
class lx {
  matches(t) {
    return t.edgeType === "default-edge";
  }
  draw(t, n, r, i) {
    this.defineArrowMarker(t);
    const a = P(t).classed(mS, !0);
    a.append("path").classed(Xi, !0).attr("fill", "none").style("stroke", n.color ?? Fo).attr("stroke-width", 1.5).attr("marker-end", `url(#${ji})`), n.label && a.append("text").classed(Po, !0).attr("text-anchor", "middle").attr("dominant-baseline", "text-before-edge").attr("font-size", "10px").style("fill", Uo).text(n.label), this.updatePosition(t, n, r), this.updateState(t, n, i);
  }
  updatePosition(t, n, r) {
    const i = P(t), a = SS(r);
    i.select(`.${Xi}`).attr("d", a);
    const s = (r.source.x + r.target.x) / 2, o = (r.source.y + r.target.y) / 2;
    i.select(`.${Po}`).attr("x", s).attr("y", o - 4);
  }
  updateState(t, n, r) {
    const i = P(t), a = i.select(`.${Xi}`), s = n.color ?? Fo, o = r.visibility;
    switch (i.style("opacity", ""), a.style("stroke", s).attr("stroke-width", 1.5), o) {
      case At.Emphasized:
        a.style("stroke", yS).attr("stroke-width", 1.5);
        break;
      case At.Focused:
        a.style("stroke", vS).attr("stroke-width", 2);
        break;
      case At.Background:
        i.style("opacity", "0.15");
        break;
      case At.Hidden:
        i.style("opacity", "0");
        break;
    }
  }
  defineArrowMarker(t) {
    let n = t;
    for (; n && n.tagName !== "svg"; )
      n = n.parentElement;
    if (!n) return;
    const i = P(n).selectAll("defs").data([null]).join("defs");
    i.select(`#${ji}`).empty() && i.append("marker").attr("id", ji).attr("viewBox", "0 0 10 10").attr("refX", 10).attr("refY", 5).attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto-start-reverse").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").style("fill", Uo);
  }
}
const oe = 160, Cn = 72, Tr = 8, zo = 3, qi = "topology-group-shadow-hover", Zi = "topology-group-shadow-focus", $o = "var(--cn-bg-1)", Ki = "var(--cn-border-3)", xS = "var(--cn-border-1)", Wo = "var(--cn-brand)", wS = "var(--cn-text-1)", bS = "var(--cn-text-3)", TS = "#0278d5", AS = "M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z";
class cx {
  matches(t) {
    return Ut.isTopologyGroupNode(t);
  }
  draw(t, n, r) {
    this.defineFilters(t);
    const i = P(t).classed("default-topology-group-node", !0).style("cursor", "pointer"), a = n.data.color ?? bS;
    i.append("rect").classed("stack-bg", !0).attr("x", zo).attr("y", -zo).attr("width", oe).attr("height", Cn).attr("rx", Tr).attr("ry", Tr).style("fill", $o).style("stroke", Ki).attr("stroke-width", 1), i.append("rect").classed("node-bg", !0).attr("width", oe).attr("height", Cn).attr("rx", Tr).attr("ry", Tr).style("fill", $o).style("stroke", Ki).attr("stroke-width", 1);
    const s = oe / 2, o = 10, c = 20;
    i.append("svg").attr("x", s - c / 2).attr("y", o).attr("width", c).attr("height", c).attr("viewBox", "0 0 24 24").append("path").attr("d", AS).style("fill", a);
    const l = o + c + 12;
    i.append("text").classed("group-title", !0).attr("x", oe / 2).attr("y", l).attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-size", "12px").attr("font-weight", "500").style("fill", wS).text(CS(n.data.title, 22));
    const u = l + 16;
    i.append("text").classed("group-count", !0).attr("x", oe / 2).attr("y", u).attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-size", "12px").attr("font-weight", "600").classed("viz-font-family-mono", !0).style("fill", Wo).text(String(n.children.length)), this.updateState(t, n, r);
  }
  updateState(t, n, r) {
    const i = P(t), a = i.select("rect.node-bg");
    i.style("filter", ""), i.style("opacity", ""), a.style("stroke", Ki).attr("stroke-width", 1);
    const s = r.visibility;
    (s === At.Emphasized || r.dragging) && (i.style("filter", `url(#${qi})`), a.style("stroke", xS)), s === At.Focused && (i.style("filter", `url(#${Zi})`), a.style("stroke", Wo).attr("stroke-width", 1.5)), s === At.Background && i.style("opacity", "0.2");
  }
  destroy(t) {
  }
  height(t) {
    return Cn;
  }
  width(t) {
    return oe;
  }
  getAttachmentPoint(t, n) {
    return DS(t) ? { x: oe / 2, y: 0 } : MS(t) ? { x: oe / 2, y: Cn } : {
      x: t >= 0 && t < Math.PI / 4 || t > 7 * Math.PI / 4 && t <= 2 * Math.PI ? oe : 0,
      y: Cn / 2
    };
  }
  defineFilters(t) {
    let n = t;
    for (; n && n.tagName !== "svg"; )
      n = n.parentElement;
    if (!n) return;
    const i = P(n).selectAll("defs").data([null]).join("defs");
    if (i.select(`#${qi}`).empty()) {
      const a = i.append("filter").attr("id", qi).attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
      a.append("feDropShadow").attr("dx", 0).attr("dy", 1).attr("stdDeviation", 2).attr("flood-color", "#000").attr("flood-opacity", 0.08), a.append("feDropShadow").attr("dx", 0).attr("dy", 2).attr("stdDeviation", 4).attr("flood-color", "#000").attr("flood-opacity", 0.06);
    }
    i.select(`#${Zi}`).empty() && i.append("filter").attr("id", Zi).attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%").append("feDropShadow").attr("dx", 0).attr("dy", 0).attr("stdDeviation", 3).attr("flood-color", TS).attr("flood-opacity", 0.25);
  }
}
function DS(e) {
  return e > Math.PI / 4 && e < 3 * Math.PI / 4;
}
function MS(e) {
  return e > 5 * Math.PI / 4 && e < 7 * Math.PI / 4;
}
function CS(e, t) {
  if (e.length <= t) return e;
  const n = Math.floor((t - 3) / 2);
  return `${e.slice(0, n)}...${e.slice(e.length - n)}`;
}
export {
  HS as ACTIVE_TIME_RANGE_PREF_KEY,
  ge as AnimationState,
  In as AnimationStates,
  ot as AxisLocation,
  G as AxisType,
  vi as CHART_VISUALIZATION_CLASS,
  jr as CartesianArea,
  yt as CartesianAxis,
  Fg as CartesianAxisCrosshair,
  we as CartesianBand,
  be as CartesianBar,
  XS as CartesianChart,
  _t as CartesianColumn,
  Un as CartesianDashedLine,
  cl as CartesianData,
  le as CartesianLine,
  ce as CartesianNoDataMessage,
  $0 as CartesianOrchestrator,
  Me as CartesianPoints,
  ln as CartesianScaleBuilder,
  pt as CartesianSeriesVisualizationType,
  jS as CartesianSkeleton,
  Jt as ChartEvent,
  Tu as ChartLegendPosition,
  xu as ChartLinkActionConfigType,
  cs as ChartSyncManager,
  Ht as ColorService,
  Bi as ColumnSkeleton,
  tS as CustomForceBuilder,
  kv as CustomTreeLayout,
  tn as D3Topology,
  gs as DATA_SERIES_CLASS,
  Yt as DEFAULT_CARTESIAN_ANIMATION_DURATION,
  jt as DEFAULT_CARTESIAN_AXIS_GROUP_NAME,
  lu as DEFAULT_TIME_RANGE,
  kS as DashboardUiVisualization,
  $e as DateCoercer,
  Ot as DateFormatMode,
  ke as DateFormatter,
  ii as DefaultChartTooltip,
  lx as DefaultEdgeRenderer,
  cx as DefaultGroupNodeRenderer,
  ox as DefaultNodeRenderer,
  oy as DisplayFileSizeFormatter,
  Je as DisplayNumberPipe,
  tx as DisplayTimeAgo,
  yc as DonutAlignmentStyle,
  ht as DonutBuilderService,
  KS as DonutChart,
  py as DonutDataLookupStrategy,
  my as DonutObject,
  QS as DonutSkeleton,
  jc as FilterButton,
  un as FixedTimeRange,
  eS as ForceLayout,
  kn as FormatterStyle,
  JS as GaugeChart,
  Cc as GraphLayout,
  $S as IntervalDurationProvider,
  Vc as IntervalSelect,
  Jc as LEGEND_DOT_SIZE,
  Zc as LEGEND_HEIGHT,
  ss as LEGEND_MAX_FONT_SIZE,
  tu as LEGEND_PADDING,
  Kc as LEGEND_SPACING_HORIZONTAL,
  Qc as LEGEND_SPACING_VERTICAL,
  bu as LabelOverflow,
  Ma as Legend,
  as as LegendEntry,
  tr as LegendFontSize,
  qc as LegendItem,
  dt as LegendLayout,
  B as LegendPosition,
  Z0 as LineSkeleton,
  IS as LoggerProvider,
  BS as NavigationProvider,
  re as NumericFormatter,
  Ka as OrdinalFormatter,
  _n as PopoverFixedPositionLocation,
  nl as PopoverInternalContext,
  ee as PopoverPositionType,
  GS as PopoverRef,
  Qt as PopoverRelativePositionLocation,
  YS as PopoverServiceProvider,
  Xc as RESIZE_DEBOUNCE_MS,
  qS as RadarChart,
  zn as RelativeTimeRange,
  qe as RenderingStrategy,
  xt as ScaleType,
  ou as TIME_RANGE_QUERY_PARAM,
  ct as TimeDuration,
  zS as TimeRangeProvider,
  j as TimeUnit,
  ix as TopologyChart,
  Qy as TopologyConverter,
  sS as TopologyDemarcationRenderer,
  sx as TopologyEdgeRendererService,
  At as TopologyElementVisibility,
  Ut as TopologyGroupNodeUtil,
  By as TopologyInteractionControl,
  pi as TopologyInternalNodeType,
  On as TopologyLayoutType,
  Jy as TopologyNeighborhoodFinder,
  ax as TopologyNodeRendererService,
  nv as TopologyStateManager,
  Le as TopologyZoom,
  Dc as TreeLayout,
  Wc as UnitStringType,
  mc as ValueType,
  nS as VerticalGraphLayout,
  $n as VizColor,
  Hy as autoGroupNodes,
  nu as calculateLegendLayout,
  ex as collapseWhitespace,
  US as computePreviousTimeRange,
  Ny as convertGaugeTooltipData,
  jo as defaultLogger,
  Zo as defaultNavigation,
  Iy as displayString,
  rx as displayStringEnum,
  ly as durationFormatter,
  Jo as durationFromString,
  F0 as floatFormatter,
  ti as formatValue,
  Gc as getAutoDurationFromTimeDurations,
  Yc as getIntervalLabel,
  os as getLegendHeight,
  eu as getLegendWidth,
  nx as getStringsFromCommaSeparatedList,
  Qo as getTimeRangeDuration,
  FS as getTimeRangeDurationMillis,
  ZS as getValueTypeLabel,
  De as hasBarSeries,
  P0 as integerFormatter,
  bc as introspectGroupingOptions,
  su as parseTimeRangeValue,
  Gt as selector,
  hu as toFixedTimeRange,
  uu as toRelativeTimeRange,
  VS as useChartSync,
  ai as useChartTooltip,
  yy as useDonutChart,
  WS as useIntervalDuration,
  OS as useLogger,
  PS as useNavigation,
  rl as usePopover,
  ry as useRadarChart,
  vn as useResizeObserver,
  cu as useTimeRange,
  oS as useTopologyOrchestrator
};
