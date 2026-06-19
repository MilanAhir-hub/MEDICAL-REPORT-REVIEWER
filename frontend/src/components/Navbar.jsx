import Logo from "./Logo";
import { useState, useEffect } from "react";
import Menu from '../assets/menu.svg';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';
import { useTheme } from '../context/themeContext';
import Button from "./Button";
import { LogOut, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const sections = ['hero', 'features', 'how-it-works', 'testimonials', 'questions'];

        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -66%',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) observer.observe(element);
        });

        return () => {
            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId);
                if (element) observer.unobserve(element);
            });
        };
    }, []);

    const handleSmoothScroll = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            const navbarHeight = 56;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setOpen(false);
    };

    const navLinks = [
        { id: 'hero', label: 'Home' },
        { id: 'features', label: 'Features' },
        { id: 'how-it-works', label: 'How It Works' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'questions', label: 'FAQ' }
    ];

    return (
        <div className="fixed top-0 left-0 w-full z-50">
            <nav className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 h-14 transition-all duration-300 border-b ${
                scrolled
                    ? 'bg-canvas/80 backdrop-blur-xl border-hairline'
                    : 'bg-canvas/50 backdrop-blur-sm border-transparent'
            }`}>

                <Logo />

                {/* Centered Navigation Links */}
                <div className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={(e) => handleSmoothScroll(e, link.id)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                                activeSection === link.id
                                    ? 'text-ink bg-surface-1'
                                    : 'text-ink-subtle hover:text-ink hover:bg-surface-1/50'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Auth Buttons + Theme Toggle */}
                <div className="hidden sm:flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        className="p-2 rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {user ? (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/userProfile', { replace: true })}
                            >
                                Profile
                            </Button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-ink-subtle hover:text-red-400 hover:bg-surface-1 rounded-lg transition-all duration-200"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/login')}
                            >
                                Log in
                            </Button>
                            <Button
                                onClick={() => navigate('/signup')}
                            >
                                Get started
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile right: theme toggle + menu */}
                <div className="flex sm:hidden items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        className="p-2 rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-1 transition-all duration-200"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                        className="p-1.5 rounded-md hover:bg-surface-1 transition-colors"
                    >
                        <img src={Menu} alt="" className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`${open ? 'flex' : 'hidden'} absolute top-14 left-0 w-full bg-surface-1 border-b border-hairline py-3 flex-col items-center gap-1 px-5 text-sm md:hidden`}>
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={(e) => handleSmoothScroll(e, link.id)}
                            className={`block w-full text-center py-2.5 rounded-md transition-all duration-200 ${
                                activeSection === link.id
                                    ? 'text-ink bg-surface-2'
                                    : 'text-ink-subtle'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="w-full border-t border-hairline mt-2 pt-2 flex flex-col gap-1">
                        {user ? (
                            <>
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => navigate('/userProfile', { replace: true })}
                                >
                                    Profile
                                </Button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm text-ink-subtle hover:text-red-400 rounded-lg transition-all duration-200 w-full"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => navigate('/login')}
                                >
                                    Log in
                                </Button>
                                <Button
                                    className="w-full"
                                    onClick={() => navigate('/signup')}
                                >
                                    Get started
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
