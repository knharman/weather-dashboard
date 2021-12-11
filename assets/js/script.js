var handleSearchButtonClick = function (event) {
    var cityInput = document.getElementById("cityInput")
    displayCityWeatherData(cityInput.value)
}

var displayCityWeatherData = async function (cityName) {
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
    console.log(weatherData);
    var container = document.getElementById("currentWeather");

    var heading = document.createElement("h2");
    heading.innerHTML = `${cityName} ${weatherData.current.dt} ${weatherData.current.weather[0].main}`;

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

var fiveDayWeather = function (weatherData) {

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