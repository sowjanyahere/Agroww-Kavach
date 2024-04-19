document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map and set its view to Malawi's geographical center
    var map = L.map('map').setView([-13.254308, 34.301525], 6);

    // Define the tile layer for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Â© OpenStreetMap contributors'
    }).addTo(map);

    // Set the maximum bounds to restrict the map view to Malawi
    var southWest = L.latLng(-17.129522, 32.670361),
        northEast = L.latLng(-9.367541, 36.073029);
    var bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });

    // Example marker in the center of Malawi
    L.marker([-13.254308, 34.301525]).addTo(map)
        .bindPopup('Center of Malawi');

    // Handle form submission
    // document.getElementById('subscriptionForm').addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     // Show an alert for demonstration purposes
    //     alert('Subscription recorded successfully.');
    // });
});

async function getWeather() {
    const district = document.getElementById('districtSelect').value;
    const apiKey = '2ec0ddb008b44879a4780345e57c7d23'; // Your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${district},MW&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${district},MW&appid=${apiKey}&units=metric`;

    try {
        // Get current weather
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);

        // Get weather forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherInfo').innerText = 'Failed to load weather data.';
    }
}

function displayWeather(data) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    if (data.cod === 200) {
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        
        weatherInfoDiv.innerHTML = `
            <h2>${data.name} Weather</h2>
            <img src="${iconUrl}" alt="Weather icon">
            <p>Temperature: ${data.main.temp} Â°C</p>
            <p>Weather: ${data.weather[0].main} (${data.weather[0].description})</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} meter/sec</p>
        `;
    } else {
        weatherInfoDiv.innerHTML = `<p>Weather data not available for ${data.name}</p>`;
    }
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    if (data.cod === "200") {
        const forecastHTML = data.list.filter((entry, index) => index % 8 === 0).map(entry => {
            const iconCode = entry.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
            const date = new Date(entry.dt * 1000).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
            return `
                <div class="forecast-entry">
                    <img src="${iconUrl}" alt="Weather icon">
                    <p><strong>${date}</strong></p>
                    <p>Temp: ${entry.main.temp} Â°C</p>
                    <p>${entry.weather[0].main}</p>
                </div>
            `;
        }).join('');
        forecastDiv.innerHTML = `<h2>5-Day Forecast</h2><div class="forecast-container">${forecastHTML}</div>`;
    } else {
        forecastDiv.innerHTML = '<p>Forecast data not available</p>';
    }
}


