var blinkstick = require('../../blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  var finished = false;

  console.log('Device found!');
  device.getDescription(function(error, result) {
    console.log('Description:  ' + result);

    device.getManufacturer(function(error, result) {
      console.log('Manufacturer: ' + result);

      device.getSerial(function(error, result) {
        console.log('Serial:       ' + result);

        device.getMode(function(error, result) {
          console.log('Mode:         ' + result);

          device.getColorString(function(error, result) {
            console.log('Color:        ' + result);
            finished = true;
          });
        });
      });
    });
  });

  var wait = function() {
    if (!finished) setTimeout(wait, 100);
  };
  wait();
}
