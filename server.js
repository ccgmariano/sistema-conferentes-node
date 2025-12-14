const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor Node ativo.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Node rodando na porta " + PORT);
});
