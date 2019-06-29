var blinkstick = require('../../blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  var finished = false;

  device.getColors(64, function(err, data) {
    console.log(data);
    finished = true;
  });

  var wait = function() {
    if (!finished) setTimeout(wait, 100);
  };
  wait();
}
