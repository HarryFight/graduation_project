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

router.get('/menu/m/addCourse',manageC.getAddCoursePage);
router.post('/menu/m/addCourse',manageC.doAddCourse);
router.get('/menu/m/courseList',manageC.getCourseListPage);

router.get('/menu/m/studentList',manageC.getStudentListPage);



/* 所有接口 */

/**
 * 用户列表接口   type=1
 * @param  {[type]} '/menu/m/getUserList.do' [description]
 */
router.get('/menu/m/getUserList.do',manageC.getUserListJson);

/**
 * 删除单个用户接口   id=1
 * @param  {[type]} '/menu/m/deleteUser.do' [description]
 */
router.get('/menu/m/deleteUser.do',manageC.deleteUser);

/**
 * 课程列表接口   type=1
 * @param  {[type]} '/menu/m/getCourseList.do' [description]
 */
router.get('/menu/m/getCourseList.do',manageC.getCourseListJson);

/**
 * 删除单个课程接口   id=1
 * @param  {[type]} '/menu/m/deleteCourse.do' [description]
 */
router.get('/menu/m/deleteCourse.do',manageC.deleteCourse);

/**
 * 获取某一课程的学生列表json接口    cid=1
 * @param  {[type]} '/menu/m/getStudentList.do' [description]
 */
router.get('/menu/m/getStudentList.do',manageC.getStudentListJson);

/**
 * 新增单个课程选课学生接口    cid=1&sid=1,2,3
 * @param  {[type]} '/menu/m/addCourseStudent.do' [description]
 */
router.get('/menu/m/addCourseStudent.do',manageC.addCourseStudent);

/**
 * 删除单个课程选课学生接口   cid=1&sid=1,2,3
 * @param  {[type]} '/menu/m/deleteCourseStudent.do' [description]
 */
router.get('/menu/m/deleteCourseStudent.do',manageC.deleteCourseStudent);
module.exports = router;
