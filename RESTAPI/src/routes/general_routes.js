const express = require("express");
const router = express.Router();
const userRoutes = require('./user_routes');
const projRoutes = require('./project_routes');
const instance = require ('../database/database');
router.get("/", function(req, res){
    res.send("It's running");
});
router.get('/teste', (req, res) => {

    // Run Cypher query
    const cypher = 'MATCH (n) RETURN n';

    instance.readCypher(cypher)
        .then(result => {

            var results = [];

            for (var i = 0; i < result.records.length; i++) {
                results[i] = result.records[i].get('n');
            }
            // Send response in Json 
            res.send(results);
        })
        .catch(e => {
            // Output the error
            res.status(500).send('Error: ' + e);
        })
        .then(() => {
            // Close the session
            return instance.close();
        });
});


router.use("/auth", userRoutes);
router.use("/project", projRoutes );
module.exports = router;