import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Injectable } from "@nestjs/common";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { JwtService } from "src/jwt/jwt.service";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { VerifyEmailOutput } from "./dtos/verify-email.dto";
import { MailService } from "src/mail/mail.service";
import { Verification } from "./entities/verification.entity";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification)
        private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) { }


    async createAccount({ email, password, role }: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const exists = await this.users.findOne({ where: { email } })
            if (exists) {
                return { ok: false, error: "There is a user with that email already" }
            }
            const user = await this.users.save(this.users.create({ email, password, role }))
            const verification = await this.verifications.save(this.verifications.create({
                user
            }))
            this.mailService.sendVerificationEmail(user.email, verification.code)
            return { ok: true }
        } catch (error) {
            return { ok: false, error: "Failed to create account." }
        }
    }


    async login({ email, password }: LoginInput): Promise<LoginOutput> {
        try {
            const user = await this.users.findOne({ where: { email }, select: ['id', 'password'] })
            if (!user) {
                return {
                    ok: false,
                    error: "User not found."
                }
            }
            const passwordIsCorrect = await user.checkPassword(password)
            if (!passwordIsCorrect) {
                return {
                    ok: false,
                    error: "Wrong password"
                }
            }
            const token = this.jwtService.sign(user.id)
            return {
                ok: true,
                token: token
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }


    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOneOrFail({ where: { id } })
            return {
                ok: true,
                user: user,
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }


    async editProfile(userId: number, { email, password }: EditProfileInput): Promise<EditProfileOutput> {
        try {
            const user = await this.users.findOne({ where: { id: userId } })
            if (email) {
                const exist = await this.users.exists({ where: { email, id: Not(userId) } })
                if(exist){
                    return{
                        ok:false,
                        error: "Email is already in use."
                    }
                }else{
                    user.email = email
                    user.verified = false
                    await this.verifications.delete({ user: { id: user.id } })
                    const verification = await this.verifications.save(this.verifications.create({ user }))
                    this.mailService.sendVerificationEmail(user.email, verification.code)
                }
            }
            if (password) {
                user.password = password
            }
            await this.users.save(user)
            return {
                ok: true,
            }
        } catch (error) {
          console.log("failed to update user", error)
            return {
                ok: false,
                error: "Failed to update user profile."
            }
        }

    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {
            const verification = await this.verifications.findOne({ where: { code }, relations: ['user'] })
            if (verification) {
                verification.user.verified = true
                await this.users.save(verification.user)
                await this.verifications.delete(verification.id)
                return { ok: true }
            }
            return { ok: false, error: "Verification not found" }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not verify email.'
            }
        }
    }
}