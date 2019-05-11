const { http, log } = require("lastejobb");
const config = require("./config");

// Metadata fra kartet
http
  .downloadBinary(
    `http://data.artsdatabanken.no/metadata_med_undertyper.json`,
    config.datakilde.metabase
  )
  .catch(err => {
    log.fatal(err);
  });
