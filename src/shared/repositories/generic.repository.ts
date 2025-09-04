export abstract class GenericRepository<T extends { id: string }> {
  protected data: T[] = [];

  findAll(): T[] {
    return this.data;
  }

  findById(id: string): T | undefined {
    return this.data.find(item => item.id === id);
  }

  create(item: T): T {
    this.data.push(item);
    return item;
  }

 update(id: string, updates: Partial<T>): T | null {
  const index = this.data.findIndex(item => item.id === id);
  if (index === -1) return null;

  this.data[index] = { ...this.data[index], ...updates } as T ;
  return this.data[index];
}


  delete(id: string): boolean {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.data.splice(index, 1);
    return true;
  }

  findBy(predicate: (item: T) => boolean): T | undefined {
    return this.data.find(predicate);
  }

  findAllBy(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate);
  }
}