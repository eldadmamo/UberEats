import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";


@Resolver(() => Restaurant)
export class RestaurantsResolver {
    
    @Query(() => [Restaurant])
    restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[]{
        console.log(veganOnly)
        return []
    }
    
    @Mutation(returns => Boolean)
    createRestaurant(
        @Args() CreateRestaurantDto: CreateRestaurantDto
    ): boolean {
        console.log(CreateRestaurantDto)
        return true;
    }


    

    

}