import { User } from '../shared/interfaces/user.interface';
import { UpdateProfileDto, CreateCoachDto } from './user.dto';
import { userRepository } from './user.repository';
import { hashPassword } from '../shared/utils/password.util';
import { CustomError } from '../shared/utils/custom-error';
import { randomUUID } from 'crypto';

export class UserService {
  getUserProfile(userId: string): Omit<User, 'password'> {
    const user = userRepository.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  updateProfile(userId: string, data: UpdateProfileDto): Omit<User, 'password'> {
    const user = userRepository.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Check email uniqueness if email is being updated
    if (data.email !== undefined && data.email !== user.email) {
      const existingUser = userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new CustomError('Email already in use', 400);
      }
    }

    // Build updates object safely
    const updates: Partial<User> = { updatedAt: new Date() };
    if (data.name !== undefined) updates.name = data.name;
    if (data.email !== undefined) updates.email = data.email;

    const updatedUser = userRepository.update(userId, updates);
    if (!updatedUser) {
      throw new CustomError('Failed to update user', 500);
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async createCoach(data: CreateCoachDto): Promise<Omit<User, 'password'>> {
    // Check if user exists
    const existingUser = userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new CustomError('User already exists', 400);
    }

    // Create new coach
    const hashedPassword = await hashPassword(data.password);
    const newCoach: User = {
      id: randomUUID(), // Unique ID
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'COACH',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const createdCoach = userRepository.create(newCoach);
    const { password, ...coachWithoutPassword } = createdCoach;
    return coachWithoutPassword;
  }
}

export const userService = new UserService();

