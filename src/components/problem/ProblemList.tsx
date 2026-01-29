import { useState } from 'react';
import { ProblemCard } from './ProblemCard';
import { Button } from '@/components/ui/button';
import { CATEGORY_LABELS, type Problem, type Category } from '@/types';
import { cn } from '@/lib/utils';

interface ProblemListProps {
  problems: Problem[];
}

const categories: (Category | 'all')[] = ['all', 'basic', 'aggregation', 'analysis', 'segmentation'];

export function ProblemList({ problems }: ProblemListProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filteredProblems = selectedCategory === 'all'
    ? problems
    : problems.filter((p) => p.category === selectedCategory);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={cn(
              selectedCategory === category && 'bg-primary text-primary-foreground'
            )}
          >
            {category === 'all' ? 'すべて' : CATEGORY_LABELS[category]}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          このカテゴリには問題がありません
        </div>
      )}
    </div>
  );
}
