export async function getWeather(city) {
  const formatedEntry = city.trim();
  const apikey = process.env.WEATHER_API_KEY;

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(formatedEntry)}?key=${apikey}&unitGroup=metric&include=current,days,hours&forecastdays=5`;

  const answer = await fetch(url);

  if (!answer.ok) {
    throw new Error(`Error in requisition ${answer.status}`);
  }

  const data = await answer.json();

  if (!data.address || !Array.isArray(data.days)) {
    return null;
  }

  return data;
}

export async function getCitySuggestions(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const answer = await fetch(url);

  if (!answer.ok) {
    throw new Error(`Error in city search ${answer.status}`);
  }

  const data = await answer.json();
  return (data.results || []).map((city) =>
    [city.name, city.admin1, city.country].filter(Boolean).join(", "),
  );
}
