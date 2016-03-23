var userDao = require('../dao/userDao.js');
var courseDao = require('../dao/courseDao.js');
var EventProxy = require('eventproxy');

exports.checkIsManager = function(req, res, next) {
    var userId = req.session.userId;

    userDao.queryById(userId, function(data) {
        if (data.type == 1) {
            next();
        } else {
            req.flash('flag', 0);
            req.flash('msg', '只有管理员有权限操作！！！');
            res.redirect('../tips');
        }
    })
}
exports.getAddUserPage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('m_addUser', {
        title: '新增用户',
        type: 1
    })
}
exports.doAddUser = function(req, res, next) {
    var nData = req.body;

    userDao.queryByKey('account', req.body.account, function(data) {
        if (data.id) {
            req.flash('flag', 0);
            req.flash('msg', '账号' + req.body.account + '已存在');
            res.redirect('../tips');
        } else {
            userDao.add(nData, function(ret) {
                if (ret.code == 1) {
                    req.flash('flag', 1);
                    req.flash('msg', ret.msg);
                } else {
                    req.flash('flag', 0);
                    req.flash('msg', ret.msg);
                }
                res.redirect('../tips');
            })
        }
    })
}
exports.getUserListPage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('m_userList', {
        title: '用户列表',
        type: 1
    })
}
exports.getUserListJson = function(req, res, next) {
    var userId = req.session.userId;
    var getType = req.query.type;

    if (getType == '0') {
        userDao.queryAll(function(ret) {
            res.json({
                data: ret
            })
        })
    } else {
        userDao.queryAllByKey('type', getType, function(ret) {
            res.json({
                data: ret
            })
        })
    }
}
exports.deleteUser = function(req, res, next) {
    var deleteId = req.query.id;

    userDao.deleteById(deleteId, function(ret) {
        res.json({
            data: ret
        })
    })

}
exports.getAddCoursePage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('m_addCourse', {
        title: '新增课程',
        type: 1
    })
}
exports.doAddCourse = function(req, res, next) {
    var nData = req.body;

    if (req.body.name) {
        courseDao.add(nData, function(ret) {
            if (ret.code == 1) {
                req.flash('flag', 1);
                req.flash('msg', ret.msg);
            } else {
                req.flash('flag', 0);
                req.flash('msg', ret.msg);
            }
            res.redirect('../tips');
        })
    } else {
        req.flash('flag', 0);
        req.flash('msg', '信息不完整，添加失败');
        res.redirect('../tips');
    }

}
exports.getCourseListPage = function(req, res, next) {
    var userId = req.session.userId;

    res.render('m_courseList', {
        title: '课程列表',
        type: 1
    })
}
exports.getCourseListJson = function(req, res, next) {
    var userId = req.session.userId;
    var getType = req.query.type;

    if (getType == '0') {
        courseDao.queryAll(function(ret) {
            res.json({
                data: ret
            })
        })
    } else {
        courseDao.queryAllByKey('type', getType, function(ret) {
            res.json({
                data: ret
            })
        })
    }
}
exports.deleteCourse = function(req, res, next) {
    var deleteId = req.query.id;

    courseDao.deleteById(deleteId, function(ret) {
        res.json({
            data: ret
        })
    })

}
exports.getStudentListPage = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;

    courseDao.queryById(cid, function(retData) {
        if (retData.id) {
            res.render('m_studentList', {
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

    courseDao.queryById(cid, function(retData) {
        if (retData.id) {
            var studentArr = retData.students.split(',');
            var ep = new EventProxy();
            studentArr.forEach(function(item, index) {
                //分别取每个id的user数据
                userDao.queryById(item, function(data) {
                    ep.emit('get_list', data);
                })
            })
            ep.after('get_list', studentArr.length, function(list) {
                console.log('拉取的学生列表', list);
                res.json({
                    data: list
                })
            })
        } else {
            res.json({
                data: {},
                msg: '错误的cid'
            })
        }
    })
}
exports.addCourseStudent = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;
    var sid = req.query.sid;

    courseDao.queryById(cid, function(retData) {
        if (retData.id) {
            var old_studentArr = retData.students.split(',');
            var add_studentArr = sid.split(',');

            var new_student = arrJoin(old_studentArr, add_studentArr).join(',');

            courseDao.updateById(cid, {
                'students': new_student
            }, function(ret) {
                console.log(ret);
                res.json(ret);
            })
        } else {
            res.json({
                code: 0,
                data: {},
                msg: '错误的cid'
            })
        }
    })

}
exports.deleteCourseStudent = function(req, res, next) {
    var userId = req.session.userId;
    var cid = req.query.cid;
    var sid = req.query.sid;

    courseDao.queryById(cid, function(retData) {
        if (retData.id) {
            var old_studentArr = retData.students.split(',');
            var delete_studentArr = sid.split(',');

            var new_student = arrRemove(old_studentArr,delete_studentArr).join(',');

            courseDao.updateById(cid, {
                'students': new_student
            }, function(ret) {
                console.log(ret);
                res.json(ret);
            })
        } else {
            res.json({
                code: 0,
                data: {},
                msg: '错误的cid'
            })
        }
    })

}
/**
 * 两个数组先合并然后去重
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[type]}      [description]
 */
function arrJoin(arr1, arr2) {
    var ret = arr1;
    for (var i = 0; i < arr2.length; i++) {
        var item = arr2[i]
        if (ret.indexOf(item) === -1) {
            ret.push(item)
        }
    }
    return ret;
}
/**
 * 从arr1数组中去除arr2数组中所含的元素
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[type]}      [description]
 */
function arrRemove(arr1,arr2){
    for (var i = 0; i < arr2.length; i++) {
        var item = arr2[i]
        if (arr1.indexOf(item) > -1) {
            arr1.splice(arr1.indexOf(item),1);
        }
    }
    return arr1;
}
