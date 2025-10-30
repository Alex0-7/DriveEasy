import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Please add car make'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add car model'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please add manufacturing year'],
    min: [2000, 'Year must be after 2000'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  type: {
    type: String,
    required: [true, 'Please add car type'],
    enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Minivan', 'Pickup']
  },
  fuelType: {
    type: String,
    required: [true, 'Please add fuel type'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid']
  },
  transmission: {
    type: String,
    required: [true, 'Please add transmission type'],
    enum: ['Manual', 'Automatic']
  },
  seatingCapacity: {
    type: Number,
    required: [true, 'Please add seating capacity'],
    min: [2, 'Seating capacity must be at least 2'],
    max: [8, 'Seating capacity cannot exceed 8']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please add price per day'],
    min: [0, 'Price cannot be negative']
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    required: [true, 'Please add car image URL'],
    default: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  features: [{
    type: String
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  mileage: {
    type: Number,
    required: [true, 'Please add mileage']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Please add registration number'],
    unique: true
  }
}, {
  timestamps: true
});

// Compound index for better query performance
carSchema.index({ available: 1, type: 1 });

export default mongoose.model('Car', carSchema);