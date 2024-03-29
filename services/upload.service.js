const { getDataResolution, processData } = require("../utils/helper.util");
const fs = require("fs");

async function getData() {
  return {
    data: [1, 2, 3],
    message: "hello user!",
  };
}

async function createData(file) {
  console.log("create data file :> ", file);
  const type = file.mimetype.split("/")[0];
  if (type == "image") return { Status: "Success", Message: "Image Uploaded!" };

  const resolution = await getDataResolution(type, file.path);

  //already under the desired resolution, just moving the files
  if (
    (type == "audio" && Number(resolution) <= 128000) ||
    (type == "video" && Number(resolution) <= 360)
  ) {
    const new_path = "processed\\" + type + "\\" + file.filename;
    fs.rename(file.path, new_path, function (err) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("file is moved successfully");
    });

    return { status: "success", message: type + " Uploaded!" };
  }
  console.log("ready to convert");
  // await processData(type, file);
  return { status: "success", message: type + " Uploaded!" };
    
}

module.exports = { getData, createData };
