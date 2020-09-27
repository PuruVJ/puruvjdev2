const YAML = require("YAML");
const {readFile} = require('fs').promises

const worksFilePath = '../src/works.yaml';

const worksFile = YAML.parse()