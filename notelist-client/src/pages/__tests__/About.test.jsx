import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import About from '../About';

describe('About Component', () => {
  test('renders the About page text correctly', () => {
    renderWithProviders(<About />);
    
    expect(screen.getByText('NoteList App')).toBeInTheDocument();
    expect(screen.getByText(/Версія 1.0.0/i)).toBeInTheDocument();
    expect(screen.getByText(/Web-додаток для створення, редагування та миттєвого обміну/i)).toBeInTheDocument();
  });
});
