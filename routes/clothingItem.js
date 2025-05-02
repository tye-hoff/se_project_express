const router = require("express").Router();
const {
  createItem,
  getItems,
  likeItem,
} = require("../controllers/clothingItem");
console.log(likeItem);

router.post("/", createItem);
router.get("/", getItems);
router.put("/:id/likes", likeItem);

module.exports = router;
