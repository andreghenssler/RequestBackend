const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');




const app = express();
const PORT = 3000;

// Permite que o Express entenda JSON no corpo da requisição
app.use(express.json());

// Permite servir arquivos HTML e JS do diretório 'public'
app.use(express.static('public'));
app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(YAML.load('./swagger_aula.yml')));


// Simulando um banco de dados em memória
let dados = [
  { id: 1, message: 'Primeira mensagem' },
  { id: 2, message: 'Segunda mensagem' }
];

// GET - Retorna todos os registros ou um específico por ID
app.get('/api/data', (req, res) => {
  const { id } = req.query;

  if (id) {
    const item = dados.find(d => d.id == id);
    if (!item) {
      return res.status(404).json({ error: 'ID não encontrado' });
    }
    return res.status(200).json(item);
  }

  // Se não passar ID, retorna todos
  res.status(200).json(dados);
});

// POST - Cria novo registro
app.post('/api/data', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  }
  const novo = {
    id: dados.length ? Math.max(...dados.map(d => d.id)) + 1 : 1,
    message
  };
  dados.push(novo);
  res.status(201).json(novo);
});

// PUT - Atualiza completamente um registro existente
app.put('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const index = dados.findIndex(d => d.id == id);
  if (index === -1) {
    return res.status(404).json({ error: 'ID não encontrado' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  }
  dados[index].message = message;
  res.status(200).json(dados[index]);
});

// PATCH - Atualiza parcialmente um registro
app.patch('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const item = dados.find(d => d.id == id);
  if (!item) {
    return res.status(404).json({ error: 'ID não encontrado' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  }
  item.message += ' ' + message;
  res.status(200).json(item);
});

// DELETE - Remove um item pelo ID
app.delete('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const index = dados.findIndex(d => d.id == id);
  if (index === -1) {
    return res.status(404).json({ error: 'ID não encontrado' });
  }
  dados.splice(index, 1);
  res.status(200).json({ message: 'Apagado com sucesso' });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
