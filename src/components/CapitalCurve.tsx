import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface CapitalCurveProps {
  executedTrades: ExecutedTrade[];
}

export function CapitalCurve({ executedTrades }: CapitalCurveProps) {
  const { curveData, currentExpectation, trend } = useMemo(() => {
    const sortedTrades = [...executedTrades].sort((a, b) => a.executedAt - b.executedAt);
    
    let runningTotal = 0;
    const curveData = sortedTrades.map((trade, index) => {
      runningTotal += trade.actualR;
      const expectation = runningTotal / (index + 1);
      
      return {
        tradeNumber: index + 1,
        cumulativeR: Number(runningTotal.toFixed(2)),
        expectation: Number(expectation.toFixed(2)),
        trade
      };
    });
    
    const currentExpectation = curveData.length > 0 ? curveData[curveData.length - 1].expectation : 0;
    
    // Determine trend (last 10 trades vs previous 10)
    let trend = 'neutral';
    if (curveData.length >= 20) {
      const last10 = curveData.slice(-10);
      const previous10 = curveData.slice(-20, -10);
      
      const last10Avg = last10.reduce((sum, point) => sum + point.expectation, 0) / 10;
      const previous10Avg = previous10.reduce((sum, point) => sum + point.expectation, 0) / 10;
      
      if (last10Avg > previous10Avg + 0.1) trend = 'improving';
      else if (last10Avg < previous10Avg - 0.1) trend = 'declining';
    }
    
    return { curveData, currentExpectation, trend };
  }, [executedTrades]);

  const maxR = Math.max(...curveData.map(d => d.cumulativeR), 0);
  const minR = Math.min(...curveData.map(d => d.cumulativeR), 0);
  const range = maxR - minR || 10;

  const getPathData = () => {
    if (curveData.length === 0) return '';
    
    const width = 100; // percentage
    const height = 80; // percentage
    
    const points = curveData.map((point, index) => {
      const x = (index / (curveData.length - 1 || 1)) * width;
      const y = height - ((point.cumulativeR - minR) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const getExpectationPathData = () => {
    if (curveData.length === 0) return '';
    
    const width = 100;
    const height = 80;
    
    const points = curveData.map((point, index) => {
      const x = (index / (curveData.length - 1 || 1)) * width;
      const y = height - ((point.expectation - minR) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Кривая капитала</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              График баланса со скользящим ожиданием
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="bg-profit text-white">%</Button>
            <Button size="sm" variant="outline">R</Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>Текущее ожидание: <strong className={currentExpectation >= 0 ? "text-profit" : "text-loss"}>
            {currentExpectation.toFixed(2)}R
          </strong></span>
          <Badge variant="secondary" className={
            trend === 'improving' ? "bg-profit/10 text-profit" : 
            trend === 'declining' ? "bg-loss/10 text-loss" : 
            "bg-muted/10"
          }>
            {trend === 'improving' ? 'Улучшается' : 
             trend === 'declining' ? 'Ухудшается' : 
             'Стабильно'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {curveData.length > 0 ? (
          <div className="h-64 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              
              {/* Zero line */}
              {minR < 0 && maxR > 0 && (
                <line
                  x1="0"
                  y1={80 - ((-minR) / range) * 80}
                  x2="100"
                  y2={80 - ((-minR) / range) * 80}
                  stroke="currentColor"
                  strokeWidth="0.2"
                  opacity="0.3"
                  strokeDasharray="2,2"
                />
              )}
              
              {/* Expectation line */}
              <path
                d={getExpectationPathData()}
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth="0.5"
                opacity="0.6"
                strokeDasharray="2,2"
              />
              
              {/* Capital curve */}
              <path
                d={getPathData()}
                fill="none"
                stroke={currentExpectation >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                strokeWidth="0.8"
              />
              
              {/* Data points */}
              {curveData.map((point, index) => {
                const x = (index / (curveData.length - 1 || 1)) * 100;
                const y = 80 - ((point.cumulativeR - minR) / range) * 80;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="0.8"
                    fill={point.trade.actualR >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                    opacity="0.8"
                  />
                );
              })}
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-2">
              <div>{maxR.toFixed(1)}R</div>
              {minR < 0 && maxR > 0 && <div>0R</div>}
              <div>{minR.toFixed(1)}R</div>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-8 right-2 flex justify-between text-xs text-muted-foreground">
              <div>1</div>
              {curveData.length > 1 && <div>{curveData.length}</div>}
            </div>
          </div>
        ) : (
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Icon name="TrendingUp" className="h-12 w-12 mx-auto mb-2" />
              <p>График кривой капитала</p>
              <p className="text-xs">Интерактивная визуализация роста капитала</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}