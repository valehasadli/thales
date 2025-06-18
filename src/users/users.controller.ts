import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permission } from './decorators/permission.decorator';
import { PermissionGuard } from './guards/permission.guard';

@Controller('users')
@UseGuards(PermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permission('CREATE')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permission('VIEW')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @Permission('EDIT')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permission('DELETE')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Get('managed/:id')
  @Permission('VIEW')
  findManagedUsers(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findManagedUsers(id);
  }
}
