
const api_key = "0b36dbb17bfa775ceb8149f2441436db";

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

export const url = {
    currentWeather(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial`
    },
    forecast(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial`
    },
    airPollution(lat, lon) {
      return `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`
    },
    reverseGeo(lat, lon) {
      return `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`
    },
    /**
     * @param {string} query Search query e.g.: "London", "New York"
     */
    geo(query) {
      return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
  }