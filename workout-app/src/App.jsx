import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Assessment from './pages/Assessment';
import WorkoutBuilder from './pages/WorkoutBuilder';
import Schedule from './pages/Schedule';
import { Menu, Sun, Moon, RotateCcw, Dumbbell, Calendar, Wrench, ClipboardCheck, Sparkles, Target } from 'lucide-react';
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
    <button onClick={toggleTheme} className="nav-link theme-toggle" title="Toggle theme">
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

const MobileMenu = ({ isOpen, onClose }) => {
  const { userProfile, clearAllData } = useAppContext();

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button onClick={onClose} className="close-menu-btn">&times;</button>
        </div>
        <nav className="mobile-menu-nav">
          <Link to="/schedule" onClick={onClose}><Calendar size={18} />Расписание</Link>
          <Link to="/builder" onClick={onClose}><Wrench size={18} />Конструктор</Link>
          {!userProfile && <Link to="/assessment" onClick={onClose}><ClipboardCheck size={18} />Тестирование</Link>}
          {userProfile && (
            <button onClick={() => { clearAllData(); onClose(); }} className="reset-btn">
              <RotateCcw size={18} />Сброс
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

const Navigation = () => {
  const { userProfile, clearAllData } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="main-nav">
        <div className="nav-brand">
          <Link to="/"><Dumbbell size={28} /> FitPlan</Link>
        </div>
        <div className="nav-links">
          <Link to="/schedule" className="nav-link"><Calendar size={16} /> Расписание</Link>
          <Link to="/builder" className="nav-link"><Wrench size={16} /> Конструктор</Link>
          {!userProfile && (
            <Link to="/assessment" className="nav-link"><ClipboardCheck size={16} /> Тестирование</Link>
          )}
          {userProfile && (
            <button onClick={clearAllData} className="nav-link reset-btn">
              <RotateCcw size={16} /> Сброс
            </button>
          )}
          <ThemeToggle />
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </nav>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

const Dashboard = () => {
  const { userProfile } = useAppContext();

  if (!userProfile) {
    return (
      <div className="dashboard">
        <div className="welcome-card">
          <div className="welcome-icon"><Sparkles size={48} /></div>
          <h1>Добро пожаловать в FitPlan!</h1>
          <p className="welcome-subtitle">Создавайте персональные тренировки и следите за своим прогрессом</p>
          
          <div className="features">
            <div className="feature">
              <div className="feature-icon-wrap"><Target size={32} /></div>
              <h3>Персонализация</h3>
              <p>Рекомендации по весу на основе вашего уровня</p>
            </div>
            <div className="feature">
              <div className="feature-icon-wrap"><Wrench size={32} /></div>
              <h3>Конструктор</h3>
              <p>Создавайте тренировки из 24+ упражнений</p>
            </div>
            <div className="feature">
              <div className="feature-icon-wrap"><Calendar size={32} /></div>
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
        <div className="profile-header">
          <div className="avatar">{userProfile.fitnessLevel.charAt(0)}</div>
          <div>
            <h1>Привет! 👋</h1>
            <p>Ваш профиль готов к тренировкам</p>
          </div>
        </div>
        
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
            <Calendar size={32} />
            <strong>Расписание</strong>
            <p>Посмотреть план тренировок</p>
          </Link>
          <Link to="/builder" className="action-card">
            <Wrench size={32} />
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
