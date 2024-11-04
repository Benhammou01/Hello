import React, { createContext, useState, useContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const lightTheme = {
  primary: '#1e3c72',
  secondary: '#2a5298',
  background: '#f0f2f5',
  cardBg: '#ffffff',
  text: '#1F2937',
  textSecondary: '#4B5563',
  border: '#E5E7EB',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  shadow: 'rgba(0, 0, 0, 0.1)'
};

export const darkTheme = {
  primary: '#3B82F6',
  secondary: '#60A5FA',
  background: '#111827',
  cardBg: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#374151',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#EF4444',
  shadow: 'rgba(0, 0, 0, 0.3)'
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 