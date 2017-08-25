const express=require('express');
//引入模板
const swig=require('swig');
const app=express();

//模板配置-----------------
//配置应用模板
app.engine('html',swig.renderFile);
//设置模板文件存放的目录
app.set('views','./server/views');
//注册所使用的模板引擎
app.set('view engine','html');
//模板配置end-------------------------------

//取出设置的环境变量
console.log('取出的变量值',process.env.NODE_ENV);
//是否是开发模式
const isDev=process.env.NODE_ENV==='dev';

if(isDev){
        //设置不缓存
    swig.setDefaults({
        cache:false
    });
    //------------------node中调用webpack实现热刷新的中间件---------------------------------
    //3.在这里调用webpack的配置
    const webpack=require('webpack');
    const webpackConfig=require('./webpack.config.js');
    const compiler=webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler,{
        noInfo:true,
        stats:{
            colors:true
        },
        publicPath:webpackConfig.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));
    //-------------------node中调用webpack实现热刷新的中间件end------------------------------------
    

    //---------------------------路由----------------------------------
    app.get('/',(req,res,next)=>{
        res.render('index');
    });
    //引入路由
    app.use('/',require('./server/routers/api'));
     //---------------------------路由end----------------------------------

     //引入browser-sync模块，实现修改前端代码浏览器自动刷新
    const browserSync=require('browser-sync').create();
    //实现服务器重启以后浏览器能自动刷新
    const reload=require('reload');
    const http=require('http');
    const server=http.createServer(app);
    reload(app);//通知浏览器刷新
    
    server.listen(8080, () => {
        
        
                //告诉 browserSync  我们监听哪个目录（配置）
                browserSync.init({
                    ui: false,
                    open: false,
                    online: false, //离线工作模式，可以大大提高启动速度
                    notify: false, //不显示在浏览器中的任何通知
                    proxy: 'localhost:8080', //要代理的服务器地址
                    files: './server/views/**', //监听被修改的代码
                    port: 3000 //服务器启动的端口
                }, () => console.log('开发模式，代理服务器启动成功'));
        
        
            });

}else{
    //配置静态资源目录（可以配置多个)
    //因为上面的热加载把编译后的文件放内存了，不放public的文件磁盘上了(加了中间件为什么注释掉)
    app.use('/public',express.static(__dirname+'/public'));

    //---------------------------路由----------------------------------
    app.get('/',(req,res,next)=>{
        res.render('index');
    });
    //引入路由
    app.use('/',require('./server/routers/api'));
     //---------------------------路由end----------------------------------

    
    app.listen(8080,()=>{
        console.log('web应用启动成功'); 
    });

}


/*
//如果你想使用8080端口访问，可以把原先服务器改成3000端口，代码服务器改成8080
    //端口；publicPath改成8080端口
    //更改端口启动8080，代理的是3000
    server.listen(3000,()=>{
    
        //告诉browserSync 我们监听哪个目录（配置）
        browserSync.init({
            ui:false,
            open:false,
            online:false,//离线工作模式，可以大大提高启动速度
            notify:false,//不显示在浏览器中的任何通知
            proxy: "localhost:3000/",
            files:'./server/views/**',
            port:8080
        },()=>console.log('开发模式，代理服务器启动成功'));
    
       // console.log('web应用启动成功');
    });
*/




