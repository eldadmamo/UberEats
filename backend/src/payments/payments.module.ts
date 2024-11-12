import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payments.service';
import { PaymentResolver } from './payments.resolver';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Payment } from './entites/payment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Payment,Restaurant])],
    providers: [PaymentService, PaymentResolver]
})
export class PaymentsModule { }