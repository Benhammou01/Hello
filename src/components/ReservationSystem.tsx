import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Reservation } from '../types/types';

const ReservationSystem: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load reservations from localStorage
  useEffect(() => {
    const loadReservations = () => {
      const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      setReservations(savedReservations);
    };

    loadReservations();
    // Add event listener for storage changes
    window.addEventListener('storage', loadReservations);
    return () => window.removeEventListener('storage', loadReservations);
  }, []);

  const handleCancelReservation = (id: string) => {
    const updatedReservations = reservations.map(res =>
      res.id === id ? { ...res, status: 'cancelled' as const } : res
    );
    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
  };

  const filteredReservations = reservations.filter(res =>
    filterStatus === 'all' ? true : res.status === filterStatus
  );

  return (
    <Container>
      <Header>
        <div>
          <h2>My Reservations</h2>
          <FilterSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Reservations</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </FilterSelect>
        </div>
      </Header>

      <ReservationsGrid>
        {filteredReservations.length === 0 ? (
          <NoReservations>
            <i className="fas fa-calendar-times"></i>
            <p>No reservations found</p>
          </NoReservations>
        ) : (
          filteredReservations.map(reservation => (
            <ReservationCard key={reservation.id}>
              <CarImage src={reservation.car.image} alt={`${reservation.car.brand} ${reservation.car.model}`} />
              <ReservationInfo>
                <CarDetails>
                  <CarName>{reservation.car.brand} {reservation.car.model}</CarName>
                  <PlateNumber>{reservation.car.plate}</PlateNumber>
                </CarDetails>

                <ReservationDetails>
                  <DetailItem>
                    <i className="fas fa-calendar-alt"></i>
                    <div>
                      <Label>Rental Period</Label>
                      <Value>
                        {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                      </Value>
                    </div>
                  </DetailItem>

                  <DetailItem>
                    <i className="fas fa-dollar-sign"></i>
                    <div>
                      <Label>Total Price</Label>
                      <Value>${reservation.totalPrice}</Value>
                    </div>
                  </DetailItem>

                  <StatusBadge status={reservation.status}>
                    {reservation.status.toUpperCase()}
                  </StatusBadge>
                </ReservationDetails>

                {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                  <CancelButton onClick={() => handleCancelReservation(reservation.id)}>
                    Cancel Reservation
                  </CancelButton>
                )}
              </ReservationInfo>
            </ReservationCard>
          ))
        )}
      </ReservationsGrid>
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
    margin: 0 0 1rem 0;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
  color: #4B5563;
  min-width: 200px;
`;

const ReservationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
`;

const ReservationCard = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CarImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ReservationInfo = styled.div`
  padding: 1.5rem;
`;

const CarDetails = styled.div`
  margin-bottom: 1rem;
`;

const CarName = styled.h3`
  margin: 0;
  color: #1F2937;
  font-size: 1.25rem;
`;

const PlateNumber = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
`;

const ReservationDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  i {
    color: #1e3c72;
    width: 20px;
    text-align: center;
  }
`;

const Label = styled.div`
  color: #6B7280;
  font-size: 0.75rem;
`;

const Value = styled.div`
  color: #1F2937;
  font-weight: 500;
`;

const StatusBadge = styled.div<{ status: string }>`
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  background: ${({ status }) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'active':
        return '#2196F3';
      case 'completed':
        return '#9C27B0';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'active':
        return '#2196F3';
      case 'completed':
        return '#9C27B0';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }};
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #F44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #D32F2F;
  }
`;

const NoReservations = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6B7280;

  i {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
  }
`;

export default ReservationSystem; 