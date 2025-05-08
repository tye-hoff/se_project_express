const errors = require("../utils/errors");

function authenticate(req, res, next) {
  const token = authorization.replace("Bearer", "");

  if (token === "MySecretToken") {
    next();
  } else {
    res.status(errors.AUTHENTICATION_ERROR).send({ message: err.message });
  }
}

auth.use(authenticate);

payload = jwt.verify(token, JWT_SECRET);

module.exports = auth;
