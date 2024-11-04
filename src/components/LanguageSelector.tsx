import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = {
    en: { icon: '🇺🇸', title: 'English' },
    fr: { icon: '🇫🇷', title: 'Français' },
    ar: { icon: '🇩🇿', title: 'العربية' }
  };

  return (
    <Container>
      <LanguageButton onClick={() => setIsOpen(!isOpen)} title={languages[language].title}>
        {languages[language].icon}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} />
      </LanguageButton>
      {isOpen && (
        <Dropdown>
          {Object.entries(languages).map(([code, { icon, title }]) => (
            <DropdownItem
              key={code}
              active={language === code}
              onClick={() => {
                setLanguage(code as 'en' | 'fr' | 'ar');
                setIsOpen(false);
              }}
              dir={code === 'ar' ? 'rtl' : 'ltr'}
              title={title}
            >
              {icon}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.border};
  }

  i {
    margin-left: 0.25rem;
    font-size: 0.75rem;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
`;

const DropdownItem = styled.button<{ active: boolean; dir?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ active, theme }) => active ? theme.primary + '20' : 'transparent'};
  color: ${({ active, theme }) => active ? theme.primary : theme.text};
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  direction: ${({ dir }) => dir || 'ltr'};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primary + '10'};
  }
`;

export default LanguageSelector;