import React, { useState } from 'react';
import axios from 'axios';
import { Lightbulb, Check, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Advisor = () => {
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    const handleChat = async () => {
        if (!chatMessage.trim()) return;

        const newHistory = [...chatHistory, { role: 'user', content: chatMessage }];
        setChatHistory(newHistory);
        setChatMessage('');
        setChatLoading(true);

        try {
            // Send entire history so the backend can maintain context
            const res = await axios.post('http://localhost:5000/api/user/chat', {
                message: chatMessage,
                history: chatHistory
            });
            setChatHistory([...newHistory, { role: 'assistant', content: res.data.response }]);
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || "Sorry, I'm having trouble connecting right now.";
            setChatHistory([...newHistory, { role: 'assistant', content: errMsg }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-white/5 h-[80vh] flex flex-col" data-aos="fade-up">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 justify-between w-full">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="text-accent" />
                        AI Automotive Assistant
                    </div>
                    <a href="/user/dashboard/driving-insights" className="text-sm bg-accent/20 text-accent px-4 py-2 rounded-lg hover:bg-accent/30 transition-colors border border-accent/20">
                        🚀 Start Driving Assistant
                    </a>
                </h2>

                <div className="bg-background/50 rounded-xl p-6 flex-1 overflow-y-auto mb-4 space-y-4 flex flex-col custom-scrollbar">
                    {chatHistory.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-textMuted opacity-60">
                            <Lightbulb size={64} className="mb-4 text-accent animate-pulse" />
                            <p className="text-lg">How can I assist you with your car journey today?</p>
                            <p className="text-sm mt-2">Try asking: "Best SUV for families?" or "Review of Tesla Model 3"</p>
                        </div>
                    )}
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl text-base max-w-[80%] ${msg.role === 'user' ? 'bg-secondary self-end text-white rounded-br-none shadow-lg' : 'bg-white/10 self-start text-gray-200 rounded-bl-none border border-white/5'}`}>
                            {msg.role === 'user' ? (
                                msg.content
                            ) : (
                                <div className="markdown-content">
                                    <ReactMarkdown
                                        components={{
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                                            li: ({ node, ...props }) => <li className="my-1" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-accent" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    ))}
                    {chatLoading && (
                        <div className="p-4 bg-white/5 rounded-2xl rounded-bl-none w-fit border border-white/5 flex gap-2 items-center text-textMuted">
                            <span className="w-2 h-2 bg-textMuted rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-textMuted rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-textMuted rounded-full animate-bounce delay-200"></span>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask about cars, maintenance, or pricing..."
                        className="bg-background border border-white/10 rounded-xl px-6 py-4 flex-1 text-base focus:outline-none focus:border-secondary transition-all shadow-inner"
                        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                    />
                    <button
                        onClick={handleChat}
                        disabled={chatLoading}
                        className="bg-secondary p-4 rounded-xl text-white hover:bg-blue-600 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/20"
                    >
                        <Check size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Advisor;
