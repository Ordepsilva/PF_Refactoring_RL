// Require Neo4j
const Neode = require('neode');

//Test BD
const password = 'teste';
const user = 'pedro';

const instance = new Neode('bolt://localhost:7687', 
user, password);

// Express middleware
module.exports = instance;
