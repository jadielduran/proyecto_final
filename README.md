# Proyecto Final
proyecto final del modulo 3 para el diplomado fullstack Universidad Simon I. Patiño

Guia de intrucciones para el levantamiento del rest api

Docker Postgres:

    - docker run --name some-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin123 -e POSTGRES_DB=proyectofinal -p 5432:5432 -d postgres
    
    - exec -it some-postgres bash
    
    - sql -U admin --password
    
    - ingresar el password(admin123)
    
    - CREATE TABLE usuarios (
                              id serial PRIMARY KEY,
                              nombres VARCHAR (100),
                              apellido_paterno VARCHAR (60),
                          	  apellido_materno VARCHAR (60),
                              fecha_nacimiento date,
                              direccion VARCHAR (100),
                          	  celular int,
                          	  estado char(1)
                            );

esto seria lo necesario para levantar el api rest

