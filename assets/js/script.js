var handleSearchButtonClick = function (event) {
    var cityInput = document.getElementById("cityInput")
    displayCityWeatherData(cityInput.value)
}

var displayCityWeatherData = function (cityName) {
    getLatLon(cityName);
}

var getLatLon = function(cityName) {
    // api.openweathermap.org/data/2.5/weather?q=portland&appid=e0c1ba6410238103fe2d482d8b1d932f
    var appId = "e0c1ba6410238103fe2d482d8b1d932f"
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appId}`
    fetch(url)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                });
            } else {
                alert('Error: GitHub User Not Found');
            }
        })
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });
}