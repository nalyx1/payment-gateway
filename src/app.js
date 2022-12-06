import express from 'express';
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'

import cartsRoute from './routes/carts.route'
import transactionsRoute from './routes/transactions.route';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  }

  routes() {
    this.server.use(cartsRoute);
    this.server.use(transactionsRoute)
  }
}

export default new App().server;
