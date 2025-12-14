const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, '../models/schema.sql');

const setupDatabase = async () => {
    console.log('🔄 Initializing Database Setup...');

    // Create connection WITHOUT database selected
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    try {
        const dbName = process.env.DB_NAME || 'automotive_ai_db';

        // Create DB
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' checked/created.`);

        // Use DB
        await connection.changeUser({ database: dbName });

        // Read and Run Schema
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Handle stored procedures/delimiters if any, but simple split by ; is fine for now
        const queries = schema
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`🔄 Running ${queries.length} migration queries...`);

        for (const query of queries) {
            await connection.query(query);
        }

        console.log('✅ Tables created successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during setup:', error);
        process.exit(1);
    } finally {
        await connection.end();
    }
};

setupDatabase();
