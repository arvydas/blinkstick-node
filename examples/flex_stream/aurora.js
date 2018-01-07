//Aurora Borealis ambience based on flex_stream.js
//For Windows, Linux and Mac

module.exports = {
		init: function() {
			init(); 
		}
}

const os          = require("os");
const flex_stream = require("./flex_stream.js");

	
var frame = flex_stream.newFrame();
function aurora() {       
	//Aurora
	a = Math.random();
	flex_stream.setProducerFramerate(a*2+1);
	flex_stream.setAlpha(.001+(a/100));

	for (i=0; i<flex_stream.getSize(); i++)
	{    			
		var r = Math.random()*50;
		var g = (1-Math.random()*.85)*50;
		var b = (1-Math.random()*.85)*100;   
		//Borealis
		if (Math.random()>.5)
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

function init(){
	flex_stream.setSize(8);
	flex_stream.setProducerFramerate(30);
	flex_stream.setConsumerFramerate(60);
	flex_stream.setAlpha(0.01);
	flex_stream.setOnFrame(aurora);
}

init();

