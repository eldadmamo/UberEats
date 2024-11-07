import { Resolver,Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { createAccountInput, CreateAccountOutput } from './dtos/create-account.dto';


@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly userService: UsersService){}

    @Query(() => Boolean)
    hi(){
        return true;
    }

    @Mutation(()  => CreateAccountOutput)
    createAccount(@Args("input") createAccountInput: createAccountInput){
        return createAccountInput;
    }

}