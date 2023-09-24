
const api_key = "0b36dbb17bfa775ceb8149f2441436db";
const options = {method: 'GET', headers: {accept: 'application/json'}};
/**
 * Fetch data from server
 * @param {string} URL API url
 * @param {Function} callback callback
 */
export const fetchData = async function (URL) {
  try {
    const response = await fetch(`${URL}&appid=${api_key}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export const fetchDataTomorrow = async function(lat,lon){
  try {
    const response = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&timesteps=1h&units=imperial&apikey=00rFwFMB1rWrDjhX1DPgv6IMZIDBrPYN`,options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export const fetchDataTomorrowDaily = async function(lat,lon){
  try {
    const response = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&timesteps=1d&units=imperial&apikey=00rFwFMB1rWrDjhX1DPgv6IMZIDBrPYN`,options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}


export const url = {
    currentWeather(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial`
    },
    forecast(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial`
    },
    airPollution(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`
    },
    reverseGeo(lat, lon) {
      return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`
    },

    /**
     * @param {string} query Search query e.g.: "London", "New York"
     */
    geo(query) {
      return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
  }