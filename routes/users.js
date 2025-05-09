const router = require("express").Router();
const {
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.post("/", createUser);
router.get("/:id", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
