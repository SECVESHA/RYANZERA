const schedule = require('node-schedule');
const { Client } = require('whatsapp-web.js');

const client = new Client({/*... configurações do cliente ...*/});
client.initialize();

// Função para enviar uma mensagem para o número especificado
async function sendMessage(number, message) {
  try {
    const chatId = `${number}@c.us`;
    await client.sendMessage(chatId, message);
    console.log(`Mensagem enviada para ${number}: ${message}`);
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${number}: ${error}`);
  }
}

// Função para calcular a próxima ocorrência de uma data especial
function calcularProximaDataEspecial(dataEspecial) {
  const hoje = new Date();
  let proximaData = new Date(hoje.getFullYear(), dataEspecial.mes - 1, dataEspecial.dia); // Meses são baseados em zero (janeiro = 0, fevereiro = 1, etc.)
  
  if (hoje > proximaData) {
    // Se a próxima data já passou este ano, calculamos para o próximo ano
    proximaData = new Date(hoje.getFullYear() + 1, dataEspecial.mes - 1, dataEspecial.dia);
  }
  
  // Calcula o número de dias restantes até a próxima data especial
  const diasRestantes = Math.ceil((proximaData - hoje) / (24 * 60 * 60 * 1000));
  
  return { data: proximaData, diasRestantes };
}

// Natal, Dia dos clientes, Dias das mulheres, Ano novo, Dia dos Pais, Dia das Maes, Dia das Crianças, Pascoa
function agendarMensagensAviso() {
  // Defina as datas especiais e as mensagens de aviso correspondentes
  const datasEspeciais = [
    { nome: 'Natal', mes: 12, dia: 25 },
    { nome: 'Dia dos Clientes', mes: 10, dia: 15 },
    { nome: 'Dia das Mulheres', mes: 3, dia: 8 },
    { nome: 'Ano Novo', mes: 12, dia: 30},
    { nome: 'Hoje', mes: 9, dia: 21},
    { nome: 'Dia das Criança', mes: 2, dia: 2 }
    // Adicione outras datas aqui...
  ];

  datasEspeciais.forEach(dataEspecial => {
    const { data, diasRestantes } = calcularProximaDataEspecial(dataEspecial);
    const numero = '+5537998357270'; // Substitua pelo número desejado
    const mensagem = `Lembrete: ${dataEspecial.nome} está chegando em ${diasRestantes} dias! 🎉`;
    
    // Agende o envio da mensagem para a próxima data especial
    schedule.scheduleJob(data, () => {
      sendMessage(numero, mensagem);
    });
  });
}

// Inicie o agendamento das mensagens
agendarMensagensAviso();
