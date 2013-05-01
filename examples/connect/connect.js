// Run this script:
//
//     node connect.js access_code
// 
// The access_code for the registered device is available in the device details 
// page on blinkstick.com. 
 
if (process.argv[2] == null) {
    console.log("Please supply access code as an argument");
    return;
}
 
var faye = require('faye'),
    access_code = process.argv[2],
    endpoint = 'http://live.blinkstick.com:9292/faye';
 
var blinkstick = require('blinkstick'),
    device = blinkstick.findFirst();
 
console.log('Connecting to ' + endpoint);
 
var client = new faye.Client(endpoint);
 
var subscription = client.subscribe('/devices/' + access_code, function(message) {
    if (message.status == 'off') {
        console.log('Received message to turn off');
        device.turnOff();
    } else {
        console.log('Received color: ' + message.color);
        device.setColour(message.color);
    }
});
 
subscription.callback(function() {
    console.log('Successfully subscribed to the device');
});
 
subscription.errback(function(error) {
    console.log('Subscription failed: ', error.message);
});
 
client.bind('transport:down', function() {
    console.log('Disconnected...');
});
 
client.bind('transport:up', function() {
    console.log('Connected...');
});