import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Reservation } from '../types/types';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  features: string[];
  rating: number;
  reviews: number;
  plate: string;
  status: 'available' | 'reserved';
}

const AvailableCars: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    transmission: 'all',
    fuelType: 'all',
    minPrice: '',
    maxPrice: '',
    minSeats: ''
  });

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reservation, setReservation] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    totalPrice: 0
  });

  // Load cars from localStorage
  const [cars, setCars] = useState<Car[]>(() => {
    const savedCars = localStorage.getItem('cars');
    return savedCars ? JSON.parse(savedCars) : [];
  });

  // Update cars when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCars = localStorage.getItem('cars');
      if (savedCars) {
        setCars(JSON.parse(savedCars));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredCars = cars.filter(car => {
    // Only show available cars to clients
    if (car.status !== 'available') return false;

    const matchesSearch = 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTransmission = filters.transmission === 'all' || car.transmission === filters.transmission;
    const matchesFuelType = filters.fuelType === 'all' || car.fuelType === filters.fuelType;
    const matchesPrice = 
      (!filters.minPrice || car.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || car.price <= Number(filters.maxPrice));
    const matchesSeats = !filters.minSeats || car.seats >= Number(filters.minSeats);

    return matchesSearch && matchesTransmission && matchesFuelType && matchesPrice && matchesSeats;
  });

  const handleReserveClick = (car: Car) => {
    setSelectedCar(car);
    setReservation({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      totalPrice: car.price
    });
    setShowReserveModal(true);
  };

  const calculateTotalPrice = (start: string, end: string, dailyPrice: number) => {
    const days = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * dailyPrice;
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    if (!selectedCar) return;

    const updatedReservation = {
      ...reservation,
      [field]: value
    };

    // Calculate total price based on number of days
    if (updatedReservation.startDate && updatedReservation.endDate) {
      updatedReservation.totalPrice = calculateTotalPrice(
        updatedReservation.startDate,
        updatedReservation.endDate,
        selectedCar.price
      );
    }

    setReservation(updatedReservation);
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    // Create new reservation
    const newReservation: Reservation = {
      id: Date.now().toString(),
      carId: selectedCar.id,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      status: 'pending',
      totalPrice: reservation.totalPrice,
      car: {
        brand: selectedCar.brand,
        model: selectedCar.model,
        image: selectedCar.image,
        plate: selectedCar.plate
      }
    };

    // Get existing reservations from localStorage
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Add new reservation
    localStorage.setItem('reservations', JSON.stringify([...existingReservations, newReservation]));
    
    // Show success message
    alert('Reservation successful!');
    
    // Close modal and reset form
    setShowReserveModal(false);
    setSelectedCar(null);
  };

  return (
    <Container>
      <Header>
        <h2>Available Cars</h2>
        <SearchBar>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
      </Header>

      <FiltersSection>
        <FilterGroup>
          <Label>Transmission</Label>
          <Select
            value={filters.transmission}
            onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
          >
            <option value="all">All</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Fuel Type</Label>
          <Select
            value={filters.fuelType}
            onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          >
            <option value="all">All</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Price Range</Label>
          <PriceInputs>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </PriceInputs>
        </FilterGroup>

        <FilterGroup>
          <Label>Min Seats</Label>
          <Input
            type="number"
            placeholder="Seats"
            value={filters.minSeats}
            onChange={(e) => setFilters({ ...filters, minSeats: e.target.value })}
          />
        </FilterGroup>
      </FiltersSection>

      <CarsGrid>
        {filteredCars.map(car => (
          <CarCard key={car.id}>
            <CarImage src={car.image} alt={`${car.brand} ${car.model}`} />
            <CarInfo>
              <CarHeader>
                <div>
                  <CarName>{car.brand} {car.model}</CarName>
                  <CarYear>{car.year}</CarYear>
                </div>
                <CarPrice>${car.price}<span>/day</span></CarPrice>
              </CarHeader>

              <CarFeatures>
                <Feature>
                  <i className="fas fa-cog"></i>
                  {car.transmission}
                </Feature>
                <Feature>
                  <i className="fas fa-gas-pump"></i>
                  {car.fuelType}
                </Feature>
                <Feature>
                  <i className="fas fa-chair"></i>
                  {car.seats} seats
                </Feature>
              </CarFeatures>

              <CarRating>
                <Stars>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <i
                      key={index}
                      className={`fas fa-star ${index < Math.floor(car.rating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                </Stars>
                <Reviews>{car.reviews} reviews</Reviews>
              </CarRating>

              <ReserveButton onClick={() => handleReserveClick(car)}>
                Reserve Now
              </ReserveButton>
            </CarInfo>
          </CarCard>
        ))}
      </CarsGrid>

      {/* Add Reservation Modal */}
      {showReserveModal && selectedCar && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Reserve Car</h3>
              <CloseButton onClick={() => setShowReserveModal(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <Form onSubmit={handleReserveSubmit}>
              <CarSummary>
                <CarImage src={selectedCar.image} alt={selectedCar.model} />
                <CarDetails>
                  <h4>{selectedCar.brand} {selectedCar.model}</h4>
                  <p>${selectedCar.price}/day</p>
                </CarDetails>
              </CarSummary>

              <FormGroup>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={reservation.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={reservation.endDate}
                  min={reservation.startDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  required
                />
              </FormGroup>

              <PriceSummary>
                <PriceDetail>
                  <span>Daily Rate:</span>
                  <span>${selectedCar.price}</span>
                </PriceDetail>
                <PriceDetail>
                  <span>Number of Days:</span>
                  <span>
                    {Math.ceil(
                      (new Date(reservation.endDate).getTime() - 
                       new Date(reservation.startDate).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </PriceDetail>
                <PriceTotal>
                  <span>Total Price:</span>
                  <span>${reservation.totalPrice}</span>
                </PriceTotal>
              </PriceSummary>

              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowReserveModal(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Confirm Reservation
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

// Styled components...
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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #F3F4F6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  width: 300px;

  i {
    color: #6B7280;
    margin-right: 0.5rem;
  }

  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    font-size: 0.875rem;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #4B5563;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
  min-width: 150px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  width: 100px;
`;

const PriceInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const CarCard = styled.div`
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

const CarInfo = styled.div`
  padding: 1.5rem;
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CarName = styled.h3`
  margin: 0;
  color: #1F2937;
  font-size: 1.25rem;
`;

const CarYear = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
`;

const CarPrice = styled.div`
  color: #1e3c72;
  font-weight: 600;
  font-size: 1.25rem;

  span {
    font-size: 0.875rem;
    color: #6B7280;
    font-weight: normal;
  }
`;

const CarFeatures = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4B5563;
  font-size: 0.875rem;
  text-transform: capitalize;

  i {
    color: #1e3c72;
  }
`;

const CarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  color: #FCD34D;
  
  i {
    margin-right: 0.25rem;
    
    &:not(.filled) {
      color: #E5E7EB;
    }
  }
`;

const Reviews = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #1e3c72;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2a5298;
  }
`;

const Modal = styled.div`
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

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.25rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CarSummary = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #F9FAFB;
  border-radius: 0.5rem;
`;

const CarDetails = styled.div`
  h4 {
    margin: 0 0 0.5rem 0;
    color: #1F2937;
  }

  p {
    margin: 0;
    color: #4B5563;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PriceSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #F9FAFB;
  border-radius: 0.5rem;
`;

const PriceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  color: #4B5563;
  font-size: 0.875rem;
`;

const PriceTotal = styled.div`
  display: flex;
  justify-content: space-between;
  color: #1F2937;
  font-weight: 600;
  border-top: 1px solid #E5E7EB;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: white;
  color: #4B5563;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #F3F4F6;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  padding: 0.75rem;
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

export default AvailableCars; 