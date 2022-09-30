const cloudinary = require("../../cloudinary-setup");
/////////////////////////
// Uploads an image file
/////////////////////////
// imgStr can be a path, url or base64 uri string
const uploadImage = async (imageStr) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: false,
    unique_filename: false,
    overwrite: false,
    folder: "appsnip",
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imageStr, options);
    const { public_id, secure_url } = result;
    return { publicId: public_id, imgUrl: secure_url };
  } catch (error) {
    console.error(error);
  }
};

async function uploadToCloudinaryMiddleware(req, res, next) {
  if (req.file) {
    const file = req.file;

    // if multer is saving file to tmp dir
    if (file.path) {
      const uploadData = await uploadImage(file.path);
      req.uploadedImg = uploadData;
      // TODO: delete file
    }

    // if multer is saving file to memory
    if (file.buffer) {
      const { mimetype } = file;
      var string64 =
        `data:${mimetype};base64,` + file.buffer.toString("base64");
      const uploadData = await uploadImage(string64);
      req.uploadedImg = uploadData;
    }
  }
  next();
}

module.exports = {
  screenshotUploader: uploadImage,
  uploadToCloudinaryMiddleware,
};
