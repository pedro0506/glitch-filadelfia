/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server

const moment = require('moment-timezone');


const fs = require('fs');
const verify_token = process.env.VERIFY_TOKEN;

const writeToCSV = (recipient_id, status, currentTime) => {
  const record = `${recipient_id},${status},${currentTime}\n`;

  try {
    fs.appendFileSync('whatsapp-log.csv', record, 'utf-8');
    console.log('CSV file written successfully');
  } catch (err) {
    console.error('Error writing CSV:', err);
    fs.appendFileSync('whatsapp-error-log.csv', err, 'utf-8');
  }
};

const handledMessages = {}; // Objeto para armazenar os IDs das mensagens que já foram tratadas
const lastHelloSent = {};

const handleWebhook = (req, res) => {
  let body = req.body;

  if (req.body.object) {
    if (req.body.entry && req.body.entry[0].changes[0].value.messages[0]) {
      const message = req.body.entry[0].changes[0].value.messages[0];
      console.log("MESSAGE_RECEBIDA" + JSON.stringify(message, null, 2));
    
      if (message && message.type === "text") {
        const business_phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
    
        // Verificar se a mensagem já foi tratada
        if (!handledMessages[message.id]) {
          // Marcar a mensagem como tratada
          handledMessages[message.id] = true;
    
          // Calcular a diferença entre o timestamp atual e o timestamp da mensagem
          const messageTimestamp = message.timestamp * 1000; // Convertendo para milissegundos
          const currentTime = Date.now();
          const timeDifference = currentTime - messageTimestamp;
    
          // Verificar se a diferença de tempo é menor que 5 minutos
          if (timeDifference < 300000) {
            // Verificar se a mensagem contém "Menu" para enviar o template "menu"
            if (message.text.body.includes('Menu')) {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "type": "template",
                  "template": {
                    "name": "menu",
                    "language": {
                      "code": "pt_BR"
                    }
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.text.body == '4') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "text": {
                    "preview_url": true,
                    "body": "Ainda nenhum evento disponível. \n\nInformações sobre eventos enviar mensagem para o número +55 33 9961-0892."
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.text.body == '5') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "text": {
                    "preview_url": true,
                    "body": "Dúvidas frequentes: \n\na. Aquisição de cota \nb. Venda de Cota \nc. Compra de cota terceiro \nd. Fotografias no clube (como funciona)? \ne. Falar com um Atendente \n\n Informe a opção desejada digitando apenas a letra.\nEx: 'Venda de Cota' digite b "
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.text.body == 'd') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "text": {
                    "preview_url": true,
                    "body": "*- Como funciona a questão das fotografias no clube?* \n\nO procedimento para as fotos são:\n\n*SÓCIO*\nO fotógrafo vem na secretaria junto ao associado para fazer o seu cadastro e receber o cartão para entrar ao clube para fazer as fotos.\n\n*NÃO SÓCIO*\nO fotógrafo deve vir na secretaria fazer seu cadastro e apresentar a documentação das pessoas que ele vai fotografar, pra que possamos cadastrar todos e fazer o cartão para entrada.\nÉ cobrado o valor de 30 reais de cada um (fotógrafo e as pessoas a qual forem participar do ensaio, no máximo 4 acompanhantes)\n\nAs fotos podem ser feitas por um período de 3 horas a partir dos seguintes horários:\n\nSegunda-feira: 15h as 17hrs.\nTerça a Sexta: de 6h as 17hrs.\n\nO cadastro é feito na secretaria em nosso horário de funcionamento\nSegunda a sexta - 8:30 às 18:15h."
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.text.body == 'e') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "text": {
                    "preview_url": true,
                    "body": "Por favor entrar em contato diretamente com a secretaria pelo WhatsApp (33)9994-1053"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }
    
            // Verificar se é hora de enviar o template "hello"
            if (
              (!lastHelloSent[message.from] || (currentTime - lastHelloSent[message.from] > 3600000)) // Enviar apenas uma vez por hora
            ) {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "type": "template",
                  "template": {
                    "name": "hello",
                    "language": {
                      "code": "pt_BR"
                    }
                  }
                },
              }).then(() => {
                // Registrar o momento em que o template "hello" foi enviado
                lastHelloSent[message.from] = currentTime;
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }
          }
        }
      }
    }
    


    if (
      req.body.entry &&
      req.body.entry[0].changes[0].value.statuses[0].recipient_id
    ) {
            
      let recipient_id = req.body.entry[0].changes[0].value.statuses[0].recipient_id;
      let status = req.body.entry[0].changes[0].value.statuses[0].status;
      let currentTime = moment().tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm:ss');
      
      if(status == "delivered"){
        writeToCSV(recipient_id, status, currentTime); // Assuming 'delivered' status, modify accordingly
        console.log(JSON.stringify(req.body, null, 2));
      }

      
      
    }
    
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from;
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;


      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: " + msg_body },
        },
        headers: { "Content-Type": "application/json" },
      });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

const handleVerify = (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => console.log(`Webhook is listening on port ${PORT}`));

app.post("/webhook", handleWebhook);
app.get("/webhook", handleVerify);
