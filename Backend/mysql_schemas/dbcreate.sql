CREATE TABLE tasks (
	`id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('pending', 'in_progress', 'completed') NOT NULL,
    `deadline` DateTime NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);