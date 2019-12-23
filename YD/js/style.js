$(function(e){
	// 搜索
	// jQuery.focusblur = function(focusid) { 
	// 	var focusblurid = $(focusid); 
	// 	var defval = focusblurid.val(); 
	// 	focusblurid.focus(function(){ 
	// 		var thisval = $(this).val();
	// 		if(thisval==defval){ 
	// 			$(this).val(""); 
	// 		} 
	// 	}); 
	// 	focusblurid.blur(function(){ 
	// 		var thisval = $(this).val(); 
	// 		if(thisval==""){ 
	// 			$(this).val(defval); 
	// 		} 
	// 	}); 
	// }; 
	// $.focusblur(".header-search-text"); 
	
	//a链接
	mui('body .mui-scroll').on('tap', 'a:not(.mui-control-item)', function (e) {
		if (!this.classList.contains('mui-disabled')) {
			mui.openWindow({
				url: this.getAttribute('href'),
				id: 'info'
			});
		}else {
			//s e.preventDefault();
			mui.preventDefault(e);
			mui.stopPropagation(e);
		}
	});
	mui("footer").on('tap','.mui-tab-item',function(e){
		if (!this.classList.contains('mui-disabled')) {
			mui.openWindow({
				url: this.getAttribute('href'),
				id: 'info'
			});
		}else {
			//s e.preventDefault();
			mui.preventDefault(e);
			mui.stopPropagation(e);
		}
	});
})
	