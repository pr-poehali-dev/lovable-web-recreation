import { useState, useCallback } from 'react';

export interface TradingPlan {
  id: string;
  date: string;
  currencyPair: string;
  direction: 'Long' | 'Short';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  commission: number;
  setup: string;
  session: string;
  strategy: string;
  comment: string;
  expectedR: number;
  status: 'active' | 'executed';
  createdAt: number;
}

export interface ExecutedTrade extends TradingPlan {
  executionType: 'take-profit' | 'stop-loss' | 'manual-close';
  actualExitPrice: number;
  actualR: number;
  psychologyTags: string[];
  executionNotes: string;
  executedAt: number;
}

const CURRENCY_PAIRS = [
  'BTCUSDT', 'ETHUSDT', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD'
];

const SETUPS = [
  'Liquidity Grab', 'BOS', 'SMC', 'FVG', 'ICT Kill Zone', 'Price Action', 'OB'
];

const SESSIONS = ['NY', 'London', 'Asia', 'Sydney'];
const STRATEGIES = ['Intraday', 'Swing', 'Scalping'];

const PSYCHOLOGY_TAGS = [
  'Rule Break: Entry',
  'Rule Break: Size', 
  'Revenge Trade',
  'Missed Trade',
  'Early Exit',
  'Hoped Hope',
  'Averaging Down'
];

export function useTradingPlans() {
  const [plans, setPlans] = useState<TradingPlan[]>([]);
  const [executedTrades, setExecutedTrades] = useState<ExecutedTrade[]>([]);
  const [recentPairs, setRecentPairs] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent-currency-pairs');
    return saved ? JSON.parse(saved) : ['BTCUSDT'];
  });

  const addRecentPair = useCallback((pair: string) => {
    setRecentPairs(prev => {
      const updated = [pair, ...prev.filter(p => p !== pair)].slice(0, 5);
      localStorage.setItem('recent-currency-pairs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const createPlan = useCallback((planData: Omit<TradingPlan, 'id' | 'status' | 'createdAt'>) => {
    const newPlan: TradingPlan = {
      ...planData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: Date.now()
    };
    
    setPlans(prev => [newPlan, ...prev]);
    addRecentPair(planData.currencyPair);
    return newPlan;
  }, [addRecentPair]);

  const executePlan = useCallback((
    planId: string, 
    executionData: {
      executionType: ExecutedTrade['executionType'];
      actualExitPrice: number;
      psychologyTags: string[];
      executionNotes: string;
    }
  ) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;

    const riskAmount = plan.entryPrice - plan.stopLoss;
    const actualReturn = executionData.actualExitPrice - plan.entryPrice;
    const actualR = actualReturn / Math.abs(riskAmount);

    const executedTrade: ExecutedTrade = {
      ...plan,
      ...executionData,
      actualR: Number(actualR.toFixed(2)),
      executedAt: Date.now()
    };

    setExecutedTrades(prev => [executedTrade, ...prev]);
    // Change plan status to executed instead of removing it
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, status: 'executed' as const } : p
    ));
    
    return executedTrade;
  }, [plans]);

  const deleteTrade = useCallback((tradeId: string) => {
    setExecutedTrades(prev => prev.filter(t => t.id !== tradeId));
  }, []);

  const deleteAllTrades = useCallback(() => {
    setExecutedTrades([]);
  }, []);

  const restorePlanFromTrade = useCallback((trade: ExecutedTrade) => {
    // Remove trade and restore plan as active
    setExecutedTrades(prev => prev.filter(t => t.id !== trade.id));
    setPlans(prev => prev.map(p => 
      p.id === trade.id ? { ...p, status: 'active' as const } : p
    ));
  }, []);

  const activePlans = plans.filter(p => p.status === 'active');

  return {
    plans,
    executedTrades,
    activePlans,
    recentPairs,
    createPlan,
    executePlan,
    deleteTrade,
    deleteAllTrades,
    restorePlanFromTrade,
    addRecentPair,
    constants: {
      CURRENCY_PAIRS,
      SETUPS,
      SESSIONS,
      STRATEGIES,
      PSYCHOLOGY_TAGS
    }
  };
}