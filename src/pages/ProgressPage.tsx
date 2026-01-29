import { Link } from 'react-router-dom';
import { RotateCcw, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/contexts/ProgressContext';
import { CATEGORY_LABELS, type Problem, type Category } from '@/types';

interface ProgressPageProps {
  problems: Problem[];
}

export function ProgressPage({ problems }: ProgressPageProps) {
  const { progress, getCompletionRate, resetProgress } = useProgress();

  const handleReset = () => {
    if (window.confirm('進捗をリセットしますか？\n\nこの操作は取り消せません。')) {
      resetProgress();
    }
  };

  const categories: Category[] = ['basic', 'aggregation', 'analysis', 'segmentation'];

  const recentHistory = progress.queryHistory.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">学習進捗</h1>
          <p className="text-muted-foreground">
            カテゴリ別の進捗と最近の学習履歴を確認できます。
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          リセット
        </Button>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">全体の進捗</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-secondary rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionRate(undefined, problems)}%` }}
                />
              </div>
            </div>
            <div className="text-right min-w-[100px]">
              <div className="text-2xl font-bold">
                {getCompletionRate(undefined, problems)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {progress.completedProblems.length} / {problems.length} 完了
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">カテゴリ別進捗</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const categoryProblems = problems.filter((p) => p.category === category);
            const rate = getCompletionRate(category, problems);
            const completed = categoryProblems.filter((p) =>
              progress.completedProblems.includes(p.id)
            ).length;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {completed} / {categoryProblems.length}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Completed Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            完了した問題
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progress.completedProblems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              まだ完了した問題はありません
            </p>
          ) : (
            <div className="space-y-2">
              {problems
                .filter((p) => progress.completedProblems.includes(p.id))
                .map((problem) => (
                  <Link
                    key={problem.id}
                    to={`/problem/${problem.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{problem.title}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            最近の履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              まだ学習履歴はありません
            </p>
          ) : (
            <div className="space-y-3">
              {recentHistory.map((item, i) => {
                const problem = problems.find((p) => p.id === item.problemId);
                const date = new Date(item.timestamp);
                return (
                  <div
                    key={i}
                    className="p-3 rounded-lg border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        to={`/problem/${item.problemId}`}
                        className="font-medium text-sm hover:underline"
                      >
                        {problem?.title || item.problemId}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-20">
                      {item.query.slice(0, 200)}
                      {item.query.length > 200 && '...'}
                    </pre>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
