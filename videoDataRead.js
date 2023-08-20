const probe = require("node-ffprobe");
const ffprobeInstaller = require("@ffprobe-installer/ffprobe");

console.log("ff probe installer path :> ", ffprobeInstaller.path);
console.log("ff probe installer version :> ", ffprobeInstaller.version);

probe.FFPROBE_PATH = ffprobeInstaller.path;

var track = "convertedAudio.mp3"; // or video

probe(track).then((probeData) => {
  console.log(probeData);
});
