const { default: slugify } = require("slugify");

/**
 * Adds the hash links to the headings
 * @param {Document} document
 * @param {string} fileName
 */
async function headingsWithAnchorsPlugin(document, fileName) {
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  for (let heading of headings) {
    const headingVal = heading.innerHTML;
    const slug = slugify(headingVal);

    heading.innerHTML = `<a href="blog/${fileName}#${slug}">#</a>${headingVal}`;
    heading.id = slug;
  }

  return { document };
}

module.exports = { headingsWithAnchorsPlugin };
