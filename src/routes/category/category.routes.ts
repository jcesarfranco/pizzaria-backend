import { Router } from 'express';
import { CreateCategoryController } from '../../controllers/category/CreateCategoryController';
import { ListCategoryController } from '../../controllers/category/ListCategoryController';
import { ListProductByCategoryController } from '../../controllers/product/ListProductByCategoryController';
import { isAdmin } from '../../middlewares/isAdmin';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { validateSchema } from '../../middlewares/validateSchema';
import { createCategorySchema } from '../../schemas/categorySchema';
import { listProductByCategorySchema } from '../../schemas/productSchema';

const route = Router();

route.post(
  '/create',
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);

route.get('/listAll', isAuthenticated, new ListCategoryController().handle);

route.get(
  '/list',
  isAuthenticated,
  validateSchema(listProductByCategorySchema),
  new ListProductByCategoryController().handle,
);

export { route };
