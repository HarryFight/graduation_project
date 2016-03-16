var userDao = require('../dao/userDao.js');

exports.getLogin = function(req,res,next){
    res.render('login', {
        title: '登录'
    })
}

exports.doLogin = function(req,res,next){
    var param = {
        account: req.param('account'),
        password: req.param('password')
    }
    userDao.queryIsLogin(param.account, param.password, function(code,userId) {
        switch (code) {
            case 1:
            //在session中保存登录态
                req.session.userId = userId;
                res.json({
                    code: '200',
                    msg: '登录成功'
                })
                break;
            case 0:
                res.json({
                    code: '500',
                    msg: '密码错误，登录失败'
                })
                break;
            case -1:
                res.json({
                    code: '500',
                    msg: '错误，账号不存在'
                })
                break;
            default:
                res.json({
                    code: '500',
                    msg: '系统错误'
                })
        }
    })
}

exports.getLogout = function(req,res,next){
    //清除session的信息
    req.session.userId = '';

    res.redirect(301,'/');
}
