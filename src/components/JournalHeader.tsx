import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import Icon from '@/components/ui/icon';

interface JournalHeaderProps {
  activePlansCount: number;
  onCreatePlan: () => void;
}

export function JournalHeader({ activePlansCount, onCreatePlan }: JournalHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Icon name="TrendingUp" className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Торговый журнал</h1>
            <p className="text-sm text-muted-foreground">R-Анализ и трекер производительности</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 p-0"
          >
            <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="text-muted-foreground">
            <Icon name="Clock" className="h-3 w-3 mr-1" />
            {activePlansCount} Активных планов
          </Badge>
          <Button 
            onClick={onCreatePlan}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Создать план
          </Button>
        </div>
      </div>
    </header>
  );
}