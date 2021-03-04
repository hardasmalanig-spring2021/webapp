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
app.use(bodyParser.urlencoded({ extended: true }));

const database = require("./loaders/db.loader");

// //Force:true if you want the data to clear everytime server is started
database.sequelize.sync();

app.listen(PORT, () => {
    console.log("server is running on port", PORT)
})

//routes
require("./api/public.api")(app);
require("./api/book.api")(app);
require("./api/file.api")(app);


module.exports = app;