const service = require("./poseidonservice");
const { extrairPesagens } = require("./pesagensParser");

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
  },

  async pesagens(req, res) {
    try {
      // 1) login (garante sessão ativa)
      await service.loginPoseidon(
        process.env.POSEIDON_CPF,
        process.env.POSEIDON_SENHA
      );

      // 2) consulta de pesagens (parâmetros fixos por enquanto)
      const resultado = await service.consultarPesagens({
        cpf: process.env.POSEIDON_CPF,
        data_inicio: "10/12/2025 09:15",
        data_fim: "16/12/2025 09:15",
        navio: "doro",
        produto: "",
        recinto: ""
      });

      if (!resultado.ok) {
        return res.status(500).json({
          status: "ERRO",
          msg: "Consulta falhou",
          detalhe: resultado.erro
        });
      }

      // 3) parse do HTML → JSON estruturado
      const dados = extrairPesagens(resultado.html);

      res.json({
        status: "OK",
        total: dados.length,
        dados
      });

    } catch (err) {
      res.status(500).json({
        status: "ERRO",
        msg: "Erro ao consultar pesagens.",
        detalhe: err.message
      });
    }
  }

};
