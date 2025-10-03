import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MultiSelect } from '@/components/ui/multi-select';
import Icon from '@/components/ui/icon';
import { TradingPlan, ExecutedTrade } from '@/hooks/useTradingPlans';
import { PsychologyTag } from '@/types/psychology';

interface ExecutePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: TradingPlan | null;
  onExecutePlan: (
    planId: string,
    executionData: {
      executionType: ExecutedTrade['executionType'];
      actualExitPrice: number;
      psychologyTags: string[];
      executionNotes: string;
    }
  ) => void;
  psychologyTags: PsychologyTag[];
}

export function ExecutePlanDialog({
  open,
  onOpenChange,
  plan,
  onExecutePlan,
  psychologyTags
}: ExecutePlanDialogProps) {
  const [executionType, setExecutionType] = useState<ExecutedTrade['executionType']>('manual-close');
  const [actualExitPrice, setActualExitPrice] = useState('');
  const [selectedPsychologyTags, setSelectedPsychologyTags] = useState<string[]>([]);
  const [executionNotes, setExecutionNotes] = useState('');
  const [actualR, setActualR] = useState<number | null>(null);

  React.useEffect(() => {
    if (executionType === 'stop-loss') {
      setActualR(-1);
      return;
    }
    
    if (plan && actualExitPrice) {
      const exit = parseFloat(actualExitPrice);
      if (!isNaN(exit)) {
        const riskAmount = Math.abs(plan.entryPrice - plan.stopLoss);
        const actualReturn = plan.direction === 'Long' 
          ? exit - plan.entryPrice 
          : plan.entryPrice - exit;
        const rValue = actualReturn / riskAmount;
        setActualR(Number(rValue.toFixed(2)));
      }
    } else {
      setActualR(null);
    }
  }, [plan, actualExitPrice, executionType]);

  React.useEffect(() => {
    if (executionType === 'take-profit' && plan) {
      setActualExitPrice(plan.takeProfit.toString());
    } else if (executionType === 'stop-loss' && plan) {
      setActualExitPrice(plan.stopLoss.toString());
    } else {
      setActualExitPrice('');
    }
  }, [executionType, plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plan || selectedPsychologyTags.length === 0) return;

    onExecutePlan(plan.id, {
      executionType,
      actualExitPrice: parseFloat(actualExitPrice),
      psychologyTags: selectedPsychologyTags,
      executionNotes
    });

    // Reset form
    setExecutionType('manual-close');
    setActualExitPrice('');
    setSelectedPsychologyTags([]);
    setExecutionNotes('');
    setActualR(null);
    onOpenChange(false);
  };

  const isFormValid = actualExitPrice && selectedPsychologyTags.length > 0;

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Play" className="h-5 w-5" />
            Execute Plan: {plan.currencyPair}
            <div className="flex items-center gap-1 ml-2">
              <Icon name={plan.direction === 'Long' ? 'TrendingUp' : 'TrendingDown'} 
                    className={`h-4 w-4 ${plan.direction === 'Long' ? 'text-profit' : 'text-loss'}`} />
              <span className="text-sm font-normal">{plan.direction}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Summary */}
          <div className="p-4 bg-muted/20 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Plan Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Entry:</span> {plan.entryPrice}
              </div>
              <div>
                <span className="text-muted-foreground">Stop Loss:</span> {plan.stopLoss}
              </div>
              <div>
                <span className="text-muted-foreground">Take Profit:</span> {plan.takeProfit}
              </div>
              <div>
                <span className="text-muted-foreground">Expected R:</span> 
                <Badge variant="outline" className="ml-1">
                  {plan.expectedR > 0 ? '+' : ''}{plan.expectedR}R
                </Badge>
              </div>
            </div>
          </div>

          {/* Execution Type */}
          <div className="space-y-2">
            <Label>Execution Type</Label>
            <Select value={executionType} onValueChange={(value: ExecutedTrade['executionType']) => setExecutionType(value)}>
              <SelectTrigger className="bg-profit/10 border-profit/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="take-profit">
                  <div className="flex items-center gap-2">
                    <Icon name="Target" className="h-4 w-4 text-profit" />
                    Take Profit Hit
                  </div>
                </SelectItem>
                <SelectItem value="stop-loss">
                  <div className="flex items-center gap-2">
                    <Icon name="StopCircle" className="h-4 w-4 text-loss" />
                    Stop Loss Hit
                  </div>
                </SelectItem>
                <SelectItem value="manual-close">
                  <div className="flex items-center gap-2">
                    <Icon name="Hand" className="h-4 w-4 text-neutral" />
                    Manual Close
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actual Exit Price */}
          <div className="space-y-2">
            <Label htmlFor="actualExitPrice">Actual Exit Price</Label>
            <Input
              id="actualExitPrice"
              type="number"
              step="0.00001"
              value={actualExitPrice}
              onChange={(e) => setActualExitPrice(e.target.value)}
              className="bg-muted/20"
              placeholder="Enter exit price"
              disabled={executionType === 'take-profit' || executionType === 'stop-loss'}
            />
          </div>

          {/* Psychology Tags */}
          <div className="space-y-3">
            <Label className="text-loss">Psychology Tags (Required) *</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {psychologyTags.map((tag) => {
                const isSelected = selectedPsychologyTags.includes(typeof tag === 'string' ? tag : tag.name);
                const tagName = typeof tag === 'string' ? tag : tag.name;
                const tagData = typeof tag === 'string' ? null : tag;
                
                return (
                  <button
                    key={tagName}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPsychologyTags(prev => prev.filter(t => t !== tagName));
                      } else {
                        setSelectedPsychologyTags(prev => [...prev, tagName]);
                      }
                    }}
                    className={`
                      w-full text-left p-3 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? tagData?.category === 'good' 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : tagData?.category === 'bad'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-border bg-muted/10 hover:bg-muted/20'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          tagData?.color === 'green' ? 'bg-green-500' :
                          tagData?.color === 'red' ? 'bg-red-500' :
                          tagData?.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'
                        }`} 
                      />
                      <div className="flex-1">
                        <div className="font-medium">{tagName}</div>
                        {tagData?.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {tagData.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <Icon name="Check" className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedPsychologyTags.length === 0 && (
              <p className="text-xs text-loss">You must select at least one psychology tag to execute the plan</p>
            )}
          </div>

          {/* Actual R Display */}
          {actualR !== null && (
            <div className={`p-3 rounded-lg border ${actualR >= 0 ? 'bg-profit/10 border-profit/20' : 'bg-loss/10 border-loss/20'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Actual R:</span>
                <div className="flex items-center gap-2">
                  <Badge className={actualR >= 0 ? 'bg-profit text-white' : 'bg-loss text-white'}>
                    {actualR > 0 ? '+' : ''}{actualR}R
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {actualR >= 0 ? 'Winning trade' : 'Losing trade'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Execution Notes */}
          <div className="space-y-2">
            <Label htmlFor="executionNotes">Execution Notes (Optional)</Label>
            <Textarea
              id="executionNotes"
              value={executionNotes}
              onChange={(e) => setExecutionNotes(e.target.value)}
              className="bg-muted/20 min-h-[60px]"
              placeholder="Notes about the execution..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="flex-1 text-white bg-profit hover:bg-profit/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Выполнить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}