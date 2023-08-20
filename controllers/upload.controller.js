const uploadServices = require("../services/upload.service");

async function create(req, res, next) {
  try {
    // convertVid.processVideo(req.file);
    res.json(await uploadServices.createData(req.file));
  } catch (err) {
    console.error(`Error while getting programming languages`, err.message);
    next(err);
  }
}

async function get(req, res, next) {
  try {
    console.log(uploadServices.getData());
    res.json(await uploadServices.getData());
  } catch (err) {
    console.error(`Error while getting programming languages`, err.message);
    next(err);
  }
}

module.exports = {
  get,
  create,
};
