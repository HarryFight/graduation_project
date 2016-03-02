var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect(301, 'login');
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: '登录'
    })
})
router.post('/login', function(req, res, next) {
    var param = {
        account: req.param('account'),
        password: req.param('password')
    }
    userDao.queryIsLogin(param.account, param.password, function(code) {
        switch (code) {
            case 1:
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
                    msg: '错误，账号不存在'
                })
        }
    })
});
router.get('/menu',function(req,res,next){
    res.send('这是菜单页');
    res.end();
})
module.exports = router;
