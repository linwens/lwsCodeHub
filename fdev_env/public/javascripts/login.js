$(function(){
	$('#J_submit').on('click',function(){
		doLogin();
	})
})
function doLogin(){
	var username = $('#J_name').val(),
		pwd = $('#J_pwd').val();
	var data = {'username':username,'pwd':pwd};
	
	$.ajax({
		url:'/users/login',
		type:'POST',
		dataType:'JSON',
		data:data,
		success:function(){
			console.log('登陆成功！');
		}
	})
}