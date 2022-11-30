import { Router } from 'express';

// import all controllers
import CartsController from '../controllers/carts.controller';

const routes = new Router();

// Add routes
routes.get('/cart', CartsController.findAll);
routes.post('/cart', CartsController.create);
routes.put('/cart/:id', CartsController.update);
routes.delete('/cart/:id', CartsController.delete);

export default routes;
