let inputBox = document.querySelector("#input-box");
let btn = document.querySelector(".btn");
let msg = document.querySelector(".msg");
let resultBox = document.querySelector(".result-box");
let suggestions = document.querySelector("#suggestions");
let idx = -1;
let results = [];
let suggestionsList;
let city_name;
let lattitude;
let longitude;

inputBox.onkeyup = function () {
    suggestions.innerHTML = ""
    let input = inputBox.value;
    if (input.length) {
        results = cities.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
        for (let city of results) {
            suggestions.innerHTML += `<li onclick=selectInput(this)>${city}</li>`
        }
        suggestionsList = document.querySelectorAll("li");
    }
}

function selectInput(list) {
    inputBox.value = list.innerHTML;
    suggestions.innerHTML = ""
    suggestionsList = [];
}

document.addEventListener("keyup", async (evt) => {
    if (evt["key"] === "ArrowDown") {
        idx++;
        if (idx > results.length - 1) {
            idx = results.length - 1;
        }
        highlight();
    } else if (evt["key"] === "ArrowUp") {
        idx--;
        if (idx < 0) {
            idx = 0;
        }
        highlight();
    } else if (evt["key"] === "Enter") {
        inputBox.value = results[idx];
        suggestions.innerHTML = "";
        idx = -1;
        console.log(inputBox.value);
        if (inputBox.value === "undefined") {
            inputBox.value = "";
        }
        evt.preventDefault();
        city_name = inputBox.value.toLowerCase();
        console.log(city_name);
        await setCordinates();
        getTempMsg()
        // await getTemp();
    }
    else if (evt["key"] === "Backspace") {
        idx = -1;
    }
})

function highlight() {
    for (option of suggestionsList) {
        option.classList.remove("selected");
        if (results[idx] === option.textContent) {
            option.classList.add("selected");
        }
    }
}

async function getTemp(evt) {
    evt.preventDefault();
    city_name = inputBox.value.toLowerCase();
    console.log(city_name);
    await setCordinates();
    getTempMsg();   
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    city_name = inputBox.value.toLowerCase();
    console.log(city_name);
    await setCordinates();
    getTempMsg();
})

async function setCordinates() {
    let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=b5b6933b71c6021a7637e4abc8a1a5da`);
    let city_Cordi = await response.json();
    console.log(city_Cordi);
    lattitude = city_Cordi[0]["lat"];   //the city_Cordi is of type array. bcoz it generated code like:-
    longitude = city_Cordi[0]["lon"];                                   // [
    //     {

    //     }
    // ]
    //the square brackets represent an array and the curly braces
    //represent an object. Hence, its an array of objects
    console.log(lattitude, longitude);
}

async function getTempMsg() {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=b5b6933b71c6021a7637e4abc8a1a5da`);
    let data = await response.json();
    console.log(data);
    let currTemp = Math.round(data["main"]["temp"] - 273.15);
    let feelsLikeTemp = Math.round(data["main"]["feels_like"] - 273.15);
    let minTemp = Math.round(data["main"]["temp_min"] - 273.15);
    let maxTemp = Math.round(data["main"]["temp_max"] - 273.15);

    msg.innerText = `Current Temperature = ${currTemp} °C
                    Feels Like = ${feelsLikeTemp} °C
                    Min. Temperature = ${minTemp} °C
                    Max. Temperature = ${maxTemp} °C`
}

