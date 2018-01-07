//CPU load meter based on flex_stream.js
//User defined OnFrame() is a particle trail emitter to indicate CPU load. 
//For Windows, Linux and Mac

module.exports = {
		init: function() {
			init(); 
		}
}

const os          = require("os");
const flex_stream = require("./flex_stream.js");

var size               = 8;   // Default 8, maximum 64 (single BlickStick channel)
var producer_framerate = 30;  // Varies with CPU load   
var consumer_framerate = 60;  // High fps for morphing   
var alpha              = .3; // 25% opacity to leave a particle trail

var startMeasure  = cpuLoad();
var percentageCPU = 0;
var cpu_avg       = 0;
var pos           = 1;
var speed         = 1;

function cpuMeter() {       
	var endMeasure      = cpuLoad(); 
	var idleDifference  = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;
	startMeasure        = endMeasure;

	//Vary the producer framerate by percentage CPU load (10 to 60 fps)
	percentageCPU      = 100 - (100 * idleDifference / totalDifference);
	cpu_avg            = (cpu_avg+percentageCPU)/2;
	producer_framerate = cpu_avg*0.50+10;

	//Bounce particle off edges of LED strip
	if (pos<=0 || pos>=size-1)
		speed =-speed;         
	pos += speed;

	var frame = flex_stream.newFrame();
	//Vary particle colour by CPU load (green to amber to red)        
	frame[pos*3+0] = Math.floor(cpu_avg*2.5)+5; //R
	frame[pos*3+1] = 100-Math.floor(cpu_avg);   //G
	frame[pos*3+2] = 2;                         //B

	flex_stream.setProducerFramerate(producer_framerate);
	flex_stream.produceFrame(frame);     
}

//CPU load 
function cpuLoad() {
	var totalIdle = 0;
	var totalTick = 0;
	var cpus      = os.cpus();

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

function init(){
	flex_stream.setSize(size);
	flex_stream.setProducerFramerate(producer_framerate);
	flex_stream.setConsumerFramerate(consumer_framerate);
	flex_stream.setAlpha(alpha);
	flex_stream.setOnFrame(cpuMeter);
	startMeasure  = cpuLoad();
	percentageCPU = 0;
	cpu_avg       = 0;
	pos           = 1;
	speed         = 1;
}

init();

