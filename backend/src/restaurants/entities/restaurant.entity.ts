import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType({ isAbstract:true })
@ObjectType()
@Entity()
export class Restaurant {
     @PrimaryGeneratedColumn()
     @Field(() => Number)
     id: number

     @Field(() => String)
     @Column()
     @IsString()
     @Length(5)
     name: string;  

     @Field(() => Boolean, {nullable: true, defaultValue:true})
     @Column({default:true})
     @IsOptional()
     @IsBoolean()
     isVegan: Boolean 
     
     @Field(type => String,{defaultValue:"Ethiopia"})
     @Column()
     @IsString()
     address: string
}
