//For Blinkstick Flex and Pro (MAX 64 LEDS - single channel)
//Producer pushes frames to the stream as simple RGB arrays at a set rate
//Consumer pulls frames from the stream and renders them to BlickStick at a set rate
//When consumer rate is faster than production rate, transparency allows frame morphing 
//Windows, Linux and Mac

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
var size     = 8;   // Default 8 LEDs.

var backingstore = null;
var currentFrame = null;

var producer_framerate = 30; // Default low rate to reduce CPU overhead 
var consumer_framerate = 60; // Default high rate for frame morphing
var transparency       = .5; // Default interlaced (fast morphing)

//Stream buffer for frames
var stream_buffer = [];

//Clean exit flag
var streaming = true;

//Stream Producer 
function producer(){
	onFrame();
	//Clamp to 1-60fps
	setTimeout(producer, 1000/producer_framerate);
}

//Stream Consumer
function consumer(){
	consumeFrame();
	setTimeout(consumer, 1000/consumer_framerate);
}

function convert_grb(rgb){
	var grb = newFrame();

	for (var i = 0; i<rgb.length; i++) {
		//Convert to BlinkStick RGB format (GRB)
		grb[i*3+1] = rgb[i*3+0]; // R
		grb[i*3+0] = rgb[i*3+1]; // G
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

	//Clamp between 1 and 60 fps
	producer_framerate = Math.max(1, Math.min(producer_framerate, 60));
}

function consumeFrame()
{
	if (stream_buffer.length>0 && streaming){
		var rgb = stream_buffer.shift();
		var grb = convert_grb(rgb);
		currentFrame = grb;
	}

	if (currentFrame != null)
		setColors(currentFrame);
	
	//Clamp between 1 and 60 fps
	consumer_framerate = Math.max(1, Math.min(consumer_framerate, 60));
}

function setColors(grb)
{
	if (backingstore == null || transparency == 0)
		backingstore = grb;

	if (transparency>0){   //Composite the new frame with current backingstore 
		for (var i = 0; i<getSize(); i++) {
			//Convert to BlinkStick RGB format (GRB)
			backingstore[i*3+0] = Math.floor(backingstore[i*3+0]*transparency + grb[i*3+0]*(1-transparency)); // R
			backingstore[i*3+1] = Math.floor(backingstore[i*3+1]*transparency + grb[i*3+1]*(1-transparency)); // G
			backingstore[i*3+2] = Math.floor(backingstore[i*3+2]*transparency + grb[i*3+2]*(1-transparency)); // B
		}
	}

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
	//Clamp between 0 and MAX_LEDS
	size = Math.max(0, Math.min(s, MAX_SIZE));
}

function getSize()
{
	return size;
}

function setTransparency(t)
{
	transparency = Math.max(0, Math.min(t, 1));
}

function getTranparency()
{
	return transparency;
}

//Clean exit
process.on('SIGTERM', onExit);
process.on('SIGINT',  onExit);

function onExit(){
	//Turn off LEDs
	streaming = false;
	var frame = [];
	for (var i = 0; i<getSize(); i++) {
		frame[i*3+0] = 0; // G
		frame[i*3+1] = 0; // R
		frame[i*3+2] = 0; // B
	}
	device.setColors(0, frame, function(err, frame) {process.exit(0);});
}

//Start streaming
if (device){
	producer();
	consumer();
}


