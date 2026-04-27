// auth/auth.service.ts

import { Inject, Injectable } from '@nestjs/common';
import type { AuthProvider } from './interfaces/auth-provider.interface';
import { UsersService } from '../user/users.service';
import { AUTH_PROVIDER } from './constants';

@Injectable()
export class AuthService {
    
  constructor(
    @Inject(AUTH_PROVIDER) private readonly authProvider: AuthProvider,
    private readonly usersService: UsersService,
  ) {}

  async register(phoneNumber: string) {
    // 1. Create auth user
    const authUserId = await this.authProvider.createAuthUserWithPhoneNumber({
      phoneNumber,
    });

    // 2. Create app user
    const user = await this.usersService.saveUser({
      dto: {
        id: authUserId,
        phoneNumber,
      },
    });

    return user;
  }
}