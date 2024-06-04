import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log(requiredRoles);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // console.log(user);
    // check if is required role is public
    if (requiredRoles.includes(Role.Public)) {
      return true;
    }
    const role = requiredRoles.some((role) => user.role?.includes(role));
    if (!role) {
      // hanlde each role here and return the role should be returned
      if (requiredRoles.includes(Role.Admin)) {
        throw new UnauthorizedException("You are not an admin");
      } else if (requiredRoles.includes(Role.User)) {
        throw new UnauthorizedException("You are not an User");
      }
    }
    return role;
  }
}
