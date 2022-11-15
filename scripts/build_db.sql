/*
Develop by Leonardo de Andrade
October 20, 2022
PHP
Assignment 4 – CRUD App with PHP and JavaScript
*/

DROP DATABASE IF EXISTS videogames;
CREATE DATABASE IF NOT EXISTS videogames; 
USE videogames;

SELECT 'CREATING DATABASE STRUCTURE' as 'INFO';

DROP TABLE IF EXISTS	manufacturers,
						platforms,
                        types,
                        publishers,
                        titles,
                        platf_titles;

CREATE TABLE manufacturers (
    manuf_no		INT             NOT NULL,
    manuf_name  	VARCHAR(14)     NOT NULL,
    foundation_date	DATE			NULL,
    founder  		VARCHAR(50)     NULL,
    PRIMARY KEY (manuf_no)
);

CREATE TABLE platforms (
    platf_no		INT             NOT NULL,
    manuf_no		INT             NOT NULL,
    platf_name  	VARCHAR(50)     NOT NULL,
    release_date	DATE            NOT NULL,
    discontinued	BOOLEAN			NOT NULL,
    FOREIGN KEY (manuf_no)  REFERENCES manufacturers (manuf_no)    ON DELETE CASCADE,
    PRIMARY KEY (platf_no)
);

CREATE TABLE types (
    type_no			INT             NOT NULL,
    type_name  		VARCHAR(14)     NOT NULL,
    PRIMARY KEY (type_no)
);

CREATE TABLE publishers (
    publi_no		INT             NOT NULL,
    publi_name  	VARCHAR(50)     NOT NULL,
    PRIMARY KEY (publi_no)
);

CREATE TABLE titles (
    title_no		INT             NOT NULL,
    type_no			INT             NOT NULL,
    publi_no		INT             NOT NULL,
    title_name  	VARCHAR(70)     NOT NULL,
    release_date	DATE            NOT NULL,
    exclusive		BOOLEAN         NOT NULL,
    FOREIGN KEY (type_no)  REFERENCES types (type_no)	ON DELETE CASCADE,
    FOREIGN KEY (publi_no)  REFERENCES publishers (publi_no)	ON DELETE CASCADE,
    PRIMARY KEY (title_no)
);

CREATE TABLE titles_platf (
	titleplatf_no	INT				NOT NULL,
    title_no		INT             NOT NULL,
    platf_no		INT             NOT NULL,
    FOREIGN KEY (title_no) REFERENCES titles (title_no)	ON DELETE CASCADE,
    FOREIGN KEY (platf_no)  REFERENCES platforms (platf_no)	ON DELETE CASCADE,
    PRIMARY KEY (titleplatf_no, title_no, platf_no)
);

CREATE TABLE libraries (
    -- lib_no			INT             NOT NULL,
    lib_no			INT             NOT NULL AUTO_INCREMENT,
    lib_name  		VARCHAR(70)     NOT NULL,
    owner_name  	VARCHAR(70)     NOT NULL,
    creation_date	DATETIME        NOT NULL,
    update_date		DATETIME        NULL,
    PRIMARY KEY (lib_no)
);

ALTER TABLE libraries AUTO_INCREMENT = 70001;

CREATE TABLE lib_titles (
    lib_no			INT             NOT NULL,
    titleplatf_no	INT				NOT NULL,
    FOREIGN KEY (lib_no) REFERENCES libraries (lib_no)	ON DELETE CASCADE,
    FOREIGN KEY (titleplatf_no) REFERENCES titles_platf (titleplatf_no)	ON DELETE CASCADE,
    PRIMARY KEY (lib_no, titleplatf_no)
);


INSERT INTO `manufacturers` VALUES
(10001,'Nintendo','1889-09-23','Fusajiro Yamauchi'),
(10002,'Sony','1946-05-07','Masaru Ibuka'),
(10003,'Microsoft','1975-04-04','Bill Gates'),
(10004,'Sega','1960-06-03','Martin Bromley'),
(10005,'Mobile',null,null),
(10006,'PC',null,null);

INSERT INTO `platforms` VALUES
(20001,10001,'Switch','2017-03-03',false),
(20002,10001,'Wii U','2017-03-03',true),
(20003,10001,'Wii','2017-03-03',true),
(20004,10001,'Game Cube','2017-03-03',true),
(20005,10001,'Nintendo 64','2017-03-03',true),
(20006,10001,'Super NES','2017-03-03',true),
(20007,10001,'NES','2017-03-03',true),
(20101,10002,'Playstation 5','2020-11-12',false),
(20102,10002,'Playstation 4','2013-11-15',false),
(20103,10002,'Playstation 3','2006-11-17',true),
(20104,10002,'Playstation 2','2000-03-04',true),
(20105,10002,'Playstation 1','1994-12-03',true),
(20201,10003,'Xbox Series S','2005-11-22',false),
(20202,10003,'Xbox One','2013-11-22',false),
(20203,10003,'Xbox 360','2020-11-10',false),
(20301,10004,'Dreamcast','2020-03-03',true),
(20302,10004,'Sega Saturn','2020-03-03',true),
(20303,10004,'Mega Drive','2020-03-03',true),
(20401,10005,'iOS','2020-03-03',false),
(20402,10005,'Android','2020-03-03',false),
(20501,10006,'Windows','2020-03-03',false),
(20502,10006,'macOS','2020-03-03',false);

