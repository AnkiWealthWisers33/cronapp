const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const readable = require("stream").Readable;

ffmpeg.setFfmpegPath(ffmpegPath);

function processAudio(localTempPath) {
  ffmpeg()
    .input("audioSample.mp3")
    .withAudioCodec("libmp3lame")
    .withAudioBitrate("128k")
    // .withOutputFormat("avi")
    .on("error", (error) => {
      console.log("error :> ", error);
    })
    .output("convertedAudio.mp3")
    .on("progress", (progress) => console.log(progress))
    .on("end", function () {
      console.log("Finished processing");
    })
    .run();
}
processAudio();

// module.exports = { processAudio };
