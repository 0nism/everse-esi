const { Client, logger } = require("camunda-external-task-client-js");
const axios = require("axios");

const camunda_endpoint = process.env.CAMUNDA_ENDPOINT || 'localhost';
const rest_endpoint = process.env.REST_ENDPOINT || 'rest';

const config = { baseUrl: `http://${camunda_endpoint}:8080/${rest_endpoint}`, use: logger };

exports.createMessageSendHandler = (topic, messageName, variables = [], correlationVariables = []) => {
    const client = new Client(config);


    client.subscribe(topic, async function ({ task, taskService }) {
        try {
            console.log('Received request');
            const key = task.businessKey;
            console.log(key);

            const processVariables = {};

            variables.forEach((variable) => {
                processVariables[variable] = task.variables.getTyped(variable);
            });

            const correlationKeys = {};

            correlationVariables.forEach((variable) => {
                const { valueInfo, ...correlationKey } = task.variables.getTyped(variable);
                correlationKeys[variable] = correlationKey;
            });

            console.log(processVariables);
            console.log(correlationKeys);

            const requestBody = {
                messageName: messageName,
                businessKey: key,
                processVariables: processVariables,
                correlationKeys: correlationKeys,
            };

            await axios.post(`http://${camunda_endpoint}:8080/${rest_endpoint}/message`, requestBody);
            console.log(`Succesfully sent ${messageName} message`);

            await taskService.complete(task);
        } catch (err) {
            console.log(err);
        }

    });
}
