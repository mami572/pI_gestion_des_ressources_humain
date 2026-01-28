const bcryptjs = require('bcryptjs');//:import bcryptjs
const mysql = require('mysql2/promise');//:import mysql
require('dotenv').config({ path: '.env' });//:import dotenv

async function createTestUser() {//:createTestUser
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'Grh_db',
    });
 //crees en comptes if you dont have one 
    

    try {
        // Hash the password
        const passwordHash = await bcryptjs.hash('password', 10);

        // Check if user already exists
        const [existing] = await connection.execute(
            'SELECT id FROM User WHERE email = ?',
            ['admin@example.com']
        );

        if (existing.length > 0) {
            console.log('✅ Test user already exists: admin@example.com');//:existing
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
        console.log('User ID:', result.insertId);//:result
        console.log('User created at:', result.created_at);//:result
        console.log('User updated at:', result.updated_at);//:result    

    } catch (error) {//:error
        console.error('❌ Error creating test user:', error.message);
    } finally {
        await connection.end();
    }
}

createTestUser();
