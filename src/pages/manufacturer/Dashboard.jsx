import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AIModelPrediction from './AIModelPrediction';

const ManufacturerDashboard = () => {
    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Main Content - Full Width */}
            <main className="flex-1 p-8">
                <Routes>
                    <Route path="/*" element={<AIModelPrediction />} />
                </Routes>
            </main>
        </div>
    );
};

export default ManufacturerDashboard;
