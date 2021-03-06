var userDao = require('../dao/userDao.js');
var courseDao = require('../dao/courseDao.js');
var infoDao = require('../dao/infoDao.js');
var EventProxy = require('eventproxy');

var markdown = require('markdown').markdown;

exports.checkIsStudent = function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        if (data.type == 3) {
            next();
        } else {
            req.flash('flag', 0);
            req.flash('msg', '只有学生有权限操作！！！');
            res.redirect('../tips');
        }
    })
}
exports.getClassSchedulePage = function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
            res.render('s_classSchedule',{
                title:"我的课表",
                type:3,
                name:data.name
            })
    })
}

exports.getCourseListJson = function(req,res,next){
    var userId = req.session.userId;
    var sid = req.query.sid || userId;

    infoDao.queryByKey('sid',sid,function(retData){
        if(retData.length < 1){
            res.json({
                code:0,
                msg:'该学生没有课'
            })
            return;
        }
        var ep = new EventProxy();
        //取每条数据的cid
        retData.forEach(function(item,index){
            //分别取每个cid的course数据
            courseDao.queryById(item.cid, function(data) {
                var tId = data.teacher || 0;
                userDao.queryById(tId,function(rData){
                    data.teacher = rData.name;
                    ep.emit('get_list', data);
                })
            })
        })

        ep.after('get_list', retData.length, function(list) {
            console.log('拉取学生的课程列表信息', list);
            res.json({
                data: list
            })
        })
    })
}


exports.getsearchScorePage = function(req,res,next){
    var userId = req.session.userId;

    res.render('s_scoreList',{
        title:"我的课表",
        type:3,
    })

}

exports.getScoreListJson = function(req,res,next){
    var userId = req.session.userId;
    var sid = req.query.sid || userId;

    infoDao.queryByKey('sid',sid,function(retData){
        if(retData.length < 1){
            res.json({
                code:0,
                msg:'该学生没有课'
            })
            return;
        }
        var ep = new EventProxy();
        //取每条数据的cid
        retData.forEach(function(item,index){
            //分别取每个cid的course数据
            courseDao.queryById(item.cid, function(data) {
                var tId = data.teacher || 0;
                userDao.queryById(tId,function(rData){
                    data.teacher = rData.name;
                    data.score = item.score;
                    data.score1 = item.score1;
                    data.score2 = item.score2;
                    ep.emit('get_list', data);
                })
            })
        })

        ep.after('get_list', retData.length, function(list) {
            console.log('拉取学生的课程列表信息', list);
            res.json({
                data: list
            })
        })
    })
}

//实验指导书
exports.getExpGuideListPage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('s_expGuideList', {
        title: '查看实验指导书',
        type: 3
    })
}
exports.getExpGuidePage = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    courseDao.queryById(cid,function(data){
        var guide = data.exp_guide || '暂未提交';
        res.render('s_expGuide', {
            title: data.name+'|实验指导书',
            type: 3,
            name:data.name,
            cid:cid,
            content: markdown.toHTML(guide)
        })
    })
}

//实验报告
exports.getExpReportListPage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('s_expReportList', {
        title: '实验报告课程',
        type: 3
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
            res.render('s_expReport', {
                title: sName+'|'+ cName +'|实验报告',
                type: 3,
                sName:sName,
                cName:cName,
                cid:cid,
                content: markdown.toHTML(report)
            })
        })
    })
}
exports.getExpReportEditPage = function(req, res, next) {
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
            res.render('s_expReport_modify', {
                title: sName+'|'+ cName +'|实验报告',
                type: 3,
                sName:sName,
                cName:cName,
                cid:cid,
                content: report
            })
        })
    })
}
exports.expReportEdit = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.body.cid;
    var sid = req.query.sid || userId;

    infoDao.updateByMap({
        'cid':cid,
        'sid':sid
    },{
        'exp_report':req.body.content
    },function(ret){
        if (ret.code == 1) {
            req.flash('flag', 1);
            req.flash('msg', '提交成功');
            res.redirect('../tips');
        }else{
            req.flash('flag', 0);
            req.flash('msg', ret.msg);
            res.redirect('../tips');
        }
    })
}
