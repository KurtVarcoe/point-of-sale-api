
# Setup

## DB

Set up mySQL to run on localhost port 3306

Make sure mySQL is running

Create 2 databases, 1 for running the server, 1 for tests

Grant your user all privileges on these two dbs

## Environment variables

Change the .env.template file to .env and add all variables

Make sure the DB variables are the same as on mySQL

The JWT_SECRET can be any string

The port number of the server defaults to 3000 if left blank, if
you run into an issue starting the server, try changing the port

## Node and NPM

Make sure node is version 20

Run npm install

Run npm test for testing

Run npm start to start the server

## Postman

Import the collection into Postman

Create one environment variable in postman called url and set it equal to localhost:3000

If you change the port in .env, make sure to match it in postman

The authentication tokens will be handled automatically by scripts I wrote in the
test section on postman for the /user/create and /user/login requests
