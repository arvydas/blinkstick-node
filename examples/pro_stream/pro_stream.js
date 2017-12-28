//Stream producer-consumer pattern than allows separation of concerns for BlinkStick frame streaming.
//Producer pushes frames to the stream as simple RGB arrays at a variable frame rate.
//Consumer pulls frames from the stream and sends them to BlickStick at the same rate.
//This is elastic and very efficient, requiring negligible CPU for the node process. 


var blinkstick = require('blinkstick');
var device     = blinkstick.findFirst();

//Variable frame rate in frames per second (fps)
//BlinkStick can handle maximum 60fps
var framerate = 60;

//Stream buffer for frames
var stream_buffer = [];

//This provides some elasticity to avoid skipped frames.
var MAX_BUFFER_LENGTH = 60;

//Stream Producer 
function producer(){

	if (stream_buffer.length<MAX_BUFFER_LENGTH)
		stream_buffer.push(onFrame());

	framerate = Math.max(1, Math.min(framerate, 60));
	setTimeout(producer, 1000/framerate);
}

//Stream Consumer
function consumer()
{
	if (stream_buffer.length>0)
	{
		var next = stream_buffer.shift();
		device.setColors(0, next, function(err, next) {});
	}
	
	framerate = Math.max(1, Math.min(framerate, 60));
	setTimeout(consumer, 1000/framerate);
}

//Start streaming
if (device){
	producer();
	consumer();
}



//User defined frame generator.
//Returns the next frame.
//Called by the producer.
//Pixel source can be anything (eg. a running screenshot scaled to 8x1 resolution for ambient display applications)
//This example is an animation that shifts an image of an eye back and forth.

function onFrame()
{       
	var frame = [];
	framerate = 15;  // 15fps (can be varied by this function but clamped between 1 and 60 in the stream)

	if (phase<0 || phase>5)
		speed=-speed;

	phase += speed;
	shift = Math.floor(phase);

	for (var i = 0; i<size; i++) {
		//Convert to BlinkStick RGB format (GRB)
		frame[i*3+1] = pixels[shift*3+0]; // R
		frame[i*3+0] = pixels[shift*3+1]; // G
		frame[i*3+2] = pixels[shift*3+2]; // B

		if (shift<size)
			shift+=1;
	}
	return frame;
}

//Pixel source (this one is Knight Rider, or a Cylon)
var pixels = [
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	008, 000, 000, //Iris
	128, 016, 000, //Pupil
	008, 000, 000  //Iris
	];

//Animation variables
var phase = 0;
var shift = 0;
var speed = 1;
var size  = pixels.length/3;
