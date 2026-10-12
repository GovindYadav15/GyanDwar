export interface AnswerItemInput {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  marks: number;
  negativeMarks: number;
  timeSpentSeconds?: number;
}

export interface ScoredItemResult {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  marksAwarded: number;
  negativeMarksDeducted: number;
  netScore: number;
}

export interface OverallAssessmentScore {
  totalScore: number;
  totalMarks: number;
  passMarks: number;
  isPassed: boolean;
  totalQuestions: number;
  totalAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  accuracyRate: number; // percentage (0 - 100)
  totalNegativeDeduction: number;
  items: ScoredItemResult[];
}

export class ScoringEngine {
  /**
   * Authoritative scoring method supporting negative marking.
   * If an answer is correct: +marks
   * If an answer is incorrect: -negativeMarks
   * If an answer is unanswered: 0
   */
  static evaluate(
    items: AnswerItemInput[],
    totalAssessmentMarks: number,
    passMarks: number,
  ): OverallAssessmentScore {
    let totalScore = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnanswered = 0;
    let totalNegativeDeduction = 0;

    const scoredItems: ScoredItemResult[] = items.map((item) => {
      if (!item.selectedOptionId) {
        totalUnanswered++;
        return {
          questionId: item.questionId,
          selectedOptionId: null,
          correctOptionId: item.correctOptionId,
          isCorrect: false,
          marksAwarded: 0,
          negativeMarksDeducted: 0,
          netScore: 0,
        };
      }

      const isCorrect = item.selectedOptionId === item.correctOptionId;
      if (isCorrect) {
        totalCorrect++;
        totalScore += item.marks;
        return {
          questionId: item.questionId,
          selectedOptionId: item.selectedOptionId,
          correctOptionId: item.correctOptionId,
          isCorrect: true,
          marksAwarded: item.marks,
          negativeMarksDeducted: 0,
          netScore: item.marks,
        };
      } else {
        totalIncorrect++;
        totalNegativeDeduction += item.negativeMarks;
        totalScore -= item.negativeMarks;
        return {
          questionId: item.questionId,
          selectedOptionId: item.selectedOptionId,
          correctOptionId: item.correctOptionId,
          isCorrect: false,
          marksAwarded: 0,
          negativeMarksDeducted: item.negativeMarks,
          netScore: -item.negativeMarks,
        };
      }
    });

    const totalAnswered = totalCorrect + totalIncorrect;
    const accuracyRate =
      totalAnswered > 0 ? Number(((totalCorrect / totalAnswered) * 100).toFixed(2)) : 0;

    // Floor score at 0.0 to prevent negative total test scores unless configured
    const finalScore = Number(Math.max(0, totalScore).toFixed(2));
    const isPassed = finalScore >= passMarks;

    return {
      totalScore: finalScore,
      totalMarks: totalAssessmentMarks,
      passMarks,
      isPassed,
      totalQuestions: items.length,
      totalAnswered,
      totalCorrect,
      totalIncorrect,
      totalUnanswered,
      accuracyRate,
      totalNegativeDeduction: Number(totalNegativeDeduction.toFixed(2)),
      items: scoredItems,
    };
  }
}
