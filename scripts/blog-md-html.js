const { readdir, readFile, writeFile } = require("fs").promises;
const markdown = require("markdown-it");
const shiki = require("shiki");
const fm = require("front-matter");
const { optimizeBlogImages } = require("./optimize-images");
const { JSDOM } = require("jsdom");
const slugify = require("slugify");

(async () => {
  // Shiki instance
  const highlighter = await shiki.getHighlighter({
    theme: "material-theme-palenight",
  });

  // Prepare md for shiki
  const md = markdown({ html: true, highlight: highlighter.codeToHtml });

  // Parse the links in a different way
  // Remember old renderer, if overridden, or proxy to default renderer
  const defaultRender =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) =>
      self.renderToken(tokens, idx, options));

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    // If you are sure other plugins can't add `target` - drop check below
    var aIndex = tokens[idx].attrIndex("target");

    if (aIndex < 0) {
      tokens[idx].attrPush(["target", "_blank"]); // add new attribute
    } else {
      tokens[idx].attrs[aIndex][1] = "_blank"; // replace value of existing attr
    }

    // Add no-opener
    tokens[idx].attrPush(["rel", "noopener"]);
    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };

  // get all blogs in directory
  const filesAbs = (await readdir("../src/blog")).filter((file) =>
    file.endsWith(".md")
  );

  const files = filesAbs.map((absFile) => `../src/blog/${absFile}`);

  // Let's do it
  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const fileName = filesAbs[i].split(".")[0];

    console.log(filePath);
    // Let's get the contents of the file
    const fileData = await readFile(filePath, "utf-8");

    // Get the metadata inside the markdown
    const { attributes, body } = fm(fileData);

    const published =
      attributes.published == null ? true : attributes.published;

    // Skip everything if not published
    if (!published) continue;

    // Reset the cover image if required
    attributes.cover_image =
      attributes.cover_image || "media/blog-social-intro.png";

    // Let's render it
    let html = md.render(body);

    // The dom representation
    const { document } = new JSDOM(html).window;

    // Get all the image tags
    const imgs = document.querySelectorAll("img");

    for (let img of imgs) {
      // Lets collect values of `src`
      const src = img.src;

      // Let's make this image useless
      img.src = "";
      img.style.display = "none";

      console.log(src);

      // Now lets put the picture tag in there
      const divContainer = document.createElement("div");
      divContainer.classList.add("picture-container");

      // Let's add the main stuff to this picture
      divContainer.innerHTML = await optimizeBlogImages(src);

      // Put it after the img
      img.after(divContainer);
    }

    // Now work on the headings
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    for (let heading of headings) {
      const headingVal = heading.innerHTML;
      const slug = slugify(headingVal);

      heading.innerHTML = `<a href="blog/${fileName}#${slug}">#</a>${headingVal}`;
      heading.id = slug;
    }

    // Finally
    html = document.body.innerHTML;

    await writeFile(
      `../static/blog/${fileName}.json`,
      JSON.stringify({ ...attributes, body: html, id: fileName })
    );
  }
})();
