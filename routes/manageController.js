var userDao = require('../dao/userDao.js');
var courseDao = require('../dao/courseDao.js');

exports.checkIsManager = function(req, res, next) {
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        if (data.type == 1) {
            next();
        } else {
            req.flash('flag', 0);
            req.flash('msg', '只有管理员有权限操作！！！');
            res.redirect('../tips');
        }
    })
}
exports.getAddUserPage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('m_addUser', {
        title: '新增用户',
        type: 1
    })
}
exports.doAddUser = function(req, res, next) {
    var nData = req.body;

    userDao.queryByKey('account',req.body.account,function(data){
         if(data.id){
             req.flash('flag', 0);
             req.flash('msg', '账号'+req.body.account+'已存在');
             res.redirect('../tips');
         }else{
             userDao.add(nData, function(ret) {
                 if(ret.code == 1) {
                     req.flash('flag', 1);
                     req.flash('msg', ret.msg);
                 } else {
                     req.flash('flag', 0);
                     req.flash('msg', ret.msg);
                 }
                 res.redirect('../tips');
             })
         }
    })
}
exports.getUserListPage = function(req,res,next){
    var userId = req.session.userId;

    res.render('m_userList', {
        title: '用户列表',
        type: 1
    })
}
exports.getUserListJson = function(req,res,next){
    var userId = req.session.userId;
    var getType= req.query.type;

    if(getType == '0'){
        userDao.queryAll(function(ret){
            res.json({
                data:ret
            })
        })
    }else{
        userDao.queryAllByKey('type',getType,function(ret){
            res.json({
                data:ret
            })
        })
    }
}
exports.deleteUser = function(req,res,next){
    var deleteId = req.query.id;

    userDao.deleteById(deleteId,function(ret){
        res.json({
            data:ret
        })
    })

}
exports.getAddCoursePage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('m_addCourse', {
        title: '新增课程',
        type: 1
    })
}
exports.doAddCourse = function(req, res, next) {
    var nData = req.body;

    if(req.body.name){
        courseDao.add(nData, function(ret) {
            if(ret.code == 1) {
                req.flash('flag', 1);
                req.flash('msg', ret.msg);
            } else {
                req.flash('flag', 0);
                req.flash('msg', ret.msg);
            }
            res.redirect('../tips');
        })
    }else{
        req.flash('flag', 0);
        req.flash('msg', '信息不完整，添加失败');
        res.redirect('../tips');
    }

}
exports.getCourseListPage = function(req,res,next){
    var userId = req.session.userId;

    res.render('m_courseList', {
        title: '课程列表',
        type: 1
    })
}
exports.getCourseListJson = function(req,res,next){
    var userId = req.session.userId;
    var getType= req.query.type;

    if(getType == '0'){
        courseDao.queryAll(function(ret){
            res.json({
                data:ret
            })
        })
    }else{
        courseDao.queryAllByKey('type',getType,function(ret){
            res.json({
                data:ret
            })
        })
    }
}
exports.deleteCourse = function(req,res,next){
    var deleteId = req.query.id;

    courseDao.deleteById(deleteId,function(ret){
        res.json({
            data:ret
        })
    })

}
