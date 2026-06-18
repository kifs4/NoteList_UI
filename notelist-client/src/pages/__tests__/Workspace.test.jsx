import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';
import Workspace from '../Workspace';

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.OPEN;
    this.send = jest.fn();
    this.close = jest.fn();
  }
}

global.WebSocket = MockWebSocket;

const mockNotes = [
  { id: 1, title: 'Note 1', description: 'Desc 1', user: { id: 1 } },
  { id: 2, title: 'Note 2', description: 'Desc 2', user: { id: 2 } }
];

describe('Workspace Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true); // Mock confirm dialog
    window.alert = jest.fn(); // Mock alert
  });

  const preloadedState = {
    auth: {
      currentUser: { id: 1, email: 'test@test.com', is_staff: false },
      token: 'fake-token'
    }
  };

  test('renders workspace and fetches notes', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockNotes)
      })
    );

    renderWithProviders(<Workspace />, { preloadedState });

    expect(screen.getByText(/Нова нотатка в Django DB/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
    });
  });

  test('creates a new note', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]) // Mock fetch on initial load and after create
      })
    );

    renderWithProviders(<Workspace />, { preloadedState });

    await userEvent.type(screen.getByPlaceholderText('Заголовок нотатки'), 'New Note');
    await userEvent.type(screen.getByPlaceholderText('Текст...'), 'New Description');
    
    fireEvent.click(screen.getByRole('button', { name: /Записати в базу/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // 1 for initial fetch, 1 for POST
    });
  });

  test('handles edit button click', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockNotes[0]])
      })
    );

    renderWithProviders(<Workspace />, { preloadedState });

    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: /Редагувати/i });
    fireEvent.click(editButtons[0]);

    expect(screen.getByRole('button', { name: /Оновити в БД/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Скасувати/i })).toBeInTheDocument();
  });
});
