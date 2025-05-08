const User = require("../models/user");
const errors = require("../utils/errors");
const JWT_SECRET = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(errors.SUCCESS_ERROR).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(errors.INCOMPLETE_REQUEST_ERROR)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.create({ name, avatar, email, password })
    .then((user) => res.status(errors.CREATED_ERROR).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(errors.BAD_REQUEST_ERROR).send({ message: err.message });
      }
      if (err.name === "DefaultError") {
        res
          .status(errors.INCOMPLETE_REQUEST_ERROR)
          .send({ message: err.message });
      } else if (err.name === "DuplicateError") {
        res.status(errors.DUPLICATE_ERROR).send({ message: err.message });
      } else {
        res.status(errors.CONFLICT_ERROR).send({ message: err.message });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(errors.SUCCESS_ERROR).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errors.NOT_FOUND_ERROR)
          .send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST_ERROR)
          .send({ message: err.message });
      }
      return res
        .status(errors.INCOMPLETE_REQUEST_ERROR)
        .send({ message: err.message });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      return res
        .status(errors.AUTHENTICATION_ERROR)
        .send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser, loginUser };
