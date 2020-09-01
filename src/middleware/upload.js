const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const mongoHost = process.env.MONGO_HOST
const mongoUserName = process.env.MONGO_USERNAME
const mongoPassword = process.env.MONGO_PASSWORD
const mongoDB = `mongodb+srv://${mongoUserName}:${mongoPassword}@${mongoHost}`;

var storage = new GridFsStorage({
  url: mongoDB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const photoMatch = ["image/png", "image/jpeg"];
    const audioMatch = ["audio/aac"];

    console.log(file)

    if (photoMatch.indexOf(file.mimetype) !== -1) {
      return {
        bucketName: "photos",
        filename: `${Date.now()}-origami-${file.originalname}`
      }
    } else if (audioMatch.indexOf(file.mimetype) !== -1) {
      return {
        bucketName: "audios",
        filename: `${Date.now()}-origami-${file.originalname}.aac`
      }
    } else {
      const filename = `${Date.now()}-origami-${file.originalname}`;
      return filename;
    }
  }
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
