import { SetMetadata } from "@nestjs/common";
import { EntityUsers, Role } from "src/constants";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
