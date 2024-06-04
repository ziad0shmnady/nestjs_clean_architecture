import { $Enums } from "@prisma/client";

export class User {
  user_id: string;
  email: string;
  password_hash: string;
  role: $Enums.EntityUsers;
}
