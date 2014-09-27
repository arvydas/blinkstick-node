var blinkstick = require('blinkstick'),
  device = blinkstick.findFirst();

if (device) {
  console.log("Serial:", device.getSerial());
  console.log("Manufacturer:", device.getManufacturer());
}
