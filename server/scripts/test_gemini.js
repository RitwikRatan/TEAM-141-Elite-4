require('dotenv').config({ path: '.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("Testing Google Gemini Connection...");
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key Present:", !!apiKey);

    if (!apiKey) {
        console.error("❌ No API Key found!");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Test 1: Chat Completion
    try {
        console.log("\n1. Testing Chat Model (gemini-flash-latest)...");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello, are you online?");
        console.log("✅ Chat Success:", result.response.text().substring(0, 50) + "...");
    } catch (error) {
        console.error("❌ Chat Failed:", error.message);
    }

    // Test 2: Vision Model
    try {
        console.log("\n2. Testing Vision Capabilities...");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Use a tiny 1x1 base64 png
        const tinyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgDNjd8qAAAAAElFTkSuQmCC";

        const imagePart = {
            inlineData: {
                data: tinyImage,
                mimeType: "image/png",
            },
        };

        const result = await model.generateContent([
            "What color is this?",
            imagePart
        ]);
        console.log("✅ Vision Success:", result.response.text());
    } catch (error) {
        console.error("❌ Vision Failed:", error.message);
    }
}

testGemini();
