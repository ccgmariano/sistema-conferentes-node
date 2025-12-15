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

      const form = new URLSearchParams({
        _method: "POST",   // incluído
        cpf: cpf,
        senha: senha,
        uuid: "",
        hostname: ""
      });

      const response = await axios.post(url, form, {
        jar: cookieJar,
        withCredentials: true,
        maxRedirects: 5,   // seguir redirecionamentos
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        },
        validateStatus: () => true // permitir qualquer status
      });

      const cookies = await cookieJar.getCookies(url);

      return {
        ok: true,
        statusHttp: response.status,
        headers: response.headers,
        cookies: cookies,
        html: response.data
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
