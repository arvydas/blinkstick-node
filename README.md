![BlinkStick Node](http://www.blinkstick.com/images/logos/blinkstick-nodejs.png)

BlinkStick Node provides an interface to control Blinkstick
devices connected to your computer with Node.js.

What is BlinkStick? It's a smart USB-controlled LED device. More info about it here:

[http://www.blinkstick.com](http://www.blinkstick.com)

## Resources

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
$> sudo apt-get install libusb nodejs npm
```

For the most up to date version of Node.js, use [Node Version Manager](https://github.com/nvm-sh/nvm).

```
$> nvm install --lts
```

#### Raspberry Pi

Install `libudev` and `libusb` development packages:

```
$> sudo apt-get install libusb-1.0-0-dev libudev-dev -y
```

## Install BlinkStick node module

Install using npm:

```
$> npm install blinkstick
```

## Getting started

    var blinkstick = require('blinkstick');

To get the first blinkstick on your system:

    var device = blinkstick.findFirst();

To set the color:

    led.blink('random', function(){
        led.pulse('random', function(){
            led.setColor('red', function(){
            });
        });
    });

More details and examples available in the wiki:

https://github.com/arvydas/blinkstick-node/wiki

## Permission problems

If you get an error message on Linux:

    Error: cannot open device with path /dev/hidraw0

Please run the following command and restart your computer:

    echo "KERNEL==\"hidraw*\", SUBSYSTEM==\"hidraw\", ATTRS{idVendor}==\"20a0\", ATTRS{idProduct}==\"41e5\", MODE=\"0666\"" | sudo tee /etc/udev/rules.d/85-blinkstick-hid.rules

## Maintainers

* Arvydas Juskevicius - [http://twitter.com/arvydev](http://twitter.com/arvydev)
* Paul Cuthbertson - [http://twitter.com/paulcuth](http://twitter.com/paulcuth)

## Copyright and License

Copyright (c) 2014 Agile Innovative Ltd and contributors

Released under MIT license.
