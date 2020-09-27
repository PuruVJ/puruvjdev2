const YAML = require("yaml");
const { optimizeBlogImages } = require("./optimize-images");
const { readFile, writeFile } = require("fs").promises;

(async () => {
  const worksFilePath = await readFile("../src/works.yaml", "utf-8");

  /**
   * @type {
   {
      title: string; 
      url: string; 
      stack: string; 
      description: string;
      image: string;
      repo: {
        url: string;
        type: string
      }
    }[]
  }
   */
  const works = YAML.parse(worksFilePath);

  const dataToCreate = [];

  for (let work of works) {
    const { image } = work;
    work.image = await optimizeBlogImages(`../static/works/${image}`, false);

    dataToCreate.push(work);
  }

  await writeFile("../static/data/works.json", JSON.stringify(dataToCreate));
})();
