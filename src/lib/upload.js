const cloudinary = require("../../cloudinary-setup");
/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: "appsnip",
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    const { public_id, secure_url } = result;
    return { publicId: public_id, imgUrl: secure_url };
  } catch (error) {
    console.error(error);
  }
};

async function uploadToCloudinaryMiddleware(req, res, next) {
  if (req.file) {
    const file = req.file;
    const uploadData = await uploadImage(file.path);
    // TODO: delete file
    req.uploadedImg = uploadData;
  }
  next();
}

module.exports = {
  screenshotUploader: uploadImage,
  uploadToCloudinaryMiddleware,
};
