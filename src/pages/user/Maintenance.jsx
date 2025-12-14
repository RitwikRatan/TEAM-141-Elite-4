import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Wrench, Shield, Send, TrendingUp, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Maintenance = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI Mechanic. To accurately predict your future maintenance costs, I need a few details. What is the **Make, Model, and Year** of your car?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Send history excluding the local state properties if any
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const res = await axios.post('http://localhost:5000/api/user/maintenance-chat', {
                message: input,
                history: history
            });

            let aiContent = res.data.response;
            let extractedData = null;

            // Parse for JSON report data
            if (aiContent.includes('<<<REPORT_DATA>>>')) {
                const parts = aiContent.split('<<<REPORT_DATA>>>');
                aiContent = parts[0] + (parts[2] || ''); // Keep text before and after
                try {
                    extractedData = JSON.parse(parts[1]);
                    setReportData(extractedData);
                } catch (e) {
                    console.error("Failed to parse report JSON", e);
                }
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || "I'm having trouble connecting to the garage server. Please try again.";
            setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
            {/* Left: Chat Interface */}
            <div className="flex flex-col bg-card rounded-2xl border border-white/5 overflow-hidden h-[80vh]" data-aos="fade-right">
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                        <Wrench className="text-accent" size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold">AI Mechanic</h2>
                        <p className="text-xs text-textMuted">Predictive Maintenance Model</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-secondary text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                                <ReactMarkdown
                                    components={{
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-accent" {...props} />
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 p-4 rounded-2xl rounded-bl-none flex gap-2 items-center">
                                <span className="w-2 h-2 bg-textMuted rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-textMuted rounded-full animate-bounce delay-100"></span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-white/5 bg-background">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type details here..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all"
                        />
                        <button onClick={handleSend} disabled={loading} className="bg-accent p-3 rounded-xl text-white hover:bg-blue-600 transition-all">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Visualization Dashboard */}
            <div className="flex flex-col gap-6 overflow-y-auto h-[80vh] custom-scrollbar" data-aos="fade-left">
                {!reportData ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-textMuted opacity-50 space-y-4 border border-white/5 rounded-2xl bg-card/50 p-8">
                        <TrendingUp size={64} />
                        <div>
                            <h3 className="text-xl font-bold mb-2">Analysis Pending</h3>
                            <p>Chat with the AI Mechanic to generated a predicted maintenance report.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Summary Card */}
                        <div className="bg-card p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-2 text-success flex items-center gap-2"><Shield size={20} /> Health Summary</h3>
                            <p className="text-gray-300">{reportData.summary}</p>
                        </div>

                        {/* Projected Costs Chart */}
                        <div className="bg-card p-6 rounded-2xl border border-white/5 h-80">
                            <h3 className="font-bold mb-6">5-Year Cost Projection</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportData.projected_costs}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="year" stroke="#888888" />
                                    <YAxis prefix="$" stroke="#888888" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                        formatter={(value) => [`$${value}`, "Est. Cost"]}
                                    />
                                    <Bar dataKey="cost" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Risk Analysis Chart */}
                        <div className="bg-card p-6 rounded-2xl border border-white/5 h-80">
                            <h3 className="font-bold mb-6 flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-500" /> Component Risk Analysis</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={reportData.risk_analysis}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="probability"
                                    >
                                        {reportData.risk_analysis.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Maintenance;
