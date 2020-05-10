var svgPanZoomContainer = (function (t) {
  "use strict";
  function u(t, e, n) {
    (t.scrollLeft += e), (t.scrollTop += n);
  }
  var S = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;
  var n =
      Element.prototype.matches ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.msMatchesSelector,
    r = Element.prototype.closest
      ? function (t, e) {
          return t && t.closest(e);
        }
      : function (t, e) {
          for (; t && !n.call(t, e); )
            t = t.parentNode instanceof Element ? t.parentNode : null;
          return t;
        };
  function m(t, e) {
    var n = r(t, "[" + e + "]");
    return n
      ? [
          n,
          (function (t) {
            var e = {};
            if (t)
              for (var n = 0, r = t.split(";"); n < r.length; n++) {
                var o = r[n],
                  a = o.indexOf(":");
                e[
                  o
                    .slice(0, a)
                    .trim()
                    .replace(/[a-zA-Z0-9_]-[a-z]/g, function (t) {
                      return t[0] + t[2].toUpperCase();
                    })
                ] = o.slice(a + 1).trim();
              }
            return e;
          })(n.getAttribute(e)),
        ]
      : [];
  }
  var d,
    f,
    a,
    i,
    e,
    p = function (t) {
      return t.preventDefault();
    };
  function y(t) {
    return +((t && t.getAttribute("data-scale")) || 1);
  }
  function o(t, e, n) {
    void 0 === n && (n = {});
    var r,
      o,
      a,
      i = t.firstElementChild,
      l = y(t),
      c =
        ((r = e),
        (o = n.minScale || 1),
        (a = n.maxScale || 10),
        r < o ? o : a < r ? a : r);
    if (c !== l) {
      var s = c / l,
        u = t.scrollLeft,
        m = t.scrollTop,
        d = i.getBoundingClientRect(),
        f = ((n.origin && n.origin.clientX) || 0) - d.left,
        p = ((n.origin && n.origin.clientY) || 0) - d.top;
      if ("transform" === n.scalingProperty) {
        var v = getComputedStyle(i),
          g = v.transformOrigin.split(" ").map(parseFloat),
          h = new S(v.transform);
        ((h = h.translate.apply(h, g.map(E))).d = h.a === h.d ? c : h.d * s),
          (h.a = c),
          (h = h.translate.apply(h, g)),
          (i.style.transform = h),
          i.setAttribute("transform", h);
      } else i.style.width = i.style.height = 100 * c + "%";
      t.setAttribute("data-scale", c),
        (t.scrollLeft = Math.round(u + f * s - f)),
        (t.scrollTop = Math.round(m + p * s - p));
    }
  }
  function l(t, e, n) {
    o(t, y(t) * e, n);
  }
  function E(t) {
    return -t;
  }
  return (
    (d = "data-pan-on-drag"),
    (f = { button: "left" }),
    addEventListener("mousedown", function (t) {
      if (0 === t.button || 2 === t.button) {
        var e = m(t.target, d),
          n = e[0],
          r = e[1];
        if (
          n &&
          r &&
          ((o = r),
          (a = f),
          t.button === ("right" === (o.button || a.button) ? 2 : 0))
        ) {
          var o, a;
          t.preventDefault();
          var i = t.clientX,
            l = t.clientY,
            c = function (t) {
              u(n, i - t.clientX, l - t.clientY),
                (i = t.clientX),
                (l = t.clientY),
                t.preventDefault();
            },
            s = function () {
              removeEventListener("mouseup", s),
                removeEventListener("mousemove", c),
                removeEventListener("contextmenu", p);
            };
          addEventListener("mouseup", s),
            addEventListener("mousemove", c),
            addEventListener("contextmenu", p);
        }
      }
    }),
    (a = "data-zoom-on-wheel"),
    (i = {
      minScale: 0.001,
      maxScale: 10000,
      zoomAmount: 0.001,
      scalingProperty: "width/height",
    }),
    void 0 === e && (e = {}),
    e.noEmitStyle ||
      ((document.head || document.body || document.documentElement).appendChild(
        document.createElement("style")
      ).textContent =
        "[" +
        a +
        "]{overflow:scroll}[" +
        a +
        "]>:first-child{width:100%;height:100%;vertical-align:middle;}"),
    addEventListener("wheel", function (t) {
      if(t.ctrlKey == true) {
        var e = m(t.target, a),
        n = e[0],
        r = e[1];
      if (n) {
        var o = +r.zoomAmount || i.zoomAmount;
        l(n, Math.pow(1 + o, -t.deltaY), {
          origin: t,
          minScale: +r.minScale || i.minScale,
          maxScale: +r.maxScale || i.maxScale,
          scalingProperty: r.scalingProperty || i.scalingProperty,
        })
      }
    }}),
    (t.pan = u),
    (t.getScale = y),
    (t.setScale = o),
    (t.resetScale = function (t, e) {
      o(t, 1, e);
    }),
    (t.zoom = l),
    t
    );
})({});


document.body.addEventListener("wheel", zoomShortcut, {passive:false});

function zoomShortcut(e){
    if(e.ctrlKey){ 
        event.preventDefault();
    }
}