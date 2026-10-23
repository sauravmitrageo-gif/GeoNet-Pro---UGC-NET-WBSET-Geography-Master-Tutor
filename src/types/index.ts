export type QuestionFormat = 'assertion_reason' | 'multi_statement' | 'matching' | 'conceptual_analysis';

export interface QuestionStatement {
  label: string; // e.g. "Statement I", "Statement II", or "A", "B", "C", "D"
  text: string;
}

export interface MatchingItem {
  code: string; // e.g. "A", "B", "C", "D" or "1", "2", "3", "4"
  text: string;
}

export interface QuestionOption {
  id: string; // "1", "2", "3", "4" or "A", "B", "C", "D"
  text: string;
}

export interface OptionDebunkItem {
  optionId: string;
  verdict: 'Correct' | 'Incorrect';
  explanation: string;
  examTrap?: string;
}

export interface UGCQuestion {
  id: string;
  topic: string;
  unit: string;
  paper: 'Paper 1' | 'Paper 2 (Geography)';
  format: QuestionFormat;
  questionStem: string;
  assertion?: string;
  reason?: string;
  statements?: QuestionStatement[];
  list1Title?: string;
  list1?: MatchingItem[];
  list2Title?: string;
  list2?: MatchingItem[];
  options: QuestionOption[];
  correctOptionId: string;
  correctExplanation: string;
  optionDebunker: OptionDebunkItem[];
  keyConceptTakeaway: string;
  difficulty?: 'Standard NTA NET' | 'High-Level (Latest Pattern)' | 'WBSET Conceptual';
  source?: string;
}

export interface SyllabusUnit {
  id: string;
  paper: 'Paper 1' | 'Paper 2 (Geography)';
  unitNumber: number;
  title: string;
  iconName: string;
  highYieldTopics: string[];
  description: string;
}

export interface TopicPreset {
  id: string;
  title: string;
  unit: string;
  paper: 'Paper 1' | 'Paper 2 (Geography)';
  badge: string;
}

export interface DailyGoal {
  target: number;
  todayPracticed: number;
  date: string; // ISO date YYYY-MM-DD
}
