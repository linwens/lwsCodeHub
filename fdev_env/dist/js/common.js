'use strict';

(function ($) {
  $.fn.extend({
    /*网站导航条二级菜单显示/隐藏*/
    showNavMenu: function showNavMenu(options) {
      var options = $.extend({
        navList: '.nav-list li',
        secondMenu: '.second-menu'
      }, options);

      var $navList = $(options.navList);
      var $secondMenu = $(options.secondMenu);
      $navList.hover(function () {
        var i = $(this).index();
        $(this).addClass('hover').siblings().removeClass('hover');
        $secondMenu.hide();
        $(this).children(options.secondMenu).show();
      }, function () {
        $secondMenu.hide();
        $(this).removeClass('hover');
      });
    },

    /*选项卡菜单切换*/
    changeTab: function changeTab(options) {
      var options = $.extend({
        useStyle: 'click', //使用这个方法的方式：click/hover
        activeClass: 'active', //当前被激活的选项卡列表的样式
        contentTab: '.content-tab' //显示的选项卡内容
      }, options);

      var useStyle = options.useStyle;
      var activeClass = options.activeClass;
      var $contentTab = $(options.contentTab);

      $(this).children().each(function (i) {
        $(this).bind(useStyle, function () {
          $(this).addClass(activeClass).siblings().removeClass(activeClass);
          $contentTab.eq(i).show().siblings(options.contentTab).hide();
        });
      });
    },

    /*列表内容(图片)上下/左右滚动*/
    listScroll: function listScroll(options) {
      var options = $.extend({
        scrollList: '.scroll-list',
        prevBtn: '.prev',
        nextBtn: '.next',
        direction: 'horizonal',
        speed: 300,
        autoPlay: true,
        autoPlayInterval: 4000
      }, options);

      var $scrollList = $(options.scrollList);
      var $prevBtn = $(options.prevBtn);
      var $nextBtn = $(options.nextBtn);
      var direction = options.direction;
      var speed = options.speed;
      var autoPlay = options.autoPlay;
      var autoPlayInterval = options.autoPlayInterval;
      var itemWidth = $scrollList.children('li').outerWidth(true);
      var itemHeight = $scrollList.children('li').outerHeight(true);

      $(this).css({ position: 'relative' });
      $scrollList.css({ position: 'absolute' });
      if (direction == 'vertical') {
        var showprevItem = function showprevItem() {
          if (!$scrollList.is(':animated')) {
            $scrollList.find('li:last').clone().prependTo($scrollList);
            $scrollList.css({ top: -itemHeight });
            $scrollList.animate({ top: 0 }, speed, function () {
              $scrollList.find('li:last').remove();
            });
          }
        };
        var showNextItem = function showNextItem() {
          if (!$scrollList.is(':animated')) {
            $scrollList.find('li:first').clone().appendTo($scrollList);
            $scrollList.animate({ top: -itemHeight }, speed, function () {
              $scrollList.css({ top: 0 });
              $scrollList.find('li:first').remove();
            });
          }
        };
      } else {
        // 根据列表中li的个数动态设置滚动列表的宽度
        $scrollList.css({ width: ($scrollList.children('li').length + 1) * itemWidth });
        var showprevItem = function showprevItem() {
          if (!$scrollList.is(':animated')) {
            $scrollList.find('li:last').clone().prependTo($scrollList);
            $scrollList.css({ left: -itemWidth });
            $scrollList.animate({ left: 0 }, speed, function () {
              $scrollList.find('li:last').remove();
            });
          }
        };
        var showNextItem = function showNextItem() {
          if (!$scrollList.is(':animated')) {
            $scrollList.find('li:first').clone().appendTo($scrollList);
            $scrollList.animate({ left: -itemWidth }, speed, function () {
              $scrollList.css({ left: 0 });
              $scrollList.find('li:first').remove();
            });
          }
        };

        $prevBtn.click(function () {
          showprevItem();
        });

        $nextBtn.click(function () {
          showNextItem();
        });

        /*$(this).hover(function() {
        	$prevBtn.fadeIn();
        	$nextBtn.fadeIn();
        },function() {
        	$prevBtn.fadeOut();
        	$nextBtn.fadeOut();
        });*/
      }

      if (autoPlay) {
        listScrollTimer = setInterval(function () {
          showNextItem();
        }, autoPlayInterval);
        $(this).hover(function () {
          clearInterval(listScrollTimer);
        }, function () {
          listScrollTimer = setInterval(function () {
            showNextItem();
          }, autoPlayInterval);
        });
      }
    }
  });
})(jQuery);

