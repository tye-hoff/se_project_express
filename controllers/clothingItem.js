const InternalServerError = require("../errors/InternalServerError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ClothingItem = require("../models/clothingItem");
const errors = require("../utils/errors");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(errors.SUCCESS).send(items);
    })
    .catch(() =>
      next(new InternalServerError("An error has occured on the server"))
    );
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError(error.message));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError(error.message));
      }
      return next(
        new InternalServerError("An error has occured on the server")
      );
    });
};

const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      res.status(errors.SUCCESS).send({ message: "data.message", updatedItem });
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("404 not found"));
      }
      if (error.name === "CastError") {
        next(new BadRequestError(error.message));
      }
      return next(
        new InternalServerError("An error has occured on the server")
      );
    });

const dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      res.status(errors.SUCCESS).send({ message: "data.message", updatedItem });
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError("404 not found"));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError(error.message));
      }
      return next(
        new InternalServerError("An error has occured on the server")
      );
    });

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.id)
    .orFail()
    .then((item) => {
      if (req.user._id.toString() === item.owner.toString()) {
        return ClothingItem.deleteOne(item).then(() => {
          res.send({ message: "Item deleted" });
        });
      }
      return res
        .status(errors.PERMISSION_ERROR)
        .send({ message: "You do not have permission to delete" });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError(error.message));
      }
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError("404 not found"));
      }
      return next(
        new InternalServerError("An error has occured on the server")
      );
    });
};

module.exports = { createItem, getItems, likeItem, dislikeItem, deleteItem };
