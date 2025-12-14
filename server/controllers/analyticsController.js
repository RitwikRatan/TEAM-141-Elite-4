const db = require('../config/db');

// Get Profit/Loss Historical Data
exports.getHistoricalData = async (req, res) => {
    // Ideally filter by manufacturer_id from auth token
    try {
        const [data] = await db.query(
            `SELECT hd.*, c.model_name 
             FROM historical_data hd 
             JOIN cars c ON hd.car_id = c.id 
             ORDER BY hd.year ASC`
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Predict New Model Success (Mock AI)
exports.predictModelSuccess = async (req, res) => {
    const { specs, type, launch_region, price } = req.body;

    // SIMULATED AI LOGIC
    // In a real app, this would call a Python ML service or use a loaded TensorFlow.js model

    // Profit Logic: Higher price + specific types in specific regions = higher profit
    let baseScore = 50;
    if (type === 'SUV' && launch_region === 'North America') baseScore += 20;
    if (type === 'Sedan' && launch_region === 'Asia') baseScore += 15;
    if (specs?.fuel === 'Electric') baseScore += 25; // Trend bonus

    // Price elasticity simulation
    const estimatedProfit = (price * 0.15) * (baseScore / 50);
    const isLoss = baseScore < 40;

    const prediction = {
        predicted_profit: isLoss ? 0 : estimatedProfit,
        loss_risk_percent: isLoss ? 70 : 100 - baseScore,
        demand_score: baseScore,
        recommendation: baseScore > 75
            ? 'High Demand Expected! Safe to Launch.'
            : 'Moderate Risk. Consider lowering price or adding EV features.'
    };

    // Save prediction for history (optional)
    // await db.query('INSERT INTO predictions ...', [...])

    setTimeout(() => {
        res.json(prediction);
    }, 1500); // Simulate processing delay
};
