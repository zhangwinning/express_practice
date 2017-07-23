var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');

router.get('/all', function(req, res){
	Comment.userList(function(err, docs) {
		res.render('comments', {comments: docs});
	});	
});

router.get('/recent', function(req, res) {
	Comment.recent(function(err, docs) {
		res.render('comments', {comments: docs});
	});
});

module.exports = router;