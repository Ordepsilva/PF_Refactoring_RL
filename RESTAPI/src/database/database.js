// Require Neo4j
const Neode = require('neode');
const password = 'teste';
const user = 'pedro';

const instance = new Neode('bolt://localhost:11003',user, password);

module.exports = instance;
