const express = require('express');
const router = express.Router();

let Article = require('../dbModels/Article');

//后端响应给前端的数据格式
let responseMesg;
//在进入下面的路由之前，先调用中间件处理下 
//该中间件在api.js里，所以只拦截api.js里面的路由
router.use((req, resp, next) => {
    console.log('中间件进来了');
    //初始化一下数据格式
    responseMesg = {
        success: false,
        message: '',
        data: {
            total: 0,
            rows: []
        }
    };
    //放行;注意：如果不放行的话，请求就会被堵塞在中间件，进入不到下面的路由
    next();
});


/**
 * 跳转到登陆后的首页
 */
router.get('/index', (req, res, next) => {
    res.render('admin/article-list', {
        user: req.session.user
    });
});


/**
 * 查询列表（一次性查出所有数据）
 */
router.get('/article/list', (req, res, next) => {
    Article.find().then(articles => {
        res.json(articles);
    });
});


/**
 * 查询文章列表（服务端分页）
 */
router.get('/article/pagination',(req,res,next)=>{
    //获取下前端传给后端的分页数据
    //因为req.query.offset类型为String所以要转换为Number
    let offset = Number(req.query.offset);
    let limit = Number(req.query.limit); //每页固定显示的数据条数（10）
    let sort=req.query.sort||'_id';//按哪个字段排序
    let order=(req.query.order==='asc' ? 1:-1);//排序方式  asc代表升序    desc降序

    console.log(sort,order);    
    console.log(offset,limit);      
    //          0      10      ==>第1页  page
    //          10     10      ==>第2页  
    //          20     10      ==>第3页
    //  offset/limit  +1  = page   

    //查询数据总共有多少条
    Article.count().then(count=>{
        responseMesg.data.total=count;
    })

    //skip  limit  跳过前面skip条数据，然后往后取limit条数据
    //sort({要排列的字段:+1||-1}) +1代表盛序 —1代表降序
    Article.find().sort({
        [sort]:order//变量的sort和order
    }).skip(offset).limit(limit).then(articles=>{
        // articles.map((item.index)=>{
        //     console.log(item);
        //     item.body=item.body.substring(0,50);
        //     return
        // });
        responseMesg.success=true;
        responseMesg.data.rows=articles
        res.json(responseMesg);
    })

});

/**
 * 跳转到文章添加页面
 */
router.get('/article/add', (req, res, next) => {
   res.render('admin/article-add');
});
/**
 * 查询某篇文章，并且跳转到编辑页面
 */
//:id为变量
router.get('/article/:id',(req, res, next) => {
    //首先获取到id
    //根据id查询数据
    //把数据传给模板
    //模板渲染数据
    let id=req.params.id;//这里的id要与上面的变量名称一样
    console.log('req.params值'+req.params);
    
    Article.findById(id).then(article=>{
        
        res.render('admin/article-edit',{
            //article:article
            article
        });
    });
   
 });


/**
 * 删除文章
 */
router.delete('/article/:id',(req, res, next) => {
    //首先获取到id
    Article.findByIdAndRemove(req.params.id).then(article=>{
        responseMesg.message='删除成功';
        responseMesg.success='true';
        res.json(responseMesg);
    });
});

/**
 * 修改文章
 * findByIdAndUpdate
 * 参数1：id    参数2：要修改的内容
 */
router.post('/article/update', (req, res, next) => {
    let parms = req.body;
    Article.findByIdAndUpdate(parms.id,{
        title:parms.title,
        body:parms.body
    }).then(article=>{
        if(article){
            responseMesg.success=true;
            responseMesg.message='修改成功';
        }else{
            responseMesg.message='修改失败';
        }
        res.json(responseMesg);
    });
    
});

/**
 * 保存文章
 */
router.post('/article/save', (req, res, next) => {
    //获取
    let parms=req.body;
    console.log(parms);
    if(!parms.title||!parms.body){
        responseMesg.message='标题或者内容不能为空！';
        //变成json对象
        res.json(responseMesg);
        return;
    }
    //往数据库插文章标题内容
    new Article({
        title: parms.title,
        body: parms.body
    }).save().then(article => {
        responseMesg.success=true;
        responseMesg.message='保存成功!'
        console.log(responseMesg);
        res.json(responseMesg);
    });
});

/**
 * 退出
 */
router.get('/logout',(req,res,next)=>{
    req.session.user=null;
    //重定向转到登陆页面
    res.redirect('/login');
});

module.exports = router;