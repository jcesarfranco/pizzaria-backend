import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/multer';
import { CreateCategoryController } from '../controllers/category/CreateCategoryController';
import { ListCategoryController } from '../controllers/category/ListCategoryController';
import { CreateProductController } from '../controllers/product/CreateProductController';
import { DeleteProductController } from '../controllers/product/DeleteProductController';
import { ListProductByCategoryController } from '../controllers/product/ListProductByCategoryController';
import { ListProductController } from '../controllers/product/ListProductController';
import { AuthUserController } from '../controllers/user/AuthUserController';
import { CreateUserController } from '../controllers/user/CreateUserController';
import { DetailUserController } from '../controllers/user/DetailUserController';
import { isAdmin } from '../middlewares/isAdmin';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateSchema } from '../middlewares/validateSchema';
import { createCategorySchema } from '../schemas/categorySchema';
import {
  createProductSchema,
  listProductByCategorySchema,
  listProductSchema,
} from '../schemas/productSchema';
import { authUserSchema, createUserSchema } from '../schemas/userSchema';

const router = Router();
const upload = multer(uploadConfig);

router.get('/', (req, res) => {
  console.log('API is running!');
  return res.send('<h1>API is running!</h1>');
});

router.post(
  '/users',
  validateSchema(createUserSchema),
  new CreateUserController().handle,
);

router.post(
  '/session',
  validateSchema(authUserSchema),
  new AuthUserController().handle,
);

router.get('/me', isAuthenticated, new DetailUserController().handle);

router.post(
  '/category',
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);

router.get('/category', isAuthenticated, new ListCategoryController().handle);

router.post(
  '/product',
  isAuthenticated,
  isAdmin,
  upload.single('file'),
  validateSchema(createProductSchema),
  new CreateProductController().handle,
);

router.get(
  '/products',
  isAuthenticated,
  validateSchema(listProductSchema),
  new ListProductController().handle,
);

router.delete(
  '/product',
  isAuthenticated,
  isAdmin,
  new DeleteProductController().handle,
);

router.get(
  '/category/product',
  isAuthenticated,
  validateSchema(listProductByCategorySchema),
  new ListProductByCategoryController().handle,
);

export { router };
