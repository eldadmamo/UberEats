import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CreatesRestaurantInput } from "./create-restaurant.dto";
import { CoreOutput } from "src/common/dtos/output.dto";



@InputType()
export class EditRestaurantInput extends PartialType(CreatesRestaurantInput) {
    @Field(type => Number)
    restaurantId:number
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}