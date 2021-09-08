const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Redis = require("ioredis");
const publisher = new Redis();

const Schema = new mongoose.Schema({
  name: String,
});

Schema.post("save", (model) => {
  publisher.publish("tenant", JSON.stringify(model));
});

module.exports = mongoose.model("Tenant", Schema);
