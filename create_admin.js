const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
  console.log('🔧 Creating Admin Account...\n');
  
  try {
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('✅ Connected to database');
    
    // Hash password
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed');
    
    // Delete existing admin if exists
    await connection.query('DELETE FROM users WHERE email = ?', ['admin@portal.com']);
    console.log('✅ Removed existing admin account (if any)');
    
    // Create admin account
    const [result] = await connection.query(
      'INSERT INTO users (user_name, phone_no, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin User', '9999999999', 'admin@portal.com', hash, 'admin']
    );
    
    console.log('✅ Admin account created successfully!\n');
    
    // Display credentials
    console.log('═══════════════════════════════════════');
    console.log('🛡️  ADMIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('Email:    admin@portal.com');
    console.log('Password: admin123');
    console.log('Role:     admin');
    console.log('═══════════════════════════════════════\n');
    
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');
    
    // Verify
    const [users] = await connection.query('SELECT user_id, user_name, email, role FROM users WHERE role = ?', ['admin']);
    console.log('📊 Admin users in database:', users.length);
    
    await connection.end();
    console.log('\n✅ Done!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
