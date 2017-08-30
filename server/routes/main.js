
const express=require('express');
const router=express.Router();


router.get('/',(req,res,next)=>{
    res.render('index');
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

module.exports=router;