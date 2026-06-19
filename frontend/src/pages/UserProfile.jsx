import React from "react";
import { Mail, Pencil, Home, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const UserProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        navigate('/login', { replace: true });
        return null;
    }

    const profile = {
        name: user?.name || "User",
        email: user?.email || "No email",
        languages: user?.language ? [user.language] : ["English"],
    };

    return (
        <div className="min-h-screen bg-canvas px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto bg-surface-1 rounded-xl min-h-[70vh] border border-hairline overflow-hidden relative">
                {/* Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 w-9 h-9 rounded-lg bg-surface-2/80 backdrop-blur-sm text-ink-subtle flex items-center justify-center hover:bg-surface-3 hover:text-ink active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    title="Go to Home"
                >
                    <Home size={16} strokeWidth={2} />
                </button>

                {/* Dashboard Button */}
                <button
                    onClick={() => navigate('/userDashboard', { replace: true })}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 rounded-lg bg-surface-2/80 backdrop-blur-sm text-ink-subtle flex items-center justify-center hover:bg-surface-3 hover:text-ink active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    title="Go to Dashboard"
                >
                    <LayoutDashboard size={16} strokeWidth={2} />
                </button>

                {/* Banner */}
                <div className="relative h-32 sm:h-44">
                    <div className="h-full w-full bg-gradient-to-r from-primary via-primary-hover to-primary"></div>
                    <div className="absolute -bottom-12 sm:-bottom-14 left-1/2 -translate-x-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-surface-1 object-cover bg-surface-1 shadow-lg"
                            alt="profile"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="pt-16 sm:pt-20 px-4 sm:px-8 pb-12">
                    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 relative pb-16 sm:pb-20">
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">{profile.name}</h2>
                            <p className="text-xs sm:text-sm text-ink-subtle">User Profile</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-hairline p-5 flex gap-4 hover:border-hairline-strong transition-all duration-200 bg-surface-2">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail size={18} className="text-primary" strokeWidth={2} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-ink-tertiary mb-1">Email</p>
                                    <p className="text-sm font-medium text-ink break-words">{profile.email}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-hairline p-5 sm:col-span-2 hover:border-hairline-strong transition-all duration-200 bg-surface-2">
                                <p className="text-xs text-ink-tertiary mb-3">Language selected</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.languages.map((lang) => (
                                        <span
                                            key={lang}
                                            className="px-4 py-1.5 text-xs rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => navigate('/editProfile', { replace: true })}
                            className="absolute bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                            title="Edit Profile"
                        >
                            <Pencil size={18} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
