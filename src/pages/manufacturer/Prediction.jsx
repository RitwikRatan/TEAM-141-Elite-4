import React, { useState } from 'react';
import axios from 'axios';
import { Cpu, AlertCircle, CheckCircle } from 'lucide-react';

const Prediction = () => {
    const [inputs, setInputs] = useState({
        type: 'SUV',
        price: '',
        launch_region: 'North America',
        fuel: 'Electric'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/analytics/predict', inputs);
            setResult(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10">
            <div data-aos="fade-right">
                <h1 className="text-3xl font-bold mb-2">New Model AI Prediction</h1>
                <p className="text-textMuted mb-8">Input your model specifications to forecast success.</p>

                <form onSubmit={handlePredict} className="space-y-6 bg-card p-8 rounded-2xl border border-white/5">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-textMuted mb-2">Vehicle Type</label>
                            <select name="type" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white">
                                <option value="SUV">SUV</option>
                                <option value="Sedan">Sedan</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Truck">Truck</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-textMuted mb-2">Fuel Type</label>
                            <select name="fuel" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white">
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-textMuted mb-2">Estimated Price ($)</label>
                        <input type="number" name="price" required onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white" placeholder="45000" />
                    </div>

                    <div>
                        <label className="block text-sm text-textMuted mb-2">Target Region</label>
                        <select name="launch_region" onChange={handleChange} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white">
                            <option value="North America">North America</option>
                            <option value="Europe">Europe</option>
                            <option value="Asia">Asia</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                        {loading ? 'AI is Thinking...' : <><Cpu /> Analyze Potential</>}
                    </button>
                </form>
            </div>

            <div className="flex flex-col justify-center" data-aos="fade-left">
                {result ? (
                    <div className="bg-card border border-accent/20 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Cpu size={100} />
                        </div>

                        <div className="mb-8">
                            <span className="text-sm font-uppercase tracking-widest text-textMuted">AI CONFIDENCE SCORE</span>
                            <div className="text-5xl font-bold text-white mt-2">{result.demand_score}/100</div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                                <div className="text-sm text-textMuted">Projected Profit / Unit</div>
                                <div className="text-2xl font-semibold text-success">${result.predicted_profit.toLocaleString()}</div>
                            </div>

                            <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                                <div className="text-sm text-textMuted">Risk Analysis</div>
                                <div className={`text-2xl font-semibold ${result.loss_risk_percent > 50 ? 'text-danger' : 'text-success'}`}>
                                    {result.loss_risk_percent}% Loss Risk
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border ${result.demand_score > 70 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'} flex items-start gap-3`}>
                                {result.demand_score > 70 ? <CheckCircle className="text-success shrink-0" /> : <AlertCircle className="text-warning shrink-0" />}
                                <div>
                                    <div className="font-semibold text-white">Recommendation</div>
                                    <div className="text-sm text-gray-300 mt-1">{result.recommendation}</div>
                                </div>
                            </div>

                            <button className="w-full py-3 border border-white/20 hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                                Download AI Report (PDF)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-textMuted opacity-50">
                        <Cpu size={64} className="mx-auto mb-4" />
                        <p>Waiting for model parameters...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prediction;
