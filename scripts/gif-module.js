const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffprobe = require("@ffprobe-installer/ffprobe");
const { mkdir } = require("fs").promises;
const { resolve: absPath } = require("path");

const ffmpeg = require("fluent-ffmpeg")()
  .setFfprobePath(ffprobe.path)
  .setFfmpegPath(ffmpegInstaller.path);

/**
 * This function converts gif to video and returns the necessary markup
 * @param {string} fileName without extension
 */
async function optimizeGif(fileName = "dumbledore-pretty-hard") {
  const folderPath = `../static/media/${fileName}`;
  const gifPath = `${folderPath}.gif`;

  try {
    await mkdir(folderPath);
  } catch (e) {}

  console.log(`Starting gif conversion: ${fileName}`);

  await new Promise((resolve) =>
    ffmpeg
      .input(gifPath)
      .inputOption("-f gif")
      .outputOptions([
        "-pix_fmt yuv420p",
        "-c:v libx264",
        "-movflags +faststart",
        "-filter:v crop='floor(in_w/2)*2:floor(in_h/2)*2'",
      ])
      .noAudio()
      .output(`${folderPath}/vidgif.mp4`)
      .on("end", () => {
        resolve();
      })
      .on("error", (e) => console.log(e))
      .run()
  );
  console.log(`Done with GIF: ${fileName}`);
  console.log();
}

function gifMarkup(fileName) {
  const baseForMarkup = `/media/${fileName}`;

  return `
  <div class="gif-vid-container">
    <video autoplay loop muted playsinline>
      <source src="${baseForMarkup}/vidgif.mp4" type="video/mp4">
      Your browser doesn't support HTML5 video playback. <a href="${baseForMarkup}.gif" target="_blank" rel="noopener">See the gif here</a>
    </video>
  </div>
  `;
}

module.exports = { optimizeGif, gifMarkup };
