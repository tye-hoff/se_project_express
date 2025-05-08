const router = require("express").Router();
const clothingItem = require("./clothingItem");
const errors = require("../utils/errors");
const { loginUser } = require("../controllers/users");

const userRouter = require("./users");

router.post("/signin", loginUser);
router.post("/signup", loginUser);

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(errors.NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
