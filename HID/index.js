// Attempt to load each of the available .node files for the current processor
// architecture until one succeeds, or throw an exception if none do.
var versions = require("fs").readdirSync(__dirname + "\\" + process.arch);
if (!versions.some(function (version) {
  try {
    module.exports = require("./" + process.arch + "/" + version + "/HID.node");
    return true;
  } catch (e) {
    return false;
  }
})) {
  throw new Error("Your processor architecture and node version are not supported");
};

