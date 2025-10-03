import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutedTrade } from '@/hooks/useTradingPlans';

interface RDistributionWidgetProps {
  executedTrades: ExecutedTrade[];
}

interface RBucket {
  range: string;
  label: string;
  count: number;
  totalR: number;
}

export function RDistributionWidget({ executedTrades }: RDistributionWidgetProps) {
  const distributionData = useMemo(() => {
    if (executedTrades.length === 0) return [];

    const buckets: RBucket[] = [
      { range: '-2.0R', label: '-2.0R', count: 0, totalR: 0 },
      { range: '-1.5R', label: '-1.5R', count: 0, totalR: 0 },
      { range: '-1.0R', label: '-1.0R', count: 0, totalR: 0 },
      { range: '-0.5R', label: '-0.5R', count: 0, totalR: 0 },
      { range: '0R', label: '0R', count: 0, totalR: 0 },
      { range: '0.5R', label: '0.5R', count: 0, totalR: 0 },
      { range: '1.0R', label: '1.0R', count: 0, totalR: 0 },
      { range: '1.5R', label: '1.5R', count: 0, totalR: 0 },
      { range: '2.0R', label: '2.0R', count: 0, totalR: 0 },
      { range: '2.5R', label: '2.5R', count: 0, totalR: 0 },
      { range: '3.0R', label: '3.0R', count: 0, totalR: 0 },
      { range: '3.5R+', label: '3.5R+', count: 0, totalR: 0 }
    ];

    executedTrades.forEach(trade => {
      const r = trade.actualR;
      let bucketIndex;

      if (r < -1.75) bucketIndex = 0;
      else if (r < -1.25) bucketIndex = 1;
      else if (r < -0.75) bucketIndex = 2;
      else if (r < -0.25) bucketIndex = 3;
      else if (r < 0.25) bucketIndex = 4;
      else if (r < 0.75) bucketIndex = 5;
      else if (r < 1.25) bucketIndex = 6;
      else if (r < 1.75) bucketIndex = 7;
      else if (r < 2.25) bucketIndex = 8;
      else if (r < 2.75) bucketIndex = 9;
      else if (r < 3.25) bucketIndex = 10;
      else bucketIndex = 11;

      buckets[bucketIndex].count++;
      buckets[bucketIndex].totalR += r;
    });

    return buckets.filter(bucket => bucket.count > 0);
  }, [executedTrades]);

  const maxCount = Math.max(...distributionData.map(d => d.count), 1);
  const totalTrades = executedTrades.length;

  if (executedTrades.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>R-распределение</CardTitle>
          <p className="text-sm text-muted-foreground">
            Распределение сделок по R-мультипликаторам
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
        <CardTitle>R-распределение</CardTitle>
        <p className="text-sm text-muted-foreground">
          Распределение {totalTrades} сделок по R-мультипликаторам
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-80 relative flex flex-col">
            <div className="flex-1 relative">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
                <div>{maxCount}</div>
                <div>{Math.floor(maxCount * 0.75)}</div>
                <div>{Math.floor(maxCount * 0.5)}</div>
                <div>{Math.floor(maxCount * 0.25)}</div>
                <div>0</div>
              </div>

              <div className="ml-10 h-full border-l border-b border-border/50">
                <div className="h-full flex items-end justify-around gap-1 px-2">
                  {distributionData.map((bucket) => {
                    const height = (bucket.count / maxCount) * 100;
                    const isNegative = parseFloat(bucket.range) < 0;
                    
                    return (
                      <div key={bucket.range} className="flex-1 flex flex-col items-center group relative max-w-[60px]">
                        <div
                          className={`w-full rounded-t transition-all ${
                            isNegative ? 'bg-loss' : 'bg-profit'
                          } hover:opacity-80`}
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        
                        <div className="text-xs font-semibold mt-1 text-foreground">
                          {bucket.count}
                        </div>

                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                          <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                            <div className="font-medium mb-1">{bucket.label}</div>
                            <div>Сделок: {bucket.count}</div>
                            <div className={bucket.totalR >= 0 ? 'text-profit' : 'text-loss'}>
                              Общий R: {bucket.totalR > 0 ? '+' : ''}{bucket.totalR.toFixed(2)}R
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="ml-10 flex justify-around gap-1 px-2 mt-2">
              {distributionData.map(bucket => (
                <div key={bucket.range} className="flex-1 text-center max-w-[60px]">
                  <div className="text-xs text-muted-foreground">{bucket.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">R-мультипликатор</div>
            <div className="text-xs text-muted-foreground mt-1">
              По вертикальной оси: количество сделок
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
