const db = require('../config/db');

// Get Car Recommendations
exports.getRecommendations = async (req, res) => {
    const { budget, familyType, usageType } = req.body;

    // Logic: 
    // - Filter by Price <= Budget
    // - Family 'Large' -> SUV/Van
    // - Usage 'City' -> Sedan/Hatchback/Electric

    try {
        let query = 'SELECT * FROM cars WHERE price <= ?';
        let params = [budget || 10000000]; // Default large budget

        if (familyType === 'Large') {
            query += ` AND (type LIKE '%SUV%' OR type LIKE '%Van%')`;
        }

        if (usageType === 'City') {
            // Prefer smaller cars or EV
            // Just specific query tweak or sorting
        }

        query += ' ORDER BY price DESC LIMIT 5'; // Simple heuristic

        const [cars] = await db.query(query, params);

        // Add "Why this car?" AI explanation
        const recommendations = cars.map(car => ({
            ...car,
            ai_reason: `Great fit for your ${usageType} usage and budget. ${car.type} is reliable.`
        }));

        res.json(recommendations);
    } catch (error) {
        console.error("Get Recommendations Error:", error);
        // Mock Recommendations Response
        const mockRecommendations = [
            {
                id: 1,
                make: "Toyota",
                model: "Corolla (Simulated)",
                type: "Sedan",
                price: 25000,
                ai_reason: `(Simulated) Great fit for your ${req.body.usageType || 'city'} usage and budget. Sedan is reliable.`
            },
            {
                id: 2,
                make: "Honda",
                model: "CR-V (Simulated)",
                type: "SUV",
                price: 30000,
                ai_reason: `(Simulated) Great fit for your ${req.body.familyType || 'small'} family and budget. SUV is versatile.`
            }
        ];
        res.json(mockRecommendations);
    }
};

// Predict Maintenance Cost
exports.predictMaintenance = async (req, res) => {
    const { car_id, annual_km } = req.body;

    // Mock Calculation
    const baseCost = 500; // Base yearly
    const usageCost = (annual_km || 10000) * 0.05;

    const prediction = {
        monthly_cost: ((baseCost + usageCost) / 12).toFixed(2),
        yearly_cost: (baseCost + usageCost).toFixed(2),
        tips: [
            "Regular oil changes can save 10%",
            "Check tire pressure monthly"
        ]
    };

    res.json(prediction);
};

// AI Chatbot with Google Gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getChatResponse = async (req, res) => {
    const { message, history } = req.body;

    // Convert history format if needed, Gemini uses 'user' and 'model' roles
    let historyForGemini = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    // Gemini history must start with a user message
    if (historyForGemini.length > 0 && historyForGemini[0].role === 'model') {
        historyForGemini.shift();
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest", // Updated to working model
            systemInstruction: "You are an expert Automotive Advisor. Your goal is to help the user find the perfect car or answer their questions. You should ask clarifying questions to understand their needs (budget, usage, preferences) before giving a final recommendation. formatting: Use Markdown for neat output (lists, bold text, etc.). Be concise and helpful."
        });

        // Use startChat for history context, but standard generateContent works for single/history payload usually too. 
        // For simple history mapping, we'll try to just include it in the chat session.
        const chat = model.startChat({
            history: historyForGemini
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.json({ response });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ message: "Sorry, I'm having trouble connecting to the AI Advisor right now." });
    }
};

// Interactive Maintenance Predictor Chat
exports.predictMaintenanceChat = async (req, res) => {
    const { message, history } = req.body;

    let historyForGemini = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    // Gemini history must start with a user message
    if (historyForGemini.length > 0 && historyForGemini[0].role === 'model') {
        historyForGemini.shift();
    }

    const systemPrompt = `You are an AI Maintenance Prediction Model (Persona: "AutoIntel Mechanic"). 
    Your goal is to estimate future maintenance costs.
    
    Protocol:
    1. Ask the user for details IF missing: Make, Model, Year, Mileage, Daily Usage (City/Highway).
    2. Once you have enough data, generate a comprehensive analysis.
    3. CRITICAL: When you generate the final analysis, you MUST include a JSON block at the end of your response for visualization.
    
    Format for the JSON block (Do not wrap in markdown code blocks, just raw text marker):
    <<<REPORT_DATA>>>
    {
      "projected_costs": [
        {"year": "2025", "cost": 1200},
        {"year": "2026", "cost": 1450},
        {"year": "2027", "cost": 1800},
        {"year": "2028", "cost": 2100},
        {"year": "2029", "cost": 2500}
      ],
      "risk_analysis": [
        {"component": "Brakes", "probability": 85},
        {"component": "Tires", "probability": 70},
        {"component": "Battery", "probability": 40},
        {"component": "Transmission", "probability": 15}
      ],
      "summary": "Your 2018 Honda Civic is in good condition but expect brake service soon."
    }
    <<<REPORT_DATA>>>
    
    Before the JSON, provide a helpful text summary and tips in Markdown.`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemPrompt
        });

        const chat = model.startChat({
            history: historyForGemini
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.json({ response });
    } catch (error) {
        console.error("Maintenance Chat Error:", error);
        res.status(500).json({ message: "Sorry, the mechanic is busy. Please try again later." });
    }
};

