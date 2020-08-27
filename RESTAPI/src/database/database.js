require('dotenv/config');
// Require Neo4j
const Neode = require('neode');
const password = process.env.DBPASSWORD;
const user = process.env.DBUSER;

const instance = new Neode('bolt://localhost:7687',user, password);

module.exports = instance;
