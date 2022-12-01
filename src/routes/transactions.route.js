import { Router } from 'express';

// import all controllers
import TransactionsController from '../controllers/transactions.controller';

const routes = new Router();

// Add routes
// routes.get('/transactions', TransactionsController.created);
routes.post('/transactions', TransactionsController.create);
// routes.put('/', SessionController.store);
// routes.delete('/', SessionController.store);

export default routes;