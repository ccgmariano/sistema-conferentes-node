const axios = require("axios").default;
const { wrapper: axiosCookieJarSupport } = require("axios-cookiejar-support");
const tough = require("tough-cookie");

// ativa suporte a cookies
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

module.exports = {
  async login(cpf, senha) {
    try {
      const url = "https://poseidon.pimb.net.br/";

      const response = await axios.post(
        url,
        new URLSearchParams({
          cpf: cpf,
          senha: senha
        }),
        {
          jar: cookieJar,
          withCredentials: true,
          maxRedirects: 0,
          validateStatus: (s) => s === 200 || s === 302
        }
      );

      return {
        ok: true,
        statusHttp: response.status,
        headers: response.headers,
        cookies: await cookieJar.getCookies(url),
        html: response.data        // <<< AQUI O HTML É RETORNADO
      };
    } catch (err) {
      return {
        ok: false,
        erro: err.message,
        detalhe: err.response ? err.response.status : "sem resposta"
      };
    }
  }
};
