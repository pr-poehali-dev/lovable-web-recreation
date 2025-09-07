import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="TrendingUp" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Торговый журнал</h1>
              <p className="text-sm text-muted-foreground">R-Анализ и трекер производительности</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-muted-foreground">
              <Icon name="Clock" className="h-3 w-3 mr-1" />
              0 Активных планов
            </Badge>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Создать план
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
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
              Активные
            </TabsTrigger>
            <TabsTrigger value="trades" className="flex items-center gap-2">
              <Icon name="List" className="h-4 w-4" />
              Все сделки
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

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Analysis Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Анализ производительности</h2>
                <Button variant="outline" size="sm">
                  <Icon name="Calendar" className="h-4 w-4 mr-2" />
                  Select Date Range / Выбрать период
                </Button>
              </div>
              <p className="text-muted-foreground">Выберите период для анализа</p>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Всего сделок</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20</div>
                  <p className="text-xs text-muted-foreground">сделок</p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Винрейт</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-profit">65.0%</div>
                  <p className="text-xs text-muted-foreground">13/20</p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Средний R</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-profit">+0.84R</div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Общий R</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-profit">+16.84R</div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Профит фактор</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.41</div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Макс просадка</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.00R</div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Макс выигрыш</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-profit">3.62R</div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Макс убыток</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-loss">-1.00R</div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Макс побед подряд</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Макс убытков подряд</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Capital Curve Chart */}
              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Кривая капитала</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        График баланса со скользящим ожиданием
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="bg-profit text-white">%</Button>
                      <Button size="sm" variant="outline">R</Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Текущее ожидание: <strong className="text-profit">0.829R</strong></span>
                    <Badge variant="secondary" className="bg-profit/10 text-profit">Улучшается</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Icon name="TrendingUp" className="h-12 w-12 mx-auto mb-2" />
                      <p>График кривой капитала</p>
                      <p className="text-xs">Интерактивная визуализация роста капитала</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <span className="block text-xs text-muted-foreground">Окно 10</span>
                      <span className="block">20</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs text-muted-foreground">20</span>
                      <span className="block">30</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs text-muted-foreground">30</span>
                      <span className="block">50</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs text-muted-foreground">50</span>
                      <span className="block">50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Distribution */}
              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">Total Trades</span>
                      <div className="text-2xl font-bold">20</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total PnL</span>
                      <div className="text-2xl font-bold text-profit">+16.84R</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Median R</span>
                      <div className="text-2xl font-bold">+1.12R</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-profit"></div>
                        <span className="text-sm">Wins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-loss"></div>
                        <span className="text-sm">Losses</span>
                      </div>
                    </div>
                    <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Icon name="BarChart3" className="h-12 w-12 mx-auto mb-2" />
                        <p>Гистограмма производительности</p>
                        <p className="text-xs">Распределение результатов по диапазонам R</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <p>Profitable ranges: 7 of 8 ranges</p>
                    <p>Best performing range: 1.5R to 2.0R</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Psychological Analysis Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Psychology Errors Map */}
              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Карта психологических ошибок</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Визуализация частоты ошибок по сетапам и сессиям
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { setup: "Liquidity Grab", sessions: ["200%", "-", "67%", "0%"] },
                      { setup: "BOS", sessions: ["0%", "100%", "0%", "-"] },
                      { setup: "SMC", sessions: ["-", "0%", "200%", "-"] },
                      { setup: "FVG", sessions: ["0%", "67%", "50%", "-"] },
                      { setup: "ICT Kill Zone", sessions: ["0%", "-", "-", "-"] },
                      { setup: "Price Action", sessions: ["-", "-", "-", "0%"] },
                      { setup: "OB", sessions: ["-", "0%", "-", "-"] }
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 text-sm">
                        <div className="font-medium text-left">{row.setup}</div>
                        {row.sessions.map((value, j) => (
                          <div
                            key={j}
                            className={`text-center p-2 rounded ${
                              value === "-" ? "bg-muted/20" :
                              value === "0%" ? "bg-neutral/20 text-neutral" :
                              parseInt(value) > 100 ? "bg-loss/20 text-loss" :
                              "bg-profit/20 text-profit"
                            }`}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-neutral/20"></div>
                      <span>Чисто (0%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-muted/20"></div>
                      <span>Немного (&lt;20%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-profit/20"></div>
                      <span>Много (20-50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-loss/20"></div>
                      <span>Критично (&gt;50%)</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Кликните на ячейку для подробного анализа ошибок в этой комбинации
                  </p>
                </CardContent>
              </Card>

              {/* R Analysis Heatmap */}
              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>R-Анализ по Сетапам и Сессиям</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Интерактивная тепловая карта производительности
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { setup: "Liquidity Grab", sessions: ["0.7", "-", "1.1", "2.7"] },
                      { setup: "BOS", sessions: ["2.0", "1.2", "1.6", "-"] },
                      { setup: "SMC", sessions: ["-", "-1.0", "1.6", "-"] },
                      { setup: "FVG", sessions: ["-1.0", "0.7", "0.0", "-"] },
                      { setup: "ICT Kill Zone", sessions: ["3.6", "-", "-", "-"] },
                      { setup: "Price Action", sessions: ["-", "-", "-", "-1.0"] },
                      { setup: "OB", sessions: ["-", "2.0", "-", "-"] }
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 text-sm">
                        <div className="font-medium text-left">{row.setup}</div>
                        {row.sessions.map((value, j) => (
                          <div
                            key={j}
                            className={`text-center p-2 rounded font-medium ${
                              value === "-" ? "bg-muted/20 text-muted-foreground" :
                              parseFloat(value) < 0 ? "bg-loss text-white" :
                              parseFloat(value) > 2 ? "bg-profit text-white" :
                              parseFloat(value) > 0 ? "bg-profit/70 text-white" :
                              "bg-muted text-foreground"
                            }`}
                          >
                            {value === "-" ? "-" : `${value}`}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-loss"></div>
                      <span>Poor (-2R+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-muted/60"></div>
                      <span>Neutral</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-profit"></div>
                      <span>Excellent (+2R+)</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Click cells to filter trades</p>
                </CardContent>
              </Card>
            </div>

            {/* P&L Distribution and Full Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* P&L Distribution */}
              <Card className="bg-card/60 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Распределение P&L</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Анализ распределения результатов сделок по концепции Тендера
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Среднее</div>
                        <div className="font-semibold">0.84R</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Медиана</div>
                        <div className="font-semibold">1.22R</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Ст. отклонение</div>
                        <div className="font-semibold">1.52R</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Размах</div>
                        <div className="font-semibold">-1.0 / 3.6R</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Процентили</div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        {[
                          { label: "5%", value: "-1.00R" },
                          { label: "25%", value: "-1.00R" },
                          { label: "75%", value: "2.00R" },
                          { label: "95%", value: "3.62R" }
                        ].map((item, i) => (
                          <div key={i} className="text-center p-2 bg-muted/20 rounded">
                            <div className="text-muted-foreground">{item.label}</div>
                            <div className="font-semibold">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Icon name="BarChart" className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Гистограмма распределения</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Распределение показывает реальные ожидания от вашей торговой системы</p>
                      <p>• Используйте процентили для управления психологическими ожиданиями</p>
                      <p>• 50% ваших сделок будут в диапазоне -1.0R - 2.0R</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Full Outcome Analysis */}
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
                      <Button className="mt-4" size="sm">
                        <Icon name="Plus" className="h-4 w-4 mr-2" />
                        Создать первый план
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tab contents can be added here */}
          <TabsContent value="plans" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Target" className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Торговые планы</h3>
              <p>Здесь будут отображаться все ваши торговые планы</p>
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Play" className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Активные планы</h3>
              <p>Здесь будут отображаться активные торговые планы</p>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="List" className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">История сделок</h3>
              <p>Здесь будет отображаться полная история всех сделок</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Settings" className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Настройки</h3>
              <p>Здесь можно настроить параметры журнала</p>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="BookOpen" className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Руководство</h3>
              <p>Подробное руководство по использованию торгового журнала</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}