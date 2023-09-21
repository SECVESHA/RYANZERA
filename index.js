const moment2 = require('moment');
const { Client, LocalAuth, MessageMedia, Location } = require('whatsapp-web.js');
const connection = require('./src/db_connection.js');
const schedule = require('node-schedule');
const format = require ('date-fns');
const { calcularDataPascoa, getAnoAtualBrasilia, calcularDiaDasMaes, calcularDiaDosPais } = require('./pascoa'); // Importando as funções do arquivo pascoa.js



async function enviarMensagem(client, numeroTelefone, mensagem) {
  try {
    const chat = await client.getChatById(numeroTelefone + "@c.us");
    await client.sendMessage(mensagem);
    console.log(`Mensagem enviada para ${numeroTelefone}`);
  } catch (error) {
    console.error(`Erro ao enviar mensagem para o número ${numeroTelefone}:`, error);
  }
}




function criarCliente() {
  const client = new Client({
    authStrategy: new LocalAuth(),
  });

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});



client.on('ready', () => {
  console.log('Sistema Modestia Joias Ligado!');

  // Obtenha a data atual
  const currentDate = new Date();

  // Verifique se o dia é 21 e o mês é setembro
  if (format.getDate(currentDate) === 21 && format.getMonth(currentDate) === 8) {
   
    
  }
});



let counter = 0;

connection.query('SELECT contador FROM qntd_confirmado WHERE id = 1', (error, results) => {
  if (error) {
    console.error('Erro ao consultar contador no banco de dados:', error);
    return;
  }

  if (results.length > 0) {
    counter = results[0].contador; // Atribui o valor do contador recuperado
    console.log('Valor do contador recuperado:', counter);
  } else {
    console.log('Nenhum valor de contador encontrado no banco de dados. Mantendo o valor padrão de 0.');
  }
});

let entrega = '';
let pagamento = '';
let loc = '';
let duvi = '';
let horario = '';
let catalogo = '';
let pix = '';
let referencia = '';
let confirma = '';
let confirma2 = '';
let duviprata = '';
let atacado = '';
let relampago = '';
let atacado2 = '';
let promocao = '';

const queryDashboard = 'SELECT * FROM dashboard WHERE id = 1';
connection.query(queryDashboard, (error, results) => {
    if (error) {
        console.error('Erro ao consultar tabela dashboard:', error);
        return;
    }

    if (results.length > 0) {
        const row = results[0];
        entrega = row.entrega;
        pagamento = row.pagamento;
        loc = row.loc;
        duvi = row.duvi;
        horario = row.horario;
        catalogo = row.catalogo;
        pix = row.pix;
        referencia = row.referencia;
        confirma = row.confirma;
        confirma2 = row.confirma2;
        duviprata = row.duviprata;
        atacado = row.atacado;
        relampago = row.relampago;
        atacado2 = row.atacado2;
        promocao = row.promocao;

        // Resto do seu código aqui
    } else {
        console.log('Nenhum registro encontrado na tabela dashboard com ID 1.');
    }
});


