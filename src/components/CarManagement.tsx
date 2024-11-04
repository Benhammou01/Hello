import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Header,
  AddButton,
  Modal,
  ModalContent,
  ModalHeader,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  CarGrid,
  CarCard,
  CarImage,
  CarInfo,
  CarModel,
  CarDetails,
  Detail,
  StatusBadge,
  ActionButtons,
  ActionButton
} from '../styles/CarManagementStyles';

interface Car {
  id: string;
  brand: string;
  model: string;
  plate: string;
  year: number;
  status: 'available' | 'rented' | 'maintenance';
  price: number;
  image: string;
  color: string;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  mileage: number;
  features: string[];
  insurance: {
    provider: string;
    expiryDate: string;
    policyNumber: string;
  };
  lastMaintenance: string;
  nextMaintenance: string;
  gpsDevice?: {
    deviceId: string;
    imei: string;
    isConnected: boolean;
    lastPing?: Date;
    location?: { lat: number; lng: number };
    speed?: number;
    heading?: number;
  };
}

const CarManagement: React.FC = () => {
  const [cars, setCars] = useState<Car[]>(() => {
    const savedCars = localStorage.getItem('cars');
    return savedCars ? JSON.parse(savedCars) : [
      {
        id: '1',
        brand: 'Toyota',
        model: 'Camry',
        plate: 'ABC-123',
        year: 2023,
        status: 'available',
        price: 50,
        image: 'https://example.com/camry.jpg',
        color: 'Silver',
        transmission: 'automatic',
        fuelType: 'hybrid',
        seats: 5,
        mileage: 15000,
        features: ['GPS', 'Bluetooth', 'Backup Camera', 'Leather Seats', 'Sunroof'],
        insurance: {
          provider: 'SafeDrive Insurance',
          expiryDate: '2024-12-31',
          policyNumber: 'INS-789456'
        },
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-07-15'
      },
      {
        id: '2',
        brand: 'Honda',
        model: 'CR-V',
        plate: 'XYZ-789',
        year: 2022,
        status: 'rented',
        price: 65,
        image: 'https://example.com/crv.jpg',
        color: 'Pearl White',
        transmission: 'automatic',
        fuelType: 'petrol',
        seats: 5,
        mileage: 25000,
        features: ['Apple CarPlay', 'Android Auto', 'Panoramic Roof', 'Lane Assist'],
        insurance: {
          provider: 'SecureAuto Insurance',
          expiryDate: '2024-11-30',
          policyNumber: 'INS-456123'
        },
        lastMaintenance: '2024-02-01',
        nextMaintenance: '2024-08-01'
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCar, setNewCar] = useState<Omit<Car, 'id'>>({
    brand: '',
    model: '',
    plate: '',
    year: new Date().getFullYear(),
    status: 'available',
    price: 0,
    image: '',
    color: '',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 5,
    mileage: 0,
    features: [],
    insurance: {
      provider: '',
      expiryDate: '',
      policyNumber: ''
    },
    lastMaintenance: '',
    nextMaintenance: ''
  });

  const [showGPSModal, setShowGPSModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [gpsInfo, setGpsInfo] = useState({
    deviceId: '',
    imei: ''
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const car: Car = {
      id: Date.now().toString(),
      ...newCar
    };
    
    const updatedCars = [...cars, car];
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
    
    setShowAddForm(false);
    setNewCar({
      brand: '',
      model: '',
      plate: '',
      year: new Date().getFullYear(),
      status: 'available',
      price: 0,
      image: '',
      color: '',
      transmission: 'automatic',
      fuelType: 'petrol',
      seats: 5,
      mileage: 0,
      features: [],
      insurance: {
        provider: '',
        expiryDate: '',
        policyNumber: ''
      },
      lastMaintenance: '',
      nextMaintenance: ''
    });
  };

  const handleGPSLink = (car: Car) => {
    setSelectedCar(car);
    if (car.gpsDevice) {
      setGpsInfo({
        deviceId: car.gpsDevice.deviceId,
        imei: car.gpsDevice.imei
      });
    } else {
      setGpsInfo({ deviceId: '', imei: '' });
    }
    setShowGPSModal(true);
  };

  const handleGPSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    const updatedCars = cars.map(car => 
      car.id === selectedCar.id ? {
        ...car,
        gpsDevice: {
          deviceId: gpsInfo.deviceId,
          imei: gpsInfo.imei,
          isConnected: true,
          lastPing: new Date(),
          location: { lat: 40.7128, lng: -74.0060 }, // Initial location
          speed: 0,
          heading: 0
        }
      } : car
    );

    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));

    setShowGPSModal(false);
    setSelectedCar(null);
  };

  const handleEditClick = (car: Car) => {
    setSelectedCar(car);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    setCars(cars.map(car => 
      car.id === selectedCar.id ? selectedCar : car
    ));
    localStorage.setItem('cars', JSON.stringify(
      cars.map(car => car.id === selectedCar.id ? selectedCar : car)
    ));
    
    setShowEditModal(false);
    setSelectedCar(null);
  };

  const handleDeleteClick = (car: Car) => {
    setSelectedCar(car);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCar) return;
    
    const updatedCars = cars.filter(car => car.id !== selectedCar.id);
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
    
    setShowDeleteModal(false);
    setSelectedCar(null);
  };

  const FormSection = styled.div`
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #E5E7EB;

    &:last-child {
      border-bottom: none;
    }
  `;

  const SectionTitle = styled.h4`
    color: #1e3c72;
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
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
    min-height: 100px;

    &:focus {
      outline: none;
      border-color: #1e3c72;
    }
  `;

  const handleTransmissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCar({ ...newCar, transmission: e.target.value as 'automatic' | 'manual' });
  };

  const handleFuelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCar({ ...newCar, fuelType: e.target.value as 'petrol' | 'diesel' | 'electric' | 'hybrid' });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCar({ ...newCar, status: e.target.value as 'available' | 'rented' | 'maintenance' });
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewCar({
      ...newCar,
      features: e.target.value.split(',').map((f: string) => f.trim()).filter((f: string) => f)
    });
  };

  return (
    <Container>
      <Header>
        <h2>Car Management</h2>
        <AddButton onClick={() => setShowAddForm(true)}>
          <i className="fas fa-plus"></i> Add New Car
        </AddButton>
      </Header>

      {showAddForm && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Add New Car</h3>
              <CloseButton onClick={() => setShowAddForm(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <Form onSubmit={handleAddCar}>
              <FormSection>
                <SectionTitle>Basic Information</SectionTitle>
                <FormGroup>
                  <Label>Brand *</Label>
                  <Input
                    type="text"
                    value={newCar.brand}
                    onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Model *</Label>
                  <Input
                    type="text"
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>License Plate *</Label>
                  <Input
                    type="text"
                    value={newCar.plate}
                    onChange={(e) => setNewCar({ ...newCar, plate: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: parseInt(e.target.value) })}
                    min={2000}
                    max={new Date().getFullYear() + 1}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Color</Label>
                  <Input
                    type="text"
                    value={newCar.color}
                    onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Technical Specifications</SectionTitle>
                <FormGroup>
                  <Label>Transmission</Label>
                  <Select
                    value={newCar.transmission}
                    onChange={handleTransmissionChange}
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Fuel Type</Label>
                  <Select
                    value={newCar.fuelType}
                    onChange={handleFuelTypeChange}
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Number of Seats</Label>
                  <Input
                    type="number"
                    value={newCar.seats}
                    onChange={(e) => setNewCar({ ...newCar, seats: parseInt(e.target.value) })}
                    min={2}
                    max={12}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Current Mileage (km)</Label>
                  <Input
                    type="number"
                    value={newCar.mileage}
                    onChange={(e) => setNewCar({ ...newCar, mileage: parseInt(e.target.value) })}
                    min={0}
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Rental Information</SectionTitle>
                <FormGroup>
                  <Label>Daily Rate ($) *</Label>
                  <Input
                    type="number"
                    value={newCar.price}
                    onChange={(e) => setNewCar({ ...newCar, price: parseFloat(e.target.value) })}
                    min={0}
                    step="0.01"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={newCar.status}
                    onChange={handleStatusChange}
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </Select>
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Features</SectionTitle>
                <FormGroup>
                  <Label>Car Features (comma-separated)</Label>
                  <Textarea
                    value={newCar.features.join(', ')}
                    onChange={handleFeaturesChange}
                    placeholder="GPS, Bluetooth, Backup Camera, etc."
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Insurance Information</SectionTitle>
                <FormGroup>
                  <Label>Insurance Provider</Label>
                  <Input
                    type="text"
                    value={newCar.insurance.provider}
                    onChange={(e) => setNewCar({
                      ...newCar,
                      insurance: { ...newCar.insurance, provider: e.target.value }
                    })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Policy Number</Label>
                  <Input
                    type="text"
                    value={newCar.insurance.policyNumber}
                    onChange={(e) => setNewCar({
                      ...newCar,
                      insurance: { ...newCar.insurance, policyNumber: e.target.value }
                    })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Insurance Expiry Date</Label>
                  <Input
                    type="date"
                    value={newCar.insurance.expiryDate}
                    onChange={(e) => setNewCar({
                      ...newCar,
                      insurance: { ...newCar.insurance, expiryDate: e.target.value }
                    })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Maintenance Schedule</SectionTitle>
                <FormGroup>
                  <Label>Last Maintenance Date</Label>
                  <Input
                    type="date"
                    value={newCar.lastMaintenance}
                    onChange={(e) => setNewCar({ ...newCar, lastMaintenance: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Next Maintenance Date</Label>
                  <Input
                    type="date"
                    value={newCar.nextMaintenance}
                    onChange={(e) => setNewCar({ ...newCar, nextMaintenance: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormGroup>
              </FormSection>

              <FormSection>
                <SectionTitle>Images</SectionTitle>
                <FormGroup>
                  <Label>Car Image URL *</Label>
                  <Input
                    type="url"
                    value={newCar.image}
                    onChange={(e) => setNewCar({ ...newCar, image: e.target.value })}
                    placeholder="https://example.com/car-image.jpg"
                    required
                  />
                </FormGroup>
              </FormSection>

              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Add Car
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      <CarGrid>
        {cars.map(car => (
          <CarCard key={car.id}>
            <CarImage src={car.image} alt={`${car.brand} ${car.model}`} />
            <CarInfo>
              <CarModel>{car.brand} {car.model}</CarModel>
              <CarDetails>
                <Detail><i className="fas fa-license-plate"></i> {car.plate}</Detail>
                <Detail><i className="fas fa-calendar"></i> {car.year}</Detail>
                <Detail><i className="fas fa-dollar-sign"></i> {car.price}/day</Detail>
                <Detail><i className="fas fa-palette"></i> {car.color}</Detail>
                <Detail><i className="fas fa-cog"></i> {car.transmission}</Detail>
                <Detail><i className="fas fa-gas-pump"></i> {car.fuelType}</Detail>
                <Detail><i className="fas fa-chair"></i> {car.seats} seats</Detail>
                <Detail><i className="fas fa-road"></i> {car.mileage.toLocaleString()} km</Detail>
                <Detail><i className="fas fa-tools"></i> Next maintenance: {new Date(car.nextMaintenance).toLocaleDateString()}</Detail>
                <Detail><i className="fas fa-shield-alt"></i> Insurance expires: {new Date(car.insurance.expiryDate).toLocaleDateString()}</Detail>
              </CarDetails>
              <StatusBadge status={car.status}>
                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
              </StatusBadge>
              <Detail>
                <i className="fas fa-list"></i> Features:
                <div style={{ marginLeft: '1rem' }}>
                  {car.features.map((feature, index) => (
                    <span key={index} style={{ 
                      display: 'inline-block',
                      background: '#e5e7eb',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      margin: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </Detail>
            </CarInfo>
            <ActionButtons>
              <ActionButton color="#4CAF50" onClick={() => handleEditClick(car)}>
                <i className="fas fa-edit"></i>
              </ActionButton>
              <ActionButton 
                color="#1e88e5" 
                onClick={() => handleGPSLink(car)}
                title={car.gpsDevice ? "Update GPS Device" : "Link GPS Device"}
              >
                <i className={`fas fa-${car.gpsDevice ? 'satellite' : 'link'}`}></i>
              </ActionButton>
              <ActionButton color="#F44336" onClick={() => handleDeleteClick(car)}>
                <i className="fas fa-trash"></i>
              </ActionButton>
            </ActionButtons>
          </CarCard>
        ))}
      </CarGrid>

      {showGPSModal && selectedCar && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>{selectedCar.gpsDevice ? 'Update GPS Device' : 'Link GPS Device'}</h3>
              <CloseButton onClick={() => setShowGPSModal(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <Form onSubmit={handleGPSSubmit}>
              <FormGroup>
                <Label>Car</Label>
                <CarInfo>
                  {selectedCar.brand} {selectedCar.model} ({selectedCar.plate})
                </CarInfo>
              </FormGroup>
              <FormGroup>
                <Label>GPS Device ID</Label>
                <Input
                  type="text"
                  value={gpsInfo.deviceId}
                  onChange={(e) => setGpsInfo({ ...gpsInfo, deviceId: e.target.value })}
                  placeholder="Enter GPS device ID"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>IMEI Number</Label>
                <Input
                  type="text"
                  value={gpsInfo.imei}
                  onChange={(e) => setGpsInfo({ ...gpsInfo, imei: e.target.value })}
                  placeholder="Enter device IMEI number"
                  required
                />
              </FormGroup>
              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowGPSModal(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {selectedCar.gpsDevice ? 'Update Device' : 'Link Device'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showEditModal && selectedCar && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Edit Car</h3>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <Form onSubmit={handleEditSubmit}>
              <FormSection>
                <SectionTitle>Basic Information</SectionTitle>
                <FormGroup>
                  <Label>Brand</Label>
                  <Input
                    type="text"
                    value={selectedCar.brand}
                    onChange={(e) => setSelectedCar({
                      ...selectedCar,
                      brand: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Model</Label>
                  <Input
                    type="text"
                    value={selectedCar.model}
                    onChange={(e) => setSelectedCar({
                      ...selectedCar,
                      model: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>License Plate</Label>
                  <Input
                    type="text"
                    value={selectedCar.plate}
                    onChange={(e) => setSelectedCar({
                      ...selectedCar,
                      plate: e.target.value
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Price ($/day)</Label>
                  <Input
                    type="number"
                    value={selectedCar.price}
                    onChange={(e) => setSelectedCar({
                      ...selectedCar,
                      price: parseFloat(e.target.value)
                    })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={selectedCar.status}
                    onChange={(e) => setSelectedCar({
                      ...selectedCar,
                      status: e.target.value as 'available' | 'rented' | 'maintenance'
                    })}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </Select>
                </FormGroup>
              </FormSection>

              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Save Changes
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showDeleteModal && selectedCar && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Confirm Delete</h3>
              <CloseButton onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            <DeleteConfirmContent>
              <WarningIcon>
                <i className="fas fa-exclamation-triangle"></i>
              </WarningIcon>
              <DeleteMessage>
                Are you sure you want to delete {selectedCar.brand} {selectedCar.model} ({selectedCar.plate})?
                This action cannot be undone.
              </DeleteMessage>
              <ButtonGroup>
                <CancelButton onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </CancelButton>
                <DeleteButton onClick={handleDeleteConfirm}>
                  Delete Car
                </DeleteButton>
              </ButtonGroup>
            </DeleteConfirmContent>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background-color: #F3F4F6;
  color: #4B5563;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const RequiredLabel = styled.span`
  color: #F44336;
  margin-left: 4px;
`;

const DeleteConfirmContent = styled.div`
  text-align: center;
  padding: 1rem;
`;

const WarningIcon = styled.div`
  font-size: 3rem;
  color: #F44336;
  margin-bottom: 1rem;
`;

const DeleteMessage = styled.p`
  color: #4B5563;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const DeleteButton = styled.button`
  background: #F44336;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #D32F2F;
  }
`;

export default CarManagement; 