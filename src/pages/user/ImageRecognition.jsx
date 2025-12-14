import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Scan, CheckCircle, Zap, Activity, Gauge, Fuel } from 'lucide-react';

const ImageRecognition = () => {
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        setAnalyzing(true);
        try {
            const res = await axios.post('http://localhost:5000/api/user/identify-car', { image });
            setResult(res.data);
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || "Failed to identify car.";
            alert(errMsg);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start min-h-[70vh]">
            <div data-aos="fade-right">
                <h1 className="text-3xl font-bold mb-4">AI Car Recognition</h1>
                <p className="text-textMuted mb-8">Snap a photo or upload an image to instantly identify any vehicle and get details.</p>

                <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center hover:border-accent/50 transition-colors bg-card relative overflow-hidden group">
                    {image ? (
                        <div className="relative">
                            <img src={image} alt="Upload" className="w-full h-64 object-contain rounded-lg mb-4" />
                            <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500/80 transition-colors">×</button>
                        </div>
                    ) : (
                        <div className="py-10">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Camera size={32} />
                            </div>
                            <p className="text-sm text-textMuted">Drag & Drop or Click to Upload</p>
                        </div>
                    )}
                    <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={!!image} />
                </div>

                {image && !result && (
                    <button onClick={handleAnalyze} disabled={analyzing} className="w-full mt-6 bg-secondary hover:bg-blue-600 py-4 rounded-xl font-bold transition-all text-white flex items-center justify-center gap-2">
                        {analyzing ? (
                            <><Scan className="animate-spin" /> Scanning Vehicle...</>
                        ) : (
                            <><Scan /> Identify Car</>
                        )}
                    </button>
                )}
            </div>

            <div data-aos="fade-left" className="h-full">
                {result ? (
                    <div className="bg-gradient-to-br from-card to-background border border-white/10 rounded-3xl p-8 relative h-full">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 blur-2xl rounded-full"></div>

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{result.model}</h2>
                            <span className="bg-green-500/20 text-success px-3 py-1 rounded-full text-xs font-mono border border-green-500/30">{result.confidence} Match</span>
                        </div>

                        <p className="text-gray-300 mb-6 text-sm leading-relaxed border-l-2 border-secondary pl-4">
                            {result.description}
                        </p>

                        <div className="space-y-6">
                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {result.specs && Object.entries(result.specs).map(([key, value]) => (
                                    <div key={key} className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-[10px] text-textMuted uppercase tracking-wider mb-1">{key}</div>
                                        <div className="text-sm font-bold text-white truncate">{value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Related Models */}
                            <div>
                                <h3 className="text-sm font-semibold text-textMuted mb-3 flex items-center gap-2"><Zap size={14} /> Competitors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.related_models && result.related_models.map(model => (
                                        <span key={model} className="px-3 py-1 bg-white/5 text-gray-300 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-colors cursor-default">
                                            {model}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hidden lg:flex flex-col items-center justify-center h-full text-textMuted opacity-30 text-center p-10 border border-white/5 rounded-3xl min-h-[400px]">
                        <Scan size={64} className="mb-4" />
                        <p>AI Analysis Results will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageRecognition;
