const errors = require("../utils/errors");

function authenticate(req, res, next) {
  console.log(req.headers);
  const authorization = req.headers.authorization;
  const token = authorization.replace("Bearer", "");

  if (token === "MySecretToken") {
    next();
  } else {
    res.status(errors.AUTHENTICATION_ERROR).send({ message: err.message });
  }
  payload = jwt.verify(token, JWT_SECRET);
  req.user = payload;
  return next();
}

module.exports = { authenticate };
