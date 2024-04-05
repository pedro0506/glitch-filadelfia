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

const handleWebhook = (req, res) => {
  let body = req.body;

      

  if (req.body.object) {
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

      // INICIO DE AUTOMAÇÃO
      const message = req.body.entry[0].changes[0].value.messages[0];
      console.log("MESSAGE_RECEBIDA" + message);
      // check if the incoming message contains text
      if (message && message.type === "text") {
        // extract the business number to send the reply from it
        const business_phone_number_id =
          req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

          // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
          axios({
            method: "POST",
            url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            headers: {
              Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: {
              messaging_product: "whatsapp",
              to: message.from,
              text: { body: "Olá você escolheu a opção 1" },
              context: {
                message_id: message.id, // shows the message as a reply to the original user message
              },
            },
          });
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
