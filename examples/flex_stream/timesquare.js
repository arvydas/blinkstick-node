//Times Square ambience based on flex_stream.js
//For Windows, Linux and Mac

module.exports = {
		init: function() {
			init(); 
		}
}

const os          = require("os");
const flex_stream = require("./flex_stream.js");

var frame = flex_stream.newFrame();

function timesquare() {       
	// Scrolling ticker tape
	var off = 0;
	var amp = 150;
	var r = Math.random()*amp+off;
	var g = Math.random()*amp+off;
	var b = Math.random()*amp+off;

	if(frame !=null){
		frame.shift();
		frame.push(Math.floor(r));  //R
		frame.push(Math.floor(g));  //G
		frame.push(Math.floor(b));  //B
	}

	flex_stream.produceFrame(frame);     
}

//Configure stream

function init(){
	flex_stream.setSize(8);
	flex_stream.setProducerFramerate(4);
	flex_stream.setConsumerFramerate(60);
	flex_stream.setAlpha(0.05);
	flex_stream.setOnFrame(timesquare);
}

init();
