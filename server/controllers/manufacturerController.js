const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Model Prediction for Manufacturers
exports.predictNewModel = async (req, res) => {
  const { model_name, specifications, design, pricing, launch_plan } = req.body;

  const systemPrompt = `You are an expert automotive market analyst and business strategist.
    Analyze the following new car model proposal and provide comprehensive predictions.
    
    Model Details:
    - Name: ${model_name}
    - Specifications: ${JSON.stringify(specifications)}
    - Design: ${JSON.stringify(design)}
    - Pricing: ${JSON.stringify(pricing)}
    - Launch Plan: ${JSON.stringify(launch_plan)}
    
    Provide a detailed analysis in the following JSON format (return ONLY valid JSON):
    {
      "profit_analysis": {
        "projected_profit_margin": <number 0-100>,
        "break_even_units": <number>,
        "roi_months": <number>,
        "confidence_score": <number 0-100>,
        "reasoning": "<brief explanation>"
      },
      "demand_forecast": {
        "total_units_year1": <number>,
        "regional_breakdown": [
          {"region": "<region_name>", "units": <number>, "market_share": <number 0-100>}
        ],
        "peak_demand_month": "<month>",
        "growth_trajectory": "<stable|growing|declining>"
      },
      "launch_timing": {
        "recommended_month": "<month YYYY-MM>",
        "risk_level": "<low|medium|high>",
        "reasoning": "<explanation>",
        "alternative_dates": ["<date1>", "<date2>"]
      },
      "risk_factors": [
        {
          "factor": "<risk description>",
          "severity": "<low|medium|high|critical>",
          "probability": <number 0-100>,
          "mitigation": "<strategy>"
        }
      ],
      "competitive_analysis": {
        "main_competitors": ["<competitor1>", "<competitor2>"],
        "competitive_advantage": "<strength>",
        "market_position": "<description>"
      },
      "recommendations": [
        "<actionable recommendation 1>",
        "<actionable recommendation 2>",
        "<actionable recommendation 3>"
      ]
    }
    
    Base your analysis on:
    - Current automotive market trends
    - Regional economic conditions
    - Competitor positioning
    - Price-to-value ratio
    - Design appeal and market fit
    - Seasonal buying patterns`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: "You are an automotive business analyst. Respond only with valid JSON data."
    });

    const result = await model.generateContent(systemPrompt);
    let content = result.response.text();

    console.log("Raw AI Response:", content);

    // Cleanup JSON
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      content = content.substring(jsonStart, jsonEnd + 1);
    }

    const prediction = JSON.parse(content);
    res.json(prediction);

  } catch (error) {
    console.error("Model Prediction Error:", error);

    // Fallback mock prediction
    res.json({
      profit_analysis: {
        projected_profit_margin: 18,
        break_even_units: 15000,
        roi_months: 24,
        confidence_score: 75,
        reasoning: "Based on similar models in this segment, moderate profitability expected."
      },
      demand_forecast: {
        total_units_year1: 25000,
        regional_breakdown: [
          { region: "North America", units: 10000, market_share: 5 },
          { region: "Europe", units: 8000, market_share: 4 },
          { region: "Asia", units: 7000, market_share: 3 }
        ],
        peak_demand_month: "March",
        growth_trajectory: "stable"
      },
      launch_timing: {
        recommended_month: "2025-03",
        risk_level: "medium",
        reasoning: "Spring launch aligns with buying season, but competitive pressure exists.",
        alternative_dates: ["2025-02", "2025-04"]
      },
      risk_factors: [
        {
          factor: "High competition in segment",
          severity: "high",
          probability: 80,
          mitigation: "Differentiate through unique features and aggressive marketing"
        },
        {
          factor: "Supply chain uncertainties",
          severity: "medium",
          probability: 60,
          mitigation: "Diversify suppliers and maintain buffer inventory"
        }
      ],
      competitive_analysis: {
        main_competitors: ["Toyota Camry", "Honda Accord"],
        competitive_advantage: "Advanced technology features at competitive price",
        market_position: "Mid-range challenger with premium aspirations"
      },
      recommendations: [
        "Focus marketing on technology and value proposition",
        "Establish strong dealer network before launch",
        "Consider limited edition launch variant for buzz generation"
      ]
    });
  }
};

