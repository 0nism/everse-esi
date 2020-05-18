const Datastore = require('nedb');
const express = require('express');
const bodyParser = require('body-parser');
const collaboration = require('./collaborationContract');

const contract = new Datastore({ filename: __dirname + '/../contract.db', autoload: true });

const app = express();

app.use(bodyParser.json());

app.get('/collaborationId/:key', async (req, res) => {
    const data = await collaboration.generateCollaborationId(req.params.key);
    console.log(data);
    res.send(data);
});

app.post('/:id', async (req, res) => {
    const collaborationId = req.params.id;
    const data = req.body;
    if (!data.collaborationName || !data.taskName || !data.taskExecutor) {
        return res.sendStatus(400);
    }

    const response = await collaboration.registerActivity(collaborationId, data.collaborationName, data.taskName, data.taskExecutor);
    res.send(response);
});

app.get('/:id', async (req, res) => {
    const id = req.params.id;

    const response = await collaboration.getActivitiesFromInstanceId(id);
    res.send(response);
});

contract.find({}, async (error, documents) => {
    if (error) {
        console.log('Error reading contract db');
    } else {
        if (documents.length === 0) {
            const collaborationAddress = await collaboration.deploy();
            contract.insert({ address: collaborationAddress }, (err, doc) => {
                if (err) {
                    console.log('Error inserting contract address to db');
                    return;
                }
                collaboration.setContractAddress(doc.address);
            });
        } else {
            collaboration.setContractAddress(documents[0].address);
        }
    }

    startWS();
});

const startWS = () => {
    app.listen(3002, () => {
        console.log('Blockchain gateway listening on port 3002');
    });
}