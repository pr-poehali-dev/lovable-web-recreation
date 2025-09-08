import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface PsychologyHeatmapProps {
  executedTrades: ExecutedTrade[];
}

interface PsychologyCell {
  setup: string;
  session: string;
  errorRate: number;
  total: number;
  errors: number;
  errorTypes: { [key: string]: number };
}

interface AnalysisModalData {
  setup: string;
  session: string;
  errorRate: number;
  total: number;
  errors: number;
  errorTypes: { [key: string]: number };
  avgR: number;
  avgRWithErrors: number;
}

export function PsychologyHeatmap({ executedTrades }: PsychologyHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<AnalysisModalData | null>(null);

  const { heatmapData, sessions, setups } = useMemo(() => {
    const sessionsSet = new Set<string>();
    const setupsSet = new Set<string>();
    const cellStats: Record<string, { 
      total: number; 
      totalR: number;
      errorTrades: ExecutedTrade[]; 
      errorTypes: { [key: string]: number };
    }> = {};

    executedTrades.forEach(trade => {
      sessionsSet.add(trade.session);
      setupsSet.add(trade.setup);
      
      const key = `${trade.setup}-${trade.session}`;
      if (!cellStats[key]) {
        cellStats[key] = { total: 0, totalR: 0, errorTrades: [], errorTypes: {} };
      }
      
      cellStats[key].total++;
      cellStats[key].totalR += trade.actualR;
      
      // Check for psychological errors (exclude Perfect Execution)
      const hasErrors = trade.psychologyTags.some(tag => tag !== 'Perfect Execution');
      if (hasErrors) {
        cellStats[key].errorTrades.push(trade);
        trade.psychologyTags.forEach(tag => {
          if (tag !== 'Perfect Execution') {
            cellStats[key].errorTypes[tag] = (cellStats[key].errorTypes[tag] || 0) + 1;
          }
        });
      }
    });

    const sessions = Array.from(sessionsSet).sort();
    const setups = Array.from(setupsSet).sort();

    const heatmapData: PsychologyCell[] = [];
    
    setups.forEach(setup => {
      sessions.forEach(session => {
        const key = `${setup}-${session}`;
        const stats = cellStats[key];
        
        if (stats && stats.total > 0) {
          const errorRate = (stats.errorTrades.length / stats.total) * 100;
          heatmapData.push({
            setup,
            session,
            errorRate: Number(errorRate.toFixed(0)),
            total: stats.total,
            errors: stats.errorTrades.length,
            errorTypes: stats.errorTypes
          });
        } else {
          heatmapData.push({
            setup,
            session,
            errorRate: 0,
            total: 0,
            errors: 0,
            errorTypes: {}
          });
        }
      });
    });

    return { heatmapData, sessions, setups };
  }, [executedTrades]);

  const getCellColor = (errorRate: number, total: number) => {
    if (total === 0) return 'bg-muted/50';
    
    if (errorRate === 0) return 'bg-green-600'; // Чисто (0%)
    if (errorRate <= 20) return 'bg-green-500'; // Немного (<20%)
    if (errorRate <= 50) return 'bg-yellow-500'; // Много (20-50%)
    return 'bg-red-500'; // Критично (>50%)
  };

  const getCellTextColor = (total: number) => {
    if (total === 0) return 'text-muted-foreground';
    return 'text-white';
  };

  const openAnalysis = (cell: PsychologyCell) => {
    if (cell.total === 0) return;
    
    // Calculate additional metrics for the modal
    const relevantTrades = executedTrades.filter(
      trade => trade.setup === cell.setup && trade.session === cell.session
    );
    
    const avgR = relevantTrades.length > 0 
      ? relevantTrades.reduce((sum, trade) => sum + trade.actualR, 0) / relevantTrades.length
      : 0;
    
    const errorTrades = relevantTrades.filter(trade => 
      trade.psychologyTags.some(tag => tag !== 'Perfect Execution')
    );
    
    const avgRWithErrors = errorTrades.length > 0
      ? errorTrades.reduce((sum, trade) => sum + trade.actualR, 0) / errorTrades.length
      : 0;

    setSelectedCell({
      ...cell,
      avgR: Number(avgR.toFixed(2)),
      avgRWithErrors: Number(avgRWithErrors.toFixed(2))
    });
  };

  const getErrorTypeColor = (errorType: string) => {
    switch (errorType) {
      case 'Rule Break: Entry': return 'bg-red-500';
      case 'Rule Break: Size': return 'bg-red-600';
      case 'Revenge Trade': return 'bg-red-700';
      case 'Hoped Hope': return 'bg-red-400';
      case 'Averaging Down': return 'bg-red-500';
      case 'Early Exit': return 'bg-orange-500';
      case 'Missed Trade': return 'bg-orange-400';
      default: return 'bg-gray-500';
    }
  };

  const getRecommendations = (cell: AnalysisModalData) => {
    const recommendations = [];
    
    if (cell.errorRate > 50) {
      recommendations.push('⚠️ Высокая частота ошибок в этой комбинации. Рассмотрите дополнительную подготовку для этого сетапа в данной сессии.');
    }
    
    if (cell.errorTypes['Revenge Trade'] > 0) {
      recommendations.push('🔥 Обнаружены сделки из мести. Делайте перерывы после убыточных сделок.');
    }
    
    if (cell.errorTypes['Rule Break: Size'] > 0) {
      recommendations.push('💰 Проблемы с управлением капиталом. Автоматизируйте расчет размера позиции.');
    }
    
    if (cell.errorTypes['Early Exit'] > 0) {
      recommendations.push('⏰ Ранние выходы из прибыли. Работайте над терпением и следованием плану.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ Хорошие показатели дисциплины в этой комбинации.');
    }
    
    return recommendations;
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
                          onClick={() => openAnalysis(cell)}
                          className={`
                            p-3 rounded-lg text-center transition-all duration-200 hover:scale-105 hover:shadow-lg
                            ${getCellColor(cell.errorRate, cell.total)}
                            ${getCellTextColor(cell.total)}
                            ${cell.total > 0 ? 'cursor-pointer' : 'cursor-default'}
                          `}
                        >
                          {cell.total > 0 ? (
                            <>
                              <div className="text-lg font-bold">{cell.errorRate}%</div>
                              <div className="text-xs opacity-80">{cell.errors}/{cell.total}</div>
                            </>
                          ) : (
                            <div className="text-sm">-</div>
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
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span>Чисто (0%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Немного (&lt;20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Много (20-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
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
              Сетап: <strong>{selectedCell?.setup}</strong> | Сессия: <strong>{selectedCell?.session}</strong>
            </p>
          </DialogHeader>
          
          {selectedCell && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{selectedCell.errors}</div>
                  <div className="text-sm text-muted-foreground">Сделок с ошибками</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedCell.total}</div>
                  <div className="text-sm text-muted-foreground">Всего сделок</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{selectedCell.errorRate}%</div>
                  <div className="text-sm text-muted-foreground">Частота ошибок</div>
                </div>
              </div>

              {/* Error Types */}
              <div>
                <h3 className="font-semibold mb-3">Типы психологических ошибок:</h3>
                <div className="space-y-2">
                  {Object.entries(selectedCell.errorTypes).map(([errorType, count]) => (
                    <div key={errorType} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getErrorTypeColor(errorType)}`} />
                        <div>
                          <div className="font-medium">{errorType}</div>
                          <div className="text-sm text-muted-foreground">
                            {/* Add descriptions based on error type */}
                            {errorType === 'Rule Break: Entry' && 'Закрытие прибыльной позиции слишком рано из-за страха'}
                            {errorType === 'Rule Break: Size' && 'Нарушение правил размера позиции или управления рисками'}
                            {errorType === 'Revenge Trade' && 'Сделка из мести после убытка'}
                            {errorType === 'Early Exit' && 'Ранний выход из прибыльной позиции'}
                            {errorType === 'Hoped Hope' && 'Удержание убыточной позиции слишком долго'}
                            {errorType === 'Averaging Down' && 'Добавление к убыточной позиции'}
                            {errorType === 'Missed Trade' && 'Пропущенный торговый сигнал'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{count}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {((count / selectedCell.total) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact on Results */}
              <div>
                <h3 className="font-semibold mb-3">Влияние на результат:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-card border text-center">
                    <div className="text-sm text-muted-foreground">Средний R (с ошибками)</div>
                    <div className={`text-xl font-bold ${selectedCell.avgRWithErrors >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {selectedCell.avgRWithErrors > 0 ? '+' : ''}{selectedCell.avgRWithErrors}R
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-card border text-center">
                    <div className="text-sm text-muted-foreground">Средний R (все сделки)</div>
                    <div className={`text-xl font-bold ${selectedCell.avgR >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {selectedCell.avgR > 0 ? '+' : ''}{selectedCell.avgR}R
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold mb-3">Рекомендации:</h3>
                <div className="space-y-2">
                  {getRecommendations(selectedCell).map((recommendation, index) => (
                    <div key={index} className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}