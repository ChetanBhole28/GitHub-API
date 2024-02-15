const fs = require("fs");

const logger = function (headers, body, url, message, request_id) {
  const log =
    "\n" +
    JSON.stringify({
      headers,
      url,
      body,
      // method: method,
      message,
      request_id,
    });

  fs.appendFile("log.txt", log);
};

module.exports = {
    log : logger
};