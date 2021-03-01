let geoAccess = false;
let lat = "55";
let lon = "37";
const text = document.getElementById("text");
const addBtn = document.getElementById("addBtn");
const cards = document.getElementById("cards");
let data1 = '';

var makeElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) {
        element.classList.add(className);
    }
    if (text) {
        element.textContent = text;
    }
    if (className == "btn" && text == "✕") {
        element.onclick = removeCard;
    }
    return element;
};

function hideGeoAsk() {
    let geoAsk = document.getElementById("geo_ask");
    geoAsk.style.transform = 'translate(-350px,0)';
}

function success(position) {
    var latitude = position.coords.latitude; // широта
    var longitude = position.coords.longitude; // долгота
    lat = latitude;
    lon = longitude;
}
// Обработка ошибок
function error(errorCode) {
    var msg = "";
    switch (errorCode) {
        case 1: msg = "Нет разрешения"; // Пользователь не дал разрешения на определение местоположения
            break;
        case 2: msg = "Техническая ошибка";
            break;
        case 3: msg = "Превышено время ожидания";
            break;
        default: msg = "Что то случилось не так";
    }
    alert(msg);
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
}

function getWeatherAPI(city="") {
    if (city) {
    }
    else {
        let loader = document.getElementById('loader');
        loader.style.display = 'block';


        let queryWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=a079906fe74d05d272d283d1f9b625de';

        fetch(queryWeather)
            .then(function (resp) { return resp.json() })
            .then(function (data) {
                console.log(data);

                document.querySelector('.mainCity').innerHTML = data.name;
                document.querySelector('.mainTemp').innerHTML = Math.round(data.main.temp - 273) + '&deg;C';
                const iconSrc = "https://openweathermap.org/img/wn/" + data.weather[0]['icon'] + "@2x.png";
                let icon = document.querySelector('.bigIcon');
                icon.src = iconSrc;//иконка
                document.querySelector('.wind').textContent = "Скорость: " + data.wind.speed + ", градусы: " + data.wind.deg;
                document.querySelector('.clouds').textContent = data.weather[0]['description'];
                document.querySelector('.pressure').textContent = data.main.pressure;
                document.querySelector('.humidity').textContent = data.main.humidity;
                document.querySelector('.coords').innerHTML = "[" + data.coord.lat + ", " + data.coord.lon + "]";

                
                loader.style.display = 'none';


            })
            .catch(function (err) {
                alert(err);
            });
    }
}

getWeatherAPI();

function agreeGeo() {
    geoAccess = true;
    hideGeoAsk();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    }
    getWeatherAPI();
}

function updateGeolocation() {
    if (geoAccess) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }
        getWeatherAPI();
    }
}

function declineGeo() {
    hideGeoAsk();
}

function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        if (keys[i] != 'citiesCount') {
            const retrievedCity = localStorage.getItem(keys[i])
            let cityJSON = JSON.parse(retrievedCity);
            let cityName = cityJSON.city;

            values.push(cityName);
        }
        
    }

    return values;
}



function addCityToLocalStorage(cityNumber, cityName) {
    let jsonMessage = { city: cityName };
    let json = JSON.stringify(jsonMessage);
    localStorage.setItem(cityNumber, json);
   
    
}

function getCityNumber(cityName){
    const allCities = allStorage();
    
    if (allCities.indexOf(cityName) == -1) {
        let counter = localStorage.getItem('citiesCount');
        if (counter == null) {
            counter = 0;
        }
        localStorage.setItem('citiesCount', ++counter);
        let cityNumber = 'cityN' + counter;
        return cityNumber;
    }
}

async function makeRequest(queryWeather) {
    try {
        let response = await fetch(queryWeather);
        return response;
    }
    catch (error) {
        alert(error);
    }
}

async function getResponse(response) {
    try {
        let data = await response.json();
        return data;
    }
    catch (error) {
        alert(error);
    }
}

