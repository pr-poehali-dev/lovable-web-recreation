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
  const [windowSize, setWindowSize] = useState(30);
  const [displayMode, setDisplayMode] = useState<'R' | 'percent'>('R');

  const curveData = useMemo(() => {
    if (executedTrades.length === 0) return [];

    const sortedTrades = [...executedTrades].sort((a, b) => a.executedAt - b.executedAt);
    let cumulativeR = 0;
    
    return sortedTrades.map((trade, index) => {
      cumulativeR += trade.actualR;
      
      // Calculate rolling expectancy
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
    
    // Find max drawdown
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

    // Calculate win streaks
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
    const minR = Math.min(...curveData.map(p => p.cumulativeR));
    const range = Math.max(maxR - minR, 1);
    
    const maxExp = Math.max(...curveData.map(p => p.rollingExpectancy));
    const minExp = Math.min(...curveData.map(p => p.rollingExpectancy));
    const expRange = Math.max(maxExp - minExp, 0.1);
    
    const width = 800;
    const height = 200;
    const margin = 40;
    
    return (
      <div className="relative">
        <svg width="100%" height={height + margin * 2} viewBox={`0 0 ${width} ${height + margin * 2}`} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width={width} height={height} x="0" y={margin} fill="url(#grid)" />
          
          {/* Zero line */}
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
          
          {/* Equity curve */}
          <polyline
            fill="none"
            stroke="hsl(var(--profit))"
            strokeWidth="2"
            points={curveData.map((point, index) => {
              const x = (index / (curveData.length - 1)) * width;
              const y = margin + height - ((point.cumulativeR - minR) / range) * height;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Rolling expectancy line */}
          <polyline
            fill="none"
            stroke="hsl(var(--chart-2))"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            opacity="0.7"
            points={curveData.map((point, index) => {
              const x = (index / (curveData.length - 1)) * width;
              const y = margin + height - ((point.rollingExpectancy - minExp) / expRange) * height * 0.3 - height * 0.7;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Win/Loss markers */}
          {curveData.map((point, index) => {
            const x = (index / (curveData.length - 1)) * width;
            const y = margin + height - ((point.cumulativeR - minR) / range) * height;
            const isWin = point.trade.actualR > 0;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={isWin ? 'hsl(var(--profit))' : 'hsl(var(--loss))'}
                opacity="0.6"
              />
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-profit"></div>
            <span>Кривая капитала</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-chart-2 border-dashed border-t"></div>
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
              className="px-3 py-1 text-sm bg-background border border-border rounded"
            >
              <option value={10}>10 сделок</option>
              <option value={20}>20 сделок</option>
              <option value={30}>30 сделок</option>
              <option value={50}>50 сделок</option>
            </select>
            <Button 
              size="sm" 
              variant={displayMode === 'percent' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('percent')}
            >
              %
            </Button>
            <Button 
              size="sm" 
              variant={displayMode === 'R' ? 'default' : 'outline'}
              onClick={() => setDisplayMode('R')}
            >
              R
            </Button>
          </div>
        </div>
        
        {stats && (
          <div className="flex items-center gap-4 text-sm">
            <span>
              Текущее ожидание: 
              <strong className={stats.currentExpectancy >= 0 ? 'text-profit ml-1' : 'text-loss ml-1'}>
                {stats.currentExpectancy > 0 ? '+' : ''}{stats.currentExpectancy.toFixed(3)}R
              </strong>
            </span>
            <Badge variant="secondary" className={stats.currentExpectancy >= 0 ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}>
              {stats.trend === 'improving' ? 'Улучшается' : 'Ухудшается'}
            </Badge>
            <span className="text-muted-foreground">
              Макс. просадка: <strong className="text-loss">{stats.maxDrawdown.toFixed(2)}R</strong>
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className={`text-lg font-bold ${stats.totalR >= 0 ? 'text-profit' : 'text-loss'}`}>
                {stats.totalR > 0 ? '+' : ''}{stats.totalR.toFixed(1)}R
              </div>
              <div className="text-xs text-muted-foreground">Общий результат</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-profit">
                {stats.maxWinStreak}
              </div>
              <div className="text-xs text-muted-foreground">Макс. винстрик</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-loss">
                {stats.maxLossStreak}
              </div>
              <div className="text-xs text-muted-foreground">Макс. лоссстрик</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-loss">
                {stats.maxDrawdown.toFixed(1)}R
              </div>
              <div className="text-xs text-muted-foreground">Макс. просадка</div>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-4 bg-muted/10 rounded-lg text-sm">
          <h4 className="font-semibold mb-2">Как читать график:</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Каждая точка представляет результат сделки</li>
            <li>• Сплошная линия показывает кумулятивную производительность</li>
            <li>• Пунктирная линия - скользящее среднее ожидание</li>
            <li>• Ищите последовательные паттерны роста и периоды просадок</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}