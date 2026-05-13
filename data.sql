USE tunering;

INSERT INTO spillere (navn) VALUES 
('Lucas Jensen'), ('Emma Nielsen'), ('Noah Hansen'), ('Alma Pedersen'), ('Victor Andersen'),
('Freja Christensen'), ('Oscar Larsen'), ('Clara Sørensen'), ('William Rasmussen'), ('Sofia Jørgensen'),
('Liam Petersen'), ('Ella Madsen'), ('Elias Kristensen'), ('Mia Olsen'), ('Oliver Thomsen'),
('Anna Christiansen'), ('Magnus Poulsen'), ('Saga Johansen'), ('Hugo Knudsen'), ('Alberte Mortensen'),
('Marius Møller'), ('Lea Jakobsen'), ('Johan Lund'), ('Nora Schmidt'), ('Aksel Eriksen'),
('Ellie Holm'), ('Valdemar Simonsen'), ('Luna Clausen'), ('Karl Svendsen'), ('Mille Jensen'),
('Otto Lauridsen'), ('Frida Jespersen'), ('August Vestergaard'), ('Rosa Iversen'), ('Malthe Bech'),
('Siv Gregersen'), ('Alfred Jeppesen'), ('Tilde Juhl'), ('Ludvig Lassen'), ('Esther Munck'),
('Sander Nørgaard'), ('Lykke Overgaard'), ('Bastian Schou'), ('Merle Winther'), ('Felix Bang'),
('Sigrid Friis'), ('Storm Krogh'), ('Asta Dam'), ('Pelle Bertelsen'), ('Dagmar Lind');

-- Procedure til 100 kampe
DELIMITER //
CREATE PROCEDURE GenerateMockData()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE s1 INT;
    DECLARE s2 INT;
    WHILE i < 100 DO
        SET s1 = (SELECT id FROM spillere ORDER BY RAND() LIMIT 1);
        SET s2 = (SELECT id FROM spillere WHERE id <> s1 ORDER BY RAND() LIMIT 1);
        INSERT INTO kampe (spiller1, spiller2, score1, score2) 
        VALUES (s1, s2, FLOOR(RAND() * 21), FLOOR(RAND() * 21));
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL GenerateMockData();
DROP PROCEDURE GenerateMockData;
