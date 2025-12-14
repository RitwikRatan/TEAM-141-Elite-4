require('dotenv').config({ path: '.env' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log("Fetching models from:", url.replace(apiKey, "HIDDEN_KEY"));

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("✅ Available Models:");
            if (data.models) {
                data.models.forEach(m => {
                    if (m.name.includes("1.5") && m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log("No models found in response.");
            }
        }
    } catch (error) {
        console.error("❌ Fetch Failed:", error.message);
    }
}

listModels();