/*查找url中某个参数的值*/
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/*在页面中插入css文件*/
function loadCss(url) {
  var styleSheet = document.createElement('link');
  styleSheet.rel = 'stylesheet';
  styleSheet.type = 'text/css';
  styleSheet.href = url;
  document.getElementsByTagName('head')[0].appendChild(styleSheet);
}

/* 自定义artDialog方法 */
function infoDialog(str) {
  $('head').append('<style id="aui-main-width">.aui_main{max-width: 300px!important;word-break: break-word!important;}</style>');
  art.dialog({
    content: str,
    icon: 'info',
    okVal: '确&nbsp;定',
    fixed: true,
    lock: true,
    opacity: 0,
    ok: function ok() {},
    close: function close() {
      $('#aui-main-width').remove();
    }
  });
}

function okDialog(str) {
  $('head').append('<style id="aui-main-width">.aui_main{max-width: 300px!important;word-break: break-word!important;}</style>');
  art.dialog({
    content: str,
    icon: 'succeed',
    okVal: '确&nbsp;定',
    fixed: true,
    lock: true,
    opacity: 0,
    time: 2,
    close: function close() {
      $('#aui-main-width').remove();
    }
  });
}

function errorDialog(str) {
  $('head').append('<style id="aui-main-width">.aui_main{max-width: 300px!important;word-break: break-word!important;}</style>');
  art.dialog({
    content: str,
    icon: 'error',
    okVal: '确&nbsp;定',
    fixed: true,
    lock: true,
    opacity: 0,
    time: 2,
    close: function close() {
      $('#aui-main-width').remove();
    }
  });
}

$(function () {
  //有属性data-url的绑定click方法
  $("*[data-url]").click(function (event) {
    var _this = this;
    var url = $(_this).attr("data-url");
    if (url) {
      window.location.href = url;
    }
  });

  /*输入框禁用空格*/
  // 添加此属性的输入框在chrome31之后的版本中将无法输入中文，所以在下方的addEventListener方法中加入了浏览器判断
  $('input[forbidspace="true"]').keyup(function (e) {
    if (e.which == 32) {
      return false;
    }
  });

  /*输入框限制:只能输入数字*/
  $('input[onlynumber="true"]').keypress(function (e) {
    // 需要排除在firefox下某些按键不起作用的异常
    if (e.which && e.which != 8 && !(e.which >= 48 && e.which <= 57)) {
      return false;
    }
  });

  /*输入框限制:只能输入数字和小数点*/
  $('input[numberpoint="true"]').bind({
    keypress: function keypress(e) {
      // 需要排除在firefox下某些按键不起作用的异常
      if (e.which && e.which != 8 && !(e.which >= 48 && e.which <= 57 || e.which == 46)) {
        return false;
      }

      // 如果输入了1个小数点，则不能输入第2个小数点
      if (e.which == 46 && this.value.match(/\./) && this.value.match(/\./).length >= 1) {
        return false;
      }
    },
    keyup: function keyup(e) {
      // 限制小数点后面的位数
      if ($(this).attr('decimal')) {
        // 根据decimal属性判断需要的小数位数
        var decimalLen = parseInt($(this).attr('decimal'));
        var pointIndex = this.value.indexOf('.');
        if (pointIndex !== -1 && this.value.substr(pointIndex).length > decimalLen) {
          this.value = this.value.substring(0, pointIndex) + '.' + this.value.substr(pointIndex + 1, decimalLen);
        }
      }
    }
  });

  $('input[type="text"]').each(function () {
    if ($.browser.msie) {
      if ($(this).attr('forbidspace') == 'true' || $(this).attr('onlynumber') == 'true' || $(this).attr('numberpoint') == 'true') {
        this.onpaste = function () {
          return false;
        };
      }
      $(this).keypress(function () {
        if ($(this).attr('forbidspace') == 'true') {
          this.value = this.value.replace(/\s/g, '');
        } else if ($(this).attr('onlynumber') == 'true') {
          this.value = this.value.replace(/\D/g, '');
        } else if ($(this).attr('numberpoint') == 'true') {
          this.value = this.value.replace(/[^.\d]/g, '');
        }
      });
    } else {
      this.addEventListener('input', function () {
        if ($(this).attr('forbidspace') == 'true' && !$.browser.webkit) {
          this.value = this.value.replace(/\s/g, '');
        } else if ($(this).attr('onlynumber') == 'true') {
          this.value = this.value.replace(/\D/g, '');
        } else if ($(this).attr('numberpoint') == 'true') {
          this.value = this.value.replace(/[^.\d]/g, '');
        }
      }, false);
    }
  });
});

