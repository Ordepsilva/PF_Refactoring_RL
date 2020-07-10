const express = require("express");
const router = express.Router();
const userRoutes = require('./userRoutes');
const projRoutes = require('./projectRoutes');
const instance = require ('../database/database');
router.get("/", function(req, res){
    res.send("It's running");
});
router.get('/teste', (req, res) => {
    const cypher = 'MATCH (n) RETURN n';

    instance.readCypher(cypher)
        .then(result => {
            var results = [];
            for (var i = 0; i < result.records.length; i++) {
                results[i] = result.records[i].get('n');
            }
            res.send(results);
        })
        .catch(e => {
            res.status(500).send('Error: ' + e);
        })
        .then(() => {
            return instance.close();
        });
});

router.use("/auth", userRoutes);
router.use("/project", projRoutes);
module.exports = router;