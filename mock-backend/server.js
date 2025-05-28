const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware para permitir CORS e processar JSON
app.use(cors());
app.use(express.json());

// Array para armazenar as tarefas
let tasks = [
  { id: 1, text: 'Tarefa de exemplo do backend' },
  { id: 2, text: 'Outra tarefa de exemplo' }
];

// Rota para obter todas as tarefas
app.get('/api/tasks', (req, res) => {
  console.log('GET /api/tasks - Retornando todas as tarefas');
  res.json(tasks);
});

// Rota para adicionar uma nova tarefa
app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: req.body.id || Date.now(), // Usa o ID fornecido ou gera um novo
    text: req.body.text
  };
  
  console.log(`POST /api/tasks - Adicionando tarefa: ${JSON.stringify(newTask)}`);
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Rota para atualizar uma tarefa existente
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    console.log(`PUT /api/tasks/${taskId} - Tarefa não encontrada`);
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }
  
  const updatedTask = {
    id: taskId,
    text: req.body.text
  };
  
  console.log(`PUT /api/tasks/${taskId} - Atualizando tarefa: ${JSON.stringify(updatedTask)}`);
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// Rota para excluir uma tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    console.log(`DELETE /api/tasks/${taskId} - Tarefa não encontrada`);
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }
  
  console.log(`DELETE /api/tasks/${taskId} - Removendo tarefa`);
  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: 'Tarefa removida com sucesso' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}/api/tasks`);
});
