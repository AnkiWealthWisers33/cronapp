const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const readable = require("stream").Readable;

ffmpeg.setFfmpegPath(ffmpegPath);

function processVideo(localTempPath) {
  console.log("local file :> ", localTempPath);
  const stream = bufferToStream(localTempPath.buffer);
  ffmpeg()
    // .input("vid.mp4")
    .input(stream)

    .withVideoCodec("libx264")
    .withSize("480x360")
    // .withOutputFormat("avi")
    .on("error", (error) => {
      console.log("error :> ", error);
    })
    .output("converted.mp4")
    .on("progress", (progress) => console.log(progress))
    .on("end", function () {
      console.log("Finished processing");
    })
    .run();
}

function bufferToStream(buffer) {
  var stream = new readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
module.exports = { processVideo };
