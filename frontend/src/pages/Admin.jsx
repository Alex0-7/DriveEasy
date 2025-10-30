import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Car, 
  Users, 
  Calendar, 
  BarChart3,
  Plus,
  Menu,
  X
} from 'lucide-react';
import AdminCars from '../components/Admin/AdminCars';
import AdminUsers from '../components/Admin/AdminUsers';
import AdminBookings from '../components/Admin/AdminBookings';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Cars', href: '/admin/cars', icon: Car },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex-1 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Admin'}
              </h2>
              
              {location.pathname === '/admin/cars' && (
                <Link
                  to="/admin/cars/new"
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Car</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/cars/*" element={<AdminCars />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/bookings" element={<AdminBookings />} />
          </Routes>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Dashboard Component
const AdminDashboard = () => {
  const stats = [
    { name: 'Total Cars', value: '24', change: '+4', changeType: 'positive' },
    { name: 'Active Bookings', value: '12', change: '+2', changeType: 'positive' },
    { name: 'Total Users', value: '156', change: '+12', changeType: 'positive' },
    { name: 'Revenue', value: '$8,240', change: '+12%', changeType: 'positive' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`flex-shrink-0 ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/cars"
          className="card p-6 hover:shadow-lg transition-shadow"
        >
          <Car className="h-8 w-8 text-primary-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Cars</h3>
          <p className="text-gray-600">Add, edit, or remove cars from your fleet</p>
        </Link>

        <Link
          to="/admin/users"
          className="card p-6 hover:shadow-lg transition-shadow"
        >
          <Users className="h-8 w-8 text-primary-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-gray-600">View and manage user accounts</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="card p-6 hover:shadow-lg transition-shadow"
        >
          <Calendar className="h-8 w-8 text-primary-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Bookings</h3>
          <p className="text-gray-600">View and manage all bookings</p>
        </Link>
      </div>
    </div>
  );
};

export default Admin;