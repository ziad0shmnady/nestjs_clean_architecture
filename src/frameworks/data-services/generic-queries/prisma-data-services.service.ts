import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { IDataServices, GenericRepository } from "../../../core/abstracts";
import { User } from "src/core/entities";
import { PrismaGenericRepository } from "./prisma-generic-repository";

@Injectable()
export class PrismaDataService
  implements IDataServices, OnApplicationBootstrap
{
  constructor(private prismaService: PrismaService) {}
  users: GenericRepository<User>;

  onApplicationBootstrap() {
    this.users = new PrismaGenericRepository<User>(this.prismaService, "User");
  }
}
