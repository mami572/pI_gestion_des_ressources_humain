const bcryptjs = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // Hash the password
        const passwordHash = await bcryptjs.hash('password', 10);

        // Check if user already exists
        const [existing] = await connection.execute(
            'SELECT id FROM User WHERE email = ?',
            ['admin@example.com']
        );

        if (existing.length > 0) {
            console.log('✅ Test user already exists: admin@example.com');
            console.log('📧 Email: admin@example.com');
            console.log('🔑 Password: password');
            return;
        }

        // Insert test user
        const [result] = await connection.execute(
            'INSERT INTO User (email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            ['admin@example.com', passwordHash, 'admin']
        );

        console.log('✅ Test user created successfully!');
        console.log('📧 Email: admin@example.com');
        console.log('🔑 Password: password');
        console.log('👤 Role: admin');
    } catch (error) {
        console.error('❌ Error creating test user:', error.message);
    } finally {
        await connection.end();
    }
}

createTestUser();
