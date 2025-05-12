const errors = require("../utils/errors");
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(errors.AUTHENTICATION_ERROR)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer", "");
  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return res
      .status(errors.AUTHENTICATION_ERROR)
      .send({ message: "Authorization required" });
  }

  req.user = payload;
  return next();
}

module.exports = { authenticate };
