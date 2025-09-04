import { User } from '../interfaces/user.interface';
import { Course } from '../interfaces/course.interface';
import { hashPassword } from '../utils/password.util';
import jwt from 'jsonwebtoken';

export class InMemoryStore {
  public users: User[] = [];
  public courses: Course[] = [];

  private generateId(): string {
    // Generate a unique string using JWT
    return jwt.sign({ ts: Date.now(), random: Math.random() }, 'secret-key');
  }

  async initializeDefaultAdmin() {
    const adminExists = this.users.find(user => user.email === 'admin@no.com');
    if (!adminExists) {
      const hashedPassword = await hashPassword('admin123');
      const admin: User = {
        id: this.generateId(),
        name: 'Admin User',
        email: 'admin@no.com',
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.push(admin);
      console.log('Default admin user created');
    }
  }
}

export const inMemoryStore = new InMemoryStore();
