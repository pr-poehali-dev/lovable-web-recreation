import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TradingPlan } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface ActivePlansTabProps {
  activePlans: TradingPlan[];
  onExecutePlan: (plan: TradingPlan) => void;
}

export function ActivePlansTab({ activePlans, onExecutePlan }: ActivePlansTabProps) {
  return (
    <div className="space-y-6">
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
                        onClick={() => onExecutePlan(plan)}
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
    </div>
  );
}