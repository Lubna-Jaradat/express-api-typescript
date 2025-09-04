import { GenericRepository } from '../shared/repositories/generic.repository';
import { Course } from '../shared/interfaces/course.interface';
import { inMemoryStore } from '../shared/data/in-memory-store';

export class CourseRepository extends GenericRepository<Course> {
  constructor() {
    super();
    this.data = inMemoryStore.courses;
  }

  findByCreator(creatorId: string): Course[] {
    return this.findAllBy(course => course.createdBy === creatorId);
  }
}

export const courseRepository = new CourseRepository();