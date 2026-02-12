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

const moment = require("moment-timezone");

const fs = require("fs");
const verify_token = process.env.VERIFY_TOKEN;

const writeToCSV = (recipient_id, status, currentTime) => {
  const record = `${recipient_id},${status},${currentTime}\n`;

  try {
    fs.appendFileSync("whatsapp-log.csv", record, "utf-8");
    console.log("CSV file written successfully");
  } catch (err) {
    console.error("Error writing CSV:", err);
    fs.appendFileSync("whatsapp-error-log.csv", err, "utf-8");
  }
};

const handledMessages = {}; // Objeto para armazenar os IDs das mensagens que já foram tratadas
const lastHelloSent = {};

const handleWebhook = (req, res) => {
  try {
    console.log("Incoming Webhook Request...");
    let body = req.body;

  if (req.body.object) {
    console.log(JSON.stringify(req.body, null, 2));

    // axios({
    //       method: "POST",
    //       url: `https://crwa.com.br/provedor/webhook.php`,
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //       data: JSON.stringify(req.body, null, 2),
    //     }).catch(error => {
    //       console.error("Erro ao enviar mensagem ao WebHook:", error);
    //     });

    axios({
      method: "POST",
      url: `https://clubefiladelfia.com.br/provedor/webhook.php`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(req.body, null, 2),
    }).catch((error) => {
      console.error("Erro ao enviar mensagem ao WebHook:", error);
    });

    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const message = req.body.entry[0].changes[0].value.messages[0];

      console.log("MESSAGE_RECEBIDA" + JSON.stringify(message, null, 2));

      if (message) {
        const business_phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        console.log(business_phone_number_id);
        // Verificar se a mensagem já foi tratada
        if (!handledMessages[message.id]) {
          // Marcar a mensagem como tratada
          handledMessages[message.id] = true;

          if (message.type === "text") {
              if (message.text.body.length >= 0) {
                axios({
                  method: "POST",
                  url: `https://webhook.psdev-plugins.com.br/webhook/chat-ia-filadelfia`,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: {
                    messaging_product: "whatsapp",
                    to: message.from,
                    message: message.text.body,
                  },
                }).catch((error) => {
                  console.error("Erro ao enviar mensagem:", error);
                });
              }
            }
            // Verificar se a mensagem contém "Menu" para enviar o template "menu"
            //             if (message.type === "interactive") {
            //               if (message.interactive.list_reply.id == "Calendario") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     type: "interactive",
            //                     interactive: {
            //                       type: "list",
            //                       header: {
            //                         type: "text",
            //                         text: "SOCIEDADE RECREATIVA FILADÉLFIA",
            //                       },
            //                       body: {
            //                         text: "Calendário",
            //                       },
            //                       footer: {
            //                         text: "clique no botão para visualizar as opções.",
            //                       },
            //                       action: {
            //                         button: "Abrir menu",
            //                         sections: [
            //                           {
            //                             title: "Calendário",
            //                             rows: [
            //                               // {
            //                               //     "id": "evento1",
            //                               //     "title": "Luau Filadelfia",
            //                               //     "description": "10 de Maio"
            //                               // },
            //                               // {
            //                               //   "id": "evento2",
            //                               //   "title": "Aniversario Filadelfia",
            //                               //   "description": "12 de Junho"
            //                               // },
            //                             ],
            //                           },
            //                         ],
            //                       },
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "evento1") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                     ContentType: "application/json",
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     type: "image",
            //                     image: {
            //                       link: "https://clubefiladelfia.com.br/eventos/evento1.jpeg",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "evento2") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     type: "image",
            //                     image: {
            //                       link: "https://clubefiladelfia.com.br/eventos/evento2.jpeg",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "Secretaria") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Qual o horario de funcionamento da secretaria?*\n\nSegunda a sexta - 8:30 às 18:15h\nSábado - 9:15 às 16:15h",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "Clube") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Qual o horario de funcionamento do clube?*\n\nSegunda-feira - 15:00 às 22:00h\nTerça a sexta-feira - 6:00 às 22:00h\nSábado, domingo e feriado - 6:00 às 19:00h",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "Sauna") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Qual o horario de funcionamento da sauna?*\n\nSegunda a sexta-feira - 16:00 às 21:45h\nSábado, domingo e feriado - 11:00 às 18:45h",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "Churrasqueiras") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Qual o horario de funcionamento das churrasqueiras?\n\nDe segunda a sexta até a 00:00\nSábado, domingo e feriado até as 19:00",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "Piscinas") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Qual o horario de funcionamento das piscinas*\n\nSegunda a sexta até às 20h\nSábado, domingo e feriado até às 18h",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               // https://maps.app.goo.gl/Cer65eTpuZqU5L796
            //               if (message.interactive.list_reply.id == "Mapa") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Acesse a localização pelo link: https://maps.app.goo.gl/Cer65eTpuZqU5L796",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (
            //                 message.interactive.list_reply.id == "Telefones" ||
            //                 message.interactive.list_reply.id == "atendente"
            //               ) {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Contato/Telefones: (33) 3276-7702 / 3276-7709",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "Reserva_Churras") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Como faz e onde faz a reserva da churrasqueira? Tem algum valor diferenciado?*\n\nA reserva da churrasqueira é feita no dia em que vai usar, por ordem de chegada, na portaria do estacionamento a partir das 6h da manhã.\nReserva feita pelo titular ou conjuge mediante apresentação da carteirinha\n*A partir de Segunda Feira dia 18/12 Preço novo*\n\n-Convite para churrasqueira válidos de segunda a sexta.\n-Deve ser retirado para os convidados na secretaria apresentando a senha da churrasqueira e documento pessoal de cada convidado.\n-Máximo de 15 pessoas.\n-Valor do convite 20,00 por pessoa.\n-Entrada do convidado liberada a partir das 19hrs.\n-A partir de 5 anos paga.\n-Cantor e churrasqueiro deve ser feita a compra do convite.",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "Contato_evento") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Informações sobre eventos enviar mensagem para o número +55 33 9961-0892.",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               // if (message.interactive.list_reply.id == 'Calendario') {
            //               //   axios({
            //               //     method: "POST",
            //               //     url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //               //     headers: {
            //               //       Authorization: `Bearer ${token}`,
            //               //     },
            //               //     data: {
            //               //       "messaging_product": "whatsapp",
            //               //       "recipient_type": "individual",
            //               //       "to": message.from,
            //               //       "text": {
            //               //         "preview_url": true,
            //               //         "body": "Sem registros de eventos."
            //               //       }
            //               //     },
            //               //   }).catch(error => {
            //               //     console.error("Erro ao enviar mensagem:", error);
            //               //   });
            //               // }
            //               if (message.interactive.list_reply.id == "aquisicao") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Qual o valor da cota atualmente? Tem cota no clube disponível?*\n\nNo momento não está sendo vendido nenhuma cota diretamente do clube. \nPara adquirir uma cota atualmente é só a comum, onde é apenas por transferência de algum associado onde além do valor que ele avalia a sua cota, você também paga a taxa de transferência para o clube, no valor de 2.500,00 e os 5,00 de cada carteirinha. \n\nSe tiver interesse na cota comum, pode entrar no site onde tem as pessoas que tem interesse de vender. 😊\n\nSite: clubefiladelfia.com.br",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "venda") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Quero vender minha cota, qual o procedimento?*\n\nTemos a opção de colocar no nosso banco de cotas no site do clube, nos envie seu número e nome completo por gentileza direto para a atendente pelos números (33) 3276-7702 / 3276-7709",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "compra") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*Comprei uma cota de terceiros, qual o procedimento agora?*\n\nÉ necessário que venha na secretaria para ser explicado o formulário de aquisição de cota que precisa ser preenchido e assinado pelo novo titular.\n\nHorário de funcionamento da secretaria\nSegunda a sexta - 8:30 às 18:15h\nSábado - 9:15 às 16:15h",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "fotografias") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "*- Como funciona a questão das fotografias no clube?* \n\nO procedimento para as fotos são:\n\n*SÓCIO*\nO fotógrafo vem na secretaria junto ao associado para fazer o seu cadastro e receber o cartão para entrar ao clube para fazer as fotos.\n\n*NÃO SÓCIO*\nO fotógrafo deve vir na secretaria fazer seu cadastro e apresentar a documentação das pessoas que ele vai fotografar, pra que possamos cadastrar todos e fazer o cartão para entrada.\nÉ cobrado o valor de 30 reais de cada um (fotógrafo e as pessoas a qual forem participar do ensaio, no máximo 4 acompanhantes)\n\nAs fotos podem ser feitas por um período de 3 horas a partir dos seguintes horários:\n\nSegunda-feira: 15h as 17hrs.\nTerça a Sexta: de 6h as 17hrs.\n\nO cadastro é feito na secretaria em nosso horário de funcionamento\nSegunda a sexta - 8:30 às 18:15h.",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "natacao") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Veja esse item no WhatsApp: https://wa.me/p/7138771676213415/553399294013\nDescrição: NATAÇÃO/HIDROGINASTICA",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "futebol") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Veja esse item no WhatsApp: https://wa.me/p/6922069664508728/553399294013\nDescrição: FUTEBOL/FUTSAL/GOLEIRO/VOLEI FEMININO",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "treinamento") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Veja esse item no WhatsApp: https://wa.me/p/6981547348639403/553399294013\nDescrição: TREINAMENTO FUNCIONAL ADULTO E KIDS/ PETECA",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "karate") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Veja esse item no WhatsApp: https://wa.me/p/7167236810005298/553399294013\nDescrição: Karatê/Judô...",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "tenis") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Veja esse item no WhatsApp: https://wa.me/p/6964990853555235/553399294013\nDescrição: TENIS/ BASQUETE",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "bale") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Veja esse item no WhatsApp: https://wa.me/p/24506368005678311/553399294013\nDescrição: BALLET/ JAZZ/ FIT DANCE",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "desconto_esp") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Quando o aluno sendo associado ou não faz dois ou mais esportes ele possui 20% em cada modalidade.\nQuando um faz esporte e mais alguém da família, incluso na cota, cada um recebe 10% de desconto.\n",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (
            //                 message.interactive.list_reply.id == "contato_esp" ||
            //                 message.interactive.list_reply.id == "hora_esp" ||
            //                 message.interactive.list_reply.id == "valores"
            //               ) {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Informações sobre esportes enviar mensagem para o número +55 33 9994-1053",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "convite") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Veja esse item no WhatsApp: https://wa.me/p/6839102372836189/553399294013",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "tirar") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `⁉️ Retirada do Convite - Passo a Passo:
            // 📩 Quem pode retirar o convite?
            // > O associado titular ou seu cônjuge podem retirar o convite pessoalmente na secretaria.
            // > Caso nenhum dos dois possa ir, um deles pode escrever uma autorização de próprio punho para que um dependente (maior de idade) da cota retire o convite.
            // 🎟️ Como enviar a autorização?
            // > A autorização deve ser datada e assinada igual ao documento.
            // > Ela deverá ser fotografada juntamente com o documento (na parte da assinatura) e a carteirinha social e enviada em nosso WhatsApp ou a foto impressa.
            // Se o convidado for de Valadares:
            // > Apresentar documento de identidade com CPF.
            // 📍 Se o convidado for de outra localidade:
            // > Apresentar documento de identidade com CPF.
            // > Comprovante de residência em nome próprio (se for maior de idade).
            // > Se for menor de idade, o comprovante deve estar no nome dos pais.
            // 🧒🏻 Crianças de 0 a 4 anos completo:
            // > Não pagam, mas é necessário apresentar um documento para retirar o convite gratuito.`,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "cortesia") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `⁉️ Como funciona o convite cortesia e qual o período que pode retirar?
            // 🎟 Convites Cortesia:
            // 🆗 Quem tem direito?
            // > Cota Familiar ou Especial tem direito a 4 convites gratuitos mensais (não acumulativos) entre maio e agosto.
            // 📩 Como retirar os convites?
            // > As regras de retirada são as mesmas dos convites pagos.
            // > Quem pode retirar? O titular, cônjuge ou dependentes maiores de 18 (com autorização).
            // 📃 O que é necessário?
            // > Retirada presencial na secretaria.
            // > Documento com CPF do convidado deve ser apresentado.`,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "valores") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `⁉️ Qual os valores de convites?
            // ✅ Não trabalhamos com Day Use - A entrada de não sócios ocorre apenas por meio de convite.
            // ✅ Somente o sócio titular ou cônjuge pode retirar convites para seus convidados ou os dependentes maiores de 18 anos autorizados.
            // ✅ Convites para convidados de fora deve apresentar comprovante de residência em nome de cada convidado maior de idade.
            // ✅ Apresentar documento com CPF de cada convidado.
            // Valores dos convites:
            // *Para visitantes de fora*:
            // > R$ 35,00 (Segunda a Sábado)
            // > R$ 90,00 (Domingo e Feriado)
            // *Para visitantes de Governador Valadares*:
            // > R$ 90,00 (Segunda a Sábado)
            // > R$ 180,00 (Domingo e Feriado).
            // "_CRIANÇA de 0 até completar 5 anos, GRATUITO_.
            // _após 5 anos até completar 13 anos, pagam 50% do convite_.
            // _Após completar 13 anos, pagam 100% do convite_."`,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "mensalidade") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: "Por favor informe seu CPF para que possamos buscar em nosso sistema. \n\n_Digite apenas números, EX: 12345678900_",
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "pix") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `Prezados Sócios,
            // Informamos que, a partir de agora, não estamos mais aceitando pagamentos via PIX utilizando a chave do CNPJ ou a chave de celular. Já estamos há algum tempo sem disponibilizá-la como opção.
            // Pedimos que, a partir deste momento, os pagamentos sejam realizados exclusivamente pelo aplicativo do clube ou diretamente no caixa da secretaria.
            // *Caso você tenha realizado o pagamento utilizando essas chaves de PIX, pedimos que entre em contato conosco para que possamos dar a devida baixa no sistema. Porém, ressaltamos que não poderemos aceitar mais pagamentos por essa via. Futuros pagamentos deverão ser feitos apenas pelas opções mencionadas.*
            // Agradecemos a compreensão de todos e reforçamos que essa mudança visa melhorar o processo de administração das contribuições.💚🤍❤️🤝`,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "inclusao") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `*Orientações para Entrega de Documentos - Titular da Cota*:
            // O titular da cota deve preencher e assinar o formulário, e anexar os seguintes documentos:
            // > 📃 Cópia do CPF
            // > 🤳🏻 Foto (estilo 3x4) tirar no celular e enviar por aqui.
            // > ⚠️ Apenas a foto pode ser enviada digitalmente. Os demais documentos devem ser entregues impressos.
            // Certidão de antecedentes criminais - Justiça Estadual (TJMG):
            // > 🔗Emitir em: TJMG
            // > Natureza: Criminal
            // > Tipo: Normal
            // > Comarca: Governador Valadares
            // Certidão de antecedentes criminais - Justiça Federal (TRF6):
            // > 🔗 Emitir em: TRF6
            // > Tipo: Criminal
            // > Selecione: Comarca de Minas Gerais
            // Sobre dependentes (sogro/sogra ou pai/mãe):
            // > 👨‍👩‍👦‍👦 Pelo menos 1 dos membros do casal deve ter 60 anos ou mais Para não ser cobrado mensalmente a taxa de dependente, que seria o valor integral de uma mensalidade.
            // `,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "cancelamento") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `*COMO FAÇO PARA CANCELAR A MATRICULA?*:
            // Cancelamento de Atividades Esportivas:
            // > 📃 Prezados(as),
            // Informamos que o cancelamento de atividades esportivas poderá ser realizado de duas formas:
            // > ➡️ Presencialmente, na secretaria do clube
            // > ➡️ Através do nosso canal oficial de atendimento via WhatsApp
            // Em ambos os casos, é indispensável que o pedido seja feito formalmente, para que possamos registrá-lo adequadamente.
            // ⚠️ Atenção aos critérios para cancelamento:
            // - O cancelamento somente será autorizado se todas as mensalidades estiverem quitadas, sem pendências financeiras.
            // - Caso o boleto do mês seguinte já tenha sido emitido, ele deverá ser desconsiderado.
            // - Sócios do clube, no entanto, deverão efetuar o pagamento da mensalidade do clube presencialmente na secretaria, uma vez que o boleto pode ter sido gerado com a atividade esportiva incluída.
            // ❗Importante:
            // - Não realizamos trancamento de matrícula. Apenas o cancelamento definitivo da atividade.
            // - Em caso de fila de espera, a criança não terá prioridade para retornar.
            // - Ao desejar retornar futuramente, será necessário refazer a matrícula presencialmente na secretaria, pagando apenas a mensalidade do esporte escolhido (sujeito à disponibilidade de vagas).
            // Agradecemos pela compreensão e estamos à disposição para quaisquer dúvidas ou esclarecimentos.
            // `,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "qualvalor") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `*QUAL VALOR DA MENSALIDADE? QUANTO TENHO DE DESCONTO, TEVE REAJUSTE? POSSO PARCELAR?*
            // Informativo – Mensalidade, Descontos e Formas de Pagamento
            // > 📃 Prezados(as),
            // Informamos que o valor atual da mensalidade é de *R$ 370,00*. Oferecemos um desconto especial para pagamentos realizados até o dia *10 de cada mês*:
            // > ➡️ *Com desconto*: R$ 350,00
            // > ➡️ Formas de pagamento disponíveis:
            // - *Aplicativo*
            // - *Boleto bancário*
            // - *Presencialmente na secretaria*, com as seguintes opções:
            // > 💵 Dinheiro
            // > 💳 Débito
            // > 💲 PIX
            // ⚠️ Cartão de crédito::
            // - Aceito *somente para mensalidades vencidas*.
            // 🗓️ Parcelamento:
            // - Mensalidades em atraso *a partir de 3 vencidas* podem ser *parceladas em até 3x sem juros*, exclusivamente no crédito.
            // 🔁 Reajuste Anual:
            // - Reforçamos que, conforme nossa política interna, o valor das mensalidades é *reajustado anualmente no mês de maio*, de acordo com a atualização dos custos operacionais.
            // Agradecemos pela atenção e permanecemos à disposição para dúvidas.
            // `,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "duvidaevento") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `*Quais eventos tem? Show? Valores? Onde comprar?*
            // Informações sobre Programação de Eventos
            // > 📃 Prezados(as),
            // Para saber tudo sobre a programação dos nossos eventos — incluindo shows, valores e pontos de venda —, você pode entrar em contato diretamente com o *Setor de Eventos*.
            // 📲 Canais disponíveis para atendimento:
            // > ➡️ WhatsApp: +5533999687856
            // > ➡️ Instagram
            // > ➡️ Site oficial
            // Nesses meios, você encontrará todas as informações necessárias de forma prática e rápida.
            // Agradecemos o interesse e ficamos à disposição para ajudar no que for preciso!
            // `,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "debitos") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `*QUER SABER SOBRE SEUS DÉBITOS?*
            // Como acessar seus débitos de forma prática
            // > 📃 Prezados(as),
            // Para consultar seus débitos de maneira rápida e simples, acesse o *Aplicativo do Clube Filadélfia* pelo seu celular.
            // 🔑 Para fazer login, siga as instruções abaixo:
            // > ➡️ Use o *CPF do titular* como usuário;
            // > ➡️ A senha corresponde aos *4 primeiros dígitos do CPF + o dia do aniversário do titular* (somando 6 caracteres no total).
            // Ao entrar, você terá acesso à carteirinha do titular. Basta clicar em “*Meus Débitos*” para visualizar os valores pendentes e encontrar as opções de pagamento disponíveis.
            // Caso não consiga acessar, entre em contato com a secretaria pelo telefone *+55 (33) 3276-7702*, e nossa equipe estará pronta para ajudar.
            // `,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //               if (message.interactive.list_reply.id == "cotas") {
            //                 axios({
            //                   method: "POST",
            //                   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //                   headers: {
            //                     Authorization: `Bearer ${token}`,
            //                   },
            //                   data: {
            //                     messaging_product: "whatsapp",
            //                     recipient_type: "individual",
            //                     to: message.from,
            //                     text: {
            //                       preview_url: true,
            //                       body: `*QUAL VALOR DA COTA INDIVIDUAL? COMO FUNCIONA A COTA INDIVIDUAL?*
            // Cota INDIVIDUAL - Como Funciona:
            // > 🛑 *Cota Participativa*: O associado não pode vender ou transferir a cota.
            // > 🚫 *Sem Convites Gratuitos*: Não dá direito aos convites gratuitos de baixa temporada.
            // > 🗳️ *Sem Votação*: Não participa de votação em assembleias.
            // > 💳 *Perda por Falta de Pagamento*: Se o associado perder a cota por falta de pagamento, poderá adquirir uma nova após 18 meses da data do cancelamento da primeira cota.
            // > 💰 *Valor de Aquisição*: R$ 6.000,00 (em até 5x sem juros).
            // > 🆔 *Valor da Carteirinha*: R$ 5,00.
            // `,
            //                     },
            //                   },
            //                 }).catch((error) => {
            //                   console.error("Erro ao enviar mensagem:", error);
            //                 });
            //               }
            //             }
            //             // Verificar se é hora de enviar o template "hello"
            //             if (
            //               !lastHelloSent[message.from] ||
            //               currentTime - lastHelloSent[message.from] > 3600000 // Enviar apenas uma vez por hora
            //             ) {
            //               //Na nova automação, o invés de eu mandar o axios abaixo com a mensagem de boas vindas, eu mando la pro webhook N8N
            //               // assim quem abre o atendimento é a automação de lá.
            //               // axios({
            //               //   method: "POST",
            //               //   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            //               //   headers: {
            //               //     Authorization: `Bearer ${token}`,
            //               //   },
            //               //   data: {
            //               //     "messaging_product": "whatsapp",
            //               //     "recipient_type": "individual",
            //               //     "to": message.from,
            //               //     "type": "template",
            //               //     "template": {
            //               //       "name": "hello",
            //               //       "language": {
            //               //         "code": "pt_BR"
            //               //       }
            //               //     }
            //               //   },
            //               // }).then(() => {
            //               //   // Registrar o momento em que o template "hello" foi enviado
            //               //   lastHelloSent[message.from] = currentTime;
            //               // }).catch(error => {
            //               //   console.error("Erro ao enviar mensagem:", error);
            //               // });
            //               //}
            //             }
          }
        }
      }
    }

    if (
      req.body.entry &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.statuses[0]
    ) {
      let recipient_id =
        req.body.entry[0].changes[0].value.statuses[0].recipient_id;
      let status = req.body.entry[0].changes[0].value.statuses[0].status;
      let currentTime = moment()
        .tz("America/Sao_Paulo")
        .format("DD-MM-YYYY HH:mm:ss");

      if (status == "delivered") {
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
} catch (err) {
  console.error("FATAL_ERROR_IN_WEBHOOK_HANDLER:", err);
  res.sendStatus(500);
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
  } else {
    res.status(400).send("Missing parameters");
  }
};

// Health check route for Coolify
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.post("/webhook", handleWebhook);
app.get("/webhook", handleVerify);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => console.log(`Webhook is listening on port ${PORT}`));

// MSG PADRÃO DE SAUDAÇÃO
// SOCIEDADE RECREATIVA FILADÉLFIA
// Seja muito bem-vindo(a) ao canal de atendimento automatizado do WhatsApp do Clube Filadélfia! Estamos aqui para ajudá-lo(a) a ter a melhor experiência possível.

// Se deseja falar na Filial, clique no botão abaixo. "Falar na Filial"

// Caso deseje falar na Sede, siga os passos abaixo:

// > Para que você possa acessar todas as informações disponíveis em nosso menu completo, por gentileza, digite a palavra "Menu".

// Assim que fizer isso, você terá acesso a uma ampla gama de opções para explorar, incluindo detalhes sobre nossos serviços, eventos, atividades e muito mais. Estamos ansiosos para atendê-lo(a) e tornar sua experiência conosco verdadeiramente memorável.
// Atenciosamente, Secretaria.
