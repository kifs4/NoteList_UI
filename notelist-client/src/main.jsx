import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/index.js'; // Імпортуємо наш Redux-стор
import App from './App.jsx';
import './index.css'; // Підключення стилів Tailwind v4 (@import "tailwindcss")

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Огортаємо додаток у Provider і передаємо йому наш стор */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);