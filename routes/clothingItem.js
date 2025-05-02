const router = require("express").Router();
const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
console.log(likeItem);

router.post("/", createItem);
router.get("/", getItems);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", dislikeItem);

module.exports = router;
