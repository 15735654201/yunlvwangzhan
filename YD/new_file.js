function _styleChange(o, p, e) {
	var t = document.getElementById("search-box").style,
		n = document.getElementById("js_module").style;
	o && (t.top = o), p && (n.paddingTop = p), e && (t.position = e)
}

function changeH5HomapageToTopAppAd() {
	var o = document.documentElement.scrollTop || document.body.scrollTop,
		p = {
			zero: {
				top: "56px",
				pdTop: !1,
				pos: !1
			},
			lt: {
				top: "0px",
				pdTop: "0px",
				pos: "relative"
			},
			gt: {
				top: "0px",
				pdTop: "45px",
				pos: "fixed"
			}
		},
		e = 0 == o ? p.zero : o < 56 ? p.lt : p.gt;
	_styleChange(e.top, e.pdTop, e.pos), window.onscroll = function() {
		var o = document.documentElement.scrollTop || document.body.scrollTop;
		_styleChange((e = o < 56 ? p.lt : p.gt).top, e.pdTop, e.pos)
	}
}

function recoverH5HomepageToTopAppAd() {
	_styleChange("0px", "45px", "fixed"), window.onscroll = function() {}
}
