var express = require('express');
var router = express.Router();

var loginC = require('./loginController.js');
var menuC = require('./menuController.js');
var manageC = require('./manageController.js')

//登录页跳转
router.get('/', function(req, res, next) {
    res.redirect(301, '/login');
});

//login
router.get('/login',loginC.getLoginPage);
router.post('/login',loginC.doLogin);
//logout
router.get('/logout',loginC.doLogout);


/* 以下菜单内路由 */
//权限控制
router.all('/menu/?*',menuC.checkIsLogin);
router.get('/menu', menuC.getMenuPage);
/* 通用页面 */
router.get('/menu/tips',menuC.getTipsPage);
router.get('/menu/user/info',menuC.getUserInfoPage);
router.get('/menu/user/info_modify',menuC.getUserInfoModifyPage);
router.post('/menu/user/info_modify',menuC.doUserInfoModify);
router.get('/menu/user/psw_modify',menuC.getPswModifyPage);
router.post('/menu/user/psw_modify',menuC.doPswModify);

/* 管理员权限路由 */
router.all('/menu/m/?*',manageC.checkIsManager);
router.get('/menu/m/addUser',manageC.getAddUserPage);
router.post('/menu/m/addUser',manageC.doAddUser);
router.get('/menu/m/userList',manageC.getUserListPage);
//接口
router.get('/menu/m/getuserList.do',manageC.getUserListJson);
router.get('/menu/m/deleteUser.do',manageC.deleteUser);

module.exports = router;
