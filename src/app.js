import express from 'express';
import cors from 'express'

import cartsRoutes from './routes/carts.route'

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(cartsRoutes);
  }
}

export default new App().server;
