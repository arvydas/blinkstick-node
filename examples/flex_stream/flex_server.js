var express = require('express')
var app = express()


app.get('/', function (req, res) {
	res.send("onFrame is set to " + req.query.onFrame);
})

var port = process.env.PORT || 5000;
 app.listen(port, function() {
 });