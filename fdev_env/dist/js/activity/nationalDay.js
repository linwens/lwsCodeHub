'use strict';

$(function () {
	getMsg();
});
function getMsg() {
	$.ajax({
		url: '/devapi/app/borrow/typeBorrow.html',
		type: 'GET',
		dataType: 'json',
		success: function success(rslt) {
			console.log(rslt);
		},
		error: function error() {}
	});
	$.ajax({
		url: '/mocks/getData',
		type: 'GET',
		success: function success(rslt) {
			console.log(rslt);
		},
		error: function error() {}
	});
}