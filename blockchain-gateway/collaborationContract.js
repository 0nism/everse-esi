const Web3 = require('web3');
const fs = require('fs');

const provider = "http://localhost:8545";

const bytecode = fs.readFileSync(__dirname + '/contract/everse_sol_BPDCC.bin').toString();
const abi = JSON.parse(fs.readFileSync(__dirname + '/contract/everse_sol_BPDCC.abi').toString());

const web3 = new Web3(provider);

const everseCollaboration = new web3.eth.Contract(abi);

exports.deploy = async () => {

    const result = await everseCollaboration.deploy({ data: bytecode }).send({
        from: '0xE3A6FB2Cfd696B59fF21F1e7190822062A25E780',
        gas: 1000000,
    });
    return result._address;
}

exports.setContractAddress = (address) => {
    everseCollaboration.options.address = address;
}

exports.createdCollaborationId = async (collaborationName) => {
    return await everseContract.methods.createCollaboration(collaborationName).call();
}

exports.registerActivity = async (collaborationInstanceID, collaborationName, taskName, taskExecutor) => {
    return await everseContract.methods.registerActivity(collaborationInstanceID, collaborationName, taskName, taskExecutor).send({
        from: '0xE3A6FB2Cfd696B59fF21F1e7190822062A25E780',
    });
}

exports.getActivitiesFromInstanceId = async (instanceId) => {
    return await everseContract.methods.get(instanceId).call();
}