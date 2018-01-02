//Ambient display based on pro_stream.js example                                                                                                                                                                 
//Minimum Requirements: 
// - Latest version of nodejs (tested with v8.9.3)
// - 4 core 3GHz processor, 8MB ram, and 2MB graphics card
// - Latest blinkstick, screenshot-desktop and sharp npm packages

//Notes:
// - Higher framerates will slow down your entire system, depending on how fast it is.
// - Lower framerates reduce CPU overhead but increase ambient display lag
// - The bottleneck is screenshot-desktop - looking for a faster screen grabber.
// - Sharp package is very fast and used for scaling the screenshot to Nx1 resolution for blinkstick LED strip
// - Test with Ambilight Color Test youtube video (https://www.youtube.com/watch?v=8u4UzzJZAUg) running at FULLSCREEN.
// - Could be improved by morphing between screenshots.

var    os         = require("os");                                                                                                                                                                              
var    blinkstick = require('blinkstick');                                                                                                                                                                      
const  screenshot = require('screenshot-desktop');                                                                                                                                                              
const  sharp      = require('sharp');                                                                                                                                                                           
                                                                                                                                                                                                                
var device     = blinkstick.findFirst();                                                                                                                                                                        

// Change framerate and number of LEDs to match your system specs.
var framerate = 10;                                                                                                                                                                                              
var size      = 8;                                                                                                                                                                                              
                                                                                                                                                                                                                
var stream_buffer = [];                                                                                                                                                                                         
var streaming = true;                                                                                                                                                                                           
                                                                                                                                                                                                                
function producer(){                                                                                                                                                                                            
        if (stream_buffer.length == 0)                                                                                                                                                                          
                onFrame();
        framerate = Math.max(1, Math.min(framerate, 60));
        setTimeout(producer, 1000/framerate);
}

function consumer(){
        if (stream_buffer.length>0 && streaming){
                var rgb = stream_buffer.shift();
                var grb = convert_grb(rgb);
                device.setColors(0, grb, function(err, grb) {});
        }
        framerate = Math.max(1, Math.min(framerate, 60));
        setTimeout(consumer, 1000/framerate);
}

function convert_grb(rgb){
        var grb = [];
        for (var i = 0; i<rgb.length/3; i++) {
                grb[i*3+0] = rgb[i*3+1]; // G
                grb[i*3+1] = rgb[i*3+0]; // R
                grb[i*3+2] = rgb[i*3+2]; // B
        }
 
        return grb;
}

function onFrame(){
        var frame = [];

        screenshot().then((img) => {
              sharp(img).resize(size,1).ignoreAspectRatio().raw().toBuffer().then(data => {
                stream_buffer.push(data);
              })
        });

        return frame;
}


//Clean exit
process.on('SIGTERM', onExit);
process.on('SIGINT', onExit);
function onExit(){
        streaming = false;
        //Turn off LEDs
        var frame = [];
        for (var i = 0; i<size; i++) {
                frame[i*3+0] = 0; // G
                frame[i*3+1] = 0; // R
                frame[i*3+2] = 0; // B
        }
        device.setColors(0, frame, function(err, frame) {process.exit(0);});
}


if (device){
        producer();
        consumer();
}
