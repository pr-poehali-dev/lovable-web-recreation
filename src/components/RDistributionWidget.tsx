import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutedTrade } from '@/hooks/useTradingPlans';

interface RDistributionWidgetProps {
  executedTrades: ExecutedTrade[];
}

interface RBucket {
  range: string;
  min: number;
  max: number;
  wins: number;
  losses: number;
  totalTrades: number;
  winRate: number;
  totalR: number;
}

export function RDistributionWidget({ executedTrades }: RDistributionWidgetProps) {
  const distributionData = useMemo(() => {
    if (executedTrades.length === 0) return [];

    // Define R buckets
    const buckets: RBucket[] = [
      { range: '-1.0R to -0.5R', min: -1.0, max: -0.5, wins: 0, losses: 0, totalTrades: 0, winRate: 0, totalR: 0 },
      { range: '0.5R to 1.0R', min: 0.5, max: 1.0, wins: 0, losses: 0, totalTrades: 0, winRate: 0, totalR: 0 },
      { range: '1.0R to 1.5R', min: 1.0, max: 1.5, wins: 0, losses: 0, totalTrades: 0, winRate: 0, totalR: 0 },
      { range: '1.5R to 2.0R', min: 1.5, max: 2.0, wins: 0, losses: 0, totalTrades: 0, winRate: 0, totalR: 0 },
      { range: '2.0R to 2.5R', min: 2.0, max: 2.5, wins: 0, losses: 0, totalTrades: 0, winRate: 0, totalR: 0 },
      { range: '2.5R to 3.0R', min: 2.5, max: 3.0, wins: 0, losses: 0, totalTrades: 0, winRate: 0, totalR: 0 },
      { range: '3.0R to 3.5R', min: 3.0, max: 3.5, wins: 0, losses: 0, totalTrades: 0, winRate: 0, totalR: 0 },
      { range: '3.5R to 4.0R', min: 3.5, max: 4.0, wins: 0, losses: 0, totalTrades: 0, winRate: 0, totalR: 0 }
    ];

    // Distribute trades into buckets
    executedTrades.forEach(trade => {
      const r = trade.actualR;
      
      // Find appropriate bucket
      let bucket: RBucket | undefined;
      
      if (r < -0.5) {
        bucket = buckets.find(b => b.min === -1.0);
      } else {
        bucket = buckets.find(b => r >= b.min && r < b.max);
      }
      
      if (bucket) {
        bucket.totalTrades++;
        bucket.totalR += r;
        if (r > 0) {
          bucket.wins++;
        } else {
          bucket.losses++;
        }
      }
    });

    // Calculate win rates
    buckets.forEach(bucket => {
      if (bucket.totalTrades > 0) {
        bucket.winRate = (bucket.wins / bucket.totalTrades) * 100;
      }
    });

    return buckets.filter(bucket => bucket.totalTrades > 0);
  }, [executedTrades]);

  const stats = useMemo(() => {
    if (executedTrades.length === 0) return null;
    
    const totalTrades = executedTrades.length;
    const totalPnL = executedTrades.reduce((sum, t) => sum + t.actualR, 0);
    const medianR = [...executedTrades].sort((a, b) => a.actualR - b.actualR)[Math.floor(totalTrades / 2)]?.actualR || 0;
    
    const profitableBuckets = distributionData.filter(b => b.range.includes('R to') && !b.range.includes('-')).length;
    const bestRange = distributionData.reduce((best, current) => 
      current.totalR > best.totalR ? current : best, 
      distributionData[0] || { range: 'N/A', totalR: 0 }
    );
    
    return {
      totalTrades,
      totalPnL,
      medianR,
      profitableBuckets,
      bestPerformingRange: bestRange.range
    };
  }, [distributionData, executedTrades]);

  const maxTrades = Math.max(...distributionData.map(d => d.totalTrades), 1);

  if (executedTrades.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>R-распределение</CardTitle>
          <p className="text-sm text-muted-foreground">
            Разбивка результатов ваших сделок по диапазонам R-мультипликаторов
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📊</div>
              <p>Гистограмма R-распределения</p>
              <p className="text-xs">Добавьте сделки для анализа распределения</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>R-распределение</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Разбивка результатов ваших сделок по диапазонам R-мультипликаторов
            </p>
          </div>
          {stats && (
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <span className="text-muted-foreground">Total Trades</span>
                <div className="text-2xl font-bold">{stats.totalTrades}</div>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground">Total PnL</span>
                <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {stats.totalPnL > 0 ? '+' : ''}{stats.totalPnL.toFixed(2)}R
                </div>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground">Median R</span>
                <div className={`text-2xl font-bold ${stats.medianR >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {stats.medianR > 0 ? '+' : ''}{stats.medianR.toFixed(2)}R
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-profit"></div>
              <span>Wins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-loss"></div>
              <span>Losses</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48 relative">
            <div className="absolute inset-0 flex items-end justify-between gap-1">
              {distributionData.map((bucket, index) => {
                const height = (bucket.totalTrades / maxTrades) * 100;
                const winHeight = (bucket.wins / maxTrades) * 100;
                const lossHeight = (bucket.losses / maxTrades) * 100;
                
                return (
                  <div key={bucket.range} className="flex-1 flex flex-col items-center group relative">
                    {/* Bar */}
                    <div className="w-full flex flex-col" style={{ height: `${height}%` }}>
                      {/* Wins (green) */}
                      {bucket.wins > 0 && (
                        <div
                          className="w-full bg-profit rounded-t"
                          style={{ 
                            height: `${(winHeight / height) * 100}%`,
                            minHeight: bucket.wins > 0 ? '4px' : '0'
                          }}
                        />
                      )}
                      {/* Losses (red) */}
                      {bucket.losses > 0 && (
                        <div
                          className="w-full bg-loss"
                          style={{ 
                            height: `${(lossHeight / height) * 100}%`,
                            minHeight: bucket.losses > 0 ? '4px' : '0'
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Count label */}
                    <div className="text-xs font-medium mt-1">
                      {bucket.totalTrades}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border text-xs min-w-[120px]">
                        <div className="font-medium mb-1">{bucket.range}</div>
                        <div className="space-y-1">
                          <div>Всего: {bucket.totalTrades}</div>
                          <div className="text-profit">Выигрыши: {bucket.wins}</div>
                          <div className="text-loss">Проигрыши: {bucket.losses}</div>
                          <div>Винрейт: {bucket.winRate.toFixed(1)}%</div>
                          <div>Общий R: {bucket.totalR > 0 ? '+' : ''}{bucket.totalR.toFixed(2)}R</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {distributionData.map(bucket => (
              <div key={bucket.range} className="flex-1 text-center">
                {bucket.range}
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground">
            R Multiple Ranges
          </div>

          {stats && (
            <div className="mt-4 text-sm">
              <div className="text-muted-foreground">
                Profitable ranges: {stats.profitableBuckets} of 8 ranges
              </div>
              <div className="text-muted-foreground">
                Best performing range: {stats.bestPerformingRange}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}