var time = parseInt(new Date().getTime() / 1000);
var appkey = "D33F0C00C99EF28A7B27D487B36A84C3";

var accessToken = '';
// 系统http公参
function commonParams() {
  var str;
  accessToken = $("#oauth_token").val();
  if (accessToken) {
    str = "&appkey=" + appkey + "&access_token=" + accessToken + "&ts=" + time + "&version=2.6";
  } else {
    str = "&appkey=" + appkey + "&ts=" + time + "&version=2.5";
  }
  return str;
}

function unix_to_datetime(unix, time) {
  //time=1 无时分秒
  if (unix) {

    var length = unix.toString().length;
    if (length == 10) {
      unix = unix * 1000;
    }

    var myDate = new Date(parseInt(unix));
    var year = myDate.getFullYear();
    var month = myDate.getMonth();
    var date = checkTime(myDate.getDate());
    var hours = checkTime(myDate.getHours());
    var minutes = checkTime(myDate.getMinutes());
    var seconds = checkTime(myDate.getSeconds());
    if (time == 1) {
      var day = year + "-" + checkTime(parseInt(month) + 1) + "-" + date;
    } else {
      var day = year + "-" + checkTime(parseInt(month) + 1) + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    }

    return day;
  }
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

(function ($) {
  $.fn.extend({
    slideFn: function slideFn(options) {
      var defaults = {
        isTop: true, //是否
        slideTimer: "3000"
      };
      var options = $.extend(defaults, options);
      this.each(function () {
        var o = options;
        var obj = $(this);
        var oUl = obj.find("ul:first");
        var oLi = $("li", oUl);

        var Timer;
        obj.hover(function () {
          clearInterval(Timer);
        }, function () {
          Timer = setInterval(function () {
            if (o.isTop == true) {
              slideTop(oUl);
            } else {
              slideLeft(oUl);
            }
          }, o.slideTimer);
        }).trigger("mouseleave");

        var slideTop = function slideTop(box) {
          var oLiHeight = box.find("li:first").height();
          box.animate({ "marginTop": -oLiHeight + "px" }, 800, function () {
            box.css("marginTop", 0).find("li:first").appendTo(box);
          });
        }; //上滚
        var slideLeft = function slideLeft(box2) {
          box2.css("width", oLi.width() * oLi.length + "px");
          var oLiWidth = box2.find("li:first").width();
          box2.animate({ "marginLeft": -oLiWidth + "px" }, 800, function () {
            box2.css("marginLeft", 0).find("li:first").appendTo(box2);
          });
        }; //左滚
      });
    }

  });
})(jQuery);
//实现无缝上下滚动 无缝左右滚动--------------------------------------------------------------


(function ($) {
  $.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);return null; //返回参数值
  };
})(jQuery);

