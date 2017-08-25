const webpack=require('webpack');
const path=require('path');
//源码目录
const srcPath=path.resolve(__dirname,'src');


module.exports={
    entry:{
        'common/main':[srcPath+'/common/main.js','webpack-hot-middleware/client?reload=true']//4  指定重载策略，修改了前端代码js,css后，浏览器会自动刷新
    },
    output:{
        path:__dirname+'/public',
        filename:'[name].js',
        //发布路径
        //代理端口3000，这里的地址要换成代理服务器的地址
        //publicPath:'http://localhost:8080/public'
       //代理端口8080，这里的地址要换成代理服务器的地址
        publicPath:'http://localhost:3000/public'

    },
    //指定编译文件的定点位置
    devtool:'eval-source-map', //2
    module:{
        rules:[
            {
                test:/\.(png|jpg)$/,
                //如果图片小于8k  8192byte  就将图片Base64编码成字符串
                use:'url-loader?limit=8192&context=client&name=[name].[ext]'
            },
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader?sourceMap' //2
                ]
            }
        ]
    },
    plugins:[
        //这是一个坑2.0以上的版本用这个
        new webpack.optimize.OccurrenceOrderPlugin(),//根据模块的调用次数，给模块分配id,使得id可预测，降低文件大小
        new webpack.HotModuleReplacementPlugin(),//1.启动HMR 模块热替换
        //这里是个坑webpack 3 以上不用这个了 new webpack.NoErrorsPlugin()
        new webpack.NoEmitOnErrorsPlugin()//报错，但不退出webpack进程
    ]



};