const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const evaluationService = require('./services/evaluation-request.service');

const app = express();
app.use(cors());

app.get('/timestamp', (request, response) => {
  response.send(`${Date.now()}`);
});

app.post('/test', (request, response) => {
  console.log('request', request.body);
  response.send('success');
});

app.post('/evaluation-request', (request, response) => {
  console.log('request.body', request.body);
  const { competencyId, evaluateeId, evaluatorId, message } = request.body;
  evaluationService.createRequest(competencyId, evaluateeId, evaluatorId, message).then((result) => {
    console.log('result', result);
    response.status(200).send({});
  });
});

exports.api = functions.https.onRequest(app);
