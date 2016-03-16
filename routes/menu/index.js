var express = require('express');
var router = express.Router();
var userDao = require('../../dao/userDao.js');

//menu路由系统
function checkIsLogin(req,res,next){
    var userId = req.session.userId;
    if(userId){
        next();
    }else{
        res.redirect(301,'./login');
    }
}


router.get('/',checkIsLogin);
router.get('/',function(req,res,next){
    var userId = req.session.userId;

    userDao.queryById(userId,function(data){
        res.render('menu',{
            title:'菜单',
            type:data.type,
            name:data.name
        });
    })
})



module.exports = router;
