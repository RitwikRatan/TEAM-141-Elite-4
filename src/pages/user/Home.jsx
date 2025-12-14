import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Gauge, Fuel, Zap, Calendar } from 'lucide-react';

const UserHome = () => {
    const user = { name: 'Alex' };
    const [cars, setCars] = useState([]);

    // Static fallback data for demonstration
    const staticCars = [
        {
            id: 1,
            company_name: 'Tesla',
            model_name: 'Model 3',
            type: 'Electric',
            price: 3599000,
            image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80',
            description: 'The Tesla Model 3 combines cutting-edge electric technology with sleek design and impressive performance.',
            engine: 'Dual Motor AWD',
            horsepower: '480',
            mpg: '132 MPGe',
            year: '2024'
        },
        {
            id: 2,
            company_name: 'BMW',
            model_name: 'M4',
            type: 'Sports',
            price: 6275000,
            image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80',
            description: 'The BMW M4 delivers exhilarating performance with its powerful engine and precision handling.',
            engine: '3.0L Twin-Turbo I6',
            horsepower: '503',
            mpg: '23',
            year: '2024'
        },
        {
            id: 3,
            company_name: 'Mercedes-Benz',
            model_name: 'E-Class',
            type: 'Luxury',
            price: 5015000,
            image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80',
            description: 'Experience unparalleled luxury and advanced technology in the Mercedes-Benz E-Class sedan.',
            engine: '2.0L Turbo I4',
            horsepower: '255',
            mpg: '28',
            year: '2024'
        },
        {
            id: 4,
            company_name: 'Audi',
            model_name: 'Q7',
            type: 'SUV',
            price: 4935000,
            image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80',
            description: 'The Audi Q7 offers spacious luxury, advanced technology, and impressive versatility for families.',
            engine: '3.0L Turbo V6',
            horsepower: '335',
            mpg: '22',
            year: '2024'
        },
        {
            id: 5,
            company_name: 'Porsche',
            model_name: '911 Carrera',
            type: 'Sports',
            price: 8890000,
            image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80',
            description: 'The iconic Porsche 911 Carrera delivers legendary performance and timeless design.',
            engine: '3.0L Twin-Turbo Flat-6',
            horsepower: '379',
            mpg: '20',
            year: '2024'
        },
        {
            id: 6,
            company_name: 'Toyota',
            model_name: 'Camry Hybrid',
            type: 'Sedan',
            price: 2420000,
            image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80',
            description: 'The Toyota Camry Hybrid combines reliability, fuel efficiency, and modern comfort.',
            engine: '2.5L Hybrid I4',
            horsepower: '208',
            mpg: '52',
            year: '2024'
        }
    ];

    useEffect(() => {
        axios.get('http://localhost:5000/api/cars')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setCars(res.data);
                } else {
                    // Use static data if API returns empty
                    setCars(staticCars);
                }
            })
            .catch(err => {
                console.error('Failed to fetch cars, using static data:', err);
                // Use static data on error
                setCars(staticCars);
            });
    }, []);

    return (
        <div>
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-textMuted">Discover our top car recommendations tailored for you.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.length > 0 ? cars.map((car, i) => (
                    <div key={car.id} className="group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-accent/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10" data-aos="fade-up" data-aos-delay={i * 100}>
                        {/* Car Image */}
                        <div className="h-56 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                            <img
                                src={car.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80'}
                                alt={car.model_name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            {/* Type Badge */}
                            <div className="absolute top-3 right-3 bg-accent/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                                {car.type}
                            </div>

                            {/* Price Overlay */}
                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="text-white text-2xl font-bold drop-shadow-lg">
                                    ₹{(car.price).toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>

                        {/* Car Details */}
                        <div className="p-5">
                            <h3 className="text-xl font-bold mb-1">{car.company_name} {car.model_name}</h3>
                            <p className="text-textMuted text-sm mb-4 line-clamp-2">
                                {car.description || `Experience the perfect blend of performance and luxury with the ${car.model_name}. Engineered for excellence.`}
                            </p>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-textMuted text-xs mb-1">
                                        <Zap size={14} className="text-accent" />
                                        <span>Engine</span>
                                    </div>
                                    <div className="font-bold text-sm">
                                        {car.engine || '2.0L Turbo'}
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-textMuted text-xs mb-1">
                                        <Gauge size={14} className="text-accent" />
                                        <span>Power</span>
                                    </div>
                                    <div className="font-bold text-sm">
                                        {car.horsepower || '250'} HP
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-textMuted text-xs mb-1">
                                        <Fuel size={14} className="text-accent" />
                                        <span>Fuel Economy</span>
                                    </div>
                                    <div className="font-bold text-sm">
                                        {car.mpg || '28'} MPG
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-textMuted text-xs mb-1">
                                        <Calendar size={14} className="text-accent" />
                                        <span>Year</span>
                                    </div>
                                    <div className="font-bold text-sm">
                                        {car.year || '2024'}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-accent/20 to-secondary/20 hover:from-accent/30 hover:to-secondary/30 text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-accent/20 group-hover:border-accent/40">
                                View Full Details
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                        <p className="text-textMuted">Loading personalized recommendations...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHome;
