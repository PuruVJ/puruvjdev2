const { access, mkdir, readdir, readFile, writeFile } = require("fs").promises;
const fs = require("fs");
const imagemin = require("imagemin");
const webp = require("imagemin-webp");
const jpg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const imgSize = require("image-size");
const resizeImg = require("resize-img");
const { getColorFromURL } = require("color-thief-node");
const { optimizeGif, gifMarkup } = require("./gif-module");

/**
 * Optimize the image and create its different versions
 * Assuming the image is media folder in assets
 * @param {string} src
 */
async function optimizeBlogImages(src, returnMarkup = true) {
  // Start measuring
  console.log("Starting to retrieve/create image/data");

  // First off, don't optimize this image and save us some CPU time if it
  // already exists
  // First get the filename
  const [filePath, baseFolder] = src.split("/").reverse();
  const [fileName] = filePath.split(".");

  const [format] = filePath.split(".").reverse();
  const folderPath = `../static/${baseFolder}/${fileName}`;

  console.log(format);

  // The list of file paths to return
  const list = {
    large: {
      webp: `${baseFolder}/${fileName}/large.webp`,
      org: `${baseFolder}/${fileName}/large.${format}`,
    },
    small: {
      webp: `${baseFolder}/${fileName}/small.webp`,
      org: `${baseFolder}/${fileName}/small.${format}`,
    },
    aspectHTW: 1,
    color: [34, 34, 34],
  };

  let shouldOptimize = true;

  // Check if this folder exists
  try {
    shouldOptimize = !!(await access(folderPath));

    if (
      !shouldOptimize &&
      (await readdir(folderPath)).includes("data.json") &&
      format !== "gif"
    ) {
      // The data file exists. Get the aspect ratio from there
      const { aspectHTW, color } = JSON.parse(
        await readFile(`${folderPath}/data.json`, "utf-8")
      );

      list.aspectHTW = aspectHTW;
      list.color = color;
    }
  } catch (e) {}

  // The markup

  // Should not optimize, if not gif
  if (!shouldOptimize && format !== "gif") {
    // Log the time
    console.log(`Finished.`);
    console.log();
    return returnMarkup ? markup(list, format) : list;
  }

  // Optimize if GIF
  if (format === "gif") {
    // Do the gif-specific optimizations and return early
    console.log("GIF detected!");

    if (shouldOptimize) await optimizeGif(fileName);

    return gifMarkup(fileName);
  }

  // The image is optimizable. That means work, boys!
  // Let's try make the folder
  try {
    await mkdir(`../static/${baseFolder}/${fileName}`);
  } catch (e) {}

  // Ok folder exists
  // Now let's get dimensions of the image
  const dimensions = imgSize(`${folderPath}.${format}`);

  // The aspect ratio
  list.aspectHTW = dimensions.height / dimensions.width;

  // Now resize the image
  const resizedImgBuffers = { large: "", small: "" };

  const imgBuffer = fs.readFileSync(`${folderPath}.${format}`);

  // Large
  resizedImgBuffers.large = await resizeImg(imgBuffer, {
    width: 1200,
    height: list.aspectHTW * 1200,
  });

  // Small
  resizedImgBuffers.small = await resizeImg(imgBuffer, {
    width: 600,
    height: list.aspectHTW * 600,
  });

  // Write inside the folder
  await writeFile(`${folderPath}/large.${format}`, resizedImgBuffers.large);
  await writeFile(`${folderPath}/small.${format}`, resizedImgBuffers.small);

  const fileGlob = [
    `${folderPath}/small.${format}`,
    `${folderPath}/large.${format}`,
  ];
  try {
    // Now optimize and create copies
    await imagemin(fileGlob, {
      destination: folderPath,
      plugins: [
        webp({
          quality: 82,
        }),
      ],
    });
  } catch (e) {
    console.log(e);
  }

  await imagemin(fileGlob, {
    destination: folderPath,
    plugins: [
      jpg({
        quality: 82,
      }),
      pngquant({
        quality: [0.8, 0.85],
      }),
    ],
  });

  // Finally get the dominant color
  list.color = await getColorFromURL(`${folderPath}.${format}`);

  // Also write the data.json
  await writeFile(
    `${folderPath}/data.json`,
    JSON.stringify({
      aspectHTW: list.aspectHTW,
      color: list.color,
    })
  );

  // Log the time
  console.log(`Finished`);
  console.log();

  // Return the list
  return returnMarkup ? markup(list, format) : list;
}

function markup(list, format) {
  const [r, g, b] = list.color;

  return `
  <figure style="width: 100%;padding-top: ${
    list.aspectHTW * 100
  }%;background-color: rgb(${r}, ${g}, ${b})">
    <picture>
      <source
        type="image/webp"
        media="(min-width: 501px)"
        data-srcset="${list.large.webp}"
      ></source>
      <source
        type="image/webp"
        media="(max-width: 500px)"
        data-srcset="${list.small.webp}"
      ></source>
      <source
        type="image/${format}"
        media="(min-width: 501px)"
        data-srcset="${list.large.org}"
      ></source>
      <source
        type="image/${format}"
        media="(max-width: 500px)"
        data-srcset="${list.small.org}"
      ></source>
      <img alt="Placeholder"
      data-src="${list.large.org}"
      class="lazyload blog-img" />
    </picture>
  </figure>
  `;
}

optimizeBlogImages("../static/works/puruvjdev2.png");

module.exports = { optimizeBlogImages };
