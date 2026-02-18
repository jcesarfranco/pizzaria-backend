import type createCategoryProps from '../../interfaces/CreateCategoryInterface';
import prismaClient from '../../prisma/index';

// interface createCategoryProps {
//   name: string;
// }

class CreateCategoryService {
  async execute({ name }: createCategoryProps) {
    try {
      const category = await prismaClient.category.create({
        data: {
          name: name,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      return category;
    } catch (err) {
      throw new Error('Falha ao criar categoria');
    }
  }
}

export { CreateCategoryService };
