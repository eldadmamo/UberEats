import { Args, Int, Mutation, Parent, Query, ResolveField } from "@nestjs/graphql";
import { Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";
import { AuthUser } from "src/auth/auth-user.decorator";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/auth/role.decorator";
import { Category } from "./entities/category.entity";
import { Dish } from "./entities/dish.entity";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";
import { MyRestaurantsOutput } from "./dtos/my-restaurants.dto";
import { MyRestaurantInput, MyRestaurantOutput } from "./dtos/my-restaurant.dto";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { GetDishInput, GetDishOutput } from "./dtos/get-dish.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { CreatesRestaurantInput, CreatesRestaurantOutput } from "./dtos/create-restaurant.dto";


@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    
    @Mutation(returns => CreatesRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args('input') createRestaurantInput: CreatesRestaurantInput): Promise<CreatesRestaurantOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput)
    }

    
    @Mutation(returns => EditRestaurantOutput)
    @Role(['Owner'])
    editRestaurant(
        @AuthUser() owner: User,
        @Args('input') editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(owner, editRestaurantInput)
    }

   
    @Mutation(returns => DeleteRestaurantOutput)
    @Role(['Owner'])
    deleteRestaurant(
        @AuthUser() owner: User,
        @Args('input') deleteRestaurantInput: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput)
    }

    @Query(returns => RestaurantsOutput)
    restaurants(@Args('input') restaurantsInput: RestaurantsInput): Promise<RestaurantsOutput> {
        return this.restaurantService.allRestaurants(restaurantsInput)
    }

    @Query(returns => RestaurantOutput)
    restaurant(@Args('input') restaurantInput: RestaurantInput): Promise<RestaurantOutput> {
        return this.restaurantService.findRestaurantById(restaurantInput)
    }

    @Query(returns => SearchRestaurantOutput)
    searchRestaurant(@Args('input') searchRestaurantInput: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        return this.restaurantService.searchRestaurantByName(searchRestaurantInput)
    }

    @Query(returns => MyRestaurantsOutput)
    @Role(['Owner'])
    myRestaurants(@AuthUser() owner:User): Promise<MyRestaurantsOutput> {
        return this.restaurantService.myRestaurants(owner)
    }

    @Query(returns => MyRestaurantOutput)
    @Role(['Owner'])
    myRestaurant(@AuthUser() owner:User, @Args('input') myRestaurantInput: MyRestaurantInput): Promise<MyRestaurantOutput>{
        return this.restaurantService.myRestaurant(owner,myRestaurantInput)
    }
}


@Resolver(of => Category)
export class CategoryResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    
    @ResolveField(type => Int)
    restaurantCount(@Parent() category: Category): Promise<number> {
        return this.restaurantService.countRestaurants(category)
    }

    @Query(type => AllCategoriesOutput)
    allCategories(): Promise<AllCategoriesOutput> {
        return this.restaurantService.allCategories()
    }

    @Query(type => CategoryOutput)
    category(@Args('input') categoryInput: CategoryInput): Promise<CategoryOutput> {
        return this.restaurantService.findCategoryBySlug(categoryInput)
    }
}


@Resolver(of => Dish)
export class DishResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Mutation(type=> CreateDishOutput)
    @Role(['Owner'])
    createDish(@AuthUser() owner: User, @Args('input') createDishInput: CreateDishInput):Promise<CreateDishOutput>{
        return this.restaurantService.createDish(owner, createDishInput)
    }

    @Mutation(type=> EditDishOutput)
    @Role(['Owner'])
    editDish(@AuthUser() owner: User, @Args('input') editDishInput: EditDishInput):Promise<EditDishOutput>{
        return this.restaurantService.editDish(owner, editDishInput)
    }

    @Mutation(type=>DeleteDishOutput)
    @Role(['Owner'])
    deleteDish(@AuthUser() owner:User, @Args('input') deleteDishInput: DeleteDishInput):Promise<DeleteDishOutput>{
        return this.restaurantService.deleteDish(owner, deleteDishInput)
    }

    @Query(type=>GetDishOutput)
    getDish(@Args('input') getDishInput: GetDishInput):Promise<GetDishOutput>{
        return this.restaurantService.getDish(getDishInput)
    }
}