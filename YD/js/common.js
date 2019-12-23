/** 覆盖string的trim()方法，IE6、IE7不支持 */
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
};
/** 字符串是否为空 */
function isBlank(value){
    if(value == null || value == undefined) return true;
    if(typeof value != "string") {
        showMsg("参数不是string类型，无法判断是否为空，请自行判断",5000);
        return true;
    }
    if(value.length == 0) return true;
    if(value.trim() == "") return true;
    return false;
}

/** 字符串是否不为空 */
function isNotBlank(value) {
    return !isBlank(value);
}

/** 显示长时间提示，参数msg为要显示的内容，默认5秒后消失 */
function showLongMsg(msg) {
    showMsg(msg,{time:5000});
}

/** 显示普通消息 */
function showMsg(msg,config){
    if(typeof config == "number") config = {time : config};
    layer.msg(msg,config);
}
/** 显示成功消息 */
function successMsg(msg){
    showMsg(msg,{icon:1,time:500});
}
successMsg("msg");
/** 显示失败消息 */
function failMsg(msg){
    showMsg(msg,{icon:2,time:3000});
}

function selectOrClearAll(obj,name){
    var nameOpt = isBlank(name) ? "" : ("[name=" + name + "]");
    if($(obj).is(":checked")) $("input[type=checkbox]" + nameOpt).prop("checked",true);
    else $("input[type=checkbox]" + nameOpt).prop("checked",false);
}

/** 显示消息后重新加载页面，默认时间为0.5秒 */
function goToAfterShowMsg(msg,url){
    successMsg(msg);
    window.setTimeout(function(){
        window.location.href = url;
    },500);
}

jQuery.extend({
    getHtml: function (url, params, callback, extendAjaxParams) {
        var ajaxParams = {
            url: url, type: "POST", dataType: "html", data: params,
            success: function (html) {
                if (typeof callback == "function") callback(html);
            },
            error: function (data) {
                failMsg("请求失败：" + url);
            }
        };
        if (extendAjaxParams && typeof extendAjaxParams == "object") {
            $.extend(ajaxParams, extendAjaxParams);
        }
        $.ajax(ajaxParams);
    },
    getJson: function (url, params, successCallback, failCallback, extendAjaxParams) {
        var ajaxParams = {
            url: url, type: "POST", dataType: "json", data: params,
            success: function (json) {
                if (json.success == 'true') {
                    if (successCallback && typeof successCallback == "function") {
                        successCallback(json);
                        return;
                    }
                    successMsg("操作成功");
                } else {
                    if (failCallback && typeof failCallback == "function") {
                        failCallback(json);
                        return;
                    }
                    if (typeof json.data == 'object') { // 给jqueryValidate赋值
                        $.each(json.data, function (key, value) {
                            $("#" + key + "Error").text(value);
                        });
                    }
                    var msg = isBlank(json.message) ? "操作失败" : json.message;
                    failMsg(msg);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status == 200) {
                    //window.location.href = url;
                    $(document).html();
                } else {
                    failMsg("请求失败：" + url);
                }
            }
        };
        if (extendAjaxParams && typeof extendAjaxParams == "object") {
            $.extend(ajaxParams, extendAjaxParams);
        }
        $.ajax(ajaxParams);
    },
    getText: function (url, params, callback, extendAjaxParams) {
        var ajaxParams = {
            url: url, type: "POST", dataType: "text", data: params,
            success: function (text) {
                if (typeof callback == "function") callback(text);
            },
            error: function (data) {
                failMsg("请求失败：" + url);
            }
        };
        if (extendAjaxParams && typeof extendAjaxParams == "object") {
            $.extend(ajaxParams, extendAjaxParams);
        }
        $.ajax(ajaxParams);
    }
});

/** 根据id重置form表单，要求定义了form表单的id属性，不论重置按钮是在form表单之内还是之外，都可以用
 参考用法1，重置按钮是在form表单之内：
 <form id="searchForm">
 <input name="orderSn" type="text" value="订单号">
 <input type="button" value=" 重置 " onclick="resetFormById('searchForm')">
 </form>

 参考用法2，重置按钮是在form表单之外：
 <form id="searchForm">
 <input name="orderSn" type="text" value="订单号">
 </form>
 <input type="button" value=" 重置 " onclick="resetFormById('searchForm')">
 * */
function resetFormById(formId){
    $(":input","#" + formId).not(":button, :submit, :reset, :hidden").val("").removeAttr("checked").removeAttr("selected");
}

/** 根据重置按钮，向上查找包含这个元素的第一个form表单，重置form表单，要求重置按钮是在form表单之内
 参考用法，重置按钮必须在form表单之内：
 <form>
 <input name="orderSn" type="text" value="订单号">
 <input type="button" value=" 重置 " onclick="resetFormByElement(this)">
 </form>
 * */
function resetFormByElement(element,isResetHidden){
    var i = 0; // 最多向上查询20层
    $element = $(element);
    while($element && !$element.is("form") && i < 20) {
        $element = $element.parent();
        i ++;
    }
    if($element && $element.is("form")) {
        $(":input",$element).not(":button, :submit, :reset" + (isResetHidden ? '': ", :hidden")).val("").removeAttr("checked").removeAttr("selected");
    }
}


