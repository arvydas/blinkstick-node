var blinkstick = require('blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  device.pulse("red", function () {
    device.pulse("green", function () {
      device.pulse("blue", function () {
      });
    });
  });
}
