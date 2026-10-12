import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AcceptAdminInvitationDto } from './dto/accept-invitation.dto';
import { RoleType } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Explicitly enforce STUDENT role in trusted backend code
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
        email: normalizedEmail,
        passwordHash,
        fullName: dto.fullName.trim(),
        phoneNumber: dto.phoneNumber?.trim() || null,
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

    this.logger.log(`Student registered successfully: ${user.email} (${user.id})`);

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
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
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
        courseEnrollments: {
          where: { status: 'ACTIVE' },
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
      activeCourses: user.courseEnrollments.map((e) => ({
        id: e.id,
        title: e.courseTitle,
        verifiedAt: e.verifiedAt,
      })),
      createdAt: user.createdAt,
    };
  }

  async acceptAdminInvitation(dto: AcceptAdminInvitationDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token.trim()).digest('hex');

    const invitation = await this.prisma.adminInvitation.findUnique({
      where: { tokenHash },
    });

    if (!invitation) {
      throw new UnauthorizedException('Invalid administrator invitation token.');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException(
        `This invitation has already been ${invitation.status.toLowerCase()}.`,
      );
    }

    if (new Date() > invitation.expiresAt) {
      await this.prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('This administrator invitation has expired.');
    }

    let adminRole = await this.prisma.role.findUnique({
      where: { name: RoleType.ADMIN },
    });
    if (!adminRole) {
      adminRole = await this.prisma.role.create({
        data: { name: RoleType.ADMIN, description: 'Primary System Administrator' },
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      // Create Admin user
      const user = await tx.user.create({
        data: {
          email: invitation.email.toLowerCase(),
          passwordHash,
          fullName: dto.fullName.trim(),
          phoneNumber: dto.phoneNumber?.trim() || null,
          isActive: true,
          userRoles: {
            create: { roleId: adminRole!.id },
          },
        },
        include: {
          userRoles: { include: { role: true } },
        },
      });

      // Mark invitation as ACCEPTED
      await tx.adminInvitation.update({
        where: { id: invitation.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'ADMIN_INVITATION_ACCEPTED',
          resourceType: 'User',
          resourceId: user.id,
          payload: JSON.stringify({
            invitationId: invitation.id,
            email: user.email,
          }),
        },
      });

      const roles = user.userRoles.map((ur) => ur.role.name);
      const accessToken = this.generateToken(user.id, user.email, roles);

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          roles,
        },
        message: 'Administrator account provisioned successfully via authorized invitation.',
      };
    });
  }

  private generateToken(userId: string, email: string, roles: string[]) {
    return this.jwtService.sign({
      sub: userId,
      email,
      roles,
    });
  }
}
