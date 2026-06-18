import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';
import Register from '../Register';

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn(); // Mock alert used in Register.jsx
  });

  test('renders registration form correctly', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByRole('heading', { name: /Створення акаунту/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Ім'я/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Стать/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Дата народження/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Зареєструватись/i })).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );

    renderWithProviders(<Register />);
    
    await userEvent.type(screen.getByLabelText(/Ім'я/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Пароль/i), 'password123');
    await userEvent.selectOptions(screen.getByLabelText(/Стать/i), 'Чоловіча');
    
    // Simulate typing a date
    fireEvent.change(screen.getByLabelText(/Дата народження/i), { target: { value: '2000-01-01' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Зареєструватись/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('Реєстрація успішна! Тепер увійдіть через форму входу.');
    });
  });
});
