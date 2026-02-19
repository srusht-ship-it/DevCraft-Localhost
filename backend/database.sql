-- Create Database
CREATE DATABASE civicsense;

-- Connect to civicsense database and run below commands

-- Complaints Table
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    citizen_name VARCHAR(255),
    citizen_phone VARCHAR(20),
    complaint_text TEXT NOT NULL,
    category VARCHAR(50),
    priority VARCHAR(20),
    sentiment_score FLOAT,
    urgency_keywords TEXT[],
    status VARCHAR(50) DEFAULT 'pending',
    department VARCHAR(100),
    location VARCHAR(255),
    image_url TEXT,
    audio_url TEXT,
    language VARCHAR(10) DEFAULT 'en',
    duplicate_group_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20)
);

-- Insert sample departments
INSERT INTO departments (name, category, email, phone) VALUES
('Sanitation Department', 'Sanitation', 'sanitation@civic.gov', '1234567890'),
('Public Works Department', 'Infrastructure', 'pwd@civic.gov', '1234567891'),
('Police Department', 'Safety', 'police@civic.gov', '1234567892');

-- Hotspots Analytics Table
CREATE TABLE hotspots (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255),
    category VARCHAR(50),
    complaint_count INTEGER DEFAULT 1,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(location, category)
);

-- Indexes for better performance
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_location ON complaints(location);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
