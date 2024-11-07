import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class Restaurant {
     @Field(() => String)
     name: string;  
     
     @Field(() => Boolean,{nullable:true})
     isVegan: Boolean 
     
     @Field(type => String)
     address: string

     @Field(type => String)
     ownerName: string;
}
