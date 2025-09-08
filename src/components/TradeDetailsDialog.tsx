import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ExecutedTrade } from '@/hooks/useTradingPlans';

interface TradeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade: ExecutedTrade | null;
}

export function TradeDetailsDialog({ open, onOpenChange, trade }: TradeDetailsDialogProps) {
  if (!trade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name={trade.actualR >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                  className={`h-5 w-5 ${trade.actualR >= 0 ? 'text-profit' : 'text-loss'}`} />
            Trade Details - {trade.currencyPair}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trade Information */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Info" className="h-4 w-4" />
              <h4 className="font-medium">Trade Information</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Date</span>
                <div className="font-medium">{trade.date}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Trading Pair</span>
                <div className="font-medium">{trade.currencyPair}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Result</span>
                <Badge className={`${trade.actualR >= 0 ? 'bg-profit' : 'bg-loss'} text-white`}>
                  {trade.actualR >= 0 ? 'Win' : 'Loss'}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">R-Multiple</span>
                <div className={`font-bold text-lg ${trade.actualR >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {trade.actualR > 0 ? '+' : ''}{trade.actualR}R
                </div>
              </div>
            </div>
          </div>

          {/* Price Levels */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="DollarSign" className="h-4 w-4" />
              <h4 className="font-medium">Price Levels</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Entry Price</span>
                <div className="font-medium">{trade.entryPrice}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Stop Loss</span>
                <div className="font-medium text-loss">{trade.stopLoss}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Take Profit</span>
                <div className="font-medium text-profit">{trade.takeProfit}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">Actual Exit Price</span>
                <div className="font-medium text-lg">{trade.actualExitPrice}</div>
              </div>
            </div>
          </div>

          {/* Strategy & Setup */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Target" className="h-4 w-4" />
              <h4 className="font-medium">Strategy & Setup</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Setup</span>
                <div className="font-medium">{trade.setup}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Session</span>
                <div className="font-medium">{trade.session}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Strategy</span>
                <div className="font-medium">{trade.strategy}</div>
              </div>
            </div>
          </div>

          {/* Psychology Tags */}
          {trade.psychologyTags.length > 0 && (
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Brain" className="h-4 w-4" />
                <h4 className="font-medium">Psychology Tags</h4>
              </div>
              <div className="flex gap-2 flex-wrap">
                {trade.psychologyTags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Trade Notes */}
          {(trade.comment || trade.executionNotes) && (
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="FileText" className="h-4 w-4" />
                <h4 className="font-medium">Trade Notes</h4>
              </div>
              <div className="space-y-2">
                {trade.comment && (
                  <div>
                    <span className="text-sm text-muted-foreground">Plan Comment:</span>
                    <p className="text-sm">{trade.comment}</p>
                  </div>
                )}
                {trade.executionNotes && (
                  <div>
                    <span className="text-sm text-muted-foreground">Execution Notes:</span>
                    <p className="text-sm">{trade.executionNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Execution Details */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Clock" className="h-4 w-4" />
              <h4 className="font-medium">Execution Details</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Execution Type:</span>
                <div className="font-medium capitalize">
                  {trade.executionType.replace('-', ' ')}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Executed At:</span>
                <div className="font-medium">
                  {new Date(trade.executedAt).toLocaleString('ru-RU')}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Expected R:</span>
                <div className="font-medium">{trade.expectedR}R</div>
              </div>
              <div>
                <span className="text-muted-foreground">Commission:</span>
                <div className="font-medium">{trade.commission}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}