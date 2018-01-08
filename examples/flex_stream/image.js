//Image display flex_stream.js     
//User defined OnFrame() converts images, and morphs scaled frames to BlinkStick
//Minimum Requirements: 
//- Latest version of nodejs (tested with v8.9.3)
//- Latest blinkstick, sharp npm packages (all cross-platform)
//For Windows, Linux and Mac

module.exports = {
		init: function(filename) {
			init(filename); 
		}
}

const  flex_stream = require("./flex_stream.js");                                                                                                                                                                                                                                                                                                         
const  sharp       = require('sharp');              //Available at npmjs.com                                                                                                                                             
var    frame       = null;

//Stream scaled desktop (size x 1) to BlinkStick via async futures pipeline
function image(){
	screenshot().then((img) => {
		sharp(img).resize(flex_stream.getSize(),1).ignoreAspectRatio().raw().toBuffer().then(data => {
			flex_stream.produceFrame(frame);
		})
	});
}

//Configure stream

function init(filename){

	flex_stream.setSize(8);
	flex_stream.setProducerFramerate(10);
	flex_stream.setConsumerFramerate(60);
	flex_stream.setAlpha(1);

	sharp(filename).resize(flex_stream.getSize(),1).ignoreAspectRatio().raw().toBuffer().then(data => {
		frame = data;
		flex_stream.setOnFrame(image);
	});


}

console.log("ARGV[0]: = "+process.argv[0]);


