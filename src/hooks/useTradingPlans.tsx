import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PSYCHOLOGY_TAG_DEFINITIONS } from '@/types/psychology';

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

export interface UserSettings {
  customSetups: string[];
  customSessions: string[];
  customStrategies: string[];
}

const DEFAULT_CURRENCY_PAIRS = [
  'BTCUSDT', 'ETHUSDT', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD'
];

const DEFAULT_SETUPS = [
  'Liquidity Grab', 'BOS', 'SMC', 'FVG', 'ICT Kill Zone', 'Price Action', 'OB'
];

const DEFAULT_SESSIONS = ['NY', 'London', 'Asia', 'Sydney'];
const DEFAULT_STRATEGIES = ['Intraday', 'Swing', 'Scalping'];



export function useTradingPlans() {
  const [plans, setPlans] = useLocalStorage<TradingPlan[]>('trading-plans', []);
  const [executedTrades, setExecutedTrades] = useLocalStorage<ExecutedTrade[]>('executed-trades', []);
  const [recentPairs, setRecentPairs] = useLocalStorage<string[]>('recent-currency-pairs', ['BTCUSDT']);
  const [userSettings, setUserSettings] = useLocalStorage<UserSettings>('user-settings', {
    customSetups: [],
    customSessions: [],
    customStrategies: []
  });

  const addRecentPair = useCallback((pair: string) => {
    setRecentPairs(prev => {
      const updated = [pair, ...prev.filter(p => p !== pair)].slice(0, 5);
      return updated;
    });
  }, [setRecentPairs]);

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
  }, [addRecentPair, setPlans]);

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
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, status: 'executed' as const } : p
    ));
    
    return executedTrade;
  }, [plans, setExecutedTrades, setPlans]);

  const deleteTrade = useCallback((tradeId: string) => {
    setExecutedTrades(prev => prev.filter(t => t.id !== tradeId));
  }, [setExecutedTrades]);

  const deleteAllTrades = useCallback(() => {
    setExecutedTrades([]);
  }, [setExecutedTrades]);

  const restorePlanFromTrade = useCallback((trade: ExecutedTrade) => {
    setExecutedTrades(prev => prev.filter(t => t.id !== trade.id));
    setPlans(prev => prev.map(p => 
      p.id === trade.id ? { ...p, status: 'active' as const } : p
    ));
  }, [setExecutedTrades, setPlans]);

  const deletePlan = useCallback((planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
  }, [setPlans]);

  const updateUserSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...newSettings }));
  }, [setUserSettings]);

  const activePlans = plans.filter(p => p.status === 'active');

  const allSetups = [...DEFAULT_SETUPS, ...userSettings.customSetups];
  const allSessions = [...DEFAULT_SESSIONS, ...userSettings.customSessions];
  const allStrategies = [...DEFAULT_STRATEGIES, ...userSettings.customStrategies];

  return {
    plans,
    executedTrades,
    activePlans,
    recentPairs,
    userSettings,
    createPlan,
    executePlan,
    deleteTrade,
    deleteAllTrades,
    restorePlanFromTrade,
    deletePlan,
    addRecentPair,
    updateUserSettings,
    constants: {
      CURRENCY_PAIRS: DEFAULT_CURRENCY_PAIRS,
      SETUPS: allSetups,
      SESSIONS: allSessions,
      STRATEGIES: allStrategies,
      PSYCHOLOGY_TAGS: PSYCHOLOGY_TAG_DEFINITIONS
    }
  };
}