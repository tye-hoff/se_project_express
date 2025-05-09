const router = require("express").Router();
const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItem");
const { authenticate } = require("../middlewares/auth");

router.get("/", getItems);

router.use(authenticate);
router.post("/", createItem);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", dislikeItem);
router.delete("/:id", deleteItem);

module.exports = router;
