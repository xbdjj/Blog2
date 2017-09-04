console.log("文章列表");
require('bootstrap-table');//引入js
require('bootstrap-table/dist/locale/bootstrap-table-zh-CN');
require('BOOTSTRAP_TABLE_CSS');//引入css

//格式化日期  yyyy-MM-dd hh:mm:ss
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

//http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
$('#table').bootstrapTable({
    //url: '/admin/article/list',//客户端分页对应的url
    url: '/admin/article/pagination',//服务端分页的url
    columns: [{
        field: '_id',
        title: 'ID',
        width: 100,
        visible:false,//默认隐藏该字段
    }, {
        field: 'title',
        title: '标题'
    }, {
        field: 'body',
        title: '内容'
    }, {
        field: 'time',
        title: '发布时间',
        align: 'center',
        formatter: function (value) {
            //value   该字段的值
            if(!value)return '';
            return new Date(value).format('yyyy-MM-dd hh:mm:ss');
        }
    }],
    pagination:true,//是否开启分页
    classes:'table table-hover table-no-bordered',//覆盖默认的表格样式
    showRefresh:true,
    showColumns:true,
    paginationPreText:'上一页',
    paginationNextText:'下一页',
    sidePagination:'server',//启用服务端分页
    responseHandler:function(resp){//加载后端数据成功后会调用的函数
        /*
        resp==>
        {
            success:true,
            message:'',
            data:{
                total:0,
                rows:[]
            }
        }
        */


        /*  //前端要求的格式
        return {
            total:15,//满足条件的数据总共有多少条
            rows:[{_id:1,title:'标题',body:'内容',time:Date.now()}]
        }
        */
        if(!resp.success){
            return {
                total:0,
                rows:[]
            }
        }
        return resp.data;
    }

});