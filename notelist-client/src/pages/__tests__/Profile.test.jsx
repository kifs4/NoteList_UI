import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Profile from '../Profile';

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'fake-token');
  });

  test('renders loading state initially', () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => {})); // Hang promise
    renderWithProviders(<Profile />);
    expect(screen.getByText('Завантаження профілю...')).toBeInTheDocument();
  });

  test('renders profile data correctly', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          username: 'John Doe',
          email: 'john@example.com',
          gender: 'Чоловіча',
          birth_date: '1990-01-01'
        })
      })
    );

    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch failure', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Помилка: Network error/i)).toBeInTheDocument();
    });
  });
});
