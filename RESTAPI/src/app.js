const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();
var session = require('./middlewares/session');
const routes = require('./routes/generalRoutes');
//Middlewares
app.use(cors());
app.use(bodyparser.json());
app.use(session);

//Routes
app.use('/', routes);

//Server listen 3000
app.listen(3000,()=>{
    console.log('Listening on :3000');
});