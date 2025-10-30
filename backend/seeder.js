import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Car from './models/Car.js';
import connectDB from './config/database.js';

dotenv.config();

const cars = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    type: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    pricePerDay: 45,
    available: true,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    features: ['Bluetooth', 'Air Conditioning', 'Backup Camera', 'Cruise Control'],
    description: 'Reliable and fuel-efficient sedan perfect for city driving and long trips.',
    mileage: 35,
    registrationNumber: 'TOY123'
  },
  {
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    type: 'SUV',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seatingCapacity: 5,
    pricePerDay: 65,
    available: true,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    features: ['All-Wheel Drive', 'Sunroof', 'Leather Seats', 'Navigation System'],
    description: 'Spacious SUV with hybrid efficiency and advanced safety features.',
    mileage: 32,
    registrationNumber: 'HON456'
  },
  {
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    type: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    pricePerDay: 85,
    available: true,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    features: ['Premium Sound System', 'Heated Seats', 'Parking Assist', 'Sport Package'],
    description: 'Luxury sports sedan with premium features and exceptional performance.',
    mileage: 28,
    registrationNumber: 'BMW789'
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'Sedan',
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    pricePerDay: 95,
    available: true,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    features: ['Autopilot', 'Supercharging', 'Glass Roof', 'Premium Interior'],
    description: 'Fully electric vehicle with autopilot and instant acceleration.',
    mileage: 134, // MPGe
    registrationNumber: 'TES012'
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2023,
    type: 'Coupe',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 4,
    pricePerDay: 120,
    available: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    features: ['V8 Engine', 'Sport Exhaust', 'Performance Brakes', 'Recaro Seats'],
    description: 'American muscle car with powerful V8 engine and classic styling.',
    mileage: 22,
    registrationNumber: 'FOR345'
  },
  {
    make: 'Jeep',
    model: 'Wrangler',
    year: 2023,
    type: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    pricePerDay: 75,
    available: true,
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    features: ['4x4', 'Removable Doors', 'Off-road Package', 'Tow Package'],
    description: 'Iconic off-road vehicle perfect for adventure and outdoor activities.',
    mileage: 25,
    registrationNumber: 'JEE678'
  }
];

const importData = async () => {
  try {
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
      role: 'admin',
      address: {
        street: '123 Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345'
      }
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      phone: '+1987654321',
      drivingLicense: 'USER123456',
      address: {
        street: '456 User Avenue',
        city: 'User City',
        state: 'User State',
        zipCode: '67890'
      }
    });

    // Create cars
    await Car.create(cars);

    console.log('Data imported successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nUser credentials:');
    console.log('Email: user@example.com');
    console.log('Password: user123');
    
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Car.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}