import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput} from "src/common/dtos/output.dto";
import { User } from "../entities/user.entity";


@ArgsType()
export class UserProfileInput {
    @Field(() => Number)
    userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput{
    @Field(() => Boolean)
    ok: boolean;

    @Field(() => String, { nullable: true })
    error?: string;

    @Field(() => User, {nullable: true})
    user?: User;
}