import express from 'express';
import {
  getAllStores,
  getNearbyStores,
  getStoreById,
  registerStore,
  getPaymentMethods,
  addPaymentMethod
} from '../controllers/storeController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllStores);
router.get('/nearby', getNearbyStores);
router.get('/:id', getStoreById);
router.post('/register', authenticate, registerStore);
router.get('/:storeId/payments', getPaymentMethods);
router.post('/payments', authenticate, addPaymentMethod);

export default router;
