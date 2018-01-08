//Fireplace ambience based on flex_stream.js
//For Windows, Linux and Mac

const os          = require("os");
const flex_stream = require("./flex_stream.js");

module.exports = {
		init: function() {
			init(); 
		}
}

var frame = flex_stream.newFrame();

function fireplace() {   

	for (i=0; i<flex_stream.getSize(); i++)
	{
		if (Math.random()<.5)
		{
			//Red to yellow spectrum
			var r = Math.random()*230+25;
			var g = r*Math.random()*.75;
			frame[i*3+0] = Math.floor(r);  //R
			frame[i*3+1] = Math.floor(g);  //G
			frame[i*3+2] = 0;              //B
		}


	}
	//Flickering flames
	f = Math.random();
	flex_stream.setProducerFramerate(f*10+2);
	flex_stream.setAlpha(.05+(f/20));
	flex_stream.produceFrame(frame);     
}

//Configure stream

function init(){
	flex_stream.setSize(8,1);
	flex_stream.setProducerFramerate(15);
	flex_stream.setConsumerFramerate(60);
	flex_stream.setOnFrame(fireplace);
}

init();
