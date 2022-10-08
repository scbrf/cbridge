const bunyan = require("bunyan");

module.exports = (name, opt = {}) => {
  const opts = {
    name,
    level: "debug",
    streams: [
      {
        level: process.env.NODE_ENV === "test" ? "error" : "debug",
        stream: process.stdout,
      },
    ],
    ...opt,
  };
  if (process.env.NODE_ENV !== "test") {
    const logBase = require("path").join(__dirname, "..", "DATA", "logs");
    if (!require("fs").existsSync(logBase)) {
      require("fs").mkdirSync(logBase, { recursive: true });
    }
    opts.streams = [
      ...opts.streams,
      {
        level: "info",
        path: require("path").join(logBase, `${name}.log`),
      },
      {
        level: "error",
        path: require("path").join(logBase, `__error.log`),
      },
    ];
  }
  return bunyan.createLogger(opts);
};
