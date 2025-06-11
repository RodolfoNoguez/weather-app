import './style.css'

async function getweatherlocation(location){
    const apiKey = 'H3JNKYSNLTQTJBAGA9ZKARAK2';
    const locationToFind = location;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationToFind}?key=${apiKey}&unitGroup=metric`;
    try{
        const response = await fetch(url);
        const data = await response.json();

        if(!response.ok){
            throw new Error(data.error || data.details || `Weather data not found for "${location}"`)
        }

        return data;
    }catch(err){
        console.error('Error fetching weather data:', err);
    }
}



function displayWeather(data){
    const weatherContainer = document.getElementById('weather-container');
    
    const celsius = data.currentConditions.temp;
    const fahrenheit = (celsius * 9/5) + 32;

    const html = `
        <div class="weather-card">
            <img 
                src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Monochrome/${data.currentConditions.icon}.png" 
                alt="${data.currentConditions.conditions}"
                class="weather-icon"
                onerror="this.src='https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Monochrome/clear-day.png'"
            >
            <h2>${data.resolvedAddress}</h2>
            <div class="weather-info">
                <p class="temperature">
                    ${celsius.toFixed(1)}°C / ${fahrenheit.toFixed(1)}°F
                </p>
                <p class="conditions">${data.currentConditions.conditions}</p>
                <div class="details">
                    <p>Humidity: ${data.currentConditions.humidity}%</p>
                    <p>Wind Speed: ${data.currentConditions.windspeed} km/h</p>
                </div>
            </div>
        </div>
    `;
    
    weatherContainer.innerHTML = html;
}

function debounce(func,wait){
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('form');
    const locationInput = document.getElementById('city-input');
    const weatherContainer = document.getElementById('weather-container');

    weatherForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const location = locationInput.value.trim();
        if (!location) {
            weatherContainer.innerHTML = '<p class="error">Please enter a location</p>';
            return;
        }

        try {
            weatherContainer.innerHTML = '<p class="loading">Loading...</p>';
            
            const weatherData = await getweatherlocation(location);
            displayWeather(weatherData);

            saveRecentSearch(location);
        } catch (error) {
            weatherContainer.innerHTML = `<p class="error">${error.message}</p>`;
        }
    });

    locationInput.addEventListener('input', debounce((e) => {
        const value = e.target.value.trim();
        if (value.length < 2) return;
        
      
        if (/[<>]/.test(value)) {
            locationInput.setCustomValidity('Please enter a valid location name');
        } else {
            locationInput.setCustomValidity('');
        }
    }, 300));
});


function saveRecentSearch(location) {
    try {
        const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (!searches.includes(location)) {
            searches.unshift(location);
            if (searches.length > 5) searches.pop();
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        }
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}