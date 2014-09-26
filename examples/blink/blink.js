var blinkstick = require('blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  /*
  device.blink(255, 0, 0, function () {
    device.blink(0, 255, 0, function () {
      device.blink(0, 0, 255);
    });
  });
  */

  /*
  device.blink('#ff0000', {'delay':100, 'repeats': 5}, function() {
    device.blink('#00ff00', {'delay':50, 'repeats': 10}, function() {
    });
  });
  */

  device.blink('red', {'delay':100, 'repeats': 5}, function() {
    device.blink('green', {'delay':50, 'repeats': 10}, function() {
      device.blink('blue', {'delay':25, 'repeats': 20}, function() {
      });
    });
  });

  /*
  device.blink(255, 0, 0, {'delay':100, 'repeats': 5}, function() {
    device.blink(0, 255, 0, {'delay':50, 'repeats': 10}, function() {
    });
  });
  */

}
