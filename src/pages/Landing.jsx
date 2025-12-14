import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BarChart2, Users, Cpu, ShieldCheck } from 'lucide-react';

const Landing = () => {
    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative px-4 pt-20 pb-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-secondary/20 rounded-full blur-[120px] -z-10" />

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6" data-aos="fade-down">
                    AI-Powered <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">Automotive Intelligence</span>
                </h1>

                <p className="max-w-2xl mx-auto text-xl text-textMuted mb-10" data-aos="fade-up" data-aos-delay="100">
                    Predict trends, design profitable models, and drive smarter decisions with our next-gen platform for Manufacturers and Users.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
                    <Link to="/register" className="group flex items-center justify-center gap-2 bg-secondary hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg shadow-blue-500/30">
                        For Manufacturers <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/register" className="flex items-center justify-center gap-2 bg-card border border-white/10 hover:border-accent/50 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all">
                        For Car Buyers
                    </Link>
                </div>

                {/* Abstract AI Graph */}
                <div className="mt-20 relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-white/10 bg-card/50 backdrop-blur shadow-2xl" data-aos="zoom-in" data-aos-delay="300">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                    <div className="h-full w-full flex items-center justify-center text-textMuted/20">
                        {/* Placeholder for complex SVG or Image */}
                        <div className="animate-pulse flex flex-col items-center">
                            <BarChart2 size={64} className="mb-4 text-accent/50" />
                            <span className="text-2xl font-mono">LIVE MARKET DATA STREAM</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-card/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" data-aos="fade-up">Powering the Future of Mobility</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: BarChart2, title: "Profit Prediction", desc: "Forecast P&L for new models before they hit the production line." },
                            { icon: Users, title: "User Targeting", desc: "Identify the perfect demographic for every vehicle segment." },
                            { icon: Cpu, title: "Smart Recognition", desc: "Snap a photo to instantly identify cars and get maintenance insights." },
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-card border border-white/5 hover:border-accent/30 transition-all hover:-translate-y-2" data-aos="fade-up" data-aos-delay={i * 100}>
                                <div className="w-14 h-14 rounded-xl bg-primary/50 flex items-center justify-center mb-6 text-accent">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-textMuted leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
