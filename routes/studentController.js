var userDao = require('../dao/userDao.js');
var courseDao = require('../dao/courseDao.js');
var EventProxy = require('eventproxy');

exports.checkIsStudent = function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        if (data.type == 3) {
            next();
        } else {
            req.flash('flag', 0);
            req.flash('msg', '只有学生有权限操作！！！');
            res.redirect('../tips');
        }
    })
}
exports.getClassSchedulePage = function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
            res.render('s_classSchedule',{
                title:"我的课表",
                type:3,
                name:data.name
            })
    })
}
