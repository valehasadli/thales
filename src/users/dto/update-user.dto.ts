import { IsString, IsArray, MaxLength, ArrayMinSize, IsOptional, IsIn } from 'class-validator';
import { predefinedGroups, predefinedRoles } from '../interfaces/user.interface';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  @IsIn(predefinedRoles.map(role => role.code), { each: true })
  roles?: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  @IsIn(predefinedGroups, { each: true })
  groups?: string[];
}