import { Inject, Injectable } from "@nestjs/common";
import User from "../domain/user";
import { CreateUserDto } from "./dto/create-user-dto";
import { DATABASE } from "../database/database.module";
import postgres from "postgres";

@Injectable()
export class UsersRepository {

  constructor(
      @Inject(DATABASE)
      private readonly sql: ReturnType<typeof postgres>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
      const [user] = await this.sql`
      INSERT INTO users (id, phone_number)
      VALUES (${data.id}, ${data.phoneNumber})
      RETURNING id, phone_number
      `;
      return User.fromPersistence(user);
  }

  async findById(id: string): Promise<User|null> {
    const [user] = await this.sql`
      SELECT id, phone_number
      FROM users
      WHERE id = ${id}
    `;
    return user ? User.fromPersistence(user) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User|null> {
    const [user] = await this.sql`
      SELECT id, phone_number
      FROM users
      WHERE phone_number = ${phoneNumber}
    `;
    return user ? User.fromPersistence(user) : null;
  }


}   