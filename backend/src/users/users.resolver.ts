import { Resolver,Query, Mutation, Args, Field } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { createAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';


@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly userService: UsersService){}

    @Query(() => Boolean)
    hi(){
        return true;
    }

    @Mutation(()  => CreateAccountOutput)
    async createAccount(@Args("input") createAccountInput: createAccountInput)
    :Promise<CreateAccountOutput>{
        try{
            return this.userService.createAccount(createAccountInput);
        }
        catch(error){
            return {
                error:error,
                ok:false,
            }
        }
    }

    @Mutation(() => LoginOutput)
    async login(@Args('input') loginInput: LoginInput):Promise<LoginOutput> {
        try{
            return this.userService.login(loginInput);
            
        }
        catch(error){
            return {
                ok:false,
                error
            }
        }
    }

    @Query(() => User)
    me(){
        
    }

}
