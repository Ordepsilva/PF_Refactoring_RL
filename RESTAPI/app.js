const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();
const session = require('./src/middlewares/session');
const routes = require('./src/routes/generalRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Rest API',
            description: "REST API Information",
            contact: {
                name: "Pedro Silva"
            },
            servers: ["http://localhost:3000"]
        },
        securityDefinitions:{
            bearerAuth: {
                type: 'apiKey',
                name: 'x-access-token',
                scheme: 'bearer',
                in: 'header'
            },
        },
    },
    apis: ['./src/routes/*.js', './src/models/*js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Middlewares
app.use(cors());
app.use(bodyparser.json());
app.use(session);

//Routes
app.use('/', routes);

//Server listen 3000
app.listen(3000, () => {
    console.log('Listening on :3000');
});