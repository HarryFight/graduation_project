var userDao = require('../dao/userDao.js');
var courseDao = require('../dao/courseDao.js');
var infoDao = require('../dao/infoDao.js');
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

exports.getCourseListJson = function(req,res,next){
    var userId = req.session.userId;
    var sid = req.query.sid || userId;

    infoDao.queryByKey('sid',sid,function(retData){
        if(retData.length < 1){
            res.json({
                code:0,
                msg:'该学生没有课'
            })
            return;
        }
        var ep = new EventProxy();
        //取每条数据的cid
        retData.forEach(function(item,index){
            //分别取每个cid的course数据
            courseDao.queryById(item.cid, function(data) {
                ep.emit('get_list', data);
            })
        })

        ep.after('get_list', retData.length, function(list) {
            console.log('拉取学生的课程列表信息', list);
            res.json({
                data: list
            })
        })
    })
}
