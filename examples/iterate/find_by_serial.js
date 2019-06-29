var blinkstick = require('../../blinkstick');

blinkstick.findBySerial('BS000000-1.0', function(bstick) {
  if (bstick) {
    console.log('BlinkStick found!');
  } else {
    console.log('BlinkStick not found...');
  }
});
