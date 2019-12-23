(function($) {
	"use strict";
	var myweek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
	var calendarSwitch = (function() {
		function calendarSwitch(element, options) {
			this.settings = $.extend(true, $.fn.calendarSwitch.defaults, options || {});
			this.element = element;
			this.init();
		}
		calendarSwitch.prototype = { /*说明：初始化插件*/
			/*实现：初始化dom结构，布局，分页及绑定事件*/
			init: function() {
				var me = this;
				me.selectors = me.settings.selectors;
				me.sections = me.selectors.sections;
				me.index = me.settings.index;
				me.comfire = me.settings.comfireBtn;
				var html = "<div class='headerWrapper'><div class='headerTip'>选择日期</div><div class='comfire'>完成</div></div><table class='dateZone'><tr><td class='colo'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td class='colo'>六</td></tr></table>" + "<div class='tbody'></div>"
				$(me.sections).append(html);
				$(me.sections).find('.headerWrapper').css({
					"height": "50px",
					"line-height": "50px",
					"width":"100%",
					"background":"#fff",
					"position": "fixed",
					"z-index":"9999"
				});
				$(me.sections).find('.headerTip').css({
					"text-align": "center",
					"line-height": "50px",
					"font-size":"16px"
				});
				$(me.sections).find(me.comfire).css({
					"height": "26px",
					"line-height": "26px",
					"width": "50px",
					"color": "#5260d0",
					"position": "absolute",
					"right": "10px",
					"text-align": "center",
					"font-size": "14px",
					"cursor": "pointer",
					"top": "11px",
					"border": "1px solid #5260d0",
					"border-radius": "4px"
				});
				for (var q = 0; q < me.index; q++) {
					var select = q;
					$(me.sections).find(".tbody").append("<p class='ny1'></p><table class='dateTable'></table>")
					var currentDate = new Date();
					var currentDate2 = new Date(currentDate.getFullYear()+"/1/1");
					currentDate2.setMonth(currentDate.getMonth() + select);
					var currentYear = currentDate2.getFullYear();
					var currentMonth = currentDate2.getMonth();
					var setcurrentDate = new Date(currentYear, currentMonth, 1);
					var firstDay = setcurrentDate.getDay();
					var yf = currentMonth + 1;
					if (yf < 10) {
						$(me.sections).find('.ny1').eq(select).text(currentYear + '年' + '0' + yf + '月');
					} else {
						$(me.sections).find('.ny1').eq(select).text(currentYear + '年' + yf + '月');
					}
					var DaysInMonth = [];
					if (me._isLeapYear(currentYear)) {
						DaysInMonth = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
					} else {
						DaysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
					}
					var Ntd = firstDay + DaysInMonth[currentMonth];
					var Ntr = Math.ceil(Ntd / 7);
					for (var i = 0; i < Ntr; i++) {
						$(me.sections).find('.dateTable').eq(select).append('<tr></tr>');
					};
					var createTd = $(me.sections).find('.dateTable').eq(select).find('tr');
					createTd.each(function(index, element) {
						for (var j = 0; j < 7; j++) {
							$(this).append('<td></td>')
						}
					});
					var arryTd = $(me.sections).find('.dateTable').eq(select).find('td');
					for (var m = 0; m < DaysInMonth[currentMonth]; m++) {
						arryTd.eq(firstDay++).text(m + 1);
					}
				}
				me._initselected();

				me.element.on('tap', function(event) {
					event.preventDefault();
					me._slider(me.sections)
				});
				//点击完成部分
				$(me.comfire).on('tap', function(event) {
					event.preventDefault();
					$(me.sections).find('.tbody .rz').each(function(index, element) {
						//判断是否有离店显示，没有就不给完成提交
						if ($(this).text() == '离店') {
							var startDate,endDate,startWeek,endWeek,NumDate;
							$(me.sections).find('.tbody .rz').each(function(index, element) {
								//点击入住的日期
								if ($(this).text() == '入住') {
									var day = parseInt($(this).parent().text().replace(/[^0-9]/ig, "")) //截取字符串中的数字
									if(day < 10){
										day = "0" + day;
									}
									var startDayArrays = $(this).parents('table').prev('p').text().split('');
									var startDayArrayYear = [];
									var startDayArrayMonth = [];
									var startDayYear = "";
									var startDayMonth = "";
									for (var i = 0; i < 4; i++) {
										var select = i;
										startDayArrayYear.push(startDayArrays[select])
									}
									startDayYear = startDayArrayYear.join('');
									for (var i = 5; i < 7; i++) {
										startDayArrayMonth.push(startDayArrays[i])
									}
									startDayMonth = startDayArrayMonth.join('');
									//保存入住日期
									startDate = startDayYear + '-' + startDayMonth + '-' + day;
									var stdate = new Date(startDate);
									startWeek = myweek[stdate.getDay()];
								}
								//点击离店的日期
								if ($(this).text() == '离店') {
									// var day = parseInt($(this).parent().text().replace(/[^0-9]/ig, "").substring(0, 2));
									var day = $(this).parent().text().split('离')[0];
									if(day < 10){
										day = "0" + day;
									}
									var endDayArrays = $(this).parents('table').prev('p').text().split('');
									var endDayArrayYear = [];
									var endDayArrayMonth = [];
									var endDayYear = "";
									var endDayMonth = "";
									for (var i = 0; i < 4; i++) {
										endDayArrayYear.push(endDayArrays[i])
									}
									endDayYear = endDayArrayYear.join('');
									for (var i = 5; i < 7; i++) {
										endDayArrayMonth.push(endDayArrays[i])
									}
									endDayMonth = endDayArrayMonth.join('');
									//保存离店日期
									endDate = endDayYear + '-' + endDayMonth + '-' + day;
									var endate = new Date(endDate);
									endWeek = myweek[endate.getDay()];
									// 如果入住等于离店
									if (parseInt(startDate.replace(/[^0-9]/ig, "")) == parseInt(endDate.replace(/[^0-9]/ig, ""))) {
										var x = startDate;
										var a = new Date(x.replace(/-/g, "/"));
										var b = new Date();
										b = new Date(a.getTime() + 24 * 3600 * 1000);
										var ye = b.getFullYear();
										var mo = b.getMonth() + 1;
										var da = b.getDate();
										endDate = ye + '-' + mo + '-' + da;
										var endate = new Date(endDate);
										endWeek = myweek[endate.getDay()];
									}
								}
								startDayArrayYear = [];
								startDayArrayMonth = [];
								endDayArrayYear = [];
								endDayArrayMonth = [];
							});
							//添加晚数
							NumDate = $('.lidian_hover').text().replace(/[^0-9]/ig,"");

							var st = startDate;
							var en = endDate;
							//如果入住没值
							if (st) {
								me._slider(me.sections)
								me._callback(startDate,endDate,NumDate,startWeek,endWeek);
							} else {
								var b = new Date();
								var ye = b.getFullYear();
								var mo = b.getMonth() + 1;
								var da = b.getDate();
								startDate = ye + '-' + mo + '-' + da;
								var stdate = new Date(startDate);
								startWeek = myweek[stdate.getDay()];
								b = new Date(b.getTime() + 24 * 3600 * 1000);
								var ye = b.getFullYear();
								var mo = b.getMonth() + 1;
								var da = b.getDate();
								endDate = ye + '-' + mo + '-' + da;
								var endate = new Date(endDate);
								endWeek = myweek[endate.getDay()];
								NumDate = "1";
								me._slider(me.sections);
								me._callback(startDate,endDate,NumDate,startWeek,endWeek);
							}
						}
					});
				});

			},
			_isLeapYear: function(year) {
				return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
			},
			_slider: function(id) {
				var me = this;
				me.animateFunction = me.settings.animateFunction;
				if (me.animateFunction == "fadeToggle") {
					$(id).fadeToggle();
				} else if (me.animateFunction == "slideToggle") {
					$(id).slideToggle();
				} else if (me.animateFunction == "toggle") {
					$(id).toggle();
				}
			},
			_initselected: function() {
				var me = this;
				me.comeColor = me.settings.comeColor;
				me.outColor = me.settings.outColor;
				me.comeoutColor = me.settings.comeoutColor;
				me.daysnumber = me.settings.daysnumber;
				var judge = (new Date(me.settings.startDate).getTime())>(new Date(me.settings.endDate).getTime())?true:false;
				me.startDate = (me.settings.startDate == "" || isNaN(Date.parse(me.settings.startDate)) || judge)?new Date():new Date(me.settings.startDate);
				me.endDate = (me.settings.endDate == "" || isNaN(Date.parse(me.settings.endDate)) || judge)?new Date((new Date()).getTime()+24*3600*1000):new Date(me.settings.endDate);
				var strDays = new Date().getDate();
				var arry = [];
				var arry1 = [];
				var startYear = (me.startDate).getFullYear()-(new Date()).getFullYear();
				var startMonth = ((me.startDate).getMonth()+1)-((new Date()).getMonth()+1);
				var startnum = startYear*12+startMonth;
				var endYear = (me.endDate).getFullYear()-(new Date()).getFullYear();
				var endMonth = ((me.endDate).getMonth()+1)-((new Date()).getMonth()+1);
				var endnum = endYear*12+endMonth;
				var numDate = Math.floor((((me.endDate).getTime())-((me.startDate).getTime()))/(24*3600*1000));
				var startTds = $(me.sections).find('.dateTable').eq(startnum).find('td');
				var endTds = $(me.sections).find('.dateTable').eq(endnum).find('td');
				var startDays = me.startDate.getDate();
				var endDays = me.endDate.getDate();
				var arryTds = [{
					Tds: startTds,
					Days: startDays,
					Text: "入住"
				},{
					Tds: endTds,
					Days: endDays,
					Text: "离店"
				}];
				for(var i=0;i<arryTds.length;i++){
					arryTds[i].Tds.each(function(index, element) {
						if ($(this).text() == arryTds[i].Days) {
							var r = index;
							$(this).append('</br><p class="rz">'+arryTds[i].Text+'</p>');
							return false;
						}
					});
				}
				me._checkColor(me.comeColor, me.outColor);
				var curDate = (me.startDate).format("yyyy-MM-dd");
				var nextDate = (me.endDate).format("yyyy-MM-dd");
				me._callback(curDate,nextDate,numDate,myweek[(me.startDate).getDay()],myweek[(me.endDate).getDay()]);
				$(me.sections).find('.tbody').find('td').each(function(index, element) {
					if ($(this).text() != '') {
						arry.push(element);
					}
				});
				for (var i = 0; i < strDays - 1; i++) {
					$(arry[i]).css('color', '#ccc');
				}
				if (me.daysnumber) {
					//可以在这里添加90天的条件
					for (var i = strDays - 1; i < strDays + parseInt(me.daysnumber); i++) {
						arry1.push(arry[i])
					}
					for (var i = strDays + parseInt(me.daysnumber); i < $(arry).length; i++) {
						$(arry[i]).css('color', '#ccc')
					}
				} else {
					for (var i = strDays - 1; i < $(arry).length; i++) {
						arry1.push(arry[i])
					}
				}
				var startIndex = $(arry1).index($("td .rz").parents("td").eq(1))+1;
				var endIndex = $(arry1).index($("td .rz").parents("td").eq(0));
				for (startIndex; startIndex < endIndex; startIndex++) {
					$(arry1[startIndex]).css({
						'background': me.comeoutColor,
						'color': '#333333'
					});
				}
				me._selectDate(arry1)
			},
			_checkColor: function(comeColor, outColor) {
				var me = this;
				var rz = $(me.sections).find('.rz');
				// console.log(rz);
				for (var i = 0; i < rz.length; i++) {
					if (rz.eq(i).text() == "入住") {
						rz.eq(i).closest('td').css({
							'background': comeColor,
							'color': '#fff'
						});
					} else {
						rz.eq(i).closest('td').css({
							'background': outColor,
							'color': '#fff'
						});
					}
				}

			},
			_callback: function(stDate,enDate,NumDate,stWeek,enWeek) {
				var me = this;
				if (me.settings.callback && $.type(me.settings.callback) === "function") {
					me.settings.callback(stDate,enDate,NumDate,stWeek,enWeek);
				}
			},
			_selectDate: function(arry1) {
				var me = this;
				me.comeColor = me.settings.comeColor;
				me.outColor = me.settings.outColor;
				me.comeoutColor = me.settings.comeoutColor;
				me.sections = me.selectors.sections;

				var flag = 0;
				var first;
				var sum;
				var second;
				$(arry1).on('tap', function(index) {
					index.stopPropagation();
					//第一次点击
					if (flag == 0) {
						$(me.sections).find('.hover').remove();
						$(me.sections).find('.tbody').find('p').remove('.rz');
						$(me.sections).find('.tbody').find('br').remove();
						$(arry1).css({
							'background': '#fff',
							'color': '#333333'
						});
						$(this).append('<p class="rz">入住</p>');
						first = $(arry1).index($(this));
						me._checkColor(me.comeColor, me.outColor)
						flag = 1;
						//显示提示：选择离店日期
						$(me.sections).find('.rz').each(function(index, element) {
							if ($(this).text() == '入住') {
								$(this).parent('td').append('<span class="hover ruzhu_hover">选择离店日期</span>');
								$(this).parent('td').css('position', 'relative');
							}
						});
						$('.hover').css({
							'position': 'fixed',
							'left': '-17px',
						})
						$('.ruzhu_hover').css({
							'width':'40%',
							'font-size': '16px',
							'line-height':'36px',
							'left': '30%',
							'bottom': '45px',
							'background':'rgba(0,0,0,0.8)',
							'color':'#fff',
							'z-index':'999'
						});
					} else if (flag == 1) { //第二次点击
						$(me.sections).find('.rz').each(function(index, element) {
							if ($(this).text() == '入住') {
								$(this).parent('td').find('.ruzhu_hover').remove();
								$(this).parent('td').css('position', 'relative');
							}
						});
						flag = 0;
						second = $(arry1).index($(this))
						//如果第一次点击比第二次大，则不显示
						if(first >= second){
							$(me.sections).find('.hover').remove();
							$(me.sections).find('.tbody').find('p').remove('.rz');
							$(me.sections).find('.tbody').find('br').remove();
							$(arry1).css({
								'background': '#fff',
								'color': '#333333'
							});
							$(this).append('<p class="rz">入住</p>')
							first = $(arry1).index($(this));
							me._checkColor(me.comeColor, me.outColor)
							flag = 1;
							//显示提示：选择离店日期
							$(me.sections).find('.rz').each(function(index, element) {
								if ($(this).text() == '入住') {
									$(this).parent('td').append('<span class="hover ruzhu_hover">选择离店日期</span>');
								}
							});
							$('.hover').css({
								'position': 'fixed',
								'left': '-17px',
							})
							$('.ruzhu_hover').css({
								'width':'40%',
								'font-size': '16px',
								'line-height':'36px',
								'left': '30%',
								'bottom': '45px',
								'background':'rgba(0,0,0,0.8)',
								'color':'#fff',
								'z-index':'999'
							});
							return;
						}
						sum = Math.abs(second - first);
						if (sum == 0) {
							sum = 1;
						}
						
						if (first < second) {
							$(this).append('<p class="rz">离店</p>')
							first = first + 1;
							for (first; first < second; first++) {
								$(arry1[first]).css({
									'background': me.comeoutColor,
									'color': '#333333'
								});
							}
						} else if (first == second) {

							/*$(me.sections).find('.rz').text('入住');
							$(this).append('<p class="rz">离店</p>');
							$(this).find('.rz').css('font-size', '12px');
							var e = $(this).text().replace(/[^0-9]/ig, "");
							var c, d;
							var a = new Array();
							var b = new Array();
							var f;
							var same = $(this).parents('table').prev('p').text().replace(/[^0-9]/ig, "").split('');
							for (var i = 0; i < 4; i++) {
								a.push(same[i]);
	
							}
							c = a.join('');
							for (var j = 4; j < 6; j++) {
								b.push(same[j]);
							}
							d = b.join('');
	
							f = c + '-' + d + '-' + e;
							startDate = f;
							$("#startDate").val(f);*/
						
						} else if (first > second) {

							$(me.sections).find('.rz').text('离店');
							$(this).append('<p class="rz">入住</p>')
							second = second + 1;
							for (second; second < first; second++) {
								$(arry1[second]).css({
									'background': me.comeoutColor,
									'color': '#333333'
								});
							}
						}
						$(me.sections).find('.rz').each(function(index, element) {
							if ($(this).text() == '离店') {
								$(this).parent('td').append('<span class="hover lidian_hover">共' + sum + '晚</span>');
								$(this).parent('td').css('position', 'relative');
							}

						});

						$('.hover').css({
							'position': 'fixed',
							'left': '-17px',
						})
						$('.ruzhu_hover').css({
							'width':'40%',
							'font-size': '16px',
							'line-height':'36px',
							'left': '30%',
							'bottom': '45px',
							'background':'rgba(0,0,0,0.8)',
							'color':'#fff',
							'z-index':'999'
						});
						$('.lidian_hover').css({
							'position': 'absolute',
							'width':'100%',
							'padding':'2px 0',
							'left': '0px',
							'top': '-24px',
							'background':'#434949',
							'color':'#fff'
						})
						me._slider('firstSelect');
						me._checkColor(me.comeColor, me.outColor);
					}
					//第二次点击结束
				})
			}

		}
		return calendarSwitch;
	})();
	$.fn.calendarSwitch = function(options) {
		return this.each(function() {
			var me = $(this),
				instance = me.data("calendarSwitch");

			if (!instance) {
				me.data("calendarSwitch", (instance = new calendarSwitch(me, options)));
			}

			if ($.type(options) === "string") return instance[options]();
		});
	};
	$.fn.calendarSwitch.defaults = {
		selectors: {
			sections: "#calendar"
		},
		index: 4, //展示的月份个数
		animateFunction: "toggle", //动画效果
		controlDay: false, //是否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
		daysnumber: "90", //控制天数
		comeColor: "#5260d0", //入住颜色
		outColor: "#5260d0", //离店颜色
		comeoutColor: "rgba(82, 96, 208, 0.1)", //入住和离店之间的颜色
		callback: "", //回调函数
		comfireBtn: '.comfire', //确定按钮的class或者id
		startDate: "",
		endDate: ""
	};
})(jQuery);