import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Calendar, Plus, X, Clock, Dumbbell, ChevronLeft, ChevronRight, HeartPulse, GripVertical } from 'lucide-react';
import './Schedule.css';

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const Schedule = () => {
  const { userProfile, addToSchedule, removeFromSchedule, getWorkoutsForDate, buildWorkout } = useAppContext();
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedWorkout, setDraggedWorkout] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeek);
    date.setDate(currentWeek.getDate() + i);
    return date;
  });

  const today = new Date();
  const isToday = (date) => date.toDateString() === today.toDateString();

  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const formatTime = (hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const goToPrevWeek = () => {
    const prev = new Date(currentWeek);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeek(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(next.getDate() + 7);
    setCurrentWeek(next);
  };

  const goToToday = () => {
    setCurrentWeek(getWeekStart(new Date()));
  };

  const handleAddQuickWorkout = () => {
    if (!userProfile) {
      alert('Сначала пройдите входное тестирование!');
      return;
    }

    const quickExercises = [
      { id: '3', name: 'Отжимания от пола', muscleGroup: 'Грудь', equipment: 'Без оборудования', difficulty: 'Легкий', defaultSets: 3, defaultReps: '15-20', weightPercent: 0 },
      { id: '6', name: 'Подтягивания', muscleGroup: 'Спина', equipment: 'Без оборудования', difficulty: 'Средний', defaultSets: 3, defaultReps: '8-12', weightPercent: 0 },
      { id: '11', name: 'Приседания без веса', muscleGroup: 'Ноги', equipment: 'Без оборудования', difficulty: 'Легкий', defaultSets: 3, defaultReps: '15-20', weightPercent: 0 },
      { id: '21', name: 'Скручивания', muscleGroup: 'Пресс', equipment: 'Без оборудования', difficulty: 'Легкий', defaultSets: 3, defaultReps: '15-20', weightPercent: 0 },
      { id: '22', name: 'Планка', muscleGroup: 'Пресс', equipment: 'Без оборудования', difficulty: 'Легкий', defaultSets: 3, defaultReps: '30-60 сек', weightPercent: 0 }
    ];

    const workout = buildWorkout(quickExercises, 'Быстрая тренировка');
    const todayKey = today.toISOString().split('T')[0];
    addToSchedule(new Date(todayKey), workout);
    setShowAddModal(false);
  };

  const handleRemoveWorkout = (date, workoutId) => {
    if (confirm('Удалить эту тренировку из расписания?')) {
      removeFromSchedule(date, workoutId);
    }
  };

  const handleDragStart = (e, workout, date) => {
    setDraggedWorkout({ workout, date });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', workout.id);
  };

  const handleDragOver = (e, date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    setDragOverDate(null);
    if (!draggedWorkout) return;

    const sourceDate = draggedWorkout.date;
    const workout = draggedWorkout.workout;

    if (sourceDate.toDateString() === targetDate.toDateString()) return;

    removeFromSchedule(sourceDate, workout.id);
    addToSchedule(targetDate, workout);
    setDraggedWorkout(null);
  };

  const handleDragEnd = () => {
    setDraggedWorkout(null);
    setDragOverDate(null);
  };

  if (!userProfile) {
    return (
      <div className="schedule-container">
        <div className="no-profile-message">
          <div className="no-profile-icon"><Calendar size={48} /></div>
          <h1>Расписание тренировок</h1>
          <p>Для доступа к расписанию необходимо пройти входное тестирование</p>
          <Link to="/assessment" className="btn btn-primary">Пройти тестирование</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="schedule-header-icon"><Calendar size={32} /></div>
        <h1>Расписание тренировок</h1>
        <p className="user-greeting">
          Привет! Ваш уровень: <strong>{userProfile.fitnessLevel}</strong> |
          Цель: <strong>{userProfile.goals?.join(', ')}</strong>
        </p>
      </div>

      <div className="calendar-week-view">
        <div className="week-nav">
          <button className="nav-btn" onClick={goToPrevWeek}><ChevronLeft size={16} /></button>
          <button className="today-btn" onClick={goToToday}>Сегодня</button>
          <span className="week-range">
            {formatDate(weekDays[0])} — {formatDate(weekDays[6])}
          </span>
          <button className="nav-btn" onClick={goToNextWeek}><ChevronRight size={16} /></button>
        </div>

        <div className="week-grid">
          <div className="time-column">
            <div className="time-header">Время</div>
            {HOURS.map(hour => (
              <div key={hour} className="time-slot-label">{formatTime(hour)}</div>
            ))}
          </div>

          {weekDays.map((date, dayIdx) => {
            const dayWorkouts = getWorkoutsForDate(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={dayIdx}
                className={`day-column ${isTodayDate ? 'today-column' : ''} ${dragOverDate?.toDateString() === date.toDateString() ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
              >
                <div className={`day-header-col ${isTodayDate ? 'today-header' : ''}`}>
                  <span className="day-name">{DAY_NAMES[dayIdx]}</span>
                  <span className="day-number">{date.getDate()}</span>
                </div>

                <div className="day-slots">
                  {HOURS.map(hour => (
                    <div key={hour} className="time-slot" />
                  ))}

                  {dayWorkouts.map((workout) => {
                    const startTime = 6;
                    const duration = workout.totalDuration || workout.exercises?.length * 5 || 30;
                    const topPx = ((startTime - 6) * 60 + 0) * 4;
                    const heightPx = Math.max(duration * 4, 40);

                    return (
                      <div
                        key={workout.id}
                        className={`workout-card-drag ${isTodayDate ? 'today-workout' : ''}`}
                        style={{
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, workout, date)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="workout-card-drag-handle">
                          <GripVertical size={14} />
                        </div>
                        <div className="workout-card-drag-content">
                          <h4>{workout.name}</h4>
                          <div className="workout-card-drag-meta">
                            <span><Clock size={12} /> ~{duration} мин</span>
                            <span><Dumbbell size={12} /> {workout.exercises?.length || 0} упр.</span>
                          </div>
                          {workout.maxHR && (
                            <div className="workout-card-drag-hr">
                              <HeartPulse size={12} /> Макс ЧСС: {workout.maxHR}
                            </div>
                          )}
                          <button
                            className="workout-card-drag-delete"
                            onClick={(e) => { e.stopPropagation(); handleRemoveWorkout(date, workout.id); }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="schedule-actions">
        <button className="add-workout-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Добавить тренировку
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Добавить тренировку</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <p>Выберите тип тренировки:</p>

            <div className="modal-options">
              <button className="option-card" onClick={handleAddQuickWorkout}>
                <span className="option-icon">⚡</span>
                <strong>Быстрая тренировка</strong>
                <p>Базовые упражнения без оборудования</p>
              </button>

              <Link to="/builder" className="option-card" onClick={() => setShowAddModal(false)}>
                <span className="option-icon">🏗️</span>
                <strong>Конструктор</strong>
                <p>Создайте свою уникальную тренировку</p>
              </Link>
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
