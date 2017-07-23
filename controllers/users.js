var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/signup', function(req, res) {
	var user = {};
	var username = req.body.username;
	var password = req.body.password;
	user['name'] = username;
	user['password'] = password;
	User.userSave(user, function(err, doc) {
		var show = err ? 'save fail' : 'save success'
		res.render('user', {'show': show});
	});
});


module.exports = router;