<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


#Teslo API


1. Clonar proyecto
2. ```npm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos


```
docker-compose up -d
```


6. Levantar: ```npm run start:dev```


```
DB_PASSWORD=123456
DB_NAME=db_importadora
DB_HOST=217.76.61.88
DB_PORT=5562
DB_USERNAME=postgres

PORT=3000
HOST_API=http://localhost:3000/

JWT_SECRET=Est3EsMISE3Dsecreto32s
```