import { ProblemList } from '@/components/problem/ProblemList';
import { useProgress } from '@/contexts/ProgressContext';
import type { Problem } from '@/types';

interface HomePageProps {
  problems: Problem[];
}

export function HomePage({ problems }: HomePageProps) {
  const { progress, getCompletionRate } = useProgress();
  const completionRate = getCompletionRate(undefined, problems);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">練習問題</h1>
        <p className="text-muted-foreground">
          SQLクエリの練習問題に挑戦しましょう。ヒントを参考にしながら自分で考えてみてください。
        </p>
      </div>

      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-1">全体の進捗</div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{completionRate}%</div>
          <div className="text-xs text-muted-foreground">
            {progress.completedProblems.length} / {problems.length} 完了
          </div>
        </div>
      </div>

      <ProblemList problems={problems} />
    </div>
  );
}
