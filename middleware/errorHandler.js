const { logEvents } = require("./logger.js");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err?.name}\t${err?.message}\t${err?.method}\t${err?.url}\t${err?.headers?.origin}\n`,
    "errLog.log"
  );
  // const status = res.statusCode ? res.statusCode : 500; //server error
  console.log("res", err);
  const status = 500;
  res.status(status).json({ message: err.message, isError: true });
  //   next();
};

module.exports = errorHandler;
