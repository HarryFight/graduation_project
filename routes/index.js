var express = require('express');
var router = express.Router();

var loginC = require('./loginController.js');
var menuC = require('./menuController.js');
var manageC = require('./manageController.js');
var studentC = require('./studentController.js');
var teacherC = require('./teacherController.js');

// router.get('/?*',function(req,res,next){
//     //设置session用于调试   1：管理 2：学生 3：老师
//     req.session.userId = 3;
//     next();
// })


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





/* 学生权限路由 */
router.all('/menu/s/?*',studentC.checkIsStudent);
router.get('/menu/s/classSchedule',studentC.getClassSchedulePage)
router.get('/menu/s/searchScore',studentC.getsearchScorePage)

//实验指导书
router.get('/menu/s/expGuideList',studentC.getExpGuideListPage);
router.get('/menu/s/expGuide',studentC .getExpGuidePage);

//实验报告
router.get('/menu/s/expReportList',studentC.getExpReportListPage);
router.get('/menu/s/expReport',studentC.getExpReportPage);
router.get('/menu/s/expReportEdit',studentC.getExpReportEditPage);
router.post('/menu/s/expReportEdit',studentC.expReportEdit);


/**
 * 获取学生选课的列表信息（用于渲染课表） sid=2
 * @param  {[type]} '/menu/s/getCourseList.do' [description]
 */
router.get('/menu/s/getCourseList.do',studentC.getCourseListJson);
/**
 * 获取学生所有课程成绩的列表信息 sid=2
 */
router.get('/menu/s/getScoreList.do',studentC.getScoreListJson);


/* 老师权限路由 */
router.all('/menu/t/?*',teacherC.checkIsTeacher);
router.get('/menu/t/classSchedule',teacherC.getClassSchedulePage)
router.get('/menu/t/studentList',teacherC.getStudentListPage);

router.get('/menu/t/scoreManage',teacherC.getScoreManagePage);
router.get('/menu/t/studentScore',teacherC.getStudentScorePage);

//实验指导书
router.get('/menu/t/expGuideList',teacherC.getExpGuideListPage);
router.get('/menu/t/expGuide',teacherC.getExpGuidePage);
router.get('/menu/t/expGuideEdit',teacherC.getExpGuideEditPage);
router.post('/menu/t/expGuideEdit',teacherC.expGuideEdit);

//实验报告
router.get('/menu/t/expReportList',teacherC.getExpReportListPage);
router.get('/menu/t/expReportStudentList',teacherC.getExpReportStudentListPage);
router.get('/menu/t/expReport',teacherC.getExpReportPage);

/**
 * 获取老师任课的列表信息（用于渲染课表） sid=3
 * @param  {[type]} '/menu/t/getCourseList.do' [description]
 */
router.get('/menu/t/getCourseList.do',teacherC.getCourseListJson);
/**
 * 获取某一课程的学生列表json接口    cid=1
 * @param  {[type]} '/menu/t/getStudentList.do' [description]
 */
router.get('/menu/t/getStudentList.do',teacherC.getStudentListJson);
/**
 * 获取某一课程的学生成绩列表json接口    cid=1
 */
router.get('/menu/t/getStudentScoreList.do',teacherC.getStudentScoreListJson);
/**
 * 更新某一课程的某一学生成绩接口    cid=1&sid=1   post  score=[0,0,0]
 */
router.post('/menu/t/updateScore.do',teacherC.updateScore);

module.exports = router;
