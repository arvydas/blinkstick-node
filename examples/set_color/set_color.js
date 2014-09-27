var blinkstick = require('blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  device.setColor("#ff0000");

  setTimeout(function() {
    device.setColor("#00ff00");
      setTimeout(function() {
        device.setColor("#0000ff");
        setTimeout(function() {
          device.setColor("#000000");
        }, 500);
      }, 500);
  }, 500);
}
