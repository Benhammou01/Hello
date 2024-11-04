import styled from 'styled-components';

export const TrackingContainer = styled.div`
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

export const StatusLegend = styled.div`
  display: flex;
  gap: 1rem;
`;

export const StatusItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.color};
  }
`;

export const InfoContent = styled.div`
  padding: 0.5rem;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #1e3c72;
  }
  
  p {
    margin: 0.25rem 0;
    color: #666;
  }
`; 