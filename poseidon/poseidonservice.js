const axios = require("axios").default;
const tough = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

async function loginPoseidon(cpf, senha) {
    try {
        // 1) PRIMEIRO GET PARA PEGAR COOKIE INICIAL
        await client.get("https://poseidon.pimb.net.br/", {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html,application/xhtml+xml"
            }
        });

        // 2) POST REAL DO LOGIN
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
                validateStatus: s => s === 302,  // esperamos o redirect
                headers: {
                    "Origin": "https://poseidon.pimb.net.br",
                    "Referer": "https://poseidon.pimb.net.br/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "text/html,application/xhtml+xml",
                }
            }
        );

        // 3) Verificar cookie final (sessão autenticada)
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

module.exports = { loginPoseidon };