INSERT INTO `types` VALUES
(30001,'Action'),
(30002,'Adventure'),
(30003,'Fighting'),
(30004,'Sport'),
(30005,'Strategy'),
(30006,'RPG'),
(30007,'Shooter');

INSERT INTO `publishers` VALUES
(40001,'Nintendo'),
(40002,'Sega'),
(40003,'Sony'),
(40004,'Xbox Game Studios'),
(40005,'Innersloth'),
(40006,'Nintendo'),
(40007,'Niantic'),
(40008,'Halfbrick'),
(40009,'GT Interactive'),
(40010,'Konami'),
(40011,'Capcom'),
(40012,'Ubisoft');

INSERT INTO `titles` VALUES
(50001,30001,40001,'The Legend of Zelda: Breath of the Wild','2017-01-01',true),
(50002,30002,40002,'Sonic the Hedgehog 2','1991-01-01',false),
(50003,30002,40001,'Metroid Prime','2022-11-18',true),
(50004,30002,40002,'Disney\'s Alladin','1993-11-11',false),
(50005,30001,40003,'Ghost of Tsushima','2021-08-20',true),
(50006,30001,40004,'Gears of War','2006-11-07',true),
(50007,30005,40005,'Among Us!','2018-06-15',false),
(50008,30004,40006,'Super Mario Run','2016-12-15',true),
(50009,30004,40007,'Pokemon GO','2016-07-06',false),
(50010,30002,40008,'Jetpack Joyride','2011-09-01',true),
(50011,30002,40008,'Oddworld: Abe’s Oddysee','1997-09-18',true),
(50012,30002,40008,'Final Fantasy 7','1997-01-31',true),
(50013,30003,40002,'Kimetsu no Yaiba - The Hinokami Chronicles','2022-06-09',false),
(50014,30001,40010,'Metal Gear Solid','1998-09-03',false),
(50015,30001,40011,'Resident Evil 2','1998-01-21',false),
(50016,30001,40010,'Metal Gear Solid 3: Snake Eater','2004-11-17',true),
(50017,30001,40003,'God of War 3','1997-01-31',true),
(50018,30003,40011,'Marvel vs Capcom 2','2000-03-30',false),
(50019,30007,40001,'Goldeneye 007','1997-08-23',true),
(50020,30007,40012,'Red Steel','2006-11-19',true),
(50021,30002,40010,'The Adventures of Batman & Robin','1994-12-01',false);

INSERT INTO `titles_platf` VALUES
(60001,50001,20001),
(60002,50001,20002),
(60003,50002,20303),
(60004,50002,20001),
(60005,50003,20004),
(60006,50004,20001),
(60007,50004,20303),
(60008,50005,20101),
(60009,50006,20203),
(60010,50007,20401),
(60011,50008,20401),
(60012,50009,20401),
(60013,50010,20401),
(60014,50011,20501),
(60015,50012,20105),
(60016,50013,20001),
(60017,50014,20105),
(60018,50015,20105),
(60019,50016,20104),
(60020,50017,20103),
(60021,50018,20301),
(60022,50019,20005),
(60023,50020,20003),
(60024,50021,20006);

INSERT INTO `libraries` (lib_name, owner_name, creation_date) VALUES
('My current game library','Old Leo',NOW()),
('My childhood game library','Yong Leo',NOW()),
('All games library','Leonardo',NOW());

INSERT INTO `lib_titles` VALUES
(70001,60001),
(70001,60005),
(70001,60015),
(70001,60018),
(70001,60011),
(70002,60023),
(70002,60022),
(70002,60021),
(70002,60020),
(70002,60024),
(70002,60007),
(70002,60003),
(70002,60019),
(70002,60017),
(70002,60009),
(70002,60014),
(70002,60013),
(70003,60001),
(70003,60002),
(70003,60003),
(70003,60004),
(70003,60005),
(70003,60006),
(70003,60007),
(70003,60008),
(70003,60009),
(70003,60010),
(70003,60011),
(70003,60012),
(70003,60013),
(70003,60014),
(70003,60015),
(70003,60016),
(70003,60017),
(70003,60018),
(70003,60019),
(70003,60020),
(70003,60021),
(70003,60022),
(70003,60023),
(70003,60024);