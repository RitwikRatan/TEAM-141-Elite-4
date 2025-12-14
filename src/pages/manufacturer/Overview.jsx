import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const KPICard = ({ title, value, change, isPositive, icon: Icon }) => (
    <div className="p-6 rounded-2xl bg-card border border-white/5 hover:border-white/10 transition-all" data-aos="fade-up">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${isPositive ? 'bg-blue-500/10 text-secondary' : 'bg-red-500/10 text-red-500'}`}>
                <Icon size={24} />
            </div>
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'} flex items-center gap-1`}>
                {change} {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            </span>
        </div>
        <h3 className="text-textMuted text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

const Overview = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <KPICard title="Total Models Analyzed" value="12" change="+2 new" isPositive={true} icon={Activity} />
                <KPICard title="Avg. Profit Margin" value="18.5%" change="+1.2%" isPositive={true} icon={DollarSign} />
                <KPICard title="High Risk Models" value="3" change="-1" isPositive={true} icon={TrendingDown} />
                <KPICard title="Market Demand Score" value="85/100" change="+5pts" isPositive={true} icon={TrendingUp} />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Placeholder charts */}
                <div className="p-6 rounded-2xl bg-card border border-white/5 h-80 flex items-center justify-center text-textMuted">
                    Profit Trends Chart Placeholder
                </div>
                <div className="p-6 rounded-2xl bg-card border border-white/5 h-80 flex items-center justify-center text-textMuted">
                    Regional Demand Heatmap Placeholder
                </div>
            </div>
        </div>
    );
};

export default Overview;
