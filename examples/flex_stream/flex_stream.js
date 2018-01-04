//Frame streamer for Blinkstick Flex and Pro (MAX 64 LEDs - single channel **)
//Producer pushes frames to the stream as simple RGB arrays at a set rate
//Consumer pulls frames from the stream and renders them to BlickStick at a set rate
//When consumer rate is faster than production rate, alpha (opacity) allows frame morphing 
//For Windows, Linux and Mac
//** Flex is single channel and can handle 64 LEDs if flashed with Pro firmware, otherwise 32 is the default limit
//** Pro can currently only set one channel per call, so streaming is not yet supported for multiple channels

module.exports = {
		setOnFrame: function(fn) {
			setOnFrame(fn); 
		},
		newFrame: function() {
			return newFrame(); 
		},
		setAlpha: function(a)
		{
			setAlpha(a);
		},
		getAlpha: function()
		{
			return getAlpha();
		},
		produceFrame: function(frame)
		{
			produceFrame(frame);
		},
		setProducerFramerate: function(framerate)
		{
			setProducerFramerate(framerate);
		},
		getProducerFramerate: function()
		{
			return getProducerFramerate();
		},
		setConsumerFramerate: function(framerate)
		{
			setConsumerFramerate(framerate);
		},
		getConsumerFramerate: function()
		{
			return getConsumerFramerate();
		},
		setSize: function(size)
		{
			setSize(size);
		},
		getSize: function()
		{
			return getSize();
		},
		start: function(size)
		{
			start();
		},
		stop: function()
		{
			return stop();
		},
		isStreaming: function()
		{
			return streaming;
		}
}

var blinkstick         = require('blinkstick');
var device             = blinkstick.findFirst();
var MAX_SIZE           = 64;   //BlinkStick single channel limit
var size               = 8;    //Default 8 LEDs.
var producer_framerate = 15;   //Default low frame production for morphing
var consumer_framerate = 60;   //Default high frame rendering for morphing
var alpha              = 0.5;  //Default is transparent frames for morphing
var stream_buffer      = [];   //Stream buffer for frames
var composite          = null; //Composite frame
var currentFrame       = null; //Latest frame from stream
var streaming          = true; //Pause flag

//Stream Producer 
function producer(){
	onFrame(); //Call user defined function
	setTimeout(producer, 1000/producer_framerate); //Clamp to 1-60fps
}

//Stream Consumer
function consumer(){
	consumeFrame(); //Render frame to BlinkStick
	setTimeout(consumer, 1000/consumer_framerate);
}

//Convert to internal BlinkStick buffer
function convert_grb(rgb){
	var grb = newFrame();
	for (var i = 0; i<rgb.length; i++) {
		grb[i*3+1] = rgb[i*3+0]; // G
		grb[i*3+0] = rgb[i*3+1]; // R
		grb[i*3+2] = rgb[i*3+2]; // B
	}
	return grb;
}

//Create an empty frame
function newFrame(){
	return new Uint8Array(getSize()*3);
}

//Produce frame on stream - called from user-defined OnFrame()
function produceFrame(frame)
{
	if (stream_buffer.length==0) //Skip frame if consumer is falling behind
		stream_buffer.push(frame);
	producer_framerate = Math.max(1, Math.min(producer_framerate, 60));	//Clamp between 1 and 60 fps
}

//Consume frame from stream - called from consumer
function consumeFrame()
{
	if (stream_buffer.length>0){ //Check if new frame available
		var rgb = stream_buffer.shift();
		var grb = convert_grb(rgb);
		currentFrame = grb;
	}
	if (currentFrame != null)
		morphFrame(currentFrame); //Morph to the current frame

	consumer_framerate = Math.max(1, Math.min(consumer_framerate, 60)); //Clamp between 1 and 60 fps
}

//Morph current frame over composite frame
function morphFrame(current)
{
	if (composite == null || alpha == 1)
		composite = current; //Initialize composite frame

	//Morph to the current frame with composite (additive alpha blending function)
	if (alpha>0){   
		for (var i = 0; i<getSize(); i++) {
			composite[i*3+0] = Math.floor(current[i*3+0]*alpha + composite[i*3+0]*(1-alpha)); // R
			composite[i*3+1] = Math.floor(current[i*3+1]*alpha + composite[i*3+1]*(1-alpha)); // G
			composite[i*3+2] = Math.floor(current[i*3+2]*alpha + composite[i*3+2]*(1-alpha)); // B
		}
	}

	if (streaming)
		device.setColors(0, composite, function(err, composite) {});
}

//Set user-defined OnFrame()
function setOnFrame(fn)
{
	onFrame = fn;
}

//Default OnFrame stub - set by user with setOnFrame()
var onFrame = function(){
	// use setOnFrame() to set user defined OnFrame function
};

function setProducerFramerate(framerate)
{
	producer_framerate = framerate;
}

function getProducerFramerate()
{
	return producer_framerate;
}

function setConsumerFramerate(framerate)
{
	consumer_framerate = framerate;
}

function getConsumerFramerate()
{
	return consumer_framerate;
}

function setSize(s)
{	
	size = Math.max(1, Math.min(s, MAX_SIZE)); //Clamp between 1 and MAX_SIZE (64 for BlinkStick single channel)
}

function getSize()
{
	return size;
}

function setAlpha(a)
{
	alpha = Math.max(0, Math.min(a, 1));	//Clamp between 0 (invisible) and 1 (opaque)
}

function getAlpha()
{
	return alpha;
}

function start()
{
	streaming = true;	//Clamp between 0 (invisible) and 1 (opaque)
}

function stop()
{
	streaming = false;
}

//Clean exit
process.on('SIGTERM', onExit);
process.on('SIGINT',  onExit);

function onExit(){
	var frame = newFrame();	
	stop(); //Disable streaming to ensure no pending frames are set after LEDs are turned off
	device.setColors(0, frame, function(err, frame) {process.exit(0);}); //Turn off LEDs 
}

//Start streaming
if (device){
	producer();
	consumer();
}


