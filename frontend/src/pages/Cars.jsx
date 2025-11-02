import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Car, Fuel, Users, Settings } from 'lucide-react';
import carService from '../services/carService';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carService.getCars();
      
      // Safe data handling
      if (response && Array.isArray(response.data)) {
        setCars(response.data);
      } else if (response && Array.isArray(response)) {
        setCars(response);
      } else {
        setCars([]);
      }
    } catch (err) {
      setError(err.message);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Car Card Component with image error handling
  const CarCard = ({ car }) => {
    const [imageError, setImageError] = useState(false);
    
    const fallbackImage = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image with error handling */}
        <div className="h-48 overflow-hidden">
          <img
            src={imageError ? fallbackImage : (car.image || fallbackImage)}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {car.make} {car.model}
            </h3>
            <span className="text-gray-500">{car.year}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{car.type}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Fuel className="h-4 w-4" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{car.seatingCapacity} seats</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ${car.pricePerDay}
              </span>
              <span className="text-gray-500 text-sm">/day</span>
            </div>
            <Link
              to={`/cars/${car._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
          </div>
          
          {!car.available && (
            <div className="mt-2">
              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Not Available
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading cars</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchCars}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Our Fleet</h1>
          <p className="text-gray-600 mt-2">
            Choose from our wide selection of premium vehicles
          </p>
        </div>

        {Array.isArray(cars) && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;