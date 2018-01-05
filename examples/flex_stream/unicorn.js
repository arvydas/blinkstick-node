//Aurora Borealis ambience based on flex_stream.js
//For Windows, Linux and Mac

const os          = require("os");
const flex_stream = require("./flex_stream.js");

var size               = 8;     // Default 8, maximum 64 (single BlickStick channel)
var producer_framerate = 4;     // slow 
var consumer_framerate = 60;    // High fps for morphing   
var alpha              = 0.05;  // slow
var frame              = flex_stream.newFrame();

function onFrame() {       

    // Unicorn rainbow happy joy 
    var off = 0;
    var amp = 150;
        for (i=0; i<size; i++)
        {   

                //Normalize all pixel brightness to 256
                var r = Math.random()*amp+off;
                var g = Math.random()*amp+off;
                var b = Math.random()*amp+off;

                frame[i*3+0] = Math.floor(r);  //R
                frame[i*3+1] = Math.floor(g);  //G
                frame[i*3+2] = Math.floor(b);  //B
        }

        flex_stream.produceFrame(frame);     
}

//Configure stream
flex_stream.setSize(size);
flex_stream.setProducerFramerate(producer_framerate);
flex_stream.setConsumerFramerate(consumer_framerate);
flex_stream.setAlpha(alpha);
flex_stream.setOnFrame(onFrame);
