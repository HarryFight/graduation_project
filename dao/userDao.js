var mysql = require('mysql');
var $conf = require('../conf/db.js');

//使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);

module.exports = {
    add: function(data, callback) {
        pool.getConnection(function(err, connection) {
            var sql = 'INSERT INTO user (uin,type,account,password,name,sex,class,grade,college)' +
                'VALUES ("' +
                data.type + '","' +
                data.account + '","' +
                data.password + '","' +
                data.name + '","' +
                data.sex + '","' +
                data.class + '","' +
                data.grade + '","' +
                data.college + '")';

            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }

                if (result.affectedRows > 0) {
                    callback({
                        code: 1,
                        msg: '新用户' + data.name + '添加成功'
                    })
                } else {
                    callback({
                        code: 0,
                        msg: '用户添加失败'
                    })
                }
            })
        })
    },
    updateById: function(id, data, callback) {
        // acount password name sex class grade college 可以更改
        pool.getConnection(function(err, connection) {
            var fieldArr = [];
            for (var key in data) {
                fieldArr.push(key + '="' + data[key] + '"');
            }
            var sql = 'update user set ' + fieldArr.join(',') + ' where id=' + id;

            // var sql2 = 'update user set account="'+data.account+'",password="'+data.password+'",name="'+data.name+'",sex='+data.sex+',class="'+data.class+'",grade="'+data.grade+'",college="'+data.college+'" where id='+id;
            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }
                if (result.affectedRows > 0) {
                    callback({
                        code: 1,
                        msg: '用户（id:' + id + '） 数据更新成功'
                    })
                } else {
                    callback({
                        code: 0,
                        msg: '用户（id:' + id + '） 数据更新失败'
                    })
                }
            })
        })
    },
    queryById: function(id, callback) {
        pool.getConnection(function(err, connection) {
            var sql = 'select * from user where id ="' + id + '"';
            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }
                if (result.length) {
                    callback(result[0]);
                } else {
                    callback({});
                }
            })
        })
    },
    queryByKey: function(key,val,callback){
        //从连接池中获取连接
        pool.getConnection(function(err, connection) {
            var sql = 'select * from user where '+ key +' = "' + val + '"';
            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }
                if (result.length) {
                    callback(result[0]);
                } else {
                    callback({});
                }
            })
        })
    },
    queryAll: function(callback) {},
    deleteById: function(id, callback) {},
    queryIsLogin: function(account, password, callback) {
        //从连接池中获取连接
        pool.getConnection(function(err, connection) {
            var sql = 'select password,id from user where account = "' + account + '"';
            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }
                if (result.length) {
                    var res = result[0];
                    if (res.password == password) {
                        //返回成功和对应的userId
                        callback(1, res.id);
                    } else {
                        callback(0);
                    }
                } else {
                    callback(-1);
                }
            })
        })
    }
}
