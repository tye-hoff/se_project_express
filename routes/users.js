const router = require("express").Router();
const { createUser, getCurrentUser } = require("../controllers/users");

router.post("/", createUser);
router.get("/:id", getCurrentUser);

module.exports = router;
