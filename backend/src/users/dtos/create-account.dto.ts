import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { MutationOutput } from "src/common/dtos/output.dto";

@InputType()
export class createAccountInput extends PickType(User, 
    ["email", "password", "role"]){

}

@ObjectType()
export class CreateAccountOutput extends MutationOutput{
   
}