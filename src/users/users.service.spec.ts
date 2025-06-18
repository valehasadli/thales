import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', () => {
      const createUserDto = {
        name: 'Test User',
        roles: ['PERSONAL'],
        groups: ['GROUP_1']
      };
      const user = service.create(createUserDto);
      expect(user.name).toBe(createUserDto.name);
      expect(user.roles).toEqual(createUserDto.roles);
      expect(user.groups).toEqual(createUserDto.groups);
      expect(user.id).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a user if it exists', () => {
      const user = service.findOne(1);
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
    });

    it('should throw NotFoundException if user does not exist', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('hasPermission', () => {
    it('should return true for admin with valid permission', () => {
      const hasPermission = service.hasPermission(1, 'CREATE');
      expect(hasPermission).toBe(true);
    });

    it('should return false for viewer trying to create', () => {
      const hasPermission = service.hasPermission(6, 'CREATE');
      expect(hasPermission).toBe(false);
    });
  });

  describe('findManagedUsers', () => {
    it('should return managed users for admin', () => {
      const managedUsers = service.findManagedUsers(1);
      expect(managedUsers.length).toBeGreaterThan(0);
      expect(managedUsers.every(user => user.id !== 1)).toBe(true);
    });

    it('should return empty array for non-admin user', () => {
      const managedUsers = service.findManagedUsers(2);
      expect(managedUsers).toEqual([]);
    });
  });
});
