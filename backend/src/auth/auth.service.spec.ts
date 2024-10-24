import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDto } from '../user/dto/user.dto';
import { UsersService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const mockUsersService = {
  findByEmail: jest.fn(),
  validatePassword: jest.fn(),
  register: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if login is successful', async () => {
      const mockUser: UserDto = {
        _id: 'testid',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'registered',
        firstName: 'Test',
        lastName: 'User',
        articlesSubmitted: [],
        articlesModerated: [],
        articlesAnalysed: [],
        articlesRated: [],
      };

      const login: LoginDto = {
        email: 'test@example.com',
        password: 'strongPassword',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.login(login.email, login.password);
      expect(usersService.findByEmail).toHaveBeenCalledWith(login.email);
      expect(usersService.validatePassword).toHaveBeenCalledWith(
        login.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        role: mockUser.role,
        uid: mockUser._id
      });
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw an UnauthorizedException if user not found', async () => {
      const login: LoginDto = {
        email: 'test@example.com',
        password: 'strongPassword',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(service.login(login.email, login.password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if password is invalid', async () => {
      const mockUser: UserDto = {
        _id: 'testid',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'registered',
        firstName: 'Test',
        lastName: 'User',
        articlesSubmitted: [],
        articlesModerated: [],
        articlesAnalysed: [],
        articlesRated: [],
      };
      const login = {
        email: 'test@example.com',
        password: 'strongPassword',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(false);

      await expect(service.login(login.email, login.password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const mockUser: UserDto = {
        _id: 'testid',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'registered',
        firstName: 'Test',
        lastName: 'User',
        articlesSubmitted: [],
        articlesModerated: [],
        articlesAnalysed: [],
        articlesRated: [],
      };

      const user: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'strongPassword',
      };

      jest.spyOn(usersService, 'register').mockResolvedValue(mockUser);

      const result = await service.register(user);
      expect(usersService.register).toHaveBeenCalledWith(user);
      expect(result).toEqual(mockUser);
    });
  });
});
