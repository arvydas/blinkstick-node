var blinkstick = require('blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  device.morph('red', function () {
    device.morph('green', function () {
      device.morph('blue', function () {
      });
    });
  });
}
