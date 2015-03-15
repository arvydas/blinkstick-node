var usb = require("./HID");

var	VENDOR_ID = 0x20a0,
	PRODUCT_ID = 0x41e5,

	COLOR_KEYWORDS = {
		"aqua": "#00ffff",
		"aliceblue": "#f0f8ff",
		"antiquewhite": "#faebd7",
		"black": "#000000",
		"blue": "#0000ff",
		"cyan": "#00ffff",
		"darkblue": "#00008b",
		"darkcyan": "#008b8b",
		"darkgreen": "#006400",
		"darkturquoise": "#00ced1",
		"deepskyblue": "#00bfff",
		"green": "#008000",
		"lime": "#00ff00",
		"mediumblue": "#0000cd",
		"mediumspringgreen": "#00fa9a",
		"navy": "#000080",
		"springgreen": "#00ff7f",
		"teal": "#008080",
		"midnightblue": "#191970",
		"dodgerblue": "#1e90ff",
		"lightseagreen": "#20b2aa",
		"forestgreen": "#228b22",
		"seagreen": "#2e8b57",
		"darkslategray": "#2f4f4f",
		"darkslategrey": "#2f4f4f",
		"limegreen": "#32cd32",
		"mediumseagreen": "#3cb371",
		"turquoise": "#40e0d0",
		"royalblue": "#4169e1",
		"steelblue": "#4682b4",
		"darkslateblue": "#483d8b",
		"mediumturquoise": "#48d1cc",
		"indigo": "#4b0082",
		"darkolivegreen": "#556b2f",
		"cadetblue": "#5f9ea0",
		"cornflowerblue": "#6495ed",
		"mediumaquamarine": "#66cdaa",
		"dimgray": "#696969",
		"dimgrey": "#696969",
		"slateblue": "#6a5acd",
		"olivedrab": "#6b8e23",
		"slategray": "#708090",
		"slategrey": "#708090",
		"lightslategray": "#778899",
		"lightslategrey": "#778899",
		"mediumslateblue": "#7b68ee",
		"lawngreen": "#7cfc00",
		"aquamarine": "#7fffd4",
		"chartreuse": "#7fff00",
		"gray": "#808080",
		"grey": "#808080",
		"maroon": "#800000",
		"olive": "#808000",
		"purple": "#800080",
		"lightskyblue": "#87cefa",
		"skyblue": "#87ceeb",
		"blueviolet": "#8a2be2",
		"darkmagenta": "#8b008b",
		"darkred": "#8b0000",
		"saddlebrown": "#8b4513",
		"darkseagreen": "#8fbc8f",
		"lightgreen": "#90ee90",
		"mediumpurple": "#9370db",
		"darkviolet": "#9400d3",
		"palegreen": "#98fb98",
		"darkorchid": "#9932cc",
		"yellowgreen": "#9acd32",
		"sienna": "#a0522d",
		"brown": "#a52a2a",
		"darkgray": "#a9a9a9",
		"darkgrey": "#a9a9a9",
		"greenyellow": "#adff2f",
		"lightblue": "#add8e6",
		"paleturquoise": "#afeeee",
		"lightsteelblue": "#b0c4de",
		"powderblue": "#b0e0e6",
		"firebrick": "#b22222",
		"darkgoldenrod": "#b8860b",
		"mediumorchid": "#ba55d3",
		"rosybrown": "#bc8f8f",
		"darkkhaki": "#bdb76b",
		"silver": "#c0c0c0",
		"mediumvioletred": "#c71585",
		"indianred": "#cd5c5c",
		"peru": "#cd853f",
		"chocolate": "#d2691e",
		"tan": "#d2b48c",
		"lightgray": "#d3d3d3",
		"lightgrey": "#d3d3d3",
		"thistle": "#d8bfd8",
		"goldenrod": "#daa520",
		"orchid": "#da70d6",
		"palevioletred": "#db7093",
		"crimson": "#dc143c",
		"gainsboro": "#dcdcdc",
		"plum": "#dda0dd",
		"burlywood": "#deb887",
		"lightcyan": "#e0ffff",
		"lavender": "#e6e6fa",
		"darksalmon": "#e9967a",
		"palegoldenrod": "#eee8aa",
		"violet": "#ee82ee",
		"azure": "#f0ffff",
		"honeydew": "#f0fff0",
		"khaki": "#f0e68c",
		"lightcoral": "#f08080",
		"sandybrown": "#f4a460",
		"beige": "#f5f5dc",
		"mintcream": "#f5fffa",
		"wheat": "#f5deb3",
		"whitesmoke": "#f5f5f5",
		"ghostwhite": "#f8f8ff",
		"lightgoldenrodyellow": "#fafad2",
		"linen": "#faf0e6",
		"salmon": "#fa8072",
		"oldlace": "#fdf5e6",
		"bisque": "#ffe4c4",
		"blanchedalmond": "#ffebcd",
		"coral": "#ff7f50",
		"cornsilk": "#fff8dc",
		"darkorange": "#ff8c00",
		"deeppink": "#ff1493",
		"floralwhite": "#fffaf0",
		"fuchsia": "#ff00ff",
		"gold": "#ffd700",
		"hotpink": "#ff69b4",
		"ivory": "#fffff0",
		"lavenderblush": "#fff0f5",
		"lemonchiffon": "#fffacd",
		"lightpink": "#ffb6c1",
		"lightsalmon": "#ffa07a",
		"lightyellow": "#ffffe0",
		"magenta": "#ff00ff",
		"mistyrose": "#ffe4e1",
		"moccasin": "#ffe4b5",
		"navajowhite": "#ffdead",
		"orange": "#ffa500",
		"orangered": "#ff4500",
		"papayawhip": "#ffefd5",
		"peachpuff": "#ffdab9",
		"pink": "#ffc0cb",
		"red": "#ff0000",
		"seashell": "#fff5ee",
		"snow": "#fffafa",
		"tomato": "#ff6347",
		"white": "#ffffff",
		"yellow": "#ffff00"
	};




