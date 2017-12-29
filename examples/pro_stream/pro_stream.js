//Stream producer-consumer pattern than allows separation of concerns for BlinkStick frame streaming
//Producer pushes frames to the stream as simple RGB arrays at a variable frame rate
//Consumer pulls frames from the stream and sends them to BlickStick at the same rate
//This is elastic and very efficient, with low overhead CPU in the node process
//Note that LEDs can vary in response time, resulting in colour blur at high fps

var blinkstick = require('blinkstick');
var device     = blinkstick.findFirst();

//Variable frame rate in frames per second (fps)
//Can be dynamically set in onFrame()
//BlinkStick can handle maximum 60fps
var framerate = 60;

//Stream buffer for frames
var stream_buffer = [];

//This provides some elasticity to avoid skipped frames
var MAX_BUFFER_LENGTH = 60;

//Stream Producer 
function producer(){
	//Skip frame when buffer is full
	if (stream_buffer.length<MAX_BUFFER_LENGTH)
		stream_buffer.push(onFrame());
	//Clamp to 1-60fps
	framerate = Math.max(1, Math.min(framerate, 60));
	setTimeout(producer, 1000/framerate);
}

//Stream Consumer
function consumer(){
	//Send converted frame, if available
	if (stream_buffer.length>0){
		var rgb = stream_buffer.shift();
		var grb = convert_grb(rgb);
		device.setColors(0, grb, function(err, grb) {});
	}
	//Clamp to 1-60fps
	framerate = Math.max(1, Math.min(framerate, 60));
	setTimeout(consumer, 1000/framerate);
}

function convert_grb(rgb){
	var grb = [];

	for (var i = 0; i<size; i++) {
		//Convert to BlinkStick RGB format (GRB)
		grb[i*3+1] = rgb[i*3+0]; // R
		grb[i*3+0] = rgb[i*3+1]; // G
		grb[i*3+2] = rgb[i*3+2]; // B
	}
	return grb;
}

//Start streaming
if (device){
	producer();
	consumer();
}

//User defined frame generator
//Returns the next frame
//Called by the producer
//Pixel source can be anything (eg. a running screenshot scaled to 8x1 resolution for ambient display applications)
//This example is an animation that shifts an image back and forth at variable framerates (10-60fps)

function onFrame(){       
	var frame = [];

	//Bounce image off edges of LED strip
	if (phase<0 || phase>5){
		speed =-speed;
		//Vary the fps after each bounce
		framerate = Math.random()*50+10;
	}

	phase    += speed;	
	shift     = Math.floor(phase);

	for (var i = 0; i<size; i++) {
		frame[i*3+0] = pixels[shift*3+0]; // R
		frame[i*3+1] = pixels[shift*3+1]; // G
		frame[i*3+2] = pixels[shift*3+2]; // B
		if (shift<size)
			shift+=1;
	}

	return frame;
}

//Pixel source (this one is Kit from Knight Rider, or maybe a Cylon?)
//Add more pixels to match your LED strip size (this is for 8 LEDs)
//Note this example for for a single channel (up to 64 LEDs)
var pixels = [
	//R  //G  //B
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	004, 000, 000, //Iris
	128, 032, 000, //Pupil
	004, 000, 000  //Iris
	];

//Animation variables
var phase = 0;
var shift = 0;
var speed = 1;
var size  = pixels.length/3;
