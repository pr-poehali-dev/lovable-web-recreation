import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserSettings } from '@/hooks/useTradingPlans';
import Icon from '@/components/ui/icon';

interface SettingsTabProps {
  userSettings: UserSettings;
  updateUserSettings: (newSettings: Partial<UserSettings>) => void;
}

export function SettingsTab({ userSettings, updateUserSettings }: SettingsTabProps) {
  const [newSetup, setNewSetup] = useState('');
  const [newSession, setNewSession] = useState('');
  const [newStrategy, setNewStrategy] = useState('');

  const addCustomSetup = () => {
    if (newSetup.trim() && !userSettings.customSetups.includes(newSetup.trim())) {
      updateUserSettings({
        customSetups: [...userSettings.customSetups, newSetup.trim()]
      });
      setNewSetup('');
    }
  };

  const removeCustomSetup = (setupToRemove: string) => {
    updateUserSettings({
      customSetups: userSettings.customSetups.filter(setup => setup !== setupToRemove)
    });
  };

  const addCustomSession = () => {
    if (newSession.trim() && !userSettings.customSessions.includes(newSession.trim())) {
      updateUserSettings({
        customSessions: [...userSettings.customSessions, newSession.trim()]
      });
      setNewSession('');
    }
  };

  const removeCustomSession = (sessionToRemove: string) => {
    updateUserSettings({
      customSessions: userSettings.customSessions.filter(session => session !== sessionToRemove)
    });
  };

  const addCustomStrategy = () => {
    if (newStrategy.trim() && !userSettings.customStrategies.includes(newStrategy.trim())) {
      updateUserSettings({
        customStrategies: [...userSettings.customStrategies, newStrategy.trim()]
      });
      setNewStrategy('');
    }
  };

  const removeCustomStrategy = (strategyToRemove: string) => {
    updateUserSettings({
      customStrategies: userSettings.customStrategies.filter(strategy => strategy !== strategyToRemove)
    });
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Настройки</h2>
        <p className="text-muted-foreground">
          Настройте персонализированные параметры для ваших торговых планов
        </p>
      </div>

      <div className="grid gap-6">
        {/* Manage Setups */}
        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="Settings" className="h-5 w-5" />
              <CardTitle>Торговые сетапы</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Добавьте свои собственные названия для торговых сетапов
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Введите название сетапа (например, Break of Structure)"
                value={newSetup}
                onChange={(e) => setNewSetup(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSetup()}
              />
              <Button onClick={addCustomSetup} disabled={!newSetup.trim()}>
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Пользовательские сетапы</span>
                <Badge variant="secondary">{userSettings.customSetups.length}/7 сессий</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {userSettings.customSetups.map(setup => (
                  <Badge key={setup} variant="outline" className="flex items-center gap-1 py-1">
                    {setup}
                    <button
                      onClick={() => removeCustomSetup(setup)}
                      className="ml-1 hover:text-red-500"
                    >
                      <Icon name="X" className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {userSettings.customSetups.length === 0 && (
                  <span className="text-sm text-muted-foreground">Нет пользовательских сетапов</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Sessions */}
        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="Clock" className="h-5 w-5" />
              <CardTitle>Торговые сессии</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Управляйте названиями торговых сессий для категоризации сделок по времени
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Введите название сессии (например, Asia, London, NY)"
                value={newSession}
                onChange={(e) => setNewSession(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSession()}
              />
              <Button onClick={addCustomSession} disabled={!newSession.trim()}>
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Пользовательские сессии</span>
                <Badge variant="secondary">{userSettings.customSessions.length}/7 сессий</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Используются для категоризации сделок по рыночным часам
              </p>
              <div className="flex flex-wrap gap-2">
                {userSettings.customSessions.map(session => (
                  <Badge key={session} variant="outline" className="flex items-center gap-1 py-1">
                    {session}
                    <button
                      onClick={() => removeCustomSession(session)}
                      className="ml-1 hover:text-red-500"
                    >
                      <Icon name="X" className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {userSettings.customSessions.length === 0 && (
                  <span className="text-sm text-muted-foreground">Нет пользовательских сессий</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategies */}
        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="Target" className="h-5 w-5" />
              <CardTitle>Торговые стратегии</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Добавьте названия ваших торговых стратегий
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Введите название стратегии (например, Scalping, Swing)"
                value={newStrategy}
                onChange={(e) => setNewStrategy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomStrategy()}
              />
              <Button onClick={addCustomStrategy} disabled={!newStrategy.trim()}>
                <Icon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Пользовательские стратегии</span>
                <Badge variant="secondary">{userSettings.customStrategies.length} стратегий</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {userSettings.customStrategies.map(strategy => (
                  <Badge key={strategy} variant="outline" className="flex items-center gap-1 py-1">
                    {strategy}
                    <button
                      onClick={() => removeCustomStrategy(strategy)}
                      className="ml-1 hover:text-red-500"
                    >
                      <Icon name="X" className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {userSettings.customStrategies.length === 0 && (
                  <span className="text-sm text-muted-foreground">Нет пользовательских стратегий</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}