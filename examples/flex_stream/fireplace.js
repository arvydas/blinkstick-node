//Fireplace ambience based on flex_stream.js
//For Windows, Linux and Mac

const os          = require("os");
const flex_stream = require("./flex_stream.js");

var size               = 8;   // Default 8, maximum 64 (single BlickStick channel)
var producer_framerate = 15;  // Varies
var consumer_framerate = 60;  // High fps for morphing   
var alpha              = 0;   // Varies


function fireplace() {   

        var frame = flex_stream.newFrame();

        for (i=0; i<size; i++)
        {
                if (Math.random()<.75)
                {
                        //Red to yellow spectrum
                        var r = Math.random()*230+25;
                        var g = r*Math.random()*.75;
                        frame[i*3+0] = Math.floor(r);  //R
                        frame[i*3+1] = Math.floor(g);  //G
                        frame[i*3+2] = 0;              //B
                }

                //Flickering frames
                f = Math.random();
                flex_stream.setProducerFramerate(f*10+2);
                flex_stream.setAlpha(.05+(f/20));
        }
        flex_stream.produceFrame(frame);     
}

//Configure stream
flex_stream.setSize(size);
flex_stream.setProducerFramerate(producer_framerate);
flex_stream.setConsumerFramerate(consumer_framerate);
flex_stream.setAlpha(alpha);
flex_stream.setOnFrame(fireplace);
