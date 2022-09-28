// Global Variables

const baseURL ='https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = ',&appid=430cb5193385a4049e6e8308a71eae59&units=metric';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const header = document.getElementById('header');
const body = document.body;

const zipInput = document.getElementById('zip__input');
const feelingsInput = document.getElementById('feelings__input');

const darkModeButton = document.getElementById('dark__mode__button');
const generateButton = document.getElementById('generate');

const resultSection = document.getElementById('result');
const errorSection = document.getElementById('error__holder');

// Main Functions

// fetches weather from API
async function getWeather(url = '') {
    const res = await fetch(url)
    try {
        const weather = await res.json();
        if (weather.cod != 200) {
            errorSection.style.display = 'flex';
            return
        } else {
            errorSection.style.display = 'none';
        return weather;
        }
    } catch(error) {
        console.log(error);
    }
};

// posts data to the server
async function postData(url = '', data = {}) {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
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

// updates the user interface using the object received from the server
async function updateUI() {
    const req = await fetch('/all')
    try {
        const data = await req.json()
        document.getElementById('date').innerHTML = data.date;
        document.getElementById('location').innerHTML = data.location;
        document.getElementById('temperature').innerHTML = Math.round(data.temperature) + '° C';
        document.getElementById('feelings__value').innerHTML = data.feelings;
    } catch(error) {
        console.log(error);
    }
};

// generates the weather using the values the user gave
function generate() {
    const zipCode = zipInput.value;
    const feelings = feelingsInput.value;
    const date = new Date
    const dateDisplay = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

    getWeather(baseURL + zipCode + apiKey).then((weather) => {
        let info = {
            date: dateDisplay,
            location: weather.name,
            temperature: weather.main.temp,
            feelings: feelings
        }
        postData('/addData', info);
    }).then(() => updateUI())
};

// toggles dark mode and changes button icon accordingly
function toggleDarkMode() {
    header.classList.toggle('dark__mode');
    body.classList.toggle('dark__mode');
    zipInput.classList.toggle('dark__mode')
    feelingsInput.classList.toggle('dark__mode')
    generateButton.classList.toggle('dark__mode');
    resultSection.classList.toggle('dark__mode');

    body.classList.contains('dark__mode') ? 
    darkModeButton.innerHTML = `<span class='material-symbols-outlined icon'> light_mode </span>` :
    darkModeButton.innerHTML = `<span class='material-symbols-outlined icon'> dark_mode </span>`
};

// Events

generateButton.addEventListener('click', generate);

darkModeButton.addEventListener('click', toggleDarkMode);
