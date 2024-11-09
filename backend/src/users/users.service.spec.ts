import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { verify } from 'crypto';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { error } from 'console';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn()
})

const mockJwtService = {
  sign: jest.fn(() => "signed-token-baby"),
  verify: jest.fn()
}

const mockMailService = {
  sendVerificationEmail: jest.fn()
}

type MockRepository<T = any> = Partial<Record<keyof Repository<User>, jest.Mock>>

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let verificationsRepository: MockRepository<Verification>
  let mailService: MailService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
        provide: getRepositoryToken(User),
        useValue: mockRepository()
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository()
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: MailService,
          useValue: mockMailService
        }
    ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService)
    jwtService = module.get<JwtService>(JwtService)
    usersRepository = module.get(getRepositoryToken(User));
    verificationsRepository = module.get(getRepositoryToken(Verification))
  }); 


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('createAccount', () => {
    const createAccountArgs = {
      email: "eldad@gmail.com",
      password: '123456',
      role: 0,
    }
    it("should fail if user exists",async () => {
      usersRepository.findOne.mockResolvedValue({
        id:1,
        email:"eldadf456@gmail.com"
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject(
        {
          ok: false, 
          error: "There is a user with that email already"})
    })
    it('should create a new user',async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs)
      usersRepository.save.mockResolvedValue(createAccountArgs);
      verificationsRepository.create.mockReturnValue({
        user: createAccountArgs
      });
      verificationsRepository.save.mockResolvedValue({
        code: 'code',
      });
      
      const result = await service.createAccount(createAccountArgs);
      
     expect(usersRepository.create).toHaveBeenCalledTimes(1);
     expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      
     expect(usersRepository.save).toHaveBeenCalledTimes(1)
     expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
      
     expect(verificationsRepository.create).toHaveBeenCalledTimes(1)
     expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs
        });
      
     expect(usersRepository.save).toHaveBeenCalledTimes(1)
     expect(usersRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs
      });
      
     expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1)
     expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
       );
     
       expect(result).toEqual({ok:true})
    })
    it('should fail on exeption', async () => {
      usersRepository.findOne.mockRejectedValue(new Error())
       const result = await service.createAccount(createAccountArgs);
       expect(result).toEqual({ok:false, error: "Could not create account"});
    })
  })

  describe('login', () => {
    const loginArgs = {
      email:'bs@gmail.com',
      password: '123456'
    }
    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object), 
        expect.any(Object) 
      )
      expect(result).toEqual({
        ok:false,
        error: 'User not Found'
      });

    })

    it('Should fail if the password is wrong', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ok:false, error: 'Wrong Password'}); 
    })

    it("should return token if password corrext", async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      }
      usersRepository.findOne.mockResolvedValue(mockedUser)
      const result = await service.login(loginArgs);
      console.log(result)
      expect(jwtService.sign).toHaveBeenCalledTimes(1)
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number))
      expect(result).toEqual({ok:true, token: 'signed-token-baby'})
    })
  })
  
  describe('findById', () => {
    const findByIdArgs = {
      id:1,
    }
    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue({id:1})
      const result  = await service.findById(1);
      expect(result).toEqual({ok:true, user: {id: 1}})
    })
  })
  it.todo('editProfile')
  it.todo('verifyEmail')
});
