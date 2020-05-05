const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/* DATABASE */
const Datastore = require('nedb');

/* WEB SERVICE */
const app = express();

app.use(bodyParser.json());

app.get('/assets', (req, res) => {
    const db = new Datastore({ filename: __dirname + '/../assets.db', autoload: true });

    db.find({}, (err, documents) => {
        if (err) {
            return res.sendStatus(500);
        }

        return res.send(documents);
    });
});

app.post('/request', async (req, res) => {
    const request = req.body;
    const startProcessUrl = 'http://localhost:8080/rest/process-definition/key/FundingRequest/start';

    const businessKey = uuidv4();
    const requestCorrelationId = uuidv4();

    const startEventBody = {
        variables: {
            requestCorrelationId: {
                value: requestCorrelationId,
                type: "String"
            },
            amount: {
                value: request.amount,
                type: "Double"
            },
            assetName: {
                value: request.assetName,
                type: "String"
            }
        },
        businessKey: businessKey,
    };


    try {
        const response = await axios.post(startProcessUrl, startEventBody);
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

app.listen(3001, () => {
    console.log('Gateway listening on port 3001');
});