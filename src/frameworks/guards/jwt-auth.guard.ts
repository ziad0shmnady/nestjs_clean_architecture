import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";
import { Role } from "src/constants";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // Retrieve roles allowed for this route from the decorator
    const requiredRoles = this.reflector.getAllAndOverride("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route allows public access, allow access even without token
    try {
      if (requiredRoles.includes(Role.Public)) {
        const request = context.switchToHttp().getRequest();
        // get the token from the request header
        const token = request.headers.authorization?.split(" ")[1];
        if (token) {
          const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY,
            (err, decoded) => {
              if (err) {
                return "truee";
              }
              return decoded;
            }
          );
          request.user = decodedToken;
        } else {
          return true;
        }
        return true;
      }
    } catch (err) {
      throw new UnauthorizedException("Please assign a role to this route");
    }

    return super.canActivate(context);
  }
}
