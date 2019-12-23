var parentFun = function () {
    var isloadok = false;
    this.loadArr = function (objId, ul, url, reset) {//reset是否重置上拉加载（页面选项卡切换时）
        mui.init({
            pullRefresh: {
                container: objId,
                up: {
                    auto: true,
                    contentrefresh: '正在加载...',
                    callback: function () {
                        setTimeout(function () {
                            mui(objId).pullRefresh().endPullupToRefresh(setUlHtml(ul));
                        }, 1000);
                    }
                }
            }
        });
        var setUlHtml = function (ul) {
            var type = ul.attr("data_type") == null ? 0 : ul.attr("data_type");


            var pageNo = ul.attr("pageNo") == null ? 1 : ul.attr("pageNo");


            var search = ul.attr("search") == null ? 0 : ul.attr("search");
            // $.ajax({
            //     url: url,
            //     type: "post",
            //     dataType: "html",
            //     async: false,
            //     data: {pageNumber: pageNo, type: type, search:search},
            //     success: function (data) {
				var data = "<li>123</li>"
                    if (data == "") {
                        isloadok = true;
                        return false;
                    }else {
                        isloadok = false;
                        var ulHtml = pageNo == 1 ? data : ul.html() + data;
                        pageNo = parseInt(pageNo) + 1;
                        ul.html(ulHtml).attr("pageNo", pageNo);
                    }
                // },
                // error: function () {
                //     isloadok = true;
                // }
            // });
            return isloadok;
        };
        if(reset!=null && reset!=""){
            mui(objId).pullRefresh().refresh(reset);
            mui(objId).pullRefresh().pullupLoading();
        }
    };
};