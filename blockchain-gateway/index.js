const Datastore = require('nedb');
const express = require('express');
const bodyParser = require('body-parser');
const collaboration = require('./collaborationContract');


/* DATABASE */
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
            })
        } else {
            collaboration.setContractAddress(documents[0].address);
        }
    }
});