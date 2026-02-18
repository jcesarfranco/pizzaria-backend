import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'O nome precisa ser um texto.' })
      .min(3, { message: 'O nome precisa ter no mínimo 3 letras.' }),
    email: z.email({ message: 'Precisa ser um e-mail válido.' }),
    password: z
      .string({ message: 'A senha é obrigatória.' })
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Precisa ser um e-mail válido.' }),
    password: z
      .string({ message: 'A senha é obrigatória.' })
      .min(1, { message: 'A senha é obrigatória.' }),
  }),
});
