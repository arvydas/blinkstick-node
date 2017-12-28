//Stream producer-consumer pattern allows separation of concerns for BlinkStick animations.
//Producer pushes frames to the stream as simple RGB arrays at a fixed rate.
//Consumer pulls frames from the stream and sends them to BlickStick at the same rate.
//This is elastic and very efficient, requiring negligible CPU for the node process. 
//TODO: Johnny Five integration for BlinkStick - this pattern could form the basis.

var blinkstick = require('blinkstick');
var device     = blinkstick.findFirst();

//Stream buffer for frames
var stream_buffer = [];

//Stream buffer length should always only be 1 if the producer and consumer can run at the same rate.
//This provides for some buffering to avoid skipped frames.
var MAX_BUFFER_LENGTH = 100;

//Streaming rates in milliseconds
//Eg. 16ms is 60fps. 20ms is recommended minimum for BlinkStick, but 16ms seems perfectly stable.
//Producer rate should never be faster than consumer rate (or frames will be skipped).
var rate = 80; // 80 is nice for this particular animation 


//Image of 8 LEDS to be animated (this one is Knight Rider. Or a Cylon)
var image = [
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	008, 000, 000, //Iris
	255, 016, 000, //Pupil
	008, 000, 000  //Iris
	];

//Animation variables
var phase = 0;
var shift = 0;
var dir   = 1;


//Stream Producer 
//Shifts the image back and forth.
//Pushes the resulting frame to the stream (skips it if stream buffer is full)
function producer(){

	phase +=dir;
	if (phase>5)
	{
		phase=5;
		dir=-dir;
	}

	if (phase<0){
		phase=0;
		dir=-dir;
	}

	shift = Math.floor(phase);
	frame = new Array(8*3).fill(0);

	for (var i = 0; i< 8; i++) {
		
		//Convert to BlinkStick RGB format (GRB)
		frame[i*3+1] = image[shift*3+0]; // R
		frame[i*3+0] = image[shift*3+1]; // G
		frame[i*3+2] = image[shift*3+2]; // B

		shift+=1;
		if (shift>=8)
			shift=0;
	}

	if (stream_buffer.length<MAX_BUFFER_LENGTH)
		stream_buffer.push(frame);

	setTimeout(producer, rate);
}


//Stream Consumer
//Gets the next frame (if any) from the stream.
//Sends the frame (if any) to the BlinkStick.
function consumer()
{
	if (stream_buffer.length>0)
	{
		var next = stream_buffer.shift();
		device.setColors(0, next, function(err, next) {});
	}
	setTimeout(consumer, rate);
}


//Start streaming

if (device){
	setTimeout(producer, rate);
}

if (device){
	setTimeout(consumer, rate);
}
