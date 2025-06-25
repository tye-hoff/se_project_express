const { celebrate, Joi } = require("celebrate");
const router = require("express").Router();
const { authenticate } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItem");

router.get("/", getItems);
router.use(authenticate);
router.post("/", createItem);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", dislikeItem);
router.delete("/:id", deleteItem);

// router.post(
//   "/",
//   celebrate({
//     body: Joi.object().keys({
//       name: Joi.string().required().min(2).max(30),
//       imageUrl: Joi.string().required().custom(validateURL).messages({
//         "string.empty": 'The "imageUrl" field must be filled in',
//         "string.uri": 'the "imageUrl" field must be a valid url',
//       }),
//     }),
//   }),
//   createItem
// );

// router.delete(
//   "/:id",
//   celebrate({
//     params: Joi.object().keys({
//       postId: Joi.string().alphanum().length(24),
//     }),
//     headers: Joi.object()
//       .keys({
//         // validate headers
//       })
//       .unknown(true),
//     query: Joi.object()
//       .keys({
//         // validate query
//       })
//       .unknown(true),
//   }),
//   deleteItem
// );

module.exports = router;
