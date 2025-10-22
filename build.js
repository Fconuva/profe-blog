const Eleventy = require("@11ty/eleventy");

async function build() {
  let elev = new Eleventy("./", "./_site");
  await elev.write();
}

build().catch(console.error);
