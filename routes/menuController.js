var userDao = require('../dao/userDao.js');

exports.checkIsLogin = function(req, res, next) {
    var userId = req.session.userId;
    if (userId) {
        next();
    } else {
        res.redirect(301, '/login');
    }
}

exports.getMenuPage = function(req, res, next) {
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        res.render('menu', {
            title: '菜单',
            type: data.type,
            name: data.name
        });
    })
}
exports.getUserInfoPage = function(req, res, next) {
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        var nData = userModelParse(data);

        res.render('user_info', {
            title: '个人信息',
            type: data.type,
            name: data.name,
            user_uin: nData.uin,
            user_name: nData.name,
            user_sex: nData.sex,
            user_type: nData.type,
            user_grade: nData.grade,
            user_class: nData.class,
            user_college: nData.college
        });
    })
}
exports.getUserInfoModifyPage = function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId,function(data){
        var nData = userModelParse(data);

        res.render('user_info_modify', {
            title: '个人信息修改',
            type: data.type,
            name: data.name,
            user_uin: data.uin,
            user_name: data.name,
            user_sex: data.sex,
            user_type: nData.type,
            user_grade: data.grade,
            user_class: data.class,
            user_college: data.college
        });
    })
}
exports.doUserInfoModifyPage = function(req,res,next){
    var userId = req.session.userId;
    var rData = req.body;

    //先拿到原始数据
    userDao.queryById(userId,function(data){
        var nData = toUserDataModel(rData,data)
        //更新数据
        userDao.updateById(userId,nData,function(ret){
            if(ret.code == 1){
                req.flash('flag',1);
                req.flash('msg',ret.msg);
            }else{
                req.flash('flag',0);
                req.flash('msg',ret.msg);
            }
            res.redirect('../tips');
        })
    })
}
exports.getTipsPage = function(req,res,next){
    res.render('tips',{
        title:'提示页',
        type:req.session.userId,
        flag:req.flash('flag'),
        msg:req.flash('msg')
    })
}
/**
 * 将数据转化为显示数据模型
 * @param  {[type]} userData [description]
 * @return {[type]}          [description]
 */
function userModelParse(userData) {
    var sexMap = ['','男', '女'];
    var typeMap = ['','管理员', '老师', '学生'];

    var nData = {
        uin: userData.uin,
        name: userData.name,
        sex: sexMap[userData.sex],
        type: typeMap[userData.type],
        grade: (userData.grade ? userData.grade + '级' : '无'),
        class: (userData.class ? userData.class + '班' : '无'),
        college: (userData.college ? userData.college : '无')
    }

    return nData;
}
/**
 * 将请求数据 映射到 原始数据中
 * @param  {[type]} rDate [description]
 * @param  {[type]} oData [description]
 * @return {[type]}       [description]
 */
function toUserDataModel(rDate,oData){
    var nData = {};
    for(var key in oData){
        if(rDate[key]){
            nData[key] = rDate[key];
        }else{
            nData[key] = oData[key];
        }
    }

    return nData;
}
