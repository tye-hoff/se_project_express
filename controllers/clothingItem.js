const ClothingItem = require("../models/clothingItem");
const errors = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({}).then((items) => {
    res.status(errors.SUCCESS_ERROR).send(items);
  });
};

const createItem = (req, res) => {
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(errors.BAD_REQUEST_ERROR)
          .send({ message: e.message });
      }
      res
        .status(errors.INCOMPLETE_REQUEST_ERROR)
        .send({ message: "error from creatItem", e });
      console.log(e);
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  ).then((updatedItem) => {
    res
      .status(errors.BAD_REQUEST_ERROR)
      .send({ message: "data.message", updatedItem });
  });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  ).then((updatedItem) => {
    res
      .status(errors.BAD_REQUEST_ERROR)
      .send({ message: "data.message", updatedItem });
  });

module.exports = { createItem, getItems, likeItem, dislikeItem };
