import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Lightbulb, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Hint } from '@/types';
import { cn } from '@/lib/utils';

interface HintSectionProps {
  hints: Hint[];
  answer: string;
  relatedSyntax: string[];
}

const HINT_TYPE_LABELS: Record<Hint['type'], string> = {
  table: 'テーブル',
  clause: 'SQL句',
  structure: '構造',
  tip: 'ヒント',
};

export function HintSection({ hints, answer, relatedSyntax }: HintSectionProps) {
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleHint = (level: number) => {
    setRevealedHints((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleShowAnswer = () => {
    if (!showAnswer) {
      const confirmed = window.confirm(
        '本当に答えを見ますか？\n\n自分で考えることで理解が深まります。'
      );
      if (confirmed) {
        setShowAnswer(true);
      }
    } else {
      setShowAnswer(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hints */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            ヒント
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {hints.map((hint) => {
            const isRevealed = revealedHints.includes(hint.level);
            return (
              <div
                key={hint.level}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleHint(hint.level)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-sm">
                    ヒント {hint.level}
                    <span className="ml-2 text-muted-foreground text-xs">
                      ({HINT_TYPE_LABELS[hint.type]})
                    </span>
                  </span>
                  {isRevealed ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isRevealed ? 'max-h-40' : 'max-h-0'
                  )}
                >
                  <div className="p-3 pt-0 text-sm text-muted-foreground border-t">
                    {hint.content}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Related Syntax */}
      {relatedSyntax.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">関連するSQL構文</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {relatedSyntax.map((syntax) => (
                <Link
                  key={syntax}
                  to={`/reference/${syntax}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  {syntax.toUpperCase()}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            解答
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAnswer ? (
            <div className="space-y-3">
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">
                {answer}
              </pre>
              <Button variant="outline" size="sm" onClick={handleShowAnswer}>
                解答を隠す
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">
                まずはヒントを参考に自分で考えてみましょう
              </p>
              <Button variant="outline" onClick={handleShowAnswer}>
                答えを見る
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
