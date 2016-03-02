var express = require('express');
var router = express.Router();

//menu路由系统
router.get('/',function(req,res,next){
    res.send('这是菜单页');
    res.end();
})
router.get('/b',function(req,res,next){
    res.send('这是b页');
    res.end();
})

module.exports = router;
