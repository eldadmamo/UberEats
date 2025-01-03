import { Injectable } from "@nestjs/common";
import { Restaurant } from "./entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Raw, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Category } from "./entities/category.entity";

import { CategoryRepository } from "./repositories/cateogry.repository";

import { Dish } from "./entities/dish.entity";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput } from "./dtos/category.dto";
import { MyRestaurantsOutput } from "./dtos/my-restaurants.dto";
import { MyRestaurantInput, MyRestaurantOutput } from "./dtos/my-restaurant.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { GetDishInput, GetDishOutput } from "./dtos/get-dish.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { CreatesRestaurantInput, CreatesRestaurantOutput } from "./dtos/create-restaurant.dto";


@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
        private readonly categories: CategoryRepository
    ) { }


    async createRestaurant(
        owner: User,
        createRestaurantInput: CreatesRestaurantInput)
        : Promise<CreatesRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput)
            newRestaurant.owner = owner
            const category = await this.categories.getOrCreate(createRestaurantInput.categoryName)
            newRestaurant.category = category
            await this.restaurants.save(newRestaurant)
            return {
                ok: true,
                restaurantId: newRestaurant.id
            }
        } catch (e) {
            return {
                ok: false,
                error: 'Could not create restaurant.'
            }
        }
    }

    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput)
        : Promise<EditRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({ where: { id: editRestaurantInput.restaurantId } })
            
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found.'
                }
            }
            
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: 'Must be an owner to edit restaurant.'
                }
            }
            let category: Category = null
            if (editRestaurantInput.categoryName) {
                category = await this.categories.getOrCreate(editRestaurantInput.categoryName)
            }
            await this.restaurants.save([{
                id: editRestaurantInput.restaurantId,
                ...editRestaurantInput,
                
                ...(category && { category })
            }])
            return { ok: true }
        } catch (e) {
            
            return {
                ok: false,
                error: 'Failed to edit restaurant.'
            }
        }
    }

    async deleteRestaurant(owner: User, { restaurantId }: DeleteRestaurantInput): Promise<DeleteRestaurantOutput> {
        const restaurant = await this.restaurants.findOne({ where: { id: restaurantId } })
        try {
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found.'
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: 'Must be an owner to delete restaurant.'
                }
            }
            await this.restaurants.delete(restaurantId)
            return {
                ok: true,
            }
        } catch {
            return {
                ok: false,
                error: 'Failed to delete restaurant'
            }
        }
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find()
            return {
                ok: true,
                categories
            }
        } catch {
            return {
                ok: false,
                error: "Failed to load categories."
            }
        }
    }

    countRestaurants(category: Category) {
        return this.restaurants.count({ where: { categoryId: category.id } })
    }

    async findCategoryBySlug({ slug, page }: CategoryInput) {
        try {
            const category = await this.categories.findOne({ where: { slug: slug } })
            if (!category) {
                return {
                    ok: false,
                    error: 'Category not found'
                }
            }
            
            const restaurants = await this.restaurants.find({
                where: { category: { id: category.id } }, take: 6, skip: (page - 1) * 6, order: {
                    isPromoted: 'DESC'
                }
            })
            const totalResults = await this.countRestaurants(category)
            return {
                ok: true,
                restaurants,
                category,
                totalPages: Math.ceil(totalResults / 6)
            }
        } catch {
            return {
                ok: false,
                error: 'Failed to load category.'
            }
        }
    }
    async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
        try {
            const myRestaurants = await this.restaurants.find({ where: { owner: { id: owner.id } }, relations: ['orders'] })
            return {
                ok: true,
                myRestaurants
            }
        } catch {
            return {
                ok: false,
                error: 'Failed to find my restaurants.'
            }
        }
    }

    async myRestaurant(owner: User, { id }: MyRestaurantInput): Promise<MyRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({ where: { owner: { id: owner.id }, id: id } , relations: ['menu', 'orders']})
            if(!restaurant){
                return {
                    ok:false,
                    error: 'Restaurant not found.'
                }
            }
            return {
                ok:true,
                restaurant
            }

        } catch {
            return {
                ok: false,
                error: 'Failed to find my restaurant.'
            }
        }
    }

    async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                skip: (page - 1) * 6, take: 6, order: {
                    isPromoted: "DESC"
                }
            })
            return {
                ok: true,
                results: restaurants,
                totalPages: Math.ceil(totalResults / 6),
                totalResults
            }
        } catch {
            return {
                ok: false,
                error: 'Failed to load restaurants.'
            }
        }
    }

    async findRestaurantById({ restaurantId }: RestaurantInput): Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({ where: { id: restaurantId }, relations: ['menu'] })
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Failed to find restaurant.'
                }
            }
            return {
                ok: true,
                restaurant
            }
        } catch {
            return {
                ok: false,
                error: 'Search failed due to an unknown error.'
            }
        }
    }

    async searchRestaurantByName({ query, page }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: { name: Raw(name => `${name} ILIKE '%${query}%'`) },
                skip: (page - 1) * 25,
                take: 25
            })
            return {
                ok: true,
                restaurants,
                totalPages: Math.ceil(totalResults / 25),
                totalResults
            }
        } catch {
            return {
                ok: false,
                error: 'Search failed due to an unknown error.'
            }
        }
    }

    
    async createDish(owner: User, createDishInput: CreateDishInput): Promise<CreateDishOutput> {
        try {
            const restaurant = await this.restaurants.findOne({ where: { id: createDishInput.restaurantId } })
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Failed to find restaurant.'
                }
            }
            if (owner.id != restaurant.ownerId) {
                return {
                    ok: false,
                    error: 'Must be an owner to add items to restaurant.'
                }
            }
            await this.dishes.save(this.dishes.create({ ...createDishInput, restaurant }))
            return {
                ok: true
            }
        }
        catch {
            return {
                ok: false,
                error: 'Failed to create dish.'
            }
        }
    }

    async editDish(owner: User, editDishInput: EditDishInput): Promise<EditDishOutput> {
        try {
            const dish = await this.dishes.findOne({ where: { id: editDishInput.dishId }, relations: ['restaurant'] })
            if (!dish) {
                return {
                    ok: false,
                    error: 'Failed to find dish.'
                }
            }
            if (dish.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: 'Only owners of the restaurant can edit dishes.'
                }
            }
            await this.dishes.save([{
                id: editDishInput.dishId,
                ...editDishInput
            }])
            return {
                ok: true
            }
        } catch {
            return {
                ok: false,
                error: 'Failed to find dish due to unknown error.'
            }
        }
    }

    async deleteDish(owner: User, deleteDishInput: DeleteDishInput): Promise<DeleteDishOutput> {
        try {
            const dish = await this.dishes.findOne({ where: { id: deleteDishInput.dishId }, relations: ['restaurant'] })
            if (!dish) {
                return {
                    ok: false,
                    error: 'Failed to find dish.'
                }
            }
            if (dish.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: 'Only owners of the restaurant can delete dishes.'
                }
            }
            await this.dishes.delete({ id: deleteDishInput.dishId })
            return {
                ok: true
            }
        }
        catch (error) {
            console.log(error)
            return {
                ok: false,
                error: 'Failed to find dish due to unknown error.'
            }
        }
    }

    async getDish(getDishInput: GetDishInput): Promise<GetDishOutput> {
        try {
            const dish = await this.dishes.findOne({ where: { id: getDishInput.id } })
            return {
                ok: true,
                dish
            }
        } catch {
            return {
                ok: false,
                error: 'Failed to find dish due to unknown error.'
            }
        }
    }
}