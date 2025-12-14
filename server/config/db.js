const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Allow empty string if not set
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1');
        console.log('✅ Connected to MySQL database');
    } catch (err) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('⚠️  Database not found, attempting to create...');
            await createDatabase();
        } else {
            console.error('❌ Database connection error:', err.message);
        }
    }
};

const createDatabase = async () => {
    const rawConnection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    try {
        await rawConnection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`✅ Database ${process.env.DB_NAME} created.`);
        // Re-connect with pool? No need, pool handles it on next query usually, but better to ensure everything is fine.
    } catch (e) {
        console.error("Failed to create database:", e);
    } finally {
        rawConnection.end();
    }
}

testConnection();

module.exports = promisePool;
