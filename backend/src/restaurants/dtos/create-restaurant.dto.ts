import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Restaurant } from "../entities/restaurant.entity";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()
export class CreatesRestaurantInput extends PickType(Restaurant, [
    'name',
    'coverImg',
    'address'
]) {
    @Field(type => String)
    categoryName: string
}
@ObjectType()
export class CreatesRestaurantOutput extends CoreOutput { 
    @Field(type=> Int)
    restaurantId?: number
}