const chalk = require("chalk");
const log = console.log;
const error = chalk.bold.redBright;
const warning = chalk.bold.green;
const info = chalk.bold.cyan;
const success = chalk.bold.yellowBright;
const primary = chalk.bold.whiteBright;
const Text = (text) => {
  return typeof text === "string" ? text : JSON.stringify(text);
};
module.exports = {
  info: (text) => {
    return log(info(Text(text)));
  },
  success: (text) => {
    return log(success(Text(text)));
  },
  primary: (text) => {
    return log(primary(Text(text)));
  },
  warning: (text) => {
    return log(warning(Text(text)));
  },
  error: (text) => {
    return log(error(Text(text)));
  },
  log: (text) => {
    return log(text);
  },
};
