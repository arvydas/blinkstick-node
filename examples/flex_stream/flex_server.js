//Very simple server to switch between examples
// http://localhost:5000/?example=name
const flex_stream = require("./flex_stream.js");
const ambilight   = require("./ambilight.js");
const unicorn     = require("./unicorn.js");
const fireplace   = require("./fireplace.js");
const aurora      = require("./aurora.js");
const cpu_meter   = require("./cpu_meter.js");
const express     = require('express');

var app = express()

app.get('/', function (req, res) {
	var onFrame = req.query.example;

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
	default:
		flex_stream.setOnFrame(flex_stream.signature);
	example = "default"
	}

	res.send("Example is set to " + example);
})

var port = process.env.PORT || 5000;
app.listen(port, function() {
});