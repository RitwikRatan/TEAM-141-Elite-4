require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testMaintenance() {
    console.log("Testing Maintenance Predictor...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const historyInput = [
        { role: 'assistant', content: "Hello! I'm your AI Mechanic. To accurately predict your future maintenance costs, I need a few details. What is the **Make, Model, and Year** of your car?" }
    ];

    const messageInput = "I have a Honda Civic 2018";

    const historyForGemini = historyInput.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    console.log("History for Gemini:", JSON.stringify(historyForGemini, null, 2));

    const systemPrompt = "You are an AI Maintenance Prediction Model...";

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemPrompt
        });

        const chat = model.startChat({
            history: historyForGemini
        });

        console.log("Chat started. Sending message...");
        const result = await chat.sendMessage(messageInput);
        const response = result.response.text();
        console.log("✅ Success:", response.substring(0, 100));

    } catch (error) {
        console.error("❌ Failed:", error);
    }
}

testMaintenance();
