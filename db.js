var mongoose = require('mongoose');

exports.connect = function(url, cb) {
	mongoose.connect(url, function(err) {
		if (err) {
			console.log(err);
			process.exit(1);
		}
	});
}