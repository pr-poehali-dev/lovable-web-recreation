import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OutcomeAnalysisWidget } from '@/components/OutcomeAnalysisWidget';
import { RAnalysisHeatmap } from '@/components/RAnalysisHeatmap';
import { PsychologyErrorHeatmap } from '@/components/PsychologyErrorHeatmap';
import { EquityCurveWidget } from '@/components/EquityCurveWidget';
import { RDistributionWidget } from '@/components/RDistributionWidget';
import { PnLDistributionWidget } from '@/components/PnLDistributionWidget';
import { TradingPlan, ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface DashboardContentProps {
  totalTrades: number;
  winningTrades: number;
  winrate: number;
  totalR: number;
  avgR: number;
  maxWin: number;
  maxLoss: number;
  activePlans: TradingPlan[];
  executedTrades: ExecutedTrade[];
}

export function DashboardContent({
  totalTrades,
  winningTrades,
  winrate,
  totalR,
  avgR,
  maxWin,
  maxLoss,
  activePlans,
  executedTrades
}: DashboardContentProps) {
  const [filteredTrades, setFilteredTrades] = useState<ExecutedTrade[]>(executedTrades);

  // Update filtered trades when executedTrades changes
  React.useEffect(() => {
    setFilteredTrades(executedTrades);
  }, [executedTrades]);

  // Recalculate metrics based on filtered trades
  const filteredMetrics = React.useMemo(() => {
    if (filteredTrades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        winrate: 0,
        totalR: 0,
        avgR: 0,
        maxWin: 0,
        maxLoss: 0
      };
    }

    const wins = filteredTrades.filter(t => t.actualR > 0).length;
    const rate = (wins / filteredTrades.length) * 100;
    const total = filteredTrades.reduce((sum, t) => sum + t.actualR, 0);
    const avg = total / filteredTrades.length;
    const max = Math.max(...filteredTrades.map(t => t.actualR));
    const min = Math.min(...filteredTrades.map(t => t.actualR));

    return {
      totalTrades: filteredTrades.length,
      winningTrades: wins,
      winrate: rate,
      totalR: total,
      avgR: avg,
      maxWin: max,
      maxLoss: min
    };
  }, [filteredTrades]);

  return (
    <div className="space-y-6 mt-6">
      {/* Analysis Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Анализ производительности</h2>
          <Button variant="outline" size="sm">
            <Icon name="Calendar" className="h-4 w-4 mr-2" />
            Выбрать период
          </Button>
        </div>
        <p className="text-muted-foreground">
          {totalTrades === 0 ? 'Создайте первый торговый план для начала анализа' : 'Анализ на основе исполненных сделок'}
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего сделок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMetrics.totalTrades}</div>
            <p className="text-xs text-muted-foreground">сделок</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Винрейт</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">{filteredMetrics.winrate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{filteredMetrics.winningTrades}/{filteredMetrics.totalTrades}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Средний R</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${filteredMetrics.avgR >= 0 ? 'text-profit' : 'text-loss'}`}>
              {filteredMetrics.avgR > 0 ? '+' : ''}{filteredMetrics.avgR.toFixed(2)}R
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Общий R</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${filteredMetrics.totalR >= 0 ? 'text-profit' : 'text-loss'}`}>
              {filteredMetrics.totalR > 0 ? '+' : ''}{filteredMetrics.totalR.toFixed(2)}R
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Макс выигрыш</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">{filteredMetrics.maxWin.toFixed(2)}R</div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Макс убыток</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-loss">{filteredMetrics.maxLoss.toFixed(2)}R</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve Chart */}
        <EquityCurveWidget executedTrades={filteredTrades} />

        {/* R Distribution Chart */}
        <RDistributionWidget executedTrades={filteredTrades} />
      </div>

      {/* R-Analysis Heatmap */}
      {totalTrades > 0 && (
        <RAnalysisHeatmap 
          executedTrades={executedTrades} 
          onFilterChange={setFilteredTrades}
        />
      )}

      {/* Psychology Error Heatmap */}
      {totalTrades > 0 && (
        <PsychologyErrorHeatmap executedTrades={filteredTrades} />
      )}

      {/* P&L Distribution Widget */}
      {totalTrades > 0 && (
        <PnLDistributionWidget executedTrades={filteredTrades} />
      )}

      {/* Outcome Analysis Widget */}
      <OutcomeAnalysisWidget 
        activePlans={activePlans}
        historicalWinrate={winrate > 0 ? winrate : 65}
      />
    </div>
  );
}