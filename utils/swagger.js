const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'PET BOOKING API Docs (づ｡◕‿‿◕｡)づ',
            version: '0.1.0',
            description: '(づ｡◕‿‿◕｡)づ'
        },
        servers: [
            {
                url: 'http://localhost:2000/',
            },
        ]
    },
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJsDoc(options)

function swaggerDocs(app){
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

module.exports = swaggerDocs;