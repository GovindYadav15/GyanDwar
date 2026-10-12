# Content Management System (CMS)

## 1. Domain Structure

The educational structure is fully dynamic and never hardcoded:

- `ExamCategory`: Root certification type (e.g. NEC License, Lok Sewa, Diploma License).
- `Faculty`: Engineering or vocational discipline (e.g. Civil, Computer, Electrical, Mechanical).
- `ExamTrack`: Specific level or sub-track (e.g. Assistant 5th, Officer 7th).
- `Subject`: Course subject (e.g. Fluid Mechanics, Strength of Materials, Public Procurement Act).
- `Chapter`: Specific syllabus unit.
- `LearningResource`: Rich markdown notes, PDF attachments, reference links.

## 2. Publishing Workflow

- State machine: `DRAFT` -> `PUBLISHED` -> `ARCHIVED`.
- Unpublished content is hidden from student endpoints while visible in preview mode for editors.
- Deletions are soft-deleted or protected if associated with prior assessment attempts to preserve student historical performance records.
