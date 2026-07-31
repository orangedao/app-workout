import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Множители для расчета веса в зависимости от уровня
const difficultyMultipliers = {
  'Новичок': 0.6,
  'Средний': 0.8,
  'Продвинутый': 1.0,
  'Эксперт': 1.2
};

export const AppProvider = ({ children }) => {
  // Состояние пользователя
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('workout_userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  // Расписание тренировок
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('workout_schedule');
    return saved ? JSON.parse(saved) : {};
  });

  // Библиотека тренировок пользователя
  const [workoutLibrary, setWorkoutLibrary] = useState(() => {
    const saved = localStorage.getItem('workout_library');
    return saved ? JSON.parse(saved) : [];
  });

  // Сохранение в localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('workout_userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('workout_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('workout_library', JSON.stringify(workoutLibrary));
  }, [workoutLibrary]);

  // Установка профиля после тестирования
  const setUserProfileData = (profile) => {
    setUserProfile({
      ...profile,
      completedAt: new Date().toISOString()
    });
  };

  // Расчет рекомендуемого веса
  const calculateWeight = (exercise, weightType = 'kg') => {
    if (!userProfile || exercise.weightPercent === 0) {
      return exercise.defaultReps;
    }

    const baseWeight = weightType === 'kg' 
      ? userProfile.bodyWeight 
      : userProfile.bodyWeight * 2.20462; // конвертация в фунты
    
    const multiplier = difficultyMultipliers[userProfile.fitnessLevel] || 0.8;
    const recommendedWeight = baseWeight * exercise.weightPercent * multiplier;
    
    return `${Math.round(recommendedWeight)} ${weightType}`;
  };

  // Добавление тренировки в расписание
  const addToSchedule = (date, workout) => {
    const dateKey = date.toISOString().split('T')[0];
    const newEntry = {
      id: uuidv4(),
      ...workout,
      addedAt: new Date().toISOString()
    };

    setSchedule(prev => ({
      ...prev,
      [dateKey]: prev[dateKey] ? [...prev[dateKey], newEntry] : [newEntry]
    }));
  };

  // Удаление тренировки из расписания
  const removeFromSchedule = (date, workoutId) => {
    const dateKey = date.toISOString().split('T')[0];
    setSchedule(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter(w => w.id !== workoutId) || []
    }));
  };

  // Получение тренировок на дату
  const getWorkoutsForDate = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return schedule[dateKey] || [];
  };

  // Сохранение тренировки в библиотеку
  const saveToLibrary = (workout) => {
    const newWorkout = {
      id: uuidv4(),
      ...workout,
      createdAt: new Date().toISOString()
    };
    setWorkoutLibrary(prev => [...prev, newWorkout]);
    return newWorkout;
  };

  // Удаление из библиотеки
  const removeFromLibrary = (workoutId) => {
    setWorkoutLibrary(prev => prev.filter(w => w.id !== workoutId));
  };

  // Конструктор тренировки с расчетом параметров
  const buildWorkout = (exercises, name = 'Новая тренировка') => {
    if (!Array.isArray(exercises)) {
      exercises = [exercises];
    }

    const workoutExercises = exercises.map(ex => ({
      ...ex,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
      recommendedWeight: calculateWeight(ex),
      restTime: ex.difficulty === 'Легкий' ? '60 сек' : 
                ex.difficulty === 'Средний' ? '90 сек' : '120 сек'
    }));

    return {
      id: uuidv4(),
      name,
      exercises: workoutExercises,
      createdAt: new Date().toISOString(),
      totalDuration: estimateDuration(workoutExercises)
    };
  };

  // Оценка длительности тренировки
  const estimateDuration = (exercises) => {
    const avgExerciseTime = 5; // минут на упражнение с подходами и отдыхом
    return exercises.length * avgExerciseTime;
  };

  // Очистка всех данных
  const clearAllData = () => {
    localStorage.removeItem('workout_userProfile');
    localStorage.removeItem('workout_schedule');
    localStorage.removeItem('workout_library');
    setUserProfile(null);
    setSchedule({});
    setWorkoutLibrary([]);
  };

  const value = {
    userProfile,
    setUserProfileData,
    schedule,
    addToSchedule,
    removeFromSchedule,
    getWorkoutsForDate,
    workoutLibrary,
    saveToLibrary,
    removeFromLibrary,
    buildWorkout,
    calculateWeight,
    clearAllData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
