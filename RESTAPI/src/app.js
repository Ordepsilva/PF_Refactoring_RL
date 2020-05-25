const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();
const routes = require('./routes/general_routes');
//Middlewares

app.use(cors());
app.use(bodyparser.json());


//Routes
app.use('/', routes);

//Server listen 3000
app.listen(3000,()=>{
    console.log('Listening on :3000');
});