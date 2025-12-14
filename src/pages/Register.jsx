import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Mail, Building2 } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', company_name: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { ...formData, role });
            navigate('/login'); // Redirect to login on success
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-white/10 shadow-xl" data-aos="fade-up">
                <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

                <div className="flex bg-background/50 p-1 rounded-lg mb-8">
                    <button
                        onClick={() => setRole('user')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'user' ? 'bg-secondary text-white shadow-lg' : 'text-textMuted hover:text-white'}`}
                    >
                        User
                    </button>
                    <button
                        onClick={() => setRole('manufacturer')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'manufacturer' ? 'bg-secondary text-white shadow-lg' : 'text-textMuted hover:text-white'}`}
                    >
                        Manufacturer
                    </button>
                </div>

                {error && <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text" name="name" required onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email" name="email" required onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {role === 'manufacturer' && (
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2">Company Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text" name="company_name" required onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                                    autoComplete="organization"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password" name="password" required onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02]">
                        Sign Up as {role === 'user' ? 'User' : 'Manufacturer'}
                    </button>
                </form>

                <p className="mt-6 text-center text-textMuted text-sm">
                    Already have an account? <Link to="/login" className="text-accent hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
