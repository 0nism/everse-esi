const express = require('express');
const bodyParser = require('body-parser');

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

app.post('/request', (req, res) => {
    res.sendStatus(501);
});

app.listen(3001, () => {
    console.log('Gateway listening on port 3001');
});