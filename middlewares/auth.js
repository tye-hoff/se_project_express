const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../errors/AuthenticationError");
const { JWT_SECRET } = require("../utils/congif");

function authenticate(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("header missing auth");
    return next(new AuthenticationError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  console.log(authorization);
  console.log(token);

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthenticationError("Authorization required"));
  }

  req.user = payload;
  return next();
}

module.exports = { authenticate };
