//Aurora Borealis ambience based on flex_stream.js
//For Windows, Linux and Mac

module.exports = {
		init: function() {
			init(); 
		}
}

const os          = require("os");
const flex_stream = require("./flex_stream.js");

var size               = 8;     // Default 8, maximum 64 (single BlickStick channel)
var producer_framerate = 4;     // slow 
var consumer_framerate = 60;    // High fps for morphing   
var alpha              = 0.05;  // slow

function unicorn() {       
	// Unicorn rainbow happy joy 
	var off = 0;
	var amp = 150;
	var frame = flex_stream.newFrame();

	for (i=0; i<flex_stream.getSize(); i++)
	{   
		var r = Math.random()*amp+off;
		var g = Math.random()*amp+off;
		var b = Math.random()*amp+off;

		frame[i*3+0] = Math.floor(r);  //R
		frame[i*3+1] = Math.floor(g);  //G
		frame[i*3+2] = Math.floor(b);  //B
	}
	flex_stream.produceFrame(frame);     
}

//Configure stream

function init(){
	flex_stream.setSize(8);
	flex_stream.setProducerFramerate(4);
	flex_stream.setConsumerFramerate(60);
	flex_stream.setAlpha(1);
	flex_stream.setOnFrame(unicorn);
}

init();
