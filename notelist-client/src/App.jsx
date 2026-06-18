import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from './store/authSlice';

import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import Workspace from './pages/Workspace';

export default function App() {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Навігаційна панель */}
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex space-x-6 font-medium">
              {/* Посилання доступні ТІЛЬКИ після реєстрації/входу */}
              {currentUser && (
                <>
                  <Link to="/workspace" className="hover:text-blue-200 transition">Робоча сторінка</Link>
                  <Link to="/profile" className="hover:text-blue-200 transition">Профіль</Link>
                </>
              )}
              <Link to="/about" className="hover:text-blue-200 transition">Про додаток</Link>
            </div>
            
            <div className="flex space-x-4 items-center">
              {currentUser ? (
                <>
                  <span className="text-sm bg-blue-700 px-3 py-1 rounded-full border border-blue-400">
                    {currentUser.email} {currentUser.is_staff && '👑'}
                  </span>
                  <button 
                    onClick={() => dispatch(logoutUser())} 
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 font-semibold rounded-lg transition text-sm"
                  >
                    Вийти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 hover:bg-blue-700 rounded-lg transition">Вхід</Link>
                  <Link to="/register" className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">Реєстрація</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Контент сторінок */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            {/* Якщо користувач увійшов — кидаємо на workspace, якщо ні — на логін */}
            <Route path="/" element={currentUser ? <Workspace /> : <Navigate to="/login" />} />
            
            {/* Захист роутів: не пускаємо на сторінки без авторизації */}
            <Route path="/workspace" element={currentUser ? <Workspace /> : <Navigate to="/login" />} />
            <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/workspace" />} />
            <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/workspace" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}