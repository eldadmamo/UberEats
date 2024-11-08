import { Resolver,Query, Mutation, Args, Field, Context } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { createAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from 'src/users/dtos/user-profile.dto';


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
    @UseGuards(AuthGuard)
    me(
        @AuthUser() authUser: User
    ){
        return authUser;
    }

    @UseGuards(AuthGuard)
    @Query(() => UserProfileOutput)
   async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        try{
            const user = await this.userService.findById(userProfileInput.userId);
            if(!user){
                throw Error()
            }
            return {
                ok: true,
                user,  
            }
        } catch(e){
            return {
                error: "User not Found",
                ok: false
            }
        }
        
    }
}
