import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme}>
      {isDarkMode ? (
        <i className="fas fa-sun"></i>
      ) : (
        <i className="fas fa-moon"></i>
      )}
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.border};
  }

  i {
    transition: transform 0.3s ease;
  }

  &:hover i {
    transform: rotate(360deg);
  }
`;

export default ThemeToggle; 