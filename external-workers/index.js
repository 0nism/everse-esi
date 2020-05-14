const { Client, Variables, logger } = require("camunda-external-task-client-js");
const Datastore = require('nedb');
const collaboration = require('./collaborationContract');

/* DATABASE */
const db = new Datastore({ filename: __dirname + '/../assets.db', autoload: true });
const contract = new Datastore({ filename: __dirname + '/../contract.db', autoload: true });

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
                main();
            })
        } else {
            collaboration.setContractAddress(documents[0].address);
            main();
        }
    }
});

const main = () => {
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

    client.subscribe('Service_RegisterPurchase', async function ({ task, taskService }) {
        const assetId = task.variables.get('assetId');
        const buyer = task.variables.get('buyer');
        const quantity = task.variables.get('quantity');

        db.findOne({ _id: assetId }, async (err, asset) => {
            if (err) {
                console.log('error');
            }
            console.log(asset);
            if (asset.nTokens >= quantity) {
                const newTokens = asset.nTokens - quantity;
                db.update({ _id: assetId }, { ...asset, nTokens: newTokens }, {}, async (err, result) => {
                    console.log(`Token remaining: ${newTokens}`);
                    const processVariables = new Variables();
                    processVariables.set('tokensRemaining', newTokens !== 0);
                    await taskService.complete(task, processVariables);
                });
            } else {
                console.log('cannot buy tokens anymore');
            }
        });
    });
}
