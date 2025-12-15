const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas Poseidon
const poseidonRoutes = require("./poseidon/poseidonroutes");

// Rota de teste raiz
app.get("/", (req, res) => {
  res.json({ status: "OK", msg: "Servidor local funcionando." });
});

// Registrar rotas Poseidon
app.use("/poseidon", poseidonRoutes);

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
