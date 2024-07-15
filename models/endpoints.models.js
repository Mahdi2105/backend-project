const fs = require("fs/promises");
const path = require("path");

exports.readEndpoints = () => {
  const filePath = path.join(__dirname, "../endpoints.json");
  return fs.readFile(filePath, "utf-8").then((endpoints) => {
    const parsedEndpoints = JSON.parse(endpoints);
    return parsedEndpoints;
  });
};
