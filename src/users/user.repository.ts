import { GenericRepository } from '../shared/repositories/generic.repository';
import { User } from '../shared/interfaces/user.interface';
import { inMemoryStore } from '../shared/data/in-memory-store';

export class UserRepository extends GenericRepository<User> {
  constructor() {
    super();
    this.data = inMemoryStore.users;
  }

  findByEmail(email: string): User | undefined {
    return this.findBy(user => user.email === email);
  }
}

export const userRepository = new UserRepository();