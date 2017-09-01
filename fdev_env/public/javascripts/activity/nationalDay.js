$(function(){
	getMsg();
})
function getMsg(){
	$.ajax({
		url:'/devapi/app/borrow/typeBorrow.html',
		type:'GET',
		dataType:'json',
		success:function(rslt){
			console.log(rslt);
		},
		error:function(){}
	})
}