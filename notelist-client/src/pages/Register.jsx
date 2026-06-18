import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', gender: '', birthDate: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email, 
          email: formData.email,
          password: formData.password,
          first_name: formData.name,
          profile_data: { 
            gender: formData.gender,
            birth_date: formData.birthDate
            // Більше ніяких ініціалізацій адмінів з фронтенду!
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Помилка реєстрації. Цей Email вже зайнятий.');
      }

      alert('Реєстрація успішна! Тепер увійдіть через форму входу.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Створення акаунту</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ім'я</label>
            <input id="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input id="password" type="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Стать</label>
              <select id="gender" required className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="">Обрати...</option>
                <option value="Чоловіча">Чоловіча</option>
                <option value="Жіноча">Жіноча</option>
              </select>
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Дата народження</label>
              <input id="birthDate" type="date" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-4">Зареєструватись</button>
        </form>
      </div>
    </div>
  );
}