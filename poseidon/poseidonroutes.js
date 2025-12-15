const express = require("express");
const router = express.Router();

const controller = require("./poseidoncontroller");

// rota de verificação (health check)
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    msg: "Poseidon routes ativas."
  });
});

// rota de teste do login Poseidon
router.get("/teste", controller.teste);

module.exports = router;
