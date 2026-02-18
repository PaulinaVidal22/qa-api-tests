export const weatherSchema = {
  type: "object",
  properties: {
    latitude: { type: "number" },
    longitude: { type: "number" },
    current_weather: {
      type: "object",
      properties: {
        temperature: { type: "number" },
        windspeed: { type: "number" },
        weathercode: { type: "number" }
      },
      required: ["temperature", "windspeed", "weathercode"]
    }
  },
  required: ["latitude", "longitude", "current_weather"]
};
