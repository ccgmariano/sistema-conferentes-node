const express = require("express");
const app = express();

// Habilita receber JSON e dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Integra as rotas do módulo Poseidon
app.use("/poseidon", require("./poseidon/poseidonroutes"));

// Rota principal
app.get("/", (req, res) => {
  res.send("Servidor Node ativo.");
});

// Porta usada pelo Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor Node rodando na porta " + PORT);
});
