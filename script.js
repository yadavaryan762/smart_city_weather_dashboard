// OpenWeatherMap API Key
const API_KEY = 'ee4596ec30de2dfcd65f46f503cd00eb';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const weatherInfo = document.getElementById('weather-info');

const cityNameEl = document.getElementById('cityName');
const temperatureEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const wearSuggestionEl = document.getElementById('wearSuggestion');
const umbrellaSuggestionEl = document.getElementById('umbrellaSuggestion');

// Event listeners for fetching weather data
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city !== '') {
            fetchWeather(city);
        }
    }
});

// Function to fetch weather data from API
async function fetchWeather(city) {
    // Show loading state and hide previous results or errors
    loadingIndicator.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    errorMessage.classList.add('hidden');
    
    // Reset background color to default while loading
    document.body.className = 'moderate';

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('City not found. Please try again.');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        // Show error message if API call fails
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        // Always hide the loading state
        loadingIndicator.classList.add('hidden');
    }
}

// Function to handle the display of data
function displayWeather(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const mainCondition = data.weather[0].main.toLowerCase();

    // Populate weather information
    cityNameEl.textContent = data.name;
    temperatureEl.textContent = `Temperature: ${temp}°C`;
    
    // Capitalize first letter of condition description
    const formattedCondition = description.charAt(0).toUpperCase() + description.slice(1);
    conditionEl.textContent = `Condition: ${formattedCondition}`;

    // Show suggestions based on temperature and condition
    wearSuggestionEl.textContent = getWearSuggestion(temp);
    
    // Only show umbrella text if necessary, else clear it
    const umbrellaText = getUmbrellaSuggestion(mainCondition, description);
    umbrellaSuggestionEl.textContent = umbrellaText;
    if (umbrellaText === "") {
        umbrellaSuggestionEl.style.display = 'none';
    } else {
        umbrellaSuggestionEl.style.display = 'block';
    }

    // Update body background color based on temperature
    updateBackground(temp);

    // Finally, reveal the weather info container
    weatherInfo.classList.remove('hidden');
}

// Function to determine clothing suggestions based on temp
function getWearSuggestion(temp) {
    if (temp < 10) {
        return "It's cold out there. Suggest wearing a jacket!";
    } else if (temp > 30) {
        return "It's quite hot. Suggest wearing light clothes!";
    } else {
        return "The temperature is moderate. Normal comfortable clothes should be fine.";
    }
}

// Function to check if it's raining to suggest an umbrella
function getUmbrellaSuggestion(mainCondition, description) {
    if (mainCondition.includes('rain') || description.includes('rain')) {
        return "🌧️ Bring an umbrella!";
    }
    return "";
}

// Update the body class tag to trigger CSS transitions
function updateBackground(temp) {
    if (temp < 10) {
        document.body.className = 'cold';
    } else if (temp > 30) {
        document.body.className = 'hot';
    } else {
        document.body.className = 'moderate';
    }
}
