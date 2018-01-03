//Ambient display (ambilight) based on flex_stream.js     
//Realtime streaming of desktop to BlinkStick Flex and Pro
//User defined OnFrame() samples the desktop, and renders interlaced frames to BlinkStick
//Windows, Linux and Mac

//Minimum Requirements: 
// - Latest version of nodejs (tested with v8.9.3)
// - 4 core 3GHz processor, 8MB ram, and 2MB graphics card
// - Latest blinkstick, screenshot-desktop and sharp npm packages (all cross-platform)


var    flex_stream = require("./flex_stream.js");                                                                                                                                                                     
const  screenshot = require('screenshot-desktop'); //Available at npm.org                                                                                                                                       
const  sharp      = require('sharp');              //Available at npm.org                                                                                                                                             

var size               = 8;   // Default 8, maximum 64 (single channel)
var producer_framerate = 5;   // Low capture rate (5 fps = 200ms lag) to reduce CPU overhead 
var consumer_framerate = 60;  // High render rate for smooth interlacing
var transparency       = 0.85 // 85% transparency for smooth interlacing

//Send desktop to BlinkStick
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
