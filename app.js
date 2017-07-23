var express = require('express');
var app = express();
var bodyParse = require('body-parser');
var config = require('./config');

var port = process.env.PORT || 3000;

var db = require('./db');

app.set('views', __dirname + '/views');
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));
app.use(require('./controllers'));

db.connect(config.db);

app.listen(port, function() {
	console.log('listen to port:' + port);
});

