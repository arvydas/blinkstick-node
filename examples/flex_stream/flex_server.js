var express = require('express')
var app = express()


app.get('/p/:onFrame', function (req, res) {
	res.send("onFrame is set to " + req.params.onFrame);
})

var port = process.env.PORT || 5000;
 app.listen(port, function() {
 });