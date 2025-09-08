import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface InteractiveHeatmapProps {
  executedTrades: ExecutedTrade[];
  onFiltersChange?: (filters: HeatmapFilter[]) => void;
}

interface HeatmapFilter {
  setup: string;
  session: string;
}

interface HeatmapCell {
  setup: string;
  session: string;
  avgR: number;
  total: number;
  isFiltered: boolean;
}

export function InteractiveHeatmap({ executedTrades, onFiltersChange }: InteractiveHeatmapProps) {
  const [activeFilters, setActiveFilters] = useState<HeatmapFilter[]>([]);

  const { heatmapData, sessions, setups } = useMemo(() => {
    const sessionsSet = new Set<string>();
    const setupsSet = new Set<string>();
    const cellStats: Record<string, { total: number; totalR: number; trades: ExecutedTrade[] }> = {};

    executedTrades.forEach(trade => {
      sessionsSet.add(trade.session);
      setupsSet.add(trade.setup);
      
      const key = `${trade.setup}-${trade.session}`;
      if (!cellStats[key]) {
        cellStats[key] = { total: 0, totalR: 0, trades: [] };
      }
      
      cellStats[key].total++;
      cellStats[key].totalR += trade.actualR;
      cellStats[key].trades.push(trade);
    });

    const sessions = Array.from(sessionsSet).sort();
    const setups = Array.from(setupsSet).sort();

    const heatmapData: HeatmapCell[] = [];
    
    setups.forEach(setup => {
      sessions.forEach(session => {
        const key = `${setup}-${session}`;
        const stats = cellStats[key];
        const isFiltered = activeFilters.some(f => f.setup === setup && f.session === session);
        
        heatmapData.push({
          setup,
          session,
          avgR: stats ? Number((stats.totalR / stats.total).toFixed(1)) : 0,
          total: stats ? stats.total : 0,
          isFiltered
        });
      });
    });

    return { heatmapData, sessions, setups };
  }, [executedTrades, activeFilters]);

  const toggleFilter = (setup: string, session: string) => {
    const existingFilterIndex = activeFilters.findIndex(
      f => f.setup === setup && f.session === session
    );

    let newFilters;
    if (existingFilterIndex >= 0) {
      newFilters = activeFilters.filter((_, index) => index !== existingFilterIndex);
    } else {
      newFilters = [...activeFilters, { setup, session }];
    }

    setActiveFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onFiltersChange?.([]);
  };

  const getCellColor = (avgR: number, total: number, isFiltered: boolean) => {
    if (total === 0) return 'bg-muted/50';
    if (isFiltered) return 'bg-muted/20 border-2 border-dashed border-muted-foreground/50';
    
    if (avgR >= 2) return 'bg-profit';
    if (avgR >= 0.5) return 'bg-green-600';
    if (avgR >= 0) return 'bg-green-500';
    if (avgR >= -1) return 'bg-red-500';
    return 'bg-loss';
  };

  const getCellTextColor = (avgR: number, total: number) => {
    if (total === 0) return 'text-muted-foreground';
    return 'text-white';
  };

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
          {activeFilters.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <Icon name="X" className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {filter.setup} × {filter.session}
              </Badge>
            ))}
            <span className="text-xs text-muted-foreground">
              ({activeFilters.length} trades hidden)
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `150px repeat(${sessions.length}, 1fr)` }}>
                <div className="text-sm font-medium text-muted-foreground">Сетап</div>
                {sessions.map(session => (
                  <div key={session} className="text-sm font-medium text-center text-muted-foreground">
                    {session}
                  </div>
                ))}
              </div>
              
              {/* Rows */}
              {setups.map(setup => (
                <div key={setup} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `150px repeat(${sessions.length}, 1fr)` }}>
                  <div className="flex items-center text-sm font-medium py-2">
                    {setup}
                  </div>
                  {sessions.map(session => {
                    const cell = heatmapData.find(c => c.setup === setup && c.session === session);
                    if (!cell) return null;
                    
                    return (
                      <button
                        key={session}
                        onClick={() => toggleFilter(setup, session)}
                        className={`
                          relative p-3 rounded-lg text-center transition-all duration-200 hover:scale-105 hover:shadow-lg
                          ${getCellColor(cell.avgR, cell.total, cell.isFiltered)}
                          ${getCellTextColor(cell.avgR, cell.total)}
                        `}
                      >
                        {cell.total > 0 ? (
                          <>
                            <div className="text-lg font-bold">{cell.avgR}</div>
                            <div className="text-xs opacity-80">{cell.total}</div>
                          </>
                        ) : (
                          <div className="text-sm">-</div>
                        )}
                        
                        {cell.isFiltered && (
                          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                            <Icon name="EyeOff" className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-loss"></div>
              <span>Poor (-2R+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted"></div>
              <span>Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-profit"></div>
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