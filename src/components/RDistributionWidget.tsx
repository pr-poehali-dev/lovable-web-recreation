import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutedTrade } from '@/hooks/useTradingPlans';

interface RDistributionWidgetProps {
  executedTrades: ExecutedTrade[];
}

interface RBucket {
  range: string;
  label: string;
  wins: number;
  losses: number;
  totalR: number;
}

export function RDistributionWidget({ executedTrades }: RDistributionWidgetProps) {
  const distributionData = useMemo(() => {
    if (executedTrades.length === 0) return [];

    const buckets: RBucket[] = [
      { range: '-1.0 to -0.5', label: '-1.0R to -0.5R', wins: 0, losses: 0, totalR: 0 },
      { range: '-0.5 to 0', label: '-0.5R to 0R', wins: 0, losses: 0, totalR: 0 },
      { range: '0 to 0.5', label: '0R to 0.5R', wins: 0, losses: 0, totalR: 0 },
      { range: '0.5 to 1.0', label: '0.5R to 1.0R', wins: 0, losses: 0, totalR: 0 },
      { range: '1.0 to 1.5', label: '1.0R to 1.5R', wins: 0, losses: 0, totalR: 0 },
      { range: '1.5 to 2.0', label: '1.5R to 2.0R', wins: 0, losses: 0, totalR: 0 },
      { range: '2.0 to 2.5', label: '2.0R to 2.5R', wins: 0, losses: 0, totalR: 0 },
      { range: '2.5 to 3.0', label: '2.5R to 3.0R', wins: 0, losses: 0, totalR: 0 }
    ];

    executedTrades.forEach(trade => {
      const r = trade.actualR;
      let bucketIndex = -1;

      if (r >= -1.0 && r < -0.5) bucketIndex = 0;
      else if (r >= -0.5 && r < 0) bucketIndex = 1;
      else if (r >= 0 && r < 0.5) bucketIndex = 2;
      else if (r >= 0.5 && r < 1.0) bucketIndex = 3;
      else if (r >= 1.0 && r < 1.5) bucketIndex = 4;
      else if (r >= 1.5 && r < 2.0) bucketIndex = 5;
      else if (r >= 2.0 && r < 2.5) bucketIndex = 6;
      else if (r >= 2.5 && r < 3.0) bucketIndex = 7;

      if (bucketIndex >= 0) {
        if (r >= 0) {
          buckets[bucketIndex].wins++;
        } else {
          buckets[bucketIndex].losses++;
        }
        buckets[bucketIndex].totalR += r;
      }
    });

    return buckets.filter(b => b.wins > 0 || b.losses > 0);
  }, [executedTrades]);

  const stats = useMemo(() => {
    if (executedTrades.length === 0) return null;
    
    const totalTrades = executedTrades.length;
    const totalPnL = executedTrades.reduce((sum, t) => sum + t.actualR, 0);
    const medianR = [...executedTrades].sort((a, b) => a.actualR - b.actualR)[Math.floor(totalTrades / 2)]?.actualR || 0;
    
    const profitableBuckets = distributionData.filter(b => b.totalR > 0).length;
    const bestRange = distributionData.reduce((best, current) => 
      current.totalR > best.totalR ? current : best, 
      distributionData[0] || { label: 'N/A', totalR: 0 }
    );
    
    return {
      totalTrades,
      totalPnL,
      medianR,
      profitableBuckets,
      totalRanges: distributionData.length,
      bestPerformingRange: bestRange.label
    };
  }, [distributionData, executedTrades]);

  const maxTrades = Math.max(...distributionData.map(d => d.wins + d.losses), 1);

  if (executedTrades.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>R-Распределение</CardTitle>
          <p className="text-sm text-muted-foreground">
            Распределение риск-вознаграждения по всем сделкам
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📊</div>
              <p>Гистограмма R-распределения</p>
              <p className="text-xs">Добавьте сделки для анализа</p>
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
            <CardTitle>R-Распределение</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Распределение риск-вознаграждения по всем сделкам
            </p>
          </div>
          {stats && (
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <span className="text-muted-foreground block">Total Trades</span>
                <div className="text-2xl font-bold">{stats.totalTrades}</div>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground block">Total PnL</span>
                <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {stats.totalPnL > 0 ? '+' : ''}{stats.totalPnL.toFixed(2)}R
                </div>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground block">Median R</span>
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
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-profit"></div>
              <span>Wins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-loss"></div>
              <span>Losses</span>
            </div>
          </div>

          <div className="relative h-80">
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-muted-foreground">
              <div>{maxTrades}</div>
              <div>{Math.floor(maxTrades * 0.75)}</div>
              <div>{Math.floor(maxTrades * 0.5)}</div>
              <div>{Math.floor(maxTrades * 0.25)}</div>
              <div>0</div>
            </div>

            <div className="absolute left-16 right-0 top-0 bottom-8 border-l border-b border-border/30">
              <div className="h-full flex items-end justify-between gap-2 px-4">
                {distributionData.map((bucket) => {
                  const totalTrades = bucket.wins + bucket.losses;
                  const winsHeight = (bucket.wins / maxTrades) * 100;
                  const lossesHeight = (bucket.losses / maxTrades) * 100;
                  
                  return (
                    <div key={bucket.range} className="flex-1 flex flex-col items-center group relative">
                      <div className="w-full flex flex-col-reverse" style={{ height: `${(totalTrades / maxTrades) * 100}%` }}>
                        {bucket.losses > 0 && (
                          <div
                            className="w-full bg-loss"
                            style={{ height: `${(lossesHeight / ((winsHeight + lossesHeight) || 1)) * 100}%`, minHeight: '2px' }}
                          />
                        )}
                        {bucket.wins > 0 && (
                          <div
                            className="w-full bg-profit"
                            style={{ height: `${(winsHeight / ((winsHeight + lossesHeight) || 1)) * 100}%`, minHeight: '2px' }}
                          />
                        )}
                      </div>

                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                          <div className="font-medium mb-1">{bucket.label}</div>
                          <div>Wins: {bucket.wins}</div>
                          <div>Losses: {bucket.losses}</div>
                          <div className={bucket.totalR >= 0 ? 'text-profit' : 'text-loss'}>
                            Total: {bucket.totalR > 0 ? '+' : ''}{bucket.totalR.toFixed(2)}R
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="absolute left-0 right-0 bottom-0 h-8 flex items-center">
              <div className="w-16"></div>
              <div className="flex-1 flex justify-between px-4">
                {distributionData.map(bucket => (
                  <div key={bucket.range} className="flex-1 text-center text-xs text-muted-foreground">
                    {bucket.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-sm font-medium text-muted-foreground">
            R Multiple Ranges
          </div>

          {stats && (
            <div className="text-sm space-y-1">
              <div className="text-muted-foreground">
                Profitable ranges: {stats.profitableBuckets} of {stats.totalRanges} ranges
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
