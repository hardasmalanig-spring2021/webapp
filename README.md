# CSYE 6225 - Fall 2021
## WebApp

Web application using Technology stack that meets Cloud Native Web Application Requirements. 
This webapp shows implementation of Restful API to create, get and update user information.

## Requirements
 - For development, you will need Node.js [official Node.js website](https://nodejs.org/) and a node global package
 - A code editor - suggested : Visual Studio code
 - Git Version Control 
 - MySql Installed in your OS
 - To run the unit test node version > 10 required
      

## Technologies Used
1. Node.js
2. Express.js
3. MySQL
4. ORM : Sequelize
5. Testing - Mocha, Chai, supertest
6. User authentication - Basic Auth


## Build the project
1. Clone the git repository git@github.com:GunjanHardasmalani/webapp.git 
2. Go to  webapp folder of the project using the command below

        $ cd webapp
3. Install node packages - express sequelize mysql2 body-parser cors bcryptjs

        $ npm install express sequelize mysql2 body-parser cors  bcryptjs --save

## Start the application
1. Once the application build step is completed run the following command to start webapp

        $ npm start

2. You can confirm whetherthe app is running by going to a browser and go to localhost:8080

## Application Endpoints

1. Create new user (POST Request) - Enter the user model in request field
        
        http://localhost:8080/v1/user 

2. Get user details (GET Request) - This is using BasicAuth Authorization- Enter valid username and password
        
        http://localhost:8080/v1/user/self

3. Update user informations (PUT Request) - This is using BasicAuth Authorization- Enter valid username and password
        
        http://localhost:8080/v1/user 

4. Only an authorized user can create a book (POST request), ISBN for the book should be Unique

        http://localhost:8080/books

5. Any user can request book with book id (GET Request)

        http://localhost:8080/books/:id

6. Any user can get all books available (GET Request)

        http://localhost:8080/books

6. Only an authorized user can delete a book (DELETE request) with bood id

        http://localhost:8080/books/:id
 
## Run Unit Test

A test case to check the post request is implemented

        npm run test


## Refernces

- [https://medium.com/@tariqul.islam.rony/simple-rest-api-builing-with-mysql-and-express-js-and-testing-with-mocha-and-chai-ed0d19f25f79](https://medium.com/@tariqul.islam.rony/simple-rest-api-builing-with-mysql-and-express-js-and-testing-with-mocha-and-chai-ed0d19f25f79)

- [https://softwareontheroad.com/ideal-nodejs-project-structure/](https://softwareontheroad.com/ideal-nodejs-project-structure/)

- [https://blog.jscrambler.com/testing-apis-mocha-2/](https://blog.jscrambler.com/testing-apis-mocha-2/)

- [https://sequelize.org/](https://sequelize.org/)

- [https://stackoverflow.com/questions/35413746/regex-to-match-date-like-month-name-day-comma-and-year/35413952](https://stackoverflow.com/questions/35413746/regex-to-match-date-like-month-name-day-comma-and-year/35413952)

- [https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s04.html](https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s04.html)