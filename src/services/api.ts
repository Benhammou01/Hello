import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const carAPI = {
  getAllCars: () => api.get('/cars'),
  getCarById: (id: string) => api.get(`/cars/${id}`),
  updateCarLocation: (id: string, location: { lat: number; lng: number }) => 
    api.patch(`/cars/${id}/location`, { location })
};

export const reservationAPI = {
  createReservation: (data: any) => api.post('/reservations', data),
  getUserReservations: () => api.get('/reservations/user'),
  cancelReservation: (id: string) => api.patch(`/reservations/${id}/cancel`)
};

export const userAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/users/login', credentials),
  register: (userData: any) => api.post('/users/register', userData),
  updateProfile: (data: any) => api.patch('/users/profile', data)
}; 