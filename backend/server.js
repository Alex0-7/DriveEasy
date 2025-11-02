import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Route files
import auth from './routes/auth.js';
import cars from './routes/cars.js';
import bookings from './routes/bookings.js';
import users from './routes/users.js';

// Models for auto-seeding
import User from './models/User.js';
import Car from './models/Car.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Auto-seed database if no users exist
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🔄 Seeding database...');
      
      // Create admin user
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phone: '+1234567890',
        drivingLicense: 'ADMIN123456',
        role: 'admin',
        address: {
          street: '123 Admin St',
          city: 'Admin City',
          state: 'Admin State',
          zipCode: '12345'
        }
      });
      
      // Create regular user
      await User.create({
        name: 'John Doe',
        email: 'user@example.com',
        password: 'user123',
        phone: '+1987654321',
        drivingLicense: 'USER123456',
        address: {
          street: '456 User Ave',
          city: 'User City',
          state: 'User State', 
          zipCode: '67890'
        }
      });

      // Create sample cars
      await Car.create([
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
          image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
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
          image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
          features: ['All-Wheel Drive', 'Sunroof', 'Leather Seats', 'Navigation System'],
          description: 'Spacious SUV with hybrid efficiency and advanced safety features.',
          mileage: 32,
          registrationNumber: 'HON456'
        }
      ]);
      
      console.log('✅ Database seeded successfully!');
      console.log('👑 Admin: admin@example.com / admin123');
      console.log('👤 User: user@example.com / user123');
    } else {
      console.log('✅ Database already has data, skipping seeding.');
    }
  } catch (error) {
    console.log('❌ Seeding error:', error.message);
  }
};

// Initialize seeding
seedDatabase();

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// CORS configuration
// CORS - Update with all possible frontend URLs
// CORS - TEMPORARY FIX (allow all origins)
app.use(cors({
  origin: "*", // Allow ALL domains
  credentials: false, // Must be false when using "*"
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for testing
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/cars', cars);
app.use('/api/bookings', bookings);
app.use('/api/users', users);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Connected'
  });
});

// Test all routes
app.get('/api/test', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const carCount = await Car.countDocuments();
    
    res.json({
      success: true,
      message: 'All systems operational',
      users: userCount,
      cars: carCount,
      routes: ['auth', 'cars', 'bookings', 'users']
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Car Rental API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      cars: '/api/cars', 
      bookings: '/api/bookings',
      users: '/api/users',
      health: '/api/health',
      test: '/api/test'
    }
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET  /',
      'GET  /api/health',
      'GET  /api/test',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET  /api/auth/me',
      'GET  /api/cars',
      'GET  /api/cars/:id',
      'POST /api/bookings',
      'GET  /api/bookings/mybookings'
    ]
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Root: http://localhost:${PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('❌ Unhandled Rejection at:', promise, 'reason:', err);
  server.close(() => {
    process.exit(1);
  });
});

export default app;