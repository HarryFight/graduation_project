var userDao = require('../dao/userDao.js');

exports.checkIsLogin = function(req,res,next){
    var userId = req.session.userId;
    if(userId){
        next();
    }else{
        res.redirect(301,'/login');
    }
}

exports.getMenu = function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId,function(data){
        res.render('menu',{
            title:'菜单',
            type:data.type,
            name:data.name
        });
    })
}
