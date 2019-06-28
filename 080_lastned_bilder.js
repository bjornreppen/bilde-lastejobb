const path = require("path");
const { log, io } = require("lastejobb");
const fetch = require("node-fetch");

throw new Error("Hvorfor laster vi fra output katalogen?");

var kilder = io.lesDatafil("mediakilde.json").items;

const queue = [];

kilder.forEach(node => {
  const mediakilde = node.mediakilde;
  if (mediakilde) queue.push({ kode: node.kode, mediakilde: mediakilde });
});
log.info("Download queue items: " + queue.length);

processQueue();

async function processQueue() {
  const pending = queue.pop();
  await download(pending.kode, pending.mediakilde);
  if (queue.length > 0) processQueue();
}

async function download(kode, mediakilde) {
  if (!mediakilde) return;
  Object.keys(mediakilde).forEach(key => {
    let urls = mediakilde[key];
    if (!Array.isArray(urls)) urls = [urls];
    urls.forEach(url => {
      //      const ext = url.endsWith(".png") ? ".png" : ".jpg";
      const ext = path.extname(url);
      const dir = path.join("data/" + key + "/");
      const fn = dir + kode + ext;
      if (io.fileExists(fn)) return;
      io.mkdir(dir);
      downloadBinary(url, fn);
    });
  });
}

async function downloadBinary(url, targetFile) {
  log.info("Download binary " + url);
  const response = await fetch(url).then();
  const buffer = await response.buffer();
  io.writeBinary(targetFile, buffer);
  await sleep(9000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
