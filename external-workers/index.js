const { Client, Variables, logger } = require("camunda-external-task-client-js");

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
    console.log(`Add asset to database: amount: ${task.variables.get('amount')}, tokenprice: ${task.variables.get('tokenPrice')} ,3 tokens`);

    await taskService.complete(task);
});
