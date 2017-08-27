module.exports=app=>{
    //引入路由
    app.use('/api', require('./api'));
    app.use('/admin', require('./admin'));
    app.use('/', require('./main'));

}

