const router = require("express").Router();
const { authenticate } = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");
const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItem");

router.get("/", getItems);
router.use(authenticate);
router.post("/", validateCardBody, createItem);
router.put("/:id/likes", validateId, likeItem);
router.delete("/:id/likes", validateId, dislikeItem);
router.delete("/:id", validateId, deleteItem);

module.exports = router;
