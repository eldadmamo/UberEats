import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entites/order.entity';
import { OrderItem } from './entites/order-item.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';


@Module({
    imports:[TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
    providers:[
        OrderService,
        OrderResolver
    ]
})
export class OrdersModule {}