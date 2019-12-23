$.fn.tofixed = function (options){
    var defaults = {    　　　　　　　　//默认值
        "fixedClass":".fBlock",
        "nextClss":".nBlock",
        "startF":"10",
        "fixedLeft":"0%",
        "fixedTop":"0%",
        "fixedMarginLeft":"0",
        "center":'true'
    };
    options = $.extend(defaults, options)
    var fixedBlockTop=$(options.fixedClass).offset().top-$(options.nextClss).offset().top;
    if(options.center){
        var reCss="0 auto"
    }else {
        var reCss="0"
    }
    if (gtIOS6()) {
        $(options.fixedClass).addClass("sticky")
        $(options.fixedClass).css({
            "top":options.fixedTop
        })
    } else {
        toFixed()
        $(window).on("touchmove", function(e) {
            toFixed();
        })
        $(window).scroll(function () {
            toFixed();
        })
    }
    // 检测iOS版本大于等于6
    function gtIOS6() {
        var userAgent = window.navigator.userAgent;
        var ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/);
        return ios && ios[2] && (parseInt(ios[2].replace(/_/g, '.'), 10) >= 6);

    }
    function toFixed() {
        var whiteTop=$(options.fixedClass).offset().top-$(document).scrollTop();
        var redTop=$(options.nextClss).offset().top-$(document).scrollTop();
        if(whiteTop<options.startF){
            $(options.fixedClass).css({
                "position":"fixed",
                "left":options.fixedLeft,
                "top":options.fixedTop,
                "margin-left":options.fixedMarginLeft,
                "z-index":"999"
            })
        }
        if(redTop>fixedBlockTop){
            $(options.fixedClass).css({
                "position":"relative",
                "left":"0",
                "top":"0",
                "margin":reCss,
            })
        }
    }
    return this
};