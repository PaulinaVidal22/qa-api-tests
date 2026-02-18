import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const getCurrentWeather = async (
  latitude: number,
  longitude: number
) => {
  return axios.get(BASE_URL, {
    params: {
      latitude,
      longitude,
      current_weather: true
    }
  });
};
