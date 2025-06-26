const router = require("express").Router();
const clothingItem = require("./clothingItem");
const errors = require("../utils/errors");
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

router.use((req, res) => {
  res.status(errors.NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
