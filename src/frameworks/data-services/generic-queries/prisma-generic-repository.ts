// Generic CRUD operations for any model
import { PrismaService } from '../prisma/prisma.service'; // Adjust the import path as needed
import { GenericRepository } from 'src/core/abstracts';
import { Prisma, User } from '@prisma/client';

export class PrismaGenericRepository<T> implements GenericRepository<T> {
  private prismaService: PrismaService;
  private model: Prisma.ModelName;
  private primaryKeyField: string;

  constructor(prismaService: PrismaService, model: Prisma.ModelName) {
    this.prismaService = prismaService;
    this.model = model;
    this.primaryKeyField = this.getPrimaryKeyFieldName(model);
  }

  private getPrimaryKeyFieldName(model: Prisma.ModelName): string {
    return `${model.charAt(0).toLowerCase() + model.slice(1)}_id`;
  }

  async getAll(): Promise<T[]> {
    return this.prismaService[this.model].findMany();
  }

  async getAllRelated(
    relatedFieldName: string,
    relatedFieldId: string,
  ): Promise<T[]> {
    return this.prismaService[this.model].findMany({
      where: { [relatedFieldName]: relatedFieldId },
    });
  }

  async getById(id: string): Promise<T | null> {
    return this.prismaService[this.model].findUnique({
      where: { [this.primaryKeyField]: id }, // Use the primary key field dynamically
    });
  }

  async create(item: T): Promise<T> {
    return this.prismaService[this.model].create({
      data: item,
    });
  }
  async getCertianCol(id: string, colName: string): Promise<T> {
    return this.prismaService[this.model].findUnique({
      where: { [this.primaryKeyField]: id },
      select: { [colName]: true },
    });
  }

  async update(id: string, item: T | Partial<T>): Promise<T | null> {
    return await this.prismaService[this.model].update({
      where: { [this.primaryKeyField]: id },
      data: item,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prismaService[this.model].delete({
      where: { [this.primaryKeyField]: id },
    });
    return true;
  }

  async findManyWithSelect(
    fields: { [key: string]: boolean },
    id: string,
  ): Promise<Partial<T>[]> {
    return await this.prismaService[this.model].findMany({
      where: { [this.primaryKeyField]: id },
      select: fields,
    });
  }
}
