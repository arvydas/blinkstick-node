//Ambient display (ambilight) based on flex_stream.js     
//Real-time streaming of desktop to BlinkStick Flex and Pro
//User defined OnFrame() samples the desktop, and morphs scaled frames to BlinkStick
//Minimum Requirements: 
//- Latest version of nodejs (tested with v8.9.3)
//- Latest blinkstick, screenshot-desktop and sharp npm packages (all cross-platform)
//For Windows, Linux and Mac

module.exports = {
		init: function() {
			init(); 
		}
}

const  flex_stream = require("./flex_stream.js");                                                                                                                                                                     
const  screenshot  = require('screenshot-desktop'); //Available at npmjs.com                                                                                                                                       
const  sharp       = require('sharp');              //Available at npmjs.com                                                                                                                                             


//Stream scaled desktop (size x 1) to BlinkStick via async futures pipeline
function ambilight(){
	screenshot().then((img) => {
		sharp(img).resize(flex_stream.getSize(),1).ignoreAspectRatio().raw().toBuffer().then(data => {
			flex_stream.produceFrame(data);
		})
	});
}

//Configure stream

function init(){
	flex_stream.stop();
	flex_stream.setSize(8);
	flex_stream.setProducerFramerate(5);
	flex_stream.setConsumerFramerate(60);
	flex_stream.setAlpha(0.1);
	flex_stream.setOnFrame(ambilight);
	flex_stream.start();
}

init();
