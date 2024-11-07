import { Module } from '@nestjs/common';
import { RestaurantsResolver } from './restaurants.resolve';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './entities/restaurants.service';

@Module({
    imports:[TypeOrmModule.forFeature([Restaurant])],
    providers:[RestaurantsResolver, RestaurantService]
})
export class RestaurantsModule {}
