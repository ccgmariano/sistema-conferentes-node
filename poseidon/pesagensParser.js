const cheerio = require("cheerio");

function extrairPesagens(html) {
  const $ = cheerio.load(html);
  const resultados = [];

  $("tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 10) return; // ignora linhas inválidas

    const linha = {
      tipo: $(tds[0]).text().trim(),
      operador: $(tds[1]).text().trim(),
      reserva: $(tds[2]).text().trim(),
      placa: $(tds[3]).text().trim(),
      hora_entrada: $(tds[4]).text().trim(),
      hora_saida: $(tds[5]).text().trim(),
      produto: $(tds[6]).text().trim(),
      operacao: $(tds[7]).text().trim(),
      peso_tara: $(tds[8]).text().trim(),
      hora_pesagem_tara: $(tds[9]).text().trim(),
      peso_bruto: $(tds[10]).text().trim(),
      hora_pesagem_bruto: $(tds[11]).text().trim(),
      ticket: $(tds[12]).text().trim(),
      link_ticket: $(tds[13]).find("a").attr("href") || null,
      peso_liquido: $(tds[14]).text().trim(),
      navio: $(tds[15]).text().trim(),
      recinto: $(tds[16]).text().trim()
    };

    resultados.push(linha);
  });

  return resultados;
}

module.exports = { extrairPesagens };
