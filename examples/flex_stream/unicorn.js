//Aurora Borealis ambience based on flex_stream.js
//For Windows, Linux and Mac

const os          = require("os");
const flex_stream = require("./flex_stream.js");

var size               = 8;     // Default 8, maximum 64 (single BlickStick channel)
var producer_framerate = 1;     // slow 
var consumer_framerate = 60;    // High fps for morphing   
var alpha              = 0.01;  // slow
var frame              = flex_stream.newFrame();

function onFrame() {       

    // Unicorn rainbow barf
	for (i=0; i<size; i++)
	{   
		//Normalize all pixel brightness to 128
		var r = Math.random()*128;
		var g = r+(Math.random()*(128-r));
		var b = 128-g;
		//Borealis
		if (Math.random()>.9)
		{
			r=0; g=0; b=0;
		}
		frame[i*3+0] = Math.floor(r);  //R
		frame[i*3+1] = Math.floor(g);  //G
		frame[i*3+2] = Math.floor(b);  //B
	}

	flex_stream.produceFrame(frame);     
}

//Configure stream
flex_stream.setSize(size);
flex_stream.setProducerFramerate(producer_framerate);
flex_stream.setConsumerFramerate(consumer_framerate);
flex_stream.setAlpha(alpha);
flex_stream.setOnFrame(onFrame);
