import { useState } from 'react';
import { exercises, muscleGroups, equipmentTypes } from '../data/exercises';
import { Plus, X, Trash2, Save, Search, Zap, Clock, Weight } from 'lucide-react';
import './WorkoutBuilder.css';

const difficultyColors = {
  'Легкий': '#1976D2',
  'Средний': '#F57C00',
  'Сложный': '#D32F2F',
};

const getDifficultyColor = (difficulty) => {
  return difficultyColors[difficulty] || '#666';
};

const WorkoutBuilder = () => {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('Все');
  const [filterEquipment, setFilterEquipment] = useState('Все');
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = exercises.filter(ex => {
    const muscleMatch = filterMuscle === 'Все' || ex.muscleGroup === filterMuscle;
    const equipmentMatch = filterEquipment === 'Все' || ex.equipment === filterEquipment;
    const searchMatch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return muscleMatch && equipmentMatch && searchMatch;
  });

  const toggleExercise = (exercise) => {
    setSelectedExercises(prev => {
      const exists = prev.find(ex => ex.id === exercise.id);
      if (exists) {
        return prev.filter(ex => ex.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  };

  const isSelected = (exerciseId) => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  const clearSelection = () => {
    setSelectedExercises([]);
    setWorkoutName('');
    setSearchQuery('');
  };

  const saveWorkout = () => {
    if (selectedExercises.length === 0) return;
    
    const workout = {
      name: workoutName || `Тренировка ${new Date().toLocaleDateString()}`,
      exercises: selectedExercises,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('workout_lastCreated', JSON.stringify(workout));
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
    clearSelection();
  };

  const getTotalDuration = () => {
    return selectedExercises.length * 5;
  };

  return (
    <div className="workout-builder">
      <div className="builder-header">
        <div className="builder-header-icon"><Zap size={32} /></div>
        <h1>Конструктор тренировок</h1>
        <p>Создайте свою персональную тренировку из упражнений</p>
      </div>

      <div className="builder-content">
        <div className="exercises-panel">
          <div className="filters">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Поиск упражнения..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Группа мышц:</label>
              <select value={filterMuscle} onChange={(e) => setFilterMuscle(e.target.value)}>
                {muscleGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Оборудование:</label>
              <select value={filterEquipment} onChange={(e) => setFilterEquipment(e.target.value)}>
                {equipmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="exercises-list">
            <h3>Доступные упражнения ({filteredExercises.length})</h3>
            {filteredExercises.map(exercise => (
              <div
                key={exercise.id}
                className={`exercise-card ${isSelected(exercise.id) ? 'selected' : ''}`}
                onClick={() => toggleExercise(exercise)}
              >
                <div className="exercise-info">
                  <h4>{exercise.name}</h4>
                  <div className="exercise-meta">
                    <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(exercise.difficulty) + '20', color: getDifficultyColor(exercise.difficulty) }}>
                      {exercise.difficulty}
                    </span>
                    <span className="muscle-tag">{exercise.muscleGroup}</span>
                    <span className="equipment-tag">{exercise.equipment}</span>
                  </div>
                  <div className="exercise-stats">
                    <span><Weight size={14} /> {exercise.defaultSets} подходов</span>
                    <span><Clock size={14} /> {exercise.defaultReps} повторений</span>
                  </div>
                </div>
                <div className="exercise-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected(exercise.id)}
                    onChange={() => {}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="selection-panel">
          <div className="selection-header">
            <h3>Выбранные упражнения ({selectedExercises.length})</h3>
            {selectedExercises.length > 0 && (
              <button className="clear-btn" onClick={clearSelection}>
                <Trash2 size={14} /> Очистить
              </button>
            )}
          </div>

          {selectedExercises.length === 0 ? (
            <div className="empty-selection">
              <div className="empty-icon"><Plus size={40} /></div>
              <p>Выберите упражнения из списка слева</p>
              <p className="hint">Кликайте на карточки для добавления</p>
            </div>
          ) : (
            <>
              <div className="selected-exercises-list">
                {selectedExercises.map((exercise, index) => (
                  <div key={exercise.id} className="selected-exercise-item">
                    <span className="exercise-number">{index + 1}</span>
                    <div className="exercise-details">
                      <strong>{exercise.name}</strong>
                      <div className="quick-stats">
                        <span>{exercise.defaultSets} x {exercise.defaultReps}</span>
                        <span className="rest-time">
                          Отдых: {exercise.difficulty === 'Легкий' ? '60с' : 
                                  exercise.difficulty === 'Средний' ? '90с' : '120с'}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => toggleExercise(exercise)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="workout-summary">
                <div className="summary-row">
                  <span>Упражнений:</span>
                  <strong>{selectedExercises.length}</strong>
                </div>
                <div className="summary-row">
                  <span>Примерное время:</span>
                  <strong>~{getTotalDuration()} мин</strong>
                </div>
                
                <div className="workout-name-input">
                  <label>Название тренировки:</label>
                  <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="Например: День груди и трицепса"
                  />
                </div>

                <button 
                  className="save-workout-btn"
                  onClick={saveWorkout}
                >
                  <Save size={18} /> Сохранить тренировку
                </button>

                {showSavedMessage && (
                  <div className="saved-message">
                    ✅ Тренировка сохранена!
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
