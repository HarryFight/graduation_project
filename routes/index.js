var express = require('express');
var router = express.Router();

var loginC = require('./loginController.js');
var menuC = require('./menuController.js');

//登录页跳转
router.get('/', function(req, res, next) {
    res.redirect(301, '/login');
});

//login
router.get('/login',loginC.getLoginPage);
router.post('/login',loginC.doLogin);
//logout
router.get('/logout',loginC.doLogout);



//菜单
//权限控制
router.get('/menu/?*',menuC.checkIsLogin);
router.get('/menu', menuC.getMenuPage);
//通用页面
router.get('/menu/tips',menuC.getTipsPage);
router.get('/menu/user/info',menuC.getUserInfoPage);
router.get('/menu/user/info_modify',menuC.getUserInfoModifyPage);
router.post('/menu/user/info_modify',menuC.doUserInfoModifyPage);


//接口路由
module.exports = router;
