import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum, IsString } from "class-validator";

enum UserRole {
    Client,
    Owner,
    Delivery
}

registerEnumType(UserRole, {name: 'UserRole'})

@InputType({isAbstract:true})
@ObjectType()
@Entity()
export class User extends CoreEntity{
    @Column()
    @Field(type => String)
    @IsEmail()
    email:string;

    @Column({select: false})
    @Field(type => String)
    password: string;

    @Column({
        type: "enum",
        enum: UserRole
    })
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({default: false})
    @Field(() => Boolean)
    verified: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async hashedPassword():Promise<void>{
        if(this.password){
            try{
                this.password = await bcrypt.hash(this.password, 10);
                } catch(e){
                    throw new InternalServerErrorException(e)
                } 
        }
    }

    async checkPassword(aPassword:string): Promise<boolean> {
        try{
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        }catch(e){
            console.log(e);
            throw new InternalServerErrorException()
        }
    }
}

