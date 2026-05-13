CREATE USER 'tuneringskonto'@'localhost' IDENTIFIED BY 'AdminTest123!';
GRANT ALL PRIVILEGES ON tunering.* TO 'tuneringskonto'@'localhost';
FLUSH PRIVILEGES;
