import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExecutedTrade } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface TradesTabProps {
  executedTrades: ExecutedTrade[];
  constants: {
    SETUPS: string[];
    SESSIONS: string[];
  };
  onDeleteAllTrades: () => void;
  onDeleteTrade: (tradeId: string) => void;
  onRestoreTrade: (trade: ExecutedTrade) => void;
  onViewTradeDetails: (trade: ExecutedTrade) => void;
}

export function TradesTab({
  executedTrades,
  constants,
  onDeleteAllTrades,
  onDeleteTrade,
  onRestoreTrade,
  onViewTradeDetails
}: TradesTabProps) {
  return (
    <div className="space-y-6">
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Input placeholder="Search trades..." className="w-64" />
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Setups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Setups</SelectItem>
                    {constants.SETUPS.map(setup => (
                      <SelectItem key={setup} value={setup}>{setup}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {constants.SESSIONS.map(session => (
                      <SelectItem key={session} value={session}>{session}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="wins">Wins Only</SelectItem>
                    <SelectItem value="losses">Losses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{executedTrades.length} of {executedTrades.length} trades</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDeleteAllTrades}
                  className="text-loss hover:bg-loss/10"
                >
                  <Icon name="Trash2" className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">All Trades ({executedTrades.length})</h3>
              {executedTrades.map(trade => (
                <Card key={trade.id} className="bg-card/60 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Icon name={trade.actualR >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                              className={`h-6 w-6 ${trade.actualR >= 0 ? 'text-profit' : 'text-loss'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{trade.currencyPair}</span>
                            <span className="text-sm text-muted-foreground">{trade.date}</span>
                            <span className="text-xs text-muted-foreground">
                              Auto-executed: {trade.executionType.replace('-', '_')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{trade.setup}</Badge>
                          <Badge variant="outline" className="text-xs">{trade.session}</Badge>
                          {trade.psychologyTags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs bg-orange-100 text-orange-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Badge className={`${trade.actualR >= 0 ? 'bg-profit' : 'bg-loss'} text-white`}>
                          {trade.actualR > 0 ? '+' : ''}{trade.actualR}R
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewTradeDetails(trade)}
                          >
                            <Icon name="Eye" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRestoreTrade(trade)}
                            className="text-profit hover:bg-profit/10"
                          >
                            <Icon name="RotateCcw" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteTrade(trade.id)}
                            className="text-loss hover:bg-loss/10"
                          >
                            <Icon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}