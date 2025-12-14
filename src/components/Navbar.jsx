import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import classNames from 'classnames';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    // Mock auth state for now - replace with context later
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
                            AutoIntel AI
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                            <Link to="/features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</Link>

                            {!token ? (
                                <>
                                    <Link to="/login" className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                                    <Link to="/register" className="bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-500/30">Get Started</Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span className="text-accent text-sm">Hello, {user.name}</span>
                                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                        <LogOut size={18} />
                                    </button>
                                    {user.role === 'manufacturer' ? (
                                        <Link to="/manufacturer/dashboard" className="bg-primary border border-secondary text-secondary hover:bg-secondary hover:text-white px-4 py-2 rounded-md transition-all">Dashboard</Link>
                                    ) : (
                                        <Link to="/user/dashboard" className="bg-primary border border-accent text-accent hover:bg-accent hover:text-primary px-4 py-2 rounded-md transition-all">My Dashboard</Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-background border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        {!token ? (
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/register" className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Register</Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">Logout</button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
