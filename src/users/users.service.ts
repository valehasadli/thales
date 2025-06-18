import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, predefinedUsers, predefinedRoles } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = predefinedUsers;
  private currentId = this.users.length;

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: ++this.currentId,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: number): void {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }

  findManagedUsers(managerId: number): User[] {
    const manager = this.findOne(managerId);
    
    // If user is not an admin, they can't manage anyone
    if (!manager.roles.includes('ADMIN')) {
      return [];
    }

    // Get all users that share at least one group with the manager
    return this.users.filter(user => 
      user.id !== managerId && // Exclude the manager themselves
      user.groups.some(group => manager.groups.includes(group)) // User must share at least one group
    );
  }

  hasPermission(userId: number, requiredPermission: string): boolean {
    const user = this.findOne(userId);
    return user.roles.some(roleCode => {
      const role = predefinedRoles.find(r => r.code === roleCode);
      return role?.permissions.includes(requiredPermission);
    });
  }
}
