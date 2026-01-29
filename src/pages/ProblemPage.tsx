import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Check, Loader2, Play, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SQLEditor } from '@/components/editor/SQLEditor';
import { HintSection } from '@/components/hint/HintSection';
import { useProgress } from '@/contexts/ProgressContext';
import { useDatabase, type QueryResult } from '@/hooks/useDatabase';
import { DIFFICULTY_LABELS, CATEGORY_LABELS, type Problem } from '@/types';

interface ProblemPageProps {
  problems: Problem[];
}

export function ProblemPage({ problems }: ProblemPageProps) {
  const { id } = useParams<{ id: string }>();
  const problem = problems.find((p) => p.id === id);
  const { progress, markCompleted, markIncomplete, saveQuery } = useProgress();
  const { isLoading: dbLoading, initError: dbError, executeQuery } = useDatabase();

  const [query, setQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [execStatus, setExecStatus] = useState<'idle' | 'running'>('idle');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

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

  // Reset results when query changes
  useEffect(() => {
    setQueryResult(null);
    setQueryError(null);
  }, [query]);

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

  const handleSave = useCallback(() => {
    try {
      setSaveStatus('saving');
      console.log('[ProblemPage] Saving query for problem:', problem.id);
      saveQuery(problem.id, query);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('[ProblemPage] Save error:', error);
      setSaveStatus('error');
      alert(`保存エラー: ${error}`);
    }
  }, [problem.id, query, saveQuery]);

  const handleExecute = useCallback(() => {
    setExecStatus('running');
    setQueryResult(null);
    setQueryError(null);

    // Small delay to show loading state
    setTimeout(() => {
      const { result, error } = executeQuery(query);

      if (error) {
        setQueryError(error.message);
        console.error('[ProblemPage] Query execution error:', error.message);
      } else if (result) {
        setQueryResult(result);
        console.log('[ProblemPage] Query executed successfully:', result);
      }

      setExecStatus('idle');
    }, 100);
  }, [query, executeQuery]);

  const toggleComplete = useCallback(() => {
    try {
      console.log('[ProblemPage] Toggling complete for problem:', problem.id, 'current:', isCompleted);
      if (isCompleted) {
        markIncomplete(problem.id);
      } else {
        markCompleted(problem.id);
        saveQuery(problem.id, query);
      }
    } catch (error) {
      console.error('[ProblemPage] Toggle complete error:', error);
      alert(`エラー: ${error}`);
    }
  }, [problem.id, query, isCompleted, markCompleted, markIncomplete, saveQuery]);

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
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleExecute}
                disabled={dbLoading || execStatus === 'running'}
              >
                {execStatus === 'running' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {dbLoading ? '読込中...' : execStatus === 'running' ? '実行中...' : '実行'}
              </Button>
              <Button
                variant={saveStatus === 'saved' ? 'default' : 'outline'}
                size="sm"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : saveStatus === 'saved' ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saveStatus === 'saved' ? '保存済み' : saveStatus === 'saving' ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>

          <SQLEditor
            value={query}
            onChange={setQuery}
            className="min-h-[300px]"
          />

          {/* Database initialization error */}
          {dbError && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">データベース初期化エラー</p>
                  <p className="text-sm mt-1">{dbError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Query error */}
          {queryError && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">SQLエラー</p>
                  <p className="text-sm mt-1 font-mono">{queryError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Query result */}
          {queryResult && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  実行結果 ({queryResult.values.length} 行)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {queryResult.columns.map((col, i) => (
                          <th key={i} className="text-left py-2 px-3 font-mono font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.values.map((row, i) => (
                        <tr key={i} className="border-b last:border-0">
                          {row.map((cell, j) => (
                            <td key={j} className="py-2 px-3 font-mono text-xs">
                              {cell === null ? (
                                <span className="text-muted-foreground">NULL</span>
                              ) : cell instanceof Uint8Array ? (
                                <span className="text-muted-foreground">[BLOB]</span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
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
