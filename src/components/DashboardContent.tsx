import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OutcomeAnalysisWidget } from '@/components/OutcomeAnalysisWidget';
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
  
  // Calculate heatmap data
  const setupPerformance = React.useMemo(() => {
    const setupStats: Record<string, { wins: number; total: number; totalR: number }> = {};
    
    executedTrades.forEach(trade => {
      if (!setupStats[trade.setup]) {
        setupStats[trade.setup] = { wins: 0, total: 0, totalR: 0 };
      }
      setupStats[trade.setup].total++;
      setupStats[trade.setup].totalR += trade.actualR;
      if (trade.actualR > 0) setupStats[trade.setup].wins++;
    });
    
    return Object.entries(setupStats).map(([setup, stats]) => ({
      setup,
      winrate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
      avgR: stats.total > 0 ? stats.totalR / stats.total : 0,
      total: stats.total
    }));
  }, [executedTrades]);

  const sessionPerformance = React.useMemo(() => {
    const sessionStats: Record<string, { wins: number; total: number; totalR: number }> = {};
    
    executedTrades.forEach(trade => {
      if (!sessionStats[trade.session]) {
        sessionStats[trade.session] = { wins: 0, total: 0, totalR: 0 };
      }
      sessionStats[trade.session].total++;
      sessionStats[trade.session].totalR += trade.actualR;
      if (trade.actualR > 0) sessionStats[trade.session].wins++;
    });
    
    return Object.entries(sessionStats).map(([session, stats]) => ({
      session,
      winrate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
      avgR: stats.total > 0 ? stats.totalR / stats.total : 0,
      total: stats.total
    }));
  }, [executedTrades]);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего сделок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades}</div>
            <p className="text-xs text-muted-foreground">сделок</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Винрейт</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">{winrate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{winningTrades}/{totalTrades}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Средний R</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${avgR >= 0 ? 'text-profit' : 'text-loss'}`}>
              {avgR > 0 ? '+' : ''}{avgR.toFixed(2)}R
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Общий R</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalR >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalR > 0 ? '+' : ''}{totalR.toFixed(2)}R
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Макс выигрыш</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">{maxWin.toFixed(2)}R</div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Макс убыток</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-loss">{maxLoss.toFixed(2)}R</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Capital Curve Chart */}
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
              <span>Текущее ожидание: <strong className="text-profit">{avgR.toFixed(2)}R</strong></span>
              <Badge variant="secondary" className={avgR >= 0 ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}>
                {avgR >= 0 ? 'Улучшается' : 'Ухудшается'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Icon name="TrendingUp" className="h-12 w-12 mx-auto mb-2" />
                <p>График кривой капитала</p>
                <p className="text-xs">Интерактивная визуализация роста капитала</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Total Trades</span>
                <div className="text-2xl font-bold">{totalTrades}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total PnL</span>
                <div className={`text-2xl font-bold ${totalR >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {totalR > 0 ? '+' : ''}{totalR.toFixed(2)}R
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Median R</span>
                <div className={`text-2xl font-bold ${avgR >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {avgR > 0 ? '+' : ''}{avgR.toFixed(2)}R
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-profit"></div>
                  <span className="text-sm">Wins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-loss"></div>
                  <span className="text-sm">Losses</span>
                </div>
              </div>
              <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Icon name="BarChart3" className="h-12 w-12 mx-auto mb-2" />
                  <p>Гистограмма производительности</p>
                  <p className="text-xs">Распределение результатов по диапазонам R</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap widgets */}
      {totalTrades > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Setup Performance Heatmap */}
          <Card className="bg-card/60 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Производительность по сетапам</CardTitle>
              <p className="text-sm text-muted-foreground">
                Анализ эффективности торговых сетапов
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {setupPerformance.length > 0 ? setupPerformance.map(item => (
                  <div key={item.setup} className="flex items-center justify-between p-3 rounded-lg border bg-card/30">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          item.winrate >= 60 ? 'bg-profit' : 
                          item.winrate >= 40 ? 'bg-yellow-500' : 'bg-loss'
                        }`} 
                      />
                      <span className="font-medium">{item.setup}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{item.winrate.toFixed(1)}%</span>
                      <span className={item.avgR >= 0 ? 'text-profit' : 'text-loss'}>
                        {item.avgR > 0 ? '+' : ''}{item.avgR.toFixed(2)}R
                      </span>
                      <Badge variant="secondary">{item.total}</Badge>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Icon name="Target" className="h-8 w-8 mx-auto mb-2" />
                    <p>Нет данных по сетапам</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Performance Heatmap */}
          <Card className="bg-card/60 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Производительность по сессиям</CardTitle>
              <p className="text-sm text-muted-foreground">
                Анализ эффективности торговых сессий
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessionPerformance.length > 0 ? sessionPerformance.map(item => (
                  <div key={item.session} className="flex items-center justify-between p-3 rounded-lg border bg-card/30">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          item.winrate >= 60 ? 'bg-profit' : 
                          item.winrate >= 40 ? 'bg-yellow-500' : 'bg-loss'
                        }`} 
                      />
                      <span className="font-medium">{item.session}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{item.winrate.toFixed(1)}%</span>
                      <span className={item.avgR >= 0 ? 'text-profit' : 'text-loss'}>
                        {item.avgR > 0 ? '+' : ''}{item.avgR.toFixed(2)}R
                      </span>
                      <Badge variant="secondary">{item.total}</Badge>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Icon name="Clock" className="h-8 w-8 mx-auto mb-2" />
                    <p>Нет данных по сессиям</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Outcome Analysis Widget */}
      <OutcomeAnalysisWidget 
        activePlans={activePlans}
        historicalWinrate={winrate > 0 ? winrate : 65}
      />
    </div>
  );
}