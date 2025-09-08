import React from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function Guide() {
  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Icon name="BookOpen" size={32} className="text-green-500" />
          <h1 className="text-3xl font-bold text-white">Руководство по торговому журналу</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Освойте торговый журнал с помощью подробных руководств, примеров и лучших
          практик для эффективного управления рисками и анализа производительности.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <a href="#quick-start" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white flex items-center gap-2">
          <Icon name="Zap" size={16} />
          Быстрый старт
        </a>
        <a href="#widgets" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white flex items-center gap-2">
          <Icon name="BarChart3" size={16} />
          Понимание виджетов
        </a>
        <a href="#examples" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white flex items-center gap-2">
          <Icon name="Target" size={16} />
          Практические примеры
        </a>
        <a href="#best-practices" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white flex items-center gap-2">
          <Icon name="CheckSquare" size={16} />
          Лучшие практики
        </a>
      </div>

      {/* Quick Start Section */}
      <section id="quick-start" className="space-y-6">
        <div className="flex items-center gap-3">
          <Icon name="Zap" size={24} className="text-green-500" />
          <h2 className="text-2xl font-bold text-white">Руководство по быстрому старту</h2>
        </div>
        <p className="text-gray-300">
          Следуйте этим шагам для настройки торгового журнала и начала отслеживания вашей производительности
        </p>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Понимание R-системы
          </h3>
          <p className="text-gray-300 mb-4">
            R-система - это основа профессиональной торговли. Она измеряет прибыль с поправкой на риск, упрощая сравнение сделок независимо от размера позиции или рыночных условий.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">📊 Формула R-мультипликатора</h4>
              <div className="font-mono text-lg text-white mb-2">R = Прибыль ÷ Риск</div>
              <div className="text-gray-400 text-sm space-y-1">
                <div>Пример: Риск 1%, Прибыль 2% = 2R</div>
                <div>Пример: Риск $100, Убыток $100 = -1R</div>
              </div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">🎯 Зачем R-мультипликатор?</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Независимость от размера позиции</li>
                <li>• Простое сравнение производительности</li>
                <li>• Профессиональный стандарт</li>
                <li>• Ясное математическое ожидание</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Настройка параметров
          </h3>
          <p className="text-gray-300 mb-4">
            Перейдите во вкладку Настройки и настройте ваши торговые параметры:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-orange-400 font-semibold mb-2">🎯 Типы сетапов</h4>
              <p className="text-gray-400 text-sm">
                Определите ваши торговые сетапы:
                Breakout, Pullback, Support/Resistance, Momentum, Reversal
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">⏰ Торговые сессии</h4>
              <p className="text-gray-400 text-sm">
                Укажите время торговли для анализа производительности по сессиям
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">📈 Стратегии</h4>
              <p className="text-gray-400 text-sm">
                Добавьте ваши торговые стратегии для детального анализа
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Start Checklist */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="CheckSquare" size={24} className="text-green-500" />
            Чек-лист быстрого старта
          </h3>
          <div className="space-y-3">
            {[
              'Настроить типы сетапов в настройках',
              'Определить торговые сессии',
              'Добавить используемые стратегии', 
              'Создать первый торговый план',
              'Записать первую сделку с R-мультипликатором',
              'Проанализировать результаты в дашборде'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-green-500 rounded flex items-center justify-center">
                  <Icon name="Check" size={14} className="text-green-500" />
                </div>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Widgets Understanding */}
      <section id="widgets" className="space-y-6">
        <div className="flex items-center gap-3">
          <Icon name="BarChart3" size={24} className="text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Понимание виджетов</h2>
        </div>

        {/* Key Metrics */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📊 Ключевые метрики</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">Win Rate</h4>
              <p className="text-gray-300 text-sm mb-2">Процент прибыльных сделок</p>
              <div className="text-gray-400 text-sm">
                <div>• 🟢 Выше 60% - отлично</div>
                <div>• 🟡 40-60% - хорошо</div>
                <div>• 🔴 Ниже 40% - требует работы</div>
              </div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">Average R</h4>
              <p className="text-gray-300 text-sm mb-2">Среднее R на сделку</p>
              <div className="text-gray-400 text-sm">
                <div>• 🟢 Выше 0.5R - отлично</div>
                <div>• 🟡 0.2-0.5R - хорошо</div>
                <div>• 🔴 Ниже 0.2R - убыточно</div>
              </div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">Max Drawdown</h4>
              <p className="text-gray-300 text-sm mb-2">Максимальная просадка</p>
              <div className="text-gray-400 text-sm">
                <div>• 🟢 Ниже 10R - отлично</div>
                <div>• 🟡 10-20R - приемлемо</div>
                <div>• 🔴 Выше 20R - высокий риск</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Equity Curve */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📈 Кривая капитала</h3>
          <p className="text-gray-300 mb-4">
            Показывает рост вашего капитала во времени и скользящее среднее ожидание
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">🎯 Что анализировать:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Общий тренд роста/падения</li>
                <li>• Периоды просадок</li>
                <li>• Стабильность роста</li>
                <li>• Отклонение от скользящего среднего</li>
              </ul>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-orange-400 font-semibold mb-2">⚠️ Красные флаги:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Длительная просадка (>50 сделок)</li>
                <li>• Резкие падения после роста</li>
                <li>• Стагнация кривой</li>
                <li>• Увеличивающаяся волатильность</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* R Distribution */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📊 R-распределение</h3>
          <p className="text-gray-300 mb-4">
            Гистограмма показывает распределение ваших результатов по R-мультипликаторам
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">📈 Анализ распределения:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Профибельные диапазоны: 7 из 8 диапазонов</li>
                <li>• Лучший диапазон: 1.5R to 2.0R</li>
                <li>• Медианa R: +1.12R</li>
                <li>• Total PnL: +16.84R</li>
              </ul>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">🎯 Что искать:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Больше выигрышей справа от 0</li>
                <li>• Длинный хвост прибылей</li>
                <li>• Ограниченные убытки слева</li>
                <li>• Медиана выше 0</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* R-Analysis Heatmap */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🔥 R-Анализ хитмап</h3>
          <p className="text-gray-300 mb-4">
            Интерактивная тепловая карта для анализа производительности по различным параметрам
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">🎯 По сетапам</h4>
              <p className="text-gray-300 text-sm">Найдите ваши самые прибыльные торговые сетапы и сфокусируйтесь на них</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">⏰ По времени</h4>
              <p className="text-gray-300 text-sm">Определите лучшее время для торговли по сессиям и дням недели</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">📈 По стратегиям</h4>
              <p className="text-gray-300 text-sm">Сравните эффективность различных торговых стратегий</p>
            </div>
          </div>
        </Card>

        {/* Psychology Heatmap */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🧠 Психологический хитмап</h3>
          <p className="text-gray-300 mb-4">
            Карта ошибок с детальным анализом психологических проблем в торговле
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-red-400 font-semibold mb-2">🚫 Распространенные ошибки:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <span className="text-red-400">Revenge Trade</span> - месть рынку</li>
                <li>• <span className="text-red-400">Rule Break</span> - нарушение правил</li>
                <li>• <span className="text-red-400">Averaging Down</span> - усреднение</li>
                <li>• <span className="text-orange-400">Early Exit</span> - ранний выход</li>
              </ul>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">✅ Положительные теги:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <span className="text-green-400">Perfect Execution</span> - идеальное исполнение</li>
                <li>• Следование торговому плану</li>
                <li>• Соблюдение риск-менеджмента</li>
                <li>• Дисциплинированный подход</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* P&L Distribution */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">💰 P&L распределение</h3>
          <p className="text-gray-300 mb-4">
            Анализ по концепции Ван Тендлера с процентилями для оценки асимметрии результатов
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">📊 Ключевые процентили:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <strong>10%</strong> - худшие результаты</li>
                <li>• <strong>25%</strong> - нижняя квартиль</li>
                <li>• <strong>50%</strong> - медиана</li>
                <li>• <strong>75%</strong> - верхняя квартиль</li>
                <li>• <strong>90%</strong> - лучшие результаты</li>
              </ul>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">🎯 Что анализировать:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Асимметрия прибылей/убытков</li>
                <li>• Размер хвостов распределения</li>
                <li>• Концентрация результатов</li>
                <li>• Выбросы в данных</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Practical Examples */}
      <section id="examples" className="space-y-6">
        <div className="flex items-center gap-3">
          <Icon name="Target" size={24} className="text-orange-500" />
          <h2 className="text-2xl font-bold text-white">Практические примеры</h2>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📝 Пример анализа торговой сессии</h3>
          <div className="bg-slate-900 p-4 rounded-lg mb-4">
            <div className="text-gray-300 mb-2"><strong>Дата:</strong> 15 сентября 2024</div>
            <div className="text-gray-300 mb-2"><strong>Сессия:</strong> Американская (16:30-23:00)</div>
            <div className="text-gray-300 mb-2"><strong>Результат:</strong> +2.5R из 4 сделок</div>
          </div>

          <div className="space-y-3">
            <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg">
              <div className="text-green-400 font-semibold">✅ Сделка #1: EUR/USD Breakout</div>
              <div className="text-gray-300 text-sm">Риск: 0.5%, Результат: +1.5R, Тег: Perfect Execution</div>
            </div>
            <div className="bg-red-900/20 border border-red-700 p-3 rounded-lg">
              <div className="text-red-400 font-semibold">❌ Сделка #2: GBP/USD Pullback</div>
              <div className="text-gray-300 text-sm">Риск: 0.5%, Результат: -1R, Тег: Rule Break: Entry</div>
            </div>
            <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg">
              <div className="text-green-400 font-semibold">✅ Сделка #3: USD/JPY Support</div>
              <div className="text-gray-300 text-sm">Риск: 0.5%, Результат: +1.5R, Тег: Perfect Execution</div>
            </div>
            <div className="bg-orange-900/20 border border-orange-700 p-3 rounded-lg">
              <div className="text-orange-400 font-semibold">⚠️ Сделка #4: AUD/USD Reversal</div>
              <div className="text-gray-300 text-sm">Риск: 0.5%, Результат: +0.5R, Тег: Early Exit</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <h4 className="text-blue-400 font-semibold mb-2">📊 Анализ сессии:</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Win Rate: 75% (3 из 4)</li>
              <li>• Средний R: +0.625R</li>
              <li>• Лучший сетап: Breakout (+1.5R)</li>
              <li>• Проблема: Нарушение правил входа в сделку #2</li>
              <li>• Рекомендация: Пересмотреть критерии входа для Pullback</li>
            </ul>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🔍 Как читать хитмапы</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-green-400 font-semibold">🟢 Зеленые зоны (прибыльные):</h4>
              <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg">
                <div className="text-white font-medium">Breakout + London Session</div>
                <div className="text-green-400">+12.5R из 15 сделок</div>
                <div className="text-gray-400 text-sm">Win Rate: 73%, Avg R: +0.83R</div>
              </div>
              <p className="text-gray-300 text-sm">
                Увеличьте количество сделок в этой комбинации
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-red-400 font-semibold">🔴 Красные зоны (убыточные):</h4>
              <div className="bg-red-900/20 border border-red-700 p-3 rounded-lg">
                <div className="text-white font-medium">Reversal + Asian Session</div>
                <div className="text-red-400">-8.2R из 12 сделок</div>
                <div className="text-gray-400 text-sm">Win Rate: 25%, Avg R: -0.68R</div>
              </div>
              <p className="text-gray-300 text-sm">
                Избегайте или улучшите эту комбинацию
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className="space-y-6">
        <div className="flex items-center gap-3">
          <Icon name="CheckSquare" size={24} className="text-green-500" />
          <h2 className="text-2xl font-bold text-white">Лучшие практики</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-green-400 mb-4">✅ Что делать</h3>
            <div className="space-y-3">
              {[
                'Записывайте каждую сделку немедленно',
                'Честно отмечайте психологические ошибки',
                'Анализируйте результаты еженедельно',
                'Фокусируйтесь на 2-3 лучших сетапах',
                'Устанавливайте четкие правила входа/выхода',
                'Используйте постоянный размер риска',
                'Ведите заметки о рыночных условиях',
                'Отслеживайте эмоциональное состояние'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-red-400 mb-4">❌ Чего избегать</h3>
            <div className="space-y-3">
              {[
                'Пропускать записи убыточных сделок',
                'Торговать без четкого плана',
                'Увеличивать риск после убытков',
                'Игнорировать психологические ошибки',
                'Часто менять торговые правила',
                'Торговать слишком много сетапов',
                'Надеяться вместо следования стоп-лоссу',
                'Не анализировать результаты регулярно'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Icon name="XCircle" size={16} className="text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Monthly Review Checklist */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Calendar" size={24} className="text-blue-500" />
            Ежемесячный чек-лист анализа
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-blue-400 font-semibold">📊 Количественный анализ:</h4>
              <div className="space-y-2">
                {[
                  'Общий P&L и R-результат',
                  'Win Rate по всем сделкам',
                  'Average R и медианный R',
                  'Максимальная просадка',
                  'Распределение R-мультипликаторов',
                  'Лучшие и худшие торговые дни'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-orange-400 font-semibold">🧠 Качественный анализ:</h4>
              <div className="space-y-2">
                {[
                  'Частота психологических ошибок',
                  'Эффективность торговых сетапов',
                  'Производительность по сессиям',
                  'Соблюдение торгового плана',
                  'Размер позиций и риск-менеджмент',
                  'Планы улучшения на следующий месяц'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Warning Signs */}
        <Card className="bg-red-900/20 border border-red-700 p-6">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={24} />
            Предупреждающие сигналы
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-red-400 font-semibold mb-3">🚨 Немедленные действия:</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>Просадка >20R:</strong> Остановите торговлю</li>
                <li>• <strong>3+ дня подряд убытков:</strong> Пересмотрите стратегию</li>
                <li>• <strong>Нарушения правил >50%:</strong> Уменьшите размер</li>
                <li>• <strong>Эмоциональная торговля:</strong> Сделайте перерыв</li>
              </ul>
            </div>
            <div>
              <h4 className="text-orange-400 font-semibold mb-3">⚠️ Долгосрочные тревоги:</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <strong>Win Rate <30%:</strong> Проблемы с входами</li>
                <li>• <strong>Avg R <0.2R:</strong> Плохое соотношение P/L</li>
                <li>• <strong>Стагнация >3 месяцев:</strong> Нужны изменения</li>
                <li>• <strong>Увеличение волатильности:</strong> Пересмотрите риски</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Success Metrics */}
      <section className="mt-12">
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Trophy" size={24} className="text-yellow-500" />
            Цели для успешного трейдера
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">60%+</div>
              <div className="text-gray-300 text-sm">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">0.5R+</div>
              <div className="text-gray-300 text-sm">Average R</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">2:1+</div>
              <div className="text-gray-300 text-sm">Reward:Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400"><10R</div>
              <div className="text-gray-300 text-sm">Max Drawdown</div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}