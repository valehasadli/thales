import { IsString, IsArray, MaxLength, ArrayMinSize, IsNotEmpty, IsIn } from 'class-validator';
import { predefinedGroups, predefinedRoles } from '../interfaces/user.interface';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  @IsIn(predefinedRoles.map(role => role.code), { each: true })
  roles: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  @IsIn(predefinedGroups, { each: true })
  groups: string[];
}