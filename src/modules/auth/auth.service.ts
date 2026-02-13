import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, LoginResponseDto } from './dto';
import { UserDto } from '../users/dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    let user: User;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user = await this.usersService.findByEmail(email);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await this.usersService.verifyPassword(
      user.id,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    this.logger.log(`User logged in: ${email}`);

    // Map user to UserDto (without password)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken,
      user: userDto,
    };
  }
}
