'use strict';

var time = parseInt(new Date().getTime() / 1000);
var appkey = "D33F0C00C99EF28A7B27D487B36A84C3";
var accessToken = '';
// 系统http公参
function commonParams() {
	var str = '',
	    accessToken = $("#oauth_token").val();
	if (accessToken) {
		str = "&appkey=" + appkey + "&access_token=" + accessToken + "&ts=" + time + "&version=2.6";
	} else {
		str = "&appkey=" + appkey + "&ts=" + time + "&version=2.5";
	}
	return str;
}