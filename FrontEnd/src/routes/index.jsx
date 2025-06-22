import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Components
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

import PaymentForm from '../components/Payment/PaymentForm';
import Home from '../components/Home';
import Profile from '../components/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
                path="/bookings"
                element={
                    <ProtectedRoute>
                        <BookingList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/booking/new"
                element={
                    <ProtectedRoute>
                        <BookingForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payment/:bookingId"
                element={
                    <ProtectedRoute>
                        <PaymentForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes; 