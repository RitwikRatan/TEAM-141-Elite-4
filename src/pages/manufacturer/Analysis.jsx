import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';

const Analysis = () => {
    // Mock Data for now as DB might be empty
    const [data] = useState([
        { name: 'Model X', profit: 4000, loss: 2400, year: 2021 },
        { name: 'Model Y', profit: 3000, loss: 1398, year: 2022 },
        { name: 'Model Z', profit: 9800, loss: 2000, year: 2023 },
        { name: 'Model A', profit: 3908, loss: 2780, year: 2024 },
        { name: 'Model B', profit: 4800, loss: 1890, year: 2025 },
    ]);

    // In real app, fetch from /api/analytics/history
    /*
    useEffect(() => {
        axios.get('http://localhost:5000/api/analytics/history')
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []); 
    */

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Historical Model Analysis</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-card border border-white/5" data-aos="fade-up">
                    <h3 className="text-xl font-semibold mb-6">Profit vs Loss Trends</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="loss" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-white/5" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-xl font-semibold mb-6">Yearly Growth</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="year" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="profit" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
