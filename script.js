
let temperature = document.getElementById("temperature");
let condition = document.getElementById("condition");
let humidity = document.getElementById("humidity");
let windSpeed = document.getElementById("windSpeed");

let cityInput = document.getElementById("city");
let searchBtn = document.getElementById("search-btn");
let cityName = document.getElementById("cityName");
let forecast = document.getElementById("forecast");
let locationBtn = document.getElementById("location-btn");
let darkModeBtn = document.getElementById("dark-mode-btn");


// Replace this with your regenerated OpenWeather API key
let API_KEY = "4228b6b640d7098a87200d3cd73e4319";

// Get the 5-day weather forecast
function getForecast(city) {
    forecast.innerHTML = "<p>Loading forecast...</p>";

    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    )
        .then(async function (response) {
            let data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Forecast unavailable");
            }

            return data;
        })
        .then(function (data) {
            forecast.innerHTML = "";

            let dailyForecast = {};

            data.list.forEach(function (item) {
                let date = item.dt_txt.split(" ")[0];

                if (!dailyForecast[date]) {
                    dailyForecast[date] = item;
                }
            });

            Object.values(dailyForecast)
                .slice(0, 5)
                .forEach(function (item) {
                    let date = new Date(item.dt_txt);
                    let day = date.toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric"
                    });

                    let icon = item.weather[0].icon;
                    let description = item.weather[0].description;
                    let temp = item.main.temp.toFixed(1);

                    forecast.innerHTML += `
                        <div class="forecast-card">
                            <p>${day}</p>
                            <img
                                src="https://openweathermap.org/img/wn/${icon}@2x.png"
                                alt="${description}"
                            >
                            <p>${temp} °C</p>
                            <p>${description}</p>
                        </div>
                    `;
                });
        })
        .catch(function (error) {
            forecast.textContent = error.message;
            console.log("Forecast error:", error.message);
        });
}

// Search for a city and display its current weather
searchBtn.addEventListener("click", function () {
    let city = cityInput.value.trim();

    if (city === "") {
        cityName.textContent = "Please enter a city name";
        return;
    }

    cityName.textContent = "Loading weather...";

    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    )
        .then(async function (response) {
            let data = await response.json();

            if (!response.ok) {
                throw new Error(
                    "Error " + response.status + ": " + data.message
                );
            }

            return data;
        })
        .then(function (data) {
            cityName.textContent = "Weather for " + data.name;
            temperature.textContent = data.main.temp;
            condition.textContent = data.weather[0].description;
            humidity.textContent = data.main.humidity;
            windSpeed.textContent = data.wind.speed;

            // Load forecast for the searched city
            getForecast(data.name);
        })
        .catch(function (error) {
            cityName.textContent = error.message;
            console.log("Weather error:", error.message);
        });
    
locationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
        cityName.textContent = "Geolocation is not supported by your browser.";
        return;
    }

    cityName.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            )
                .then(async function (response) {
                    let data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || "Weather unavailable");
                    }

                    return data;
                })
                .then(function (data) {
                    cityName.textContent = "Weather for " + data.name;
                    temperature.textContent = data.main.temp;
                    condition.textContent = data.weather[0].description;
                    humidity.textContent = data.main.humidity;
                    windSpeed.textContent = data.wind.speed;

                    getForecast(data.name);
                })
                .catch(function (error) {
                    cityName.textContent = error.message;
                });
        },
        function (error) {
            cityName.textContent =
                error.code === 1
                    ? "Location permission denied."
                    : "Unable to get your location. Please try again.";
        }
    );
});

});

darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️ Light Mode";
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
    }
});
