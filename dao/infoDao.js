var mysql = require('mysql');
var $conf = require('../conf/db.js');

//使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);

module.exports = {
    add: function(data, callback) {
        pool.getConnection(function(err, connection) {
            var sql = 'INSERT INTO course_info (sid,cid)' +
                'VALUES ("' +
                data.sid + '","' +
                data.cid + '")';

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
                        msg: '选课成功'
                    })
                } else {
                    callback({
                        code: 0,
                        msg:  '选课失败'
                    })
                }

                //释放连接
                connection.release();
            })
        })
    },
    queryByKey: function(key,val,callback){
        //从连接池中获取连接
        pool.getConnection(function(err, connection) {
            var sql = 'select * from course_info where '+ key +' = "' + val + '"';
            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }
                callback(result);

                //释放连接
                connection.release();
            })
        })
    },
    queryAll: function(callback) {
        //从连接池中获取连接
        pool.getConnection(function(err, connection) {
            var sql = 'select * from course';
            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }
                callback(result);

                //释放连接
                connection.release();
            })
        })
    },
    queryAllByKey: function(key,val,callback){
        //从连接池中获取连接
        pool.getConnection(function(err, connection) {
            var sql = 'select * from course_info where '+ key +' = "' + val + '"';
            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }
                callback(result);

                //释放连接
                connection.release();
            })
        })
    },
    queryAllByMap:function(map,callback){
        //从连接池中获取连接
        pool.getConnection(function(err, connection) {
            var queryArr = [];
            for(var key in map){
                queryArr.push(key +"="+map[key]);
            }
            var sql = 'select * from course_info where '+queryArr.join(' and ');
            connection.query(sql, function(err, result) {
                if(err){
                    callback({
                        code:-1,
                        msg:'数据库操作错误'
                    })
                    return;
                }
                callback(result);

                //释放连接
                connection.release();
            })
        })
    },
    deleteByMap: function(map, callback) {
        pool.getConnection(function(err,connection){
            var queryArr = [];
            for(var key in map){
                queryArr.push(key +"="+map[key]);
            }
            var sql = 'delete from course_info where '+queryArr.join(' and ');
            connection.query(sql,function(err,result){
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
                        msg: '删除成功'
                    })
                } else {
                    callback({
                        code: 0,
                        msg: '删除失败'
                    })
                }

                //释放连接
                connection.release();
            })
        })
    },

}
