import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as jwt from "jsonwebtoken";
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { locatedError } from 'graphql';
import { VerifyEmailOutput } from './dtos/verify-email.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users:Repository<User>,
        @InjectRepository(Verification) 
        private readonly verifications:Repository<Verification>,
        private readonly jwtServices: JwtService
    ){
        
    }

   async createAccount({email, password, role}: createAccountInput): Promise<{ok:boolean , error?: string}>{
    try{
        const exists = await this.users.findOne({
            where:{
                email
            }
        })
        if(exists){
           return {ok: false, error: "There is a user with that email already"};
        }
        const user = await this.users.save(this.users.create({email,password,role}));
        await this.verifications.save(
            this.verifications.create({
            user
        }))
        return {ok:true};
    }
    catch(error) { 
        return {ok:false,error: "Couldn't create account"};
    }
}
 
    async login({email,password}:LoginInput):Promise<{ok:boolean; error?:string; token?: string}> {
        try{
            const user = await this.users.findOne({
                where:{email},
                select:["id","password"]
    })
            if(!user){
                return {
                    ok:false,
                    error: 'User not found'
                }
            }
            const passwordCorrect = await user.checkPassword(password);
            if(!passwordCorrect){
                return {
                    ok:false,
                    error: "Wrong Password"
                }
            }
            console.log(user);
            const token = this.jwtServices.sign(user.id);
            return {
                ok:true,
                token
            }
        }   catch(error){
            return {
                ok:false,
                error,
            }
        }
    }

    async findById(id:number):Promise<User>{
        return this.users.findOne({
            where:{
                id
            }
        })
    }

    async editProfile(
        userId: number, 
        {email, password}: EditProfileInput
    ): Promise<User> {
        const user = await this.users.findOne({
            where:{
                id: userId
            }
        });
        if(email){
            user.email = email;
            user.verified = false;
            await this.verifications.save(
                this.verifications.create({user})
            )
        }
        if(password){
            user.password = password;
        }
        return this.users.save(user);
    }

    async verifyEmail(code:string): Promise<VerifyEmailOutput>{
        try{
            const verification = await this.verifications.findOne({
                where: { code },
                relations: ['user'],
            });
            if(verification){
                verification.user.verified = true;
                await this.users.save(verification.user);
                await this.verifications.delete(verification.id);
                return {ok:true};
            }
            return {ok:false, error: 'Verification not found'}
        }
        catch(error){
            return {ok: false, error};
        }
    }

}
