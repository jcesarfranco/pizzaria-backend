import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import prismaClient from '../../prisma/index';

interface AuthUserProps {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthUserProps) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('Email/Senha inválidos');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Email/Senha inválidos');
    }

    const token = sign(
      { name: user.name, email: user.email },
      process.env.JWT_SECRET as string,
      { subject: user.id, expiresIn: '30d' },
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    };
  }
}

export { AuthUserService };
