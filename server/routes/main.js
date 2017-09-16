
const express=require('express');
const router=express.Router();
let Article = require('../dbModels/Article');

/**
 * 判断是ajax请求还是  页面直接刷新的请求 的中间件
 * 如果是ajax请求则返回片段
 * 如果是直接刷新的请求 则返回完整页面
 * 这个中间件只负责判断，不负责渲染
 * x-requested-with:XMLHttpRequest
 */
router.use((req, res, next) => {
    console.log('(nodejs API)是否是ajax请求：',req.header('x-requested-with')==='XMLHttpRequest');
    console.log('(express API)是否是ajax请求：',req.xhr);
    //req.app.locals.isAjax=req.xhr;//这个不能用，会出问题，因为它是全局的，整个服务器共享的
    res.locals.isAjax = req.xhr;//一个请求对应的一个响应
    next();
})

/**
 * 首页
 */
router.get('/',(req,res,next)=>{
    res.render('index');
});
/**
 * 文章详情
 */
router.get('/article/detail',(req,res,next)=>{
    res.render('article-details');
});


router.get('/index',(req,res,next)=>{
    res.render('index');
});
/**
 * 跳转到登陆界面
 */
router.get('/login',(req,res,next)=>{
    res.render('login');
});

/**
 * 首页文章列表
 */
router.get('/article/list',(req,res,next)=>{
    //获取下前端传给后端的分页数据
    //因为req.query.offset类型为String所以要转换为Number

    let page = Number(req.query.page)||1;//显示第几页
    let limit =9; //每页固定显示的数据条数（10）

    let offset = (page-1)*limit;
       
    //          0      9      ==>第1页  page
    //          9     9      ==>第2页  
    //          18     9      ==>第3页
    //  offset/limit  +1  = page   

    //查询数据总共有多少条
    Article.count().then(count=>{
        responseMesg.data.total=count;
    })

    //skip  limit  跳过前面skip条数据，然后往后取limit条数据
    //sort({要排列的字段:+1||-1}) +1代表盛序 —1代表降序
    Article.find().sort({
        '_id':-1//变量的sort和order
    }).skip(offset).limit(limit).then(articles=>{
        
        articles=articles.map((item,index)=>{
            //获取body中第一张图片地址作为封面
           let result=item.body.match(/<img[^>]*src=['"]([^'"]+)[^>]*>/);
           //console.log('result图片地址',result);
            if(result){
                item.cover=result[1];
            }else{
                item.cover='http://o0xihan9v.qnssl.com/wp-content/uploads/2016/01/1437464131114260.jpg?imageslim|imageView2/2/w/1200/h/744'
            }
            //过滤html并且截取前76个字符
            item.body=item.body.replace(/<[^>]+>/g,'').substring(0,77)+'...';

            console.log(item.cover);
            return item;

        });
        
        res.json(articles);
    })
});

module.exports=router;