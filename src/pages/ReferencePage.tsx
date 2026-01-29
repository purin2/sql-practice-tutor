import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ExternalLink, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SQLReference, Problem } from '@/types';
import { cn } from '@/lib/utils';

interface ReferencePageProps {
  references: SQLReference[];
  problems: Problem[];
}

export function ReferencePage({ references, problems }: ReferencePageProps) {
  const { topic } = useParams<{ topic?: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReferences = references.filter(
    (ref) =>
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedReference = topic
    ? references.find((ref) => ref.id === topic)
    : null;

  if (selectedReference) {
    const relatedProblems = problems.filter((p) =>
      selectedReference.relatedProblems.includes(p.id)
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/reference">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {selectedReference.title}
              {selectedReference.isBigQuerySpecific && (
                <Badge variant="secondary">BigQuery</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">{selectedReference.description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">構文</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto font-mono text-sm">
              {selectedReference.syntax}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">使用例</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedReference.examples.map((example, i) => (
              <div key={i}>
                <h4 className="font-medium mb-2">{example.title}</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto font-mono text-sm mb-2">
                  {example.code}
                </pre>
                <p className="text-sm text-muted-foreground">{example.explanation}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {relatedProblems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">この構文を使う練習問題</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {relatedProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    to={`/problem/${problem.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span>{problem.title}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">SQL構文リファレンス</h1>
        <p className="text-muted-foreground">
          SQLの主要な構文と使用例を確認できます。
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="構文を検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredReferences.map((ref) => (
          <Link key={ref.id} to={`/reference/${ref.id}`}>
            <Card className={cn(
              "h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {ref.title}
                  {ref.isBigQuerySpecific && (
                    <Badge variant="secondary" className="text-xs">BQ</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ref.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredReferences.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          該当する構文が見つかりませんでした
        </div>
      )}
    </div>
  );
}
