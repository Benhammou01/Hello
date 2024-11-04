export interface Reservation {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  car: {
    brand: string;
    model: string;
    image: string;
    plate: string;
  };
} 