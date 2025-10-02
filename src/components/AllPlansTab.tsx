import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TradingPlan } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface AllPlansTabProps {
  filteredPlans: TradingPlan[];
  planFilters: {
    search: string;
    status: string;
    setup: string;
  };
  setPlanFilters: (filters: any) => void;
  constants: {
    SETUPS: string[];
  };
  onExecutePlan: (plan: TradingPlan) => void;
  onDeletePlan: (planId: string) => void;
}

export function AllPlansTab({
  filteredPlans,
  planFilters,
  setPlanFilters,
  constants,
  onExecutePlan,
  onDeletePlan
}: AllPlansTabProps) {
  return (
    <div className="space-y-6">
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
                onChange={(e) => setPlanFilters((prev: any) => ({ ...prev, search: e.target.value }))}
                className="flex-1"
              />
              <Select value={planFilters.setup} onValueChange={(value) => setPlanFilters((prev: any) => ({ ...prev, setup: value }))}>
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
                          onClick={() => onExecutePlan(plan)}
                          className="bg-profit hover:bg-profit/90 text-white"
                        >
                          Execute
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onDeletePlan(plan.id)}
                        className="text-loss border-loss hover:bg-loss/10"
                      >
                        <Icon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}