import { Router } from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product-controller.js';
import { validateProduct } from '../middleware/validateProduct.js';

const router = Router();

router.get('/', getAllProducts);
router.post('/', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
