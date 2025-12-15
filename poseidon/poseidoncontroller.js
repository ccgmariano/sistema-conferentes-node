const service = require("./poseidonservice");

// ==========================================================
//  ROTA DE TESTE (diagnóstico)
// ==========================================================
async function teste(req, res) {
  try {
    const r = await service.loginPoseidon(
      process.env.POSEIDON_CPF,
      process.env.POSEIDON_SENHA
    );

    res.json({
      status: "OK",
      msg: "Controller funcionando.",
      retornoService: r
    });
  } catch (err) {
    res.status(500).json({
      status: "ERRO",
      msg: "Falha no teste.",
      detalhe: err.message
    });
  }
}

// ==========================================================
//  ENDPOINT OFICIAL DE PESAGENS
// ==========================================================
async function pesagens(req, res) {
  try {
    const {
      data_inicio,
      data_fim,
      navio,
      produto,
      recinto
    } = req.body;

    // validação mínima
    if (!data_inicio || !data_fim) {
      return res.status(400).json({
        ok: false,
        erro: "data_inicio e data_fim são obrigatórios"
      });
    }

    // garante sessão ativa no Poseidon
    await service.loginPoseidon(
      process.env.POSEIDON_CPF,
      process.env.POSEIDON_SENHA
    );

    // consulta de pesagens
    const resultado = await service.consultarPesagens({
      cpf: process.env.POSEIDON_CPF,
      data_inicio,
      data_fim,
      navio,
      produto,
      recinto
    });

    res.json(resultado);

  } catch (err) {
    res.status(500).json({
      ok: false,
      erro: err.message
    });
  }
}

module.exports = {
  teste,
  pesagens
};
