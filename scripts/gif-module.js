const { mkdir, writeFile } = require("fs").promises;
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fetch = require("node-fetch").default;

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

/**
 * This function converts gif to video and returns the necessary markup
 * @param {string} fileName without extension
 */
async function optimizeGif(fileName) {
  const folderPath = `../static/media/${fileName}`;
  const gifPath = `${folderPath}.gif`;

  try {
    await mkdir(folderPath);
  } catch (e) {}

  const res = await cloudinary.uploader.upload(gifPath, {
    format: "mp4",
    folder: "media",
    transformation: {
      quality: 80,
    },
    use_filename: true,
    overwrite: true,
  });

  console.log(res.url);

  const buffer = await fetch(res.url).then((res) => res.buffer());

  await writeFile(folderPath + "/vidgif.mp4", buffer);

  console.log(`Starting gif conversion: ${fileName}`);

  console.log(`Done with GIF: ${fileName}`);
  console.log();
}

function gifMarkup(fileName) {
  const baseForMarkup = `/media/${fileName}`;

  return `
  <div class="gif-vid-container">
    <video autoplay loop muted playsinline>
      <source src="${baseForMarkup}/${fileName}.mp4" type="video/mp4">
      Your browser doesn't support HTML5 video playback. <a href="${baseForMarkup}.gif" target="_blank" rel="noopener">See the gif here</a>
    </video>
  </div>
  `;
}

module.exports = { optimizeGif, gifMarkup };
