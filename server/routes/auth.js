/**
 * 处理登陆鉴权的模块
 */

module.exports=(req,resp,next)=>{
    console.log('所有的请求都被我拦截掉',req.url);
    //有些请求是不应该被拦截的  登陆注册不能被拦截
    //  /admin/index
    //如果请求路径 以 /admin开头，就要拦截对其进行权限校验
    if(req.url.startsWith('/admin')){
        if(req.session.user){
            //存在session,放行
            console.log('有权限，允许放行');
            next();
        }else{
            console.log('没有登陆，不允许访问，先跳转到登陆')
            //重定向跳转到登陆页面
            resp.redirect('/login');
        
        }
    }else{
        next();
    }
}
