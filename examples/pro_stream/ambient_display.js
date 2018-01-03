//Ambient display (ambilight) based on pro_stream.js     
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
// - Could be improved by morphing between screenshots, and predictive look-ahead .
// - Ideally, blinkstick display drivers could be created so it could be treated as just another monitor.

var    pro_stream = require("./pro_stream.js");                                                                                                                                                                     
const  screenshot = require('screenshot-desktop');                                                                                                                                                              
const  sharp      = require('sharp');                                                                                                                                                                         

var size = 8;
var producer_framerate = 15;
var consumer_framerate = 15;

function onFrame(){
        screenshot().then((img) => {
              sharp(img).resize(size,1).ignoreAspectRatio().raw().toBuffer().then(data => {
                pro_stream.produceFrame(data);
              })
        });
}

//Configure stream
pro_stream.setSize(size);
pro_stream.setProducerFramerate(producer_framerate);
pro_stream.setConsumerFramerate(consumer_framerate);
pro_stream.setOnFrame(onFrame);
