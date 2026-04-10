const API_KEY = 'ee4596ec30de2dfcd65f46f503cd00eb';

let weatherHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];

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

const themeToggle = document.getElementById('themeToggle');
const historySearch = document.getElementById('historySearch');
const historyFilter = document.getElementById('historyFilter');
const historySort = document.getElementById('historySort');
const historyList = document.getElementById('historyList');
const avgTempDisplay = document.getElementById('avgTempDisplay');

function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

function init() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️ Light Mode';
    }
    
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('weatherHistory', JSON.stringify(weatherHistory));
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('darkMode', isDark);
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') fetchWeather(city);
});

cityInput.addEventListener('input', debounce((e) => {
    const city = e.target.value.trim();
    if (city !== '') {
        fetchWeather(city);
    }
}, 800));

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city !== '') {
            fetchWeather(city);
        }
    }
});

historySearch.addEventListener('input', renderHistory);
historyFilter.addEventListener('change', renderHistory);
historySort.addEventListener('change', renderHistory);

async function fetchWeather(city) {
    loadingIndicator.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    errorMessage.classList.add('hidden');

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('City not found. Please try again.');
        }

        const data = await response.json();
        handleWeatherData(data);
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

function handleWeatherData(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const mainCondition = data.weather[0].main.toLowerCase();

    updateWeatherUI(data, temp, description, mainCondition);
    addToHistory(data, temp, description);
}

function updateWeatherUI(data, temp, description, mainCondition) {
    cityNameEl.textContent = data.name;
    temperatureEl.textContent = `Temperature: ${temp}°C`;
    
    const formattedCondition = description.charAt(0).toUpperCase() + description.slice(1);
    conditionEl.textContent = `Condition: ${formattedCondition}`;

    wearSuggestionEl.textContent = getWearSuggestion(temp);
    
    const umbrellaText = getUmbrellaSuggestion(mainCondition, description);
    umbrellaSuggestionEl.textContent = umbrellaText;
    umbrellaSuggestionEl.style.display = umbrellaText ? 'block' : 'none';

    weatherInfo.classList.remove('hidden');
}

function getWearSuggestion(temp) {
    if (temp < 10) return "It's cold out there. Suggest wearing a jacket!";
    if (temp > 30) return "It's quite hot. Suggest wearing light clothes!";
    return "The temperature is moderate. Normal comfortable clothes should be fine.";
}

function getUmbrellaSuggestion(mainCondition, description) {
    if (mainCondition.includes('rain') || description.includes('rain')) {
        return "🌧️ Bring an umbrella!";
    }
    return "";
}

function addToHistory(data, temp, condition) {
    const existingIndex = weatherHistory.findIndex(item => item.name.toLowerCase() === data.name.toLowerCase());
    
    if (existingIndex !== -1) {
        weatherHistory[existingIndex] = { 
            ...weatherHistory[existingIndex], 
            temp, 
            condition
        };
    } else {
        weatherHistory.push({
            id: Date.now(),
            name: data.name,
            temp: temp,
            condition: condition
        });
    }
    
    saveHistory();
    renderHistory();
}

function renderHistory() {
    let processedHistory = weatherHistory;
    
    const searchKeyword = historySearch.value.toLowerCase().trim();
    if (searchKeyword) {
        processedHistory = processedHistory.filter(item => 
            item.name.toLowerCase().includes(searchKeyword) || 
            item.condition.toLowerCase().includes(searchKeyword)
        );
    }
    
    const filterValue = historyFilter.value;
    if (filterValue === 'cold') {
        processedHistory = processedHistory.filter(item => item.temp < 10);
    } else if (filterValue === 'hot') {
        processedHistory = processedHistory.filter(item => item.temp > 30);
    } else if (filterValue === 'moderate') {
        processedHistory = processedHistory.filter(item => item.temp >= 10 && item.temp <= 30);
    }
    
    let sortedHistory = [...processedHistory];
    const sortValue = historySort.value;
    
    if (sortValue === 'temp-asc') {
        sortedHistory.sort((a, b) => a.temp - b.temp);
    } else if (sortValue === 'temp-desc') {
        sortedHistory.sort((a, b) => b.temp - a.temp);
    } else if (sortValue === 'name-asc') {
        sortedHistory.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    historyList.innerHTML = sortedHistory.map(item => `
        <div class="history-card">
            <div class="history-info">
                <strong>${item.name}</strong>
                <p>${item.temp}°C - ${item.condition}</p>
            </div>
            <div class="history-actions">
                <button onclick="deleteHistory(${item.id})" class="icon-btn" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
    
    if (sortedHistory.length > 0) {
        const totalTemp = sortedHistory.reduce((acc, curr) => acc + curr.temp, 0);
        const avgTemp = (totalTemp / sortedHistory.length).toFixed(1);
        avgTempDisplay.textContent = `Average Temperature: ${avgTemp}°C`;
    } else {
        avgTempDisplay.textContent = '';
    }
}

window.deleteHistory = function(id) {
    weatherHistory = weatherHistory.filter(i => i.id !== id);
    saveHistory();
    renderHistory();
};

init();
