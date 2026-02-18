import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const getMealsByArea = async (area: string) => {
  return axios.get(`${BASE_URL}/filter.php`, {
    params: { a: area }
  });
};

export const getMealById = async (id: string) => {
  return axios.get(`${BASE_URL}/lookup.php`, {
    params: { i: id }
  });
};
