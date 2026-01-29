import { Link, useLocation } from 'react-router-dom';
import { FileText, Database, BookOpen, BarChart3, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress } from '@/contexts/ProgressContext';
import type { Problem } from '@/types';

interface SidebarProps {
  problems: Problem[];
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: FileText, label: '練習問題' },
  { to: '/schema', icon: Database, label: 'スキーマ' },
  { to: '/reference', icon: BookOpen, label: 'リファレンス' },
  { to: '/progress', icon: BarChart3, label: '進捗' },
];

export function Sidebar({ problems, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { progress } = useProgress();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto py-4">
          {/* Navigation */}
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Problem List */}
          <div className="mt-6 px-3">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              練習問題
            </h3>
            <div className="space-y-1">
              {problems.slice(0, 10).map((problem) => {
                const isCompleted = progress.completedProblems.includes(problem.id);
                const isActive = location.pathname === `/problem/${problem.id}`;
                return (
                  <Link
                    key={problem.id}
                    to={`/problem/${problem.id}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {isCompleted && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    <span className="truncate">{problem.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
