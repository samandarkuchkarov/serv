// src/auth/auth.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; // We will create this in next step
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find admin by email
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(loginDto.password, admin.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Create JWT payload
    const payload = {
      sub: admin.id,
      email: admin.email,
    };

    // Generate access token
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }
}
