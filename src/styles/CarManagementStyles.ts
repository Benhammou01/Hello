import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    color: #1e3c72;
    margin: 0;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }
`;

export const CarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const CarCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const CarImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const CarInfo = styled.div`
  padding: 1rem;
`;

export const CarModel = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #1e3c72;
`;

export const CarDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Detail = styled.span`
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    width: 20px;
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  background: ${({ status }) => 
    status === 'available' ? '#4CAF50' :
    status === 'rented' ? '#FFC107' : '#F44336'};
  color: white;
`;

export const ActionButtons = styled.div`
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  border-top: 1px solid #eee;
`;

export const ActionButton = styled.button<{ color: string }>`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  background: ${({ color }) => color};
  color: white;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    color: #1e3c72;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.25rem;

  &:hover {
    color: #333;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #666;
  font-size: 0.875rem;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

export const SubmitButton = styled.button`
  padding: 0.75rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }
`; 