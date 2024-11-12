import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { OrderItemOption } from "../entites/order-item.entity";
import { CoreOutput } from "src/common/dtos/output.dto";


@InputType()
class CreateOrderItemInput {
    @Field(type => Int)
    dishId: number

    @Field(type => [OrderItemOption], { nullable: true })
    options?: OrderItemOption[]

}
@InputType()
export class CreateOrderInput {
    @Field(type => Int)
    restaurantId: number

    @Field(type => [CreateOrderItemInput])
    items: CreateOrderItemInput[]
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {

}