// Car Identification with Vision API
exports.identifyCar = async (req, res) => {
    const { image } = req.body; // Expects Base64 image string

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Remove data URL prefix for Gemini (needs pure base64)
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg", // Assuming JPEG/PNG, logic should infer but for MVP simple assumption or regex check
            },
        };

        const result = await model.generateContent([
            "Identify this car. Return a JSON object (NO markdown) with these exact keys: 'model' (name), 'confidence' (string %), 'specs' (object with Engine, Horsepower, 0to60, TopSpeed, MPG), 'related_models' (array of 3 strings), and 'description' (short text).",
            imagePart
        ]);

        let content = result.response.text();
        console.log("Raw Vision Response:", content);

        // Robust JSON extraction
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');

        if (jsonStart !== -1 && jsonEnd !== -1) {
            content = content.substring(jsonStart, jsonEnd + 1);
        }

        const data = JSON.parse(content);
        res.json(data);

    } catch (error) {
        console.error("Vision API Error:", error);
        res.status(500).json({ message: "Failed to identify car. The image description might be unclear or the service is busy." });
    }
};

// Smart Driving Assistant - Maintenance-Based Tips
exports.getDrivingTips = async (req, res) => {
    const { maintenance_summary } = req.body;

    // Tip categories based on common maintenance issues
    const tipDatabase = {
        brakes: [
            "Increase your following distance by at least 3 seconds to compensate for reduced braking efficiency.",
            "Avoid sudden stops - anticipate traffic flow and brake gradually.",
            "Consider driving in the right lane to maintain lower speeds until brakes are serviced.",
            "Use engine braking on downhill slopes to reduce brake wear.",
            "Schedule a brake inspection within the next 500 miles."
        ],
        tires: [
            "Reduce speed by 10-15 mph in wet conditions due to reduced tread depth.",
            "Avoid sharp turns and sudden lane changes to prevent tire slip.",
            "Check tire pressure weekly - underinflated tires worsen handling.",
            "Increase following distance to 4+ seconds for better reaction time.",
            "Avoid driving through deep puddles which can cause hydroplaning."
        ],
        battery: [
            "Minimize use of electrical accessories (AC, radio) on short trips.",
            "Avoid leaving lights or electronics on when parked.",
            "Keep jumper cables in your trunk as a precaution.",
            "Plan routes to avoid getting stranded in remote areas.",
            "Consider replacing the battery before winter if it's over 3 years old."
        ],
        transmission: [
            "Avoid aggressive acceleration - accelerate smoothly and gradually.",
            "Allow the engine to warm up for 30 seconds before driving in cold weather.",
            "Don't shift into Park until the vehicle has completely stopped.",
            "Avoid towing heavy loads until transmission is inspected.",
            "Schedule a transmission fluid check immediately."
        ],
        engine: [
            "Avoid high-speed driving until the engine is serviced.",
            "Monitor the temperature gauge closely during trips.",
            "Keep emergency coolant in your vehicle.",
            "Reduce idling time to prevent overheating.",
            "Plan for regular rest stops on long trips to let the engine cool."
        ],
        general: [
            "Perform a visual inspection of your vehicle before each trip.",
            "Keep an emergency kit with water, flashlight, and basic tools.",
            "Maintain smooth driving habits to reduce wear on all components.",
            "Schedule regular maintenance every 3,000-5,000 miles.",
            "Monitor dashboard warning lights and address them promptly.",
            "Keep your vehicle's manual handy for troubleshooting.",
            "Avoid driving in extreme weather if possible.",
            "Plan routes with gas stations and service centers in mind."
        ]
    };

    try {
        // Analyze maintenance summary to determine relevant categories
        const summary = (maintenance_summary || "").toLowerCase();
        let selectedTips = [];
        let detectedIssues = [];

        // Check for specific issues in the summary
        if (summary.includes('brake')) {
            selectedTips.push(...tipDatabase.brakes);
            detectedIssues.push('Brake System');
        }
        if (summary.includes('tire') || summary.includes('tyre')) {
            selectedTips.push(...tipDatabase.tires);
            detectedIssues.push('Tires');
        }
        if (summary.includes('battery')) {
            selectedTips.push(...tipDatabase.battery);
            detectedIssues.push('Battery');
        }
        if (summary.includes('transmission')) {
            selectedTips.push(...tipDatabase.transmission);
            detectedIssues.push('Transmission');
        }
        if (summary.includes('engine') || summary.includes('motor')) {
            selectedTips.push(...tipDatabase.engine);
            detectedIssues.push('Engine');
        }

        // If no specific issues detected, use general tips
        if (selectedTips.length === 0) {
            selectedTips = [...tipDatabase.general];
            detectedIssues.push('General Maintenance');
        }

        // Randomly select 5-7 tips
        const numTips = Math.floor(Math.random() * 3) + 5; // 5-7 tips
        const shuffled = selectedTips.sort(() => 0.5 - Math.random());
        const randomTips = shuffled.slice(0, numTips);

        // Calculate a safety score based on detected issues
        const baseSafetyScore = 100;
        const penaltyPerIssue = 15;
        const safetyScore = Math.max(40, baseSafetyScore - (detectedIssues.length * penaltyPerIssue));

        res.json({
            safety_score: safetyScore,
            detected_issues: detectedIssues,
            tips: randomTips,
            tip_count: randomTips.length,
            message: detectedIssues.length > 1
                ? `Multiple maintenance concerns detected. Drive cautiously and schedule service soon.`
                : detectedIssues.length === 1
                    ? `${detectedIssues[0]} attention needed. Follow these tips for safer driving.`
                    : `Your vehicle is in good condition. Follow these general best practices.`
        });

    } catch (error) {
        console.error("Driving Tips Error:", error);
        res.status(500).json({
            message: "Failed to generate driving tips.",
            tips: ["Schedule a comprehensive vehicle inspection.", "Drive cautiously until maintenance is completed."]
        });
    }
};
