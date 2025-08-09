import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Automated Parking System/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders Park and Unpark sections', () => {
  render(<App />);
  expect(screen.getByText(/Park Car/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter token number/i)).toBeInTheDocument();
  expect(screen.getByText(/Unpark Car/i)).toBeInTheDocument();
});

