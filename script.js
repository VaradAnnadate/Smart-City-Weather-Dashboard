const API_KEY = "bf7eb9d0b9064f4c92874102261603";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const loadingText = document.getElementById("loadingText");

async function fetchWeather(city) {
  try {
    loadingText.style.display = "block";

    // console.log("Fetching data for:", city);

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "City not found");
    }

    const data = await response.json();

    // console.log("API Response received:", data);
    // console.log("Temp:", data.current.temp_c);

    updateUI(data);
  } catch (error) {
    // console.error("Fetch error:", error);
    alert(error.message);
  } finally {
    loadingText.style.display = "none";
  }
}

function updateUI(data) {
  const { temp_c, condition } = data.current;
  const { name, region } = data.location;

  document.getElementById("cityName").innerText = `${name}, ${region}`;
  document.getElementById("temp").innerText = `${temp_c}°C`;
  document.getElementById("desc").innerText = condition.text;
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value) {
    fetchWeather(cityInput.value);
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && cityInput.value) {
    fetchWeather(cityInput.value);
  }
});
