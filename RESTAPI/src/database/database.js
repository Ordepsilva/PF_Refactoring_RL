// Require Neo4j
const Neode = require('neode');

//Test BD
const password = 'teste';
const user = 'pedro';

const instance = new Neode('bolt://localhost:11003', 
user, password);

// Express middleware
module.exports = instance;
