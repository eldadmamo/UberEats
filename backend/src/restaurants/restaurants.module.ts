import { Module } from '@nestjs/common';
import { RestaurantsResolver } from './restaurants.resolve';

@Module({
    providers:[RestaurantsResolver]
})
export class RestaurantsModule {}
