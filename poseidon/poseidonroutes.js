const express = require("express");
const router = express.Router();
const controller = require("./poseidoncontroller");

router.get("/teste", controller.teste);

module.exports = router;
