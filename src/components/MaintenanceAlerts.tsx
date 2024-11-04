import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Move getAlertColor outside of the component
const getAlertColor = (type: MaintenanceAlert['type']) => {
  switch (type) {
    case 'overdue':
      return '#DC2626';
    case 'due':
      return '#F59E0B';
    case 'upcoming':
      return '#2563EB';
    default:
      return '#6B7280';
  }
};

interface Car {
  id: string;
  brand: string;
  model: string;
  plate: string;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface MaintenanceAlert {
  id: string;
  carId: string;
  type: 'upcoming' | 'due' | 'overdue';
  message: string;
  mileage: number;
  daysUntilDue?: number;
}

interface MaintenanceSchedule {
  carId: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceType: string;
  notes: string;
}

const MaintenanceAlerts: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Camry',
      plate: 'ABC-123',
      mileage: 9800,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-07-15'
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'CR-V',
      plate: 'XYZ-789',
      mileage: 19950,
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-08-01'
    }
  ]);

  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<MaintenanceAlert | null>(null);
  const [schedule, setSchedule] = useState<MaintenanceSchedule>({
    carId: '',
    scheduledDate: '',
    scheduledTime: '',
    serviceType: 'regular',
    notes: ''
  });

  const checkMaintenanceAlerts = () => {
    const newAlerts: MaintenanceAlert[] = [];

    cars.forEach(car => {
      const nextMileageCheck = Math.ceil(car.mileage / 10000) * 10000;
      const remainingKm = nextMileageCheck - car.mileage;
      const nextMaintenanceDate = new Date(car.nextMaintenance);
      const today = new Date();
      const daysUntilMaintenance = Math.ceil((nextMaintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Check mileage-based alerts
      if (remainingKm <= 200) {
        newAlerts.push({
          id: `${car.id}-mileage`,
          carId: car.id,
          type: remainingKm <= 0 ? 'overdue' : 'due',
          message: `Maintenance ${remainingKm <= 0 ? 'overdue' : 'due'} at ${nextMileageCheck.toLocaleString()}km (${Math.abs(remainingKm)}km ${remainingKm <= 0 ? 'over' : 'remaining'})`,
          mileage: car.mileage
        });
      } else if (remainingKm <= 500) {
        newAlerts.push({
          id: `${car.id}-mileage`,
          carId: car.id,
          type: 'upcoming',
          message: `Maintenance upcoming at ${nextMileageCheck.toLocaleString()}km (${remainingKm}km remaining)`,
          mileage: car.mileage
        });
      }

      // Check date-based alerts
      if (daysUntilMaintenance <= 30) {
        newAlerts.push({
          id: `${car.id}-date`,
          carId: car.id,
          type: daysUntilMaintenance <= 0 ? 'overdue' : daysUntilMaintenance <= 7 ? 'due' : 'upcoming',
          message: `Scheduled maintenance ${daysUntilMaintenance <= 0 ? 'overdue' : 'due'} on ${nextMaintenanceDate.toLocaleDateString()}`,
          mileage: car.mileage,
          daysUntilDue: daysUntilMaintenance
        });
      }
    });

    setAlerts(newAlerts);
  };

  useEffect(() => {
    checkMaintenanceAlerts();
    // Check alerts every hour
    const interval = setInterval(checkMaintenanceAlerts, 3600000);
    return () => clearInterval(interval);
  }, [cars]);

  const handleScheduleMaintenance = (alert: MaintenanceAlert) => {
    setSelectedAlert(alert);
    setSchedule({
      carId: alert.carId,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      serviceType: 'regular',
      notes: ''
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    console.log('Maintenance Scheduled:', schedule);
    
    // Update the car's next maintenance date
    setCars(cars.map(car => {
      if (car.id === schedule.carId) {
        return {
          ...car,
          nextMaintenance: new Date(schedule.scheduledDate).toISOString()
        };
      }
      return car;
    }));

    setShowScheduleModal(false);
    setSelectedAlert(null);
  };

  return (
    <Container>
      <Header>
        <h2>Maintenance Alerts</h2>
        <AlertCount>
          {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
        </AlertCount>
      </Header>

      <AlertsContainer>
        {alerts.length === 0 ? (
          <NoAlerts>No maintenance alerts at this time</NoAlerts>
        ) : (
          alerts.sort((a, b) => {
            const priorityOrder = { overdue: 0, due: 1, upcoming: 2 };
            return priorityOrder[a.type] - priorityOrder[b.type];
          }).map(alert => {
            const car = cars.find(c => c.id === alert.carId);
            return (
              <AlertCard key={alert.id} type={alert.type}>
                <AlertHeader>
                  <AlertType type={alert.type}>
                    {alert.type.toUpperCase()}
                  </AlertType>
                  <CarInfo>
                    {car?.brand} {car?.model} ({car?.plate})
                  </CarInfo>
                </AlertHeader>
                <AlertMessage>{alert.message}</AlertMessage>
                <AlertDetails>
                  <span>
                    <i className="fas fa-tachometer-alt"></i>
                    Current Mileage: {alert.mileage.toLocaleString()}km
                  </span>
                  {alert.daysUntilDue !== undefined && (
                    <span>
                      <i className="fas fa-calendar-alt"></i>
                      {alert.daysUntilDue <= 0 
                        ? `${Math.abs(alert.daysUntilDue)} days overdue`
                        : `${alert.daysUntilDue} days remaining`}
                    </span>
                  )}
                </AlertDetails>
                <ActionButton onClick={() => handleScheduleMaintenance(alert)}>
                  Schedule Maintenance
                </ActionButton>
              </AlertCard>
            );
          })
        )}
      </AlertsContainer>

      {showScheduleModal && selectedAlert && (
        <ScheduleModal>
          <ModalContent>
            <ModalHeader>
              <h3>Schedule Maintenance</h3>
              <CloseButton onClick={() => setShowScheduleModal(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <Form onSubmit={handleScheduleSubmit}>
              <FormGroup>
                <Label>Car</Label>
                <ScheduleCarInfo>
                  {cars.find(c => c.id === selectedAlert.carId)?.brand} {' '}
                  {cars.find(c => c.id === selectedAlert.carId)?.model} ({' '}
                  {cars.find(c => c.id === selectedAlert.carId)?.plate})
                </ScheduleCarInfo>
              </FormGroup>
              <FormGroup>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={schedule.scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSchedule({ ...schedule, scheduledDate: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={schedule.scheduledTime}
                  onChange={(e) => setSchedule({ ...schedule, scheduledTime: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Service Type</Label>
                <Select
                  value={schedule.serviceType}
                  onChange={(e) => setSchedule({ ...schedule, serviceType: e.target.value })}
                  required
                >
                  <option value="regular">Regular Maintenance</option>
                  <option value="oil">Oil Change</option>
                  <option value="tires">Tire Service</option>
                  <option value="brake">Brake Service</option>
                  <option value="major">Major Service</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Notes</Label>
                <Textarea
                  value={schedule.notes}
                  onChange={(e) => setSchedule({ ...schedule, notes: e.target.value })}
                  placeholder="Add any special instructions or notes..."
                  rows={4}
                />
              </FormGroup>
              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Schedule Maintenance
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ScheduleModal>
      )}
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
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    color: #1e3c72;
    margin: 0;
  }
`;

const AlertCount = styled.span`
  background: #E5E7EB;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #4B5563;
`;

const AlertsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoAlerts = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6B7280;
  font-style: italic;
`;

const AlertCard = styled.div<{ type: MaintenanceAlert['type'] }>`
  border: 1px solid #E5E7EB;
  border-left: 4px solid ${({ type }) => getAlertColor(type)};
  border-radius: 0.5rem;
  padding: 1rem;
  background: white;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AlertType = styled.span<{ type: MaintenanceAlert['type'] }>`
  background: ${({ type }) => getAlertColor(type)};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: bold;
`;

const CarInfo = styled.span`
  color: #4B5563;
  font-weight: 500;
`;

const AlertMessage = styled.p`
  margin: 0.5rem 0;
  color: #1F2937;
`;

const AlertDetails = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  color: #6B7280;
  font-size: 0.875rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  i {
    color: #4B5563;
  }
`;

const ActionButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #1e3c72;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2a5298;
  }
`;

const ScheduleModal = styled.div`
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

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    color: #1e3c72;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #4B5563;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
  color: #4B5563;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #F3F4F6;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: #1e3c72;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2a5298;
  }
`;

const ScheduleCarInfo = styled.div`
  padding: 0.75rem;
  background: #F3F4F6;
  border-radius: 0.5rem;
  color: #4B5563;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

export default MaintenanceAlerts; 