require("dotenv").config();
const express = require("express");
const app = express();
const chalk = require("chalk");
const cors = require("cors");
const mdb = require("./db/MongoDB");
const fs = require("fs");
const jwt = require("express-jwt");
const guard = require("express-jwt-permissions")();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const Tenant = require("./models/Tenant");

const publicKey = fs.readFileSync("./public.key", "utf8");

app.use(jwt({ secret: publicKey, algorithms: ["RS256"] }));

app.use(guard.check("tenant:read"));

app.get("/:tenantId?", (req, res) => {
  let { tenantId } = req.params;

  if (!req.user.permissions.includes("tenant:read:all")) {
    tenantId = req.user.tenant;
  } else {
    tenantId = tenantId ? tenantId : req.user.tenant;
  }

  Tenant.findById(tenantId, (err, tenant) => {
    if (err) return res.status(500).send("user.find err");
    if (!tenant) return res.status(404).send("tenant not found");

    res.send(tenant);
  });
});

app.get("/all", (req, res) => {
  Tenant.find({}, (err, tenant) => {
    if (err) return res.status(500).send("user.find err");

    res.send(tenant);
  });
});

app.post("/", guard.check(["tenant:create"]), (req, res) => {
  let { name } = req.body;

  new Tenant({
    name: name,
  }).save((err, tenant) => {
    if (err) return res.status(500).send("err creating tenant");
    res.send(tenant);
  });
});

mdb.once("open", () => {
  console.log(chalk.green("MongoDB connected"));
  app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
  });
});
