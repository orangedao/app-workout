// Данные упражнений по группам мышц и оборудованию
export const exercises = [
  // Грудь
  {
    id: '1',
    name: 'Жим штанги лежа',
    muscleGroup: 'Грудь',
    equipment: 'Штанга',
    difficulty: 'Средний',
    defaultSets: 4,
    defaultReps: '8-10',
    weightPercent: 0.75
  },
  {
    id: '2',
    name: 'Жим гантелей на наклонной скамье',
    muscleGroup: 'Грудь',
    equipment: 'Гантели',
    difficulty: 'Средний',
    defaultSets: 3,
    defaultReps: '10-12',
    weightPercent: 0.65
  },
  {
    id: '3',
    name: 'Отжимания от пола',
    muscleGroup: 'Грудь',
    equipment: 'Без оборудования',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '15-20',
    weightPercent: 0
  },
  {
    id: '4',
    name: 'Сведение рук в кроссовере',
    muscleGroup: 'Грудь',
    equipment: 'Тренажеры',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '12-15',
    weightPercent: 0.5
  },
  
  // Спина
  {
    id: '5',
    name: 'Становая тяга',
    muscleGroup: 'Спина',
    equipment: 'Штанга',
    difficulty: 'Сложный',
    defaultSets: 4,
    defaultReps: '6-8',
    weightPercent: 0.8
  },
  {
    id: '6',
    name: 'Подтягивания',
    muscleGroup: 'Спина',
    equipment: 'Без оборудования',
    difficulty: 'Средний',
    defaultSets: 3,
    defaultReps: '8-12',
    weightPercent: 0
  },
  {
    id: '7',
    name: 'Тяга гантели в наклоне',
    muscleGroup: 'Спина',
    equipment: 'Гантели',
    difficulty: 'Средний',
    defaultSets: 3,
    defaultReps: '10-12',
    weightPercent: 0.6
  },
  {
    id: '8',
    name: 'Тяга верхнего блока',
    muscleGroup: 'Спина',
    equipment: 'Тренажеры',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '12-15',
    weightPercent: 0.65
  },
  
  // Ноги
  {
    id: '9',
    name: 'Приседания со штангой',
    muscleGroup: 'Ноги',
    equipment: 'Штанга',
    difficulty: 'Сложный',
    defaultSets: 4,
    defaultReps: '8-10',
    weightPercent: 0.75
  },
  {
    id: '10',
    name: 'Выпады с гантелями',
    muscleGroup: 'Ноги',
    equipment: 'Гантели',
    difficulty: 'Средний',
    defaultSets: 3,
    defaultReps: '10-12',
    weightPercent: 0.5
  },
  {
    id: '11',
    name: 'Приседания без веса',
    muscleGroup: 'Ноги',
    equipment: 'Без оборудования',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '15-20',
    weightPercent: 0
  },
  {
    id: '12',
    name: 'Жим ногами в тренажере',
    muscleGroup: 'Ноги',
    equipment: 'Тренажеры',
    difficulty: 'Средний',
    defaultSets: 4,
    defaultReps: '10-12',
    weightPercent: 0.8
  },
  
  // Плечи
  {
    id: '13',
    name: 'Жим штанги стоя',
    muscleGroup: 'Плечи',
    equipment: 'Штанга',
    difficulty: 'Средний',
    defaultSets: 4,
    defaultReps: '8-10',
    weightPercent: 0.65
  },
  {
    id: '14',
    name: 'Разведение гантелей в стороны',
    muscleGroup: 'Плечи',
    equipment: 'Гантели',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '12-15',
    weightPercent: 0.4
  },
  {
    id: '15',
    name: 'Отжимания Pike Push-up',
    muscleGroup: 'Плечи',
    equipment: 'Без оборудования',
    difficulty: 'Средний',
    defaultSets: 3,
    defaultReps: '8-12',
    weightPercent: 0
  },
  {
    id: '16',
    name: 'Тяга к подбородку в кроссовере',
    muscleGroup: 'Плечи',
    equipment: 'Тренажеры',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '12-15',
    weightPercent: 0.5
  },
  
  // Руки (Бицепс/Трицепс)
  {
    id: '17',
    name: 'Подъем штанги на бицепс',
    muscleGroup: 'Руки',
    equipment: 'Штанга',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '10-12',
    weightPercent: 0.5
  },
  {
    id: '18',
    name: 'Французский жим с гантелью',
    muscleGroup: 'Руки',
    equipment: 'Гантели',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '10-12',
    weightPercent: 0.45
  },
  {
    id: '19',
    name: 'Отжимания на трицепс',
    muscleGroup: 'Руки',
    equipment: 'Без оборудования',
    difficulty: 'Средний',
    defaultSets: 3,
    defaultReps: '10-15',
    weightPercent: 0
  },
  {
    id: '20',
    name: 'Сгибание рук на бицепс-машине',
    muscleGroup: 'Руки',
    equipment: 'Тренажеры',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '12-15',
    weightPercent: 0.55
  },
  
  // Пресс
  {
    id: '21',
    name: 'Скручивания',
    muscleGroup: 'Пресс',
    equipment: 'Без оборудования',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '15-20',
    weightPercent: 0
  },
  {
    id: '22',
    name: 'Планка',
    muscleGroup: 'Пресс',
    equipment: 'Без оборудования',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '30-60 сек',
    weightPercent: 0
  },
  {
    id: '23',
    name: 'Подъем ног в висе',
    muscleGroup: 'Пресс',
    equipment: 'Без оборудования',
    difficulty: 'Средний',
    defaultSets: 3,
    defaultReps: '10-15',
    weightPercent: 0
  },
  {
    id: '24',
    name: 'Кабельные скручивания',
    muscleGroup: 'Пресс',
    equipment: 'Тренажеры',
    difficulty: 'Легкий',
    defaultSets: 3,
    defaultReps: '15-20',
    weightPercent: 0.4
  }
];

// Группы мышц для фильтрации
export const muscleGroups = [
  'Все',
  'Грудь',
  'Спина',
  'Ноги',
  'Плечи',
  'Руки',
  'Пресс'
];

// Типы оборудования
export const equipmentTypes = [
  'Все',
  'Штанга',
  'Гантели',
  'Тренажеры',
  'Без оборудования'
];

// Уровни сложности
export const difficultyLevels = [
  'Легкий',
  'Средний',
  'Сложный'
];
