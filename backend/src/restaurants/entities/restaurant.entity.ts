import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Category } from "./category.entity";
import { Order } from "src/orders/entites/order.entity";
import { Dish } from "./dish.entity";


@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {

    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string

    @Field(type => String)
    @Column()
    @IsString()
    coverImg: string

    @Field(type => String)
    @Column()
    @IsString()
    address: string
    
    @Field(type => Category, { nullable: true })
    @ManyToOne(type => Category, category => category.restaurants, { nullable: true, onDelete: 'SET NULL', eager: true })
    category: Category

    @Column()
    categoryId: number
    
    @Field(type => User)
    @ManyToOne(type => User, user => user.restaurants, { onDelete: 'CASCADE' })
    owner: User

    @Field(type => [Order])
    @OneToMany(type => Order, order => order.restaurant)
    orders: Order[]

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number

    @Field(type => [Dish], { nullable: true })
    @OneToMany(
        type => Dish,
        dish => dish.restaurant,
    )
    menu: Dish[]

    @Field(type => Boolean)
    @Column({ default: false })
    isPromoted: boolean

    @Field(type => Date, { nullable: true })
    @Column({ nullable: true })
    promotedUntil: Date
}