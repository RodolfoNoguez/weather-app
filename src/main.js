import './style.css'

async function getweatherlocation(location){
    const apiKey = H3JNKYSNLTQTJBAGA9ZKARAK2;
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
        console.errir('Error fetching weather data:', err);
    }
}



