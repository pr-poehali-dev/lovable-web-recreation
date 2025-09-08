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
    
    // Calculate statistics
    const mean = rValues.reduce((sum, r) => sum + r, 0) / rValues.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    
    // Standard deviation
    const variance = rValues.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / rValues.length;
    const stdDev = Math.sqrt(variance);
    
    // Percentiles
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

    // Create buckets for histogram
    const minR = Math.min(...rValues);
    const maxR = Math.max(...rValues);
    const range = maxR - minR;
    const bucketCount = 5; // Fixed 5 buckets as shown in the image
    const bucketSize = range / bucketCount;
    
    const buckets: DistributionBucket[] = [];
    
    for (let i = 0; i < bucketCount; i++) {
      const bucketMin = minR + (i * bucketSize);
      const bucketMax = minR + ((i + 1) * bucketSize);
      
      const tradesInBucket = rValues.filter(r => {
        if (i === bucketCount - 1) {
          return r >= bucketMin && r <= bucketMax; // Include max in last bucket
        }
        return r >= bucketMin && r < bucketMax;
      });
      
      let rangeLabel: string;
      if (bucketMin < 0 && bucketMax <= 0) {
        rangeLabel = `${bucketMin.toFixed(1)} to ${bucketMax.toFixed(1)}`;
      } else if (bucketMin < 0 && bucketMax > 0) {
        rangeLabel = `${bucketMin.toFixed(1)} to ${bucketMax.toFixed(1)}`;
      } else {
        rangeLabel = `${bucketMin.toFixed(1)} to ${bucketMax.toFixed(1)}`;
      }
      
      buckets.push({
        range: rangeLabel,
        min: bucketMin,
        max: bucketMax,
        count: tradesInBucket.length,
        totalR: tradesInBucket.reduce((sum, r) => sum + r, 0),
        isProfit: bucketMin >= 0
      });
    }
    
    return { distributionData: buckets, stats };
  }, [executedTrades]);

  if (executedTrades.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Распределение P&L</CardTitle>
          <p className="text-sm text-muted-foreground">
            Анализ распределения результатов сделок по концепции Тендлера
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📈</div>
              <p>Распределение результатов</p>
              <p className="text-xs">Добавьте сделки для анализа распределения</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...distributionData.map(d => d.count));
  
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
          {/* Statistics Overview */}
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
                  {stats.median > 0 ? '+' : ''}{stats.median.toFixed(0)}R
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Ст. отклонение</div>
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

          {/* Percentiles */}
          {stats && (
            <div>
              <h4 className="font-semibold mb-3">Процентили</h4>
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

          {/* Histogram */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Гистограмма распределения</h4>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-loss rounded"></div>
                  <span>Убытки</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-profit rounded"></div>
                  <span>Прибыль</span>
                </div>
              </div>
            </div>
            
            <div className="h-40 relative border-b border-l border-border">
              <div className="absolute inset-0 flex items-end">
                {distributionData.map((bucket, index) => {
                  const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex-1 mx-1 flex flex-col items-center">
                      <div
                        className={`w-full transition-all hover:opacity-80 ${
                          bucket.isProfit ? 'bg-profit' : 'bg-loss'
                        }`}
                        style={{ height: `${height}%`, minHeight: bucket.count > 0 ? '8px' : '0' }}
                        title={`${bucket.range}: ${bucket.count} trades, ${bucket.totalR.toFixed(2)}R total`}
                      />
                      <div className="text-xs font-medium mt-1">
                        {bucket.count}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Y-axis label */}
              <div className="absolute -left-8 top-1/2 transform -rotate-90 text-xs text-muted-foreground">
                Частота
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="flex mt-2">
              {distributionData.map((bucket, index) => (
                <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                  {bucket.range}
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-muted-foreground mt-2">
              R Мультипликаторы
            </div>
          </div>

          {/* Key Insights */}
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold">Ключевые выводы:</h4>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>Распределение показывает реальные ожидания от вашей торговой системы</li>
              <li>Используйте процентили для управления психологическими ожиданиями</li>
              <li>{stats && `50% ваших сделок будут в диапазоне ${stats.range.min.toFixed(1)}R - ${stats.range.max.toFixed(1)}R`}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}