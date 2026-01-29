import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SQLEditor } from '@/components/editor/SQLEditor';
import { HintSection } from '@/components/hint/HintSection';
import { useProgress } from '@/contexts/ProgressContext';
import { DIFFICULTY_LABELS, CATEGORY_LABELS, type Problem } from '@/types';

interface ProblemPageProps {
  problems: Problem[];
}

export function ProblemPage({ problems }: ProblemPageProps) {
  const { id } = useParams<{ id: string }>();
  const problem = problems.find((p) => p.id === id);
  const { progress, markCompleted, markIncomplete, saveQuery } = useProgress();
  const [query, setQuery] = useState('');

  const isCompleted = problem ? progress.completedProblems.includes(problem.id) : false;

  useEffect(() => {
    if (problem) {
      const lastQuery = progress.queryHistory.find((h) => h.problemId === problem.id);
      if (lastQuery) {
        setQuery(lastQuery.query);
      } else {
        setQuery('-- ここにSQLクエリを書いてください\n\n');
      }
    }
  }, [problem, progress.queryHistory]);

  if (!problem) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">問題が見つかりませんでした</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            問題一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    saveQuery(problem.id, query);
  };

  const toggleComplete = () => {
    if (isCompleted) {
      markIncomplete(problem.id);
    } else {
      markCompleted(problem.id);
      saveQuery(problem.id, query);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{problem.title}</h1>
          <div className="flex gap-2 mt-1">
            <Badge variant={problem.difficulty}>
              {DIFFICULTY_LABELS[problem.difficulty]}
            </Badge>
            <Badge variant="outline">
              {CATEGORY_LABELS[problem.category]}
            </Badge>
          </div>
        </div>
        <Button
          variant={isCompleted ? 'default' : 'outline'}
          onClick={toggleComplete}
        >
          <Check className="mr-2 h-4 w-4" />
          {isCompleted ? '完了済み' : '完了にする'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">問題</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{problem.description}</p>
          <div className="mt-4 text-sm">
            <span className="font-medium">使用テーブル: </span>
            {problem.requiredTables.map((table, i) => (
              <span key={table}>
                <Link
                  to={`/schema#${table}`}
                  className="text-primary hover:underline"
                >
                  {table}
                </Link>
                {i < problem.requiredTables.length - 1 && ', '}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">SQLエディタ</h2>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
          <SQLEditor
            value={query}
            onChange={setQuery}
            className="min-h-[300px]"
          />
        </div>

        <HintSection
          hints={problem.hints}
          answer={problem.answer}
          relatedSyntax={problem.relatedSyntax}
        />
      </div>
    </div>
  );
}
