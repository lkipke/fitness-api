CREATE DATABASE fitness;
CREATE USER 'fitness_writer'@'localhost' IDENTIFIED BY 'rqcPGraiZgkUE4oXCBwJRPMY*c7ZjC';
GRANT ALL ON fitness.* to 'fitness_writer'@'208.117.84.50' IDENTIFIED BY 'password' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON fitness.* TO 'fitness_writer'@'192.168.0.%' IDENTIFIED BY 'rqcPGraiZgkUE4oXCBwJRPMY*c7ZjC' WITH GRANT OPTION;
