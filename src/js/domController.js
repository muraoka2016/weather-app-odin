import { getCitySuggestions, getWeather } from "./weatherAPI.js";

const weatherIcons = {
  "clear-day": new URL("../assets/set2/clear-day.svg", import.meta.url).href,
  "clear-night": new URL("../assets/set2/clear-night.svg", import.meta.url)
    .href,
  cloudy: new URL("../assets/set2/cloudy.svg", import.meta.url).href,
  fog: new URL("../assets/set2/fog.svg", import.meta.url).href,
  hail: new URL("../assets/set2/hail.svg", import.meta.url).href,
  "partly-cloudy-day": new URL(
    "../assets/set2/partly-cloudy-day.svg",
    import.meta.url,
  ).href,
  "partly-cloudy-night": new URL(
    "../assets/set2/partly-cloudy-night.svg",
    import.meta.url,
  ).href,
  "rain-snow-showers-day": new URL(
    "../assets/set2/rain-snow-showers-day.svg",
    import.meta.url,
  ).href,
  "rain-snow-showers-night": new URL(
    "../assets/set2/rain-snow-showers-night.svg",
    import.meta.url,
  ).href,
  "rain-snow": new URL("../assets/set2/rain-snow.svg", import.meta.url).href,
  rain: new URL("../assets/set2/rain.svg", import.meta.url).href,
  "showers-day": new URL("../assets/set2/showers-day.svg", import.meta.url)
    .href,
  "showers-night": new URL("../assets/set2/showers-night.svg", import.meta.url)
    .href,
  sleet: new URL("../assets/set2/sleet.svg", import.meta.url).href,
  "snow-showers-day": new URL(
    "../assets/set2/snow-showers-day.svg",
    import.meta.url,
  ).href,
  "snow-showers-night": new URL(
    "../assets/set2/snow-showers-night.svg",
    import.meta.url,
  ).href,
  snow: new URL("../assets/set2/snow.svg", import.meta.url).href,
  "thunder-rain": new URL("../assets/set2/thunder-rain.svg", import.meta.url)
    .href,
  "thunder-showers-day": new URL(
    "../assets/set2/thunder-showers-day.svg",
    import.meta.url,
  ).href,
  "thunder-showers-night": new URL(
    "../assets/set2/thunder-showers-night.svg",
    import.meta.url,
  ).href,
  thunder: new URL("../assets/set2/thunder.svg", import.meta.url).href,
  wind: new URL("../assets/set2/wind.svg", import.meta.url).href,
};

