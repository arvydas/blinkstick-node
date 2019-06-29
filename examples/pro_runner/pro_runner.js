var blinkstick = require('../../blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  var finished = false;
  var ledCount = 7;
  var index = 0;

  var setColor = function() {
    console.log(index);
    device.setColor('random', { channel: 0, index: index }, function() {
      if (index == ledCount) {
        finished = true;
      } else {
        index += 1;
        setTimeout(setColor, 200);
      }
    });
  };

  //You need to set mode only once. Run the code below if you haven't already set
  //BlinkStick Pro to mode 2
  /*
    device.setMode(2, function() {
        setColor();
    });
    */

  setColor();

  var wait = function() {
    if (!finished) setTimeout(wait, 100);
  };
  wait();
}
