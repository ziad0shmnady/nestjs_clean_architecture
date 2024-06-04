import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private reflector: Reflector) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
    });
  }
  // check if there is token in the request header if not return unauthorized
  // if there is token, decode the token and return the payload

  async validate(payload: any) {
    return {
      id: payload.id,
      role: payload.role,
    };
  }
}
