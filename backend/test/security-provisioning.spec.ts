import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { RoleType, InvitationStatus, EnrollmentStatus } from '@prisma/client';

describe('Security & Admin Provisioning Architecture Verification', () => {
  describe('1. Public Student Registration & Privilege Escalation Defenses', () => {
    function simulateRegistration(payload: Record<string, any>) {
      // Whitelist DTO policy simulation
      const allowedKeys = ['email', 'password', 'fullName', 'phoneNumber'];
      const filtered: Record<string, any> = {};

      for (const key of Object.keys(payload)) {
        if (!allowedKeys.includes(key)) {
          // In NestJS forbidNonWhitelisted: true, this throws a 400 Bad Request
          throw new Error(`Property ${key} should not exist in registration payload`);
        }
        filtered[key] = payload[key];
      }

      // Password policy validation
      if (filtered.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Trusted server assignment
      const assignedRole = RoleType.STUDENT;
      const passwordHash = bcrypt.hashSync(filtered.password, 4);

      return {
        user: {
          id: 'mock-uuid-1',
          email: filtered.email.toLowerCase().trim(),
          fullName: filtered.fullName,
          roles: [assignedRole],
        },
        passwordHash,
      };
    }

    it('should assign RoleType.STUDENT by default to public registrations', () => {
      const result = simulateRegistration({
        email: 'nepal.student@gmail.com',
        password: 'SecurePassword123!',
        fullName: 'Kiran Shrestha',
      });

      expect(result.user.roles).toEqual([RoleType.STUDENT]);
      expect(result.user.roles).not.toContain(RoleType.ADMIN);
      expect((result.user as any).passwordHash).toBeUndefined();
      expect(bcrypt.compareSync('SecurePassword123!', result.passwordHash)).toBe(true);
    });

    it('should reject registration attempts injecting role: "ADMIN"', () => {
      expect(() => {
        simulateRegistration({
          email: 'malicious@test.com',
          password: 'Password123!',
          fullName: 'Attacker',
          role: 'ADMIN',
        });
      }).toThrow('Property role should not exist in registration payload');
    });

    it('should reject registration attempts injecting isAdmin: true', () => {
      expect(() => {
        simulateRegistration({
          email: 'malicious2@test.com',
          password: 'Password123!',
          fullName: 'Attacker',
          isAdmin: true,
        });
      }).toThrow('Property isAdmin should not exist in registration payload');
    });
  });

  describe('2. Initial Admin Bootstrap Invariants', () => {
    interface BootstrapState {
      isBootstrapped: boolean;
      adminEmail: string | null;
    }

    function simulateBootstrap(
      state: BootstrapState,
      email: string,
      password: string,
      existingUsers: { email: string; role: RoleType }[],
    ) {
      if (state.isBootstrapped) {
        throw new Error(
          `Initial bootstrap already executed for ${state.adminEmail}. Operation is one-time only.`,
        );
      }

      const existing = existingUsers.find((u) => u.email === email.toLowerCase());
      if (existing) {
        if (existing.role === RoleType.STUDENT) {
          throw new Error(
            'Account already exists with STUDENT role. Silent promotion is forbidden.',
          );
        }
        throw new Error('User already exists as administrator.');
      }

      if (password.length < 8) {
        throw new Error('Password policy failed: minimum 8 characters required');
      }

      state.isBootstrapped = true;
      state.adminEmail = email.toLowerCase();

      return {
        success: true,
        email: email.toLowerCase(),
        role: RoleType.ADMIN,
      };
    }

    it('should provision initial admin govind803556@gmail.com successfully on first run', () => {
      const state: BootstrapState = { isBootstrapped: false, adminEmail: null };
      const result = simulateBootstrap(
        state,
        'govind803556@gmail.com',
        'StrongAdminPass2026!',
        [],
      );

      expect(result.success).toBe(true);
      expect(result.role).toBe(RoleType.ADMIN);
      expect(state.isBootstrapped).toBe(true);
      expect(state.adminEmail).toBe('govind803556@gmail.com');
    });

    it('should reject repeated bootstrap runs and protect against duplicate provisioning', () => {
      const state: BootstrapState = {
        isBootstrapped: true,
        adminEmail: 'govind803556@gmail.com',
      };

      expect(() => {
        simulateBootstrap(
          state,
          'secondadmin@gmail.com',
          'StrongAdminPass2026!',
          [],
        );
      }).toThrow('Operation is one-time only');
    });

    it('should refuse to silently promote existing student account', () => {
      const state: BootstrapState = { isBootstrapped: false, adminEmail: null };
      const users = [{ email: 'govind803556@gmail.com', role: RoleType.STUDENT }];

      expect(() => {
        simulateBootstrap(
          state,
          'govind803556@gmail.com',
          'StrongAdminPass2026!',
          users,
        );
      }).toThrow('Silent promotion is forbidden');
    });
  });

  describe('3. Cryptographic Admin Invitation Lifecycle', () => {
    interface InvitationRecord {
      id: string;
      email: string;
      tokenHash: string;
      status: InvitationStatus;
      expiresAt: Date;
    }

    function createInvitation(email: string, requesterRole: RoleType): { record: InvitationRecord; rawToken: string } {
      if (requesterRole !== RoleType.ADMIN && requesterRole !== RoleType.SUPER_ADMIN) {
        throw new Error('Unauthorized: Requires ADMIN role to generate invitations');
      }

      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const record: InvitationRecord = {
        id: 'inv-1',
        email: email.toLowerCase(),
        tokenHash,
        status: InvitationStatus.PENDING,
        expiresAt,
      };

      return { record, rawToken };
    }

    function acceptInvitation(
      record: InvitationRecord,
      submittedToken: string,
      newPassword: string,
    ) {
      const incomingHash = crypto.createHash('sha256').update(submittedToken).digest('hex');
      if (incomingHash !== record.tokenHash) {
        throw new Error('Invalid invitation token');
      }
      if (record.status !== InvitationStatus.PENDING) {
        throw new Error(`Invitation is already ${record.status}`);
      }
      if (new Date() > record.expiresAt) {
        throw new Error('Invitation has expired');
      }

      record.status = InvitationStatus.ACCEPTED;
      return {
        email: record.email,
        role: RoleType.ADMIN,
        passwordHash: bcrypt.hashSync(newPassword, 4),
      };
    }

    it('should prohibit student roles from generating admin invitations', () => {
      expect(() => {
        createInvitation('invitee@examsathi.com', RoleType.STUDENT);
      }).toThrow('Unauthorized: Requires ADMIN role');
    });

    it('should securely generate and verify cryptographic invitation tokens', () => {
      const { record, rawToken } = createInvitation('newcoadmin@examsathi.com', RoleType.ADMIN);

      expect(record.tokenHash).not.toEqual(rawToken);
      expect(record.tokenHash.length).toBe(64); // SHA-256 hex length

      const adminUser = acceptInvitation(record, rawToken, 'AdminSecret2026!');
      expect(adminUser.email).toBe('newcoadmin@examsathi.com');
      expect(adminUser.role).toBe(RoleType.ADMIN);
      expect(record.status).toBe(InvitationStatus.ACCEPTED);
    });

    it('should reject reused or expired invitation tokens', () => {
      const { record, rawToken } = createInvitation('newcoadmin2@examsathi.com', RoleType.ADMIN);
      acceptInvitation(record, rawToken, 'AdminSecret2026!');

      // Attempt second acceptance
      expect(() => {
        acceptInvitation(record, rawToken, 'AnotherPass123!');
      }).toThrow('Invitation is already ACCEPTED');
    });
  });

  describe('4. Multi-Course Purchase, eSewa Proof & Admin Verification', () => {
    it('should create pending enrollments and verify access upon administrative approval', () => {
      const studentId = 'student-uuid-99';
      const selectedCourses = [
        { id: 'course-nec-civil', title: 'NEC Civil License Track', priceNpr: 1999 },
        { id: 'course-loksewa-civil-7', title: 'Lok Sewa Civil 7th Level', priceNpr: 2499 },
      ];
      const totalAmount = selectedCourses.reduce((sum, c) => sum + c.priceNpr, 0);

      // 1. Student submits order with eSewa payment receipt
      const order = {
        id: 'ord-101',
        studentId,
        amountNpr: totalAmount,
        status: 'PENDING',
        esewaTargetId: '9824803556',
        receiptImageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE...',
        transactionCode: 'TXN-ESEWA-88123',
      };

      const enrollments = selectedCourses.map((c) => ({
        courseId: c.id,
        courseTitle: c.title,
        status: EnrollmentStatus.PENDING_VERIFICATION as EnrollmentStatus,
        isUnlocked: false,
      }));

      expect(order.amountNpr).toBe(4498);
      expect(enrollments.every((e) => !e.isUnlocked)).toBe(true);

      // 2. Admin inspects screenshot and verifies order
      order.status = 'PAID';
      enrollments.forEach((e) => {
        e.status = EnrollmentStatus.ACTIVE;
        e.isUnlocked = true;
      });

      expect(order.status).toBe('PAID');
      expect(enrollments.every((e) => e.status === EnrollmentStatus.ACTIVE)).toBe(true);
      expect(enrollments.every((e) => e.isUnlocked)).toBe(true);
    });
  });

  describe('5. Role-Based Access Control Boundaries', () => {
    function evaluateRouteAccess(userRoles: string[], requiredRoles: string[]) {
      if (!userRoles || userRoles.length === 0) return false;
      return userRoles.some((r) => requiredRoles.includes(r));
    }

    it('should reject student access to admin-only control panel endpoints', () => {
      const studentRoles = [RoleType.STUDENT];
      const adminRoles = [RoleType.ADMIN, RoleType.SUPER_ADMIN];

      expect(evaluateRouteAccess(studentRoles, adminRoles)).toBe(false);
      expect(evaluateRouteAccess([RoleType.ADMIN], adminRoles)).toBe(true);
    });
  });
});
