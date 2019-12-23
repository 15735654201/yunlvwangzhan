$(function() {
		var cateScroller = document.querySelector(".cate-scroller");
		var scrollbar = document.querySelector(".scrollbar");
		var maxScrollLeft = cateScroller.scrollWidth - cateScroller.offsetWidth;
		cateScroller.onscroll = function(e) {
			scrollbar.style.left = e.target.scrollLeft / maxScrollLeft / 2 * 100 + "%"
		}
	})


	! function(e, t) {
		function n() {
			var t = o.getBoundingClientRect().width;
			if (t < 360) {
				t = 360
			};
			if (t > 414) {
				t = 414
			};
			n = t / 10;
			o.style.fontSize = n + "px", d.rem = e.rem = n
		}
		var i, r = e.document,
			o = r.documentElement,
			a = 0,
			d = t.flexible || (t.flexible = {}),
			s = e.navigator.appVersion.match(/iphone/gi),
			m = e.navigator.appVersion.match(/UCBrowser/gi),
			p = e.devicePixelRatio;
		a = s ? p >= 3 && (!a || a >= 3) ? 3 : p >= 2 && (!a || a >= 2) ? 2 : 1 : 1, o.setAttribute("data-dpr", a),
			"complete" === r.readyState ? r.body.style.fontSize = "12px" : r.addEventListener("DOMContentLoaded", function() {
				r.body.style.fontSize = "12px"
			}, !1);
		var c = "onorientationchange" in window ? "orientationchange" : "resize";
		if (e.addEventListener(c, function() {
				clearTimeout(i), i = setTimeout(n, 300)
			}, !1), e.addEventListener("pageshow", function(e) {
				e.persisted && (clearTimeout(i), i = setTimeout(n, 300))
			}, !1), n(), d.dpr = e.dpr = a, d.refreshRem = n, d.rem2px = function(e) {
				var t = parseFloat(e) * this.rem;
				return "string" == typeof e && e.match(/rem$/) && (t += "px"), t
			}, d.px2rem = function(e) {
				var t = parseFloat(e) / this.rem;
				return "string" == typeof e && e.match(/px$/) && (t += "rem"), t
			}, s && !m) {
			var l = "notHairlines",
				u = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
				f = parseInt(u[1], 10);
			f >= 8 && (l = "hairlines"), document.documentElement.classList.add(l)
		}
		window.onresize=function(){
			window.onresize=function(){window.location.reload();}
		}
	}(window, window.lib || (window.lib = {}));
