var blinkstick = require('blinkstick'),
    device = blinkstick.findFirst();

if (device) {
    var finished = false;

    var data = [
        0, 255, 0,
        255, 0, 0,
        128, 128, 0,
        0, 0, 255,
        0, 255, 255,
        0, 255, 0,
        255, 0, 0,
        128, 128, 0,
    ];

    device.setColors(0, data, function(err, data) {
        finished = true;
    });

    var wait = function () { if (!finished) setTimeout(wait, 100)}
    wait();
}

