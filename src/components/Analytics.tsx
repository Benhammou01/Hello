import React, { useState } from 'react';
import styled from 'styled-components';

interface RentalData {
  date: string;
  revenue: number;
  rentals: number;
  averageDuration: number;
  popularCars: {
    model: string;
    rentals: number;
  }[];
  customerSatisfaction: number;
}

interface MonthlyStats {
  totalRevenue: number;
  totalRentals: number;
  averageDailyRentals: number;
  growthRate: number;
  occupancyRate: number;
}

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Mock data - replace with real API data
  const dailyData: RentalData[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T')[0],
    revenue: Math.floor(Math.random() * 1000) + 500,
    rentals: Math.floor(Math.random() * 20) + 5,
    averageDuration: Math.floor(Math.random() * 3) + 1,
    popularCars: [
      { model: 'Toyota Camry', rentals: Math.floor(Math.random() * 10) + 1 },
      { model: 'Honda CR-V', rentals: Math.floor(Math.random() * 8) + 1 },
      { model: 'Tesla Model 3', rentals: Math.floor(Math.random() * 6) + 1 },
    ],
    customerSatisfaction: Math.floor(Math.random() * 2) + 3,
  }));

  const monthlyStats: MonthlyStats = {
    totalRevenue: dailyData.reduce((acc, day) => acc + day.revenue, 0),
    totalRentals: dailyData.reduce((acc, day) => acc + day.rentals, 0),
    averageDailyRentals: dailyData.reduce((acc, day) => acc + day.rentals, 0) / dailyData.length,
    growthRate: 15.5, // Mock growth rate
    occupancyRate: 78.3, // Mock occupancy rate
  };

  const getChartData = () => {
    // Mock chart data - replace with real data processing
    return dailyData.map(day => ({
      date: day.date,
      revenue: day.revenue,
      rentals: day.rentals,
    })).reverse();
  };

  const getMostPopularCars = () => {
    const carStats = new Map<string, number>();
    dailyData.forEach(day => {
      day.popularCars.forEach(car => {
        carStats.set(car.model, (carStats.get(car.model) || 0) + car.rentals);
      });
    });
    return Array.from(carStats.entries())
      .map(([model, rentals]) => ({ model, rentals }))
      .sort((a, b) => b.rentals - a.rentals)
      .slice(0, 5);
  };

  return (
    <Container>
      <Header>
        <div>
          <h2>Analytics Dashboard</h2>
          <DateRangeContainer>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span>to</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </DateRangeContainer>
        </div>
        <TimeframeSelector>
          <TimeframeButton
            active={timeframe === 'daily'}
            onClick={() => setTimeframe('daily')}
          >
            Daily
          </TimeframeButton>
          <TimeframeButton
            active={timeframe === 'weekly'}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </TimeframeButton>
          <TimeframeButton
            active={timeframe === 'monthly'}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </TimeframeButton>
        </TimeframeSelector>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#4CAF50">
            <i className="fas fa-dollar-sign"></i>
          </StatIcon>
          <StatInfo>
            <StatLabel>Total Revenue</StatLabel>
            <StatValue>${monthlyStats.totalRevenue.toLocaleString()}</StatValue>
            <StatChange positive={true}>+12.5% vs last month</StatChange>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#2196F3">
            <i className="fas fa-car"></i>
          </StatIcon>
          <StatInfo>
            <StatLabel>Total Rentals</StatLabel>
            <StatValue>{monthlyStats.totalRentals}</StatValue>
            <StatChange positive={true}>+8.3% vs last month</StatChange>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#FF9800">
            <i className="fas fa-chart-line"></i>
          </StatIcon>
          <StatInfo>
            <StatLabel>Average Daily Rentals</StatLabel>
            <StatValue>{monthlyStats.averageDailyRentals.toFixed(1)}</StatValue>
            <StatChange positive={false}>-2.1% vs last month</StatChange>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#9C27B0">
            <i className="fas fa-percentage"></i>
          </StatIcon>
          <StatInfo>
            <StatLabel>Occupancy Rate</StatLabel>
            <StatValue>{monthlyStats.occupancyRate}%</StatValue>
            <StatChange positive={true}>+5.2% vs last month</StatChange>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <ChartSection>
        <ChartTitle>Revenue & Rentals Trend</ChartTitle>
        <ChartContainer>
          {/* Replace with actual chart component */}
          <ChartPlaceholder>
            {getChartData().map((data, index) => (
              <ChartBar
                key={index}
                height={`${(data.revenue / 1000) * 100}%`}
                tooltip={`${data.date}: $${data.revenue} (${data.rentals} rentals)`}
              />
            ))}
          </ChartPlaceholder>
        </ChartContainer>
      </ChartSection>

      <BottomGrid>
        <PopularCarsSection>
          <SectionTitle>Most Popular Cars</SectionTitle>
          <CarsList>
            {getMostPopularCars().map((car, index) => (
              <CarItem key={index}>
                <CarRank>{index + 1}</CarRank>
                <CarInfo>
                  <CarModel>{car.model}</CarModel>
                  <CarRentals>{car.rentals} rentals</CarRentals>
                </CarInfo>
                <RentalBar percentage={(car.rentals / getMostPopularCars()[0].rentals) * 100} />
              </CarItem>
            ))}
          </CarsList>
        </PopularCarsSection>

        <MetricsSection>
          <SectionTitle>Key Metrics</SectionTitle>
          <MetricsList>
            <MetricItem>
              <MetricLabel>Average Rental Duration</MetricLabel>
              <MetricValue>2.8 days</MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Customer Satisfaction</MetricLabel>
              <MetricValue>4.5/5.0</MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Revenue per Rental</MetricLabel>
              <MetricValue>${(monthlyStats.totalRevenue / monthlyStats.totalRentals).toFixed(2)}</MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Growth Rate</MetricLabel>
              <MetricValue>+{monthlyStats.growthRate}%</MetricValue>
            </MetricItem>
          </MetricsList>
        </MetricsSection>
      </BottomGrid>
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  h2 {
    color: #1e3c72;
    margin: 0 0 1rem 0;
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TimeframeButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ active }) => active ? '#1e3c72' : '#E5E7EB'};
  border-radius: 0.5rem;
  background: ${({ active }) => active ? '#1e3c72' : 'white'};
  color: ${({ active }) => active ? 'white' : '#4B5563'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ active }) => active ? '#1e3c72' : '#F3F4F6'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #F9FAFB;
  border-radius: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  color: #1F2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const StatChange = styled.div<{ positive: boolean }>`
  color: ${({ positive }) => positive ? '#059669' : '#DC2626'};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: ${({ positive }) => positive ? '4px solid #059669' : '0'};
    border-top: ${({ positive }) => positive ? '0' : '4px solid #DC2626'};
  }
