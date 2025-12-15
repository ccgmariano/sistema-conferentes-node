const service = require("./poseidonservice");

module.exports = {
  async teste(req, res) {
    try {
      const retorno = await service.loginPoseidon(
        process.env.POSEIDON_CPF,
        process.env.POSEIDON_SENHA
      );

      res.json({
        status: "OK",
        msg: "Controller funcionando.",
        retornoService: retorno
      });
    } catch (err) {
      res.status(500).json({
        status: "ERRO",
        msg: "Falha ao chamar o service.",
        detalhe: err.message
      });
    }
  }
};
