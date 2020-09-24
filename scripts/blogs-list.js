const { readdir, readFile, writeFile } = require("fs").promises;
const fm = require("front-matter");

(async () => {
  // Let's get all the files list
  const filesList = (await readdir("../src/blog/")).filter((file) =>
    file.endsWith(".md")
  );

  /**
   * @type {{[blogID: string] : {id: string, date: Date}[]}}
   */
  let seriesList = {};

  for (let file of filesList) {
    const filePath = `../src/blog/${file}`;

    // Data
    const data = await readFile(filePath, "utf-8");

    const fileName = file.split(".")[0];

    // Get the metadata inside the markdown
    let {
      attributes: { date, series },
    } = fm(data);

    date = new Date(date);

    if (series) {
      if (!(series in seriesList)) {
        seriesList[series] = [];
      }

      seriesList[series].push({ id: fileName, date });
    }
  }

  // The final list of data
  let finaldata = [];

  console.log("--------- Generating blogs list -----------");

  for (let file of filesList) {
    const filePath = `../src/blog/${file}`;

    // Data
    const data = await readFile(filePath, "utf-8");

    const fileName = file.split(".")[0];

    // Get the metadata inside the markdown
    const {
      attributes: { title, description, date, published = true, series },
    } = fm(data);

    let seriesIndex = null;

    if (series) {
      let seriesPosts = seriesList[series].sort((a, b) => a.date - b.date);

      seriesIndex = seriesPosts.findIndex(({ id }) => id === fileName) + 1;
    }

    // Let's push
    published &&
      finaldata.push({
        title,
        description,
        date,
        id: fileName,
        series,
        seriesIndex,
      });
  }

  finaldata = finaldata.sort((a, b) => {
    const date1 = new Date(a.date);
    const date2 = new Date(b.date);

    return date2 > date1 ? 1 : -1;
  });

  // Write data
  await writeFile("../static/data/blogs-list.json", JSON.stringify(finaldata));

  console.log("---------- Generated ------------");
})();
