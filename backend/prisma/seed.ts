import {
  PrismaClient,
  RoleType,
  CategoryCode,
  DifficultyLevel,
  QuestionStatus,
  AssessmentType,
  ResourceType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ExamSathi Nepal demonstration database seeding...');

  // 1. Roles
  const roles = [
    { name: RoleType.SUPER_ADMIN, description: 'Super Administrator with complete system access' },
    { name: RoleType.ADMIN, description: 'System Administrator for content and operations' },
    { name: RoleType.CONTENT_EDITOR, description: 'Educational Content and Question Author' },
    { name: RoleType.INSTRUCTOR, description: 'Subject matter expert and reviewer' },
    { name: RoleType.STUDENT, description: 'Student and exam candidate' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log('✅ Roles seeded.');

  // 2. Demo Users
  const studentPasswordHash = await bcrypt.hash('Student123!', 10);
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleType.ADMIN } });
  const studentRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleType.STUDENT } });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@examsathi.com.np' },
    update: {},
    create: {
      email: 'admin@examsathi.com.np',
      fullName: 'Prashant Adhikari (Admin)',
      passwordHash: adminPasswordHash,
      phoneNumber: '9851000001',
      userRoles: {
        create: { roleId: adminRole.id },
      },
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@examsathi.com.np' },
    update: {},
    create: {
      email: 'student@examsathi.com.np',
      fullName: 'Aayush Sharma (Student)',
      passwordHash: studentPasswordHash,
      phoneNumber: '9841234567',
      userRoles: {
        create: { roleId: studentRole.id },
      },
    },
  });
  console.log(`✅ Users seeded: Admin (${adminUser.email}), Student (${studentUser.email})`);

  // 3. Exam Categories
  const necCategory = await prisma.examCategory.upsert({
    where: { code: CategoryCode.NEC },
    update: {},
    create: {
      code: CategoryCode.NEC,
      title: 'NEC Engineering License Examination',
      description:
        'Comprehensive preparation for Nepal Engineering Council (NEC) License examinations across all recognized engineering faculties.',
      iconUrl: 'academic-cap',
      displayOrder: 1,
      isPublished: true,
    },
  });

  const lokSewaCategory = await prisma.examCategory.upsert({
    where: { code: CategoryCode.LOK_SEWA },
    update: {},
    create: {
      code: CategoryCode.LOK_SEWA,
      title: 'Lok Sewa Aayog (Technical Engineering)',
      description:
        'Public Service Commission competitive recruitment tests for Nepal Engineering Service (Gazetted 7th Level & Non-Gazetted 5th Level).',
      iconUrl: 'building-library',
      displayOrder: 2,
      isPublished: true,
    },
  });

  const diplomaCategory = await prisma.examCategory.upsert({
    where: { code: CategoryCode.DIPLOMA },
    update: {},
    create: {
      code: CategoryCode.DIPLOMA,
      title: 'Diploma License Examination',
      description:
        'Licensing and qualifying assessments for diploma-level technical engineers and overseers in Nepal.',
      iconUrl: 'clipboard-document-check',
      displayOrder: 3,
      isPublished: true,
    },
  });
  console.log('✅ Exam Categories seeded: NEC, Lok Sewa, Diploma');

  // 4. Faculties
  const civilFaculty = await prisma.faculty.upsert({
    where: { categoryId_code: { categoryId: necCategory.id, code: 'CIVIL' } },
    update: {},
    create: {
      categoryId: necCategory.id,
      name: 'Civil Engineering',
      code: 'CIVIL',
      description: 'Structures, hydraulics, soils, transportation, surveying, and management.',
      displayOrder: 1,
    },
  });

  const electricalFaculty = await prisma.faculty.upsert({
    where: { categoryId_code: { categoryId: necCategory.id, code: 'ELECTRICAL' } },
    update: {},
    create: {
      categoryId: necCategory.id,
      name: 'Electrical Engineering',
      code: 'ELECTRICAL',
      description: 'Power systems, machines, transmission, control, and electronics.',
      displayOrder: 2,
    },
  });

  const computerFaculty = await prisma.faculty.upsert({
    where: { categoryId_code: { categoryId: necCategory.id, code: 'COMPUTER' } },
    update: {},
    create: {
      categoryId: necCategory.id,
      name: 'Computer Engineering',
      code: 'COMPUTER',
      description: 'Data structures, algorithms, networks, computer architecture, databases.',
      displayOrder: 3,
    },
  });

  // 5. Exam Track
  const generalCivilTrack = await prisma.examTrack.upsert({
    where: { facultyId_code: { facultyId: civilFaculty.id, code: 'NEC_CIVIL_GEN' } },
    update: {},
    create: {
      facultyId: civilFaculty.id,
      name: 'NEC Civil License Standard Track',
      code: 'NEC_CIVIL_GEN',
      description: 'Standard syllabus matching Nepal Engineering Council 100-mark format.',
      displayOrder: 1,
    },
  });

  // 6. Subjects
  const concreteSubject = await prisma.subject.upsert({
    where: { examTrackId_code: { examTrackId: generalCivilTrack.id, code: 'CONCRETE_TECH' } },
    update: {},
    create: {
      examTrackId: generalCivilTrack.id,
      name: 'Concrete Technology & Construction Materials',
      code: 'CONCRETE_TECH',
      description:
        'Properties of cement, aggregates, mix proportioning, workability, and testing standards.',
      displayOrder: 1,
    },
  });

  const structuralSubject = await prisma.subject.upsert({
    where: { examTrackId_code: { examTrackId: generalCivilTrack.id, code: 'STRUCT_ANALYSIS' } },
    update: {},
    create: {
      examTrackId: generalCivilTrack.id,
      name: 'Structural Analysis & Design',
      code: 'STRUCT_ANALYSIS',
      description:
        'Determinate and indeterminate structures, bending moment, shear force, deflection.',
      displayOrder: 2,
    },
  });

  // 7. Chapters
  const chapter1 = await prisma.chapter.upsert({
    where: { subjectId_chapterNumber: { subjectId: concreteSubject.id, chapterNumber: 1 } },
    update: {},
    create: {
      subjectId: concreteSubject.id,
      title: 'Cement & Pozzolanic Materials',
      chapterNumber: 1,
      description:
        'Types of cement, chemical composition, hydration reactions, sound testing, and fineness.',
      isFreePreview: true, // Free trial chapter!
      displayOrder: 1,
    },
  });

  const chapter2 = await prisma.chapter.upsert({
    where: { subjectId_chapterNumber: { subjectId: concreteSubject.id, chapterNumber: 2 } },
    update: {},
    create: {
      subjectId: concreteSubject.id,
      title: 'Aggregates & Fresh Concrete Properties',
      chapterNumber: 2,
      description:
        'Grading curves, fineness modulus, slump test, compaction factor, segregation, and bleeding.',
      isFreePreview: false,
      displayOrder: 2,
    },
  });

  // 8. Learning Resources
  await prisma.learningResource.create({
    data: {
      chapterId: chapter1.id,
      title: 'Comprehensive Study Notes: Cement Manufacture & Testing (IS & NS Standards)',
      resourceType: ResourceType.NOTES,
      content: `## 1. Composition of Portland Cement\n\nPortland cement is manufactured by pulverizing clinker formed by calcining argillaceous (clayey) and calcareous (lime) materials to incipient fusion.\n\n### Major Bogue's Compounds:\n1. **Tricalcium Silicate ($C_3S$)** (30–50%): Responsible for early strength development (first 7 days).\n2. **Dicalcium Silicate ($C_2S$)** (20–45%): Responsible for progressive strength development (after 28 days).\n3. **Tricalcium Aluminate ($C_3A$)** (8–12%): Causes flash setting; generates maximum heat of hydration.\n4. **Tetracalcium Aluminoferrite ($C_4AF$)** (6–10%): Poorest cementing value, gives color to cement.\n\n> **Key Exam Note**: Gypsum ($CaSO_4 \\cdot 2H_2O$) is added (2-3%) during clinker grinding to retard the rapid setting caused by $C_3A$.`,
      isFreePreview: true,
      displayOrder: 1,
    },
  });

  // 9. Demonstration Questions with Options and Explanations
  const sampleQuestions = [
    {
      questionText:
        'Which Bogue compound is primarily responsible for the early strength of Portland cement within the first 7 days?',
      options: [
        { label: 'A', text: 'Dicalcium Silicate (C2S)', isCorrect: false },
        { label: 'B', text: 'Tricalcium Silicate (C3S)', isCorrect: true },
        { label: 'C', text: 'Tricalcium Aluminate (C3A)', isCorrect: false },
        { label: 'D', text: 'Tetracalcium Aluminoferrite (C4AF)', isCorrect: false },
      ],
      explanationText:
        'Tricalcium Silicate (C3S) hydrates rapidly and provides the majority of the early strength in concrete up to 7–14 days. Dicalcium Silicate (C2S) contributes to long-term strength gain.',
      difficulty: DifficultyLevel.EASY,
    },
    {
      questionText:
        'What is the primary purpose of adding gypsum (CaSO4 · 2H2O) to clinker during the final grinding of Portland cement?',
      options: [
        { label: 'A', text: 'To increase the rate of hydration', isCorrect: false },
        { label: 'B', text: 'To impart grayish color to concrete', isCorrect: false },
        { label: 'C', text: 'To prevent flash setting caused by C3A', isCorrect: true },
        { label: 'D', text: 'To increase ultimate tensile strength', isCorrect: false },
      ],
      explanationText:
        'Tricalcium Aluminate (C3A) reacts instantaneously with water, leading to flash setting. Gypsum acts as a setting retarder by reacting with C3A to form an insoluble calcium sulfoaluminate coating.',
      difficulty: DifficultyLevel.MEDIUM,
    },
    {
      questionText:
        'As per Nepal Standard (NS) and IS 4031, what is the standard water percentage required for the Vicat consistency test of OPC?',
      options: [
        {
          label: 'A',
          text: 'Water quantity that allows the plunger to penetrate to 5 to 7 mm from the bottom of mold',
          isCorrect: true,
        },
        {
          label: 'B',
          text: 'Water quantity that allows penetration to 15 mm from top',
          isCorrect: false,
        },
        { label: 'C', text: 'Exactly 25% by weight of dry cement powder', isCorrect: false },
        {
          label: 'D',
          text: 'Water quantity resulting in zero bleed in 30 minutes',
          isCorrect: false,
        },
      ],
      explanationText:
        'Standard consistency (P) is the percentage of water required to produce a paste that permits the standard Vicat plunger (10 mm diameter) to penetrate to 5–7 mm from the bottom of the mold.',
      difficulty: DifficultyLevel.MEDIUM,
    },
    {
      questionText:
        'For heavily reinforced concrete sections placed in narrow formworks with mechanical pumping, which slump range is recommended?',
      options: [
        { label: 'A', text: '10 - 25 mm', isCorrect: false },
        { label: 'B', text: '25 - 50 mm', isCorrect: false },
        { label: 'C', text: '75 - 100 mm', isCorrect: true },
        { label: 'D', text: '175 - 200 mm', isCorrect: false },
      ],
      explanationText:
        'Pumpable concrete placed in congested reinforcement sections requires high workability, typically with a slump of 75 to 100 mm to flow freely without honeycombing or segregation.',
      difficulty: DifficultyLevel.HARD,
    },
    {
      questionText:
        'Under the Nepal Public Procurement Act (PPA 2063), what is the threshold above which public entities must generally invite International Competitive Bidding (ICB)?',
      options: [
        { label: 'A', text: 'Over NPR 20 Million', isCorrect: false },
        { label: 'B', text: 'Over NPR 50 Million', isCorrect: false },
        {
          label: 'C',
          text: 'When goods/works cannot be procured competitively within Nepal',
          isCorrect: true,
        },
        {
          label: 'D',
          text: 'Mandatory for all foreign-aided projects irrespective of cost',
          isCorrect: false,
        },
      ],
      explanationText:
        'According to PPA 2063, ICB is invoked when qualified competition is not available domestically within Nepal or when international donor agreements specifically mandate ICB procedures.',
      difficulty: DifficultyLevel.MEDIUM,
    },
  ];

  const createdQuestions = [];
  for (const q of sampleQuestions) {
    const question = await prisma.question.create({
      data: {
        chapterId: chapter1.id,
        questionText: q.questionText,
        difficulty: q.difficulty,
        marks: 1.0,
        negativeMarks: 0.2, // 20% negative mark rule
        status: QuestionStatus.PUBLISHED,
        explanationText: q.explanationText,
        options: {
          create: q.options.map((opt) => ({
            optionLabel: opt.label,
            optionText: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
      include: { options: true },
    });
    createdQuestions.push(question);
  }
  console.log(`✅ Seeded ${createdQuestions.length} practice questions with answer options.`);

  // 10. Assessments
  // A: Free Chapter Practice Test
  const practiceTest = await prisma.assessment.create({
    data: {
      subjectId: concreteSubject.id,
      title: 'Chapter 1: Cement & Pozzolanas Practice Test (Free Trial)',
      description:
        'Diagnostic practice covering hydration chemistry, Bogue compounds, and Vicat standard tests.',
      type: AssessmentType.CHAPTER_PRACTICE,
      totalMarks: 5.0,
      passMarks: 2.5,
      durationMinutes: 10,
      isFree: true,
      isPublished: true,
      questions: {
        create: createdQuestions.slice(0, 5).map((q, idx) => ({
          questionId: q.id,
          displayOrder: idx + 1,
          marks: 1.0,
        })),
      },
    },
  });

  // B: Full-Length 100-Mark Model Exam
  const fullMockTest = await prisma.assessment.create({
    data: {
      subjectId: concreteSubject.id,
      title: 'NEC Civil Engineering Licensure Examination (Full 100-Mark Mock 2026)',
      description:
        'Official simulation conforming to Nepal Engineering Council format: 100 questions, 1 mark each, 0.2 negative marking, 120-minute timed environment.',
      type: AssessmentType.FULL_MOCK,
      totalMarks: 100.0,
      passMarks: 50.0,
      durationMinutes: 120,
      isFree: false,
      isPublished: true,
      questions: {
        create: createdQuestions.map((q, idx) => ({
          questionId: q.id,
          displayOrder: idx + 1,
          marks: 1.0,
        })),
      },
    },
  });
  console.log(
    `✅ Seeded Assessments: Practice (${practiceTest.title}) & Full Mock (${fullMockTest.title})`,
  );

  // 11. Subscription Plans & Entitlements
  const plans = [
    {
      name: '1 Month Intensive Pass',
      code: 'PLAN_MONTHLY',
      description:
        'Ideal for candidates in their final month of revision before the NEC / Lok Sewa exam date.',
      durationDays: 30,
      priceNpr: 999.0,
      discountNpr: 200.0,
    },
    {
      name: '3 Month Complete Preparation',
      code: 'PLAN_QUARTERLY',
      description:
        'Most popular plan covering all faculties, full question banks, chapter drills, and unlimited mock simulations.',
      durationDays: 90,
      priceNpr: 2499.0,
      discountNpr: 500.0,
    },
    {
      name: '1 Year All-Access Career Pass',
      code: 'PLAN_ANNUAL',
      description:
        'Comprehensive access to NEC, Lok Sewa Assistant, and Officer preparation modules with regular question updates.',
      durationDays: 365,
      priceNpr: 5999.0,
      discountNpr: 1500.0,
    },
  ];

  for (const p of plans) {
    const plan = await prisma.subscriptionPlan.upsert({
      where: { code: p.code },
      update: {},
      create: {
        name: p.name,
        code: p.code,
        description: p.description,
        durationDays: p.durationDays,
        priceNpr: p.priceNpr,
        discountNpr: p.discountNpr,
        isActive: true,
        entitlements: {
          create: [
            {
              categoryId: necCategory.id,
              canAccessNotes: true,
              canAccessPractice: true,
              canAccessFullMock: true,
            },
            {
              categoryId: lokSewaCategory.id,
              canAccessNotes: true,
              canAccessPractice: true,
              canAccessFullMock: true,
            },
            {
              categoryId: diplomaCategory.id,
              canAccessNotes: true,
              canAccessPractice: true,
              canAccessFullMock: true,
            },
          ],
        },
      },
    });
    console.log(`✅ Seeded Plan: ${plan.name} (NPR ${plan.priceNpr})`);
  }

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
