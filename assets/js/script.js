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
        updateContainers(weatherData);
    });
}

var updateContainers = function (weatherData) {
    console.log(weatherData);
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
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latLon.lat}&lon=${latLon.lon}&appid=${appId}`;
    
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