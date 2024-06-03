import { User } from "../entities";
import { GenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
  abstract users: GenericRepository<User>;
}
