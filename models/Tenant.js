const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const redis = require("../db/Redis");

const Schema = new mongoose.Schema({
  name: String,
  apps: [{ type: mongoose.Types.ObjectId, ref: "RefApp" }],
});

module.exports = mongoose.model("Tenant", Schema);
