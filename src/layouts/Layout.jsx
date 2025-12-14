import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Layout = ({ children }) => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
        });
    }, []);

    return (
        <div className="min-h-screen bg-background text-textPrimary selection:bg-accent selection:text-primary overflow-x-hidden">
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
            <footer className="bg-card border-t border-white/5 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-textMuted text-sm">
                    © 2025 AutoIntel AI. All rights reserved. Revolutionizing the Automotive Industry.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
