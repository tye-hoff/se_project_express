const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { updateExistingUser } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", updateExistingUser, updateUser);

module.exports = router;
