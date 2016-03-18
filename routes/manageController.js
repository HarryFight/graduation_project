var userDao = require('../dao/userDao.js');

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
