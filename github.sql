use github;
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email_id VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    type ENUM('free', 'pro') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE OTP (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email_id VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE),
    is_active BOOLEAN NOT NULL DEFAULT 1
);

INSERT INTO Users (email_id, password, user_name, type)
VALUES 
    ('user1@example.com', 'password1', 'User One', 'free'),
    ('user2@example.com', 'password2', 'User Two', 'pro'),
    ('user3@example.com', 'password3', 'User Three', 'free'),
    ('user4@example.com', 'password4', 'User Four', 'pro'),
    ('user5@example.com', 'password5', 'User Five', 'free'),
    ('user6@example.com', 'password6', 'User Six', 'pro'),
    ('user7@example.com', 'password7', 'User Seven', 'free'),
    ('user8@example.com', 'password8', 'User Eight', 'pro'),
    ('user9@example.com', 'password9', 'User Nine', 'free'),
    ('user10@example.com', 'password10', 'User Ten', 'pro');



