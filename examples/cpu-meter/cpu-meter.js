//Stream producer-consumer pattern that allows separation of concerns for BlinkStick frame streaming
//Producer pushes frames to the stream as simple RGB arrays at a variable frame rate
//Consumer pulls frames from the stream and sends them to BlickStick at the same rate
//User
//This is elastic and very efficient, with low CPU overhead in the node process
//Note that LEDs can vary in response time, resulting in colour blur at high fps

var os         = require("os");
var blinkstick = require('blinkstick');
var device     = blinkstick.findFirst();

//Variable frame rate in frames per second (fps)
//Can be dynamically set in onFrame()
//BlinkStick can handle maximum 60fps
var framerate = 60;

//Stream buffer for frames
//This provides some elasticity to avoid skipped frames
var stream_buffer = [];
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
		grb[i*3+0] = rgb[i*3+1]; // G
		grb[i*3+1] = rgb[i*3+0]; // R
		grb[i*3+2] = rgb[i*3+2]; // B
	}
	return grb;
}

//User defined frame generator
//Returns the next frame
//Called by the producer
//Pixel source can be anything (eg. a running screenshot scaled to 8x1 resolution for ambient display applications)
//This example is an animation that shifts an image back and forth at variable framerates (10-60fps)
//The framerate corresponds to current CPU load.

var startMeasure  = cpuAverage();
var percentageCPU = 0;

function onFrame(){       
	var frame = [];

	//Vary the fps by CPU load
	var endMeasure = cpuAverage(); 
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;

	percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

	startMeasure = endMeasure; 
	framerate = percentageCPU/2+10;

	//Vary pupil colour by CPU load (green to amber to red)        
	pixels[(size-2)*3+0] = Math.floor(percentageCPU*2.5)+5;
	pixels[(size-2)*3+1] = Math.floor(percentageCPU/8)+32;
	pixels[(size-2)*3+2] = 5;

	//Bounce image off edges of LED strip (copy from pixel source to new frame)
	if (phase<0 || phase>size-3)
		speed =-speed;         
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

//Pixel source (this one is an image of an eye)
//Add more pixels to match your LED strip size (this is for 8 LEDs)
//Note this example is for a single channel (up to 64 LEDs)
var pixels = [
	//R  //G  //B
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	000, 000, 000,
	004, 004, 004, //Iris
	000, 000, 128, //Pupil
	004, 004, 004  //Iris
	];

//Animation variables
var phase = 0;
var shift = 0;
var speed = 1;
var size  = pixels.length/3;

//CPU load 
function cpuAverage() {
	var totalIdle = 0, totalTick = 0;
	var cpus = os.cpus();
	for(var i = 0, len = cpus.length; i < len; i++) {
		var cpu = cpus[i];
		for(type in cpu.times) {
			totalTick += cpu.times[type];
		}     
		totalIdle += cpu.times.idle;
	}
	return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

//Clean exit
process.on('SIGTERM', onExit);
process.on('SIGINT', onExit);
function onExit(){
	//Turn off LEDs
	var frame = [];
	for (var i = 0; i<size; i++) {
		frame[i*3+0] = 0; // G
		frame[i*3+1] = 0; // R
		frame[i*3+2] = 0; // B
	}
	device.setColors(0, frame, function(err, frame) {process.exit(0);});
}

//MAIN LOOP: Start streaming timers
if (device){
	producer();
	consumer();
}
