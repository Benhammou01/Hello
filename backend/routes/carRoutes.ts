import express from 'express';
import Car from '../models/Car';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new car (admin only)
router.post('/', adminAuth, async (req, res) => {
  const car = new Car(req.body);
  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update car location
router.patch('/:id/location', adminAuth, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { location: req.body.location },
      { new: true }
    );
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 