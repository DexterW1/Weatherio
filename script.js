//================= Imports =================================
import { fetchData, fetchDataTomorrow, fetchDataTomorrowDaily, url } from "./fetchurl.js";

//============== GLOBAL FUNCTIONS =================
function grabDayAbrev(){
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    const currentDay = daysOfWeek[dayOfWeek];
    return currentDay;
}
function getDayAbbreviationFromTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const dayOfWeek = date.getDay();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayAbbreviation = daysOfWeek[dayOfWeek];
    return dayAbbreviation;
}
function grabDay(){
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[dayOfWeek];
    return currentDay;
}
function grabNowDate(){
    const currentDate = new Date();
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const formattedDate = `${grabDay()}, ${day} ${month}`;
    return formattedDate;
}
function timeUnix(timestamp){
    const date = new Date(timestamp * 1000);
    const originalHours = date.getHours();
    const hours = originalHours % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zeros
    const ampm = originalHours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
}
function timeUnixHr(datestring){
  const date = new Date(datestring);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  const formattedTime = `${formattedHours} ${ampm}`;
  return formattedTime;
}
function unixDayMonth(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];
    return `${day} ${month}`;
}
function grabCurrentWeather(data){
    return data.timelines.hourly[0].values.temperature;
}
// ============= Search Input Code ==================

const searchText = document.querySelector('.search-container #search');
const autocompleteList = document.querySelector('.autocomplete-result #autocomplete-list');
const displayResult = document.querySelector('.autocomplete-result');
searchText.addEventListener('input',async ()=>{
    displayResult.style.display='block';
    let geoLocation = await fetchData(url.geo(searchText.value));
    autocompleteList.innerHTML='';
    for(let location of geoLocation){
        const li=document.createElement('li');
        if(location.state===undefined){
            const cityName = `${location.name}, ${location.country}`;
            li.className = 'clickId';
            li.innerHTML = cityName;
            li.setAttribute('data-lat', location.lat);
            li.setAttribute('data-lon', location.lon);
            li.addEventListener('click', () => {
                searchText.value=li.textContent;
                displayResult.style.display='none';
                updateAll(li.getAttribute('data-lat'),li.getAttribute('data-lon'));
            });
        }
        else{
            const cityName = `${location.name}, ${location.state}, ${location.country}`;
            li.className='clickId';
            li.innerHTML=cityName;
            li.setAttribute('data-lat', location.lat);
            li.setAttribute('data-lon', location.lon);
            li.addEventListener('click', () => {
                searchText.value=li.textContent;
                displayResult.style.display='none';
                updateAll(li.getAttribute('data-lat'),li.getAttribute('data-lon'));
            });
        }
        autocompleteList.appendChild(li);
    }
});
//================================ My-location ========================================
const mylocationBtn = document.querySelector('.current-location');
mylocationBtn.addEventListener('click',async()=>{

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            updateAll(lat,lon);
        }, (error) => {
            console.error('Error getting location:', error);
        });
    } else {
        console.error('Geolocation is not available in this browser.');
    }
});

//============================== Update Functions =====================================
async function updateAll(lat,lon){
    const tomorrowWeather = await fetchDataTomorrow(lat,lon);
    const tomorrowWeatherDaily = await fetchDataTomorrowDaily(lat,lon);
    const currWeather = await fetchCurrentWeather(lat,lon);
    const currAirQuality = await fetchAirQuality(lat,lon);
    const currForecast = await fetchForecast(lat,lon);
    updateWeather(currWeather,tomorrowWeather);
    updateAirQuality(currAirQuality);
    updateSunriseSunset(currWeather);
    updateHumPressVisFeel(currWeather);
    updateFiveForecast(currForecast,tomorrowWeatherDaily);
    updateTodayAt(currForecast,tomorrowWeather);
}

function fetchCurrentWeather(lat,lon){
    return fetchData(url.currentWeather(lat,lon));
}
function fetchAirQuality(lat,lon){
    return fetchData(url.airPollution(lat,lon));
}
function fetchForecast(lat,lon){
    return fetchData(url.forecast(lat,lon));
}
function metersToMiles(meters) {
    const metersInAMile = 1609.34; // 1 mile is approximately 1609.34 meters
    return meters / metersInAMile;
}
 
