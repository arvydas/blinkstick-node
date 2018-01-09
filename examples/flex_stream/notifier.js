//Image Notifiers     
//User defined OnFrame() converts images, and morphs scaled frames to BlinkStick
//Minimum Requirements: 
//- Latest version of nodejs (tested with v8.9.3)
//- Latest blinkstick, sharp npm packages (all cross-platform)
//For Windows, Linux and Mac

module.exports = {
		init: function(filename, sec) {
			init(filename, sec); 
		}
}

const  flex_stream = require("./flex_stream.js");                                                                                                                                                                                                                                                                                                         
const  sharp       = require('sharp');              //Available at npmjs.com                                                                                                                                             
var    frame       = null;
var    notifying   = false;
var    num_frames  = 0; //Default static image.

//Stream scaled image (W x H) to BlinkStick via async futures pipeline
function notifier(){
	if (num_frames-- > 0)
	{
		flex_stream.setAlpha(.2);	
		flex_stream.produceFrame(frame);
	}
	else
	{
		flex_stream.restoreOnFrame();
		notifying = false;
	}
}

//Configure stream

function init(filename, sec){

	if (sec >= 0)
		num_frames = sec*60;

	if(!notifying){ 
		notifying = true;
		flex_stream.saveOnFrame();
	}

	sharp(filename).resize(flex_stream.getWidth(),flex_stream.getHeight()).ignoreAspectRatio().raw().toBuffer().then(data => {
		frame = data;
		flex_stream.setSize(8,1);
		flex_stream.setProducerFramerate(60);
		flex_stream.setConsumerFramerate(60);
		flex_stream.setOnFrame(notifier);
	});
}

//Run from command line
if (!module.parent)
	init(process.argv[2], process.argv[3]);


