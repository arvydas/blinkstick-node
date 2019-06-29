var blinkstick = require('../../blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  var finished = false;
  device.setInverse(true);

  device.setColor('blue', function() {
    finished = true;
  });

  var wait = function() {
    if (!finished) setTimeout(wait, 100);
  };
  wait();
}
