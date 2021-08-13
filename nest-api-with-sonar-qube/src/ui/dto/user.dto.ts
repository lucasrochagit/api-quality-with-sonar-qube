import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UserDTO {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(18)
  age: number;

  @IsString()
  @IsNotEmpty()
  job: string;
}