//处理字符串数字化（100,100.00或100,100）
function formatNum(str, isdecimal) {
  var newStr = "";
  var count = 0;

  if (str.indexOf(".") == -1) {
    for (var i = str.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + "," + newStr;
      } else {
        newStr = str.charAt(i) + newStr;
      }
      count++;
    }
    if (isdecimal == 1) {
      str = newStr + ".00"; //自动补小数点后两位
    } else {
      str = newStr;
    }
  } else {
    for (var i = str.indexOf(".") - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + "," + newStr;
      } else {
        newStr = str.charAt(i) + newStr; //逐个字符相接起来
      }
      count++;
    }
    str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
  }

  return str;
}

// get url 中特定的参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
  var context = "";
  if (r != null) context = r[2];
  reg = null;
  r = null;
  return context == null || context == "" || context == "undefined" ? "" : context;
}

function setPlatform() {
  var platform = $.getUrlParam('platform');
  //console.log(platform)
  if (platform) {
    $.cookie("platform", platform, { path: "/user" });
  } //设置渠道cookie
}

//1:月月赚,2:季季盈,3:双季盈,4:"年年丰",5:民生加银;6:新手标
function getBorrow(typeVal) {
  var listBox = $('.category_lists .category_list');
  $.ajax({
    url: '/app/borrow/typeBorrow.html',
    type: 'post',
    dataType: 'json',
    async: false,
    data: 'borrow_type=' + typeVal + str,
    success: function success(data) {
      var _this = typeVal - 1;
      var infor = data.information;
      var id = infor.uuid;
      var list = listBox.eq(_this);

      if (typeVal == 6) {
        // $(".new_users_banner").find('a').attr({
        //   href: '/invest/detail.htm?id='+id,
        // });
        // var newApr = (parseFloat(infor.apr) + parseFloat(infor.award_account)).toFixed(2);
        // $(".new_users_banner").find('span').html(newApr+'<i>%</i>')
      } else {

        if (data.res_code == 1 && id) {
          var time_limit;
          var isday = infor.isday;
          var status = infor.status;
          var award = infor.award;

          $(list).find('.rate span').html(infor.apr);

          if (isday == 1) {
            time_limit = infor.time_limit_day;
            $(list).find('.term').html('<span>' + time_limit + '</span>天');
          } else {
            time_limit = infor.time_limit;
            $(list).find('.term').html('<span>' + time_limit + '</span>个月');
          }

          if (award == 1) {
            $(list).find('.rate').append('+' + infor.award_account + '%');
          }

          $(list).find('.invite_btn').attr({ href: '/invest/detail.htm?id=' + id });

          if (status == 3 || status == 6 || status == 8) {
            $(list).find('.invite_btn').removeClass('inviting_btn').html("售罄");
          }
        } else if (data.res_code == 1 && !id) {

          $(list).find('.invite_btn').html("售罄").removeClass('inviting_btn');
        }
      }
    }
  });
}

//制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

function isIE() {
  if (!!window.ActiveXObject || "ActiveXObject" in window) return true;else return false;
}

function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

//赠送积分样式
function awardPoints(num, str, callback) {
  var awardPointpop = '<div class="tc">' + '<p class="title"><i class="iconfont">&#xe6a0;</i>积分+' + num + '</p>' + '<p>' + str + '</p></div>';

  parent.layer.msg(awardPointpop, {
    skin: 'pointLayer', //样式类名
    shade: 0.2,
    time: 2000 //2秒关闭
  }, function () {
    if (callback) {
      setTimeout(callback, 80);
    }
  });
}