function createCityCard(cityName, cityNumber) {
    let loader = document.getElementById('loader');
    loader.style.display = 'block';



    let queryWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=a079906fe74d05d272d283d1f9b625de';

        

    let cityCard = makeElement('li', 'card', "");
    let mainLine = makeElement('div', 'mainLine', "");
        let name = makeElement('h3', '', cityName);
        let temp = makeElement('h4', '', '');
        let icon = makeElement('img', 'smallIcon', "");
        let button = makeElement('button', 'btn', "✕");
        

        let params = makeElement('ul', 'params', "");

        let line1 = makeElement('li', 'line', "");
        let indic1 = makeElement('p', 'indics', "Ветер");
        let val1 = makeElement('p', 'vals',  '');
        

        let line2 = makeElement('li', 'line', "");
        let indic2 = makeElement('p', 'indics', "Погода");
        let val2 = makeElement('p', 'vals', '');
        
        let line3 = makeElement('li', 'line', "");
        let indic3 = makeElement('p', 'indics', "Давление");
        let val3 = makeElement('p', 'vals', '');
        

        let line4 = makeElement('li', 'line', "");
        let indic4 = makeElement('p', 'indics', "Влажность");
        let val4 = makeElement('p', 'vals', '');
       

        let line5 = makeElement('li', 'line', "");
        let indic5 = makeElement('p', 'indics', "Координаты");
        let val5 = makeElement('p', 'vals', '');
        
    
    fetch(queryWeather)
        .then(function (resp) { return resp.json() })
        .then(function (data) {
            console.log(data);
                temp.textContent = Math.round(data.main.temp - 273) + '°C';
                icon.src = "https://openweathermap.org/img/wn/" + data.weather[0]['icon'] + "@2x.png";
                val1.textContent = "Скорость: " + data.wind.speed + ", градусы: " + data.wind.deg;
                val2.textContent = "" + data.weather[0]['description'];
                val3.textContent = "" + data.main.pressure;
                val4.textContent = "" + data.main.humidity;
                val5.textContent = "[" + data.coord.lat + ", " + data.coord.lon + "]";

        })
        .catch(function (err) {
            console.error("Unknown city");
            text.value = '';
            button.disabled = true;
            loader.style.display = 'none';

            return;
        });

        mainLine.appendChild(name);
        mainLine.appendChild(temp);
        mainLine.appendChild(icon);
        mainLine.appendChild(button);
        cityCard.appendChild(mainLine);
        line1.appendChild(indic1);
        line1.appendChild(val1);
        line2.appendChild(indic2);
        line2.appendChild(val2);
        line3.appendChild(indic3);
        line3.appendChild(val3);
        line4.appendChild(indic4);
        line4.appendChild(val4);
        line5.appendChild(indic5);
        line5.appendChild(val5);

        params.appendChild(line1);
        params.appendChild(line2);
        params.appendChild(line3);
        params.appendChild(line4);
        params.appendChild(line5);
        cityCard.appendChild(params);

        cityCard.id = cityNumber;
        return cityCard;

        
    loader.style.display = 'none';


        
    
}

function addCity() {
    const cityName = text.value;
    const cityNumber = getCityNumber(cityName);
    
    let city = createCityCard(cityName, cityNumber);
    if (city) {
        cards.appendChild(city);
        addCityToLocalStorage(cityNumber, cityName);
    }
    else {
        alert("Unknown City");
        
    }

    
    text.value = "";
    addBtn.disabled = true;

}

function defineKey(cityName) {

    let keys = Object.keys(localStorage),
        i = keys.length;
    
    while (i--) {
        const retrievedCity = localStorage.getItem(keys[i])
        let cityJSON = JSON.parse(retrievedCity);
        let name = cityJSON.city;
        if (name == cityName) {
            return keys[i];
        }
    }
}

function showFavorites() {
    const allCities = allStorage();
    let i = allCities.length;
    
    while (i--) {
        const name = allCities[i];
        const cityNumber = defineKey(name);
        let cityCard = createCityCard(allCities[i], cityNumber);
        if (cityCard) {
            cards.appendChild(cityCard);
        }

        
    }

}

showFavorites();

text.oninput = function () {
    addBtn.disabled = false;
    if (text.value == '') {
        addBtn.disabled = true;
    }
};

    function removeCard() {
        let line = this.parentElement;
        let card = line.parentElement;
        localStorage.removeItem(card.id);
        card.remove();
}

