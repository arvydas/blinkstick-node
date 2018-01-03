//Ambient display (ambilight) based on flex_stream.js     
//Realtime streaming of desktop to blinkstick.
//User defined OnFrame() creates jpegs of the desktop, scales, and sends frame to stream
//Windows, Linux and Mac

//Minimum Requirements: 
// - Latest version of nodejs (tested with v8.9.3)
// - 4 core 3GHz processor, 8MB ram, and 2MB graphics card
// - Latest blinkstick, screenshot-desktop and sharp npm packages (these all work with Windows, Linux and Mac)

//Notes:
// - Higher framerates will slow down your entire system, depending on how fast it is.
// - Lower framerates reduce CPU overhead but increase ambient display lag
// - The bottleneck is screenshot-desktop - looking for a faster cross-platform screen grabber (gstreamer?)
// - Sharp package is very fast and used for scaling the screenshot to Nx1 resolution for blinkstick LED strip
// - Test with Ambilight Color Test youtube video (https://www.youtube.com/watch?v=8u4UzzJZAUg) running at FULLSCREEN.
// - Ideally, blinkstick display drivers could be created so it could be treated as just another monitor.

var    flex_stream = require("./flex_stream.js");                                                                                                                                                                     
const  screenshot = require('screenshot-desktop'); //Available at npm.org                                                                                                                                       
const  sharp      = require('sharp');              //Available at npm.org                                                                                                                                             

var size               = 8;
var producer_framerate = 5;   // low capture rate to reduce CPU overhead (5 fps = 200ms lag)
var consumer_framerate = 60;  // high render rate for smooth interlacing
var transparency       = 0.95 // 95% transparency for smooth interlacing

function onFrame(){
        screenshot().then((img) => {
              sharp(img).resize(size,1).ignoreAspectRatio().raw().toBuffer().then(data => {
                flex_stream.produceFrame(data);
              })
        });
}

//Configure stream
flex_stream.setSize(size);
flex_stream.setProducerFramerate(producer_framerate);
flex_stream.setConsumerFramerate(consumer_framerate);
flex_stream.setTransparency(transparency);
flex_stream.setOnFrame(onFrame);
