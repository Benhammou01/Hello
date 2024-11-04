import React, { useState } from 'react';
import styled from 'styled-components';

interface CarReport {
  id: string;
  brand: string;
  model: string;
  plate: string;
  status: 'available' | 'rented' | 'maintenance';
  dailyStats: {
    mileageDriven: number;
    fuelConsumption: number;
    revenue: number;
    currentLocation: string;
  };
  activities: {
    time: string;
    type: 'rental' | 'return' | 'maintenance' | 'location';
    description: string;
  }[];
}

const DailyReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reports] = useState<CarReport[]>([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Camry',
      plate: 'ABC-123',
      status: 'rented',
      dailyStats: {
        mileageDriven: 150,
        fuelConsumption: 12.5,
        revenue: 75,
        currentLocation: 'Downtown'
      },
      activities: [
        {
          time: '08:30',
          type: 'rental',
          description: 'Rented by John Doe'
        },
        {
          time: '12:45',
          type: 'location',
          description: 'Spotted at Shopping Mall'
        },
        {
          time: '17:15',
          type: 'maintenance',
          description: 'Low fuel alert'
        }
      ]
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'CR-V',
      plate: 'XYZ-789',
      status: 'available',
      dailyStats: {
        mileageDriven: 85,
        fuelConsumption: 8.2,
        revenue: 120,
        currentLocation: 'Airport'
      },
      activities: [
        {
          time: '09:15',
          type: 'return',
          description: 'Returned by Sarah Smith'
        },
        {
          time: '10:30',
          type: 'maintenance',
          description: 'Routine cleaning'
        },
        {
          time: '14:20',
          type: 'location',
          description: 'Moved to Airport location'
        }
      ]
    }
  ]);

  const totalStats = reports.reduce(
    (acc, car) => ({
      mileage: acc.mileage + car.dailyStats.mileageDriven,
      fuel: acc.fuel + car.dailyStats.fuelConsumption,
      revenue: acc.revenue + car.dailyStats.revenue
    }),
    { mileage: 0, fuel: 0, revenue: 0 }
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'rental':
        return 'fa-key';
      case 'return':
        return 'fa-undo';
      case 'maintenance':
        return 'fa-tools';
      case 'location':
        return 'fa-map-marker-alt';
      default:
        return 'fa-info-circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'rental':
        return '#4CAF50';
      case 'return':
        return '#2196F3';
      case 'maintenance':
        return '#FFC107';
      case 'location':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <h2>Daily Car Report</h2>
          <DatePicker
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <StatsSummary>
          <StatItem>
            <i className="fas fa-road"></i>
            <div>
              <StatLabel>Total Mileage</StatLabel>
              <StatValue>{totalStats.mileage} km</StatValue>
            </div>
          </StatItem>
          <StatItem>
            <i className="fas fa-gas-pump"></i>
            <div>
              <StatLabel>Fuel Used</StatLabel>
              <StatValue>{totalStats.fuel.toFixed(1)} L</StatValue>
            </div>
          </StatItem>
          <StatItem>
            <i className="fas fa-dollar-sign"></i>
            <div>
              <StatLabel>Revenue</StatLabel>
              <StatValue>${totalStats.revenue}</StatValue>
            </div>
          </StatItem>
        </StatsSummary>
      </Header>

      <ReportGrid>
        {reports.map(car => (
          <CarReportCard key={car.id}>
            <CarHeader>
              <CarInfo>
                <h3>{car.brand} {car.model}</h3>
                <PlateNumber>{car.plate}</PlateNumber>
              </CarInfo>
              <StatusBadge status={car.status}>
                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
              </StatusBadge>
            </CarHeader>

            <DailyStats>
              <StatBox>
                <StatIcon className="fas fa-road" />
                <div>
                  <StatBoxLabel>Distance</StatBoxLabel>
                  <StatBoxValue>{car.dailyStats.mileageDriven} km</StatBoxValue>
                </div>
              </StatBox>
              <StatBox>
                <StatIcon className="fas fa-gas-pump" />
                <div>
                  <StatBoxLabel>Fuel</StatBoxLabel>
                  <StatBoxValue>{car.dailyStats.fuelConsumption} L</StatBoxValue>
                </div>
              </StatBox>
              <StatBox>
                <StatIcon className="fas fa-dollar-sign" />
                <div>
                  <StatBoxLabel>Revenue</StatBoxLabel>
                  <StatBoxValue>${car.dailyStats.revenue}</StatBoxValue>
                </div>
              </StatBox>
              <StatBox>
                <StatIcon className="fas fa-map-marker-alt" />
                <div>
                  <StatBoxLabel>Location</StatBoxLabel>
                  <StatBoxValue>{car.dailyStats.currentLocation}</StatBoxValue>
                </div>
              </StatBox>
            </DailyStats>

            <ActivityTimeline>
              <TimelineHeader>Activity Timeline</TimelineHeader>
              {car.activities.map((activity, index) => (
                <ActivityItem key={index}>
                  <ActivityTime>{activity.time}</ActivityTime>
                  <ActivityContent>
                    <ActivityIcon color={getActivityColor(activity.type)}>
                      <i className={`fas ${getActivityIcon(activity.type)}`}></i>
                    </ActivityIcon>
                    <ActivityDescription>{activity.description}</ActivityDescription>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityTimeline>
          </CarReportCard>
        ))}
      </ReportGrid>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 2rem;

  h2 {
    color: #1e3c72;
    margin: 0 0 1rem 0;
  }
`;

const DatePicker = styled.input`
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const StatsSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  background: #F3F4F6;
  padding: 1rem;
  border-radius: 0.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  i {
    font-size: 1.5rem;
    color: #1e3c72;
  }
`;

const StatLabel = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
`;

const StatValue = styled.div`
  color: #1F2937;
  font-weight: 600;
  font-size: 1.125rem;
`;

const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`;

const CarReportCard = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
`;

const CarInfo = styled.div`
  h3 {
    margin: 0;
    color: #1F2937;
  }
`;

const PlateNumber = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ status }) => 
    status === 'available' ? '#DEF7EC' :
    status === 'rented' ? '#FEF3C7' : '#FEE2E2'};
  color: ${({ status }) => 
    status === 'available' ? '#03543F' :
    status === 'rented' ? '#92400E' : '#991B1B'};
`;

const DailyStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
`;

const StatBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #F9FAFB;
  border-radius: 0.5rem;
`;

const StatIcon = styled.i`
  font-size: 1.25rem;
  color: #1e3c72;
`;

const StatBoxLabel = styled.div`
  color: #6B7280;
  font-size: 0.75rem;
`;

const StatBoxValue = styled.div`
  color: #1F2937;
  font-weight: 500;
`;

const ActivityTimeline = styled.div`
  padding: 1rem;
  border-top: 1px solid #E5E7EB;
`;

const TimelineHeader = styled.h4`
  margin: 0 0 1rem 0;
  color: #1F2937;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ActivityTime = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
  min-width: 50px;
`;

const ActivityContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActivityIcon = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

const ActivityDescription = styled.div`
  color: #1F2937;
  font-size: 0.875rem;
`;

export default DailyReport; 