import { Link } from 'react-router-dom';
import { Database, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <Link to="/" className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">SQL Practice Tutor</span>
        </Link>

        <nav className="ml-6 hidden md:flex items-center space-x-4 text-sm font-medium">
          <Link to="/" className="text-foreground/60 hover:text-foreground transition-colors">
            練習問題
          </Link>
          <Link to="/schema" className="text-foreground/60 hover:text-foreground transition-colors">
            スキーマ
          </Link>
          <Link to="/reference" className="text-foreground/60 hover:text-foreground transition-colors">
            リファレンス
          </Link>
          <Link to="/progress" className="text-foreground/60 hover:text-foreground transition-colors">
            進捗
          </Link>
          <Link to="/guide" className="text-foreground/60 hover:text-foreground transition-colors">
            使い方
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="テーマ切り替え"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