// ================= Update Data Left-Side Now-Container =====================
const descriptionNow = document.querySelector('.left-now-container #weather-descripiton');
const tempNow = document.querySelector('.temp-and-icon #temp');
const dayNow = document.querySelector('.day-container #day');
const imgNow = document.querySelector('.temp-and-icon img');
const locationNow = document.querySelector('.location-container #location');
function updateWeather(data,tomorrowData){
    tempNow.innerHTML=Math.round(grabCurrentWeather(tomorrowData)) + '&degf';
    imgNow.src='images/'+data.weather[0].icon+'.png';
    imgNow.alt=data.weather[0].description;
    descriptionNow.innerHTML=data.weather[0].description
    dayNow.innerHTML= `<ion-icon name="calendar-clear"></ion-icon>` + grabNowDate();
    locationNow.innerHTML='<ion-icon name="location"></ion-icon>'+ data.name + ', '+data.sys.country;
}
//================================ Air Quality ===========================
const airQualityPM = document.querySelector('.info1 .PM25');
const airQualitySO = document.querySelector('.info2 .SO2');
const airQualityNO = document.querySelector('.info3 .NO2');
const airQualityO3 = document.querySelector('.info4 .O3');
const bgColorVariable1 = getComputedStyle(document.documentElement).getPropertyValue('--bg-aqi-1');
const bgColorVariable2 = getComputedStyle(document.documentElement).getPropertyValue('--bg-aqi-2');
const bgColorVariable3 = getComputedStyle(document.documentElement).getPropertyValue('--bg-aqi-3');
const bgColorVariable4 = getComputedStyle(document.documentElement).getPropertyValue('--bg-aqi-4');
const bgColorVariable5 = getComputedStyle(document.documentElement).getPropertyValue('--bg-aqi-5');
const colors = [bgColorVariable1,bgColorVariable2,bgColorVariable3,bgColorVariable4,bgColorVariable5];
const airQualityElement = document.querySelector('.air #air-quality');
const aqiDescription = ['Good','Fair','Moderate','Poor','Very Poor'];
const airQualityText = document.querySelector('.air #air-quality');
function updateAirQuality(data){
    airQualityNO.innerHTML=data.list[0].components.no2;
    airQualityPM.innerHTML=data.list[0].components.pm2_5;
    airQualityO3.innerHTML=data.list[0].components.o3;
    airQualitySO.innerHTML=data.list[0].components.so2;
    airQualityElement.style.backgroundColor = colors[data.list[0].main.aqi-1];
    airQualityText.innerHTML=aqiDescription[data.list[0].main.aqi-1];
}
//================================ Sunrise Sunset ===========================
const sunriseElement = document.querySelector('.info1 .sunrise');
const sunsetElement = document.querySelector('.info2 .sunset');
function updateSunriseSunset(data){
    const sunriseTime = data.sys.sunrise;
    const sunsetTime = data.sys.sunset;
    const resultSunrise = timeUnix(sunriseTime);
    const resultSunset = timeUnix(sunsetTime);
    sunriseElement.innerHTML=resultSunrise;
    sunsetElement.innerHTML=resultSunset;
}

