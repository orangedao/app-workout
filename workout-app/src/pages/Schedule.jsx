import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import './Schedule.css';

const Schedule = () => {
  const { userProfile, addToSchedule, removeFromSchedule, getWorkoutsForDate, buildWorkout } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  // Генерация дней недели для отображения
  const getWeekDays = () => {
    const today = new Date();
    const days = [];
    for (let i = -3; i <= 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const currentWorkouts = getWorkoutsForDate(selectedDate);

  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleAddQuickWorkout = () => {
    if (!userProfile) {
      alert('Сначала пройдите входное тестирование!');
      return;
    }

    // Создаем быструю тренировку на основе уровня пользователя
    const quickExercises = [
      { id: '3', name: 'Отжимания от пола', muscleGroup: 'Грудь', equipment: 'Без оборудования', difficulty: 'Легкий', defaultSets: 3, defaultReps: '15-20', weightPercent: 0 },
      { id: '6', name: 'Подтягивания', muscleGroup: 'Спина', equipment: 'Без оборудования', difficulty: 'Средний', defaultSets: 3, defaultReps: '8-12', weightPercent: 0 },
      { id: '11', name: 'Приседания без веса', muscleGroup: 'Ноги', equipment: 'Без оборудования', difficulty: 'Легкий', defaultSets: 3, defaultReps: '15-20', weightPercent: 0 },
      { id: '21', name: 'Скручивания', muscleGroup: 'Пресс', equipment: 'Без оборудования', difficulty: 'Легкий', defaultSets: 3, defaultReps: '15-20', weightPercent: 0 },
      { id: '22', name: 'Планка', muscleGroup: 'Пресс', equipment: 'Без оборудования', difficulty: 'Легкий', defaultSets: 3, defaultReps: '30-60 сек', weightPercent: 0 }
    ];

    const workout = buildWorkout(quickExercises, 'Быстрая тренировка');
    addToSchedule(selectedDate, workout);
    setShowAddModal(false);
  };

  const handleRemoveWorkout = (workoutId) => {
    if (confirm('Удалить эту тренировку из расписания?')) {
      removeFromSchedule(selectedDate, workoutId);
    }
  };

  if (!userProfile) {
    return (
      <div className="schedule-container">
        <div className="no-profile-message">
          <h1>📅 Расписание тренировок</h1>
          <p>Для доступа к расписанию необходимо пройти входное тестирование</p>
          <a href="/assessment" className="btn btn-primary">Пройти тестирование</a>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h1>📅 Расписание тренировок</h1>
        <p className="user-greeting">
          Привет! Ваш уровень: <strong>{userProfile.fitnessLevel}</strong> | 
          Цель: <strong>{userProfile.goals?.join(', ')}</strong>
        </p>
      </div>

      {/* Календарная полоса */}
      <div className="calendar-strip">
        {weekDays.map((date, index) => (
          <button
            key={index}
            className={`date-card ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            <span className="weekday">{date.toLocaleDateString('ru-RU', { weekday: 'short' })}</span>
            <span className="day">{date.getDate()}</span>
            <span className="month">{date.toLocaleDateString('ru-RU', { month: 'short' })}</span>
          </button>
        ))}
      </div>

      {/* Тренировки на выбранный день */}
      <div className="day-schedule">
        <div className="day-header">
          <h2>
            {formatDate(selectedDate)}
            {isToday(selectedDate) && <span className="today-badge">Сегодня</span>}
          </h2>
          <button 
            className="add-workout-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Добавить тренировку
          </button>
        </div>

        {currentWorkouts.length === 0 ? (
          <div className="no-workouts">
            <p>📭 На этот день пока нет запланированных тренировок</p>
            <p className="hint">Нажмите "Добавить тренировку", чтобы создать новую</p>
          </div>
        ) : (
          <div className="workouts-list">
            {currentWorkouts.map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-header">
                  <h3>{workout.name}</h3>
                  <button 
                    className="delete-btn"
                    onClick={() => handleRemoveWorkout(workout.id)}
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="workout-meta">
                  <span>⏱️ ~{workout.totalDuration || workout.exercises?.length * 5 || 30} мин</span>
                  <span>💪 {workout.exercises?.length || 0} упражнений</span>
                </div>

                <div className="exercises-preview">
                  {workout.exercises?.slice(0, 3).map((ex, idx) => (
                    <div key={idx} className="exercise-row">
                      <span className="sets-reps">{ex.sets} x {ex.reps}</span>
                      <span className="exercise-name">{ex.name}</span>
                      {ex.recommendedWeight && ex.recommendedWeight !== ex.reps && (
                        <span className="weight">⚖️ {ex.recommendedWeight}</span>
                      )}
                    </div>
                  ))}
                  {workout.exercises?.length > 3 && (
                    <p className="more-exercises">+ ещё {workout.exercises.length - 3} упр.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно добавления */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Добавить тренировку</h2>
            <p>Выберите тип тренировки:</p>
            
            <div className="modal-options">
              <button className="option-card" onClick={handleAddQuickWorkout}>
                <span className="option-icon">⚡</span>
                <strong>Быстрая тренировка</strong>
                <p>Базовые упражнения без оборудования</p>
              </button>
              
              <a href="/builder" className="option-card">
                <span className="option-icon">🏗️</span>
                <strong>Конструктор</strong>
                <p>Создайте свою уникальную тренировку</p>
              </a>
            </div>

            <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
