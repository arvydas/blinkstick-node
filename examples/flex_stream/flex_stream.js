//Frame streamer for Blinkstick Flex and Pro (MAX 64 LEDs - single channel **)
//Producer pushes frames to the stream as simple RGB arrays at a set rate
//Consumer pulls frames from the stream and renders them to BlickStick at a set rate
//When consumer rate is faster than production rate, transparency allows frame morphing 
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
		setTransparency: function(t)
		{
			setTransparency(t);
		},
		getTransparency: function()
		{
			return getTransparency();
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
		}
}

var blinkstick = require('blinkstick');
var device     = blinkstick.findFirst();
var MAX_SIZE = 64;
var size     = 8;             //Default 8 LEDs.
var producer_framerate = 15;  //Default low frame production for morphing
var consumer_framerate = 60;  //Default high frame rendering for morphing
var transparency       = 0.5; //Default is transparent frames for morphing
var stream_buffer = [];       //Stream buffer for frames
var backingstore = null;      //Internal frames for morphing
var currentFrame = null;
var streaming = true;         //Clean exit flag

//Stream Producer 
function producer(){
	onFrame();
	setTimeout(producer, 1000/producer_framerate); //Clamp to 1-60fps
}

//Stream Consumer
function consumer(){
	consumeFrame();
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

function produceFrame(frame)
{
	if (stream_buffer.length==0)
		stream_buffer.push(frame);
	producer_framerate = Math.max(1, Math.min(producer_framerate, 60));	//Clamp between 1 and 60 fps
}

function consumeFrame()
{
	if (stream_buffer.length>0){
		var rgb = stream_buffer.shift();
		var grb = convert_grb(rgb);
		currentFrame = grb;
	}
	if (currentFrame != null)
		morphFrame(currentFrame);
	consumer_framerate = Math.max(1, Math.min(consumer_framerate, 60)); //Clamp between 1 and 60 fps
}

function morphFrame(grb)
{
	if (backingstore == null || transparency == 0)
		backingstore = grb;
	
	//Morph the new frame with current backingstore (additive alpha blending)
	if (transparency>0){   
		for (var i = 0; i<getSize(); i++) {
			backingstore[i*3+0] = Math.floor(backingstore[i*3+0]*transparency + grb[i*3+0]*(1-transparency)); // R
			backingstore[i*3+1] = Math.floor(backingstore[i*3+1]*transparency + grb[i*3+1]*(1-transparency)); // G
			backingstore[i*3+2] = Math.floor(backingstore[i*3+2]*transparency + grb[i*3+2]*(1-transparency)); // B
		}
	}
	
	if (streaming)
		device.setColors(0, backingstore, function(err, backingstore) {});
}

function setOnFrame(fn)
{
	onFrame = fn;
}

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

function setTransparency(t)
{
	transparency = Math.max(0, Math.min(t, 1));	//Clamp between 0 (opaque) and 1 (invisible)
}

function getTranparency()
{
	return transparency;
}

//Clean exit
process.on('SIGTERM', onExit);
process.on('SIGINT',  onExit);

function onExit(){
	var frame = newFrame();	
	streaming = false; //Disable streaming to ensure no pending frames are set after LEDs are turned off
	device.setColors(0, frame, function(err, frame) {process.exit(0);}); //Turn off LEDs 
}

//Start streaming
if (device){
	producer();
	consumer();
}


