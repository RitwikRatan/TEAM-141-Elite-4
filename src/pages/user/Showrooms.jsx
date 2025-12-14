import React from 'react';
import { MapPin, Phone, Navigation } from 'lucide-react';

const Showrooms = () => {
    // Mock Data
    const showrooms = [
        { name: 'Tesla Center - Downtown', address: '123 Tech Blvd, City Center', distance: '2.5 km', phone: '+1 234 567 890' },
        { name: 'Ford Performance Hub', address: '45 Auto Mile, Southside', distance: '5.8 km', phone: '+1 987 654 321' },
        { name: 'BMW Experience Store', address: '88 Luxury Ln, West End', distance: '8.2 km', phone: '+1 567 890 123' },
        { name: 'Toyota Family Showroom', address: '99 Reliability Rd, North Hills', distance: '12 km', phone: '+1 321 098 765' },
    ];

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
            <div className="space-y-6 overflow-y-auto pr-2" data-aos="fade-right">
                <h1 className="text-3xl font-bold mb-6">Find Showrooms</h1>

                <div className="flex gap-4 mb-6">
                    <input type="text" placeholder="Search by brand or location..." className="flex-1 bg-card border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors" />
                    <button className="bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">Search</button>
                </div>

                <div className="space-y-4">
                    {showrooms.map((showroom, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-card border border-white/5 hover:border-accent/40 transition-all cursor-pointer group">
                            <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">{showroom.name}</h3>
                            <div className="flex items-center text-textMuted text-sm mb-3">
                                <MapPin size={16} className="mr-1" /> {showroom.address}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300">{showroom.distance} away</span>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full bg-white/5 hover:bg-green-500/20 hover:text-green-500 transition-colors"><Phone size={18} /></button>
                                    <button className="p-2 rounded-full bg-white/5 hover:bg-blue-500/20 hover:text-blue-500 transition-colors"><Navigation size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden lg:block bg-card rounded-3xl border border-white/5 relative overflow-hidden" data-aos="fade-left">
                {/* Placeholder for Map Integration */}
                <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-textMuted">
                    <MapPin size={64} className="mb-4 text-gray-700" />
                    <p>Interactive Map Module</p>
                    <span className="text-xs text-gray-600 mt-2">(Google Maps / Mapbox Integration)</span>
                </div>

                {/* Mock Map Pins */}
                <div className="absolute top-1/4 left-1/4 group cursor-pointer">
                    <div className="w-4 h-4 bg-accent rounded-full animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-accent rounded-full border-2 border-white relative"></div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Tesla Center</div>
                </div>

                <div className="absolute bottom-1/3 right-1/3 group cursor-pointer">
                    <div className="w-4 h-4 bg-secondary rounded-full border-2 border-white relative"></div>
                </div>
            </div>
        </div>
    );
};

export default Showrooms;
