### 通过express实现一个简单的MVC框架

这段时间一直研究express的源码,有点看不下去了,索性就写一个用express实现MVC框架
的例子.

##### MVC框架介绍:
这里大多是摘抄的,别介意哈

This pattern is great for separating the responsibility of the different parts of app and makes your code easier to maintain

* M is for model. A place to define data structures and methods to interact with your data store.
* V is for view. A place to manage everything the end user sees on his or her screen.
* C is for controller. A place to take user requests, bring data from the model and pass it back to the view.

Model是定义数据结构和方法,并且和数据库进行交互; View是用数据渲染用户看到的视图; Controller是处理用户请求,从model中拿到数据给到

view.

#### 不bb了,上代码喽

app.js是应用程序的起点,以下是app.js

```js
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

```

* 24行的通过require('express')获取的`express`实际上是个工厂函数,用于生产应用程序

* 25行通过app()调用获取了一个应用程序

* 26,27行分别引入依赖和外部文件

* 29,31行分别定义端口和引入外部文件

* 33行告诉express我们这次把模板放到`views`目录下面

* 34行

* 35行告诉express我们这次使用的jade模板

* 37行是express托管静态文件,只要请求路径为`\public`的,就进'public'文件夹

* 38,39行是把请求参数解析到`req.body`属性上,

* 40行是加载`controllers`文件夹,实际引入的是`controllers`下的`index.js`file

	This is the folder where you will be defining all the routes that your app will serve. Your controllers will handle web requests, serve your templates to the user and interact with your models to process and retrieve data. It’s the glue which connects and controls your web app.

	以上是介绍`controllers`文件夹的,总结起来:在`controllers`中定义router(路由)

   只要服务器启动，路由中有`comments`,就走`comments`的处理逻辑,其他依然.

* 42行是连接数据库,一旦连接在应用中获取`mongoose`后,都能获取连接信息.

* 44行监听特定端口,但是要大于`1024`,

下面是`controller`代码

```js

var express = require('express');
var router = express.Router();

router.use('/comments', require('./comments'));
router.use('/users', require('./users'));

router.get('/', function(req, res){
	res.render('index');
});

module.exports = router;

```
* 69行:通过`express.Router()`创建一个路由器对象,可以看作一个独立的mini app，它也可以调用use方法加入中间件，但只作用于自身。

* 87,88,89行:相应的路由,走相应的处理逻辑.

以请求路径为`/comments/all`为例:
1. 在index中匹配到`router.use('/comments', require('./comments'));`

2. 而在'comments'file中匹配到下面的路由,从而调用下面的逻辑.

```js
router.get('/all', function(req, res){
	Comment.userList(function(err, docs) {
		res.render('comments', {comments: docs});
	});	
});

```
而数据的获取怎么少得了`model`层呢,下面是`model`层的代码

```js
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CommentSchema = schema({
	name: {type:String, required:true},
	remark: { type:String }
});

CommentSchema.statics.userList = function(cb) {
	Comment.find().limit(20).exec(function(err, users) {
		if (err) return cb(err);
		return cb(null, users);
	})
}

var Comment = module.exports = mongoose.model('comment', CommentSchema);

```
model层定义数据结构和方法,并且把方法暴露出去,方便调用,比较简单.

controller层获取数据后,调用`res.render('comments', {comments: docs});`进行渲染数据

返回给客户端，完成整个请求。




https://stackoverflow.com/questions/22954561/app-set-and-app-engine-in-express






