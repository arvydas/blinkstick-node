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

## Maintainers

* Arvydas Juskevicius - [http://twitter.com/arvydev](http://twitter.com/arvydev)
* Paul Cuthbertson - [http://twitter.com/paulcuth](http://twitter.com/paulcuth)
