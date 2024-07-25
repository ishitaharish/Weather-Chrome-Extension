document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", fetchWeather);

    async function fetchWeather() {
        let searchInput = document.getElementById("search").value;
        const weatherDataSection = document.getElementById("weather-data");
        const apiKey = "a0c42bc7ce020c61eb560558e8214d34";

        if (searchInput === "") {
            weatherDataSection.classList.add("show-weather-data");
            weatherDataSection.innerHTML = `
            <div>
              <h2>Empty Input!</h2>
              <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        }

        async function getLonAndLat() {
            const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")}&limit=1&appid=${apiKey}`;
            const response = await fetch(geocodeURL);
            if (!response.ok) {
                console.log("Bad response! ", response.status);
                return;
            }
            const data = await response.json();
            if (data.length === 0) {
                weatherDataSection.classList.add("show-weather-data");
                weatherDataSection.innerHTML = `
                <div>
                  <h2>Invalid Input: "${searchInput}"</h2>
                  <p>Please try again with a valid <u>city name</u>.</p>
                </div>
                `;
                return;
            } else {
                return data[0];
            }
        }

        async function getWeatherData(lon, lat) {
            const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const response = await fetch(weatherURL);
            if (!response.ok) {
                console.log("Bad response! ", response.status);
                return;
            }
            const data = await response.json();

            // Display weather data
            weatherDataSection.classList.add("show-weather-data");
            weatherDataSection.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" />
            <div>
              <h2>${data.name}</h2>
              <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
              <p><strong>Description:</strong> ${data.weather[0].description}</p>
            </div>
            `;
        }

        // Clear search input
        document.getElementById("search").value = "";

        // Get longitude and latitude
        const geocodeData = await getLonAndLat();
        if (geocodeData) {
            // Get and display weather data
            await getWeatherData(geocodeData.lon, geocodeData.lat);
        }
    }
});
