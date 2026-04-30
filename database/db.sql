DROP SCHEMA IF EXISTS payment_tracker;

CREATE SCHEMA payment_tracker;
USE payment_tracker;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    payment_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    renew_date DATE NOT NULL,
    renew_type ENUM('yearly', 'monthly', 'fixed') NOT NULL,
    frequency INT DEFAULT NULL,
    total_paid DECIMAL(10, 2) DEFAULT 0.00,

    CONSTRAINT fk_pmnt_owner_id
        FOREIGN KEY (owner_id)
        REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE user;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO user (email, password, admin) VALUES
    ("email@email.com", "$2y$10$yg83ajqxh5Pqh1JnYbSVKenK55c8Wi3JIvGICNRkZD9AdEfaeMQSS", TRUE);
