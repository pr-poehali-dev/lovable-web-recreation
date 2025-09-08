import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';
import { TradingPlan } from '@/hooks/useTradingPlans';

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePlan: (plan: Omit<TradingPlan, 'id' | 'status' | 'createdAt'>) => void;
  recentPairs: string[];
  constants: {
    CURRENCY_PAIRS: string[];
    SETUPS: string[];
    SESSIONS: string[];
    STRATEGIES: string[];
  };
}

export function CreatePlanDialog({ 
  open, 
  onOpenChange, 
  onCreatePlan, 
  recentPairs,
  constants 
}: CreatePlanDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('ru-RU'),
    currencyPair: recentPairs[0] || 'BTCUSDT',
    direction: 'Long' as 'Long' | 'Short',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    commission: '0.04',
    setup: '',
    session: '',
    strategy: '',
    comment: ''
  });

  const [pairSelectorOpen, setPairSelectorOpen] = useState(false);
  const [expectedR, setExpectedR] = useState(0);

  useEffect(() => {
    if (formData.entryPrice && formData.stopLoss && formData.takeProfit) {
      const entry = parseFloat(formData.entryPrice);
      const stop = parseFloat(formData.stopLoss);
      const take = parseFloat(formData.takeProfit);
      const commission = parseFloat(formData.commission) / 100;
      
      if (!isNaN(entry) && !isNaN(stop) && !isNaN(take)) {
        const risk = Math.abs(entry - stop);
        const reward = Math.abs(take - entry);
        const commissionCost = entry * commission * 2; // Round trip
        const netReward = reward - commissionCost;
        const rValue = netReward / risk;
        setExpectedR(Number(rValue.toFixed(2)));
      }
    }
  }, [formData.entryPrice, formData.stopLoss, formData.takeProfit, formData.commission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onCreatePlan({
      date: formData.date,
      currencyPair: formData.currencyPair,
      direction: formData.direction,
      entryPrice: parseFloat(formData.entryPrice),
      stopLoss: parseFloat(formData.stopLoss),
      takeProfit: parseFloat(formData.takeProfit),
      commission: parseFloat(formData.commission),
      setup: formData.setup,
      session: formData.session,
      strategy: formData.strategy,
      comment: formData.comment,
      expectedR
    });

    // Reset form
    setFormData({
      date: new Date().toLocaleDateString('ru-RU'),
      currencyPair: recentPairs[0] || 'BTCUSDT',
      direction: 'Long',
      entryPrice: '',
      stopLoss: '',
      takeProfit: '',
      commission: '0.04',
      setup: '',
      session: '',
      strategy: '',
      comment: ''
    });
    setExpectedR(0);
    onOpenChange(false);
  };

  const isFormValid = formData.entryPrice && formData.stopLoss && formData.takeProfit && 
                     formData.setup && formData.session && formData.strategy;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Target" className="h-5 w-5" />
            Create Trading Plan
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="bg-muted/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Currency Pair</Label>
              <Popover open={pairSelectorOpen} onOpenChange={setPairSelectorOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-muted/20">
                    {formData.currencyPair}
                    <Icon name="ChevronsUpDown" className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search currency pair..." />
                    <CommandEmpty>No pair found.</CommandEmpty>
                    {recentPairs.length > 0 && (
                      <CommandGroup heading="Recent">
                        {recentPairs.map((pair) => (
                          <CommandItem
                            key={`recent-${pair}`}
                            value={pair}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, currencyPair: pair }));
                              setPairSelectorOpen(false);
                            }}
                          >
                            <Badge variant="secondary" className="mr-2">Recent</Badge>
                            {pair}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    <CommandGroup heading="All Pairs">
                      {constants.CURRENCY_PAIRS.map((pair) => (
                        <CommandItem
                          key={pair}
                          value={pair}
                          onSelect={() => {
                            setFormData(prev => ({ ...prev, currencyPair: pair }));
                            setPairSelectorOpen(false);
                          }}
                        >
                          {pair}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select 
                value={formData.direction} 
                onValueChange={(value: 'Long' | 'Short') => 
                  setFormData(prev => ({ ...prev, direction: value }))
                }
              >
                <SelectTrigger className="bg-muted/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Long">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingUp" className="h-4 w-4 text-profit" />
                      Long
                    </div>
                  </SelectItem>
                  <SelectItem value="Short">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingDown" className="h-4 w-4 text-loss" />
                      Short
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00001"
                value={formData.entryPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
                className="bg-muted/20"
                placeholder="112588"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.00001"
                value={formData.stopLoss}
                onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: e.target.value }))}
                className="bg-muted/20"
                placeholder="112255"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit</Label>
              <Input
                id="takeProfit"
                type="number"
                step="0.00001"
                value={formData.takeProfit}
                onChange={(e) => setFormData(prev => ({ ...prev, takeProfit: e.target.value }))}
                className="bg-muted/20"
                placeholder="113122"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                step="0.01"
                value={formData.commission}
                onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                className="bg-muted/20"
                placeholder="0.04"
              />
            </div>

            <div className="space-y-2">
              <Label>Setup</Label>
              <Select 
                value={formData.setup} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, setup: value }))}
              >
                <SelectTrigger className="bg-muted/20">
                  <SelectValue placeholder="Select setup" />
                </SelectTrigger>
                <SelectContent>
                  {constants.SETUPS.map(setup => (
                    <SelectItem key={setup} value={setup}>{setup}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Session</Label>
              <Select 
                value={formData.session} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, session: value }))}
              >
                <SelectTrigger className="bg-muted/20">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {constants.SESSIONS.map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Strategy</Label>
              <Select 
                value={formData.strategy} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value }))}
              >
                <SelectTrigger className="bg-muted/20">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {constants.STRATEGIES.map(strategy => (
                    <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {expectedR !== 0 && (
            <div className="p-3 bg-profit/10 border border-profit/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="Target" className="h-4 w-4 text-profit" />
                <span className="text-sm font-medium">Expected R (with commission):</span>
                <Badge variant="secondary" className={expectedR > 0 ? 'bg-profit text-white' : 'bg-loss text-white'}>
                  {expectedR > 0 ? '+' : ''}{expectedR.toFixed(2)}R
                </Badge>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="bg-muted/20 border-profit/20 focus:border-profit min-h-[80px]"
              placeholder="Trade analysis and notes..."
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
              className="flex-1 bg-profit hover:bg-profit/90 text-white"
            >
              Create Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}