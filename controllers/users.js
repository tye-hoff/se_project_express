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
    .then((user) => {
      delete user.password;
      console.log("user", user);
      return res.status(errors.CREATED_ERROR).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(errors.BAD_REQUEST_ERROR)
          .send({ message: err.message });
      }
      if (err.name === "DefaultError") {
        return res
          .status(errors.INCOMPLETE_REQUEST_ERROR)
          .send({ message: err.message });
      } else if (err.name === "DuplicateError") {
        return res
          .status(errors.DUPLICATE_ERROR)
          .send({ message: err.message });
      }
      return res.status(errors.CONFLICT_ERROR).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
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

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true })
    .orFail(() => {
      res.send({ message: "user not found" });
    })
    .then((updatedUser) => {
      res
        .status(errors.SUCCESS_ERROR)
        .send({ message: "data.message", updatedUser });
      return updatedUser;
    })
    .catch((err) => {
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
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  loginUser,
  updateUser,
};
