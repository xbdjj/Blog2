
const express=require('express');
const router=express.Router();
/**
 * 跳转到登陆后的首要
 */
router.get('/index',(req,res,next)=>{
    res.render('admin/index',{
        user:req.session.user
    });
});


module.exports=router;