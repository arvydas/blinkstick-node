//CPU load meter based on flex_stream.js
//User defined OnFrame() is a particle trail emitter to indicate CPU load. 
//For Windows, Linux and Mac

const os          = require("os");
const flex_stream = require("./flex_stream.js");

var size               = 8;   // Default 8, maximum 64 (single BlickStick channel)
var producer_framerate = 30;  // Varies with CPU load   
var consumer_framerate = 60;  // High fps for morphing   
var transparency       = .75; // Leave a particle trail

var startMeasure  = cpuLoad();
var percentageCPU = 0;
var cpu_avg = 0;

var pos     = 1;
var speed   = 1;

function onFrame() {       
	var frame = flex_stream.newFrame();
	var endMeasure = cpuLoad(); 
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;
	startMeasure = endMeasure;

	//Vary the producer framerate by percentage CPU load (5 to 60 fps)
	percentageCPU      = 100 - (100 * idleDifference / totalDifference);
	cpu_avg            = (cpu_avg+percentageCPU)/2;
	producer_framerate = cpu_avg/1.8+5;

	//Bounce particle off edges of LED strip
	if (pos<=0 || pos>=size-1)
		speed =-speed;         
	pos += speed;
	
	//Vary particle colour by CPU load (green to amber to red)        
	frame[pos*3+0] = Math.floor(cpu_avg*2.5)+5; //R
	frame[pos*3+1] = 100-Math.floor(cpu_avg);   //G
	frame[pos*3+2] = 2;                         //B
	
	flex_stream.setProducerFramerate(producer_framerate);
	flex_stream.produceFrame(frame);     
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

//Configure stream
flex_stream.setSize(size);
flex_stream.setProducerFramerate(producer_framerate);
flex_stream.setConsumerFramerate(consumer_framerate);
flex_stream.setTransparency(transparency);
flex_stream.setOnFrame(onFrame);

