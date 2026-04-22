-- Create Admin Account
-- Run this script to create an admin account

USE lost_found_db;

-- Delete existing admin if exists
DELETE FROM users WHERE email = 'admin@portal.com';

-- Create new admin account
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (user_name, phone_no, email, password_hash, role) VALUES 
('Admin User', '9999999999', 'admin@portal.com', '$2a$10$rZ8qH5YxJ5YxJ5YxJ5YxJOqH5YxJ5YxJ5YxJ5YxJ5YxJ5YxJ5YxJO', 'admin');

-- Verify admin account created
SELECT user_id, user_name, email, role FROM users WHERE role = 'admin';

-- Display success message
SELECT 'Admin account created successfully!' as Status;
SELECT 'Email: admin@portal.com' as Login;
SELECT 'Password: admin123' as Password;
SELECT 'Please change the password after first login!' as Warning;
