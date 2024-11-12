import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { Dish } from './entities/dish.entity';
import { CategoryRepository } from './repositories/cateogry.repository';
import { CategoryResolver, DishResolver, RestaurantResolver } from './restaurants.resolver';


@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, Dish])],
    providers: [RestaurantResolver, RestaurantService, CategoryRepository, DishResolver, CategoryResolver]
})
export class RestaurantsModule { }