`;

const ChartSection = styled.div`
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  color: #1F2937;
  margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
  background: #F9FAFB;
  border-radius: 1rem;
  padding: 1.5rem;
  height: 300px;
`;

const ChartPlaceholder = styled.div`
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 2px;
`;

const ChartBar = styled.div<{ height: string; tooltip: string }>`
  flex: 1;
  height: ${({ height }) => height};
  background: #1e3c72;
  border-radius: 2px;
  transition: height 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    background: #2a5298;

    &::after {
      content: '${({ tooltip }) => tooltip}';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #1F2937;
      color: white;
      padding: 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      white-space: nowrap;
    }
  }
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const PopularCarsSection = styled.div`
  background: #F9FAFB;
  border-radius: 1rem;
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #1F2937;
  margin-bottom: 1rem;
`;

const CarsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CarRank = styled.div`
  width: 24px;
  height: 24px;
  background: #1e3c72;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
`;

const CarInfo = styled.div`
  flex: 1;
`;

const CarModel = styled.div`
  color: #1F2937;
  font-weight: 500;
`;

const CarRentals = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
`;

const RentalBar = styled.div<{ percentage: number }>`
  width: 100px;
  height: 4px;
  background: #E5E7EB;
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ percentage }) => percentage}%;
    background: #1e3c72;
    transition: width 0.3s ease;
  }
`;

const MetricsSection = styled.div`
  background: #F9FAFB;
  border-radius: 1rem;
  padding: 1.5rem;
`;

const MetricsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetricItem = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
`;

const MetricLabel = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  color: #1F2937;
  font-size: 1.25rem;
  font-weight: 600;
`;

export default Analytics; 