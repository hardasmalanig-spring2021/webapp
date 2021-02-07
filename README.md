# CSYE 6225 - Fall 2021
## WebApp

## Requirements
 - For development, you will need Node.js and a node global package
 - A code editor - suggested : Visual Studio code
 - Git Version Control 
 - MySql Installed in your OS

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.
    
      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Check if installation is successful

      $ node --version
        v8.11.3

      $ npm --version
        6.1.0

- #### Update npm
      $ npm install npm -
      
## Technologies Used
1. Node.js
2. Express.js
3. MySQL
4. ORM : Sequelize


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
