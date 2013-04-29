# BlinkStick Node

BlinkStick Node provides an interface to control Blinkstick devices connected to your computer.

What is BlinkStick? It's a DIY USB RGB LED device. More info about it here:

[http://www.blinkstick.com](http://www.blinkstick.com)


##Prerequisites

###Node & npm
Using [Homebrew](http://homebrew.org/):

```
$> brew install node
```

###libusb
Using [Homebrew](http://homebrew.org/):

```
$> brew install libusb
```


##Install
Install using npm:

```
$> npm install blinkstick
```


##API

    var blinkstick = require('blinkstick');

To get the first blinkstick on your system:

    led = new blinkstick.findFirst();

To get all the blinkstick(s) on your system:

    leds = [];
    serials = blinkstick.findAll();
    for (i = 0; i < serials.length; i++) leds.push(blinkstick.findBySerial(serials[i]);

To get the serial number, manufacturer, or description associated with a blinkstick:

    led.getSerial()
    led.getManufacturer()
    led.getDescription()

To set the color:

    // rgb is a '#RRGGBB' string
    // red/green/blue are each numbers in [0..255]
    // function is optional
    led.setColour(rgb, function() { /* called when color is changed */ });
    led.setColour(red, green, blue, function() { /* called when color is changed */ });

    led.setRandomColour();

    led.turnOff();    // i.e., setColour(0, 0, 0)

To get the color:

    led.getColour(function(red, green, blue) { ... });
    led.getColorString(function(rgb) { ... });

##Running the example
Navigate the the example directory, install dependencies and run the server:

```
$> cd node_modules/blinkstick/example
$> npm install
$> node server
```

Then, in a browser, navigate to the url given in the console.


##Maintainers
* Arvydas Juskevicius - [http://twitter.com/arvydev](http://twitter.com/arvydev)
* Paul Cuthbertson - [http://twitter.com/paulcuth](http://twitter.com/paulcuth)