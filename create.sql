CREATE DATABASE IF NOT EXISTS tunering;
USE tunering;

CREATE TABLE spillere (
    id INT AUTO_INCREMENT PRIMARY KEY,
    navn VARCHAR(255) NOT NULL
);

CREATE TABLE kampe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spiller1 INT,
    spiller2 INT,
    score1 INT,
    score2 INT,
    
    CONSTRAINT fk_sp1
        FOREIGN KEY (spiller1)
        REFERENCES spillere(id),
    
    CONSTRAINT fk_sp2
        FOREIGN KEY (spiller2)
        REFERENCES spillere(id)
);
