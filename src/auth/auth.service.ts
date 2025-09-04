import { User } from '../shared/interfaces/user.interface';
import { RegisterDto, LoginDto } from './auth.dto';
import { hashPassword, comparePassword } from '../shared/utils/password.util';
import { generateToken } from '../shared/utils/jwt.util';
import { CustomError } from '../shared/utils/custom-error';
import { inMemoryStore } from '../shared/data/in-memory-store';
import { randomUUID } from 'crypto';

export class AuthService {
  async register(data: RegisterDto): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Check if user exists
    const existingUser = inMemoryStore.users.find(u => u.email === data.email);
    if (existingUser) {
      throw new CustomError('User already exists', 400);
    }

    // Create new user
    const hashedPassword = await hashPassword(data.password);
    const newUser: User = {
      id: randomUUID(), // <-- replaced uuidv4 with crypto.randomUUID()
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'STUDENT', // Default role
      createdAt: new Date(),
      updatedAt: new Date()
    };

    inMemoryStore.users.push(newUser);
    const token = generateToken(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  }

  async login(data: LoginDto): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const user = inMemoryStore.users.find(u => u.email === data.email);
    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new CustomError('Invalid credentials', 401);
    }

    const token = generateToken(user);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}

export const authService = new AuthService();
