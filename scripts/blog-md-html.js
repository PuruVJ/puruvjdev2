const { readdir, readFile, writeFile } = require("fs").promises;
const markdown = require("markdown-it");
const shiki = require("shiki");
const fm = require("front-matter");
const { JSDOM } = require("jsdom");
const readingTime = require("reading-time");
const { imageOptimMarkupPlugin } = require("./blog-plugins/image-optim-markup");
const { headingsWithAnchorsPlugin } = require("./blog-plugins/headings-anchor");
const {
  convertToTwitterEmojisPlugin,
} = require("./blog-plugins/twitter-emojis");

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

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    tokens[idx].attrPush(["class", "feature-image"]);
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
    let { document } = new JSDOM(html).window;

    // Images
    ({ document } = await imageOptimMarkupPlugin(document));

    // Now work on the headings
    ({ document } = await headingsWithAnchorsPlugin(document, fileName));

    // Emojis
    ({ document } = await convertToTwitterEmojisPlugin(document));

    // Finally
    html = document.body.innerHTML;
    const reading_time = readingTime(html, { wordsPerMinute: 300 }).minutes;

    await writeFile(
      `../static/blog/${fileName}.json`,
      JSON.stringify({
        ...attributes,
        body: html,
        id: fileName,
        reading_time,
      })
    );
  }
})();
