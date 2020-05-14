const Web3 = require('web3');
const fs = require('fs');

const provider = "http://localhost:8545";

const bytecode = fs.readFileSync(__dirname + '/contract/everse_sol_BPDCC.bin').toString();
const abi = JSON.parse(fs.readFileSync(__dirname + '/contract/everse_sol_BPDCC.abi').toString());

const web3 = new Web3(provider);

const test = async () => {

    const everseContract = new web3.eth.Contract(abi);
    const result = await everseContract.deploy({ data: bytecode }).send({
        from: '0xE3A6FB2Cfd696B59fF21F1e7190822062A25E780',
        gas: 1000000,
    });
    const address = result._address;

    everseContract.options.address = address;
    console.log(everseContract.methods);

    const collaborationInstanceID = await everseContract.methods.createCollaboration('test').call();
    console.log(collaborationInstanceID);
    const registerTest = await everseContract.methods.registerActivity(collaborationInstanceID, "Everse", "testTask", "testExecutor");
    console.log(registerTest);
}

test();