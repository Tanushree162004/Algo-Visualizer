export interface IStorage {
  // Minimal storage as history is removed
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
