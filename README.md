# BlinkStick Node

BlinkStick Node provides an interface to control Blinkstick
devices connected to your computer with Node.js.

What is BlinkStick? It's a smart USB-controlled smart LED device. More info about it here:

[http://www.blinkstick.com](http://www.blinkstick.com)

## Resouces

* [Code repository on GitHub](https://github.com/arvydas/blinkstick-node)
* [API reference documentation](https://arvydas.github.io/blinkstick-node)
* [Code Examples](https://github.com/arvydas/blinkstick-node/wiki)

## Requirements

* Node.js
* Libusb for Mac OSX and Linux

### Requirements for Mac OSX

Install Node with npm and libusb using [homebrew](http://mxcl.github.io/homebrew/):

```
$> brew install node
$> brew install libusb
```

### Requirements for Windows

Install [Node for Windows](http://nodejs.org/download/) and make sure it's added
to your PATH environment variable.

### Requirements for Linux

```
$> sudo apt-get install libusb
```

## Install BlinkStick node module

Install using npm:

```
$> npm install blinkstick
```

## API

    var blinkstick = require('blinkstick');

To get the first blinkstick on your system:

    var device = blinkstick.findFirst();

To get all the serial numbers for BlinkStick(s) on your system:

    blinkstick.findAllSerials(function(serials) {
        console.log(serials);
    });

To get all the blinkstick(s) on your system:

    var leds = blinkstick.findAll();

To get the serial number, manufacturer, or description associated with a BlinkStick:

    led.getSerial(function(err, data) {
        console.log(data);
    });

    led.getManufacturer(function(err, data) {
        console.log(data);
    });

    led.getDescription(function(err, data) {
        console.log(data);
    });

To set the color:

    // rgb is a '#RRGGBB' string
    // red/green/blue are each numbers in [0..255]
    // function is optional

    led.setColor(rgb, function() { /* called when color is changed */ });
    led.setColor(red, green, blue, function() { /* called when color is changed */ });

    led.setColor('random', function() { /* called when color is changed */ });

    led.turnOff();    // i.e., setColor(0, 0, 0)

To set the color for BlinkStick Pro:
    // All functions above work with additional options object

    //Set random color for 4th LED on R channel 
    led.setColor('random', { 'channel': 0, 'index': 4 }, function() { /* called when color is changed */ });

To get the color:

    led.getColor(function(red, green, blue) { ... });
    led.getColorString(function(rgb) { ... });

Blink, pulse and morph:

    //All color parameters and options work on these functions too
    led.pulse(rgb, function() { /* called when color animation is complete */ });
    led.blink(rgb, function() { /* called when color animation is complete */ });
    led.morph(rgb, function() { /* called when color animation is complete */ });


## Running examples

Navigate the the example directory, install dependencies and run the server:

```
$> cd node_modules/blinkstick/examples/picker
$> npm install
$> node server
```

Then, in a browser, navigate to the url given in the console.

Other examples require simply running:

```
$> node node_modules/blinkstick/examples/example_name/example.js
```


## Maintainers

* Arvydas Juskevicius - [http://twitter.com/arvydev](http://twitter.com/arvydev)
* Paul Cuthbertson - [http://twitter.com/paulcuth](http://twitter.com/paulcuth)
