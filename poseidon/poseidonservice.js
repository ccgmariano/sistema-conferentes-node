const axios = require("axios").default;
const tough = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

// CookieJar global para manter sessão
const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));


// ==========================================================
//  LOGIN NO POSEIDON
// ==========================================================
async function loginPoseidon(cpf, senha) {
    try {
        // 1) GET inicial para capturar cookie de sessão
        await client.get("https://poseidon.pimb.net.br/", {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html,application/xhtml+xml"
            }
        });

        // 2) POST real do login
        const response = await client.post(
            "https://poseidon.pimb.net.br/",
            new URLSearchParams({
                _method: "POST",
                cpf: cpf,
                senha: senha,
                uuid: "",
                hostname: ""
            }),
            {
                maxRedirects: 0,
                validateStatus: s => s === 302, // esperamos 302
                headers: {
                    "Origin": "https://poseidon.pimb.net.br",
                    "Referer": "https://poseidon.pimb.net.br/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "text/html,application/xhtml+xml"
                }
            }
        );

        // 3) Coletar cookie final (sessão autenticada)
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
//  CONSULTA DE PESAGENS (REPORT / CONSULTAS VIEW 83)
// ==========================================================
async function consultarPesagens(parametros) {
    try {
        const url = "https://poseidon.pimb.net.br/consultas/view/83";

        const payload = new URLSearchParams({
            _method: "POST",
            cpf: parametros.cpf,
            data_inicio: parametros.data_inicio,
            data_fim: parametros.data_fim,
            navio: parametros.navio,
            produto: parametros.produto,
            recinto: parametros.recinto
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

        return {
            ok: true,
            html: response.data // HTML completo retornado pelo servidor
        };

    } catch (err) {
        return {
            ok: false,
            erro: err.toString()
        };
    }
}


// ==========================================================
//  EXPORTAÇÃO DAS FUNÇÕES
// ==========================================================
module.exports = {
    loginPoseidon,
    consultarPesagens
};
