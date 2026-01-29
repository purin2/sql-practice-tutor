export interface QueryHistoryItem {
  problemId: string;
  query: string;
  timestamp: string;
  isCorrect?: boolean;
}

export interface UserProgress {
  completedProblems: string[];
  queryHistory: QueryHistoryItem[];
  lastUpdated: string;
}

export const INITIAL_PROGRESS: UserProgress = {
  completedProblems: [],
  queryHistory: [],
  lastUpdated: new Date().toISOString(),
};
