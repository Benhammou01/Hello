import React, { useState } from 'react';
import styled from 'styled-components';
import AvailableCars from '../components/AvailableCars';
import ReservationSystem from '../components/ReservationSystem';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

const ClientDashboard: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const { translations, language } = useLanguage();

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userType');
    window.location.href = '/login';
  };

  const renderFeature = () => {
    switch (selectedFeature) {
      case 'available-cars':
        return <AvailableCars />;
      case 'reservations':
        return <ReservationSystem />;
      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      <TopBar>
        <Header>{translations[language].clientDashboard}</Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LanguageSelector />
          <ThemeToggle />
          <LogoutButton onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> {translations[language].logout}
          </LogoutButton>
        </div>
      </TopBar>
      {!selectedFeature ? (
        <GridContainer>
          <GridItem onClick={() => setSelectedFeature('available-cars')}>
            <IconContainer>
              <i className="fas fa-car"></i>
            </IconContainer>
            <Title>{translations[language].availableCars}</Title>
            <Description>{translations[language].browseCars}</Description>
          </GridItem>

          <GridItem onClick={() => setSelectedFeature('reservations')}>
            <IconContainer>
              <i className="fas fa-calendar-alt"></i>
            </IconContainer>
            <Title>Reservations</Title>
            <Description>Make and manage your car reservations</Description>
          </GridItem>
        </GridContainer>
      ) : (
        <>
          <BackButton onClick={() => setSelectedFeature(null)}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </BackButton>
          {renderFeature()}
        </>
      )}
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 2rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const Header = styled.h1`
  color: #1e3c72;
  font-size: 2rem;
  margin: 0;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #F44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #D32F2F;
  }

  i {
    font-size: 1rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const GridItem = styled.div`
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

const IconContainer = styled.div`
  font-size: 2.5rem;
  color: #1e3c72;
  margin-bottom: 1rem;
  text-align: center;
`;

const Title = styled.h2`
  color: #2a5298;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  color: #666;
  text-align: center;
  line-height: 1.5;
`;

const BackButton = styled.button`
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

export default ClientDashboard;