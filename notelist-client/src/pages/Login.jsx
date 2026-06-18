import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    setError('');
    
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password: password })
    });

    // Спочатку зчитуємо відповідь як чистий текст
    const responseText = await response.text();

    // Перевіряємо, чи це HTML сторінка помилки Django
    if (responseText.startsWith('<!DOCTYPE') || responseText.includes('<html')) {
      throw new Error(`Сервер Django повернув HTML-сторінку (Помилка ${response.status}). Перевірте термінал PyCharm для діагностики.`);
    }

    // Якщо це не HTML, розпаршуємо як JSON
    const data = JSON.parse(responseText);

    if (!response.ok) {
      throw new Error(data.error || 'Невірний email або пароль');
    }

    // Успішний вхід
    dispatch(loginSuccess({
      user: data.user,   
      token: data.token  
    }));

    navigate('/workspace');
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Вхід в систему</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input id="password" type="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">Увійти</button>
        </form>
      </div>
    </div>
  );
}