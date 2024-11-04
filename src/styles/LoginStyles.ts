import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
`;

export const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

export const ToggleContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ active }) => (active ? '#667eea' : '#f3f4f6')};
  color: ${({ active }) => (active ? 'white' : '#4b5563')};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ active }) => (active ? '#5a67d8' : '#e5e7eb')};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const LoginButton = styled.button`
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #5a67d8;
  }
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.875rem;
`;

export const RegisterButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
  transition: color 0.3s ease;

  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
`;

export const RegisterLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #4b5563;
  font-size: 0.875rem;
`;