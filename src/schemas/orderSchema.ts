import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({ message: 'O número da mesa é obrigatório' })
      .int({ message: 'O número da mesa deve ser um número inteiro' })
      .positive({ message: 'O número da mesa deve ser um número positivo' }),
    name: z.string().optional(),
  }),
});

export const addItemSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: 'O ID do pedido é obrigatório' })
      .min(1, { message: 'O ID do pedido deve conter pelo menos 1 caractere' }),
    product_id: z.string({ message: 'O ID do produto é obrigatório' }).min(1, {
      message: 'O ID do produto deve conter pelo menos 1 caractere',
    }),
    amount: z
      .number({ message: 'A quantidade é obrigatória' })
      .int({ message: 'A quantidade deve ser um número inteiro' })
      .positive({ message: 'A quantidade deve ser um número positivo' }),
  }),
});
