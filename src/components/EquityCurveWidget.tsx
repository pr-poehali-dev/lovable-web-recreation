import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface EquityCurveWidgetProps {
  executedTrades: ExecutedTrade[];
}

interface CurvePoint {
  tradeNumber: number;
  cumulativeR: number;
  rollingExpectancy: number;
  trade: ExecutedTrade;
}

export function EquityCurveWidget({ executedTrades }: EquityCurveWidgetProps) {
  const [windowSize, setWindowSize] = useState(10);
  const [displayMode, setDisplayMode] = useState<'R' | 'percent'>('R');

  const curveData = useMemo(() => {
    if (executedTrades.length === 0) return [];

    const sortedTrades = [...executedTrades].sort((a, b) => a.executedAt - b.executedAt);
    let cumulativeR = 0;
    
    return sortedTrades.map((trade, index) => {
      cumulativeR += trade.actualR;
      
      const windowStart = Math.max(0, index - windowSize + 1);
      const windowTrades = sortedTrades.slice(windowStart, index + 1);
      const rollingExpectancy = windowTrades.reduce((sum, t) => sum + t.actualR, 0) / windowTrades.length;
      
      return {
        tradeNumber: index + 1,
        cumulativeR,
        rollingExpectancy,
        trade
      };
    });
  }, [executedTrades, windowSize]);

  const stats = useMemo(() => {
    if (curveData.length === 0) return null;
    
    const finalPoint = curveData[curveData.length - 1];
    const currentExpectancy = finalPoint.rollingExpectancy;
    
    let peak = 0;
    let maxDrawdown = 0;
    let currentDrawdown = 0;
    
    curveData.forEach(point => {
      if (point.cumulativeR > peak) {
        peak = point.cumulativeR;
        currentDrawdown = 0;
      } else {
        currentDrawdown = peak - point.cumulativeR;
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown;
        }
      }
    });

    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    
    curveData.forEach(point => {
      if (point.trade.actualR > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      }
    });
    
    return {
      totalR: finalPoint.cumulativeR,
      currentExpectancy,
      maxDrawdown,
      maxWinStreak,
      maxLossStreak,
      trend: currentExpectancy > 0 ? 'improving' : 'deteriorating'
    };
  }, [curveData]);

  const renderChart = () => {
    if (curveData.length === 0) {
      return (
        <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Icon name="TrendingUp" className="h-12 w-12 mx-auto mb-2" />
            <p>График кривой капитала</p>
            <p className="text-xs">Добавьте сделки для отображения кривой</p>
          </div>
        </div>
      );
    }

    const maxR = Math.max(...curveData.map(p => p.cumulativeR));
    const minR = Math.min(...curveData.map(p => p.cumulativeR), 0);
    const range = Math.max(maxR - minR, 1);
    
    const width = 800;
    const height = 200;
    const margin = 40;
    
    return (
      <div className="relative">
        <svg width="100%" height={height + margin * 2} viewBox={`0 0 ${width} ${height + margin * 2}`} className="overflow-visible">
          <defs>
            <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width={width} height={height} x="0" y={margin} fill="url(#grid)" />
          
          <line
            x1="0"
            y1={margin + height - ((0 - minR) / range) * height}
            x2={width}
            y2={margin + height - ((0 - minR) / range) * height}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="5,5"
          />
          
          <polyline
            fill="none"
            stroke="hsl(var(--profit))"
            strokeWidth="2.5"
            points={curveData.map((point, index) => {
              const x = (index / Math.max(curveData.length - 1, 1)) * width;
              const y = margin + height - ((point.cumulativeR - minR) / range) * height;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          <polyline
            fill="none"
            stroke="#eab308"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.8"
            points={curveData.map((point, index) => {
              const x = (index / Math.max(curveData.length - 1, 1)) * width;
              const cumulativeExp = curveData.slice(0, index + 1).reduce((sum, p) => sum + p.rollingExpectancy, 0);
              const y = margin + height - ((cumulativeExp - minR) / range) * height;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {curveData.map((point, index) => {
            const x = (index / Math.max(curveData.length - 1, 1)) * width;
            const y = margin + height - ((point.cumulativeR - minR) / range) * height;
            const isWin = point.trade.actualR > 0;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={isWin ? 'hsl(var(--profit))' : 'hsl(var(--loss))'}
                opacity="0.6"
              />
            );
          })}
        </svg>
        
        <div className="flex items-center gap-4 text-sm mt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-profit"></div>
            <span>Кривая капитала</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="24" height="4" className="inline-block">
              <line x1="0" y1="2" x2="24" y2="2" stroke="#eab308" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            <span>Скользящее ожидание ({windowSize})</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Кривая капитала</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              График баланса + скользящее ожидание
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={windowSize}
              onChange={(e) => setWindowSize(Number(e.target.value))}
              className="px-3 py-2 text-sm bg-background border border-border rounded"
            >
              <option value={5}>5 сделок</option>
              <option value={10}>10 сделок</option>
              <option value={20}>20 сделок</option>
              <option value={30}>30 сделок</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisplayMode(displayMode === 'R' ? 'percent' : 'R')}
            >
              {displayMode === 'R' ? 'R' : '%'}
            </Button>
          </div>
        </div>
        
        {stats && (
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="text-muted-foreground">Текущее ожидание:</span>
              <span className={`ml-2 font-bold ${stats.currentExpectancy >= 0 ? 'text-profit' : 'text-loss'}`}>
                {stats.currentExpectancy > 0 ? '+' : ''}{stats.currentExpectancy.toFixed(3)}R
              </span>
              <Badge variant="outline" className="ml-2 text-xs">
                {stats.trend === 'improving' ? 'Улучшается' : 'Ухудшается'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Макс. просадка:</span>
              <span className="ml-2 font-bold text-loss">
                {stats.maxDrawdown.toFixed(1)}R
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
        
        {stats && (
          <div className="mt-6 grid grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-profit">+{stats.totalR.toFixed(1)}R</div>
              <div className="text-xs text-muted-foreground">Общий результат</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold">{stats.maxWinStreak}</div>
              <div className="text-xs text-muted-foreground">Макс. винстрик</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold">{stats.maxLossStreak}</div>
              <div className="text-xs text-muted-foreground">Макс. лосстрик</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-loss">{stats.maxDrawdown.toFixed(1)}R</div>
              <div className="text-xs text-muted-foreground">Макс. просадка</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
