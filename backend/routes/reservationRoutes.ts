import express from 'express';
import Reservation from '../models/Reservation';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get user's reservations
router.get('/user', auth, async (req: any, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('car')
      .sort({ startDate: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new reservation
router.post('/', auth, async (req: any, res) => {
  try {
    const reservation = new Reservation({
      ...req.body,
      user: req.user.id
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel reservation
router.patch('/:id/cancel', auth, async (req: any, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 