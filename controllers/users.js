const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/congif");
const BadRequestError = require("../errors/BadRequestError");
const AuthenticationError = require("../errors/AuthenticationError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      console.log("user", user);
      return res.status(errors.CREATED).send(userObject);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      }
      if (err.code === 11000) {
        next(new ConflictError("Duplicate detected"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.status(errors.SUCCESS).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        next(new NotFoundError("Failed to find user"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  if (!email || !password) {
    return next(new BadRequestError("Email Required"));
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (
        err.message === "Incorrect email or password" ||
        err.message === "Password does not match"
      ) {
        next(new AuthenticationError(err.message));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      res.send({ message: "user not found" });
    })
    .then((updatedUser) => {
      res.status(errors.SUCCESS).send({ message: "data.message", updatedUser });
      return updatedUser;
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad request"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Could not find"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  loginUser,
  updateUser,
};

// OLD CODE

// const createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;

//   return bcrypt
//     .hash(password, 10)
//     .then((hash) => User.create({ name, avatar, email, password: hash }))
//     .then((user) => {
//       const userObject = user.toObject();
//       delete userObject.password;
//       console.log("user", user);
//       return res.status(errors.CREATED).send({ userObject });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res
//           .status(errors.BAD_REQUEST_ERROR)
//           .send({ message: err.message });
//       }
//       if (err.code === 11000) {
//         return res
//           .status(errors.CONFLICT_ERROR)
//           .send({ message: "duplicate email error" });
//       }
//       return res
//         .status(errors.INTERNAL_SERVER_ERROR)
//         .send({ message: err.message });
//     });
// };

// const getCurrentUser = (req, res) => {
//   const { _id } = req.user;

//   User.findById(_id)
//     .orFail()
//     .then((user) => res.status(errors.SUCCESS).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(errors.NOT_FOUND_ERROR)
//           .send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(errors.BAD_REQUEST_ERROR)
//           .send({ message: err.message });
//       }
//       return res
//         .status(errors.INTERNAL_SERVER_ERROR)
//         .send({ message: err.message });
//     });
// };

// const loginUser = (req, res) => {
//   const { email, password } = req.body;
//   console.log(email);
//   if (!email || !password) {
//     res.status(errors.BAD_REQUEST_ERROR).send({ message: "email required" });
//     return;
//   }
//   User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//         expiresIn: "7d",
//       });
//       res.send({ token, user });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (
//         err.message === "Incorrect email or password" ||
//         err.message === "Password does not match"
//       ) {
//         return res
//           .status(errors.AUTHENTICATION_ERROR)
//           .send({ message: err.message });
//       }
//       return res
//         .status(errors.INTERNAL_SERVER_ERROR)
//         .send({ message: err.message });
//     });
// };

// const updateUser = (req, res) => {
//   const { name, avatar } = req.body;

//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, avatar },
//     { new: true, runValidators: true }
//   )
//     .orFail(() => {
//       res.send({ message: "user not found" });
//     })
//     .then((updatedUser) => {
//       res.status(errors.SUCCESS).send({ message: "data.message", updatedUser });
//       return updatedUser;
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         return res
//           .status(errors.BAD_REQUEST_ERROR)
//           .send({ message: err.message });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(errors.NOT_FOUND_ERROR)
//           .send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(errors.BAD_REQUEST_ERROR)
//           .send({ message: err.message });
//       }
//       return res
//         .status(errors.INTERNAL_SERVER_ERROR)
//         .send({ message: err.message });
//     });
// };
