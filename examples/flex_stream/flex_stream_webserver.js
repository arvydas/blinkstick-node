//Very simple server to switch between examples
//eg. http://localhost:5000/?example=ambilight
//Default is the flex stream signature

const express     = require('express');
var   path        = require('path');
const flex_stream = require("./flex_stream.js");
const ambilight   = require("./ambilight.js");
const unicorn     = require("./unicorn.js");
const fireplace   = require("./fireplace.js");
const aurora      = require("./aurora.js");
const timesquare  = require("./timesquare.js");
const cpu_meter   = require("./cpu_meter.js"); //This starts first

var app = express()


app.get('/', function (req, res) {
	var example = req.query.example;

	var filename = "/flex_stream_webserver.html";

	switch(example) {
	case "cpu_meter":
		cpu_meter.init();
		break;
	case "aurora":
		aurora.init();
		break;
	case "unicorn":
		unicorn.init();
		break;
	case "fireplace":
		fireplace.init();
		break;
	case "ambilight":
		ambilight.init();
		break;
	case "timesquare":
		timesquare.init();
		break;
	default:
		flex_stream.init();
	example = "default"
	}

	res.sendfile(path.join(__dirname + filename));
})

app.get('/favicon.ico', function (req, res) {
	res.sendfile(path.join(__dirname + '/favicon.ico'));
})

var port = process.env.PORT || 5000;

app.listen(port, function() {
});
