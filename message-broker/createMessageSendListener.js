const { Client, logger } = require("camunda-external-task-client-js");
const axios = require("axios");

const camunda_endpoint = process.env.CAMUNDA_ENDPOINT || 'localhost';
const rest_endpoint = process.env.REST_ENDPOINT || 'rest';

const config = { baseUrl: `http://${camunda_endpoint}:8080/${rest_endpoint}`, use: logger };

exports.createMessageSendHandler = (topic, messageName) => {
    const client = new Client(config);

    client.subscribe(topic, async function ({ task, taskService }) {
        const key = task.businessKey;

        const requestBody = {
            messageName: messageName,
            businessKey: key,
            processVariables: {
                amount: {
                    value: task.variables.get('amount'),
                    type: "Double"
                }
            }
        }

        try {
            await axios.post(`http://${camunda_endpoint}:8080/${rest_endpoint}/message`, requestBody);
            console.log(`Succesfully sent Message_FundingRequestReceived message`);
        } catch (error) {
            console.log(error);
        }

        await taskService.complete(task);
    });
}
