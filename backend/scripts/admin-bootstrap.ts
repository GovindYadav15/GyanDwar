import { PrismaClient, RoleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();

function promptHidden(query: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // In environments where hidden input is supported
    if (process.stdin.isTTY) {
      process.stdout.write(query);
      const stdin = process.stdin;
      const oldRaw = stdin.isRaw;
      stdin.setRawMode(true);
      stdin.resume();

      let password = '';
      const onData = (ch: Buffer) => {
        const c = ch.toString('utf8');
        if (c === '\n' || c === '\r' || c === '\u0004') {
          stdin.setRawMode(oldRaw);
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(password);
        } else if (c === '\u0003') {
          process.exit(1);
        } else if (c === '\b' || c === '\x7f') {
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
        } else {
          password += c;
          process.stdout.write('*');
        }
      };
      stdin.on('data', onData);
    } else {
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

function promptText(query: string, defaultValue?: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const prompt = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

function parseArgs(): { email?: string; password?: string; confirmPassword?: string; nonInteractive: boolean } {
  const args = process.argv.slice(2);
  const result: { email?: string; password?: string; confirmPassword?: string; nonInteractive: boolean } = {
    nonInteractive: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      result.email = args[i + 1].toLowerCase().trim();
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      result.password = args[i + 1];
      i++;
    } else if (args[i] === '--confirm-password' && args[i + 1]) {
      result.confirmPassword = args[i + 1];
      i++;
    } else if (args[i] === '--non-interactive') {
      result.nonInteractive = true;
    }
  }

  return result;
}

function validatePasswordPolicy(password: string): { valid: boolean; reason?: string } {
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one number.' };
  }
  return { valid: true };
}

async function main() {
  console.log('=====================================================');
  console.log('🛡️  ExamSathi Nepal - Secure Initial Admin Bootstrap');
  console.log('=====================================================');

  // 1. Verify Environment
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not configured. Bootstrap aborted.');
    process.exit(1);
  }

  const cliArgs = parseArgs();

  // 2. Check if bootstrap was already executed
  const existingBootstrap = await prisma.systemBootstrap.findFirst();
  if (existingBootstrap) {
    console.error(
      `❌ Bootstrap already completed on ${existingBootstrap.bootstrappedAt.toISOString()} for admin (${existingBootstrap.adminEmail}).`,
    );
    console.error('This operational provisioning tool is strictly one-time.');
    process.exit(1);
  }

  // 3. Resolve Admin Email
  let adminEmail = cliArgs.email;
  if (!adminEmail) {
    if (cliArgs.nonInteractive) {
      adminEmail = 'govind803556@gmail.com';
    } else {
      adminEmail = await promptText(
        'Enter intended initial administrator email',
        'govind803556@gmail.com',
      );
    }
  }

  if (!adminEmail || !adminEmail.includes('@')) {
    console.error('❌ Error: A valid administrator email address is required.');
    process.exit(1);
  }

  // Check if this email already exists as a student
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase() },
    include: { userRoles: { include: { role: true } } },
  });

  if (existingUser) {
    const isAlreadyAdmin = existingUser.userRoles.some(
      (ur) => ur.role.name === RoleType.ADMIN || ur.role.name === RoleType.SUPER_ADMIN,
    );
    if (isAlreadyAdmin) {
      console.error(
        `❌ User with email ${adminEmail} is already provisioned as an administrator.`,
      );
      process.exit(1);
    } else {
      console.error(
        `❌ Error: Account ${adminEmail} already exists with a STUDENT role.`,
      );
      console.error(
        'Silent promotion is forbidden. A separate, authorized account-promotion procedure is required.',
      );
      process.exit(1);
    }
  }

  // 4. Resolve Password
  let password = cliArgs.password;
  let confirmPassword = cliArgs.confirmPassword;

  if (!password) {
    if (cliArgs.nonInteractive) {
      console.error('❌ Error: Password is required in non-interactive mode via --password.');
      process.exit(1);
    }
    password = await promptHidden('Enter new administrator password: ');
    confirmPassword = await promptHidden('Confirm administrator password: ');
  }

  if (!password) {
    console.error('❌ Error: Password cannot be empty.');
    process.exit(1);
  }

  if (confirmPassword && password !== confirmPassword) {
    console.error('❌ Error: Passwords do not match.');
    process.exit(1);
  }

  const policyCheck = validatePasswordPolicy(password);
  if (!policyCheck.valid) {
    console.error(`❌ Password policy violation: ${policyCheck.reason}`);
    process.exit(1);
  }

  // 5. Hash Password & Execute Atomic Transaction
  const passwordHash = await bcrypt.hash(password, 10);

  // Ensure ADMIN role exists
  let adminRole = await prisma.role.findUnique({
    where: { name: RoleType.ADMIN },
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        name: RoleType.ADMIN,
        description: 'Primary System Administrator',
      },
    });
  }

  await prisma.$transaction(async (tx) => {
    // Re-check bootstrap inside transaction to prevent race conditions
    const checkAgain = await tx.systemBootstrap.findFirst();
    if (checkAgain) {
      throw new Error('Concurrent bootstrap detected. Aborting.');
    }

    const createdAdmin = await tx.user.create({
      data: {
        email: adminEmail!.toLowerCase(),
        passwordHash,
        fullName: 'Initial System Administrator',
        isActive: true,
        userRoles: {
          create: {
            roleId: adminRole!.id,
          },
        },
      },
    });

    await tx.systemBootstrap.create({
      data: {
        adminEmail: adminEmail!.toLowerCase(),
        ipAddress: '127.0.0.1 (CLI)',
      },
    });

    await tx.auditLog.create({
      data: {
        userId: createdAdmin.id,
        action: 'SYSTEM_BOOTSTRAP_ADMIN',
        resourceType: 'User',
        resourceId: createdAdmin.id,
        payload: JSON.stringify({
          email: adminEmail!.toLowerCase(),
          method: 'CLI_BOOTSTRAP',
          timestamp: new Date().toISOString(),
        }),
      },
    });
  });

  console.log('✅ Initial administrator successfully provisioned.');
  console.log(`✅ Identity: ${adminEmail.toLowerCase()}`);
  console.log('✅ Role: ADMIN');
  console.log('✅ Bootstrap state recorded. System is now locked against re-bootstrapping.');
  console.log('=====================================================');
}

main()
  .catch((err) => {
    console.error('❌ Bootstrap failed:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
