module.exports={
	/*校验需要登录*/
	authorize:function(req, res, next){
		if(!req.session.user){
			res.redirect('/login.html');
		}else{
			next()
		}
	}
}