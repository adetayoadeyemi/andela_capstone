import { Global, Module } from '@nestjs/common'
import postgres from 'postgres'

export const DATABASE = 'DATABASE_CONNECTION'

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: () => {
        return postgres(process.env.DATABASE_URL!, {
          ssl: 'require',
          max: 10, // Nest is long-lived, not serverless
        })
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}