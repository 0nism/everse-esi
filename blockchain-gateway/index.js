const Datastore = require('nedb');
const collaboration = require('./collaborationContract');

/* DATABASE */
const contract = new Datastore({ filename: __dirname + '/../contract.db', autoload: true });