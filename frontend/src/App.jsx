import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import DetailedReport from './pages/DetailedReport';
import AuthProvider from './context/authContext';
import { ThemeProvider } from './context/themeContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

const App = () => {
    return (
        <ThemeProvider>
            <ErrorBoundary>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
                            <Route path="/userDashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                            <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                            <Route path="/editProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                            <Route path="/report/:reportId" element={<ProtectedRoute><DetailedReport /></ProtectedRoute>} />
                        </Routes>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: 'var(--color-surface-2)',
                                    color: 'var(--color-ink)',
                                    border: '1px solid var(--color-hairline)',
                                },
                                success: {
                                    duration: 3000,
                                    iconTheme: {
                                        primary: 'var(--color-success)',
                                        secondary: 'var(--color-ink)',
                                    },
                                },
                                error: {
                                    duration: 4000,
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: 'var(--color-ink)',
                                    },
                                },
                            }}
                        />
                    </BrowserRouter>
                </AuthProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default App;
