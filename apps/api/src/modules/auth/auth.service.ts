import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RoleType } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Default to STUDENT role
    let studentRole = await this.prisma.role.findUnique({
      where: { name: RoleType.STUDENT },
    });

    if (!studentRole) {
      studentRole = await this.prisma.role.create({
        data: {
          name: RoleType.STUDENT,
          description: 'Standard student role',
        },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        userRoles: {
          create: {
            roleId: studentRole.id,
          },
        },
      },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    this.logger.log(`User registered successfully: ${user.email} (${user.id})`);

    const roles = user.userRoles.map((ur) => ur.role.name);
    const token = this.generateToken(user.id, user.email, roles);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated. Please contact support.');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const token = this.generateToken(user.id, user.email, roles);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: { role: true },
        },
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { plan: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      roles: user.userRoles.map((ur) => ur.role.name),
      activeSubscriptions: user.subscriptions.map((s) => ({
        id: s.id,
        planName: s.plan.name,
        endDate: s.endDate,
      })),
      createdAt: user.createdAt,
    };
  }

  private generateToken(userId: string, email: string, roles: string[]) {
    return this.jwtService.sign({
      sub: userId,
      email,
      roles,
    });
  }
}
