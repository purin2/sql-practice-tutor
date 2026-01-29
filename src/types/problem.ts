export interface Hint {
  level: 1 | 2 | 3;
  type: 'table' | 'clause' | 'structure' | 'tip';
  content: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'basic' | 'aggregation' | 'analysis' | 'segmentation';
  requiredTables: string[];
  hints: Hint[];
  answer: string;
  relatedSyntax: string[];
}

export type Difficulty = Problem['difficulty'];
export type Category = Problem['category'];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  basic: '基礎クエリ',
  aggregation: '集計・結合',
  analysis: '分析クエリ',
  segmentation: 'セグメント分析',
};
