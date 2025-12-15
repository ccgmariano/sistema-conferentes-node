const axios = require("axios").default;
const { wrapper: axiosCookieJarSupport } = require("axios-cookiejar-support");
const tough = require("tough-cookie");

// Ativa suporte a cookies
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

module.exports = {
  async login(cpf, senha) {
    try {
      const urlBase = "https://poseidon.pimb.net.br/";

      // -------------------------------------------------------------
      // 1) GET INICIAL — abre sessão CakePHP igual ao navegador
      // -------------------------------------------------------------
      const getPage = await axios.get(urlBase, {
        jar: cookieJar,
        withCredentials: true,
        maxRedirects: 5,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        validateStatus: () => true
      });

      // captura cookies da sessão inicial
      const cookiesAposGet = await cookieJar.getCookies(urlBase);

      // -------------------------------------------------------------
      // 2) Preparar payload idêntico ao navegador
      // -------------------------------------------------------------
      const form = new URLSearchParams({
        _method: "POST",
        cpf: cpf,
        senha: senha,
        uuid: "",
        hostname: ""
      });

      // -------------------------------------------------------------
      // 3) POST DE LOGIN usando a mesma sessão do GET
      // -------------------------------------------------------------
      const response = await axios.post(urlBase, form, {
        jar: cookieJar,
        withCredentials: true,
        maxRedirects: 5,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Origin": "https://poseidon.pimb.net.br",
          "Referer": "https://poseidon.pimb.net.br/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        },
        validateStatus: () => true
      });

      // cookies após tentativa de login
      const cookiesFinal = await cookieJar.getCookies(urlBase);

      return {
        ok: true,
        statusHttp: response.status,
        cookiesInicialGet: cookiesAposGet,
        cookiesDepoisLogin: cookiesFinal,
        headers: response.headers,
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