client.on('message', async message => { 
    if (!message.isGroup) {
      
        const phoneID = message.from;
        const phoneNumber = phoneID.replace(/[^0-9]/g, '');
        try { // BOAS VINDAS
            const [rows] = await connection.promise().query('SELECT * FROM clientes_wpp WHERE numero_telefone = ?', [phoneNumber]);
            if (rows.length === 0) {
                console.log('Acabei de cadastrar um novo cliente!');
                await connection.promise().query('INSERT INTO clientes_wpp (numero_telefone, status) VALUES (?, ?)', [phoneNumber, 'pedido em andamento']);
                const chat = await message.getChat();
                await chat.sendStateTyping();
                await new Promise((resolve) => setTimeout(resolve, 3000));
                // Enviar mensagem de boas-vindas
                const welcomeMessage = `Olá! Somos a Modéstia Joias 💎\n\n- Eu sou o Ryan, estou aqui para te atender e tirar suas dúvidas. 👨🏻💼\n- Salve nosso contato para ficar por dentro das novidades. ✅\n- Oferecemos frete grátis para todo o Brasil. 🇧🇷\n- Como posso ajudar?\n\n👇 Clique no link abaixo para acessar nosso site:\nmodestiajoias.offstore.me`;
                client.sendMessage(message.from, welcomeMessage);

                // Enviar áudio com base no período do dia
                const currentTime = moment2().format('HH:mm');
                let audioPath = '';

                if (currentTime >= '06:00' && currentTime < '12:00') {
                    audioPath = 'medias/audio_manha.mp3';
                } else if (currentTime >= '12:00' && currentTime < '18:00') {
                    audioPath = 'medias/audio_tarde.mp3';
                } else {
                    audioPath = 'medias/audio_noite.mp3';
                }
                await chat.sendStateRecording();
                await new Promise((resolve) => setTimeout(resolve, 3000));
                const audioMedia = MessageMedia.fromFilePath(audioPath);
                client.sendMessage(message.from, audioMedia, { sendAudioAsVoice: true });

                // Enviar vídeo
                const videoPath = 'medias/video.mp4';
                const videoMedia = MessageMedia.fromFilePath(videoPath);
                client.sendMessage(message.from, videoMedia, { sendVideoAsGif: false });
            }
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
        }
    }
});

client.on('message_create', async message => { 
 try {
  if (message.fromMe) {
  
    if (message.body === '🚚') {
        const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, entrega);
        client.sendMessage('5537998357270@c.us', entrega)
        console.log(message.to)
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await chat.sendStateRecording();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const audioMedia = MessageMedia.fromFilePath('medias/audio_entrega.mp3');
        client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
      } else if (message.body === '💳') {
        const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, pagamento);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await chat.sendStateRecording();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const audioMedia = MessageMedia.fromFilePath('medias/audio_pagamento.mp3');
        client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
      } else if (message.body === '📍') {
        const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, loc);
    // Criar uma instância de Location com latitude e longitude
  const latitude = 51.5074; // Latitude da localização
  const longitude = -0.1278; // Longitude da localização
  const location = new Location(latitude, longitude);

  // Enviar a localização
  await client.sendMessage(message.to, location);
       await chat.sendStateRecording();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const audioMedia = MessageMedia.fromFilePath('medias/audio_loc.mp3');
        client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
      } else if (message.body === '🙋‍♂️') {
        const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, duvi);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await chat.sendStateRecording();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const audioMedia = MessageMedia.fromFilePath('medias/audio_duvidamoeda.mp3');
        client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
      } else if (message.body === '🕰️') {
        const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, horario);
      } else if (message.body === '📔') {
const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, catalogo);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await chat.sendStateRecording();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const audioMedia = MessageMedia.fromFilePath('medias/audio_estoque.mp3');
        client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
        const clinumb = message.to
        clientnumber = climumb.replace(/[^0-9]/g, '');
        const query = `SELECT id, status FROM clientes_wpp WHERE numero_telefone = '${phoneNumber}'`;

