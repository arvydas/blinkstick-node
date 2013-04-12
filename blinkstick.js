var usb = require('usb'),

	VENDOR_ID = 0x20a0,
	PRODUCT_ID = 0x41e5,

	COLOUR_KEYWORDS = {
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
function BlinkStick (device) {

	if (device) {
		process.on('exit', function() {
			device.close();
		});	

		device.open ();
		this.device = device;	
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
	return this.device.iSerialNumber;
};




/**
 * Returns the manufacturer of the device.
 * @returns {String} The device's manufacturer.
 */
BlinkStick.prototype.getManufacturer = function () {
	return this.device.iManufacturer;
};




/**
 * Returns the description of the device.
 * @returns {String} The device's description.
 */
BlinkStick.prototype.getDescription = function () {
	return this.device.iProduct;	// TODO: Is this the correct response?
};




/**
 * Set the colour to the device as RGB.
 * @param {Number|String} red Red color intensity 0 is off, 255 is full red intensity OR string CSS colour keyword OR hex colour, eg "#BADA55".
 * @param {Number} [green] Green color intensity 0 is off, 255 is full green intensity.
 * @param {Number} [blue] Blue color intensity 0 is off, 255 is full blue intensity.
 * @param {Function} [callback] Callback, called when complete.
 */
BlinkStick.prototype.setColour = function (red, green, blue, callback) {
	var hex;
	
	if (typeof red == 'string') {
		callback = green;

		if (hex = red.match(/^\#[A-Za-z0-9]{6}$/)) {
			hex = hex[0];
		} else if (!(hex = COLOUR_KEYWORDS[red])) {
			throw new ReferenceError('Invalid CSS colour keyword');
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

	this.device.controlTransfer(0x20, 0x9, 0x0001, 0, new Buffer([0, red, green, blue]), function (err) {
		if (err) throw new Error('Failed to communicate with BlinkStick: ' + err.message);
		if (callback) callback();
	});
};
	



/**
 * Get the current color settings as RGB.
 * @param {Function} callback Callback to which to pass the colour values.
 * @returns {Array} Array of three numbers: R, G and B (0-255).
 */
BlinkStick.prototype.getColour = function (callback) {

	this.device.controlTransfer(0x80 | 0x20, 0x1, 0x0001, 0, 33, function (err, buffer) {
		if (err) throw new Error('Failed to communicate with BlinkStick: ' + err.message);
		if (callback) callback(buffer[1], buffer[2], buffer[3]);
	});
};




/**
 * Get the current color settings as hex string.
 * @param {Function} callback Callback to which to pass the colour string.
 * @returns {String} Hex string, eg "#BADA55".
 */
BlinkStick.prototype.getColourString = function (callback) {

	this.getColour(function (r, g, b) {
		callback('#' + r.toString(16) + g.toString(16) + b.toString(16));
	});
};




/*
    def get_info_block1(self):
        """Get the infoblock1 of the device.

        This is a 32 byte array that can contain any data. It's supposed to 
        hold the "Name" of the device making it easier to identify rather than
        a serial number.
        """
        device_bytes = self.device.ctrl_transfer(0x80 | 0x20, 0x1, 0x0002, 0, 33)
        result = ""
        for i in device_bytes[1:]:
            if i == 0:
                break
            result += chr(i)
        return result

    def get_info_block2(self):
        """Get the infoblock2 of the device.

        This is a 32 byte array that can contain any data.
        """
        device_bytes = self.device.ctrl_transfer(0x80 | 0x20, 0x1, 0x0003, 0, 33)
        result = ""
        for i in device_bytes[1:]:
            if i == 0:
                break
            result += chr(i)
        return result

    def data_to_message(self, data):
        """Helper method to convert a string to byte array of 32 bytes. 

        Args: 
            data (str): The data to convert to byte array

        Returns:
            byte[32]: array
        
        It fills the rest of bytes with zeros.
        """
        bytes = [1]
        for c in data:
            bytes.append(ord(c))

        for i in range(32 - len(data)):
            bytes.append(0)

        return bytes

    def set_info_block1(self, data):
        """Sets the infoblock1 with specified string.
        
        It fills the rest of bytes with zeros.
        """
        self.device.ctrl_transfer(0x20, 0x9, 0x0002, 0, self.data_to_message(data))

    def set_info_block2(self, data):
        """Sets the infoblock2 with specified string.
        
        It fills the rest of bytes with zeros.
        """
        self.device.ctrl_transfer(0x20, 0x9, 0x0003, 0, self.data_to_message(data))

    def set_random_color(self):
        """Sets random color to the device."""
        self.set_color(red=randint(0, 255), green=randint(0, 255), blue=randint(0, 255))
*/








/**
 * Turns the LED off.
 */
BlinkStick.prototype.setRandomColour = function () {
	var args = [], 
		i;

	for (i = 0; i < 3; i++) args.push(Math.floor(Math.random() * 256));
	this.setColour.apply(this, args);
};




/**
 * Turns the LED off.
 */
BlinkStick.prototype.turnOff = function () {
	this.setColour();
};




/**
 * Pulses specified RGB color.
 * @param {Number} red Red color intensity 0 is off, 255 is full red intensity.
 * @param {Number} green Green color intensity 0 is off, 255 is full green intensity.
 * @param {Number} blue Blue color intensity 0 is off, 255 is full blue intensity.
 */
BlinkStick.prototype.pulseColour = function (red, green, blue) {
	// TODO: Check if this works, else use callbacks to wait from messages to send.

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

	    this.setColour(cr, cg, cb);
	}

	while (cr > 0 || cg > 0 || cb > 0) {
	    if (cr > 0) cr--;
	    if (cb > 0) cb--;
	    if (cg > 0) cg--;

	    this.setColour(cr, cg, cb);
	}
};




/**
 * Find BlinkSticks using a filter.
 * @param {Function} [filter] Filter function.
 * @returns {Array} BlickStick objects.
 */
function findBlinkSticks (filter) {
	if (filter === undefined) filter = function () { return true; };

	var devices = usb.getDeviceList(),
		device,
		result = [],
		i;

	for (i in devices) {
		device = devices[i];
		if (device.deviceDescriptor.idVendor == VENDOR_ID && device.deviceDescriptor.idProduct == PRODUCT_ID && filter(device)) result.push(device);
	}

	return result;
}




module.exports = {

	
	/**
	 * Find first attached BlinkStick.
	 * @returns {BlinkStick|undefined} The first BlinkStick, if found.
	 */
	findFirst: function () {
		var device = usb.findByIds(VENDOR_ID, PRODUCT_ID);
		if (device) return new BlinkStick(device);
	},



	
	/**
	 * Find all attached BlinkStick devices.
	 * @returns {Array} BlickStick objects.
	 */
	findAll: function () {
		return findBlinkSticks();
	},



	
	/**
	 * Find BlinkStick device based on serial number.
	 * @param {Number} serial Serial number.
	 * @returns {Array} BlickStick objects.
	 */
	findBySerial: function (serial) {
		return findBlinkSticks(function (device) {
			return device.deviceDescriptor.iSerialNumber == serial;
		});
	}

	
};

