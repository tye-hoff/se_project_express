const ClothingItem = require("../models/clothingItem");
const errors = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(errors.SUCCESS_ERROR).send(items);
    })
    .catch(() => {
      res.status(errors.INCOMPLETE_REQUEST_ERROR);
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(errors.BAD_REQUEST_ERROR)
          .send({ message: error.message });
      }
      if (error.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST_ERROR)
          .send({ message: error.message });
      }
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      res
        .status(errors.SUCCESS_ERROR)
        .send({ message: "data.message", updatedItem });
    })
    .catch((error) => {
      if (error.name === "NotFoundError") {
        return res
          .status(errors.NOT_FOUND_ERROR)
          .send({ message: error.message });
      }
      if (error.name === "CastError") {
        res.status(errors.BAD_REQUEST_ERROR).send({ message: error.message });
      }
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      res
        .status(errors.SUCCESS_ERROR)
        .send({ message: "data.message", updatedItem });
    })
    .catch((error) => {
      if (error.name === "IncompleteRequestError") {
        res.status(errors.NOT_FOUND_ERROR).send({ message: "data.message" });
      }
    });

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params._id)
    .then((deletedItem) => {
      res
        .status(errors.SUCCESS_ERROR)
        .send({ message: "data.message", deletedItem });
    })
    .catch((error) => {
      if (error.name === "IncompleteRequestError") {
        res.status(errors.NOT_FOUND_ERROR).send({ message: "data.message" });
      }
    });
};

module.exports = { createItem, getItems, likeItem, dislikeItem, deleteItem };
