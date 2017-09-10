//前端校验
require('jquery-validation');
//console.log($('form').validate);

//汉化
require('jquery-validation/dist/localization/messages_zh');

//以下为修改jQuery Validation插件兼容Bootstrap的方法
$.validator.setDefaults({
	ignore: "",
    highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function (element) {
        element.closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    errorElement: "span",
    errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            error.appendTo(element.parent().parent().parent());
        } else {
            error.appendTo(element.parent());
        }
    },
    errorClass: "help-block",
    validClass: "help-block"


});


$('form').validate({
    rules:{
        'title':{
            'required':true,
            'maxlength':16
        },
        'body':{
            'required':true 
        },
        
    },
    messages:{
        'title':{
            'required':'标题不能为空'
        }
    },
    submitHandler:function(form){
        alert('验证通过了，可以提交表单了');
        $.ajax({
            url:'/admin/article/save',
            method:'post',
            //提交到后台
            data:{
                title:$('#title').val(),
                body:$('#body').val()
            },
           
            success:function(resp){
                  //提交成功返回的数据
                if(resp.success){              
                    alert(resp.message);
                    //成功后跳转到文章列表地址
                    location.href='/admin/index';
                }
            }
        })
        
        
        
    }


});