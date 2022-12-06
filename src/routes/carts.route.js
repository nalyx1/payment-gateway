import { Router } from 'express';

// import all controllers
import CartsController from '../controllers/carts.controller';

const routes = new Router();

// Add routes
routes.get('/carts', CartsController.findAll);
routes.post('/carts', CartsController.create);
routes.put('/carts/:id', CartsController.update);
routes.delete('/carts/:id', CartsController.delete);

export default routes;
