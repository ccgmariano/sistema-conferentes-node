const express = require("express");
const router = express.Router();

const controller = require("./poseidoncontroller");

// rota de teste (diagnóstico)
router.get("/teste", controller.teste);

// ==========================================================
//  ENDPOINT OFICIAL DE PESAGENS (CONTRATO DEFINIDO)
// ==========================================================
router.post("/pesagens", controller.pesagens);

module.exports = router;
