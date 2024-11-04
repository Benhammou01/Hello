import React, { useState } from 'react';
import {
  DashboardContainer,
  Header,
  GridContainer,
  GridItem,
  IconContainer,
  Title,
  Description,
  BackButton
} from '../styles/AdminDashboardStyles';
import styled from 'styled-components';
import CarTracking from '../components/CarTracking';
import CarManagement from '../components/CarManagement';
import MaintenanceAlerts from '../components/MaintenanceAlerts';
import DailyReport from '../components/DailyReport';
import UserManagement from '../components/UserManagement';
import Analytics from '../components/Analytics';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

// Add TopBar styled component
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const AdminDashboard: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const { translations, language } = useLanguage();

  const renderFeature = () => {
    switch (selectedFeature) {
      case 'car-tracking':
        return <CarTracking />;
      case 'car-management':
        return <CarManagement />;
      case 'maintenance-alerts':
        return <MaintenanceAlerts />;
      case 'daily-report':
        return <DailyReport />;
      case 'user-management':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      <TopBar>
        <Header>{translations[language].adminDashboard}</Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </TopBar>
      {!selectedFeature ? (
        <GridContainer>
          <GridItem onClick={() => setSelectedFeature('car-tracking')}>
            <IconContainer>
              <i className="fas fa-map-marker-alt"></i>
            </IconContainer>
            <Title>{translations[language].carTracking}</Title>
            <Description>{translations[language].trackVehicles}</Description>
          </GridItem>

          <GridItem onClick={() => setSelectedFeature('car-management')}>
            <IconContainer>
              <i className="fas fa-car"></i>
            </IconContainer>
            <Title>{translations[language].carManagement}</Title>
            <Description>{translations[language].manageFleet}</Description>
          </GridItem>

          <GridItem onClick={() => setSelectedFeature('maintenance-alerts')}>
            <IconContainer>
              <i className="fas fa-tools"></i>
            </IconContainer>
            <Title>{translations[language].maintenanceAlerts}</Title>
            <Description>{translations[language].monitorMaintenance}</Description>
          </GridItem>

          <GridItem onClick={() => setSelectedFeature('daily-report')}>
            <IconContainer>
              <i className="fas fa-chart-bar"></i>
            </IconContainer>
            <Title>{translations[language].dailyReport}</Title>
            <Description>{translations[language].viewActivities}</Description>
          </GridItem>

          <GridItem onClick={() => setSelectedFeature('user-management')}>
            <IconContainer>
              <i className="fas fa-users"></i>
            </IconContainer>
            <Title>{translations[language].userManagement}</Title>
            <Description>{translations[language].manageAccounts}</Description>
          </GridItem>

          <GridItem onClick={() => setSelectedFeature('analytics')}>
            <IconContainer>
              <i className="fas fa-chart-line"></i>
            </IconContainer>
            <Title>{translations[language].analytics}</Title>
            <Description>{translations[language].trackRevenue}</Description>
          </GridItem>
        </GridContainer>
      ) : (
        <>
          <BackButton onClick={() => setSelectedFeature(null)}>
            <i className="fas fa-arrow-left"></i> {translations[language].back} to Dashboard
          </BackButton>
          {renderFeature()}
        </>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard; 