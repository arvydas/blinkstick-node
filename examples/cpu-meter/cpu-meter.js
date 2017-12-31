//Blinkstick Desktop PC case lighting mod
//CPU load meter based on pro_stream.js example

var os         = require("os");
var blinkstick = require('blinkstick');
var device     = blinkstick.findFirst();

var framerate = 60;
var stream_buffer = [];
var MAX_BUFFER_LENGTH = 60;
var exit = false;

function producer(){
	if (stream_buffer.length<MAX_BUFFER_LENGTH)
		stream_buffer.push(onFrame());
	framerate = Math.max(1, Math.min(framerate, 60));
	setTimeout(producer, 1000/framerate);
}

function consumer(){
	if (stream_buffer.length>0 && !exit){
		var rgb = stream_buffer.shift();
		var grb = convert_grb(rgb);
		device.setColors(0, grb, function(err, grb) {});
	}
	framerate = Math.max(1, Math.min(framerate, 60));
	setTimeout(consumer, 1000/framerate);
}

function convert_grb(rgb){
	var grb = [];
	for (var i = 0; i<size; i++) {
		grb[i*3+0] = rgb[i*3+1]; // G
		grb[i*3+1] = rgb[i*3+0]; // R
		grb[i*3+2] = rgb[i*3+2]; // B
	}
	return grb;
}


var startMeasure  = cpuLoad();
var percentageCPU = 0;

var phase = 0;
var shift = 0;
var speed = 1;
var cpu_avg = 0;

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
var size  = pixels.length/3;


function onFrame(){       
	var frame = [];

	//Vary the fps by CPU load
	var endMeasure = cpuLoad(); 
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;

	percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

	cpu_avg = (cpu_avg+percentageCPU)/2;
	
	startMeasure = endMeasure; 
	framerate = cpu_avg/2+10;

	//Vary pupil colour by CPU load (green to amber to red)        
	pixels[(size-2)*3+0] = Math.floor(cpu_avg*2.5)+5;
	pixels[(size-2)*3+1] = 24;
	pixels[(size-2)*3+2] = 2;

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



//CPU load 
function cpuLoad() {
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
	exit = true;
	//Turn off LEDs
	var frame = [];
	for (var i = 0; i<size; i++) {
		frame[i*3+0] = 0; // G
		frame[i*3+1] = 0; // R
		frame[i*3+2] = 0; // B
	}
	device.setColors(0, frame, function(err, frame) {process.exit(0);});
}


if (device){
	producer();
	consumer();
}

