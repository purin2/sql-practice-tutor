import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProgress } from '@/contexts/ProgressContext';
import { DIFFICULTY_LABELS, CATEGORY_LABELS, type Problem } from '@/types';

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const { progress } = useProgress();
  const isCompleted = progress.completedProblems.includes(problem.id);

  return (
    <Link to={`/problem/${problem.id}`}>
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base font-medium leading-tight">
              {problem.title}
            </CardTitle>
            {isCompleted && (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant={problem.difficulty}>
              {DIFFICULTY_LABELS[problem.difficulty]}
            </Badge>
            <Badge variant="outline">
              {CATEGORY_LABELS[problem.category]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">
            {problem.description}
          </CardDescription>
          <div className="mt-3 text-xs text-muted-foreground">
            使用テーブル: {problem.requiredTables.join(', ')}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
