const { rateLimit } = require("express-rate-limit");
const logEvents = require("./logger");
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 requests per `window` per minute (here, per 1 minutes)
  standardHeaders: "draft-7", // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
  message: {
    message: "Too many login attapts from this IP,please try again after 60min",
  },
  handler: (request, response, next, options) => {
    logEvents(
      `Too many requests: ${options.message.message}\t${req.methos}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    response.status(options.statusCode).send(options.message);
  },
});

module.exports = limiter;
