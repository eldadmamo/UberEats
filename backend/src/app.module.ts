import { Module } from '@nestjs/common';
import * as Joi from "joi";
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev": ".env.test",
      ignoreEnvFile: process.env.NODE_ENV === "prod" ,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
        .valid('dev','prod')
        .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required()
      })
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      playground: true,
    }),          
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: "postgres",
      password: "123456",
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true 
    }),
    RestaurantsModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
