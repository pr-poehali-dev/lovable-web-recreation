import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { TradingPlan } from '@/hooks/useTradingPlans';

interface OutcomeAnalysisWidgetProps {
  activePlans: TradingPlan[];
  historicalWinrate?: number;
}

export function OutcomeAnalysisWidget({ activePlans, historicalWinrate = 65 }: OutcomeAnalysisWidgetProps) {
  if (activePlans.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Полный анализ исходов</CardTitle>
          <p className="text-sm text-muted-foreground">
            Анализ всех возможных исходов активных планов
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Icon name="Target" className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Нет активных планов для анализа</p>
              <p className="text-sm mt-2">
                Создайте торговый план, чтобы увидеть анализ потенциальных исходов
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate potential outcomes
  const totalPlans = activePlans.length;
  const totalPossibleWins = Math.round(totalPlans * (historicalWinrate / 100));
  const totalPossibleLosses = totalPlans - totalPossibleWins;

  const bestCaseR = activePlans.reduce((sum, plan) => sum + plan.expectedR, 0);
  const worstCaseR = -totalPlans; // Assuming -1R loss for each
  const expectedR = bestCaseR * (historicalWinrate / 100) + worstCaseR * (1 - historicalWinrate / 100);

  // Create scenario analysis
  const scenarios = [
    {
      name: 'Лучший сценарий',
      icon: 'TrendingUp',
      probability: Math.pow(historicalWinrate / 100, totalPlans) * 100,
      outcome: `+${bestCaseR.toFixed(2)}R`,
      description: `${totalPlans} прибыльных, 0 убыточных`,
      type: 'best'
    },
    {
      name: 'Худший сценарий', 
      icon: 'TrendingDown',
      probability: Math.pow(1 - historicalWinrate / 100, totalPlans) * 100,
      outcome: `${worstCaseR.toFixed(2)}R`,
      description: `0 прибыльных, ${totalPlans} убыточных`,
      type: 'worst'
    },
    {
      name: 'Ожидаемое значение',
      icon: 'Target',
      probability: 0, // Will be calculated differently
      outcome: `${expectedR > 0 ? '+' : ''}${expectedR.toFixed(2)}R`,
      description: `${totalPossibleWins} прибыльных, ${totalPossibleLosses} убыточных`,
      type: 'expected'
    }
  ];

  // Most likely scenarios based on binomial distribution
  const mostLikelyScenarios = [];
  for (let wins = 0; wins <= totalPlans; wins++) {
    const losses = totalPlans - wins;
    const winR = activePlans.slice(0, wins).reduce((sum, plan) => sum + plan.expectedR, 0);
    const lossR = losses * -1; // Assuming -1R per loss
    const totalR = winR + lossR;
    
    // Binomial probability
    const probability = binomialProbability(totalPlans, wins, historicalWinrate / 100) * 100;
    
    mostLikelyScenarios.push({
      wins,
      losses,
      probability,
      outcome: totalR,
      description: `${wins} прибыльных, ${losses} убыточных`
    });
  }

  // Sort by probability and take top 3
  const topScenarios = mostLikelyScenarios
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle>Полный анализ исходов</CardTitle>
        <p className="text-sm text-muted-foreground">
          Анализ {totalPlans} возможных исходов для {totalPlans} активных планов
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Scenarios */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  scenario.type === 'best' ? 'bg-profit/10 border-profit/20' :
                  scenario.type === 'worst' ? 'bg-loss/10 border-loss/20' :
                  'bg-neutral/10 border-neutral/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={scenario.icon} className={`h-4 w-4 ${
                    scenario.type === 'best' ? 'text-profit' :
                    scenario.type === 'worst' ? 'text-loss' : 
                    'text-neutral'
                  }`} />
                  <span className="font-medium text-sm">{scenario.name}</span>
                </div>
                <div className={`text-lg font-bold ${
                  scenario.type === 'best' ? 'text-profit' :
                  scenario.type === 'worst' ? 'text-loss' :
                  parseFloat(scenario.outcome) >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {scenario.outcome}
                </div>
                {scenario.probability > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {scenario.probability.toFixed(1)}% вероятность
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {scenario.description}
                </div>
              </div>
            ))}
          </div>

          {/* Most Probable Scenarios */}
          <div>
            <h4 className="font-medium text-sm mb-3">Наиболее вероятные сценарии</h4>
            <div className="space-y-2">
              {topScenarios.map((scenario, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{scenario.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Вероятность: {scenario.probability.toFixed(1)}%
                    </span>
                    <Badge className={`text-xs ${scenario.outcome >= 0 ? 'bg-profit text-white' : 'bg-loss text-white'}`}>
                      {scenario.outcome > 0 ? '+' : ''}{scenario.outcome.toFixed(2)}R
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
            <p>• Ожидаемое значение рассчитывается на основе исторического винрейта {historicalWinrate}%</p>
            <p>• Сценарии ранжированы по вероятности возникновения</p>
            <p>• При текущем винрейте {historicalWinrate}%, математическое ожидание: {expectedR > 0 ? '+' : ''}{expectedR.toFixed(2)}R</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for binomial probability
function binomialProbability(n: number, k: number, p: number): number {
  const binomialCoeff = factorial(n) / (factorial(k) * factorial(n - k));
  return binomialCoeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}