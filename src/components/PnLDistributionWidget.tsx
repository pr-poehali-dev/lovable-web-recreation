import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutedTrade } from '@/hooks/useTradingPlans';

interface PnLDistributionWidgetProps {
  executedTrades: ExecutedTrade[];
}

interface DistributionBucket {
  range: string;
  min: number;
  max: number;
  count: number;
  totalR: number;
  isProfit: boolean;
}

interface DistributionStats {
  mean: number;
  median: number;
  stdDev: number;
  range: { min: number; max: number };
  percentiles: {
    p5: number;
    p25: number;
    p75: number;
    p95: number;
  };
}

export function PnLDistributionWidget({ executedTrades }: PnLDistributionWidgetProps) {
  const { distributionData, stats } = useMemo(() => {
    if (executedTrades.length === 0) {
      return {
        distributionData: [],
        stats: null
      };
    }

    const rValues = executedTrades.map(t => t.actualR);
    const sorted = [...rValues].sort((a, b) => a - b);
    
    const mean = rValues.reduce((sum, r) => sum + r, 0) / rValues.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    
    const variance = rValues.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / rValues.length;
    const stdDev = Math.sqrt(variance);
    
    const getPercentile = (arr: number[], p: number) => {
      const index = Math.ceil((p / 100) * arr.length) - 1;
      return arr[Math.max(0, Math.min(index, arr.length - 1))];
    };
    
    const stats: DistributionStats = {
      mean,
      median,
      stdDev,
      range: { min: sorted[0], max: sorted[sorted.length - 1] },
      percentiles: {
        p5: getPercentile(sorted, 5),
        p25: getPercentile(sorted, 25),
        p75: getPercentile(sorted, 75),
        p95: getPercentile(sorted, 95)
      }
    };

    const minR = Math.min(...rValues);
    const maxR = Math.max(...rValues);
    const range = maxR - minR;
    const bucketCount = 8;
    const bucketSize = range / bucketCount;
    
    const buckets: DistributionBucket[] = [];
    
    for (let i = 0; i < bucketCount; i++) {
      const bucketMin = minR + (i * bucketSize);
      const bucketMax = minR + ((i + 1) * bucketSize);
      
      const tradesInBucket = rValues.filter(r => {
        if (i === bucketCount - 1) {
          return r >= bucketMin && r <= bucketMax;
        }
        return r >= bucketMin && r < bucketMax;
      });
      
      const rangeLabel = `${bucketMin.toFixed(1)} - ${bucketMax.toFixed(1)}`;
      
      buckets.push({
        range: rangeLabel,
        min: bucketMin,
        max: bucketMax,
        count: tradesInBucket.length,
        totalR: tradesInBucket.reduce((sum, r) => sum + r, 0),
        isProfit: bucketMin >= 0
      });
    }
    
    return { distributionData: buckets.filter(b => b.count > 0), stats };
  }, [executedTrades]);

  if (executedTrades.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Распределение P&L</CardTitle>
          <p className="text-sm text-muted-foreground">
            Анализ распределения результатов сделок
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📈</div>
              <p>Распределение результатов</p>
              <p className="text-xs">Добавьте сделки для анализа</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...distributionData.map(d => d.count), 1);
  
  return (
    <Card className="bg-card/60 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle>Распределение P&L</CardTitle>
        <p className="text-sm text-muted-foreground">
          Анализ распределения результатов сделок по концепции Тендлера
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Среднее</div>
                <div className={`text-xl font-bold ${stats.mean >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {stats.mean > 0 ? '+' : ''}{stats.mean.toFixed(2)}R
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Медиана</div>
                <div className={`text-xl font-bold ${stats.median >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {stats.median > 0 ? '+' : ''}{stats.median.toFixed(1)}R
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Ст. откл.</div>
                <div className="text-xl font-bold">
                  {stats.stdDev.toFixed(2)}R
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Размах</div>
                <div className="text-xl font-bold">
                  {stats.range.min.toFixed(1)} / {stats.range.max.toFixed(1)}R
                </div>
              </div>
            </div>
          )}

          {stats && (
            <div>
              <h4 className="font-semibold mb-3">Процентили (по Ван Тендлеру)</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">5%</div>
                  <div className="font-bold">
                    {stats.percentiles.p5.toFixed(1)}R
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">25%</div>
                  <div className="font-bold">
                    {stats.percentiles.p25.toFixed(1)}R
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">75%</div>
                  <div className="font-bold">
                    {stats.percentiles.p75.toFixed(1)}R
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">95%</div>
                  <div className="font-bold">
                    {stats.percentiles.p95.toFixed(1)}R
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-4">Гистограмма распределения</h4>
            
            <div className="h-80 relative flex flex-col">
              <div className="flex-1 relative">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2 w-8">
                  <div>{maxCount}</div>
                  <div>{Math.floor(maxCount * 0.75)}</div>
                  <div>{Math.floor(maxCount * 0.5)}</div>
                  <div>{Math.floor(maxCount * 0.25)}</div>
                  <div>0</div>
                </div>

                <div className="ml-10 h-full border-l border-b border-border/50">
                  <div className="h-full flex items-end justify-around gap-1 px-2">
                    {distributionData.map((bucket, index) => {
                      const height = (bucket.count / maxCount) * 100;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center group relative max-w-[80px]">
                          <div
                            className={`w-full rounded-t transition-all ${
                              bucket.isProfit ? 'bg-profit' : 'bg-loss'
                            } hover:opacity-80`}
                            style={{ height: `${height}%`, minHeight: bucket.count > 0 ? '4px' : '0' }}
                          />
                          
                          <div className="text-xs font-semibold mt-1 text-foreground">
                            {bucket.count}
                          </div>

                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                              <div className="font-medium mb-1">{bucket.range}R</div>
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
                {distributionData.map((bucket, index) => (
                  <div key={index} className="flex-1 text-center max-w-[80px]">
                    <div className="text-xs text-muted-foreground">{bucket.range}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-sm font-medium text-muted-foreground">R-мультипликатор</div>
              <div className="text-xs text-muted-foreground mt-1">
                По вертикальной оси (частота): количество сделок
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="font-semibold">Ключевые выводы:</h4>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>Распределение показывает реальные ожидания от торговой системы</li>
              <li>Используйте процентили для управления психологическими ожиданиями</li>
              {stats && <li>50% сделок будут в диапазоне от {stats.percentiles.p25.toFixed(1)}R до {stats.percentiles.p75.toFixed(1)}R</li>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
