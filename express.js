const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/poll', (req, res) => {
  // Rota para recuperar ou criar enquetes
  res.json({ pollData: 'Dados do poll aqui' });
});

io.on('connection', (socket) => {
  console.log('Um usuário conectou');
  // Lidar com as respostas dos usuários
  socket.on('vote', (data) => {
    io.emit('update', { newResults: 'Resultados atualizados aqui' });
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectou');
  });
});

http.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});