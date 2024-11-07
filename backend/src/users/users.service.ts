import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as jwt from "jsonwebtoken";
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users:Repository<User>,
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
        await this.users.save(this.users.create({email,password,role}));
        return {ok:true};
    }
    catch(error) { 
        return {ok:false,error: "Couldn't create account"};
    }
}
 
    async login({email,password}:LoginInput):Promise<{ok:boolean; error?:string; token?: string}> {
        try{
            const user = await this.users.findOne({
                where:{
                    email
        }})
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
            const token = this.jwtServices.sign(user.id)
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

}
