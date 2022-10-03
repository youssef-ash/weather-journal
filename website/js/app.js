/* Global Variables */

const baseURL ='https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = ',&appid=430cb5193385a4049e6e8308a71eae59&units=metric';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const prefersDark = localStorage.getItem('darkMode');

const html = document.documentElement;

const zipInput = document.getElementById('zip__input');
const feelingsInput = document.getElementById('feelings__input');

const darkModeButton = document.getElementById('dark__mode__button');
const generateButton = document.getElementById('generate');

const errorSection = document.getElementById('error');

const dateResult = document.getElementById('date');
const locationResult = document.getElementById('location');
const temperatureResult = document.getElementById('temperature');
const feelingsResult = document.getElementById('feelings');
/* Main Functions */

// fetches weather from API
async function getWeather(url = '') {
    errorSection.innerHTML = null
    try {
        const res = await fetch(url);
        const weatherData = await res.json();
        if (res.ok) {
            errorSection.innerHTML = null;
            return weatherData;
        } else {
            throw new Error(weatherData.message);
        }
    } catch(error) {
        setTimeout(() => {
            errorSection.innerHTML = error;
        }, 300);
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
    });
    try {
        const newData = await res.json();
        return newData;
    } catch(error) {
        console.log(error);
    }
};

// updates the user interface using the object received from the server
async function updateUI() {
    try {
        const req = await fetch('/all');
        const data = await req.json()
        dateResult.innerHTML = data.date;
        locationResult.innerHTML = data.location;
        temperatureResult.innerHTML = Math.round(data.temperature) + '° C';
        feelingsResult.innerHTML = data.feelings;
    } catch(error) {
        console.log(error);
    }
};

// resets UI 
function resetUI() {
    dateResult.innerHTML = null;
    locationResult.innerHTML = null;
    temperatureResult.innerHTML = null;
    feelingsResult.innerHTML = null;
};

// generates the weather using the values the user gave
function generate() {
    resetUI();
    const zipCode = zipInput.value;
    const feelings = feelingsInput.value;
    const date = new Date;
    const dateDisplay = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    getWeather(baseURL + zipCode + apiKey).then((weather) => {
        let info = {
            date: dateDisplay,
            location: weather.name,
            temperature: weather.main.temp,
            feelings: feelings
        }
        postData('/addData', info);
    }).then(() => {
        setTimeout(() => {
            updateUI();
        }, 350);
    });
};

// applies dark mode
function enableDarkMode() {
    localStorage.setItem('darkMode', 'enabled');
    html.classList.add('dark__mode');
    darkModeButton.innerHTML = `<span class='material-symbols-outlined icon'> light_mode </span>`;
};

// removes dark mode
function disableDarkMode() {
    localStorage.setItem('darkMode', 'disabled');
    html.classList.remove('dark__mode');
    darkModeButton.innerHTML = `<span class='material-symbols-outlined icon'> dark_mode </span>`;
};

// sets page theme
function toggleTheme() {
    html.classList.contains('dark__mode') ? 
    disableDarkMode() : 
    enableDarkMode();
};

// applies transitions after page load to prevent light mode styling flashing before dark mode styling is loaded
function applyTransitions() {
    const trans = 'all 0.5s';
    document.getElementById('header').style.transition = trans;
    document.body.style.transition = trans;
    zipInput.style.transition = trans;
    feelingsInput.style.transition = trans;
    generateButton.style.transition = trans;
    document.getElementById('result').style.transition = trans;
};

/* Events */

if(prefersDark === 'enabled') {
    enableDarkMode();
};

generateButton.addEventListener('click', generate);

darkModeButton.addEventListener('click', applyTransitions, {once: true});

darkModeButton.addEventListener('click', toggleTheme);
