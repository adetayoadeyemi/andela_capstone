// users/users.service.ts

import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create-user-dto";

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

    async saveUser(data: { dto: CreateUserDto }) {
        return this.repo.create(data.dto);
    }

    async findById(id: string) {
        return this.repo.findById(id);
    }

    async findByPhoneNumber(phoneNumber: string) {
        return this.repo.findByPhoneNumber(phoneNumber);
    }

}