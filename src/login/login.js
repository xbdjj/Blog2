//框架放在最前面
//require('bootstrap');//这里引入的bootstrap是js文件
//require('BOOTSTRAP_CSS');//这里引入的bootstrap是css文件

require('./login.css');
let MD5=require('md5.js');
console.log('我是登陆的.js');
//返回的数据
//module.exports={}
//在前端里不要用箭头函数，因为this不好用
$('.login form').on('submit',function(e){
    //阻止默认的表单提交
    e.preventDefault();
    console.log('已经成功阻止默认提交了');
    let [username,password]=[this.username.value.trim(),this.password.value.trim()];
    console.log(username,password);
    if(!username||!password){
        $('#errorMesg').text('用户名或密码不能为空')
        .show()
        .animate({
            display:'none'
        },1500,function(){
            $(this).hide();
        });
        
        // setTimeout(function(){
        //     $('#errorMesg').hide();
        // },1500)

        return;
    }
    //校验用户名和密码
    password=new MD5().update(password).digest('hex');
    $.ajax({
        url:'/api/user/check',
        method:'post',
        data:{
            username,
            password
        },
        success:function(data){
             //{ success:false ,message:''}
            console.log('后端返回给前端的数据',data);
            if(data.success){
                location.href="/admin/index";
            }else{
                $('#errorMesg').text('用户名或密码不正确')
                .show()
                .animate({
                    display:'none'
                },2000,function(){
                    $(this).hide();
                });
            }

        }
    })

});