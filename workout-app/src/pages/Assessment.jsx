import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Assessment.css';

const Assessment = () => {
  const navigate = useNavigate();
  const { setUserProfileData } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    fitnessLevel: '',
    workoutFrequency: '',
    goals: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateStep = (currentStep) => {
    switch(currentStep) {
      case 1:
        return formData.age && formData.gender && formData.height && formData.weight;
      case 2:
        return formData.fitnessLevel && formData.workoutFrequency;
      case 3:
        return formData.goals.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    const profile = {
      ...formData,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      bmi: calculateBMI(formData.height, formData.weight)
    };
    setUserProfileData(profile);
    navigate('/');
  };

  const calculateBMI = (heightCm, weightKg) => {
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Недостаточный вес';
    if (bmi < 25) return 'Нормальный вес';
    if (bmi < 30) return 'Избыточный вес';
    return 'Ожирение';
  };

  const renderStep1 = () => (
    <div className="assessment-step">
      <h2>Шаг 1: Основные данные</h2>
      <div className="form-group">
        <label>Возраст (лет)</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="25"
          min="14"
          max="100"
        />
      </div>
      
      <div className="form-group">
        <label>Пол</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleInputChange}
            />
            Мужской
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleInputChange}
            />
            Женский
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Рост (см)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="175"
            min="100"
            max="250"
          />
        </div>
        
        <div className="form-group">
          <label>Вес (кг)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="70"
            min="30"
            max="300"
          />
        </div>
      </div>

      {formData.height && formData.weight && (
        <div className="bmi-result">
          <p>Ваш ИМТ: <strong>{calculateBMI(formData.height, formData.weight)}</strong></p>
          <p>Категория: <span className="bmi-category">{getBMICategory(calculateBMI(formData.height, formData.weight))}</span></p>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="assessment-step">
      <h2>Шаг 2: Уровень подготовки</h2>
      
      <div className="form-group">
        <label>Оцените свой физический уровень</label>
        <select
          name="fitnessLevel"
          value={formData.fitnessLevel}
          onChange={handleInputChange}
        >
          <option value="">Выберите уровень</option>
          <option value="Новичок">Новичок (занимаюсь менее 6 месяцев)</option>
          <option value="Средний">Средний (занимаюсь 6 месяцев - 2 года)</option>
          <option value="Продвинутый">Продвинутый (занимаюсь более 2 лет)</option>
          <option value="Эксперт">Эксперт (профессиональный подход)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Как часто вы тренируетесь?</label>
        <select
          name="workoutFrequency"
          value={formData.workoutFrequency}
          onChange={handleInputChange}
        >
          <option value="">Выберите частоту</option>
          <option value="1-2 раза в неделю">1-2 раза в неделю</option>
          <option value="3-4 раза в неделю">3-4 раза в неделю</option>
          <option value="5-6 раз в неделю">5-6 раз в неделю</option>
          <option value="Каждый день">Каждый день</option>
          <option value="Только начинаю">Только начинаю</option>
        </select>
      </div>

      <div className="fitness-levels-info">
        <h3>Описание уровней:</h3>
        <ul>
          <li><strong>Новичок:</strong> Мало опыта, фокус на технике</li>
          <li><strong>Средний:</strong> Регулярные тренировки, есть прогресс</li>
          <li><strong>Продвинутый:</strong> Стабильные результаты, сложные программы</li>
          <li><strong>Эксперт:</strong> Профессиональный подход, соревнования</li>
        </ul>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="assessment-step">
      <h2>Шаг 3: Цели тренировок</h2>
      <p className="step-description">Выберите одну или несколько целей:</p>
      
      <div className="goals-grid">
        {[
          { id: 'muscle', label: 'Набор мышечной массы', icon: '💪' },
          { id: 'strength', label: 'Увеличение силы', icon: '🏋️' },
          { id: 'endurance', label: 'Развитие выносливости', icon: '🏃' },
          { id: 'weight-loss', label: 'Похудение', icon: '⚖️' },
          { id: 'health', label: 'Общее здоровье', icon: '❤️' },
          { id: 'flexibility', label: 'Гибкость и мобильность', icon: '🧘' }
        ].map(goal => (
          <button
            key={goal.id}
            className={`goal-card ${formData.goals.includes(goal.id) ? 'selected' : ''}`}
            onClick={() => handleGoalToggle(goal.id)}
          >
            <span className="goal-icon">{goal.icon}</span>
            <span className="goal-label">{goal.label}</span>
          </button>
        ))}
      </div>

      {formData.goals.length > 0 && (
        <div className="selected-goals">
          <h3>Выбранные цели:</h3>
          <ul>
            {formData.goals.map(goal => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h1>🏋️ Входное тестирование</h1>
        <p>Ответьте на несколько вопросов для персонализации тренировок</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
        <span className="step-indicator">Шаг {step} из 3</span>
      </div>

      <div className="assessment-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <div className="assessment-footer">
        {step > 1 && (
          <button className="btn btn-secondary" onClick={prevStep}>
            Назад
          </button>
        )}
        
        {step < 3 ? (
          <button 
            className="btn btn-primary" 
            onClick={nextStep}
            disabled={!validateStep(step)}
          >
            Далее
          </button>
        ) : (
          <button 
            className="btn btn-success" 
            onClick={handleSubmit}
            disabled={!validateStep(step)}
          >
            Завершить и начать
          </button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
