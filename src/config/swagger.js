import swaggerJSDoc from "swagger-jsdoc";


const options = {
definition: {
openapi: '3.0.0',
info: {
title: 'Bakery Inventory API',
version: '1.0.0',
description: 'API documentation for Bakery Inventory System'
},
servers: [
{ url: 'http://localhost:4000' }
],
components: {
securitySchemes: {
bearerAuth: {
type: 'http',
scheme: 'bearer'
}
}
},
security: [{ bearerAuth: [] }]
},
apis: ['./src/routes/*.js']
};


const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec