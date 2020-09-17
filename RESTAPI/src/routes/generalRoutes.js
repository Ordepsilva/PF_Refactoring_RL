const express = require("express");
const router = express.Router();
const userRoutes = require('./userRoutes');
const projRoutes = require('./projectRoutes');
const mendeleyRoutes = require('./mendeleyRoutes');
router.get("/", function (req, res) {
    res.send("It's running");
});

router.use("/auth", userRoutes);

router.use("/project", projRoutes);

router.use("/mendeley", mendeleyRoutes);

module.exports = router;