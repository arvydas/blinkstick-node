var sArchitecture = process.arch;
var sVersion = process.versions.node.match(/^(\d+\.\d+)\.\d+$/)[1];
module.exports = require("./" + sArchitecture + "/" + sVersion + "/HID.node");
