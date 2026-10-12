import { DifficultyLevel, ParsedMcqItem } from '@examsathi/shared';

export interface ParseResult {
  questions: ParsedMcqItem[];
  errors: string[];
}

/**
 * Parses markdown text containing Multiple Choice Questions with 4 options and answer keys.
 * Supports various common markdown conventions for robust ingestion.
 */
export function parseMcqsFromMarkdown(markdownText: string): ParseResult {
  const errors: string[] = [];
  const questions: ParsedMcqItem[] = [];

  if (!markdownText || !markdownText.trim()) {
    return { questions: [], errors: ['Markdown content is empty.'] };
  }

  // Split into raw blocks by headers or horizontal separators
  // Matches: \n###, \n##, \n---, or start of file with ###
  const rawBlocks = markdownText
    .split(/(?:\r?\n)(?:###|##|---|___|\*\*\*)\s*/g)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  if (rawBlocks.length === 0) {
    return { questions: [], errors: ['No question blocks detected in markdown.'] };
  }

  rawBlocks.forEach((block, index) => {
    const blockNum = index + 1;
    const lines = block
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    // Detect options lines (A, B, C, D)
    const optionRegex = /^[-*]?\s*(?:\(?([A-Da-d])\)|\b([A-Da-d])[\.)])\s+(.+)$/;
    const answerRegex =
      /^\*{0,2}(?:Answer|Correct|Correct\s*Answer|Ans)\*{0,2}\s*:\s*\*{0,2}\(?([A-Da-d])\)?\*{0,2}/i;
    const explanationRegex = /^\*{0,2}(?:Explanation|Rationale|Note)\*{0,2}\s*:\s*(.+)$/i;
    const difficultyRegex = /^\*{0,2}(?:Difficulty|Level)\*{0,2}\s*:\s*(EASY|MEDIUM|HARD)/i;
    const marksRegex = /^\*{0,2}(?:Marks|Score)\*{0,2}\s*:\s*([\d.]+)/i;
    const negativeRegex = /^\*{0,2}(?:Negative|Negative\s*Marks)\*{0,2}\s*:\s*([\d.]+)/i;

    const questionTextLines: string[] = [];
    const optionsMap: Record<string, string> = {};
    let correctAnswerLetter: string | null = null;
    let explanation: string | null = null;
    let difficulty: DifficultyLevel = DifficultyLevel.MEDIUM;
    let marks = 1.0;
    let negativeMarks = 0.2;

    let inExplanation = false;

    for (const line of lines) {
      // 1. Check for Answer line
      const ansMatch = line.match(answerRegex);
      if (ansMatch && ansMatch[1]) {
        correctAnswerLetter = ansMatch[1].toUpperCase();
        inExplanation = false;
        continue;
      }

      // 2. Check for Explanation line
      const expMatch = line.match(explanationRegex);
      if (expMatch && expMatch[1]) {
        explanation = expMatch[1].trim();
        inExplanation = true;
        continue;
      }

      // 3. Check for Difficulty line
      const diffMatch = line.match(difficultyRegex);
      if (diffMatch && diffMatch[1]) {
        const d = diffMatch[1].toUpperCase();
        if (d === 'EASY') difficulty = DifficultyLevel.EASY;
        else if (d === 'HARD') difficulty = DifficultyLevel.HARD;
        else difficulty = DifficultyLevel.MEDIUM;
        inExplanation = false;
        continue;
      }

      // 4. Check for Marks line
      const marksMatch = line.match(marksRegex);
      if (marksMatch && marksMatch[1]) {
        marks = parseFloat(marksMatch[1]) || 1.0;
        inExplanation = false;
        continue;
      }

      // 5. Check for Negative marks line
      const negMatch = line.match(negativeRegex);
      if (negMatch && negMatch[1]) {
        negativeMarks = parseFloat(negMatch[1]) || 0.2;
        inExplanation = false;
        continue;
      }

      // 6. Check for Option line (A, B, C, D)
      const optMatch = line.match(optionRegex);
      if (optMatch) {
        const letter = (optMatch[1] || optMatch[2] || '').toUpperCase();
        const text = (optMatch[3] || '').trim();
        if (['A', 'B', 'C', 'D'].includes(letter)) {
          optionsMap[letter] = text;
          inExplanation = false;
          continue;
        }
      }

      // 7. If currently parsing explanation, append
      if (inExplanation && explanation) {
        explanation += ' ' + line;
        continue;
      }

      // 8. Otherwise line is part of question text (strip leading 'Question 1:' or 'Q1:' if present)
      if (Object.keys(optionsMap).length === 0) {
        const cleaned = line.replace(/^(?:Question\s*\d+|Q\d+|\d+)\s*[:.-]\s*/i, '').trim();
        if (cleaned) {
          questionTextLines.push(cleaned);
        }
      }
    }

    const questionText = questionTextLines.join(' ').trim();

    // Validation checks
    if (!questionText) {
      errors.push(`Item #${blockNum}: Missing question text.`);
      return;
    }

    const availableLetters = ['A', 'B', 'C', 'D'];
    const missingLetters = availableLetters.filter((l) => !optionsMap[l]);
    if (missingLetters.length > 0) {
      errors.push(
        `Item #${blockNum} ("${questionText.slice(0, 35)}..."): Must have exactly 4 options. Missing: ${missingLetters.join(', ')}.`,
      );
      return;
    }

    if (!correctAnswerLetter || !['A', 'B', 'C', 'D'].includes(correctAnswerLetter)) {
      errors.push(
        `Item #${blockNum} ("${questionText.slice(0, 35)}..."): Missing valid Answer key (must be A, B, C, or D).`,
      );
      return;
    }

    questions.push({
      questionText,
      difficulty,
      marks,
      negativeMarks,
      explanationText: explanation || undefined,
      options: availableLetters.map((label) => ({
        optionLabel: label,
        optionText: optionsMap[label]!,
        isCorrect: label === correctAnswerLetter,
      })),
    });
  });

  return { questions, errors };
}
