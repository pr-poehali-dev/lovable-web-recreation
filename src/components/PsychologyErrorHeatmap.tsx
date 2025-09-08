import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface PsychologyErrorHeatmapProps {
  executedTrades: ExecutedTrade[];
}

interface PsychCell {
  setup: string;
  session: string;
  errorRate: number;
  totalTrades: number;
  errorCount: number;
  dominantError: string;
}

interface ErrorAnalysis {
  setup: string;
  session: string;
  totalTrades: number;
  errorTrades: number;
  errorRate: number;
  errorBreakdown: { [key: string]: number };
  avgR: number;
  recommendation: string;
}

const PSYCHOLOGY_TAGS = [
  {
    name: 'Perfect Execution',
    description: 'Идеальное исполнение плана без нарушений',
    color: 'green',
    category: 'good'
  },
  {
    name: 'Rule Break: Entry',
    description: 'Нарушение правил входа в сделку',
    color: 'red',
    category: 'bad'
  },
  {
    name: 'Rule Break: Size',
    description: 'Нарушение правил управления капиталом',
    color: 'red',
    category: 'bad'
  },
  {
    name: 'Revenge Trade',
    description: 'Сделка из мести после убытка',
    color: 'red',
    category: 'bad'
  },
  {
    name: 'Missed Trade',
    description: 'Пропущенный торговый сигнал',
    color: 'orange',
    category: 'neutral'
  },
  {
    name: 'Early Exit',
    description: 'Ранний выход из прибыльной позиции',
    color: 'orange',
    category: 'neutral'
  },
  {
    name: 'Hoped Hope',
    description: 'Удержание убыточной позиции слишком долго',
    color: 'red',
    category: 'bad'
  },
  {
    name: 'Averaging Down',
    description: 'Добавление к убыточной позиции',
    color: 'red',
    category: 'bad'
  }
];

