import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useTradingPlans } from "@/hooks/useTradingPlans";
import { CreatePlanDialog } from "@/components/CreatePlanDialog";
import { ExecutePlanDialog } from "@/components/ExecutePlanDialog";
import { OutcomeAnalysisWidget } from "@/components/OutcomeAnalysisWidget";
import Icon from "@/components/ui/icon";

function TradingJournalContent() {
  const { theme, toggleTheme } = useTheme();
  const { 
    activePlans, 
    executedTrades, 
    plans,
    recentPairs, 
    createPlan, 
    executePlan, 
    constants 
  } = useTradingPlans();

  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [executePlanOpen, setExecutePlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planFilters, setPlanFilters] = useState({
    search: '',
    status: 'all',
    setup: 'all'
  });

  // Calculate metrics from executed trades
  const totalTrades = executedTrades.length;
  const winningTrades = executedTrades.filter(t => t.actualR > 0).length;
  const winrate = totalTrades > 0 ? (winningTrades / totalTrades * 100) : 0;
  const totalR = executedTrades.reduce((sum, t) => sum + t.actualR, 0);
  const avgR = totalTrades > 0 ? totalR / totalTrades : 0;
  const maxWin = totalTrades > 0 ? Math.max(...executedTrades.map(t => t.actualR)) : 0;
  const maxLoss = totalTrades > 0 ? Math.min(...executedTrades.map(t => t.actualR)) : 0;

  const handleExecutePlan = (plan: any) => {
    setSelectedPlan(plan);
    setExecutePlanOpen(true);
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.currencyPair.toLowerCase().includes(planFilters.search.toLowerCase()) ||
                         plan.comment.toLowerCase().includes(planFilters.search.toLowerCase());
    const matchesSetup = planFilters.setup === 'all' || plan.setup === planFilters.setup;
    return matchesSearch && matchesSetup;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="TrendingUp" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Торговый журнал</h1>
              <p className="text-sm text-muted-foreground">R-Анализ и трекер производительности</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="text-muted-foreground">
              <Icon name="Clock" className="h-3 w-3 mr-1" />
              {activePlans.length} Активных планов
            </Badge>
            <Button 
              onClick={() => setCreatePlanOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Создать план
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-muted/30">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Icon name="BarChart3" className="h-4 w-4" />
              Панель
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Icon name="Target" className="h-4 w-4" />
              Все планы
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Icon name="Play" className="h-4 w-4" />
              Активные
            </TabsTrigger>
            <TabsTrigger value="trades" className="flex items-center gap-2">
              <Icon name="List" className="h-4 w-4" />
              Все сделки
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Icon name="Settings" className="h-4 w-4" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <Icon name="BookOpen" className="h-4 w-4" />
              Руководство
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
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

            {/* Outcome Analysis Widget */}
            <OutcomeAnalysisWidget 
              activePlans={activePlans}
              historicalWinrate={winrate > 0 ? winrate : 65}
            />
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Все планы</h2>
              </div>
              
              {/* Filter Plans */}
              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Filter Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Search by pair or comment..."
                      value={planFilters.search}
                      onChange={(e) => setPlanFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="flex-1"
                    />
                    <Select value={planFilters.setup} onValueChange={(value) => setPlanFilters(prev => ({ ...prev, setup: value }))}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Setups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Setups</SelectItem>
                        {constants.SETUPS.map(setup => (
                          <SelectItem key={setup} value={setup}>{setup}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {filteredPlans.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Target" className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Планы не найдены</h3>
                    <p>Создайте первый торговый план</p>
                  </div>
                ) : (
                  filteredPlans.map(plan => (
                    <Card key={plan.id} className="bg-card/60 backdrop-blur border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className={plan.status === 'active' ? 'border-profit text-profit' : 'border-muted text-muted-foreground'}>
                              {plan.status === 'active' ? 'Active' : 'Completed'}
                            </Badge>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{plan.currencyPair}</span>
                                <Icon name={plan.direction === 'Long' ? 'TrendingUp' : 'TrendingDown'} 
                                      className={`h-4 w-4 ${plan.direction === 'Long' ? 'text-profit' : 'text-loss'}`} />
                                <span>{plan.direction}</span>
                              </div>
                              <div className="text-sm text-muted-foreground space-x-4">
                                <span>Entry: {plan.entryPrice}</span>
                                <span>SL: {plan.stopLoss}</span>
                                <span>TP: {plan.takeProfit}</span>
                                <span>Setup: {plan.setup}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              Expected R: {plan.expectedR > 0 ? '+' : ''}{plan.expectedR}R
                            </Badge>
                            {plan.status === 'active' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleExecutePlan(plan)}
                                className="bg-profit hover:bg-profit/90 text-white"
                              >
                                Execute
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Активные планы ({activePlans.length})</h2>
              </div>

              {activePlans.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Play" className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Активные планы</h3>
                  <p>Создайте торговый план для начала работы</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activePlans.map(plan => (
                    <Card key={plan.id} className="bg-card/60 backdrop-blur border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg">{plan.currencyPair}</span>
                                <Badge variant="outline" className="border-profit text-profit">
                                  <Icon name="Circle" className="h-2 w-2 mr-1 fill-current" />
                                  Active
                                </Badge>
                                <Icon name={plan.direction === 'Long' ? 'TrendingUp' : 'TrendingDown'} 
                                      className={`h-4 w-4 ${plan.direction === 'Long' ? 'text-profit' : 'text-loss'}`} />
                                <span className="font-medium">{plan.direction}</span>
                              </div>
                              <div className="grid grid-cols-4 gap-6 mt-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Entry:</span> {plan.entryPrice}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">SL:</span> {plan.stopLoss}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">TP:</span> {plan.takeProfit}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Expected R:</span> 
                                  <Badge variant="secondary" className="ml-1">
                                    {plan.expectedR > 0 ? '+' : ''}{plan.expectedR}R
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-6 mt-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Setup:</span> {plan.setup}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Session:</span> {plan.session}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Strategy:</span> {plan.strategy}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Created:</span> {plan.date}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Icon name="Eye" className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleExecutePlan(plan)}
                              className="bg-profit hover:bg-profit/90 text-white"
                            >
                              Execute
                            </Button>
                            <Button variant="outline" size="sm" className="text-loss hover:bg-loss/10">
                              <Icon name="Trash2" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">История сделок ({executedTrades.length})</h2>
              </div>

              {executedTrades.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="List" className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">История сделок</h3>
                  <p>Исполните первый торговый план для отображения сделок</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {executedTrades.map(trade => (
                    <Card key={trade.id} className="bg-card/60 backdrop-blur border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{trade.currencyPair}</span>
                              <Icon name={trade.direction === 'Long' ? 'TrendingUp' : 'TrendingDown'} 
                                    className={`h-4 w-4 ${trade.direction === 'Long' ? 'text-profit' : 'text-loss'}`} />
                              <span>{trade.direction}</span>
                              <Badge className={`${trade.actualR >= 0 ? 'bg-profit' : 'bg-loss'} text-white`}>
                                {trade.actualR > 0 ? '+' : ''}{trade.actualR}R
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {trade.setup} • {trade.session} • {trade.executionType} • {new Date(trade.executedAt).toLocaleDateString('ru-RU')}
                            </div>
                            {trade.psychologyTags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {trade.psychologyTags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Entry: {trade.entryPrice}</div>
                            <div className="text-sm text-muted-foreground">Exit: {trade.actualExitPrice}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Settings" className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Настройки</h3>
              <p>Здесь можно настроить параметры журнала</p>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="BookOpen" className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Руководство</h3>
              <p>Подробное руководство по использованию торгового журнала</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreatePlanDialog
        open={createPlanOpen}
        onOpenChange={setCreatePlanOpen}
        onCreatePlan={createPlan}
        recentPairs={recentPairs}
        constants={constants}
      />

      <ExecutePlanDialog
        open={executePlanOpen}
        onOpenChange={setExecutePlanOpen}
        plan={selectedPlan}
        onExecutePlan={executePlan}
        psychologyTags={constants.PSYCHOLOGY_TAGS}
      />
    </div>
  );
}

export default function Index() {
  return (
    <ThemeProvider>
      <TradingJournalContent />
    </ThemeProvider>
  );
}