var blinkstick = require('blinkstick');
var device     = blinkstick.findFirst();

// Milliseconds between frames (animation rate) 
// Eg. 16ms is 60fps. 
// 20ms is minimum for BlinkStick.
// Note that even 20ms can be too fast for some brands of LEDs to change colour.
//
var bsync      = 40; 

// Queue of frames for stream producer/consumer pattern
//
var stream = [];


// A frame of 8 LEDS in GRB format (producer)
//
var image = [
        000, 000, 000,
        000, 000, 000,
        000, 000, 000,
        000, 000, 000,
        000, 000, 000,
        000, 008, 000,
        016, 255, 000,
        000, 008, 000
        ];

var phase = 0;
var shift = 0;
var dir   = 1;

function producer(){

        phase +=dir;
        if (phase>=6)
        {
                phase=5;
                dir=-dir;
        }


        if (phase<=0){
                phase=0;
                dir=-dir;
        }


        shift = Math.floor(phase);

        frame = new Array(8*3).fill(0);
        
        for (var i = 0; i< 8; i++) {
                frame[i*3+0] = image[shift*3+0];
                frame[i*3+1] = image[shift*3+1];
                frame[i*3+2] = image[shift*3+2];

                shift+=1;
                if (shift>=8)
                        shift=0;
        }
        
        stream.push(frame);
       
        setTimeout(blink, bsync);
}


function consumer()
{
	if (stream.length)>0)
    device.setColors(0, data, function(err, stream.shift()) {});	
}

if (device){
        setTimeout(producer, bsync);
}

if (device){
    setTimeout(consumer, bsync);
}

