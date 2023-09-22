const { logEvents } = require("./logger.js");

const errorHandler = (err, req, res, next) => {
  console.log("error handler");
  console.log("err", JSON.stringify(err));
  logEvents(
    `${err?.name}\t${err?.message}\t${err?.method}\t${err?.url}\t${err?.headers?.origin}\n`,
    "errLog.log"
  );
  console.log("err.stack", err?.stack);
  console.log("res", JSON.stringify(res.statusCode));
  const status = res.statusCode ? res.statusCode : 500; //server error
  // const status = 500;
  res.status(status).json({ message: err.message, isError: true });
  //   next();
};

module.exports = errorHandler;
