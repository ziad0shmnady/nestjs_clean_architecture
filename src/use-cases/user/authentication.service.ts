import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User as CoreUser, User } from "src/core/entities";

@Injectable()
export class AuthenticationService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async generateVerificationToken(user: CoreUser): Promise<string> {
    const payload = { email: user.email, passwordHash: user.password_hash };
    return await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
  }

  async decodeVerificationToken(
    token: string
  ): Promise<{ email: string; passwordHash: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
        email: string;
        passwordHash: string;
      };
      return decoded;
    } catch (error) {
      throw new HttpException(
        "Invalid or Expired token",
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async validateUser(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isPasswordMatching = await bcrypt.compare(
      plainPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      return null;
    }
    return true;
  }

  async generateLoginToken(user: User): Promise<string> {
    const payload = {
      id: user.user_id,
      role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
  }

  async generateResetToken(email: string) {
    return await jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });
  }

  async validateResetToken(token: string): Promise<string> {
    const decoded = (await jwt.verify(token, process.env.JWT_SECRET_KEY)) as {
      email: string;
    };
    return decoded.email;
  }
  async generateInvitationToken(
    email: string,
    entityId: string
  ): Promise<string> {
    const payload = { email, entityId };
    const secretKey = process.env.JWT_SECRET_KEY;
    const options = { expiresIn: "7d" };

    try {
      const token = jwt.sign(payload, secretKey, options);
      return token;
    } catch (error) {
      throw new Error("Failed to generate token");
    }
  }
}
