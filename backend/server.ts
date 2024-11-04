import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import carRoutes from './routes/carRoutes';
import userRoutes from './routes/userRoutes';
import reservationRoutes from './routes/reservationRoutes';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);

// GPS Server setup
const gpsServer = require('./gpsServer');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 