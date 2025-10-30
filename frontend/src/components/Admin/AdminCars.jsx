import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import carService from '../../services/carService';
import LoadingSpinner from '../Common/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminCars = () => {
  return (
    <Routes>
      <Route path="/" element={<CarList />} />
      <Route path="/new" element={<CarForm />} />
      <Route path="/edit/:id" element={<CarForm />} />
    </Routes>
  );
};

// Car List Component
const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carService.getCars({ limit: 100 });
      setCars(response.data);
    } catch (error) {
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    setDeletingId(carId);
    try {
      await carService.deleteCar(carId);
      toast.success('Car deleted successfully');
      fetchCars();
    } catch (error) {
      toast.error('Failed to delete car');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Cars</h1>
        <Link
          to="/admin/cars/new"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Car</span>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={car.image}
                          alt={`${car.make} ${car.model}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {car.make} {car.model}
                        </div>
                        <div className="text-sm text-gray-500">{car.year}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {car.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${car.pricePerDay}/day
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        car.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {car.available ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      to={`/admin/cars/edit/${car._id}`}
                      className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(car._id)}
                      disabled={deletingId === car._id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 inline-flex items-center"
                    >
                      {deletingId === car._id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Car Form Component
const CarForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    pricePerDay: 0,
    available: true,
    image: '',
    features: [],
    description: '',
    mileage: 0,
    registrationNumber: ''
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchCar();
    }
  }, [id, isEditing]);

  const fetchCar = async () => {
    try {
      const response = await carService.getCar(id);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load car data');
      navigate('/admin/cars');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await carService.updateCar(id, formData);
        toast.success('Car updated successfully');
      } else {
        await carService.createCar(formData);
        toast.success('Car created successfully');
      }
      navigate('/admin/cars');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Minivan', 'Pickup'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['Manual', 'Automatic'];

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Link
          to="/admin/cars"
          className="btn btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cars</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Car' : 'Add New Car'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Make *</label>
              <input
                type="text"
                name="make"
                required
                value={formData.make}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Model *</label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Camry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year *</label>
              <input
                type="number"
                name="year"
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type *</label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="input"
              >
                {carTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Specifications</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Type *</label>
              <select
                name="fuelType"
                required
                value={formData.fuelType}
                onChange={handleChange}
                className="input"
              >
                {fuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Transmission *</label>
              <select
                name="transmission"
                required
                value={formData.transmission}
                onChange={handleChange}
                className="input"
              >
                {transmissions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Seating Capacity *</label>
              <input
                type="number"
                name="seatingCapacity"
                required
                min="2"
                max="8"
                value={formData.seatingCapacity}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mileage (MPG) *</label>
              <input
                type="number"
                name="mileage"
                required
                min="0"
                step="0.1"
                value={formData.mileage}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 35"
              />
            </div>
          </div>
        </div>

        {/* Pricing and Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Price Per Day ($) *</label>
              <input
                type="number"
                name="pricePerDay"
                required
                min="0"
                step="0.01"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 45.00"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Registration</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number *</label>
              <input
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleChange}
                className="input"
                placeholder="e.g., ABC123"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Available for booking
              </label>
            </div>
          </div>
        </div>

        {/* Image and Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Image</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL *</label>
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                className="input"
                placeholder="https://example.com/car-image.jpg"
              />
            </div>

            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Car preview"
                  className="h-48 w-full object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Features</h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="input flex-1"
                placeholder="Add a feature (e.g., Bluetooth)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="btn btn-primary whitespace-nowrap"
              >
                Add Feature
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-12">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="ml-1 hover:text-primary-900 text-lg leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.features.length === 0 && (
                <p className="text-gray-500 text-sm">No features added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Description</h3>
          
          <div>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input resize-none"
              placeholder="Enter car description..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/cars')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-50 min-w-32"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : isEditing ? (
              'Update Car'
            ) : (
              'Create Car'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCars;