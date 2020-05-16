const Web3 = require('web3');
const fs = require('fs');

const provider = "http://localhost:8545";

const bytecode = fs.readFileSync(__dirname + '/contract/everse_sol_BPDCC.bin').toString();
const abi = JSON.parse(fs.readFileSync(__dirname + '/contract/everse_sol_BPDCC.abi').toString());

const web3 = new Web3(provider);

const everseCollaboration = new web3.eth.Contract(abi);

exports.deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const result = await everseCollaboration.deploy({ data: bytecode }).send({
        from: accounts[0],
        gas: 1000000,
    });
    return result._address;
}

exports.setContractAddress = (address) => {
    everseCollaboration.options.address = address;
}

exports.generateCollaborationId = async (collaborationName) => {
    return await everseCollaboration.methods.createCollaboration(collaborationName).call();
}

exports.registerActivity = async (collaborationInstanceID, collaborationName, taskName, taskExecutor) => {
    const accounts = await web3.eth.getAccounts();
    return await everseCollaboration.methods.registerActivity(collaborationInstanceID, collaborationName, taskName, taskExecutor).send({
        from: accounts[0],
    });
}

exports.getActivitiesFromInstanceId = async (instanceId) => {
    return await everseCollaboration.methods.get(instanceId).call();
}