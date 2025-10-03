export interface PsychologyTag {
  name: string;
  description: string;
  color: 'green' | 'red' | 'orange';
  category: 'good' | 'bad' | 'neutral';
}

export const PSYCHOLOGY_TAG_DEFINITIONS: PsychologyTag[] = [
  {
    name: 'Perfect Execution',
    description: 'Качественное исполнение плана без нарушений (независимо от результата)',
    color: 'green',
    category: 'good'
  },
  {
    name: 'Rule Break: Entry',
    description: 'Нарушение правил входа в сделку',
    color: 'red',
    category: 'bad'
  },
  {
    name: 'Rule Break: Size',
    description: 'Нарушение правил управления капиталом',
    color: 'red',
    category: 'bad'
  },
  {
    name: 'Revenge Trade',
    description: 'Сделка из мести после убытка',
    color: 'red',
    category: 'bad'
  },
  {
    name: 'Missed Trade',
    description: 'Пропущенный торговый сигнал',
    color: 'orange',
    category: 'neutral'
  },
  {
    name: 'Early Exit',
    description: 'Ранний выход из прибыльной позиции',
    color: 'orange',
    category: 'neutral'
  },
  {
    name: 'Hoped Hope',
    description: 'Удержание убыточной позиции слишком долго',
    color: 'red',
    category: 'bad'
  },
  {
    name: 'Averaging Down',
    description: 'Добавление к убыточной позиции',
    color: 'red',
    category: 'bad'
  }
];