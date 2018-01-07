//Utilities for flex stream

module.exports = {
		setOnFrame: function(fn) {
			setOnFrame(fn); 
		}
}

var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})
