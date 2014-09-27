var blinkstick = require('blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  device.getDescription(function(error, result) {
    console.log("Description: " + result);

    device.getManufacturer(function(error, result) {
      console.log("Manufacturer: " + result);

      device.getSerial(function(error, result) {
        console.log("Serial: " + result);
        console.log("Requires software color patch: " + device.requiresSoftwareColorPatch);
      });
    });
  });
}
