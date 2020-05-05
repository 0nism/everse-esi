const { Client, Variables, logger } = require("camunda-external-task-client-js");

/* DATABASE */
const Datastore = require('nedb');
const db = new Datastore({ filename: __dirname + '/../assets.db', autoload: true });

/* WORKERS */
const camunda_endpoint = process.env.CAMUNDA_ENDPOINT || 'localhost';
const rest_endpoint = process.env.REST_ENDPOINT || 'rest';

const config = { baseUrl: `http://${camunda_endpoint}:8080/${rest_endpoint}`, use: logger };

const client = new Client(config);

client.subscribe('Service_SplitAsset', async function ({ task, taskService }) {
    const totalAmount = task.variables.get('amount');
    const fee = 0.03; // 3% fee
    const tokens = 3;

    const tokenPrice = (totalAmount * (1 + fee)) / tokens;

    const processVariables = new Variables();
    processVariables.set('tokenPrice', tokenPrice);

    await taskService.complete(task, processVariables);
});

client.subscribe('Service_PublishAndRunCampaign', async function ({ task, taskService }) {
    const document = {
        assetName: task.variables.get('assetName'),
        amount: task.variables.get('amount'),
        nTokens: 3,
        tokenPrice: task.variables.get('tokenPrice'),
        businessKey: task.businessKey,
        requestCorrelationId: task.variables.get('requestCorrelationId'),

    }
    db.insert(document, async function (err, newDoc) {
        if (err) {
            console.log(err);
            return;
        }
        await taskService.complete(task);
    });
});
