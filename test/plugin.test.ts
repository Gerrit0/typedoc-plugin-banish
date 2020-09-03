import { load } from "..";
import { Application } from "typedoc";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
import { deepStrictEqual } from "assert";

const app = new Application();
load({ application: app });
app.bootstrap({
  mode: "modules",
  project: join(__dirname, "project", "tsconfig.json"),
});

const project = app.convert(
  app.expandInputFiles([join(__dirname, "project", "index.ts")])
);

if (!project) {
  throw new Error("Failed to convert project!");
}

const specsFile = join(__dirname, "specs_test.json");

app.generateJson(project, specsFile);

function replaceAll(src: string, find: string, replace: string) {
  // Horribly inefficient...
  while (src.includes(find)) {
    src = src.replace(find, replace);
  }
  return src;
}

const content = replaceAll(
  readFileSync(specsFile, "utf-8"),
  __dirname.replace(/\\/g, "/"),
  "%BASE%"
);

writeFileSync(specsFile, content);

const actual = JSON.parse(content);
const expected = JSON.parse(
  readFileSync(join(__dirname, "specs.json"), "utf-8")
);

deepStrictEqual(actual, expected);
