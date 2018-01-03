//CPU load meter based on pro_stream.js
//User defined OnFrame() function animates a bouncing 'eye' to indicate CPU load
//Windows, Linux and Mac

var os         = require("os");
var pro_stream = require("./pro_stream.js");

var framerate = 60;

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

var size = pixels.length/3;

function onFrame() {       
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
        pixels[(size-2)*3+1] = 100-Math.floor(cpu_avg);
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
        
        pro_stream.setProducerFramerate(framerate);
        pro_stream.setConsumerFramerate(framerate);
        pro_stream.produceFrame(frame);
        
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
pro_stream.setSize(size);
pro_stream.setProducerFramerate(framerate);
pro_stream.setConsumerFramerate(framerate);
pro_stream.setOnFrame(onFrame);

