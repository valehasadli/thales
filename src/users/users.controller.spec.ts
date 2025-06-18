import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    name: 'Test User',
    roles: ['PERSONAL'],
    groups: ['GROUP_1']
  };

  const mockUsersService = {
    create: jest.fn().mockReturnValue(mockUser),
    findAll: jest.fn().mockReturnValue([mockUser]),
    findOne: jest.fn().mockReturnValue(mockUser),
    update: jest.fn().mockReturnValue(mockUser),
    remove: jest.fn(),
    findManagedUsers: jest.fn().mockReturnValue([mockUser])
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        roles: ['PERSONAL'],
        groups: ['GROUP_1']
      };
      expect(controller.create(createUserDto)).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      expect(controller.findAll()).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User'
      };
      expect(controller.update(1, updateUserDto)).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', () => {
      controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findManagedUsers', () => {
    it('should return managed users', () => {
      expect(controller.findManagedUsers(1)).toEqual([mockUser]);
      expect(service.findManagedUsers).toHaveBeenCalledWith(1);
    });
  });
});
