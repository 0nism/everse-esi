const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/assets', (req, res) => {
    res.sendStatus(501);
});

app.post('/request', (req, res) => {
    res.sendStatus(501);
})

