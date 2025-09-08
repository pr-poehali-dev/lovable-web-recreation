import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface PLDistributionProps {
  executedTrades: ExecutedTrade[];
}

interface DistributionBin {
  range: string;
  count: number;
  percentage: number;
  minR: number;
  maxR: number;
}

export function PLDistribution({ executedTrades }: PLDistributionProps) {
  const { distributionData, stats } = useMemo(() => {
    if (executedTrades.length === 0) {
      return { distributionData: [], stats: { mean: 0, median: 0, stdDev: 0, range: '0 / 0' } };
    }

    const rValues = executedTrades.map(trade => trade.actualR).sort((a, b) => a - b);
    
    // Calculate statistics
    const mean = rValues.reduce((sum, r) => sum + r, 0) / rValues.length;
    const median = rValues[Math.floor(rValues.length / 2)];
    const variance = rValues.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / rValues.length;
    const stdDev = Math.sqrt(variance);
    const minR = rValues[0];
    const maxR = rValues[rValues.length - 1];
    
    // Create bins for distribution
    const binCount = Math.min(10, Math.max(5, Math.ceil(rValues.length / 3)));
    const binWidth = (maxR - minR) / binCount;
    
    const bins: DistributionBin[] = [];
    for (let i = 0; i < binCount; i++) {
      const binMin = minR + i * binWidth;
      const binMax = i === binCount - 1 ? maxR : minR + (i + 1) * binWidth;
      
      const count = rValues.filter(r => r >= binMin && r < binMax).length;
      if (i === binCount - 1) {
        // Include maxR in the last bin
        const lastBinCount = rValues.filter(r => r >= binMin && r <= binMax).length;
        bins.push({
          range: `${binMin.toFixed(1)} to ${binMax.toFixed(1)}`,
          count: lastBinCount,
          percentage: (lastBinCount / rValues.length) * 100,
          minR: binMin,
          maxR: binMax
        });
      } else {
        bins.push({
          range: `${binMin.toFixed(1)} to ${binMax.toFixed(1)}`,
          count,
          percentage: (count / rValues.length) * 100,
          minR: binMin,
          maxR: binMax
        });
      }
    }

    // Calculate percentiles
    const percentiles = {
      p5: rValues[Math.floor(rValues.length * 0.05)],
      p25: rValues[Math.floor(rValues.length * 0.25)],
      p75: rValues[Math.floor(rValues.length * 0.75)],
      p95: rValues[Math.floor(rValues.length * 0.95)]
    };

    return {
      distributionData: bins,
      stats: {
        mean: Number(mean.toFixed(2)),
        median: Number(median.toFixed(2)),
        stdDev: Number(stdDev.toFixed(2)),
        range: `${minR.toFixed(1)} / ${maxR.toFixed(1)}`,
        percentiles
      }
    };
  }, [executedTrades]);

  const maxCount = Math.max(...distributionData.map(bin => bin.count), 1);
  
  const getBinColor = (minR: number, maxR: number) => {
    if (maxR <= 0) return 'bg-loss';
    if (minR >= 0) return 'bg-profit';
    return 'bg-yellow-500'; // Mixed bin
  };

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle>Распределение P&L</CardTitle>
        <p className="text-sm text-muted-foreground">
          Анализ распределения результатов сделок по концепции Тендлера
        </p>
      </CardHeader>
      <CardContent>
        {executedTrades.length > 0 ? (
          <div className="space-y-6">
            {/* Key Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Среднее</div>
                <div className={`text-xl font-bold ${stats.mean >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {stats.mean}R
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Медиана</div>
                <div className={`text-xl font-bold ${stats.median >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {stats.median}R
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Ст. отклонение</div>
                <div className="text-xl font-bold">{stats.stdDev}R</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Размах</div>
                <div className="text-xl font-bold">{stats.range}R</div>
              </div>
            </div>

            {/* Percentiles */}
            <div>
              <h4 className="font-medium mb-2">Процентили</h4>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="bg-card border rounded p-2 text-center">
                  <div className="text-xs text-muted-foreground">5%</div>
                  <div className="font-medium">{stats.percentiles?.p5.toFixed(1)}R</div>
                </div>
                <div className="bg-card border rounded p-2 text-center">
                  <div className="text-xs text-muted-foreground">25%</div>
                  <div className="font-medium">{stats.percentiles?.p25.toFixed(1)}R</div>
                </div>
                <div className="bg-card border rounded p-2 text-center">
                  <div className="text-xs text-muted-foreground">75%</div>
                  <div className="font-medium">{stats.percentiles?.p75.toFixed(1)}R</div>
                </div>
                <div className="bg-card border rounded p-2 text-center">
                  <div className="text-xs text-muted-foreground">95%</div>
                  <div className="font-medium">{stats.percentiles?.p95.toFixed(1)}R</div>
                </div>
              </div>
            </div>

            {/* Histogram */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Гистограмма распределения</h4>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded bg-loss"></div>
                    <span>Убытки</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded bg-profit"></div>
                    <span>Прибыль</span>
                  </div>
                </div>
              </div>
              
              <div className="h-48 flex items-end gap-1">
                {distributionData.map((bin, index) => {
                  const heightPercent = (bin.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full rounded-t ${getBinColor(bin.minR, bin.maxR)} transition-all duration-300`}
                        style={{ height: `${heightPercent}%`, minHeight: bin.count > 0 ? '4px' : '0' }}
                        title={`${bin.range}: ${bin.count} сделок (${bin.percentage.toFixed(1)}%)`}
                      />
                      <div className="text-xs text-center mt-1 text-muted-foreground transform -rotate-45 origin-left">
                        {bin.range}
                      </div>
                      <div className="text-xs font-medium mt-1">{bin.count}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center mt-4 text-xs text-muted-foreground">
                R Мультипликаторы
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-2 text-sm">
              <div className="font-medium">Ключевые выводы:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Распределение показывает реальные ожидания от вашей торговой системы</li>
                <li>• Используйте процентили для управления психологическими ожиданиями</li>
                <li>• {stats.percentiles && `50% ваших сделок будут в диапазоне ${stats.percentiles.p25.toFixed(1)}R - ${stats.percentiles.p75.toFixed(1)}R`}</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Icon name="BarChart3" className="h-12 w-12 mx-auto mb-2" />
              <p>Распределение P&L</p>
              <p className="text-xs">Анализ распределения результатов по концепции Тендлера</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}