const baseURL ="https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = ",&appid=430cb5193385a4049e6e8308a71eae59&units=metric";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// function that gets data from API.
async function getWeather(url = "") {
    const res = await fetch(url)
    try {
        const weather = await res.json();
        const error = document.getElementById("error-holder");
        if (weather.cod != 200) {
            error.style.display = "flex";
            return
        } else {
            error.style.display = "none";
        return weather;
        }
    } catch(error) {
        console.log(error);
    }
};


// function that posts data to a url.
async function postData(url = "", data = {}) {
    const res = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    try {
        const newData = await res.json();
        return newData;
    } catch(error) {
        console.log(error);
    }
};


// function that updates the user interface using the object received from the server.
async function updateUI() {
    const req = await fetch("/all")
    try {
        const data = await req.json()
        document.getElementById("date").innerHTML = data.date;
        document.getElementById("location").innerHTML = data.location;
        document.getElementById("temperature").innerHTML = Math.round(data.temperature) + "° C";
        document.getElementById("feelings-value").innerHTML = data.feelings;
        
    } catch(error) {
        console.log(error);
    }
};


// function that generates the weather using the values the user gave.
function generate() {
    const zipCode = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;
    const d = new Date
    const newDate = days[d.getDay()] + ", " + months[d.getMonth()] + ", " + d.getFullYear()

    getWeather(baseURL + zipCode + apiKey).then(function(weather) {
        let info = {
            date: newDate,
            location: weather.name,
            temperature: weather.main.temp,
            feelings: feelings
        }
        postData("/addData", info);
    }).then(() => updateUI())
};
document.getElementById("generate").addEventListener("click", generate);