//Aurora Borealis ambience based on flex_stream.js
//For Windows, Linux and Mac

const os          = require("os");
const flex_stream = require("./flex_stream.js");

var size               = 8;   // Default 8, maximum 64 (single BlickStick channel)
var producer_framerate = 30;  // Varies 
var consumer_framerate = 60;  // High fps for morphing   
var alpha              = 0;   // Varies

function onFrame() {       
	var frame = flex_stream.newFrame();

	//Aurora
	a = Math.random();
	flex_stream.setProducerFramerate(a*2+1);
	flex_stream.setAlpha(.001+(a/100));

	for (i=0; i<size; i++)
	{       
		//Borealis
		if (Math.random()>.25)
		{
			var r = Math.random()*192;
			var g = (1-Math.random()*.85)*255;
			var b = (1-Math.random()*.85)*255;
			frame[i*3+0] = Math.floor(r);  //R
			frame[i*3+1] = Math.floor(g);  //G
			frame[i*3+2] = Math.floor(b);  //B
		}
	}
	flex_stream.produceFrame(frame);     
}

//Configure stream
flex_stream.setSize(size);
flex_stream.setProducerFramerate(producer_framerate);
flex_stream.setConsumerFramerate(consumer_framerate);
flex_stream.setAlpha(alpha);
flex_stream.setOnFrame(onFrame);