//================================ Humidity,Pressure,Visibility,Feels ===========================
const humidityText = document.querySelector('.humidity .info .info1 .data');
const pressureText = document.querySelector('.pressure .info .info1 .data');
const visibilityText = document.querySelector('.visibility .info .info1 .data');
const feelslikeText = document.querySelector('.feels_like .info .info1 .data');
function updateHumPressVisFeel(data){
    humidityText.innerHTML= data.main.humidity+'%';
    pressureText.innerHTML=data.main.pressure+' hPa';
    visibilityText.innerHTML=Math.round(metersToMiles(data.visibility))+' mi';
    feelslikeText.innerHTML=Math.round(data.main.feels_like) +'&degf';
}
//================================ 5 forecast  ===========================
// Using querySelectorAll to grab all elements with the class "fivecast-temp"
const temperatureElements = document.querySelectorAll('.fivecast-temp');
// Using querySelectorAll to grab all elements with the class "fivecast-date"
const dateElements = document.querySelectorAll('.fivecast-date');
// Using querySelectorAll to grab all elements with the class "fivecast-day"
const dayElements = document.querySelectorAll('.fivecast-day');
const imgElements = document.querySelectorAll('.cast-icon-temp img');
function updateFiveForecast(data,tomorrowData){
    const index = [7,15,23,31,39];
    for(let i of index){
        if(i==7){
            imgElements[0].src='images/'+data.list[i].weather[0].icon+'.png';
            imgElements[0].alt=data.list[i].weather[0].description;
            temperatureElements[0].innerHTML=Math.round(tomorrowData.timelines.daily[1].values.temperatureMax)+'&degf';
            dateElements[0].innerHTML=unixDayMonth(data.list[i].dt);
            dayElements[0].innerHTML=getDayAbbreviationFromTimestamp(data.list[i].dt);
        }
        else if(i==15){
            imgElements[1].src='images/'+data.list[i].weather[0].icon+'.png';
            imgElements[1].alt=data.list[i].weather[0].description;
            temperatureElements[1].innerHTML=Math.round(tomorrowData.timelines.daily[2].values.temperatureMax)+'&degf';
            dateElements[1].innerHTML=unixDayMonth(data.list[i].dt);
            dayElements[1].innerHTML=getDayAbbreviationFromTimestamp(data.list[i].dt);
        }
        else if(i==23){
            imgElements[2].src='images/'+data.list[i].weather[0].icon+'.png';
            imgElements[2].alt=data.list[i].weather[0].description;
            temperatureElements[2].innerHTML=Math.round(tomorrowData.timelines.daily[3].values.temperatureMax)+'&degf';
            dateElements[2].innerHTML=unixDayMonth(data.list[i].dt);
            dayElements[2].innerHTML=getDayAbbreviationFromTimestamp(data.list[i].dt);
        }
        else if(i==31){
            imgElements[3].src='images/'+data.list[i].weather[0].icon+'.png';
            imgElements[3].alt=data.list[i].weather[0].description;
            temperatureElements[3].innerHTML=Math.round(tomorrowData.timelines.daily[4].values.temperatureMax)+'&degf';
            dateElements[3].innerHTML=unixDayMonth(data.list[i].dt);
            dayElements[3].innerHTML=getDayAbbreviationFromTimestamp(data.list[i].dt);
        }
        else if(i==39){
            imgElements[4].src='images/'+data.list[i].weather[0].icon+'.png';
            imgElements[4].alt=data.list[i].weather[0].description;
            temperatureElements[4].innerHTML=Math.round(tomorrowData.timelines.daily[5].values.temperatureMax)+'&degf';
            dateElements[4].innerHTML=unixDayMonth(data.list[i].dt);
            dayElements[4].innerHTML=getDayAbbreviationFromTimestamp(data.list[i].dt);
        }
    }
}

//================================ Today At ===========================
const todayTimeElement = document.querySelectorAll('.time-card .time');
const todayTempElement = document.querySelectorAll('.time-card .temp');
const todayImgElement = document.querySelectorAll('.time-card img');
function updateTodayAt(imgData,tomorrowData){
    let count =0;
    for(let i =0; i<todayTimeElement.length;i++){
        if(i==0){
            todayTimeElement[i].innerHTML='Now';
            todayImgElement[i].src='images/'+imgData.list[i].weather[0].icon+'.png';
            todayImgElement[i].alt=imgData.list[i].weather[0].description;
            todayTempElement[i].innerHTML=Math.round(tomorrowData.timelines.hourly[count].values.temperature)+'&degf';
            count+=3;
        }
        else{
            todayTimeElement[i].innerHTML=timeUnixHr(tomorrowData.timelines.hourly[count].time);
            todayImgElement[i].src='images/'+imgData.list[i].weather[0].icon+'.png';
            todayImgElement[i].alt=imgData.list[i].weather[0].description;
            todayTempElement[i].innerHTML=Math.round(tomorrowData.timelines.hourly[count].values.temperature)+'&degf';
            count+=3;
        }
    }
}