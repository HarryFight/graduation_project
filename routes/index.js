var express = require('express');
var router = express.Router();

//登录页跳转
router.get('/', function(req, res, next) {
    res.redirect(301, 'login');
});


router.use('/login',require('./login.js'))

router.use('/menu', require('./menu'));

//接口路由

module.exports = router;
