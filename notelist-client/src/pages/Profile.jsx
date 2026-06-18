import React, { useState, useEffect } from 'react';

const Profile = () => {
    // 1. Початковий стан робимо null (або пустим об'єктом), щоб дані завантажувалися динамічно
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 2. Витягуємо токен, який React зберіг під час успішного входу
        const token = localStorage.getItem('token'); 

        if (!token) {
            setError('Ви не авторизовані. Будь ласка, увійдіть в акаунт.');
            setLoading(false);
            return;
        }

        // 3. Робимо запит до вашого Django API профілю
        fetch('http://127.0.0.1:8000/api/profile/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Передаємо токен у форматі, який вимагає Django REST Framework
                'Authorization': `Token ${token}` 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося завантажити дані профілю');
            }
            return response.json();
        })
        .then(data => {
            setUser(data); // Записуємо реальні дані з Django (id, username, email тощо) в стейт
            setLoading(false);
        })
        .catch(err => {
            console.error('Помилка профілю:', err);
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Завантаження профілю...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>Помилка: {error}</div>;

    return (
        <div className="profile-card" style={{ padding: '20px' }}>
            <h2>Профіль користувача</h2>
            <table className="profile-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Параметр</th>
                        <th style={{ padding: '10px' }}>Значення</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}><b>Ім'я</b></td>
                        {/* Важливо: Серіалізатор Django повертає поле 'username' */}
                        <td style={{ padding: '10px' }}>{user?.first_name || user?.username}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}><b>Email</b></td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user?.email}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}><b>Стать</b></td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user?.gender || 'Чоловіча'}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}><b>Дата народження</b></td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user?.birth_date || '02.02.2002'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Profile;