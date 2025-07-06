import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Restaurantes da Universidade UNB',
      version: '1.0.0',
      description:
        'This is the API documentation for the Database project, focused on managing information about university restaurants.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development Server',
      },
    ],
  },
  // Path to the API docs, which are the files containing the JSDoc comments
  apis: ['./src/api/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