/**
 * A BlinkStick device.
 * @constructor
 * @param {Object} device The USB device as returned from "usb" package.
 */
function BlinkStick (device_path, serialNumber, manufacturer, product) {

	if (device_path) {
		var device = new usb.HID(device_path);
		this.device = device;
		this.serialNumber = serialNumber;
		this.manufacturer = manufacturer;
		this.product = product;

		process.on('exit', function() {
			device.close();
		});	
	}
}




/**
 * Returns the serial number of device.
 * 
 * BSnnnnnn-1.0
 * ||  |    | |- Software minor version
 * ||  |    |--- Software major version
 * ||  |-------- Denotes sequential number
 * ||----------- Denotes BlinkStick device
 * 
 * Software version defines the capabilities of the device
 * 
 * @returns {String} The device's serial number.
 */
BlinkStick.prototype.getSerial = function () {
	return this.serialNumber;
};




/**
 * Returns the manufacturer of the device.
 * @returns {String} The device's manufacturer.
 */
BlinkStick.prototype.getManufacturer = function () {
	return this.manufacturer;
};




/**
 * Returns the description of the device.
 * @returns {String} The device's description.
 */
BlinkStick.prototype.getDescription = function () {
	return this.product;	
};




/**
 * Set the color to the device as RGB.
 * @param {Number|String} red Red color intensity 0 is off, 255 is full red intensity OR string CSS color keyword OR hex color, eg "#BADA55".
 * @param {Number} [green] Green color intensity 0 is off, 255 is full green intensity.
 * @param {Number} [blue] Blue color intensity 0 is off, 255 is full blue intensity.
 * @param {Function} [callback] Callback, called when complete.
 */
BlinkStick.prototype.setColor = function (red, green, blue, callback) {
	var hex;
	
	if (typeof red == 'string') {
		callback = green;

		if (hex = red.match(/^\#[A-Za-z0-9]{6}$/)) {
			hex = hex[0];

		} else if (!(hex = COLOR_KEYWORDS[red])) {
			if (callback) callback(new ReferenceError('Invalid CSS color keyword'));
			return;
		}
	}

	if (hex) {
		red = parseInt(hex.substr(1, 2), 16);
		green = parseInt(hex.substr(3, 2), 16);
		blue = parseInt(hex.substr(5, 2), 16);	
		
	} else {
		red = red || 0;
		green = green || 0;
		blue = blue || 0;
	}
	this.device.sendFeatureReport([0x01, red, green, blue]);
};
	



/**
 * Get the current color settings as RGB.
 * @param {Function} callback Callback to which to pass the color values.
 * @returns {Array} Array of three numbers: R, G and B (0-255).
 */
BlinkStick.prototype.getColor = function (callback) {

	buffer = this.device.getFeatureReport(0x01, 0x32);

	if (callback) callback(buffer[1], buffer[2], buffer[3]);

	return buffer;
};




/**
 * Get the current color settings as hex string.
 * @param {Function} callback Callback to which to pass the color string.
 * @returns {String} Hex string, eg "#BADA55".
 */
BlinkStick.prototype.getColorString = function (callback) {

	this.getColor(function (r, g, b) {
		callback('#' + r.toString(16) + g.toString(16) + b.toString(16));
	});
};




/**
 * Get an infoblock from a device.
 * @private
 * @static
 * @param {BlinkStick} device Device from which to get the value.
 * @param {Number} location Address to seek the data.
 * @param {Function} callback Callback to which to pass the value.
 */
function getInfoBlock (device, location, callback) {
	//TODO: trap errors here with try/catch

	var buffer = device.getFeatureReport(location, 0x32);

	var result = '';

	for (var i = 1; i < buffer.length - 1; i++) {
		if (i == 0) break;
		result += String.fromCharCode(buffer[i]);
	}

	callback(null, result);
};




/**
 * Sets an infoblock on a device.
 * @private
 * @static
 * @param {BlinkStick} device Device on which to set the value.
 * @param {Number} location Address to seek the data.
 * @param {String} data The value to push to the device. Should be <= 32 chars.
 * @param {Function} callback Callback to which to pass the value.
 */
function setInfoBlock (device, location, data, callback) {	
	var i,
		l = Math.min(data.length, 33),
		buffer = new Buffer(33);

	buffer[0] = location;

	for (i = 0; i < l; i++) buffer[i + 1] = data.charCodeAt(i);
	for (i = l; i < 33; i++) buffer[i + 1] = 0;

	device.sendFeatureReport(buffer);
}




/**
 * Get the infoblock1 of the device.
 * This is a 32 byte array that can contain any data. It's supposed to 
 * hold the "Name" of the device making it easier to identify rather than
 * a serial number.
 *
 * @param {Function} callback Callback to which to pass the value.
 */
BlinkStick.prototype.getInfoBlock1 = function (callback) {
	getInfoBlock(this.device, 0x0002, callback);
};




/**
 * Get the infoblock2 of the device.
 * This is a 32 byte array that can contain any data. 
 *
 * @param {Function} callback Callback to which to pass the value.
 */
BlinkStick.prototype.getInfoBlock2 = function (callback) {
	getInfoBlock(this.device, 0x0003, callback);
};




/**
 * Sets the infoblock1 with specified string.
 * It fills the rest of bytes with zeros.
 *
 * @param {Function} callback Callback to which to pass the value.
 */
BlinkStick.prototype.setInfoBlock1 = function (data, callback) {
	setInfoBlock(this.device, 0x0002, data, callback);
};




/**
 * Sets the infoblock2 with specified string.
 * It fills the rest of bytes with zeros.
 *
 * @param {Function} callback Callback to which to pass the value.
 */
BlinkStick.prototype.setInfoBlock2 = function (data, callback) {
	setInfoBlock(this.device, 0x0003, data, callback);
};




/**
 * Sets the LED to a random color.
 */
BlinkStick.prototype.setRandomColor = function () {
	var args = [], 
		i;

	for (i = 0; i < 3; i++) args.push(Math.floor(Math.random() * 256));
	this.setColor.apply(this, args);
};




/**
 * Turns the LED off.
 */
BlinkStick.prototype.turnOff = function () {
	this.setColor();
};




/**
 * Pulses specified RGB color.
 * @param {Number} red Red color intensity 0 is off, 255 is full red intensity.
 * @param {Number} green Green color intensity 0 is off, 255 is full green intensity.
 * @param {Number} blue Blue color intensity 0 is off, 255 is full blue intensity.
 */
BlinkStick.prototype.pulseColor = function (red, green, blue) {

	red = Math.min(red, 255);
	green = Math.min(green, 255);
	blue = Math.min(blue, 255);

	var cr = 0,
		cg = 0,
		cb = 0,
		i, l;

	for (i = 0, l = Math.max(red, green, blue); i < l; i++) {
		if (cr < red) cr++;
		if (cg < green) cg++;
		if (cb < blue) cb++;

	    this.setColor(cr, cg, cb);
	}

	while (cr > 0 || cg > 0 || cb > 0) {
	    if (cr > 0) cr--;
	    if (cb > 0) cb--;
	    if (cg > 0) cg--;

	    this.setColor(cr, cg, cb);
	}
};




/**
 * Find BlinkSticks using a filter.
 * @param {Function} [filter] Filter function.
 * @returns {Array} BlickStick objects.
 */
function findBlinkSticks (filter) {
	if (filter === undefined) filter = function () { return true; };

	var devices = usb.devices(),
		device,
		result = [],
		i;

	for (i in devices) {
		device = devices[i];

		if (device.vendorId === VENDOR_ID && 
			device.productId === PRODUCT_ID && 
			filter(device)) 
		{
			result.push(new BlinkStick(device.path, device.serialNumber, device.manufacturer, device.product));
		}
	}

	return result;
}




module.exports = {

	
	/**
	 * Find first attached BlinkStick.
	 * @returns {BlinkStick|undefined} The first BlinkStick, if found.
	 */
	findFirst: function () {
		var devices = findBlinkSticks();
		
		if (devices.length > 0)
		{
			return devices[0];
		}
		else
		{
			return null;
		}
	},



	
	/**
	 * Find all attached BlinkStick devices.
	 * @returns {Array} BlinkSticks.
	 */
	findAll: function () {
		return findBlinkSticks();
	},



	
	/**
	 * Returns the serial numbers of all attached BlinkStick devices.
	 * @returns {Array} Serial numbers.
	 */
	findAllSerials: function () {
		var result = [];
		
		findBlinkSticks(function (device) { 
			result.push(device.serialNumber); 
		});
		
		return result;
	},



	
	/**
	 * Find BlinkStick device based on serial number.
	 * @param {Number} serial Serial number.
	 * @returns {BlinkStick|undefined}
	 */
	findBySerial: function (serial) {
		var result = findBlinkSticks(function (device) {
			return device.serialNumber === serial;
		});

		if (result.length > 0)
		{
			return result[0];
		}
		else
		{
			return null;
		}
	}

	
};

