const db = require('../config/db');

// Get all cars (with filters)
exports.getAllCars = async (req, res) => {
    try {
        let query = 'SELECT cars.*, manufacturers.company_name FROM cars JOIN manufacturers ON cars.manufacturer_id = manufacturers.id WHERE 1=1';
        const params = [];

        if (req.query.type) {
            query += ' AND cars.type = ?';
            params.push(req.query.type);
        }
        if (req.query.minPrice) {
            query += ' AND cars.price >= ?';
            params.push(req.query.minPrice);
        }
        if (req.query.maxPrice) {
            query += ' AND cars.price <= ?';
            params.push(req.query.maxPrice);
        }

        const [cars] = await db.query(query, params);
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new car (Manufacturer only)
exports.createCar = async (req, res) => {
    // Expect manufacturer_id from auth middleware or body
    const { manufacturer_id, model_name, type, price, launch_year, image_url, specs } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO cars (manufacturer_id, model_name, type, price, launch_year, image_url, specs) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [manufacturer_id, model_name, type, price, launch_year, image_url, JSON.stringify(specs)]
        );
        res.status(201).json({ id: result.insertId, message: 'Car created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single car details
exports.getCarById = async (req, res) => {
    try {
        const [cars] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (cars.length === 0) return res.status(404).json({ message: 'Car not found' });
        res.json(cars[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
