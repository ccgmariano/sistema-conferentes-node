const service = require("./poseidonservice");

module.exports = {
  async teste(req, res) {
    const r = await service.login("cpf-teste", "senha-teste");

    res.json({
      status: "OK",
      msg: "Controller funcionando.",
      retornoService: r
    });
  }
};