export function PsychologyErrorHeatmap({ executedTrades }: PsychologyErrorHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<ErrorAnalysis | null>(null);

  const { heatmapData, setups, sessions } = useMemo(() => {
    const setupSet = new Set<string>();
    const sessionSet = new Set<string>();
    const cellData = new Map<string, { trades: ExecutedTrade[], errors: string[], totalR: number }>();

    executedTrades.forEach(trade => {
      setupSet.add(trade.setup);
      sessionSet.add(trade.session);
      
      const key = `${trade.setup}-${trade.session}`;
      if (!cellData.has(key)) {
        cellData.set(key, { trades: [], errors: [], totalR: 0 });
      }
      
      const cell = cellData.get(key)!;
      cell.trades.push(trade);
      cell.totalR += trade.actualR;
      
      // Count errors (anything except Perfect Execution)
      trade.psychologyTags.forEach(tag => {
        if (tag !== 'Perfect Execution') {
          cell.errors.push(tag);
        }
      });
    });

    const setups = Array.from(setupSet).sort();
    const sessions = Array.from(sessionSet).sort();
    
    const heatmapData: PsychCell[][] = setups.map(setup =>
      sessions.map(session => {
        const key = `${setup}-${session}`;
        const cell = cellData.get(key);
        
        if (!cell || cell.trades.length === 0) {
          return {
            setup,
            session,
            errorRate: 0,
            totalTrades: 0,
            errorCount: 0,
            dominantError: ''
          };
        }
        
        const errorTrades = cell.trades.filter(t => 
          t.psychologyTags.some(tag => tag !== 'Perfect Execution')
        ).length;
        
        const errorRate = (errorTrades / cell.trades.length) * 100;
        
        // Find most common error
        const errorCounts: { [key: string]: number } = {};
        cell.errors.forEach(error => {
          errorCounts[error] = (errorCounts[error] || 0) + 1;
        });
        
        const dominantError = Object.entries(errorCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '';
        
        return {
          setup,
          session,
          errorRate,
          totalTrades: cell.trades.length,
          errorCount: errorTrades,
          dominantError
        };
      })
    );

    return { heatmapData, setups, sessions };
  }, [executedTrades]);

  const getCellColor = (errorRate: number, totalTrades: number) => {
    if (totalTrades === 0) return 'bg-muted/30 text-muted-foreground';
    if (errorRate === 0) return 'bg-green-600 text-white'; // Perfect
    if (errorRate < 20) return 'bg-green-500 text-white'; // Clean
    if (errorRate < 50) return 'bg-yellow-600 text-white'; // Some issues
    if (errorRate < 80) return 'bg-red-600 text-white'; // Many issues
    return 'bg-red-700 text-white'; // Critical
  };

  const handleCellClick = (cell: PsychCell) => {
    if (cell.totalTrades === 0) return;

    const tradesInCell = executedTrades.filter(t => 
      t.setup === cell.setup && t.session === cell.session
    );
    
    const errorTrades = tradesInCell.filter(t => 
      t.psychologyTags.some(tag => tag !== 'Perfect Execution')
    );

    const errorBreakdown: { [key: string]: number } = {};
    errorTrades.forEach(trade => {
      trade.psychologyTags.forEach(tag => {
        if (tag !== 'Perfect Execution') {
          errorBreakdown[tag] = (errorBreakdown[tag] || 0) + 1;
        }
      });
    });

    const avgR = tradesInCell.reduce((sum, t) => sum + t.actualR, 0) / tradesInCell.length;
    
    let recommendation = '';
    if (cell.errorRate > 50) {
      recommendation = 'Высокая частота ошибок в этой комбинации. Рассмотрите дополнительную подготовку для этого сетапа в данной сессии.';
    } else if (cell.errorRate > 20) {
      recommendation = 'Умеренная частота ошибок. Обратите внимание на типичные ошибки и работайте над их устранением.';
    } else {
      recommendation = 'Хорошая дисциплина в этой комбинации. Продолжайте следовать установленным правилам.';
    }

    const analysis: ErrorAnalysis = {
      setup: cell.setup,
      session: cell.session,
      totalTrades: cell.totalTrades,
      errorTrades: cell.errorCount,
      errorRate: cell.errorRate,
      errorBreakdown,
      avgR,
      recommendation
    };

    setSelectedCell(analysis);
  };

  return (
    <>
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Карта психологических ошибок</CardTitle>
          <p className="text-sm text-muted-foreground">
            Визуализация частоты ошибок по сетапам и сессиям
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-[150px_repeat(4,1fr)] gap-1 mb-1">
                  <div className="text-sm font-medium text-center py-2">Сетап</div>
                  {sessions.map(session => (
                    <div key={session} className="text-sm font-medium text-center py-2">
                      {session}
                    </div>
                  ))}
                </div>
                
                {/* Data Rows */}
                {heatmapData.map((row, setupIndex) => (
                  <div key={setups[setupIndex]} className="grid grid-cols-[150px_repeat(4,1fr)] gap-1 mb-1">
                    <div className="text-sm font-medium flex items-center px-2 py-3 bg-muted/20 rounded">
                      {setups[setupIndex]}
                    </div>
                    {row.map((cell) => (
                      <button
                        key={`${cell.setup}-${cell.session}`}
                        className={`
                          px-3 py-3 rounded text-sm font-medium transition-all cursor-pointer hover:ring-2 hover:ring-white/20
                          ${getCellColor(cell.errorRate, cell.totalTrades)}
                        `}
                        onClick={() => handleCellClick(cell)}
                      >
                        <div className="text-center">
                          {cell.totalTrades > 0 ? (
                            <>
                              <div className="font-bold">
                                {cell.errorRate.toFixed(0)}%
                              </div>
                              <div className="text-xs opacity-80">
                                {cell.errorCount}/{cell.totalTrades}
                              </div>
                            </>
                          ) : (
                            <div className="text-muted-foreground">-</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>Чисто (0%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                <span>Немного (&lt;20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>Много (20-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-700 rounded"></div>
                <span>Критично (&gt;50%)</span>
              </div>
              <div className="ml-4 text-muted-foreground">
                Кликните на ячейку для подробного анализа ошибок в этой комбинации
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Modal */}
      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Анализ психологических ошибок</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Сетап: {selectedCell?.setup} | Сессия: {selectedCell?.session}
            </p>
          </DialogHeader>
          
          {selectedCell && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {selectedCell.errorTrades}
                  </div>
                  <div className="text-sm text-muted-foreground">Сделок с ошибками</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold">
                    {selectedCell.totalTrades}
                  </div>
                  <div className="text-sm text-muted-foreground">Всего сделок</div>
                </div>
                <div className="text-2xl font-bold text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-red-500">
                    {selectedCell.errorRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Частота ошибок</div>
                </div>
              </div>

              {/* Error Breakdown */}
              <div>
                <h4 className="font-semibold mb-3">Типы психологических ошибок:</h4>
                <div className="space-y-2">
                  {Object.entries(selectedCell.errorBreakdown).map(([errorType, count]) => {
                    const tag = PSYCHOLOGY_TAGS.find(t => t.name === errorType);
                    const percentage = ((count / selectedCell.errorTrades) * 100).toFixed(1);
                    
                    return (
                      <div key={errorType} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-3 h-3 rounded-full ${
                              tag?.color === 'red' ? 'bg-red-500' : 
                              tag?.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'
                            }`} 
                          />
                          <div>
                            <div className="font-medium">{errorType}</div>
                            {tag && (
                              <div className="text-xs text-muted-foreground">
                                {tag.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{count}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-400">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                      Рекомендации:
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      {selectedCell.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}