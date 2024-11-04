import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'pending' },
  role: { type: String, enum: ['client', 'vip', 'blacklisted', 'admin'], default: 'client' },
  licenseNumber: { type: String },
  licenseExpiry: Date,
  verificationStatus: { type: String, enum: ['verified', 'unverified', 'pending'], default: 'pending' },
  rentalHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('User', userSchema); 