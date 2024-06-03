export abstract class GenericRepository<T> {
  abstract getAll(): Promise<T[]>;

  abstract getById(id: string): Promise<T | null>;

  abstract getCertianCol(id: string, colName: string): Promise<T | null>;

  abstract create(item: T): Promise<T>;

  abstract update(id: string, item: T | Partial<T>): Promise<T | null>;

  abstract delete(id: string): Promise<boolean>;

  abstract findManyWithSelect(
    fields: { [key: string]: boolean },
    id: string
  ): Promise<Partial<T>[]>;

  abstract getAllRelated(
    relatedFieldName: string,
    relatedFieldId: string
  ): Promise<T[]>;
}
