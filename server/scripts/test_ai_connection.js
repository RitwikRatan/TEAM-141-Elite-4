require('dotenv').config({ path: '.env' });
const { OpenAI } = require("openai");

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

async function testConnection() {
    console.log("Testing OpenRouter Connection...");
    console.log("API Key Present:", !!process.env.OPENROUTER_API_KEY);

    // Test 1: Chat Completion (Standard)
    try {
        console.log("\n1. Testing Chat Model (meta-llama/llama-3.3-70b-instruct:free)...");
        const completion = await client.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [{ role: "user", content: "Hello, are you online?" }],
        });
        console.log("✅ Chat Success:", completion.choices[0].message.content.substring(0, 50) + "...");
    } catch (error) {
        console.error("❌ Chat Failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }

    // Test 2: Vision Model (google/gemini-2.0-flash-exp:free)
    try {
        console.log("\n2. Testing Vision Model (google/gemini-2.0-flash-exp:free)...");
        // Using a tiny transparent 1x1 pixel base64 png for test
        const tinyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgDNjd8qAAAAAElFTkSuQmCC";

        const completion = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "What color is this?" },
                        { type: "image_url", image_url: { url: tinyImage } }
                    ]
                }
            ]
        });
        console.log("✅ Vision Success:", completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ Vision Failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testConnection();
