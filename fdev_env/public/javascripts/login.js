$(function(){
	var str = commonParams();
	$('#J_submit').on('click',function(){
		doLogin(str);
	})
})
function doLogin(str){
	var username = $('#J_name').val(),
		password = $('#J_pwd').val(),
		validCode = $('#validCode').val();
	var data = {
		actionType: 'login',
		username: username,
		password: password,
		validCode: validCode,
	};
	
	$.ajax({
		url:'/api/user/doLogin.htm?'+str,
		type:'POST',
		dataType:'JSON',
		data:data,
		success:function(rslt){
			console.log(rslt);
			console.log('登陆成功！');
		}
	})
}