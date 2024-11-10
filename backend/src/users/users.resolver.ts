import { Resolver,Query, Mutation, Args, Field, Context } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from 'src/users/dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';



@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService){}

    @Query(() => Boolean)
    hi(){
        return true;
    }

    @Mutation(()  => CreateAccountOutput)
    async createAccount(@Args("input") createAccountInput: CreateAccountInput)
    :Promise <CreateAccountOutput>{
        try{
            return this.usersService.createAccount(createAccountInput);
        }
        catch(error){
            console.error('Error in createAccount:', error);
            return {
                error:error,
                ok:false,
            }
        }
    }

    @Mutation(() => LoginOutput)
    async login(@Args('input') loginInput: LoginInput):Promise<LoginOutput> {
        try{
            return this.usersService.login(loginInput);
            
        }
        catch(error){
            console.error('Error in login:', error);
            return {
                ok:false,
                error
            }
        }
    }

    @Query(() => User)
@UseGuards(AuthGuard)
async me(@AuthUser() authUser: User) {
  if (!authUser) {
    throw new Error('User not authenticated');
  }
  return authUser;
}

    @UseGuards(AuthGuard)
@Query(() => UserProfileOutput)
async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
    try {
        const user = await this.usersService.findById(userProfileInput.userId);
        console.log("UserProfile data:", user);
        if (!user) {
            return { ok: false, error: "User not found" };
        }
    } catch (error) {
        console.error('Error in userProfile:', error);
        return { ok: false, error: "An error occurred while fetching the user profile" };
    }
}



    @UseGuards(AuthGuard)
@Mutation(() => EditProfileOutput)
async editProfile(
    @AuthUser() authUser: User, 
    @Args('input') editProfileInput: EditProfileInput
): Promise<EditProfileOutput> {
    try {
        console.log(editProfileInput);
        await this.usersService.editProfile(authUser.id, editProfileInput);
        return { ok: true };
    } catch (error) {
        console.error('Error in editProfile:', error);
        return { ok: false, error: "Failed to edit profile" };
    }
}


    @Mutation(() => VerifyEmailOutput)
    async verifyEmail(@Args('input') {code}: VerifyEmailInput):Promise<VerifyEmailOutput>{
    
          return await this.usersService.verifyEmail(code);
           
    }
}
