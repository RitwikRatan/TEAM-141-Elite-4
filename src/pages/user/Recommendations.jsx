import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkles, TrendingUp, DollarSign, Calendar, Zap, Gauge, Fuel } from 'lucide-react';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/manufacturer/recommendations');
            setRecommendations(res.data);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Sparkles className="text-accent" size={32} />
                        AI Recommendations
                    </h1>
                    <p className="text-textMuted mt-1">Discover new car models recommended just for you</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-textMuted">Total Recommendations</div>
                    <div className="text-2xl font-bold text-accent">{recommendations.length}</div>
                </div>
            </div>

            {recommendations.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-white/5">
                    <Sparkles size={64} className="mx-auto text-textMuted opacity-30 mb-4" />
                    <p className="text-textMuted">No recommendations available yet</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec) => (
                        <div key={rec.id} className="group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-accent/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10" data-aos="fade-up">
                            {/* Header with AI Badge */}
                            <div className="h-56 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                {/* AI Recommended Badge */}
                                <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1">
                                    <Sparkles size={12} />
                                    AI Recommended
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-3 right-3 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                                    {rec.body_type}
                                </div>

                                {/* Price Overlay */}
                                <div className="absolute bottom-3 left-3 right-3">
                                    <div className="text-white text-2xl font-bold drop-shadow-lg">
                                        ₹{parseInt(rec.base_price).toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-white/80 text-sm">{rec.target_segment} Segment</div>
                                </div>
                            </div>

                            {/* Car Details */}
                            <div className="p-5">
                                <h3 className="text-xl font-bold mb-1">{rec.model_name}</h3>
                                <p className="text-textMuted text-sm mb-4 line-clamp-2">
                                    {rec.description}
                                </p>

                                {/* Specifications Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center gap-2 text-textMuted text-xs mb-1">
                                            <Zap size={14} className="text-accent" />
                                            <span>Engine</span>
                                        </div>
                                        <div className="font-bold text-sm">{rec.engine}</div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center gap-2 text-textMuted text-xs mb-1">
                                            <Gauge size={14} className="text-accent" />
                                            <span>Power</span>
                                        </div>
                                        <div className="font-bold text-sm">{rec.horsepower} HP</div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center gap-2 text-textMuted text-xs mb-1">
                                            <Fuel size={14} className="text-accent" />
                                            <span>Fuel Type</span>
                                        </div>
                                        <div className="font-bold text-sm">{rec.fuel_type}</div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center gap-2 text-textMuted text-xs mb-1">
                                            <Calendar size={14} className="text-accent" />
                                            <span>Launch</span>
                                        </div>
                                        <div className="font-bold text-sm">{rec.recommended_launch_month}</div>
                                    </div>
                                </div>

                                {/* AI Insights */}
                                <div className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg p-3 border border-accent/20 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-textMuted">AI Confidence</span>
                                        <span className="text-sm font-bold text-accent">{rec.confidence_score}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-textMuted">Profit Margin</span>
                                        <span className="text-sm font-bold text-green-500">{rec.profit_margin}%</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-accent/20 to-secondary/20 hover:from-accent/30 hover:to-secondary/30 text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-accent/20 group-hover:border-accent/40">
                                    View Details
                                    <TrendingUp size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recommendations;
