const mysql = require('mysql2');

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost', // Altere para o nome do servidor do banco de dados, se necessário
  user: 'root', // Altere para o nome de usuário do banco de dados, se necessário
  password: 'automacao', // Altere para a senha do banco de dados, se necessário
  database: 'modestia', // Altere para o nome do seu banco de dados
});

// Estabelece a conexão com o banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados da Modestia!');
  }
});

module.exports = connection;
