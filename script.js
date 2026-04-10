const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

let savedCities = [];
let currentWeatherData = null;

const themeBtn = document.getElementById("themeBtn");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const saveBtn = document.getElementById("saveBtn");
const loadingText = document.getElementById("loadingText");
const savedCitiesList = document.getElementById("savedCitiesList");

const filterInput = document.getElementById("filterInput");
const sortSelect = document.getElementById("sortSelect");
const filterTempSelect = document.getElementById("filterTempSelect");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeBtn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

function removeCity(name) {

  savedCities = savedCities.filter((c) => c.name !== name);
  renderSavedCities();
}

async function fetchWeather(city) {
  try {
    loadingText.style.display = "block";

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "City not found");
    }

    const data = await response.json();

    currentWeatherData = data;
    updateHeroUI(data);
    saveBtn.style.display = "inline-block";
  } catch (error) {

    alert(error.message);
  } finally {
    loadingText.style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value) fetchWeather(cityInput.value);
});

function updateHeroUI(data) {
  const { temp_c, condition } = data.current;
  const { name, region } = data.location;

  document.getElementById("cityName").innerText = `${name}, ${region}`;
  document.getElementById("temp").innerText = `${temp_c}°C`;
  document.getElementById("desc").innerText = condition.text;
}

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && cityInput.value) fetchWeather(cityInput.value);
});

function renderSavedCities() {
  const searchTerm = filterInput.value.toLowerCase();
  const sortType = sortSelect.value;
  const tempFilter = filterTempSelect.value;

  let processedList = savedCities.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm);
    let matchesTemp = true;

    if (tempFilter === "hot") {
      matchesTemp = city.temp > 25;
    }
    if (tempFilter === "cold") {
      matchesTemp = city.temp < 10;
    }

    return matchesSearch && matchesTemp;
  });

  processedList.sort((a, b) => {
    if (sortType === "name-asc") return a.name > b.name ? 1 : -1;
    if (sortType === "name-desc") return a.name < b.name ? 1 : -1;
    if (sortType === "temp-asc") return a.temp - b.temp;
    if (sortType === "temp-desc") return b.temp - a.temp;
    return 0;
  });

  savedCitiesList.innerHTML = processedList
    .map(
      (city) => `
    <div class="city-card">
      <button class="remove-btn" onclick="removeCity('${city.name}')">X</button>
      <h4>${city.name}</h4>
      <p>${city.temp}°C</p>
      <small>${city.desc}</small>
    </div>
  `,
    )
    .join("");
}

saveBtn.addEventListener("click", () => {
  if (!currentWeatherData) {

    return;
  }

  const cityName = currentWeatherData.location.name;

  const exists = savedCities.find((c) => c.name === cityName);
  if (exists) {

    alert("City already saved!");
    return;
  }

  const newCity = {
    name: cityName,
    temp: currentWeatherData.current.temp_c,
    desc: currentWeatherData.current.condition.text,
  };

  savedCities.push(newCity);

  renderSavedCities();
});

filterInput.addEventListener("input", renderSavedCities);
sortSelect.addEventListener("change", renderSavedCities);
filterTempSelect.addEventListener("change", renderSavedCities);