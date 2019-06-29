var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  port = process.env.PORT || 3000,
  blinkstick = require('../../blinkstick'),
  color = '#000000',
  device = blinkstick.findFirst();

if (!device) throw new Error('No BlinkStick device found');

// Init web server
app.use(express.static(__dirname + '/public'));
server.listen(port);

// Init WebSockets
io.sockets.on('connection', function(socket) {
  socket.emit('color', color);

  socket.on('color', function(data) {
    color = data.hex;
    device.setColor(color);
  });
});

// Init device
device.getColorString(function(hex) {
  color = hex;
});

process.on('exit', function() {
  device.turnOff();
});

console.log('Server running at http://localhost:' + port);
