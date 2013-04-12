var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server),

	port = process.env.PORT || 3000,

	blinkstick = require('../blinkstick.js'),
    colour = '#000000',
	device = blinkstick.findFirst();


if (!device) throw new Error('No BlinkStick device found');


// Init web server	
app.use (express.static (__dirname + '/public'));
server.listen(port);


// Init WebSockets
io.sockets.on('connection', function (socket) {
	socket.emit('colour', colour);

	socket.on('colour', function (data) {
		colour = data.hex;
		device.setColour(colour);
	});
});


// Init device
device.getColourString(function (hex) {
	colour = hex;
});

process.on('exit', function () {
	device.turnOff();
});


console.log ('Server running at http://localhost:' + port);
