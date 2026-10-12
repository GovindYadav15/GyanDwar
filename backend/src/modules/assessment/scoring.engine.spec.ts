import { ScoringEngine, AnswerItemInput } from './scoring.engine';

describe('ScoringEngine (Authoritative Assessment Scoring)', () => {
  it('should score an all-correct test with 100% accuracy', () => {
    const questions: AnswerItemInput[] = [
      {
        questionId: 'q1',
        selectedOptionId: 'optA',
        correctOptionId: 'optA',
        marks: 1.0,
        negativeMarks: 0.2,
      },
      {
        questionId: 'q2',
        selectedOptionId: 'optB',
        correctOptionId: 'optB',
        marks: 1.0,
        negativeMarks: 0.2,
      },
    ];

    const result = ScoringEngine.evaluate(questions, 2.0, 1.0);
    expect(result.totalScore).toBe(2.0);
    expect(result.totalCorrect).toBe(2);
    expect(result.totalIncorrect).toBe(0);
    expect(result.accuracyRate).toBe(100);
    expect(result.isPassed).toBe(true);
    expect(result.totalNegativeDeduction).toBe(0);
  });

  it('should apply negative marking for incorrect answers', () => {
    const questions: AnswerItemInput[] = [
      {
        questionId: 'q1',
        selectedOptionId: 'optA',
        correctOptionId: 'optA',
        marks: 1.0,
        negativeMarks: 0.2,
      }, // +1.0
      {
        questionId: 'q2',
        selectedOptionId: 'optC',
        correctOptionId: 'optB',
        marks: 1.0,
        negativeMarks: 0.2,
      }, // -0.2
      {
        questionId: 'q3',
        selectedOptionId: null,
        correctOptionId: 'optD',
        marks: 1.0,
        negativeMarks: 0.2,
      }, // 0.0
    ];

    const result = ScoringEngine.evaluate(questions, 3.0, 1.5);
    expect(result.totalScore).toBe(0.8); // 1.0 - 0.2 = 0.8
    expect(result.totalCorrect).toBe(1);
    expect(result.totalIncorrect).toBe(1);
    expect(result.totalUnanswered).toBe(1);
    expect(result.accuracyRate).toBe(50.0);
    expect(result.totalNegativeDeduction).toBe(0.2);
    expect(result.isPassed).toBe(false);
  });

  it('should not allow total score to drop below 0.0', () => {
    const questions: AnswerItemInput[] = [
      {
        questionId: 'q1',
        selectedOptionId: 'optWrong',
        correctOptionId: 'optA',
        marks: 1.0,
        negativeMarks: 0.5,
      },
      {
        questionId: 'q2',
        selectedOptionId: 'optWrong',
        correctOptionId: 'optB',
        marks: 1.0,
        negativeMarks: 0.5,
      },
    ];

    const result = ScoringEngine.evaluate(questions, 2.0, 1.0);
    expect(result.totalScore).toBe(0);
    expect(result.totalNegativeDeduction).toBe(1.0);
    expect(result.isPassed).toBe(false);
  });
});
