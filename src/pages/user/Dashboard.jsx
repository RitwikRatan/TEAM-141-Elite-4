import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Lightbulb, Wrench, Camera, Navigation, Sparkles } from 'lucide-react';
import UserHome from './Home';
import Advisor from './Advisor';
import Maintenance from './Maintenance';
import ImageRecognition from './ImageRecognition';
import DrivingInsights from './DrivingInsights';
import Recommendations from './Recommendations';

const SidebarItem = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-secondary text-white shadow-lg shadow-blue-500/20' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}>
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </Link>
    );
};

const UserDashboard = () => {
    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            <aside className="w-64 bg-card border-r border-white/5 p-6 hidden md:block fixed h-full">
                <div className="space-y-2">
                    <SidebarItem to="/user/dashboard" icon={Home} label="Home" />
                    <SidebarItem to="/user/dashboard/recommendations" icon={Sparkles} label="AI Recommendations" />
                    <SidebarItem to="/user/dashboard/advisor" icon={Lightbulb} label="Car Advisor" />
                    <SidebarItem to="/user/dashboard/maintenance" icon={Wrench} label="Maintenance Predictor" />
                    <SidebarItem to="/user/dashboard/recognition" icon={Camera} label="Identify Car (AI)" />
                    <SidebarItem to="/user/dashboard/driving-insights" icon={Navigation} label="Driving Assistant" />
                </div>
            </aside>

            <main className="flex-1 md:ml-64 p-8">
                <Routes>
                    <Route path="/" element={<UserHome />} />
                    <Route path="/recommendations" element={<Recommendations />} />
                    <Route path="/advisor" element={<Advisor />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/recognition" element={<ImageRecognition />} />
                    <Route path="/driving-insights" element={<DrivingInsights />} />
                </Routes>
            </main>
        </div>
    );
};

export default UserDashboard;
