//Utilities for flex stream


var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

var port = process.env.PORT || 5000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });