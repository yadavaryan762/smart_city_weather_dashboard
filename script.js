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

// Interactive Features Elements
const themeToggle = document.getElementById('themeToggle');
const historySearch = document.getElementById('historySearch');
const historyFilter = document.getElementById('historyFilter');
const historySort = document.getElementById('historySort');
const historyList = document.getElementById('historyList');
const avgTempDisplay = document.getElementById('avgTempDisplay');

let weatherHistory = [];

// Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }
});

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

    // Add to history and update interactive elements
    addToHistory(data);
}

// Function to manage adding cities to the history
function addToHistory(data) {
    const temp = Math.round(data.main.temp);
    
    // Using Array Higher-Order Function: findIndex
    const existingIndex = weatherHistory.findIndex(item => item.name.toLowerCase() === data.name.toLowerCase());
    
    if (existingIndex !== -1) {
        weatherHistory[existingIndex] = { 
            ...weatherHistory[existingIndex], 
            temp, 
            condition: data.weather[0].description 
        };
    } else {
        weatherHistory.push({
            id: Date.now(),
            name: data.name,
            temp: temp,
            condition: data.weather[0].description,
            favorite: false
        });
    }
    
    renderHistory();
}

// Function to render, sort, search and filter the history panel
function renderHistory() {
    let processedHistory = weatherHistory;
    
    // 1. Searching using HOF: filter
    const searchKeyword = historySearch.value.toLowerCase().trim();
    if (searchKeyword) {
        processedHistory = processedHistory.filter(item => 
            item.name.toLowerCase().includes(searchKeyword) || 
            item.condition.toLowerCase().includes(searchKeyword)
        );
    }
    
    // 2. Filtering using HOF: filter
    const filterValue = historyFilter.value;
    if (filterValue === 'cold') {
        processedHistory = processedHistory.filter(item => item.temp < 10);
    } else if (filterValue === 'hot') {
        processedHistory = processedHistory.filter(item => item.temp > 30);
    } else if (filterValue === 'moderate') {
        processedHistory = processedHistory.filter(item => item.temp >= 10 && item.temp <= 30);
    }
    
    // 3. Sorting using HOF: sort
    let sortedHistory = [...processedHistory]; // copy to safely sort
    const sortValue = historySort.value;
    
    if (sortValue === 'temp-asc') {
        sortedHistory.sort((a, b) => a.temp - b.temp);
    } else if (sortValue === 'temp-desc') {
        sortedHistory.sort((a, b) => b.temp - a.temp);
    } else if (sortValue === 'name-asc') {
        sortedHistory.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // 4. Rendering using HOF: map
    historyList.innerHTML = sortedHistory.map(item => `
        <div class="history-card ${item.favorite ? 'favorite-card' : ''}">
            <div class="history-info">
                <strong>${item.name}</strong>
                <p>${item.temp}°C - ${item.condition}</p>
            </div>
            <div class="history-actions">
                <button onclick="toggleFavorite(${item.id})" class="icon-btn" title="Favorite">${item.favorite ? '❤️' : '🤍'}</button>
                <button onclick="deleteHistory(${item.id})" class="icon-btn" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
    
    // 5. Calculate average via HOF: reduce
    if (sortedHistory.length > 0) {
        const totalTemp = sortedHistory.reduce((acc, curr) => acc + curr.temp, 0);
        const avgTemp = (totalTemp / sortedHistory.length).toFixed(1);
        avgTempDisplay.textContent = `Average Temperature: ${avgTemp}°C`;
    } else {
        avgTempDisplay.textContent = '';
    }
}

// Button Interactions (Favorite and Delete handlers)
window.toggleFavorite = function(id) {
    // HOF: find
    const item = weatherHistory.find(i => i.id === id);
    if (item) {
        item.favorite = !item.favorite;
        renderHistory();
    }
};

window.deleteHistory = function(id) {
    // HOF: filter
    weatherHistory = weatherHistory.filter(i => i.id !== id);
    renderHistory();
};

// Listen to control changes
historySearch.addEventListener('input', renderHistory);
historyFilter.addEventListener('change', renderHistory);
historySort.addEventListener('change', renderHistory);

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
