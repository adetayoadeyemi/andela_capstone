import { Module } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [UsersRepository,UsersService],
  exports: [UsersService],
})
export class UsersModule {}