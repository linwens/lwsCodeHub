"use strict";

// 登录页面
function loginFun(url) {

  var errorMsg = $(".show-error");
  var str = commonParams();
  $(".btn-login").bind("click", function () {
    var username = $("#username").val();
    var password = $("#password").val();
    var validCode = $("#validCode").val();

    if (!username) {
      $("#username").parent(".list_contral").addClass('error');
      return false;
    } else {
      $("#username").parent(".list_contral").removeClass('error');
    }
    if (!password) {
      $("#password").parent(".list_contral").addClass('error');
      return false;
    } else {
      $("#password").parent(".list_contral").removeClass('error');
    }
    if (!validCode) {
      $("#validCode").parent(".list_contral").addClass('error');
      return false;
    } else {
      $("#validCode").parent(".list_contral").removeClass('error');
    }

    $.ajax({
      url: '/loginService?' + str,
      type: 'POST',
      dataType: 'json',
      data: {
        actionType: 'login',
        username: username,
        password: password,
        validCode: validCode
      },
      success: function success(data) {
        if (data.res_code == 1) {
          errorMsg.hide().html('');
          $(".btn-login").text("登录中...").removeClass('active');
          $("#username,#password,#validCode").parent(".list_contral").removeClass('error').addClass('active');
          setTimeout(function () {
            window.location.href = url;
          }, 1000);
        } else if (data.res_code == 0) {
          errorMsg.show().html(data.res_msg);
          if (data.res_msg == "验证码错误") {
            $("#username,#password").parent(".list_contral").removeClass('error');
            $("#validCode").parent(".list_contral").addClass('error');
            $(".validcode-img").click();
          } else {
            $("#validCode").parent(".list_contral").removeClass('error');
            $("#username,#password").parent(".list_contral").addClass('error');
            $(".validcode-img").click();
          }
        }
      }
    });
  });
}

function getMobileCode() {
  var phone = jQuery('#phone').val();
  if (!phone) {
    $("#phone").attr("title", "手机号码不能为空");
    $("#phone").poshytip({
      className: 'tip-yellowsimple',
      showTimeout: 1,
      alignTo: 'target',
      slide: false,
      fade: false,
      showOn: 'none',
      alignX: 'right',
      alignY: 'center',
      offsetX: 120,
      offsetY: 10
    });
    $("#phone").poshytip('hide');
    $("#phone").poshytip('show');
    $("#phone").focus();
    return false;
  } else {
    reg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (!reg.test(phone)) {
      $("#phone").poshytip('hide');
      $("#phone").poshytip({
        className: 'tip-yellowsimple',
        showTimeout: 1,
        alignTo: 'target',
        slide: false,
        fade: false,
        showOn: 'none',
        alignX: 'right',
        alignY: 'center',
        offsetX: 120,
        offsetY: 10
      });
      $("#phone").attr("title", "手机号码格式不正确！");
      $("#phone").poshytip('show');
      $("#phone").focus();
      return false;
    }
    $("#phone_btn").attr("disabled", "disabled").addClass("disabled");

    $(".phone_msg").html('');
    $.ajax({
      url: "/member/identify/getPhoneCode.htm",
      type: "post",
      cache: "false",
      data: { 'phone': $("#phone").val() },
      dataType: "json",
      success: function success(data) {

        if (!data.error) {
          $(".cq_bank_ul .sub-btn").removeClass("hide");
          $(".cq_bank_ul .gray-btn").addClass("hide");
          var timeVal = data.remainTime;
          var Time = setInterval(function () {
            timeVal--;
            if (timeVal > 0) {
              $("#phone_btn").val(timeVal + "后重新获取").attr("disabled", "disabled").addClass("disabled");
            } else {
              timeVal = 120;
              $("#phone_btn").val("获取验证码").removeAttr("disabled", "disabled").removeClass("disabled");
              clearInterval(Time);
              $(".cq_bank_ul .sub-btn").addClass("hide");
              $(".cq_bank_ul .gray-btn").removeClass("hide");
            }
          }, 1000);
        } else {
          $("#phone_btn").val("获取验证码").removeAttr("disabled", "disabled").removeClass("disabled");
          $("#phone").attr("title", data.error);
          $("#phone").poshytip({
            className: 'tip-yellowsimple',
            showTimeout: 1,
            alignTo: 'target',
            slide: false,
            fade: false,
            showOn: 'none',
            alignX: 'right',
            alignY: 'center',
            offsetX: 120,
            offsetY: 10
          });
          $("#phone").poshytip('hide');
          $("#phone").poshytip('show');
          $("#phone").focus();
        }
      }
    });
  }
}