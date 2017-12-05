const os = require("os");
const path = require("path");
const winston = require("winston");
const moment = require("moment");

const platform = os.platform();
const nodeEnvironment = process.env.NODE_ENV || "production";

let loggingFile = path.join(
  platform === "win32" ? process.env.HOMEPATH : process.env.HOME,
  ".sjcloud/log.txt"
);

let logLevel = "";

if (process.env.LOG_LEVEL) {
  logLevel = process.env.LOG_LEVEL;
} else if (nodeEnvironment === "production") {
  logLevel = "info";
} else logLevel = "debug";

let logging = new (winston.Logger)({
  level: logLevel,
  handleExceptions: false,
  transports: [
    new (winston.transports.Console)({
      timestamp() {
        return moment().format('YYYY-MM-DD HH:mm:ss.SSSS');
      },
      formatter(params: any) {
        return `[${params.timestamp()}] [${params.level.padEnd(6)}] *** ${params.message}`;
      },
    }),
  ],
});

if (loggingFile !== "") {
  logging.add(winston.transports.File, {
    filename: loggingFile,
    level: logLevel,
    json: false,
  });
}

export {
  logging,
  logLevel
}