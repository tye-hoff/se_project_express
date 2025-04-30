const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({});

module.exports = mongoose.model("item", itemSchema);