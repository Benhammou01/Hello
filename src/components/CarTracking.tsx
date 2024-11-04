import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import styled from 'styled-components';

const CarTracking: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = {
    lat: 40.7128,
    lng: -74.0060
  };

  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setIsLoading(false);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <Container>
      <Header>Car GPS Tracking</Header>
      {isLoading && <LoadingSpinner>Loading map...</LoadingSpinner>}
      <MapContainer>
        <LoadScript 
          googleMapsApiKey="AIzaSyC14mQRfj599w_M_kP4Z53ywaiMBFM382E"
          loadingElement={<LoadingSpinner>Loading map...</LoadingSpinner>}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Map content will go here */}
          </GoogleMap>
        </LoadScript>
      </MapContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.h2`
  margin-bottom: 20px;
  color: #1e3c72;
`;

const MapContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  background: #f5f5f5;
  color: #1e3c72;
  font-size: 1.2rem;
  border-radius: 8px;
`;

export default CarTracking;