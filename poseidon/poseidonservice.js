const axios = require("axios").default;
const tough = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const cheerio = require("cheerio");

// CookieJar global para manter sessão
const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

// ==========================================================
//  LOGIN NO POSEIDON
// ==========================================================
async function loginPoseidon(cpf, senha) {
  try {
    // 1) GET inicial (cookie de sessão)
    await client.get("https://poseidon.pimb.net.br/", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml"
      }
    });

    // 2) POST de login
    const response = await client.post(
      "https://poseidon.pimb.net.br/",
      new URLSearchParams({
        _method: "POST",
        cpf,
        senha,
        uuid: "",
        hostname: ""
      }),
      {
        maxRedirects: 0,
        validateStatus: s => s === 302,
        headers: {
          "Origin": "https://poseidon.pimb.net.br",
          "Referer": "https://poseidon.pimb.net.br/",
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "text/html,application/xhtml+xml"
        }
      }
    );

    const cookies = await jar.getCookies("https://poseidon.pimb.net.br/");

    return {
      ok: true,
      status: response.status,
      location: response.headers.location,
      cookies
    };
  } catch (err) {
    return {
      ok: false,
      error: err.toString()
    };
  }
}

// ==========================================================
//  CONSULTA DE PESAGENS + PARSE DA TABELA
// ==========================================================
async function consultarPesagens(params) {
  try {
    const url = "https://poseidon.pimb.net.br/consultas/view/83";

    const payload = new URLSearchParams({
      _method: "POST",
      cpf: params.cpf,
      data_inicio: params.data_inicio,
      data_fim: params.data_fim,
      navio: params.navio || "",
      produto: params.produto || "",
      recinto: params.recinto || ""
    });

    const response = await client.post(url, payload.toString(), {
      headers: {
        "Origin": "https://poseidon.pimb.net.br",
        "Referer": "https://poseidon.pimb.net.br/consultas/view/83",
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "text/html,application/xhtml+xml"
      }
    });

    // Parse HTML
    const $ = cheerio.load(response.data);
    const registros = [];

    $("table tbody tr").each((_, tr) => {
      const td = $(tr).find("td");
      if (td.length < 15) return;

      registros.push({
        tipo: $(td[0]).text().trim(),
        empresa: $(td[1]).text().trim(),
        codigo_pesagem: $(td[2]).text().trim(),
        placa: $(td[3]).text().trim(),
        entrada: $(td[4]).text().trim(),
        saida: $(td[5]).text().trim(),
        produto: $(td[6]).text().trim(),
        operacao: $(td[7]).text().trim(),
        peso_tara: $(td[8]).text().trim(),
        data_tara: $(td[9]).text().trim(),
        peso_bruto: $(td[10]).text().trim(),
        data_bruto: $(td[11]).text().trim(),
        ticket_id: $(td[12]).text().trim(),
        peso_liquido: $(td[14]).text().trim(),
        navio: $(td[15]).text().trim(),
        recinto: $(td[16]).text().trim()
      });
    });

    return {
      ok: true,
      total: registros.length,
      registros
    };
  } catch (err) {
    return {
      ok: false,
      erro: err.toString()
    };
  }
}

// ==========================================================
//  EXPORTAÇÃO
// ==========================================================
module.exports = {
  loginPoseidon,
  consultarPesagens
};
