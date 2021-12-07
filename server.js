projectData = {};

const express = require("express");
const app = express();

app.use(express.static("website"));

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const port = 8000;
const server = app.listen(port, listening);

function listening() {
    console.log(`Running on localhost: ${port}`)
};

// GET route.
app.get("/all", getData);

function getData(req, res) {
    res.send(projectData);
};


// POST route.
app.post("/addData", addData);

function addData(req, res) {
    projectData = {
        date: req.body.date,
        location: req.body.location,
        temperature: req.body.temperature,
        feelings: req.body.feelings
    }
    res.send(projectData);
};