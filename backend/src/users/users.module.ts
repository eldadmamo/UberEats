import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './users.resolver';
import { Verification } from './entities/verification.entity';
import { UserService } from './users.service';

@Module({
  imports:[TypeOrmModule.forFeature([User, Verification])],
  providers: [UserService, UserResolver],
  exports:[UserService]
})
export class UsersModule {}
