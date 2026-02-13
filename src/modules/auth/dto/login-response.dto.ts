import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto';

/**
 * Login Response DTO
 */
export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty()
  user: UserDto;
}
