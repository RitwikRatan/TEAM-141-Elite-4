import React, { useState } from 'react';
import axios from 'axios';
import { Cpu, TrendingUp, Calendar, AlertTriangle, Target, DollarSign, MapPin, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AIModelPrediction = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [showRecommendModal, setShowRecommendModal] = useState(false);
    const [recommendationResult, setRecommendationResult] = useState(null);
    const [recommending, setRecommending] = useState(false);

    const [formData, setFormData] = useState({
        model_name: '',
        specifications: {
            engine: '',
            horsepower: '',
            fuel_type: 'Petrol',
            transmission: 'Automatic'
        },
        design: {
            body_type: 'Sedan',
            color_options: [],
            interior_features: []
        },
        pricing: {
            base_price: '',
            target_segment: 'Mid-Range'
        },
        launch_plan: {
            regions: [],
            proposed_date: ''
        }
    });

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayInput = (section, field, value) => {
        const array = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: array
            }
        }));
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/manufacturer/predict-model', formData);
            setPrediction(res.data);
            setStep(5); // Move to results
        } catch (error) {
            console.error(error);
            alert('Failed to generate prediction');
        } finally {
            setLoading(false);
        }
    };

    const handleRecommend = async () => {
        setRecommending(true);
        try {
            const res = await axios.post('http://localhost:5000/api/manufacturer/recommend-to-users', {
                model_data: formData,
                prediction_data: prediction
            });
            setRecommendationResult(res.data);
            setShowRecommendModal(true);
        } catch (error) {
            console.error(error);
            alert('Failed to recommend model');
        } finally {
            setRecommending(false);
        }
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Cpu className="text-accent" size={32} />
                        AI Model Prediction
                    </h1>
                    <p className="text-textMuted mt-1">Predict success metrics for your new car model</p>
                </div>
                {!prediction && (
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={`w-12 h-1 rounded-full ${s <= step ? 'bg-accent' : 'bg-white/10'}`} />
                        ))}
                    </div>
                )}
            </div>

            {!prediction ? (
                <div className="bg-card p-8 rounded-2xl border border-white/5">
                    {/* Step 1: Model Basics */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">Model Basics</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Model Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.model_name}
                                        onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                                        placeholder="e.g., Nexus 2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Body Type</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.design.body_type}
                                        onChange={(e) => handleInputChange('design', 'body_type', e.target.value)}
                                    >
                                        <option>Sedan</option>
                                        <option>SUV</option>
                                        <option>Hatchback</option>
                                        <option>Coupe</option>
                                        <option>Truck</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-3 rounded-xl">
                                Next: Specifications
                            </button>
                        </div>
                    )}

                    {/* Step 2: Specifications */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Engine</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.specifications.engine}
                                        onChange={(e) => handleInputChange('specifications', 'engine', e.target.value)}
                                        placeholder="e.g., 2.0L Turbo I4"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Horsepower</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.specifications.horsepower}
                                        onChange={(e) => handleInputChange('specifications', 'horsepower', e.target.value)}
                                        placeholder="e.g., 250"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Fuel Type</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.specifications.fuel_type}
                                        onChange={(e) => handleInputChange('specifications', 'fuel_type', e.target.value)}
                                    >
                                        <option>Petrol</option>
                                        <option>Diesel</option>
                                        <option>Electric</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Transmission</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.specifications.transmission}
                                        onChange={(e) => handleInputChange('specifications', 'transmission', e.target.value)}
                                    >
                                        <option>Automatic</option>
                                        <option>Manual</option>
                                        <option>CVT</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl">
                                    Back
                                </button>
                                <button onClick={() => setStep(3)} className="flex-1 bg-accent hover:bg-accent/80 text-white font-bold py-3 rounded-xl">
                                    Next: Design & Pricing
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Design & Pricing */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">Design & Pricing</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Color Options (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        onChange={(e) => handleArrayInput('design', 'color_options', e.target.value)}
                                        placeholder="e.g., White, Black, Red"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Interior Features (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        onChange={(e) => handleArrayInput('design', 'interior_features', e.target.value)}
                                        placeholder="e.g., Leather, Sunroof, Touchscreen"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Base Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.pricing.base_price}
                                        onChange={(e) => handleInputChange('pricing', 'base_price', e.target.value)}
                                        placeholder="e.g., 2500000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Target Segment</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.pricing.target_segment}
                                        onChange={(e) => handleInputChange('pricing', 'target_segment', e.target.value)}
                                    >
                                        <option>Budget</option>
                                        <option>Mid-Range</option>
                                        <option>Premium</option>
                                        <option>Luxury</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl">
                                    Back
                                </button>
                                <button onClick={() => setStep(4)} className="flex-1 bg-accent hover:bg-accent/80 text-white font-bold py-3 rounded-xl">
                                    Next: Launch Plan
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Launch Plan */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">Launch Strategy</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Target Regions (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        onChange={(e) => handleArrayInput('launch_plan', 'regions', e.target.value)}
                                        placeholder="e.g., India, USA, Europe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Proposed Launch Date</label>
                                    <input
                                        type="month"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-accent outline-none"
                                        value={formData.launch_plan.proposed_date}
                                        onChange={(e) => handleInputChange('launch_plan', 'proposed_date', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(3)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl">
                                    Back
                                </button>
                                <button
                                    onClick={handlePredict}
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-accent to-secondary hover:opacity-90 text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Analyzing...' : <><Sparkles size={20} /> Generate AI Prediction</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Results Display
                <div className="space-y-6">
                    {/* Profit Analysis */}
                    <div className="bg-card p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <DollarSign className="text-green-500" />
                            Profit Analysis
                        </h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-textMuted text-sm mb-1">Profit Margin</div>
                                <div className="text-2xl font-bold text-green-500">{prediction.profit_analysis.projected_profit_margin}%</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-textMuted text-sm mb-1">Break-even Units</div>
                                <div className="text-2xl font-bold">{prediction.profit_analysis.break_even_units.toLocaleString()}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-textMuted text-sm mb-1">ROI Timeline</div>
                                <div className="text-2xl font-bold">{prediction.profit_analysis.roi_months} months</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-textMuted text-sm mb-1">Confidence</div>
                                <div className="text-2xl font-bold text-blue-500">{prediction.profit_analysis.confidence_score}%</div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-textMuted">{prediction.profit_analysis.reasoning}</p>
                    </div>

                    {/* Demand Forecast */}
                    <div className="bg-card p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="text-accent" />
                            Demand Forecast
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <div className="text-textMuted text-sm">Total Units (Year 1)</div>
                                    <div className="text-3xl font-bold">{prediction.demand_forecast.total_units_year1.toLocaleString()}</div>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={prediction.demand_forecast.regional_breakdown}
                                            dataKey="units"
                                            nameKey="region"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {prediction.demand_forecast.regional_breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-3">
                                {prediction.demand_forecast.regional_breakdown.map((region, i) => (
                                    <div key={i} className="bg-white/5 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{region.region}</span>
                                            <span className="text-accent">{region.market_share}%</span>
                                        </div>
                                        <div className="text-sm text-textMuted">{region.units.toLocaleString()} units</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Launch Timing */}
                    <div className="bg-card p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="text-yellow-500" />
                            Launch Timing Recommendation
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-textMuted text-sm mb-1">Recommended Date</div>
                                <div className="text-xl font-bold">{prediction.launch_timing.recommended_month}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-textMuted text-sm mb-1">Risk Level</div>
                                <div className={`text-xl font-bold ${prediction.launch_timing.risk_level === 'low' ? 'text-green-500' : prediction.launch_timing.risk_level === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {prediction.launch_timing.risk_level.toUpperCase()}
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-textMuted text-sm mb-1">Alternative Dates</div>
                                <div className="text-sm">{prediction.launch_timing.alternative_dates?.join(', ')}</div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-textMuted">{prediction.launch_timing.reasoning}</p>
                    </div>

                    {/* Risk Factors */}
                    <div className="bg-card p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" />
                            Risk Analysis
                        </h2>
                        <div className="space-y-3">
                            {prediction.risk_factors.map((risk, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-lg border-l-4" style={{ borderColor: risk.severity === 'critical' ? '#ef4444' : risk.severity === 'high' ? '#f59e0b' : risk.severity === 'medium' ? '#eab308' : '#10b981' }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold">{risk.factor}</div>
                                        <div className="flex gap-2">
                                            <span className="text-xs bg-white/10 px-2 py-1 rounded">{risk.severity}</span>
                                            <span className="text-xs bg-accent/20 px-2 py-1 rounded">{risk.probability}%</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-textMuted">
                                        <strong>Mitigation:</strong> {risk.mitigation}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-card p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Target className="text-purple-500" />
                            Strategic Recommendations
                        </h2>
                        <ul className="space-y-2">
                            {prediction.recommendations?.map((rec, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="text-accent mt-1">✓</span>
                                    <span className="text-sm">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <button
                            onClick={handleRecommend}
                            disabled={recommending}
                            className="bg-gradient-to-r from-accent to-secondary hover:opacity-90 text-white font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                        >
                            {recommending ? 'Recommending...' : <><Target size={20} /> Recommend to Users</>}
                        </button>
                        <button
                            onClick={() => { setPrediction(null); setStep(1); setRecommendationResult(null); }}
                            className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl"
                        >
                            Analyze Another Model
                        </button>
                    </div>
                </div>
            )}

            {/* Recommendation Modal */}
            {showRecommendModal && recommendationResult && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Target className="text-accent" />
                                Recommendation Sent Successfully!
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                <p className="text-green-400 font-medium">{recommendationResult.message}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <div className="text-textMuted text-sm mb-1">Total Reach</div>
                                    <div className="text-3xl font-bold text-accent">{recommendationResult.total_reach}</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <div className="text-textMuted text-sm mb-1">Est. Conversions</div>
                                    <div className="text-3xl font-bold text-green-500">{recommendationResult.estimated_conversions}</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <div className="text-textMuted text-sm mb-1">Conversion Rate</div>
                                    <div className="text-3xl font-bold text-yellow-500">15%</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold mb-3">Matched Users</h3>
                                <div className="space-y-2">
                                    {recommendationResult.recommended_users.map((user, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-textMuted">{user.reason}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-textMuted">Match Score</div>
                                                <div className="text-xl font-bold text-accent">{user.match_score}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10">
                            <button
                                onClick={() => setShowRecommendModal(false)}
                                className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-3 rounded-xl"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIModelPrediction;
