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
    
      if (message) {
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
            if(message.type === "text"){
            if (message.text.body && message.text.body.includes('Menu')) {
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

            if (message.text.body && message.text.body == '1') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                  ContentType: 'application/json',
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "type": "interactive",
                  "interactive": {
                      "type": "list",
                      "header": {
                          "type": "text",
                          "text": "SOCIEDADE RECREATIVA FILADÉLFIA"
                      },
                      "body": {
                          "text": "Informações Gerais"
                      },
                      "footer": {
                          "text": "clique no botão para visualizar as opções."
                      },
                      "action": {
                          "button": "Abrir menu",
                          "sections": [
                              {
                                  "title": "Horários",
                                  "rows": [
                                      {
                                          "id": "Secretaria",
                                          "title": "Secretaria",
                                          "description": ""
                                      },
                                      {
                                          "id": "Clube",
                                          "title": "Clube",
                                          "description": ""
                                      },
                                      {
                                          "id": "Sauna",
                                          "title": "Sauna",
                                          "description": ""
                                      },
                                      {
                                          "id": "Churrasqueiras",
                                          "title": "Churrasqueiras",
                                          "description": ""
                                      },
                                      {
                                          "id": "Piscinas",
                                          "title": "Piscinas",
                                          "description": ""
                                      }
                                  ]
                              },
                              {
                                  "title": "Localização",
                                  "rows": [
                                      {
                                          "id": "Mapa",
                                          "title": "Mapa",
                                          "description": ""
                                      },
                                  ]
                              },
                              {
                                "title": "Contatos",
                                "rows": [
                                    {
                                        "id": "Telefones",
                                        "title": "Secretaria",
                                        "description": ""
                                    },
                                    {
                                      "id": "Outros",
                                      "title": "Outros",
                                      "description": ""
                                  },
                                ]
                              }
                            ]
                      }
                   }
                 },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.text.body && message.text.body == '3') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                  ContentType: 'application/json',
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "type": "interactive",
                  "interactive": {
                      "type": "list",
                      "header": {
                          "type": "text",
                          "text": "SOCIEDADE RECREATIVA FILADÉLFIA"
                      },
                      "body": {
                          "text": "Reservas"
                      },
                      "footer": {
                          "text": "clique no botão para visualizar as opções."
                      },
                      "action": {
                          "button": "Abrir menu",
                          "sections": [
                              {
                                  "title": "Reservas",
                                  "rows": [
                                      {
                                          "id": "Reserva_Churras",
                                          "title": "Churrasqueiras",
                                          "description": ""
                                      },
                                      
                                  ]
                              },
                              
                            ]
                      }
                   }
                 },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.text.body && message.text.body == '4') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                  ContentType: 'application/json',
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "type": "interactive",
                  "interactive": {
                      "type": "list",
                      "header": {
                          "type": "text",
                          "text": "SOCIEDADE RECREATIVA FILADÉLFIA"
                      },
                      "body": {
                          "text": "Eventos"
                      },
                      "footer": {
                          "text": "clique no botão para visualizar as opções."
                      },
                      "action": {
                          "button": "Abrir menu",
                          "sections": [
                              {
                                  "title": "Eventos",
                                  "rows": [
                                      {
                                          "id": "Calendario",
                                          "title": "Calendário de Eventos",
                                          "description": ""
                                      },
                                      {
                                        "id": "Contato_evento",
                                        "title": "Contato Eventos",
                                        "description": ""
                                    },
                                      
                                  ]
                              },
                              
                            ]
                      }
                   }
                 },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            
            if (message.text.body && message.text.body == '5') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                  ContentType: 'application/json',
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "type": "interactive",
                  "interactive": {
                      "type": "list",
                      "header": {
                          "type": "text",
                          "text": "SOCIEDADE RECREATIVA FILADÉLFIA"
                      },
                      "body": {
                          "text": "Suporte"
                      },
                      "footer": {
                          "text": "clique no botão para visualizar as opções."
                      },
                      "action": {
                          "button": "Abrir menu",
                          "sections": [
                              {
                                  "title": "Dúvidas",
                                  "rows": [
                                      {
                                          "id": "aquisicao",
                                          "title": "Aquisição de Cota",
                                          "description": ""
                                      },
                                      {
                                        "id": "venda",
                                        "title": "Venda de Cota",
                                        "description": ""
                                      },
                                      {
                                        "id": "compra",
                                        "title": "Cota para terceiro",
                                        "description": ""
                                      },
                                      {
                                        "id": "fotografias",
                                        "title": "Fotografias no clube",
                                        "description": ""
                                      },
                                      
                                  ]
                              },
                              {
                                "title": "Falar/Atendente",
                                "rows": [
                                    {
                                        "id": "atendente",
                                        "title": "Telefone",
                                        "description": ""
                                    },
                                  ]
                            },
                            ]
                      }
                   }
                 },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }


            if (message.text.body && message.text.body == '6') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                  ContentType: 'application/json',
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "type": "interactive",
                  "interactive": {
                      "type": "list",
                      "header": {
                          "type": "text",
                          "text": "SOCIEDADE RECREATIVA FILADÉLFIA"
                      },
                      "body": {
                          "text": "Esportes"
                      },
                      "footer": {
                          "text": "clique no botão para visualizar as opções."
                      },
                      "action": {
                          "button": "Abrir menu",
                          "sections": [
                              {
                                  "title": "Modalidades",
                                  "rows": [
                                      {
                                          "id": "natacao",
                                          "title": "Natação",
                                          "description": "e Hidroginástica"
                                      },
                                      {
                                        "id": "futebol",
                                        "title": "Futebol",
                                        "description": "Futsal/Goleiro/Vôlei Feminino"
                                      },
                                      {
                                        "id": "karate",
                                        "title": "Karatê/Judô",
                                        "description": "Aikido/Jiu-Jitsu/Pickleball"
                                      },
                                      {
                                        "id": "tenis",
                                        "title": "Tênis/Basquete",
                                        "description": ""
                                      },
                                      {
                                        "id": "treinamento",
                                        "title": "Treinamento",
                                        "description": "Funcional adulto e kids"
                                      },
                                      {
                                        "id": "bale",
                                        "title": "Ballet/Jazz/FitDance",
                                        "description": ""
                                      },
                                      
                                  ]
                              },
                              {
                                "title": "Horiários",
                                "rows": [
                                    {
                                        "id": "hora_esp",
                                        "title": "Horários",
                                        "description": ""
                                    },
                                  ]
                              },
                              {
                                "title": "Valores",
                                "rows": [
                                    {
                                        "id": "valores",
                                        "title": "Valores esportes",
                                        "description": ""
                                    },
                                  ]
                              },
                              {
                                "title": "Contato",
                                "rows": [
                                    {
                                        "id": "contato_esp",
                                        "title": "Telefone/Esportes",
                                        "description": ""
                                    },
                                  ]
                              },
                            ]
                      }
                   }
                 },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.text.body && message.text.body == '7') {
              axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                  Authorization: `Bearer ${token}`,
                  ContentType: 'application/json',
                },
                data: {
                  "messaging_product": "whatsapp",
                  "recipient_type": "individual",
                  "to": message.from,
                  "type": "interactive",
                  "interactive": {
                      "type": "list",
                      "header": {
                          "type": "text",
                          "text": "SOCIEDADE RECREATIVA FILADÉLFIA"
                      },
                      "body": {
                          "text": "Convites"
                      },
                      "footer": {
                          "text": "clique no botão para visualizar as opções."
                      },
                      "action": {
                          "button": "Abrir menu",
                          "sections": [
                              {
                                  "title": "Convites",
                                  "rows": [
                                      {
                                          "id": "convite",
                                          "title": "Convite Day use ",
                                          "description": "e Hidroginástica"
                                      },
                                  ]
                              },
                              
                            ]
                      }
                   }
                 },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }         

          }

          if(message.type === "interactive"){

            if (message.interactive.list_reply.id == 'Secretaria') {
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
                    "body": "*Qual o horario de funcionamento da secretaria?*\n\nSegunda a sexta - 8:30 às 18:15h\nSábado - 9:15 às 16:15h"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'Clube') {
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
                    "body": "*Qual o horario de funcionamento do clube?*\n\nSegunda-feira - 15:00 às 22:00h\nTerça a sexta-feira - 6:00 às 22:00h\nSábado, domingo e feriado - 6:00 às 19:00h"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'Sauna') {
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
                    "body": "*Qual o horario de funcionamento da sauna?*\n\nSegunda a sexta-feira - 16:00 às 21:45h\nSábado, domingo e feriado - 11:00 às 18:45h"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'Churrasqueiras') {
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
                    "body": "*Qual o horario de funcionamento das churrasqueiras?\n\nDe segunda a sexta até a 00:00\nSábado, domingo e feriado até as 19:00"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'Piscinas') {
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
                    "body": "*Qual o horario de funcionamento das piscinas*\n\nSegunda a sexta até às 20h\nSábado, domingo e feriado até às 18h"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            // https://maps.app.goo.gl/Cer65eTpuZqU5L796

            if (message.interactive.list_reply.id == 'Mapa') {
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
                    "body": "Acesse a localização pelo link: https://maps.app.goo.gl/Cer65eTpuZqU5L796"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'Telefones' || message.interactive.list_reply.id == 'atendente') {
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
                    "body": "Contato/Telefones: (33) 3276-7702 / 3276-7709"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'Reserva_Churras') {
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
                    "body": "*Como faz e onde faz a reserva da churrasqueira? Tem algum valor diferenciado?*\n\nA reserva da churrasqueira é feita no dia em que vai usar, por ordem de chegada, na portaria do estacionamento a partir das 6h da manhã.\nReserva feita pelo titular ou conjuge mediante apresentação da carteirinha\n*A partir de Segunda Feira dia 18/12 Preço novo*\n\n-Convite para churrasqueira válidos de segunda a sexta.\n-Deve ser retirado para os convidados na secretaria apresentando a senha da churrasqueira e documento pessoal de cada convidado.\n-Máximo de 15 pessoas.\n-Valor do convite 20,00 por pessoa.\n-Entrada do convidado liberada a partir das 19hrs.\n-A partir de 5 anos paga.\n-Cantor e churrasqueiro deve ser feita a compra do convite."
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'Contato_evento') {
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
                    "body": "Informações sobre eventos enviar mensagem para o número +55 33 9961-0892."
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'Calendario') {
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
                    "body": "Sem registros de eventos."
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'aquisicao') {
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
                    "body": "*Qual o valor da cota atualmente? Tem cota no clube disponível?*\n\nNo momento não está sendo vendido nenhuma cota diretamente do clube. \nPara adquirir uma cota atualmente é só a comum, onde é apenas por transferência de algum associado onde além do valor que ele avalia a sua cota, você também paga a taxa de transferência para o clube, no valor de 2.500,00 e os 5,00 de cada carteirinha. \n\nSe tiver interesse na cota comum, pode entrar no site onde tem as pessoas que tem interesse de vender. 😊\n\nSite: clubefiladelfia.com.br"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'venda') {
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
                    "body": "*Quero vender minha cota, qual o procedimento?*\n\nTemos a opção de colocar no nosso banco de cotas no site do clube, nos envie seu número e nome completo por gentileza direto para a atendente pelos números (33) 3276-7702 / 3276-7709"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'compra') {
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
                    "body": "*Comprei uma cota de terceiros, qual o procedimento agora?*\n\nÉ necessário que venha na secretaria para ser explicado o formulário de aquisição de cota que precisa ser preenchido e assinado pelo novo titular.\n\nHorário de funcionamento da secretaria\nSegunda a sexta - 8:30 às 18:15h\nSábado - 9:15 às 16:15h"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'fotografias') {
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

            if (message.interactive.list_reply.id == 'natacao') {
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
                    "body": "Veja esse item no WhatsApp: https://wa.me/p/7138771676213415/553399294013\nDescrição: NATAÇÃO/HIDROGINASTICA"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'futebol') {
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
                    "body": "Veja esse item no WhatsApp: https://wa.me/p/6922069664508728/553399294013\nDescrição: FUTEBOL/FUTSAL/GOLEIRO/VOLEI FEMININO"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'treinamento') {
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
                    "body": "Veja esse item no WhatsApp: https://wa.me/p/6981547348639403/553399294013\nDescrição: TREINAMENTO FUNCIONAL ADULTO E KIDS/ PETECA"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'tenis') {
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
                    "body": "Veja esse item no WhatsApp: https://wa.me/p/6964990853555235/553399294013\nDescrição: TENIS/ BASQUETE"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'bale') {
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
                    "body": "Veja esse item no WhatsApp: https://wa.me/p/24506368005678311/553399294013\nDescrição: BALLET/ JAZZ/ FIT DANCE"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'contato_esp' || message.interactive.list_reply.id == 'hora_esp' || message.interactive.list_reply.id == 'valores') {
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
                    "body": "Informações sobre esportes enviar mensagem para o número +55 33 9994-1053"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }

            if (message.interactive.list_reply.id == 'convite') {
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
                    "body": "Veja esse item no WhatsApp: https://wa.me/p/6839102372836189/553399294013"
                  }
                },
              }).catch(error => {
                console.error("Erro ao enviar mensagem:", error);
              });
            }


            

          }
    
            // Verificar se é hora de enviar o template "hello"
            if (
              (!lastHelloSent[message.from] || (currentTime - lastHelloSent[message.from] > 3600000)) // Enviar apenas uma vez por hora
            ) {
              if(message.text.body == 'crwa'){
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
    }
    


    if (
      req.body.entry &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.statuses[0]
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
