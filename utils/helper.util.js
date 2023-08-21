const probe = require("node-ffprobe");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
var fs = require("fs");

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

//get codec type
const getCodecType = async (path) => {
  var codecType = null
  await probe('uploads\\'+path).then((probeData) => {
    codecType = probeData.streams[0].codec_type
  })
  return codecType;

}
//to process the video to 360p
async function processVideo(file) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(file.path)
      // .input(stream)
      .withVideoCodec("libx264")
      .withSize("480x360")
      // .withOutputFormat("avi")
      .on("error", (error) => {
        console.log("error :> ", error);
        reject(new Error(error))
      })
      .output("processed\\video\\" + file.filename)
      .on("progress", (progress) => console.log(progress))
      .on("end", function () {
        fs.unlinkSync(file.path);
        console.log("Finished processing");
        resolve()
      })
      .run();
  })
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
      fs.unlinkSync(file.path);

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

//get files list in a folder
const filesList = async (syncCron) => {
  const filesPath = "./uploads/"
  syncCron.running = false

  return new Promise((resolve, reject) => {

    fs.readdir(filesPath, (err, files) => {
      files.forEach(async (file) => {
        const type = await getCodecType(file)
        const fileData = {
          filename: file,
          path:"uploads\\"+file
        }
        console.log('------------------------------------------------------------------')
        console.log(fileData)
        if (type == "video") {
          await processVideo(fileData);
        } else {
          await processAudio(fileData);
        }
      })
    })
    // syncCron.running= true

    resolve()
  })
}
//if image sending the file directly to the image folder
const getStorePath = (file) => {
  const type = file.mimetype.split("/")[0];
  const path = type == "image" ? "processed/image" : "uploads";
  return path;
};

module.exports = { getDataResolution, getStorePath, processData,filesList };
