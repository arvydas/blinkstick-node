var blinkstick = require('../../blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  var finished = false;

  device.pulse('red', function() {
    device.pulse('green', function() {
      device.pulse('blue', function() {
        finished = true;
      });
    });
  });

  var wait = function() {
    if (!finished) setTimeout(wait, 100);
  };
  wait();
}
