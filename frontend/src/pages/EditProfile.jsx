import React, { useState, useEffect } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useAuth } from "../context/authContext";
import api from "../utils/axios";

const EditProfile = () => {
    const navigate = useNavigate();
    const languages = [
        "English", 
        "Hindi", 
        "Gujarati", 
        "Tamil", 
        "Telugu", 
        "Bengali", 
        "Marathi", 
        "Kannada", 
        "Malayalam", 
        "Punjabi"
    ];
    const [loading, setLoading] = useState(false);

    const { user, refetchUser } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        language: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                language: user.language || "English",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await api.put('/user/edit', formData);
            await refetchUser();
            navigate('/userProfile', { replace: true });
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12">
            <div className="max-w-3xl mx-auto bg-surface-1 rounded-xl border border-hairline p-6 sm:p-8 min-h-[90vh]">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-lg border border-hairline hover:bg-surface-2 hover:border-hairline-strong transition-all duration-200"
                    >
                        <ArrowLeft size={18} className="text-ink-subtle" strokeWidth={2} />
                    </button>
                    <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight">Edit Profile</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="relative space-y-6 pb-16">
                    <div>
                        <label className="text-xs font-medium text-ink-subtle mb-2 block">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-hairline rounded-lg px-4 py-2.5 text-sm outline-none bg-surface-2 text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-ink-subtle mb-2 block">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-hairline rounded-lg px-4 py-2.5 text-sm outline-none bg-surface-2 text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <Dropdown
                        subject={"Preferred Languages"}
                        collection={languages}
                        value={formData.language}
                        onChange={(selectedLanguage) => {
                            setFormData({
                                ...formData,
                                language: selectedLanguage
                            });
                        }}
                    />

                    {/* Floating Save Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} strokeWidth={2} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
