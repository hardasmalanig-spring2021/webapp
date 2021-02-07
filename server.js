const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
}


//set port, listen for requests
const PORT = process.env.PORT || 8080;

app.use(cors(corsOptions));

//parse requests of content-type - application/json
app.use(bodyParser.json());

//parse requests of content-type - application/urlencoder
app.use(bodyParser.urlencoded({extended:true}));


//simple route
app.get("/",(req,res) => {
    res.json({ message:"Welcome to gunjan's webapp - CSYE 6225 Assignment 1"})
} )

app.listen(PORT, () => {
    console.log("server is running on port", PORT)
})
