// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// Banco de dados
const db = new sqlite3.Database('alunos.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Banco de dados conectado.');
});

// Criar tabela se não existir
const criarTabela = `
  CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    idade INTEGER NOT NULL,
    avaliacao TEXT NOT NULL,
    relacao INTEGER NOT NULL,
    data_inscricao TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;
db.run(criarTabela);

// Rota para receber inscrições
app.post('/api/inscrever', (req, res) => {
  const { nome, email, idade, avaliacao, relacao } = req.body;
  const query = `INSERT INTO alunos (nome, email, idade, avaliacao, relacao) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [nome, email, idade, avaliacao, relacao], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao salvar dados.' });
    }
    res.status(200).json({ message: 'Inscrição realizada com sucesso.' });
  });
});

app.get('/api/alunos', (req, res) => {
    db.all('SELECT * FROM alunos ORDER BY data_inscricao DESC', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
  

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
