-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manufacturer_id INT,
    model_name VARCHAR(255) NOT NULL,
    body_type VARCHAR(100),
    engine VARCHAR(255),
    horsepower INT,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    base_price DECIMAL(12, 2),
    target_segment VARCHAR(100),
    color_options TEXT,
    interior_features TEXT,
    launch_regions TEXT,
    proposed_launch_date DATE,
    
    -- AI Prediction Data
    profit_margin DECIMAL(5, 2),
    break_even_units INT,
    roi_months INT,
    confidence_score INT,
    total_units_forecast INT,
    recommended_launch_month VARCHAR(20),
    risk_level VARCHAR(20),
    
    image_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (manufacturer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_recommendations_created ON recommendations(created_at DESC);
CREATE INDEX idx_recommendations_segment ON recommendations(target_segment);
CREATE INDEX idx_recommendations_price ON recommendations(base_price);
