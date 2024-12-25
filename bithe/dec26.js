const weatherAPIKey = 'YOUR_API_KEY'; 

function fetchCountryData() {
    const countryName = document.getElementById("countryInput").value.trim();
    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    // Clear previous results
    document.getElementById("countryDetails").innerHTML = "";

    // Fetch country data
    fetch(url)
    .then(response => response.json())
        .then(data => {
            const country = data[0];

            const countryHTML = `
                <div class="col-md-12">
                    <div class="country-card">
                        <h3 class="card-title">${country.name.common}</h3>
                        <img src="${country.flags[0]}" alt="${country.name.common} flag" class="mb-3" />
                        <div class="country-detail">
                            <div class="col-md-6">
                                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                                <p><strong>Population:</strong> ${country.population}</p>
                                <p><strong>Region:</strong> ${country.region}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Subregion:</strong> ${country.subregion ? country.subregion : "N/A"}</p>
                                <p><strong>Languages:</strong> ${Object.values(country.languages).join(", ")}</p>
                                <p><strong>Currencies:</strong> ${Object.values(country.currencies).map(curr => curr.name).join(", ")}</p>
                            </div>
                        </div>
                        <button class="btn btn-info mt-3" onclick="fetchWeatherData('${country.capital ? country.capital[0] : ''}', '${country.name.common}')">More Details</button>
                        <div id="weatherDetails_${country.name.common}" class="weather-details"></div>
                    </div>
                </div>
            `;
            document.getElementById("countryDetails").innerHTML = countryHTML;
        })
        .catch(error => {
            console.error('Error fetching country data:', error);
            document.getElementById("countryDetails").innerHTML = `<p class="text-danger">Sorry, we couldn't find that country. Please try again.</p>`;
        });
}


function fetchWeatherData(city, countryName) {
    if (!city) {
        document.getElementById(`weatherDetails_${countryName}`).innerHTML = `<p class="text-danger">Weather data not available for this country.</p>`;
        return;
    }

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}&units=metric`;

    fetch(weatherURL)
        .then(response => response.json())
        .then(weatherData => {
            const weatherHTML = `
                <h4>Weather in ${city}</h4>
                <p><strong>Temperature:</strong> ${weatherData.main.temp} °C</p>
                <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
            `;
            document.getElementById(`weatherDetails_${countryName}`).innerHTML = weatherHTML;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById(`weatherDetails_${countryName}`).innerHTML = `<p class="text-danger">Sorry, we couldn't fetch weather data. Please try again.</p>`;
        });
}
