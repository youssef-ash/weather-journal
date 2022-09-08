const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

projectData = {};

const app = express();

app.use(express.static("src/website"));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

const port = 3000;

const listening = () => console.log(`Running on localhost: ${port}`);

app.listen(port, listening);