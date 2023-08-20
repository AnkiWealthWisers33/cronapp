const probe = require("node-ffprobe");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");

const ffprobeInstaller = require("@ffprobe-installer/ffprobe");
probe.FFPROBE_PATH = ffprobeInstaller.path;
ffmpeg.setFfmpegPath(ffmpegPath);

//get resolution of audio or video
const getDataResolution = async (type, path) => {
  var resolution = "";
  await probe(path).then((probeData) => {
    console.log("probe data :> ", probeData);
    if (type == "audio") {
      console.log("bit rate :> ", probeData.streams[0].bit_rate);
      resolution = probeData.streams[0].bit_rate;
    } else {
      console.log("pixels :> ", probeData.streams[0].height);
      resolution = probeData.streams[0].height;
    }
  });
  return resolution;
};

//to process the video to 360p
async function processVideo(file) {
  ffmpeg()
    .input(file.path)
    // .input(stream)
    .withVideoCodec("libx264")
    .withSize("480x360")
    // .withOutputFormat("avi")
    .on("error", (error) => {
      console.log("error :> ", error);
    })
    .output("processed\\video\\" + file.filename)
    .on("progress", (progress) => console.log(progress))
    .on("end", function () {
      console.log("Finished processing");
    })
    .run();
}
//to process audio
async function processAudio(file) {
  ffmpeg()
    .input(file.path)
    .withAudioCodec("libmp3lame")
    .withAudioBitrate("128k")
    // .withOutputFormat("avi")
    .on("error", (error) => {
      console.log("error :> ", error);
    })
    .output("processed\\audio\\" + file.filename)
    .on("progress", (progress) => console.log(progress))
    .on("end", function () {
      console.log("Finished processing");
    })
    .run();
}

const processData = async (type, file) => {
  console.log("file data :> ", file);
  console.log("type :> ", type);
  if (type == "video") {
    await processVideo(file);
  } else {
    await processAudio(file);
  }
};
//if image sending the file directly to the image folder
const getStorePath = (file) => {
  const type = file.mimetype.split("/")[0];
  const path = type == "image" ? "processed/image" : "uploads";
  return path;
};

module.exports = { getDataResolution, getStorePath, processData };
