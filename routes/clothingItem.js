const router = require("express").Router();
const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItem");

router.post("/", createItem);
router.get("/", getItems);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", dislikeItem);
router.delete("/items/:id", deleteItem);

module.exports = router;
