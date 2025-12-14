import React, { useState } from 'react';
import axios from 'axios';
import { Navigation, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const DrivingInsights = () => {
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState(null);
    const [maintenanceSummary, setMaintenanceSummary] = useState('');

    const handleGenerateTips = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/user/driving-tips', {
                maintenance_summary: maintenanceSummary
            });
            setInsights(res.data);
        } catch (error) {
            console.error(error);
            alert("Failed to generate driving tips.");
        } finally {
            setLoading(false);
        }
    };

    const getSafetyColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getSafetyLabel = (score) => {
        if (score >= 80) return 'Good';
        if (score >= 60) return 'Moderate';
        return 'Caution Required';
    };

    return (
        <div className="h-full flex flex-col gap-6" data-aos="fade-up">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Navigation className="text-accent" /> Smart Driving Assistant
                </h2>
                <span className="text-sm text-textMuted bg-white/5 px-3 py-1 rounded-full">
                    Maintenance-Based Tips
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Input Panel */}
                <div className="lg:col-span-1 bg-card p-6 rounded-2xl border border-white/5 h-fit">
                    <h3 className="font-bold mb-4 text-lg">Vehicle Status</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-textMuted block mb-2">
                                Maintenance Summary (Optional)
                            </label>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none resize-none"
                                rows="4"
                                value={maintenanceSummary}
                                onChange={(e) => setMaintenanceSummary(e.target.value)}
                                placeholder="E.g., Brake pads worn, tire pressure low, battery weak..."
                            />
                            <p className="text-xs text-textMuted mt-2">
                                💡 Leave empty for general driving tips
                            </p>
                        </div>

                        <button
                            onClick={handleGenerateTips}
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Navigation size={20} />
                                    Generate Driving Tips
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {!insights ? (
                        <div className="h-full flex flex-col items-center justify-center text-textMuted opacity-30 border border-white/5 rounded-2xl bg-white/5 p-12">
                            <Navigation size={64} className="mb-4" />
                            <p className="text-center">Click "Generate Driving Tips" to receive<br />personalized safety recommendations</p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fadeIn">
                            {/* Safety Score Card */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-textMuted text-sm uppercase tracking-wider mb-1">Safety Score</h3>
                                        <div className={`text-5xl font-bold ${getSafetyColor(insights.safety_score)}`}>
                                            {insights.safety_score}/100
                                        </div>
                                        <p className="text-sm text-textMuted mt-1">{getSafetyLabel(insights.safety_score)}</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-textMuted text-sm uppercase tracking-wider mb-1">Issues Detected</h3>
                                        <div className="text-4xl font-bold text-white">
                                            {insights.detected_issues?.length || 0}
                                        </div>
                                        <p className="text-xs text-textMuted mt-1">
                                            {insights.detected_issues?.join(', ') || 'None'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            {insights.message && (
                                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex gap-3 items-start">
                                    <AlertTriangle className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <h4 className="font-bold text-sm mb-1 text-blue-200">Analysis</h4>
                                        <p className="text-sm text-gray-300">{insights.message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Driving Tips */}
                            <div className="bg-card p-6 rounded-2xl border border-white/5">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle className="text-green-400" size={20} />
                                    Recommended Driving Tips ({insights.tip_count || insights.tips?.length || 0})
                                </h4>
                                <div className="space-y-3">
                                    {insights.tips && insights.tips.map((tip, i) => (
                                        <div key={i} className="flex gap-3 bg-white/5 p-4 rounded-lg border border-white/5 hover:border-accent/30 transition-colors">
                                            <span className="text-accent font-bold text-lg flex-shrink-0">{i + 1}.</span>
                                            <p className="text-sm text-gray-300">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Regenerate Button */}
                            <button
                                onClick={handleGenerateTips}
                                disabled={loading}
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Generate New Tips
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DrivingInsights;
