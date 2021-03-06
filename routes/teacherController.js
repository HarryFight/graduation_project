var userDao = require('../dao/userDao.js');
var courseDao = require('../dao/courseDao.js');
var infoDao = require('../dao/infoDao.js');
var EventProxy = require('eventproxy');

var markdown = require('markdown').markdown;

exports.checkIsTeacher = function(req, res, next) {
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        if (data.type == 2) {
            next();
        } else {
            req.flash('flag', 0);
            req.flash('msg', '只有老师有权限操作！！！');
            res.redirect('../tips');
        }
    })
}
exports.getClassSchedulePage = function(req, res, next) {
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        res.render('t_classSchedule', {
            title: "我的课表",
            type: 2,
            name: data.name
        })
    })
}
exports.getCourseListJson = function(req, res, next) {
    var userId = req.session.userId;
    var tid = req.query.tid || userId;


    courseDao.queryAllByKey('teacher', tid, function(retData) {

        var ep = new EventProxy();

        retData.forEach(function(item, index) {
            //教师名字格式化
            userDao.queryById(item.teacher, function(rData) {
                retData[index].teacher = rData.name;
                ep.emit('get_list');
            })
        })

        ep.after('get_list', retData.length, function() {
            console.log('拉取任课课程列表信息', retData);
            res.json({
                data: retData
            })
        })
    })
}
exports.getStudentListPage = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    courseDao.queryById(cid, function(retData) {
        if (retData.id) {
            res.render('t_studentList', {
                title: '【' + retData.name + '】学生列表',
                type: 1,
                name: retData.name
            })
        } else {
            req.flash('flag', 0);
            req.flash('msg', 'cid' + cid + ' 课程不存在');
            res.redirect('../tips');
        }
    })
}
exports.getStudentListJson = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    infoDao.queryAllByKey('cid', cid, function(retData) {
        if (!retData.length) {
            res.json({
                data: {},
                msg: '错误的cid'
            })
        }
        var ep = new EventProxy();
        //取每条数据的sid
        retData.forEach(function(item, index) {
            //分别取每个sid的user数据
            userDao.queryById(item.sid, function(data) {
                ep.emit('get_list', data);
            })
        })

        ep.after('get_list', retData.length, function(list) {
            console.log('拉取的学生列表', list);
            res.json({
                data: list
            })
        })
    })
}
exports.getStudentScoreListJson = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    infoDao.queryAllByKey('cid', cid, function(retData) {
        if (!retData.length) {
            res.json({
                data: {},
                msg: '错误的cid'
            })
        }
        var ep = new EventProxy();
        //取每条数据的sid
        retData.forEach(function(item, index) {
            //分别取每个sid的user数据
            userDao.queryById(item.sid, function(data) {
                data.score = item.score;
                data.score1 = item.score1;
                data.score2 = item.score2;
                ep.emit('get_list', data);
            })
        })

        ep.after('get_list', retData.length, function(list) {
            console.log('拉取的学生列表', list);
            res.json({
                data: list
            })
        })
    })
}
exports.getScoreManagePage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('t_courseList', {
        title: '成绩管理',
        type: 2
    })
}
exports.getStudentScorePage = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    courseDao.queryById(cid, function(retData) {
        res.render('t_studentScore', {
            title: '【' + retData.name + '】学生成绩列表',
            type: 2,
            name: retData.name
        })
    })
}
exports.updateScore = function(req,res,next){
    var cid = req.query.cid;
    var sid = req.query.sid;

    infoDao.updateByMap({
        'cid':cid,
        'sid':sid
    },{
        score : req.body.score,
        score1 : req.body.score1,
        score2 : req.body.score2
    },function(ret){
        res.json(ret);
    })

}
exports.getExpGuideListPage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('t_expGuideList', {
        title: '提交/查看实验指导书',
        type: 2
    })
}
exports.getExpGuidePage = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    courseDao.queryById(cid,function(data){
        var guide = data.exp_guide || '暂未提交';
        res.render('t_expGuide', {
            title: data.name+'|实验指导书',
            type: 2,
            name:data.name,
            cid:cid,
            content: markdown.toHTML(guide)
        })
    })
}
exports.getExpGuideEditPage = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    courseDao.queryById(cid,function(data){
        var guide = data.exp_guide || '暂未提交';
        res.render('t_expGuide_modify', {
            title: data.name+'|实验指导书',
            type: 2,
            name:data.name,
            cid:cid,
            content: guide
        })
    })
}
exports.expGuideEdit = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.body.cid;

    courseDao.updateById(cid,{
        exp_guide:req.body.content
    },function(ret){
        if (ret.code == 1) {
            courseDao.queryById(cid,function(data){
                var guide = data.exp_guide || '暂未提交';
                res.render('t_expGuide', {
                    title: data.name+'|实验指导书',
                    type: 2,
                    name:data.name,
                    cid:cid,
                    content: markdown.toHTML(guide)
                })
            })
        }else {
            req.flash('flag', 0);
            req.flash('msg', ret.msg);
            res.redirect('../tips');
        }
    })
}
//实验报告
exports.getExpReportListPage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('t_expReportList', {
        title: '实验报告课程',
        type: 2
    })
}
exports.getExpReportStudentListPage = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    courseDao.queryById(cid,function(data){
        res.render('t_expReportStudentList', {
            title: '实验报告学生列表',
            type: 2,
            name:data.name
        })
    })
}
exports.getExpReportPage = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;
    var sid = req.query.sid || userId;
    infoDao.queryAllByMap({
        'cid':cid,
        'sid':sid
    },function(data){
        var report = data[0].exp_report || '暂未提交';
        var sName = '';
        var cName = '';

        var ep = new EventProxy();
        userDao.queryById(sid,function(data){
            sName = data.name;
            ep.emit('get',data.name);
        })
        courseDao.queryById(cid,function(data){
            cName = data.name;
            ep.emit('get',data.name);
        })

        ep.after('get',2, function(list) {
            console.log('信息', list);
            res.render('t_expReport', {
                title: sName+'|'+ cName +'|实验报告',
                type: 2,
                sName:sName,
                cName:cName,
                cid:cid,
                content: markdown.toHTML(report)
            })
        })
    })
}
