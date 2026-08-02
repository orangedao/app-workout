import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Assessment from './pages/Assessment';
import WorkoutBuilder from './pages/WorkoutBuilder';
import Schedule from './pages/Schedule';
import './App.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('workout_theme');
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('workout_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme} className="nav-link theme-toggle" title="Переключить тему">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

const Navigation = () => {
  const { userProfile, clearAllData } = useAppContext();

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <Link to="/">🏋️ FitPlan</Link>
      </div>
      <div className="nav-links">
        <Link to="/schedule" className="nav-link">📅 Расписание</Link>
        <Link to="/builder" className="nav-link">🏗️ Конструктор</Link>
        {!userProfile && (
          <Link to="/assessment" className="nav-link">📝 Тестирование</Link>
        )}
        {userProfile && (
          <button onClick={clearAllData} className="nav-link reset-btn">
            🔄 Сброс
          </button>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

const Dashboard = () => {
  const { userProfile } = useAppContext();

  if (!userProfile) {
    return (
      <div className="dashboard">
        <div className="welcome-card">
          <h1>Добро пожаловать в FitPlan! 🎉</h1>
          <p>Создавайте персональные тренировки и следите за своим прогрессом</p>
          
          <div className="features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <h3>Персонализация</h3>
              <p>Рекомендации по весу на основе вашего уровня</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🏗️</span>
              <h3>Конструктор</h3>
              <p>Создавайте тренировки из 24+ упражнений</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📅</span>
              <h3>Расписание</h3>
              <p>Планируйте тренировки на неделю вперед</p>
            </div>
          </div>

          <Link to="/assessment" className="btn btn-primary btn-large">
            Пройти входное тестирование
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="profile-summary">
        <h1>Привет! 👋</h1>
        <p>Ваш профиль готов к тренировкам</p>
        
        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-label">Уровень</span>
            <span className="stat-value">{userProfile.fitnessLevel}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Вес</span>
            <span className="stat-value">{userProfile.weight} кг</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">ИМТ</span>
            <span className="stat-value">{userProfile.bmi}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Цели</span>
            <span className="stat-value goals">{userProfile.goals?.length} выбр.</span>
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/schedule" className="action-card">
            <span className="action-icon">📅</span>
            <strong>Расписание</strong>
            <p>Посмотреть план тренировок</p>
          </Link>
          <Link to="/builder" className="action-card">
            <span className="action-icon">🏗️</span>
            <strong>Конструктор</strong>
            <p>Создать новую тренировку</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/builder" element={<WorkoutBuilder />} />
              <Route path="/schedule" element={<Schedule />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
