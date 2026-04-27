// auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseAuthProvider } from './providers/supabase-auth-provider';
import { UsersModule } from '../user/users.module';
import { AUTH_PROVIDER } from './constants';

@Module({
    imports: [UsersModule],
    providers: [
        AuthService,
        {
            provide: AUTH_PROVIDER,
            useClass: SupabaseAuthProvider,
        },
    ],
    exports: [AuthService],
})
export class AuthModule {}