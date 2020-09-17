require('dotenv/config');
// Require Neo4j
const Neode = require('neode');
const password = process.env.DBPASSWORD;
const user = process.env.DBUSER;
const dbURL = process.env.DBURL;

const instance = new Neode(dbURL, user, password);

module.exports = instance;
