console.log('我是公共的js,很多页面都会引用我,也是入口文件');
/*
这两句代码作用一样因为加了'syntax-dynamic-import'
import变为了关键赋值
import {obj} from './lib';
let obj=require('./lib');
*/
//require('../index/index');
//取别名用的方式
//require('SRC/login/login');
//实现，访问login 就自动帮我引入login.js
//按需加载
let modelPath=$('[data-main]').data("main");//login/login
console.log(modelPath);
if(modelPath){
    //异步引入模块
    import('../'+modelPath)
    .then(model=>{
        console.log('加载模块成功',model);
    }).catch(err=>{
        console.log('加载模块失败',err);
    });
}
//不是后台界面或者登陆界面
if(!location.pathname.startsWith('admin')&&!location.pathname.startsWith('/login')){
    require('jquery-pjax');    
}
  
//在入口文件加入下面这行代码，可以实现  修改了js文件后，ajax刷新
//不加的话  修改代码后整页直接刷新
/*
if(module.hot){
    module.hot.accept();
}
*/