import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface RAnalysisHeatmapProps {
  executedTrades: ExecutedTrade[];
  onFilterChange: (filteredTrades: ExecutedTrade[]) => void;
}

interface HeatmapCell {
  setup: string;
  session: string;
  avgR: number;
  totalTrades: number;
  winRate: number;
  isFiltered: boolean;
}

export function RAnalysisHeatmap({ executedTrades, onFilterChange }: RAnalysisHeatmapProps) {
  const [filteredCells, setFilteredCells] = useState<Set<string>>(new Set());
  
  const { heatmapData, setups, sessions } = useMemo(() => {
    const setupSet = new Set<string>();
    const sessionSet = new Set<string>();
    const cellData = new Map<string, { trades: ExecutedTrade[], totalR: number, wins: number }>();

    executedTrades.forEach(trade => {
      setupSet.add(trade.setup);
      sessionSet.add(trade.session);
      
      const key = `${trade.setup}-${trade.session}`;
      if (!cellData.has(key)) {
        cellData.set(key, { trades: [], totalR: 0, wins: 0 });
      }
      
      const cell = cellData.get(key)!;
      cell.trades.push(trade);
      cell.totalR += trade.actualR;
      if (trade.actualR > 0) cell.wins++;
    });

    const setups = Array.from(setupSet).sort();
    const sessions = Array.from(sessionSet).sort();
    
    const heatmapData: HeatmapCell[][] = setups.map(setup =>
      sessions.map(session => {
        const key = `${setup}-${session}`;
        const cell = cellData.get(key);
        const isFiltered = filteredCells.has(key);
        
        if (!cell) {
          return {
            setup,
            session,
            avgR: 0,
            totalTrades: 0,
            winRate: 0,
            isFiltered
          };
        }
        
        return {
          setup,
          session,
          avgR: cell.totalR / cell.trades.length,
          totalTrades: cell.trades.length,
          winRate: (cell.wins / cell.trades.length) * 100,
          isFiltered
        };
      })
    );

    return { heatmapData, setups, sessions };
  }, [executedTrades, filteredCells]);

  const toggleCellFilter = (setup: string, session: string) => {
    const key = `${setup}-${session}`;
    const newFilteredCells = new Set(filteredCells);
    
    if (newFilteredCells.has(key)) {
      newFilteredCells.delete(key);
    } else {
      newFilteredCells.add(key);
    }
    
    setFilteredCells(newFilteredCells);
    
    // Apply filter to trades
    const filteredTrades = executedTrades.filter(trade => {
      const tradeKey = `${trade.setup}-${trade.session}`;
      return !newFilteredCells.has(tradeKey);
    });
    
    onFilterChange(filteredTrades);
  };

  const clearAllFilters = () => {
    setFilteredCells(new Set());
    onFilterChange(executedTrades);
  };

  const getCellColor = (avgR: number, totalTrades: number) => {
    if (totalTrades === 0) return 'bg-muted/30';
    if (avgR >= 2) return 'bg-profit';
    if (avgR >= 1) return 'bg-green-600';
    if (avgR >= 0) return 'bg-green-500';
    if (avgR >= -1) return 'bg-red-500';
    return 'bg-loss';
  };

  const hiddenTradesCount = executedTrades.length - executedTrades.filter(trade => {
    const tradeKey = `${trade.setup}-${trade.session}`;
    return !filteredCells.has(tradeKey);
  }).length;

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>R-Анализ по Сетапам и Сессиям</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Интерактивная тепловая карта производительности
            </p>
          </div>
          {filteredCells.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-600">
                Активные фильтры: {Array.from(filteredCells).map(key => {
                  const [setup, session] = key.split('-');
                  return `${setup} × ${session}`;
                }).join(', ')} ({hiddenTradesCount} сделок скрыто)
              </Badge>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <Icon name="X" className="h-4 w-4 mr-1" />
                Очистить фильтры
              </Button>
            </div>
          )}
        </div>
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
                  {row.map((cell, sessionIndex) => (
                    <button
                      key={`${cell.setup}-${cell.session}`}
                      className={`
                        relative px-3 py-3 rounded text-white text-sm font-medium transition-all cursor-pointer
                        ${getCellColor(cell.avgR, cell.totalTrades)}
                        ${cell.isFiltered ? 'opacity-30 ring-2 ring-orange-500' : 'hover:ring-2 ring-white/20'}
                      `}
                      onClick={() => toggleCellFilter(cell.setup, cell.session)}
                    >
                      <div className="text-center">
                        {cell.totalTrades > 0 ? (
                          <>
                            <div className="font-bold">
                              {cell.avgR > 0 ? '+' : ''}{cell.avgR.toFixed(1)}
                            </div>
                            <div className="text-xs opacity-80">
                              {cell.totalTrades}
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
              <div className="w-4 h-4 bg-loss rounded"></div>
              <span>Poor (-2R+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <span>Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-profit rounded"></div>
              <span>Excellent (+2R+)</span>
            </div>
            <div className="ml-4 text-muted-foreground">
              Click cells to filter trades
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}