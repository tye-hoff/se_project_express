const ClothingItem = require("../models/clothingItem");
const errors = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(errors.SUCCESS_ERROR).send(items);
    })
    .catch(() => {
      res
        .status(errors.INCOMPLETE_REQUEST_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user.id })
    .then((item) => {
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
      return res
        .status(errors.INCOMPLETE_REQUEST_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      res
        .status(errors.SUCCESS_ERROR)
        .send({ message: "data.message", updatedItem });
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(errors.NOT_FOUND_ERROR)
          .send({ message: error.message });
      }
      if (error.name === "CastError") {
        res.status(errors.BAD_REQUEST_ERROR).send({ message: error.message });
      }
      return res
        .status(errors.INCOMPLETE_REQUEST_ERROR)
        .send({ message: "An error has occured on the server" });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      res
        .status(errors.SUCCESS_ERROR)
        .send({ message: "data.message", updatedItem });
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(errors.NOT_FOUND_ERROR)
          .send({ message: error.message });
      }
      if (error.name === "CastError") {
        res.status(errors.BAD_REQUEST_ERROR).send({ message: "data.message" });
      }
      return res
        .status(errors.INCOMPLETE_REQUEST_ERROR)
        .send({ message: "An error has occured on the server" });
    });

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .then((deletedItem) => {
      res
        .status(errors.SUCCESS_ERROR)
        .send({ message: "data.message", deletedItem });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(errors.BAD_REQUEST_ERROR).send({ message: "data.message" });
      }
      if (error.name === "DocumentNotFoundError") {
        res.status(errors.NOT_FOUND_ERROR).send({ message: "data.message" });
      }
      return res
        .status(error.INCOMPLETE_REQUEST_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { createItem, getItems, likeItem, dislikeItem, deleteItem };
