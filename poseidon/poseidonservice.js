const axios = require("axios").default;
const { wrapper: axiosCookieJarSupport } = require("axios-cookiejar-support");
const tough = require("tough-cookie");

// ativa suporte a cookies
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

module.exports = {
  async login(cpf, senha) {
    return {
      ok: true,
      msg: "Função de login chamada com sucesso.",
      recebido: { cpf, senha }
    };
  }
};
