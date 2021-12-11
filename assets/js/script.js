var getFromLocalStorage = function() {
    var currentHistory = JSON.parse(window.localStorage.getItem("weatherHistory"));
    if (!currentHistory) {
        return [];
    } else {
        return currentHistory;
    }
}

var addToHistory = function (cityName) {
    // add city to localStorage.history
    addToLocalStorage(cityName);
    generateHistoryList();
}

var handleSearchButtonClick = function (event) {
    var cityInput = document.getElementById("cityInput");
    displayCityWeatherData(cityInput.value);
    addToHistory(cityInput.value);
}

var handleHistoryButtonClick = function (event) {
    displayCityWeatherData(event.target.innerHTML);
}

var addToLocalStorage = function (cityName) {
    historyArray.push(cityName);

    if (historyArray.length > 8) {
        historyArray.splice(0, 1);
    }

    window.localStorage.setItem("weatherHistory", JSON.stringify(historyArray));
}

var addHistoryButton = function (cityName) {
    // <button type="button" class="btn btn-primary btn-block" id="searchBtn" onclick="handleSearchButtonClick()">Search</button>

    var historyButton = document.createElement("button");
    historyButton.className = "btn btn-light btn-block";
    historyButton.innerHTML = cityName.toUpperCase();
    historyButton.addEventListener("click", handleHistoryButtonClick);

    var historyList = document.getElementById("history");
    historyList.appendChild(historyButton);
}

var displayCityWeatherData = function (cityName) {
    getLatLon(cityName)
    .then(function(latLon) {
        return getWeatherData(latLon);
    })
    .then(function(weatherData) {
        updateContainers(cityName, weatherData);
    });
}

var updateContainers = function (cityName, weatherData) {
    currentWeather(cityName, weatherData);
    fiveDayWeather(weatherData);
}

var currentWeather = function (cityName, weatherData) {
    var container = document.getElementById("currentWeather");
    container.innerHTML = "";

    var heading = document.createElement("h2");
    var dateString = moment.unix(weatherData.current.dt).format("MM/DD/YYYY");
    heading.innerHTML = `${cityName.toUpperCase()} ${dateString}`;

    var weatherIcon = document.createElement("img");
    weatherIcon.src = weatherIconURL(weatherData.current.weather[0].icon);
    heading.appendChild(weatherIcon);

    var temperature = document.createElement("h4");
    temperature.innerHTML = `Temp: ${weatherData.current.temp}&#xb0;F`;

    var wind = document.createElement("h4");
    wind.innerHTML = `Wind: ${weatherData.current.wind_speed} MPH`;

    var humidity = document.createElement("h4");
    humidity.innerHTML = `Humidity: ${weatherData.current.humidity}%`;

    var uvIndex = document.createElement("h4");
    uvIndex.innerHTML = `UV Index: ${weatherData.current.uvi}`
    
    container.appendChild(heading);
    container.appendChild(temperature);
    container.appendChild(wind);
    container.appendChild(humidity);
    container.appendChild(uvIndex);

}

var weatherIconURL = function(iconCode) {
    // http://openweathermap.org/img/wn/01d.png
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
}

var fiveDayWeather = function (weatherData) {
    var container = document.getElementById("fiveDayForecast");
    container.innerHTML = "";

    var heading = document.createElement("h3");
    heading.innerHTML = "5-Day Forecast:";

    container.appendChild(heading);

    for (i=1; i<6; i++) {
        var card = singleWeatherCard(weatherData.daily[i]);
        container.appendChild(card);
    }
}

var singleWeatherCard = function (weatherData) {
    var card = document.createElement("div");
    card.className = "card text-center";

    var cardBody = document.createElement("div");
    cardBody.className = "card-body";

    var date = document.createElement("h4");
    date.innerHTML = moment.unix(weatherData.dt).format("MM/DD/YYYY");
    date.className = "card-title";

    var icon = document.createElement("img");
    icon.src = weatherIconURL(weatherData.weather[0].icon);

    var temp = document.createElement("h5");
    var tempAverage = getTempAverage(weatherData.temp);
    temp.innerHTML = `Temp: ${tempAverage.toFixed(2)}&#xb0;F`;

    var wind = document.createElement("h5");
    wind.innerHTML = `Wind: ${weatherData.wind_speed} MPH`;

    var humidity = document.createElement("h5");
    humidity.innerHTML = `Humidity: ${weatherData.humidity}%`;

    cardBody.appendChild(date);
    cardBody.appendChild(icon);
    cardBody.appendChild(temp);
    cardBody.appendChild(wind);
    cardBody.appendChild(humidity);

    card.appendChild(cardBody);

    return card;
}

var getTempAverage = function(temp) {
    var { day, eve, morn, night } = temp;
    var sum = day + eve + morn + night;
    return sum / 4;
}

var getLatLon = function(cityName) {
    // api.openweathermap.org/data/2.5/weather?q=portland&appid=e0c1ba6410238103fe2d482d8b1d932f
    var appId = "e0c1ba6410238103fe2d482d8b1d932f"
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appId}`
    return fetch(url)
        .then(function (response) {
            // request was successful
            return response.json();
        })
        .then(function (responseData) {
            return responseData.coord;
        })
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to fetch latitude and longitude data.");
        });
}

var getWeatherData = function(latLon) {
    var appId = "e0c1ba6410238103fe2d482d8b1d932f"
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latLon.lat}&lon=${latLon.lon}&appid=${appId}&units=imperial`;
    
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (responseData) {
            return responseData;
        })
        .catch(function (error) {
            alert("Unable to fetch weather data.")
        })
}

var generateHistoryList = function() {
    var historyList = document.getElementById("history");
    historyList.innerHTML = "";

    for (i=historyArray.length-1;i>=0;i--) {
        addHistoryButton(historyArray[i]);
    }
}

var historyArray = getFromLocalStorage();
generateHistoryList();
