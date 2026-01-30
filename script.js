const weatherBox = document.getElementById("weather");
const loading = document.getElementById("loading");

/*
  Auto-detect user location when page loads
*/
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => getWeather(pos.coords.latitude, pos.coords.longitude),
      () => weatherBox.innerHTML = "❌ Location permission denied"
    );
  }
};

/*
  Fetch weather using coordinates
*/
async function getWeather(lat, lon) {
  loading.classList.remove("hidden");

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await res.json();
    displayWeather(data.current_weather);
  } catch {
    weatherBox.innerHTML = "❌ Unable to fetch weather";
  } finally {
    loading.classList.add("hidden");
  }
}

/*
  City-based search
*/
async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  loading.classList.remove("hidden");

  try {
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geo.json();
    const { latitude, longitude } = geoData.results[0];
    getWeather(latitude, longitude);
  } catch {
    weatherBox.innerHTML = "❌ City not found";
    loading.classList.add("hidden");
  }
}

/*
  Display weather + icons + background
*/
function displayWeather(w) {
  const code = w.weathercode;
  let icon = "☀️";
  let bg = "sunny";

  if (code >= 1 && code <= 3) {
    icon = "☁️";
    bg = "cloudy";
  } else if (code >= 51 && code <= 67) {
    icon = "🌧️";
    bg = "rainy";
  } else if (code >= 71) {
    icon = "❄️";
    bg = "snowy";
  }

  document.body.className = bg;

  weatherBox.innerHTML = `
    <h2>${icon}</h2>
    <p><strong>🌡 Temp:</strong> ${w.temperature}°C</p>
    <p><strong>💨 Wind:</strong> ${w.windspeed} km/h</p>
    <p><strong>🧭 Direction:</strong> ${w.winddirection}°</p>
    <p><strong>⏰ Time:</strong> ${w.time}</p>
  `;
}
