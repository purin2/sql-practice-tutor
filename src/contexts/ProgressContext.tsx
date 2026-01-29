import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { UserProgress, QueryHistoryItem } from '@/types';

const INITIAL_PROGRESS: UserProgress = {
  completedProblems: [],
  queryHistory: [],
  lastUpdated: new Date().toISOString(),
};

interface ProgressContextValue {
  progress: UserProgress;
  markCompleted: (problemId: string) => void;
  markIncomplete: (problemId: string) => void;
  saveQuery: (problemId: string, query: string) => void;
  getCompletionRate: (category?: string, problems?: { id: string; category: string }[]) => number;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [progress, setProgress] = useLocalStorage<UserProgress>(
    'sql-practice-progress',
    INITIAL_PROGRESS
  );

  const markCompleted = (problemId: string) => {
    setProgress((prev) => {
      if (prev.completedProblems.includes(problemId)) {
        return prev;
      }
      return {
        ...prev,
        completedProblems: [...prev.completedProblems, problemId],
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const markIncomplete = (problemId: string) => {
    setProgress((prev) => ({
      ...prev,
      completedProblems: prev.completedProblems.filter((id) => id !== problemId),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const saveQuery = (problemId: string, query: string) => {
    const historyItem: QueryHistoryItem = {
      problemId,
      query,
      timestamp: new Date().toISOString(),
    };

    setProgress((prev) => {
      const newHistory = [historyItem, ...prev.queryHistory].slice(0, 100);
      return {
        ...prev,
        queryHistory: newHistory,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const getCompletionRate = (
    category?: string,
    problems?: { id: string; category: string }[]
  ): number => {
    if (!problems || problems.length === 0) return 0;

    const filteredProblems = category
      ? problems.filter((p) => p.category === category)
      : problems;

    if (filteredProblems.length === 0) return 0;

    const completedCount = filteredProblems.filter((p) =>
      progress.completedProblems.includes(p.id)
    ).length;

    return Math.round((completedCount / filteredProblems.length) * 100);
  };

  const resetProgress = () => {
    setProgress(INITIAL_PROGRESS);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markCompleted,
        markIncomplete,
        saveQuery,
        getCompletionRate,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
