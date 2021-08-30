const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  ref: mongoose.Types.ObjectId,
  name: String,
});

module.exports = mongoose.model("RefApp", Schema);
