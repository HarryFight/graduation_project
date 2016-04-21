var userDao = require('../dao/userDao.js');
var courseDao = require('../dao/courseDao.js');
var EventProxy = require('eventproxy');

exports.checkIsTeacher = function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        if (data.type == 2) {
            next();
        } else {
            req.flash('flag', 0);
            req.flash('msg', '只有老师有权限操作！！！');
            res.redirect('../tips');
        }
    })
}
exports.getClassSchedulePage = function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
            res.render('t_classSchedule',{
                title:"我的课表",
                type:2,
                name:data.name
            })
    })
}
exports.getCourseListJson = function(req,res,next){
    var userId = req.session.userId;
    var tid = req.query.tid || userId;


    courseDao.queryAllByKey('teacher',tid,function(retData){

        var ep = new EventProxy();

        retData.forEach(function(item,index){
            //教师名字格式化
            userDao.queryById(item.teacher,function(rData){
                retData[index].teacher = rData.name;
                ep.emit('get_list');
            })
        })

        ep.after('get_list', retData.length, function() {
            console.log('拉取任课课程列表信息', retData);
            res.json({
                data: retData
            })
        })
    })
}
