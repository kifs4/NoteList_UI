import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function Workspace() {
  const { currentUser, token } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const socketRef = useRef(null);

  // 1. ЗАВАНТАЖЕННЯ НОТАТОК З DJANGO DB ПРИ СТАРТІ
  const fetchNotesFromDjango = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/notes/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await response.json();
      
      // Додано лог для перевірки структури даних нотаток у консолі (F12)
      console.log("Отримані нотатки з Django:", data);
      
      if (response.ok) setNotes(data);
    } catch (err) {
      console.error("Помилка завантаження нотаток:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchNotesFromDjango();
    }
  }, [currentUser]);

  // 2. ВСТАНОВЛЕННЯ WEBSOCKET З'ЄДНАННЯ З DJANGO CHANNELS
  useEffect(() => {
    if (!currentUser) return;

    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/app/?token=${token}`);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.event === 'note_shared') {
        alert(`Миттєве сповіщення: Користувач ${data.sender_email} надіслав вам нотатку!`);
        fetchNotesFromDjango(); 
      }

      if (data.event === 'online_users_list') {
        setOnlineUsers(data.users);
      }
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [currentUser, token]);

  if (!currentUser) {
    return <div className="text-center p-10 font-semibold text-xl text-gray-500">Будь ласка, авторизуйтесь.</div>;
  }

  // 3. СТВОРЕННЯ НОТАТКИ (НАДСИЛАННЯ В DJANGO DB)
  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/notes/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ title, description: desc })
      });
      if (response.ok) {
        setTitle(''); setDesc('');
        fetchNotesFromDjango(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. НАДСИЛАННЯ КОРЕШУ ЧЕРЕЗ WEBSOCKET
  const handleShareNote = (note) => {
    if (!targetUserId) return alert('Вкажіть ID отримувача у полі зверху!');
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'share_note',
        target_user_id: targetUserId,
        note_id: note.id 
      }));
      alert(`Запит на передачу нотатки №${note.id} надіслано користувачу з ID: ${targetUserId}`);
    } else {
      alert('Помилка: WebSocket з’єднання не активне.');
    }
  };

  // 5. РЕДАГУВАННЯ
  const saveEdit = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ title: editTitle, description: editDesc })
      });
      if (response.ok) {
        setEditingNoteId(null);
        fetchNotesFromDjango();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. ВИДАЛЕННЯ
  const deleteNote = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю нотатку з бази Django?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      if (response.ok) fetchNotesFromDjango();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 🌟 НОВИЙ БЛОК: ВІДОБРАЖЕННЯ ОСОБИСТОГО ID КОРИСТУВАЧА */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-sm font-semibold text-blue-900">Поточна авторизація:</h3>
          <p className="text-xs text-blue-700">Email: <b>{currentUser.email || currentUser.username}</b></p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-blue-300 text-center">
          <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Ваш особистий ID:</span>
          <span className="text-xl font-black text-blue-600">{currentUser.id || "Не передано з Redux"}</span>
        </div>
      </div>

      {/* ПАНЕЛЬ АДМІНІСТРАТОРА (ЗЧИТУЄТЬСЯ З DJANGO CACHE) */}
      {currentUser.is_staff && (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 text-red-800 mb-3">
            <span className="p-1.5 bg-red-600 rounded-full text-white animate-pulse"></span>
            <h3 className="text-lg font-bold">Панель Адміністратора (Дані з Django Channel Layers)</h3>
          </div>
          <p className="text-sm text-red-700 mb-4">Ви бачите всіх онлайн користувачів та можете редагувати/видаляти будь-які об'єкти з БД.</p>
          <div className="bg-white p-4 rounded-lg border border-red-100">
            <span className="font-semibold text-gray-700">Активні WebSocket сесії: </span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {onlineUsers.map(uid => (
                <span key={uid} className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">User ID: {uid}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* РОБОЧА ЗОНА */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border h-fit">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Нова нотатка в Django DB</h3>
          <form onSubmit={handleCreateNote} className="space-y-3">
            <input type="text" placeholder="Заголовок нотатки" required className="w-full px-3 py-2 border rounded-md" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Текст..." required rows="4" className="w-full px-3 py-2 border rounded-md" value={desc} onChange={e => setDesc(e.target.value)}></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition">Записати в базу бекенду</button>
          </form>
        </div>

        {/* СПИСОК НОТАТОК */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <input type="number" placeholder="ID отримувача" className="px-3 py-1.5 border-2 border-blue-400 rounded-lg text-sm w-40 font-bold focus:outline-none focus:ring-2" value={targetUserId} onChange={e => setTargetUserId(e.target.value)} />
            <span className="text-xs text-gray-500 font-medium">← 1. Введіть сюди ID того, кому шлете нотатку</span>
          </div>

          {notes.map(note => {
            // Універсальний пошук ID автора в об'єкті нотатки (як би Django його не назвав)
            const noteAuthorId = note.user?.id || note.user || note.user_id || "Невідомо";
            const isOwner = noteAuthorId === currentUser.id;
            // Кнопки відображаються для всіх нотаток
            const canModify = true;

            return (
              <div key={note.id} className="bg-white p-5 rounded-xl shadow-sm border flex flex-col justify-between">
                {editingNoteId === note.id ? (
                  <div className="space-y-2 w-full">
                    <input type="text" className="w-full p-2 border rounded" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <textarea className="w-full p-2 border rounded" rows="3" value={editDesc} onChange={e => setEditDesc(e.target.value)}></textarea>
                    <div className="flex space-x-2">
                      <button onClick={() => saveEdit(note.id)} className="bg-green-600 text-white px-3 py-1 text-sm rounded">Оновити в БД</button>
                      <button onClick={() => setEditingNoteId(null)} className="bg-gray-400 text-white px-3 py-1 text-sm rounded">Скасувати</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-gray-900">{note.title}</h4>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono font-bold">
                          
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2 text-sm whitespace-pre-wrap">{note.description || note.content}</p>
                    </div>

                    {/* КНОПКИ КЕРУВАННЯ */}
                    <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
                      
                      {/* ✅ КНОПКА ЗАВЖДИ ВИДИМА ДЛЯ ТЕСТУВАННЯ ПЕРЕДАЧІ */}
                      <button 
                        onClick={() => handleShareNote(note)} 
                        className="bg-blue-600 text-white px-4 py-1.5 text-xs font-bold rounded-md hover:bg-blue-700 transition shadow-sm"
                      >
                        Відправити користувачу
                      </button>

                      {canModify && (
                        <>
                          <button onClick={() => { setEditingNoteId(note.id); setEditTitle(note.title); setEditDesc(note.description || note.content); }} className="bg-amber-50 text-amber-700 px-3 py-1 text-xs font-bold rounded-md hover:bg-amber-100 transition">Редагувати</button>
                          <button onClick={() => deleteNote(note.id)} className="bg-red-50 text-red-600 px-3 py-1 text-xs font-bold rounded-md hover:bg-red-100 transition">Видалити</button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}