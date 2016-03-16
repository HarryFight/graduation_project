var express = require('express');
var router = express.Router();

var loginC = require('./loginController.js');
var menuC = require('./menuController.js');

//登录页跳转
router.get('/', function(req, res, next) {
    res.redirect(301, '/login');
});

//login
router.get('/login',loginC.getLogin);
router.post('/login',loginC.doLogin);
//logout
router.get('/logout',loginC.getLogout);


//菜单

//权限控制
router.get('/menu/?*',menuC.checkIsLogin);
router.get('/menu', menuC.getMenu);

//接口路由

module.exports = router;
