const service = require("./poseidonservice");

module.exports = {
  async teste(req, res) {
    try {
      const r = await service.login("cpf-teste", "senha-teste");

      res.json({
        status: "OK",
        msg: "Controller funcionando.",
        retornoService: r
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
