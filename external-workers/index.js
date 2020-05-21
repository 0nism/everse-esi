const { Client, Variables, logger } = require("camunda-external-task-client-js");
const Datastore = require('nedb');
const axios = require('axios');

/* DATABASE */
const db = new Datastore({ filename: __dirname + '/../assets.db', autoload: true });

/* WORKERS */
const camunda_endpoint = process.env.CAMUNDA_ENDPOINT || 'localhost';
const rest_endpoint = process.env.REST_ENDPOINT || 'rest';

const config = { baseUrl: `http://${camunda_endpoint}:8080/${rest_endpoint}`, use: logger };

const client = new Client(config);

client.subscribe('Service_SplitAsset', async function ({ task, taskService }) {
    const totalAmount = task.variables.get('amount');
    const fee = 0.03;
    const tokens = task.variables.get('tokens');
    console.log(`Number of tokens: ${tokens}`);

    const tokenPrice = (totalAmount * (1 + fee)) / tokens;

    const processVariables = new Variables();
    processVariables.set('tokenPrice', tokenPrice);

    try {
        await axios.post(`http://localhost:3002/${task.businessKey}`, {
            collaborationName: "Everse Funding",
            taskName: "Split asset in tokens",
            taskExecutor: "Everse Platform"
        });
    } catch (error) {
        console.log(error);
    }

    await taskService.complete(task, processVariables);
});

client.subscribe('Service_PublishAndRunCampaign', async function ({ task, taskService }) {
    const document = {
        assetName: task.variables.get('assetName'),
        amount: task.variables.get('amount'),
        nTokens: task.variables.get('tokens'),
        tokenPrice: task.variables.get('tokenPrice'),
        businessKey: task.businessKey,
        requestCorrelationId: task.variables.get('requestCorrelationId'),

    }
    db.insert(document, async function (err, newDoc) {
        if (err) {
            console.log(err);
            return;
        }
        try {
            await axios.post(`http://localhost:3002/${task.businessKey}`, {
                collaborationName: "Everse Funding",
                taskName: "Publish and run campaign",
                taskExecutor: "Everse Platform"
            });
        } catch (error) {
            console.log(error);
        }
        await taskService.complete(task);
    });
});

client.subscribe('Service_RegisterPurchase', async function ({ task, taskService }) {
    const assetId = task.variables.get('assetId');
    const buyer = task.variables.get('buyer');
    const quantity = task.variables.get('quantity');

    db.findOne({ _id: assetId }, async (err, asset) => {
        if (err) {
            console.log('error');
            return;
        }
        console.log(asset);
        if (asset.nTokens >= quantity && quantity != 0) {
            const newTokens = asset.nTokens - quantity;
            db.update({ _id: assetId }, { ...asset, nTokens: newTokens }, {}, async (err, result) => {
                console.log(`Token remaining: ${newTokens}`);
                const processVariables = new Variables();
                processVariables.set('tokensRemaining', newTokens !== 0);
                console.log('Registering on blockchain');
                try {
                    await axios.post(`http://localhost:3002/${task.businessKey}`, {
                        collaborationName: "Everse Funding",
                        taskName: "Bought tokens",
                        taskExecutor: "Everse Platform Token Sale"
                    });
                } catch (error) {
                    console.log(error);
                }
                await taskService.complete(task, processVariables);
            });
        } else {
            console.log('cannot buy tokens anymore');
        }
    });
});