function debounce(func, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

function formatTemperature(value, unit = "C") {
  return `${Number(value).toFixed(1)}°${unit}`;
}

function createForecastCard(day) {
  const card = createElement("article", "forecast-card");
  const date = new Date(`${day.datetime}T12:00:00`);
  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const icon = createElement("img", "weather-icon forecast-icon");
  icon.src = weatherIcons[day.icon] || weatherIcons["clear-day"];
  icon.alt = day.conditions || "Weather icon";

  card.append(
    createElement("h3", "forecast-date", dateLabel),
    icon,
    createElement("p", "weather-conditions", day.conditions || "Unknown"),
    createElement(
      "p",
      "forecast-temperature",
      `${formatTemperature(day.tempmax)} / ${formatTemperature(day.tempmin)}`,
    ),
    createElement(
      "p",
      "forecast-detail",
      `Humidity: ${Math.round(day.humidity)}%`,
    ),
    createElement(
      "p",
      "forecast-detail",
      `Rain: ${Math.round(day.precipprob)}%`,
    ),
  );

  return card;
}

function renderForecast(container, weatherData) {
  const [currentDay, ...nextDays] = weatherData.days;
  const currentConditions = weatherData.currentConditions || currentDay;
  const card = createElement("article", "weather-result-card");
  const icon = createElement("img", "weather-icon");
  icon.src = weatherIcons[currentDay.icon] || weatherIcons["clear-day"];
  icon.alt = currentDay.conditions || "Weather icon";

  const title = createElement("h2", "result-title", weatherData.resolvedAddress);
  const conditions = createElement(
    "h3",
    "weather-conditions",
    currentDay.conditions || "Unknown",
  );
  const tempDisplay = createElement("p", "temp-display");
  const minMaxDisplay = createElement("p", "min-max-display");
  const feelsLikeDisplay = createElement("p", "feels-like-display");
  const extraInfo = createElement("div", "extra-info-grid");
  const humidityInfo = createElement(
    "span",
    "info-pill",
    `💧 Humidity: ${Math.round(currentConditions.humidity)}%`,
  );
  const precipitationInfo = createElement(
    "span",
    "info-pill",
    `🌧️ Precipitation: ${Math.round(currentConditions.precipprob || 0)}%`,
  );
  extraInfo.append(humidityInfo, precipitationInfo);

  const toggleWrapper = createElement("div", "toggle-wrapper");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "temp-toggle";
  checkbox.className = "visually-hidden";
  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.append(
    createElement("span", "toggle"),
    createElement("span", "toggle-text", "Show in Fahrenheit"),
  );
  toggleWrapper.append(checkbox, label);

  const tempCelsius = Number(currentConditions.temp);
  const feelsLikeCelsius = Number(currentConditions.feelslike);
  const tempMinCelsius = Number(currentDay.tempmin);
  const tempMaxCelsius = Number(currentDay.tempmax);
  const toggleText = label.querySelector(".toggle-text");

  function updateTemperatureDisplay() {
    const unit = checkbox.checked ? "F" : "C";
    const convert = (value) =>
      checkbox.checked ? (value * 9) / 5 + 32 : value;
    tempDisplay.textContent = `Temperature: ${formatTemperature(convert(tempCelsius), unit)}`;
    feelsLikeDisplay.textContent = `Feels Like: ${formatTemperature(convert(feelsLikeCelsius), unit)}`;
    minMaxDisplay.textContent = `Min: ${formatTemperature(convert(tempMinCelsius), unit)} | Max: ${formatTemperature(convert(tempMaxCelsius), unit)}`;
    toggleText.textContent = checkbox.checked
      ? "Show in Celsius"
      : "Show in Fahrenheit";
  }

  checkbox.addEventListener("change", updateTemperatureDisplay);
  updateTemperatureDisplay();

  card.append(
    icon,
    conditions,
    title,
    tempDisplay,
    minMaxDisplay,
    feelsLikeDisplay,
    extraInfo,
    toggleWrapper,
  );

  const forecastGrid = createElement("section", "forecast-grid");
  const forecastTitle = createElement("h2", "forecast-title", "Next 4 days");
  nextDays.slice(0, 4).forEach((day) => forecastGrid.append(createForecastCard(day)));

  container.replaceChildren(card, forecastTitle, forecastGrid);
}

export function initDomController() {
  const form = document.querySelector("form");
  const input = document.getElementById("location-input");
  const datalist = document.getElementById("location-suggestions");
  const container = document.getElementById("container-element");

  //Evento debounce
  let suggestionRequest = 0;
  input.addEventListener(
    "input",
    debounce(async (e) => {
      const query = e.target.value.trim();

      if (query.length < 3) {
        datalist.innerHTML = "";
        return;
      }

      const requestId = ++suggestionRequest;
      try {
        const suggestions = await getCitySuggestions(query);

        if (requestId !== suggestionRequest) return;
        datalist.innerHTML = "";

        suggestions.forEach((city) => {
          const option = document.createElement("option");
          option.value = city;
          datalist.appendChild(option);
        });
      } catch (err) {
        console.error("Erro ao buscar sugestões:", err);
      }
    }, 400),
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;

    container.innerHTML =
      '<div class="spinner" role="status" aria-label="Loading"></div>';

    try {
      const weatherData = await getWeather(city);

      if (weatherData) {
        renderForecast(container, weatherData);
      } else {
        container.textContent = "City not found.";
      }
    } catch (err) {
      container.textContent = "Error finding temperature. Try again.";
    }
  });
}
