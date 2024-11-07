import { Injectable } from "@nestjs/common";
import { Restaurant } from "./restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "../dtos/create-restaurant.dto";


@Injectable()
export class RestaurantService{
    constructor(
        @InjectRepository(Restaurant) 
        private readonly restaurants: Repository<Restaurant>
    ){}
    getAll(): Promise<Restaurant[]>{
        return this.restaurants.find();
    }
    createRestaurant(CreateRestaurantDto: CreateRestaurantDto){
        const newRestaurant = this.restaurants.create(CreateRestaurantDto)
        return this.restaurants.save(newRestaurant);
    }

    getRestaurant(CreateRestaurantDto:CreateRestaurantDto){
      
    }
}