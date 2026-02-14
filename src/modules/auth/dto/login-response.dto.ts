import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto';

/**
 * Login Response DTO
 */
export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  refreshToken: string;

  @ApiProperty()
  user: UserDto;
}
