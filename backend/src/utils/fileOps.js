const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function appendText(filePath, text) {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.appendFileSync(filePath, `${text}\n`, 'utf8');
}

module.exports = {
  ensureDir,
  writeJson,
  readJson,
  appendText,
};