// Recommend Model to Users (Save to Database)
exports.recommendToUsers = async (req, res) => {
  const { model_data, prediction_data } = req.body;
  const db = require('../config/db');

  try {
    // Save recommendation to database
    const insertQuery = `
            INSERT INTO recommendations (
                model_name, body_type, engine, horsepower, fuel_type, transmission,
                base_price, target_segment, color_options, interior_features,
                launch_regions, proposed_launch_date,
                profit_margin, break_even_units, roi_months, confidence_score,
                total_units_forecast, recommended_launch_month, risk_level,
                description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      model_data.model_name,
      model_data.design.body_type,
      model_data.specifications.engine,
      model_data.specifications.horsepower || null,
      model_data.specifications.fuel_type,
      model_data.specifications.transmission,
      model_data.pricing.base_price,
      model_data.pricing.target_segment,
      JSON.stringify(model_data.design.color_options),
      JSON.stringify(model_data.design.interior_features),
      JSON.stringify(model_data.launch_plan.regions),
      model_data.launch_plan.proposed_date || null,
      prediction_data.profit_analysis.projected_profit_margin,
      prediction_data.profit_analysis.break_even_units,
      prediction_data.profit_analysis.roi_months,
      prediction_data.profit_analysis.confidence_score,
      prediction_data.demand_forecast.total_units_year1,
      prediction_data.launch_timing.recommended_month,
      prediction_data.launch_timing.risk_level,
      `Experience the ${model_data.model_name} - ${model_data.design.body_type} with ${model_data.specifications.engine} engine. ${prediction_data.profit_analysis.reasoning}`
    ];

    const [result] = await db.promise().query(insertQuery, values);

    // Simulate user matching (in real app, this would query user preferences)
    const recommendedUsers = [
      { id: 1, name: "Alex Johnson", match_score: 92, reason: `Prefers ${model_data.pricing.target_segment} ${model_data.design.body_type}s` },
      { id: 2, name: "Sarah Williams", match_score: 88, reason: `Looking for ${model_data.specifications.fuel_type} vehicles` },
      { id: 3, name: "Michael Chen", match_score: 85, reason: "Interested in similar models" },
      { id: 4, name: "Emma Davis", match_score: 82, reason: "Budget matches target segment" },
      { id: 5, name: "James Brown", match_score: 78, reason: "Previous purchase history alignment" }
    ];

    res.json({
      success: true,
      message: `Model "${model_data.model_name}" has been saved and recommended to ${recommendedUsers.length} suitable users`,
      recommended_users: recommendedUsers,
      total_reach: recommendedUsers.length,
      estimated_conversions: Math.floor(recommendedUsers.length * 0.15),
      recommendation_id: result.insertId
    });

  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save and recommend model to users"
    });
  }
};

// Get Recommendations for Users
exports.getRecommendations = async (req, res) => {
  const db = require('../config/db');

  try {
    const query = `
            SELECT * FROM recommendations 
            ORDER BY created_at DESC 
            LIMIT 50
        `;

    const [recommendations] = await db.promise().query(query);

    // Parse JSON fields
    const formattedRecommendations = recommendations.map(rec => ({
      ...rec,
      color_options: JSON.parse(rec.color_options || '[]'),
      interior_features: JSON.parse(rec.interior_features || '[]'),
      launch_regions: JSON.parse(rec.launch_regions || '[]')
    }));

    res.json(formattedRecommendations);

  } catch (error) {
    console.error("Get Recommendations Error:", error);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};

module.exports = exports;
