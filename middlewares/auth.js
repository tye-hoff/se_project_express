const jwt = require("jsonwebtoken");
const errors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/congif");

function authenticate(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(errors.AUTHENTICATION_ERROR)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(errors.AUTHENTICATION_ERROR)
      .send({ message: "Authorization required" });
  }

  req.user = payload;
  return next();
}

module.exports = { authenticate };
