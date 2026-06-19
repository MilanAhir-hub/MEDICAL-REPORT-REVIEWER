import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Loader from './Loader';

const GuestRoute = ({ children }) => {
    const { user, status, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader />
            </div>
        );
    }

    if (status && user) {
        return <Navigate to="/userDashboard" replace />;
    }

    return children;
};

export default GuestRoute;
