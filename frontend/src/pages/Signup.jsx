import { Eye, EyeOff, LockIcon, MailIcon, UserIcon, Home } from "lucide-react";
import { Link } from "react-router-dom";
import google from '../assets/google.svg';
import Cookies from 'js-cookie';
import api, { API_URL } from '../utils/axios';
import { useState } from 'react';
import Loader from "../components/Loader";
import { useNavigate } from 'react-router-dom';
import Alert from "../components/Alert";
import { useAuth } from "../context/authContext";

export default function Signup() {
    const navigate = useNavigate();
    const { refetchUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        onClose: () => { }
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    });

    const validateForm = () => {
        const newErrors = { name: '', email: '', password: '' };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return !newErrors.name && !newErrors.email && !newErrors.password;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            const res = await api.post('/auth/signup', formData);
            if (res.data.token) {
                Cookies.set("token", res.data.token, { expires: 7 });
            }
            refetchUser();
            setAlert({
                type: "success",
                message: "Successfully signed up!",
                onClose: () => navigate('/', { replace: true })
            });
        } catch (error) {
            const serverMsg = error?.response?.data?.message;
            setAlert({
                type: "error",
                message: serverMsg || "Something went wrong during signup!",
                onClose: () => setAlert({ type: "", message: "", onClose: () => { } })
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        window.location.href = `${API_URL.replace('/api', '')}/api/auth/google`;
    };

    return (
        <>
            {alert?.type && (
                <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5">
                    <Alert type={alert.type} message={alert.message} onClose={alert.onClose} />
                </div>
            )}

            <div className="flex items-center min-h-screen justify-center max-w-6xl px-6 mx-auto">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Link
                        to="/"
                        className="lg:hidden self-start mb-6 p-2 rounded-lg hover:bg-surface-1 transition-colors"
                        title="Go back to home"
                    >
                        <Home className="size-4 text-ink-subtle" />
                    </Link>

                    <form onSubmit={handleSignup} className="md:w-96 w-full flex flex-col items-center justify-center">
                        <h2 className="text-3xl text-ink font-semibold tracking-tight">Create account</h2>
                        <p className="text-sm text-ink-subtle mt-3 text-center">
                            Start analyzing medical reports with AI
                        </p>

                        <div className="grid w-full mt-10 mb-2">
                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="flex items-center justify-center rounded-lg py-2.5 hover:bg-surface-1 border border-hairline bg-surface-1/50 transition-all"
                            >
                                <img src={google} alt="google" className="size-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 w-full my-5">
                            <div className="w-full h-px bg-hairline"></div>
                            <p className="w-full text-nowrap text-sm text-ink-tertiary">
                                or sign up with email
                            </p>
                            <div className="w-full h-px bg-hairline"></div>
                        </div>

                        <div className="w-full">
                            <div className={`flex items-center w-full bg-surface-1 border ${errors.name ? 'border-red-500/50' : 'border-hairline'} focus-within:ring-2 focus-within:ring-primary/30 h-11 rounded-lg overflow-hidden pl-4 gap-2 transition-all`}>
                                <UserIcon size={16} className="text-ink-tertiary" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    className="bg-transparent placeholder-ink-tertiary outline-none text-sm w-full h-full text-ink"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="w-full mt-5">
                            <div className={`flex items-center w-full bg-surface-1 border ${errors.email ? 'border-red-500/50' : 'border-hairline'} focus-within:ring-2 focus-within:ring-primary/30 h-11 rounded-lg overflow-hidden pl-4 gap-2 transition-all`}>
                                <MailIcon size={16} className="text-ink-tertiary" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    className="bg-transparent placeholder-ink-tertiary outline-none text-sm w-full h-full text-ink"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="w-full mt-5">
                            <div className={`flex items-center w-full bg-surface-1 border ${errors.password ? 'border-red-500/50' : 'border-hairline'} focus-within:ring-2 focus-within:ring-primary/30 h-11 rounded-lg overflow-hidden pl-4 pr-3 gap-2 transition-all`}>
                                <LockIcon size={16} className="text-ink-tertiary" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create password"
                                    className="bg-transparent placeholder-ink-tertiary outline-none text-sm w-full h-full text-ink"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 hover:bg-surface-2 rounded-lg transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} className="text-ink-tertiary" />
                                    ) : (
                                        <Eye size={16} className="text-ink-tertiary" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-7 w-full h-11 rounded-lg text-white bg-primary hover:bg-primary-hover font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                        >
                            {loading ? <Loader /> : 'Create account'}
                        </button>

                        <p className="text-ink-subtle mt-4 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:text-primary-hover underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Right illustration */}
                <div className="hidden lg:block relative rounded-xl overflow-hidden h-[460px] ml-16 w-full border border-hairline">
                    <Link
                        to="/"
                        className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-surface-1/80 hover:bg-surface-2 backdrop-blur-sm transition-colors"
                        title="Go back to home"
                    >
                        <Home className="size-4 text-ink-muted" />
                    </Link>

                    <img
                        src="https://i.pinimg.com/1200x/a3/9d/48/a39d48dc90bd37d15d892267273db520.jpg"
                        alt="medical ai illustration"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/60 to-transparent" />

                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                        <h2 className="text-2xl font-semibold text-ink tracking-tight">
                            AI-Powered Medical Analysis
                        </h2>
                        <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-sm">
                            Securely analyze medical reports with intelligent AI insights built
                            for accuracy and trust in healthcare.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
