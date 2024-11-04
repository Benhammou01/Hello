import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  plate: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'rented', 'maintenance'],
    default: 'available'
  },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  color: { type: String },
  transmission: {
    type: String,
    enum: ['automatic', 'manual'],
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
  },
  seats: { type: Number },
  mileage: { type: Number, default: 0 },
  features: [String],
  insurance: {
    provider: String,
    expiryDate: Date,
    policyNumber: String
  },
  lastMaintenance: Date,
  nextMaintenance: Date,
  gpsDevice: {
    deviceId: String,
    imei: String,
    isConnected: Boolean,
    lastPing: Date,
    location: {
      lat: Number,
      lng: Number
    },
    speed: Number,
    heading: Number
  }
}, {
  timestamps: true
});

export default mongoose.model('Car', carSchema); 