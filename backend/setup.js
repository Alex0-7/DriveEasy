import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Car from './models/Car.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Your existing seeder data and logic here
const cars = [
  // ... your car data
];

const setupDatabase = async () => {
  console.log('Starting database setup...');
  
  await connectDB();
  
  // Clear existing data
  await User.deleteMany();
  await Car.deleteMany();
  
  // Create admin user
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '+1234567890',
    drivingLicense: 'ADMIN123456',
    role: 'admin'
  });
  
  // Create regular user
  const regularUser = await User.create({
    name: 'John Doe',
    email: 'user@example.com',
    password: 'user123',
    phone: '+1987654321',
    drivingLicense: 'USER123456'
  });
  
  // Create cars
  await Car.create(cars);
  
  console.log('Database seeded successfully!');
  console.log('Admin: admin@example.com / admin123');
  console.log('User: user@example.com / user123');
  
  mongoose.connection.close();
};

setupDatabase();