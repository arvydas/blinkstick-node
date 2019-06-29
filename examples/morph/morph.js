var blinkstick = require('../../blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  var finished = false;

  device.morph('red', function() {
    device.morph('green', function() {
      device.morph('blue', function() {
        finished = true;
      });
    });
  });

  var wait = function() {
    if (!finished) setTimeout(wait, 100);
  };
  wait();
}
