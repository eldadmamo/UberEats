import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { RestaurantService } from "./entities/restaurants.service";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";


@Resolver(() => Restaurant)
export class RestaurantsResolver {
    
    constructor(private readonly restaurantService: RestaurantService){}

    @Query(() => [Restaurant])
    restaurants(): Promise<Restaurant[]>{
        return this.restaurantService.getAll()
    }
    
    @Mutation(returns => Boolean)
    async createRestaurant(
        @Args("input") CreateRestaurantDto: CreateRestaurantDto
    ): Promise<boolean> {
        console.log(CreateRestaurantDto)
        try{
        await this.restaurantService.createRestaurant(CreateRestaurantDto);
        return true;
        }catch(e){
            console.log(e)
            return false;
        }
    }

    @Mutation(() => Boolean)
    async updateRestaurant(
        @Args('input') updateRestaurantDto:UpdateRestaurantDto
    ): Promise<Boolean>{
        try{
            await this.restaurantService.updateRestaurant(updateRestaurantDto);
            return true;
        }catch(e){
            console.log(e)
            return false;
        }
    }

}