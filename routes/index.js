const router = require("express").Router();
const clothingItem = require("./clothingItem");
// const errors = require("../utils/errors");
const NotFoundError = require("../errors/NotFoundError");
const { loginUser, createUser } = require("../controllers/users");
const { authenticate } = require("../middlewares/auth");
const {
  validateUserLogin,
  validateNewUserBody,
} = require("../middlewares/validation");

const userRouter = require("./users");

router.post("/signin", validateUserLogin, loginUser);
router.post("/signup", validateNewUserBody, createUser);
router.use("/items", clothingItem);
router.use(authenticate);
router.use("/users", userRouter);

router.use("*", (req, res, next) => {
  next(new NotFoundError("requested resource not found"));
});

module.exports = router;
