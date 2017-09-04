const mongoose = require('mongoose');
//创建一张集合，schema
let userSchema= new mongoose.Schema({
    username:String,
    password:String,
    email:String
});

//用面向对象的思想去操作数据库
//我们不操作数据库本身，而是先造一个类（构造函数）,通过这个这个类
//创建的对象来操作数据库集合
//把这个对象和数据库的集合一一对应 映射
module.exports= mongoose.model('User', userSchema);