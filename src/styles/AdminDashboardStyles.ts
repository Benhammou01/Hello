import styled from 'styled-components';

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 2rem;
`;

export const Header = styled.h1`
  color: #1e3c72;
  margin-bottom: 2rem;
  font-size: 2rem;
  padding-left: 1rem;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

export const GridItem = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const IconContainer = styled.div`
  font-size: 2.5rem;
  color: #1e3c72;
  margin-bottom: 1rem;
  text-align: center;
`;

export const Title = styled.h2`
  color: #2a5298;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

export const Description = styled.p`
  color: #666;
  text-align: center;
  line-height: 1.5;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  background: transparent;
  border: none;
  color: #1e3c72;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: #2a5298;
  }
  
  i {
    font-size: 0.875rem;
  }
`; 