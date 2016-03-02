var mysql = require('mysql');
var $conf = require('../conf/db.js');

//使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);

module.exports = {
    add: function() {},
    queryIsLogin: function(account, password, callback) {
        //从连接池中获取连接
        pool.getConnection(function(err, connection) {
            var sql = 'select password from user where account = "' + account + '"';
            connection.query(sql, function(err, result) {
                if (result.length) {
                    if (result[0].password == password) {
                        callback(1);
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