connection.query(query, (error, results) => {
  if (error) {
    console.error('Error querying database:', error);
    return;
  }
  if (results.length === 0) {
    console.log('Cliente não encontrado no banco de dados.');
    return;
  }

  const clientId = results[0].id;
  const currentStatus = results[0].status;

  if (currentStatus !== 'cliente') {
    const updateQuery = `UPDATE clientes_wpp SET status = 'possivel_cliente' WHERE id = ${clientId}`;
    connection.query(updateQuery, (error) => {
      if (error) {
        console.error('Error updating status in database:', error);
        return;
      }
      // console.log('Status do pedido atualizado no banco de dados.');
    });
  }
});

      } else if (message.body === '🔑') { 
         const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, pix);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await chat.sendStateRecording();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const audioMedia = MessageMedia.fromFilePath('medias/audio_pix.mp3');
        client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
      } else if (message.body === '🔒') { 
        const chat = await message.getChat();
         await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, referencia);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await chat.sendStateRecording();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const audioMedia = MessageMedia.fromFilePath('medias/audio_ref.mp3');
        client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
      } else if (message.body === '✅') { 
        const number = message.to
        const clientnumber = number.replace(/[^0-9]/g, '');
        const query = `SELECT id FROM clientes_wpp WHERE numero_telefone = '${clientnumber}'`;

connection.query(query, (error, results) => {
  if (error) {
    console.error('Error querying database:', error);
    return;
  }
  if (results.length === 0) {
    console.log('Cliente não encontrado no banco de dados.');
    return;
  }

  const clientId = results[0].id;
  const updateQuery = `UPDATE clientes_wpp SET status = 'cliente' WHERE id = ${clientId}`;
  
  connection.query(updateQuery, (error) => {
    if (error) {
      console.error('Error updating status in database:', error);
      return;
    }
     console.log('Status do pedido atualizado no banco de dados.');
  });
});

const chat = await message.getChat();
await chat.sendStateTyping();
await new Promise((resolve) => setTimeout(resolve, 3000));
await client.sendMessage(message.to, confirma);
await new Promise((resolve) => setTimeout(resolve, 3000));
await chat.sendStateTyping();
await new Promise((resolve) => setTimeout(resolve, 3000));
await client.sendMessage(message.to, confirma2);
await new Promise((resolve) => setTimeout(resolve, 3000));
await chat.sendStateRecording();
const audioMedia = MessageMedia.fromFilePath('medias/audio_confirma.mp3');
client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
counter++

const updateCounterQuery = `INSERT INTO qntd_confirmado (id, contador) VALUES (1, ${counter}) ON DUPLICATE KEY UPDATE contador = ${counter}`;

connection.query(updateCounterQuery, (error) => {
  if (error) {
    console.error('Erro ao atualizar contador na tabela qntd_confirmado:', error);
    return;
  }
  // console.log('Contador atualizado na tabela qntd_confirmado.');
});

      }  else if (message.body === '🤔') { 

        const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, duviprata);
        await chat.sendStateRecording();
        const audioMedia = MessageMedia.fromFilePath('medias/audio_duvidaprata.mp3');
        client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await chat.sendStateRecording();
        const audioMedia2 = MessageMedia.fromFilePath('medias/audio_duvidaprata2.mp3');

        client.sendMessage(message.to, audioMedia2, { sendAudioAsVoice: true });



      } else if (message.body === '🛍️') { 
        const chat = await message.getChat();
        await chat.sendStateTyping();
       await new Promise((resolve) => setTimeout(resolve, 3000));
       await client.sendMessage(message.to, atacado2);
       await new Promise((resolve) => setTimeout(resolve, 3000));
       await chat.sendStateTyping();
       await new Promise((resolve) => setTimeout(resolve, 3000));
       await client.sendMessage(message.to, atacado);
       await chat.sendStateRecording();
       await new Promise((resolve) => setTimeout(resolve, 3000));
       const audioMedia = MessageMedia.fromFilePath('medias/atacado.mp3');
       client.sendMessage(message.to, audioMedia, { sendAudioAsVoice: true });
       await chat.sendStateRecording();
       await new Promise((resolve) => setTimeout(resolve, 3000));
       const audioMedia2 = MessageMedia.fromFilePath('medias/atacado2.mp3');
       client.sendMessage(message.to, audioMedia2, { sendAudioAsVoice: true });
      } else if (message.body === '🌩️') { 
        const chat = await message.getChat();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await client.sendMessage(message.to, relampago)
      }
  }
 } catch (error) {
  console.error('Verificando...')
}
});


client.initialize();

// Lidar com eventos de desconexão e reconectar
client.on('disconnected', (reason) => {
  console.log(`Desconectado: ${reason}`);

  // Tente reconectar após um intervalo de tempo (por exemplo, 10 segundos)
  setTimeout(() => {
    console.log('Tentando reconectar...');
    criarCliente(); // Crie um novo cliente
  }, 10000); // 10 segundos de espera antes de tentar reconectar
});
}

// Inicie o cliente pela primeira vez
criarCliente();

