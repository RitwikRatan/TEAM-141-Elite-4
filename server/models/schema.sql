CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'manufacturer') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manufacturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manufacturer_id INT,
    model_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- SUV, Sedan, etc.
    price DECIMAL(10, 2) NOT NULL,
    launch_year INT,
    image_url TEXT,
    specs JSON, -- Store flexible specs like engine, fuel, color
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS historical_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT,
    year INT NOT NULL,
    sold_units INT DEFAULT 0,
    profit DECIMAL(15, 2) DEFAULT 0,
    loss DECIMAL(15, 2) DEFAULT 0,
    region VARCHAR(100),
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(255),
    input_params JSON,
    predicted_profit DECIMAL(15, 2),
    predicted_demand_score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mock Data for Cars is usually needed for User Dashboard 'Browse'
-- We can seed some if needed later.