//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,        // 月份
        "d+": this.getDate(),        // 日
        "h+": this.getHours(),        // 小时
        "m+": this.getMinutes(),        // 分
        "s+": this.getSeconds(),        // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3),        // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/** 将字符串“2006-07-02 08:09:04”转换成Date */
function unFormat(stringDate){
    try {
        var date = new Date();
        date.setFullYear(Number(stringDate.substring(0,4)), Number(stringDate.substring(5,7)) - 1, Number(stringDate.substring(8,10)));
        date.setHours(Number(stringDate.substring(11,13)), Number(stringDate.substring(14,16)), Number(stringDate.substring(17,19)), 0);
        return date;
    } catch (e) {
        return new Date();
    }
}

/** 根据元素ID(radio是例外，用名称)获取参数，默认会把true或false转换成1和0，默认会trim字符串，返回的格式为：
 *  param = {
 *      id:"9",
 *      name:"名称",
 *      isDelete:1
 *  }
 * */
function getParamsByIdArr(idArr,isChangeBooleanToNumber,isTrim) {
    var params = {};
    for(var i = 0; i < idArr.length; i ++) {
        var id = idArr[i];
        if(typeof id != "string" || isBlank(id)) continue;
        var obj = $("#" + id);
        if(obj.length == 0) {
            obj = $("input[type=radio][name=" + id + "]");
            if(obj.length > 0) {
                params[id] = $("input[type=radio][name=" + id + "]:checked").val();
            } else {
                obj = $("input[type=checkbox][name=" + id + "]:checked");
                if(obj.length > 0) {
                    var tmp = "";
                    for(var boxIndex = 0; boxIndex < obj.length; boxIndex ++) {
                        tmp += $(obj[boxIndex]).val() + ",";
                    }
                    tmp = tmp.substring(0,tmp.length - 1);
                    params[id] = tmp;
                } else {
                    params[id] = null;
                }
            }
            continue;
        }
        if(obj.is("input")) {
            var type = obj.attr("type");
            if(type == "checkbox") {
                params[id] = obj.is(":checked");
                continue;
            } else {
                params[id] = obj.val();
                continue;
            }
        }
        if(obj.is("textarea") || obj.is("select")) {
            params[id] = obj.val();
            continue;
        }
        if(obj.is("div") || obj.is("span") || obj.is("label")) {
            params[id] = obj.text();
            continue;
        }
    }
    if(isChangeBooleanToNumber || isChangeBooleanToNumber == null) {
        for(var i in params) {
            if(typeof params[i] == "boolean") {
                params[i] = params[i] ? 1 : 0;
            }
        }
    }
    if(isTrim || isTrim == null) {
        for(var i in params) {
            if(typeof params[i] == "string") {
                params[i] = params[i].trim();
            }
        }
    }
    return params;
}

/** 显示消息后重新加载页面，默认时间为0.5秒 */
function reloadAfterShowMsg(msg,time){
    successMsg(msg);
    time = time == null ? 500 : time;
    window.setTimeout(function(){
        window.location.reload(true);
    },time);
}

/** 显示消息后重新加载页面，默认时间为0.5秒 */
function goToAfterShowMsg(msg,url){
    successMsg(msg);
    window.setTimeout(function(){
        window.location.href = url;
    },500);
}
/** 是否为PC端 */
function isPc() {
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    var browserType = "";
    if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) browserType = "ios";
    if(browser.versions.android) browserType = "android";
    if(browserType == "ios" || browserType == "android") return false;
    return true;
}


/** 获取密文 */
function getEncryptText(ctx,encryptArr){
    var encryptText = "";
    $.ajax({
        url : ctx + "/common/encrypt.jsp", // 先调用加密接口，返回密文
        type : "POST","dataType" : "json",cache : false,async:false,
        data : {"plainText": getPlainText(encryptArr)}, // 这里的明文为某几个参数的组合，至于到底是哪几个参数，每个接口都定义得不一样，终端与服务端要统一
        success: function(json){
            encryptText = json.data;
        }
    });
    return encryptText;
}

/** 获取明文 */
function getPlainText(encryptArr){
    var plainText = "";
    for(var i = 0; i < encryptArr.length; i ++) {
        plainText += $("#" + encryptArr[i]).val();
    }
    return plainText;
}

/** 是否为微信内置的浏览器 */
function isWxBrowser(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取随机数
 * @param min 最小值
 * @param max 最大值
 * @returns {number}
 */
function randomNumber(min,max){
    return Math.floor(Math.random() * (max - min) + min);
}

function  ArrayMax(array){
    return Math.max.apply(Math,array);
}

function ArrayMin(array){
    return Math.min.apply(Math,array);
}

// 判断对象的lock属性是否等于lock
function isLock(obj){
    if(!(obj instanceof jQuery)) {
        obj = $(obj);
    }
    return obj.attr("lock") == "lock";
}
// 加锁：给对象的lock属性赋值为lock
function lock(obj){
    if(!(obj instanceof jQuery)) {
        obj = $(obj);
    }
    obj.attr("lock","lock");
}
// 解锁：在指定的时间(time单位为毫秒，默认为3000)之后，给对象的lock属性赋值为unlock
function unlock(obj,time){
    if(!(obj instanceof jQuery)) {
        obj = $(obj);
    }
    if(time == null || isNaN(time)) {
        time = 3000;
    }
    window.setTimeout(function(){
        obj.attr("lock","unlock");
    },time);
}