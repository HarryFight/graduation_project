var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect(301, 'login');
});

router.use('/login',require('./login.js'))

router.use('/menu', require('./menu'));

module.exports = router;
