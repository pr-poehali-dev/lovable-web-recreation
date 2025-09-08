import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTradingPlans } from "@/hooks/useTradingPlans";
import { CreatePlanDialog } from "@/components/CreatePlanDialog";
import { ExecutePlanDialog } from "@/components/ExecutePlanDialog";
import { TradeDetailsDialog } from "@/components/TradeDetailsDialog";
import { JournalHeader } from "@/components/JournalHeader";
import { DashboardContent } from "@/components/DashboardContent";
import { AllPlansTab } from "@/components/AllPlansTab";
import { ActivePlansTab } from "@/components/ActivePlansTab";
import { TradesTab } from "@/components/TradesTab";
import { SettingsTab } from "@/components/SettingsTab";
import { EmptyTab } from "@/components/EmptyTabs";
import Icon from "@/components/ui/icon";

function TradingJournalContent() {
  const { 
    activePlans, 
    executedTrades, 
    plans,
    recentPairs, 
    userSettings,
    createPlan, 
    executePlan,
    deleteTrade,
    deleteAllTrades,
    restorePlanFromTrade,
    updateUserSettings,
    constants 
  } = useTradingPlans();

  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [executePlanOpen, setExecutePlanOpen] = useState(false);
  const [tradeDetailsOpen, setTradeDetailsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
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

  const handleViewTradeDetails = (trade: any) => {
    setSelectedTrade(trade);
    setTradeDetailsOpen(true);
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.currencyPair.toLowerCase().includes(planFilters.search.toLowerCase()) ||
                         plan.comment.toLowerCase().includes(planFilters.search.toLowerCase());
    const matchesSetup = planFilters.setup === 'all' || plan.setup === planFilters.setup;
    return matchesSearch && matchesSetup;
  });

  return (
    <div className="min-h-screen bg-background">
      <JournalHeader 
        activePlansCount={activePlans.length}
        onCreatePlan={() => setCreatePlanOpen(true)}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
              Активные ({activePlans.length})
            </TabsTrigger>
            <TabsTrigger value="trades" className="flex items-center gap-2">
              <Icon name="List" className="h-4 w-4" />
              Все сделки ({executedTrades.length})
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

          <TabsContent value="dashboard">
            <DashboardContent
              totalTrades={totalTrades}
              winningTrades={winningTrades}
              winrate={winrate}
              totalR={totalR}
              avgR={avgR}
              maxWin={maxWin}
              maxLoss={maxLoss}
              activePlans={activePlans}
              executedTrades={executedTrades}
            />
          </TabsContent>

          <TabsContent value="plans">
            <AllPlansTab
              filteredPlans={filteredPlans}
              planFilters={planFilters}
              setPlanFilters={setPlanFilters}
              constants={constants}
              onExecutePlan={handleExecutePlan}
            />
          </TabsContent>

          <TabsContent value="active">
            <ActivePlansTab
              activePlans={activePlans}
              onExecutePlan={handleExecutePlan}
            />
          </TabsContent>

          <TabsContent value="trades">
            <TradesTab
              executedTrades={executedTrades}
              constants={constants}
              onDeleteAllTrades={deleteAllTrades}
              onDeleteTrade={deleteTrade}
              onRestoreTrade={restorePlanFromTrade}
              onViewTradeDetails={handleViewTradeDetails}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab
              userSettings={userSettings}
              updateUserSettings={updateUserSettings}
            />
          </TabsContent>

          <TabsContent value="guide">
            <EmptyTab
              icon="BookOpen"
              title="Руководство"
              description="Подробное руководство по использованию торгового журнала"
            />
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

      <TradeDetailsDialog
        open={tradeDetailsOpen}
        onOpenChange={setTradeDetailsOpen}
        trade={selectedTrade}
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