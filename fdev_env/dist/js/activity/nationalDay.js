'use strict';

$(function () {
	getMsg();
});
function getMsg() {
	$.ajax({
		url: '/api/app/borrow/typeBorrow.html',
		type: 'GET',
		dataType: 'json',
		success: function success(rslt) {
			console.log(rslt);
		},
		error: function error() {}
	});
}