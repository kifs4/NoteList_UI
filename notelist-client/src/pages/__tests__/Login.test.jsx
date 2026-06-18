import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';
import Login from '../Login';

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByRole('heading', { name: /Вхід в систему/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Увійти/i })).toBeInTheDocument();
  });

  test('handles login successfully', async () => {
    // Mock the global fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({
          user: { id: 1, email: 'test@example.com' },
          token: 'fake-jwt-token'
        }))
      })
    );

    renderWithProviders(<Login />);
    
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Пароль/i), 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /Увійти/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  test('displays error message on failed login', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify({ error: 'Невірний email або пароль' }))
      })
    );

    renderWithProviders(<Login />);
    
    await userEvent.type(screen.getByLabelText(/Email/i), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/Пароль/i), 'wrongpass');
    
    fireEvent.click(screen.getByRole('button', { name: /Увійти/i }));

    expect(await screen.findByText('Невірний email або пароль')).toBeInTheDocument();
  });
});
